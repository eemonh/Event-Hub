import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitContact } from "../services/contact";
import toast from "react-hot-toast";
import type { ContactFormData } from "../types";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    subject: z.string().min(3, "Subject must be at least 3 characters"),
    message: z.string().min(10, "Message must be at least 10 characters"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await submitContact(data);
      toast.success("Message sent successfully!");
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  const faqs = [
    { question: "How quickly do you respond to support requests?", answer: "We aim to respond to all inquiries within 24 hours during normal business days. For urgent matters regarding an ongoing event, please use our emergency contact line provided in your organizer dashboard." },
    { question: "Can I update my event details after publishing?", answer: "Yes, you can edit most event details at any time from your dashboard. Changes will reflect instantly on the public event page." },
    { question: "Do you offer custom enterprise solutions?", answer: "Absolutely. We offer tailored packages for large-scale organizations, including dedicated support, custom integrations, and volume pricing." },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans px-4 py-10 sm:py-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight mb-4">Get in Touch</h1>
        <p className="text-base text-slate-500 font-medium">We'd love to hear from you. Please fill out this form or use our contact details below.</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-[2fr_1fr] lg:gap-6 mb-24">
        <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Send us a Message</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Name"
                name="name"
                placeholder="Your Name"
                error={errors.name}
                register={register}
                fullWidth
              />
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="your@email.com"
                error={errors.email}
                register={register}
                fullWidth
              />
            </div>

            <Input
              label="Subject"
              name="subject"
              placeholder="How can we help?"
              error={errors.subject}
              register={register}
              fullWidth
            />

            <Textarea
              label="Message"
              name="message"
              placeholder="Your message here..."
              rows={5}
              error={errors.message}
              register={register}
              fullWidth
            />

            <Button type="submit" size="lg" loading={isSubmitting} showTextWhileLoading fullWidth={false}>Send Message</Button>
          </form>
        </div>

        <div className="flex flex-col gap-5 lg:gap-6">
          <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Contact Information</h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-3 bg-primary/10 rounded-xl text-primary">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Email</h3>
                  <p className="text-sm text-slate-500 mt-0.5">support@eventhub.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-3 bg-primary/10 rounded-xl text-primary">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Phone</h3>
                  <p className="text-sm text-slate-500 mt-0.5">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-3 bg-primary/10 rounded-xl text-primary">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Office</h3>
                  <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">
                    123 Event Street<br />Suite 400<br />San Francisco, CA 94105
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Our Location</h2>
            <div className="relative overflow-hidden rounded-xl bg-[#E8ECEF] h-[200px]">
              <svg className="w-full h-full text-white opacity-90" stroke="currentColor" strokeWidth="4" fill="none">
                <line x1="-20" y1="40" x2="400" y2="280" />
                <line x1="100" y1="-20" x2="300" y2="300" />
                <line x1="250" y1="-20" x2="50" y2="300" />
                <line x1="-20" y1="180" x2="400" y2="80" />
                <circle cx="180" cy="110" r="6" fill="currentColor" stroke="#FFF" strokeWidth="2" />
                <circle cx="100" cy="160" r="4" fill="currentColor" opacity="0.5" stroke="#FFF" strokeWidth="1.5" />
                <circle cx="280" cy="90" r="5" fill="currentColor" opacity="0.5" stroke="#FFF" strokeWidth="1.5" />
              </svg>
              <button className="absolute bottom-3 left-3 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold px-4 py-2 rounded-lg shadow-sm border border-slate-200/80 transition-colors">
                View on Maps
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-10">Frequently Asked Questions</h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white border border-slate-100 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.015)] overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between text-left p-6 font-bold text-slate-800 hover:text-slate-900 focus:outline-none transition-colors"
                >
                  <span className="pr-4">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-40 border-t border-slate-50' : 'max-h-0'
                  }`}
                >
                  <p className="p-6 text-slate-500 leading-relaxed text-sm bg-white">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
