import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    // Validation is handled in contact.controller.js — not in the schema.
    // Schema-level minlength caused Mongoose ValidationErrors that were
    // returning as 500 instead of 400, and rejected legitimate short inputs.
    name:    { type: String, required: [true, "Name is required"],    trim: true },
    email:   { type: String, required: [true, "Email is required"],   trim: true, lowercase: true },
    phone:   { type: String, trim: true },
    subject: { type: String, trim: true },
    message: { type: String, required: [true, "Message is required"], trim: true },
    read:    { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", ContactSchema);
export default Contact;
