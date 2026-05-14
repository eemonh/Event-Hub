// Testimonials.jsx

import React from "react";

const testimonials = [
  {
    id: 1,
    quote:
      "EventHub completely transformed how we organize our local tech meetups. The platform is intuitive and our attendees love the seamless registration process!",
    name: "Sarah Jenkins",
    role: "Community Manager",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
  },
];

export default function Testimonials() {
  return (
    <section className="w-full bg-white py-24">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-16 px-8">
        {/* Heading */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-[36px] font-bold leading-[40px] text-[#111827]">
            What Our Users Say
          </h2>

          <p className="text-[18px] leading-[28px] text-[#6B7280]">
            Discover why people love EventHub for their experiences.
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="flex w-full max-w-[768px] flex-col items-center gap-10">
          <div className="flex w-full flex-col items-center rounded-[8px] border border-[#F3F4F6] bg-white px-16 py-16 shadow-sm">
            {/* Quote */}
            <div className="pb-10 text-center">
              <p className="max-w-[592px] text-[24px] italic leading-[32px] text-[#4B5563]">
                "
                {testimonials[0].quote}
                "
              </p>
            </div>

            {/* User */}
            <div className="flex flex-col items-center gap-4">
              <img
                src={testimonials[0].image}
                alt={testimonials[0].name}
                className="h-16 w-16 rounded-full object-cover"
              />

              <div className="text-center">
                <h4 className="text-[18px] font-bold leading-[28px] text-[#111827]">
                  {testimonials[0].name}
                </h4>

                <p className="text-[14px] leading-[20px] text-[#6B7280]">
                  {testimonials[0].role}
                </p>
              </div>
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex items-center justify-center gap-3">
            <button className="h-3 w-3 rounded-full bg-indigo-500" />

            <button className="h-3 w-3 rounded-full bg-gray-200" />

            <button className="h-3 w-3 rounded-full bg-gray-200" />
          </div>
        </div>
      </div>
    </section>
  );
}