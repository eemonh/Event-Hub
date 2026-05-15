import { Music2, Moon, Briefcase } from "lucide-react"
import SectionHeading from "../ui/SectionHeading"
import { categories } from "../../data/categories"

const iconMap = {
  music: <Music2 className="w-6 h-6 text-white" />,
  moon: <Moon className="w-6 h-6 text-yellow-900" />,
  briefcase: <Briefcase className="w-6 h-6 text-white" />,
}

const CategoriesSection = () => {
  return (
    <section className="w-full bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-8">
        <SectionHeading
          title="Create Unforgettable Event Experiences"
          showDots
          center
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-12">
          {categories.map((item, index) => (
            <div
              key={index}
              className={`${item.bg} rounded-2xl shadow-lg p-6 md:p-8 min-h-[220px] transition-transform duration-300 hover:-translate-y-1`}
            >
              <div
                className={`w-12 h-12 rounded-lg ${item.iconBg} flex items-center justify-center`}
              >
                {iconMap[item.iconName]}
              </div>

              <div className="mt-6">
                <h3
                  className={`text-[20px] leading-7 font-bold ${item.text}`}
                >
                  {item.title}
                </h3>

                <p
                  className={`mt-3 text-sm leading-6 ${item.desc} max-w-[320px]`}
                >
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoriesSection
