import DBConnection from "../configs/DBConnection";
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

const firstMessage = async (req, res) => {
  try {
    const insertedId = await sendFirstMessage(req.body.message);
    req.firstMessageId = insertedId;
    res.status(200).json({ insertedId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "First message failed" });
  }
};
const otherMessages = async (req, res) => {
  try {
    const conversationId = req.firstMessageId;
    console.log("conversationId: ", conversationId);
    if (!conversationId) {
      return res.status(400).json({ error: "First message not send" });
    }
    const message = await sendOtherMessage(req.body.message, conversationId);
    res.status(200).json({ message });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Other messages error" });
  }
};

const sendFirstMessage = async (message) => {
  return new Promise((resolve, reject) => {
    DBConnection.query(
      "insert into contact_messages (id, date_sent, message) values (null,now(),?)",
      [message],
      function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const sendOtherMessage = async (message, conversationId) => {
  return new Promise((resolve, reject) => {
    DBConnection.query(
      "insert into contact_messages (date_sent, message, conversation_id) values (now(), ?, ?)",
      [message, conversationId],
      function (err, result) {
        if (err) {
          console.log("error sendOtherMessages: ", err);
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};
const getMessages = async (req, res) => {
  try {
    const rows = await new Promise((resolve, reject) => {
      DBConnection.query(
        "select * from contact_messages where conversation_id= ?",
        [req.body.conversationId],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.log("get Messages: ", err);
    // Handle the error and send an appropriate response to the client
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = {
  showContactPage: showContactPage,
  sendEmail: sendEmail,
  firstMessage: firstMessage,
  otherMessages: otherMessages,
  getMessages: getMessages,
};
