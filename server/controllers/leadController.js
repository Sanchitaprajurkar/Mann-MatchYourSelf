const Lead = require("../models/Lead");

exports.createLead = async (req, res) => {
  try {
    const { email, phone, preference } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ message: "Provide email or phone" });
    }

    const lead = await Lead.create({
      email,
      phone,
      preference,
    });

    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    console.error("Create lead error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
