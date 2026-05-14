import { ChevronDown } from "lucide-react";

export default function Newsletter() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center px-4">
      <section className="w-full max-w-[1280px] py-24 bg-[#f9fafb]">
        <div className="relative bg-white border-y border-[#f3f4f6] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]">
          
          <div className="max-w-[896px] mx-auto px-6 md:px-16 py-16 md:py-20 flex flex-col items-center gap-4">
            
            {/* Heading */}
            <div className="text-center">
              <h2 className="text-[30px] leading-[36px] font-bold text-[#111827]">
                Stay Event Ready
              </h2>
            </div>

            {/* Description */}
            <p className="text-center text-[18px] leading-[28px] text-[#6b7280] max-w-[650px]">
              Subscribe to our newsletter to receive updates on events based
              on your interests.
            </p>

            {/* Form */}
            <form className="w-full max-w-[672px] pt-4 flex flex-col md:flex-row gap-3">
              
              {/* Email Input */}
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-[50px] px-4 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] text-[16px] outline-none focus:ring-2 focus:ring-indigo-400"
              />

              {/* Select */}
              <div className="relative flex-1">
                <select
                  className="appearance-none w-full h-[50px] px-4 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] text-[16px] text-[#6b7280] outline-none focus:ring-2 focus:ring-indigo-400"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Interest
                  </option>
                  <option>Technology</option>
                  <option>Business</option>
                  <option>Design</option>
                  <option>Marketing</option>
                </select>

                <ChevronDown
                  size={20}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280] pointer-events-none"
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                className="h-[50px] px-8 rounded-lg bg-[#6366f1] text-white text-[16px] font-medium shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] hover:bg-indigo-500 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}