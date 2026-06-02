import { Request, Response } from "express";
import Contact from "../models/Contact.js";
import { sendContactNotification } from "../utils/emailer.js";

export async function submitContact(req: Request, res: Response) {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const contact = await Contact.create({ name, email, subject, message });

  sendContactNotification(contact).catch((err: any) =>
    console.error("Email notification error:", err.message)
  );

  res.status(201).json({ message: "Message sent successfully!" });
}
