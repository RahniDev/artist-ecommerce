import sgMail from '@sendgrid/mail';
export const contact = async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
        const msg = {
            to: process.env.CONTACT_EMAIL || '',
            from: process.env.SENDGRID_VERIFIED_SENDER || '',
            text: message,
            html: ` <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message}</p>`
        };
        await sgMail.send(msg);
        res.json({ success: true, message: "Message sent successfully!" });
    }
    catch (err) {
        console.error("SendGrid error:", err);
        res.status(500).json({ error: "Failed to send message. Please try again later." });
    }
};
