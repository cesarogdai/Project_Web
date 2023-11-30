const nodemailer = require("nodemailer");
let showContactPage = (req, res) => {
  res.render("contact");
};
const sendEmail = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "cuentasfirebase@gmail.com",
        //pass: "cf113207",
        pass: "kxsc limk rxcq sjlp",
      },
    });

    const mailOptions = {
      from: `${email}`,
      to: "cesarogdai01@gmail.com",
      subject: "New Contact Form Submission",
      text: `Nombre: ${name}\n Correo: ${email}\nMensaje: ${message}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
    if (info && info.response.includes("250 2.0.0 OK")) {
      res.json({ status: "success", message: "Email sent successfully" });
    } else {
      res.json({ status: "error", message: "Email not sent" });
    }
  } catch (err) {
    console.log("Error: ", err);
  }
};

module.exports = {
  showContactPage: showContactPage,
  sendEmail: sendEmail,
};
