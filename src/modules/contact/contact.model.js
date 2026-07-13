import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    name:    { type: String, required: [true, "Name is required"], trim: true, minlength: 2 },
    email:   { type: String, required: [true, "Email is required"], trim: true, lowercase: true },
    phone:   { type: String, trim: true },
    subject: { type: String, trim: true },
    message: { type: String, required: [true, "Message is required"], trim: true, minlength: 10 },
    read:    { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", ContactSchema);
export default Contact;
