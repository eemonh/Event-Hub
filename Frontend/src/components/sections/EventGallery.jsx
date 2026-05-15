import SectionHeading from "../ui/SectionHeading"
import { galleryItems } from "../../data/galleryItems"

export default function EventGallery() {
  return (
    <section className="bg-gray-50 py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeading
          title="Event Gallery"
          subtitle="A glimpse into some of our most memorable experiences."
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[250px]">
          {galleryItems.map((item, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-2xl shadow-md ${item.className}`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition duration-500 hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/20 hover:bg-black/30 transition" />

              <div className="absolute bottom-4 left-4">
                <h3 className="text-white text-lg font-semibold">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
