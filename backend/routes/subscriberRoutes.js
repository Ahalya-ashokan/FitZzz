const express = require("express");
const Subscriber = require("../models/Subscriber");

const router = express.Router();

// route=>1: POST  /api/subscribe
// desc: Handle newsletter subscripyion
// access: public

router.post("/", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Check the email is already subscribed
    let subscriber = await Subscriber.findOne({ email });

    if (subscriber) {
      return res.status(400).json({ message: "Email is already subscribed" });
    }

    //Create a new subscriber
    subscriber = new Subscriber({ email });
    await subscriber.save();

    res
      .status(201)
      .json({ message: "Successfully subscribed to the newsletter" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
