const mongoose = require("mongoose");

const siteContentSchema = new mongoose.Schema({
  homeBanner: String,
  loginBanner: String,
  registerBanner: String,
  menCollectionBanner: String,
  womenCollectionBanner: String,
  featuredCollectionBanner: String,
}, { timestamps: true });

module.exports = mongoose.model("SiteContent", siteContentSchema);