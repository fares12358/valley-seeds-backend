import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    brandName:    { type: String, default: "Valley Seeds" },
    primaryColor: { type: String, default: "#037338" },
    accentColor:  { type: String, default: "#96C422" },
    email:        { type: String, default: "info@valley-seeds.com" },
    phone:        { type: String, default: "+20 128 763 6986" },
    whatsapp:     { type: String, default: "+20 128 763 6986" },
    website:      { type: String, default: "www.valley-seeds.com" },
    location:     { type: String, default: "Cairo, Egypt" },
    socialLinks: {
      facebook:  { type: String, default: "" },
      linkedin:  { type: String, default: "" },
      instagram: { type: String, default: "" },
      whatsapp:  { type: String, default: "https://wa.me/201287636986" },
    },
    logoUrl:      { type: String, default: "" },
    logoWhiteUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", SettingsSchema);
export default Settings;
