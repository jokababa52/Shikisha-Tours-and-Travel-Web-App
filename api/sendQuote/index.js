import nodemailer from "nodemailer";

export default async function (context, req) {
  const { name, email, phone, residence, visit, message } = req.body;

  // Create transporter using Zoho SMTP
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 587,
    secure: false,
    auth: {
      user: "info@shikishatoursandtravels.co.ke",
      pass: "YOUR_ZOHO_APP_PASSWORD"
    },
  });

  const mailOptions = {
    from: `"Shikisha Tours Quote Form" <no-reply@shikishatoursandtravels.co.ke>`,
    to: "info@shikishatoursandtravels.co.ke",
    replyTo: email,
    subject: `New Quote Request from ${name}`,
    html: `
      <h2>New Quote Request</h2>
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone}</p>
      <p><b>Residence:</b> ${residence}</p>
      <p><b>Destination:</b> ${visit}</p>
      <p><b>Message:</b><br>${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      status: 200,
      body: JSON.stringify({ success: true, message: "Inquiry sent successfully!" }),
    };
  } catch (error) {
    return {
      status: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
}
