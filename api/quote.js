export async function handler(req, context) {
  try {
    if (req.method !== "POST") {
      return { status: 405, body: "Method Not Allowed" };
    }

    const data = await req.json();

    // Required fields
    if (!data.email || !data.first_name || !data.last_name) {
      return json(400, { error: "Missing required fields" });
    }

    const subdomain = process.env.ZENDESK_SUBDOMAIN;
    const agentEmail = process.env.ZENDESK_EMAIL;
    const apiToken = process.env.ZENDESK_API_TOKEN;

    if (!subdomain || !agentEmail || !apiToken) {
      return json(500, { error: "Zendesk env vars not set" });
    }

    const auth = Buffer.from(`${agentEmail}/token:${apiToken}`).toString("base64");

    const payload = {
      ticket: {
        subject: `New Safari Quote Request — ${data.first_name} ${data.last_name}`,
        comment: { body: buildTicketBody(data) },
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
      return json(502, { error: "Zendesk ticket creation failed", details: zdData });
    }

    return json(200, { ok: true, ticket_id: zdData.ticket.id });

  } catch (err) {
    context.log("Server Error:", err);
    return json(500, { error: "Server error" });
  }
}

function json(status, obj) {
  return {
    status,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj)
  };
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
