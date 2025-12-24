export async function handler(req, context) {
  try {
    if (req.method !== "POST") {
      return { status: 405, body: "Method Not Allowed" };
    }

    const data = await req.json();

    // Basic validation
    if (!data.email || !data.first_name || !data.last_name) {
      return {
        status: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
        headers: { "Content-Type": "application/json" }
      };
    }

    const subdomain = process.env.ZENDESK_SUBDOMAIN; // e.g. "shikisha"
    const agentEmail = process.env.ZENDESK_EMAIL;    // Zendesk admin/agent email
    const apiToken = process.env.ZENDESK_API_TOKEN;  // Zendesk API Token

    if (!subdomain || !agentEmail || !apiToken) {
      return {
        status: 500,
        body: JSON.stringify({ error: "Zendesk env vars not set" }),
        headers: { "Content-Type": "application/json" }
      };
    }

    const auth = Buffer.from(`${agentEmail}/token:${apiToken}`).toString("base64");

    const bodyText = buildTicketBody(data);

    const payload = {
      ticket: {
        subject: `New Safari Quote Request — ${data.first_name} ${data.last_name}`,
        comment: { body: bodyText },
        requester: {
          name: `${data.first_name} ${data.last_name}`,
          email: data.email
        },
        tags: ["website_quote", "safari_enquiry"]
      }
    };

    const zdRes = await fetch(`https://${subdomain}.zendesk.com/api/v2/tickets.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`
      },
      body: JSON.stringify(payload)
    });

    const zdData = await zdRes.json();

    if (!zdRes.ok) {
      context.log("Zendesk Error:", zdData);
      return {
        status: 502,
        body: JSON.stringify({ error: "Zendesk ticket creation failed", details: zdData }),
        headers: { "Content-Type": "application/json" }
      };
    }

    return {
      status: 200,
      body: JSON.stringify({ ok: true, ticket_id: zdData.ticket.id }),
      headers: { "Content-Type": "application/json" }
    };

  } catch (err) {
    context.log("Server Error:", err);
    return {
      status: 500,
      body: JSON.stringify({ error: "Server error" }),
      headers: { "Content-Type": "application/json" }
    };
  }
}

function buildTicketBody(data) {
  return `
NEW QUOTE REQUEST (Website)

DESTINATIONS:
${(data.destinations || []).join(", ") || "—"}

BUDGET PER PERSON:
${data.budget || "—"}

TRAVEL TIMING:
${data.travel_timing || "—"}

ARRIVAL DATE:
${data.arrival_date || "—"}

DEPARTURE DATE:
${data.departure_date || "—"}

MONTH:
${data.month || "—"}

TRIP LENGTH:
${data.trip_length || "—"}

TRAVELLING WITH:
${data.travelling_with || "—"}

SAFARI DETAILS:
${data.safari_details || "—"}

CONTACT:
Name: ${data.first_name} ${data.last_name}
Email: ${data.email}
Country: ${data.country || "—"}
Phone: ${data.phone || "—"}
  `.trim();
}
