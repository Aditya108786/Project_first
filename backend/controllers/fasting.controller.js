//
// controllers/fasting.controller.js
const FastingModel = require('../models/fasting.model')
const getFastingHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const history = await FastingModel.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ data: history });
  } catch (error) {
    console.error("Error fetching fasting history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = getFastingHistory

  