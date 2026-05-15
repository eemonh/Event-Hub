import { ChevronDown } from "lucide-react"
import Button from "../ui/Button"
import SectionHeading from "../ui/SectionHeading"

export default function Newsletter() {
  return (
    <section className="bg-gray-100 py-24">
      <div className="mx-auto max-w-[1280px] px-4">
        <div className="bg-white border-y border-border-light shadow-md">
          <div className="mx-auto flex max-w-[896px] flex-col items-center gap-4 px-6 md:px-16 py-16 md:py-20">
            <SectionHeading
              title="Stay Event Ready"
              subtitle="Subscribe to our newsletter to receive updates on events based on your interests."
            />

            <form className="w-full max-w-[672px] pt-4 flex flex-col md:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-[50px] px-4 rounded-lg border border-gray-200 bg-gray-50 text-base outline-none focus:ring-2 focus:ring-primary/50"
              />

              <div className="relative flex-1">
                <select
                  className="appearance-none w-full h-[50px] px-4 rounded-lg border border-gray-200 bg-gray-50 text-base text-text-muted outline-none focus:ring-2 focus:ring-primary/50"
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                />
              </div>

              <Button type="submit" size="lg">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
