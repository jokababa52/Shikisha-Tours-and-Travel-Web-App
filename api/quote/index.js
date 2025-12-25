module.exports = async function (context, req) {
  try {
    // Handle CORS preflight (optional but recommended)
    if (req.method === "OPTIONS") {
      context.res = {
        status: 204,
        headers: corsHeaders()
      };
      return;
    }

    if (req.method !== "POST") {
      context.res = { status: 405, body: "Method Not Allowed", headers: corsHeaders() };
      return;
    }

    const data = req.body;

    if (!data || !data.email || !data.first_name || !data.last_name) {
      context.res = {
        status: 400,
        headers: { ...corsHeaders(), "Content-Type": "application/json" },
        body: { error: "Missing required fields" }
      };
      return;
    }

    const subdomain = process.env.ZENDESK_SUBDOMAIN;
    const agentEmail = process.env.ZENDESK_EMAIL;
    const apiToken = process.env.ZENDESK_API_TOKEN;

    if (!subdomain || !agentEmail || !apiToken) {
      context.res = {
        status: 500,
        headers: { ...corsHeaders(), "Content-Type": "application/json" },
        body: { error: "Zendesk env vars not set" }
      };
      return;
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
      context.res = {
        status: 502,
        headers: { ...corsHeaders(), "Content-Type": "application/json" },
        body: { error: "Zendesk ticket creation failed", details: zdData }
      };
      return;
    }

    context.res = {
      status: 200,
      headers: { ...corsHeaders(), "Content-Type": "application/json" },
      body: { ok: true, ticket_id: zdData.ticket.id }
    };
  } catch (err) {
    context.log("Function Error:", err);
    context.res = {
      status: 500,
      headers: { ...corsHeaders(), "Content-Type": "application/json" },
      body: { error: "Server error", details: String(err) }
    };
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
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
