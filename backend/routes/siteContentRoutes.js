const express = require("express");
const SiteContent = require("../models/SiteContent");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

//For Frontend
router.get("/", async (req, res) => {
  const content = await SiteContent.findOne();
  res.json(content);
});


//Admin Update

router.put("/", protect, admin, async (req, res) => {
  let content = await SiteContent.findOne();

  if (!content) {
    content = new SiteContent(req.body);
  } else {
    Object.assign(content, req.body);
  }

  const updated = await content.save();
  res.json(updated);
});


module.exports = router;