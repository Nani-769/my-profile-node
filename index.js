const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
MONGO_URI="mongodb+srv://rellaramu769:Ram45769@ram.uppebt1.mongodb.net/contactdb?retryWrites=true&w=majority&appName=ram"
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB Atlas"))
.catch((err) => console.error("MongoDB connection error:", err));

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "rellaramu769@gmail.com",
    pass: "Ram@845769",
  },
});

app.get('/', (req, res) => {
  res.send('Welcome to the Contact API'); 
}
);
// POST /api/contact route
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // 1. Save to MongoDB
    await Contact.create({ name, email, message });

    // 2. Send email to you
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: "rellaramu1818@gmail.com",
      subject: `New Contact Message from ${name}`,
      text: message,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong><br>${message}</p>`,
    });

    res.status(200).json({ message: "Message sent and saved successfully!" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Failed to send message." });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
