import Card from "../ui/Card"
import SectionHeading from "../ui/SectionHeading"

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
]

export default function Testimonials() {
  return (
    <section className="w-full bg-white py-24">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-16 px-8">
        <SectionHeading
          title="What Our Users Say"
          subtitle="Discover why people love EventHub for their experiences."
        />

        <div className="flex w-full max-w-[768px] flex-col items-center gap-10">
          <Card
            shadow="sm"
            radius="sm"
            className="flex w-full flex-col items-center px-8 md:px-16 py-16"
          >
            <div className="pb-10 text-center">
              <p className="max-w-[592px] text-xl md:text-[24px] italic leading-[32px] text-gray-600">
                &ldquo;{testimonials[0].quote}&rdquo;
              </p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <img
                src={testimonials[0].image}
                alt={testimonials[0].name}
                className="h-16 w-16 rounded-full object-cover"
              />

              <div className="text-center">
                <h4 className="text-lg font-bold leading-7 text-text-primary">
                  {testimonials[0].name}
                </h4>

                <p className="text-sm leading-5 text-text-muted">
                  {testimonials[0].role}
                </p>
              </div>
            </div>
          </Card>

          <div className="flex items-center justify-center gap-3">
            <button className="h-3 w-3 rounded-full bg-primary" />
            <button className="h-3 w-3 rounded-full bg-gray-200" />
            <button className="h-3 w-3 rounded-full bg-gray-200" />
          </div>
        </div>
      </div>
    </section>
  )
}
