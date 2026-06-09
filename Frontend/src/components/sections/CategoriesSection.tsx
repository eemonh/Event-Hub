import { useMemo, useRef, useState } from "react"
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Music2,
  Moon,
  Palette,
  Trophy,
  Users,
  Utensils,
} from "lucide-react"
import { Link } from "react-router-dom"
import SectionHeading from "../ui/SectionHeading"
import useCarousel from "../../hooks/useCarousel"

const categories = [
  {
    title: "Music",
    description:
      "Immerse yourself in the rhythm of unforgettable music events.",
    slug: "music",
    eventCount: 12,
    nextEvent: "Fri, 8 PM",
    featuredLabel: "Live sets nearby",
    bg: "bg-blue-500",
    iconBg: "bg-white/20",
    text: "text-white",
    desc: "text-blue-100",
    iconName: "music",
  },
  {
    title: "Nightlife",
    description:
      "Discover the pulse of the city with our vibrant nightlife events.",
    slug: "nightlife",
    eventCount: 8,
    nextEvent: "This weekend",
    featuredLabel: "Late-night picks",
    bg: "bg-yellow-400",
    iconBg: "bg-white/30",
    text: "text-yellow-900",
    desc: "text-yellow-800",
    iconName: "moon",
  },
  {
    title: "Holidays",
    description:
      "Celebrate the joy of the season with unforgettable holiday events.",
    slug: "holidays",
    eventCount: 5,
    nextEvent: "Next Friday",
    featuredLabel: "Seasonal moments",
    bg: "bg-orange-400",
    iconBg: "bg-white/20",
    text: "text-white",
    desc: "text-orange-100",
    iconName: "briefcase",
  },
  {
    title: "Food & Drink",
    description:
      "Taste your way through dinners, markets, and chef-led gatherings.",
    slug: "food-drink",
    eventCount: 9,
    nextEvent: "Sat, 6 PM",
    featuredLabel: "Table-ready plans",
    bg: "bg-emerald-500",
    iconBg: "bg-white/20",
    text: "text-white",
    desc: "text-emerald-100",
    iconName: "utensils",
  },
  {
    title: "Networking",
    description:
      "Meet founders, teams, and communities building what comes next.",
    slug: "networking",
    eventCount: 7,
    nextEvent: "Wed, 5 PM",
    featuredLabel: "People to meet",
    bg: "bg-indigo-500",
    iconBg: "bg-white/20",
    text: "text-white",
    desc: "text-indigo-100",
    iconName: "users",
  },
  {
    title: "Sports",
    description:
      "Find energetic match days, runs, tournaments, and fan experiences.",
    slug: "sports",
    eventCount: 6,
    nextEvent: "Sun, 10 AM",
    featuredLabel: "Game-day energy",
    bg: "bg-rose-500",
    iconBg: "bg-white/20",
    text: "text-white",
    desc: "text-rose-100",
    iconName: "trophy",
  },
  {
    title: "Arts & Culture",
    description:
      "Step into exhibitions, performances, and creative nights around town.",
    slug: "arts-culture",
    eventCount: 10,
    nextEvent: "Thu, 7 PM",
    featuredLabel: "Creative escapes",
    bg: "bg-fuchsia-500",
    iconBg: "bg-white/20",
    text: "text-white",
    desc: "text-fuchsia-100",
    iconName: "palette",
  },
  {
    title: "Workshops",
    description:
      "Learn something useful with hands-on sessions and guided classes.",
    slug: "workshops",
    eventCount: 4,
    nextEvent: "Tue, 4 PM",
    featuredLabel: "Hands-on learning",
    bg: "bg-cyan-600",
    iconBg: "bg-white/20",
    text: "text-white",
    desc: "text-cyan-100",
    iconName: "bookOpen",
  },
]

const iconMap = {
  music: <Music2 className="w-6 h-6 text-white" />,
  moon: <Moon className="w-6 h-6 text-yellow-900" />,
  briefcase: <Briefcase className="w-6 h-6 text-white" />,
  utensils: <Utensils className="w-6 h-6 text-white" />,
  users: <Users className="w-6 h-6 text-white" />,
  trophy: <Trophy className="w-6 h-6 text-white" />,
  palette: <Palette className="w-6 h-6 text-white" />,
  bookOpen: <BookOpen className="w-6 h-6 text-white" />,
}

const MOBILE_PAGE_SIZE = 1
const TABLET_PAGE_SIZE = 2
const DESKTOP_PAGE_SIZE = 3

type CategoryItem = (typeof categories)[number]
type MoreCategoryItem = { slug: string; isMoreCard: true }
type CategoryGridItem = CategoryItem | MoreCategoryItem

const chunkCategories = (items: CategoryItem[], pageSize: number) => {
  return Array.from({ length: Math.ceil(items.length / pageSize) }, (_, index) =>
    items.slice(index * pageSize, index * pageSize + pageSize)
  )
}

const CategoriesSection = () => {
  const mobileScrollRef = useRef<HTMLDivElement | null>(null)
  const tabletScrollRef = useRef<HTMLDivElement | null>(null)
  const mobilePageRefs = useRef<(HTMLElement | null)[]>([])
  const tabletPageRefs = useRef<(HTMLElement | null)[]>([])
  const [activeDesktopPage, setActiveDesktopPage] = useState(0)

  const mobilePages = useMemo(
    () => chunkCategories(categories, MOBILE_PAGE_SIZE),
    []
  )
  const tabletPages = useMemo(
    () => chunkCategories(categories, TABLET_PAGE_SIZE),
    []
  )
  const desktopPages = useMemo(() => {
    const pages: CategoryGridItem[][] = chunkCategories(categories, DESKTOP_PAGE_SIZE)
    const finalPage = pages[pages.length - 1]

    if (finalPage.length < DESKTOP_PAGE_SIZE) {
      return [
        ...pages.slice(0, -1),
        [...finalPage, { slug: "all-events", isMoreCard: true }],
      ]
    }

    return pages
  }, [])

  const mobileCarousel = useCarousel({
    items: mobilePages,
    containerRef: mobileScrollRef,
    itemRefs: mobilePageRefs,
  })

  const tabletCarousel = useCarousel({
    items: tabletPages,
    containerRef: tabletScrollRef,
    itemRefs: tabletPageRefs,
  })

  const goToDesktopPage = (pageIndex: number) => {
    setActiveDesktopPage(
      Math.min(Math.max(pageIndex, 0), desktopPages.length - 1)
    )
  }

  return (
    <section className="w-full bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-8">
        <SectionHeading
          title="Create Unforgettable Event Experiences"
          center
        >
          <PaginationDots
            className="md:hidden"
            pages={mobilePages}
            activePage={mobileCarousel.activeIndex}
            onPageChange={mobileCarousel.scrollTo}
          />

          <PaginationDots
            className="hidden md:flex xl:hidden"
            pages={tabletPages}
            activePage={tabletCarousel.activeIndex}
            onPageChange={tabletCarousel.scrollTo}
          />

          <PaginationDots
            className="hidden xl:flex"
            pages={desktopPages}
            activePage={activeDesktopPage}
            onPageChange={goToDesktopPage}
          />
        </SectionHeading>

        <div
          ref={mobileScrollRef}
          className="-mx-8 mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto px-[max(2rem,calc((100vw-320px)/2))] pb-2 md:hidden"
        >
          {mobilePages.map((page, index) => (
            <div
              key={page[0].slug}
              ref={(pageElement) => {
                mobilePageRefs.current[index] = pageElement
              }}
              className="w-[78vw] max-w-[320px] shrink-0 snap-center"
            >
              <CategoryCard item={page[0]} />
            </div>
          ))}
        </div>

        <div
          ref={tabletScrollRef}
          className="-mx-8 mt-12 hidden snap-x snap-mandatory gap-6 overflow-x-auto px-8 pb-2 md:flex xl:hidden"
        >
          {tabletPages.map((page, index) => (
            <div
              key={page.map((item) => item.slug).join("-")}
              ref={(pageElement) => {
                tabletPageRefs.current[index] = pageElement
              }}
              className="grid w-full shrink-0 snap-center grid-cols-2 gap-6"
            >
              {page.map((item) => (
                <CategoryCard key={item.slug} item={item} />
              ))}
            </div>
          ))}
        </div>

        <div className="group/categories relative mt-12 hidden xl:block">
          <button
            type="button"
            aria-label="Show previous category page"
            disabled={activeDesktopPage === 0}
            onClick={() => goToDesktopPage(activeDesktopPage - 1)}
            className="absolute left-0 top-1/2 z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/50 text-text-primary opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white/80 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-0 group-hover/categories:opacity-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="grid grid-cols-3 gap-8">
            {desktopPages[activeDesktopPage].map((item) =>
              "isMoreCard" in item ? (
                <MoreEventsCard key={item.slug} />
              ) : (
                <CategoryCard key={item.slug} item={item} />
              )
            )}
          </div>

          <button
            type="button"
            aria-label="Show next category page"
            disabled={activeDesktopPage === desktopPages.length - 1}
            onClick={() => goToDesktopPage(activeDesktopPage + 1)}
            className="absolute right-0 top-1/2 z-10 flex h-12 w-12 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/50 text-text-primary opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white/80 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-0 group-hover/categories:opacity-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <p className="mt-5 text-center text-sm font-medium text-text-muted">
            {activeDesktopPage + 1} / {desktopPages.length}
          </p>
        </div>
      </div>
    </section>
  )
}

const PaginationDots = ({
  pages,
  activePage,
  onPageChange,
  className = "",
}: {
  pages: { slug: string }[][]; activePage: number; onPageChange: (page: number) => void; className?: string
}) => {
  return (
    <div
      className={`items-center gap-2 ${className}`}
      aria-label="Category pages"
    >
      {pages.map((_, index) => (
        <button
          key={index}
          type="button"
          aria-label={`Show category page ${index + 1}`}
          aria-current={activePage === index ? "true" : undefined}
          onClick={() => onPageChange(index)}
          className={`h-1 rounded-full transition-all duration-300 ${activePage === index
              ? "w-8 bg-primary"
              : "w-2 bg-gray-300 hover:bg-gray-400"
            }`}
        />
      ))}
    </div>
  )
}

const CategoryCard = ({ item, className = "", refCallback }: {
  item: CategoryItem; className?: string; refCallback?: React.Ref<HTMLAnchorElement>
}) => {
  return (
    <Link
      ref={refCallback}
      to={`/events?category=${item.slug}`}
      aria-label={`Browse ${item.title} events`}
      className={`group flex min-h-[240px] flex-col justify-between rounded-2xl p-6 shadow-lg outline-none transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:ring-4 focus-visible:ring-primary/30 md:p-8 ${item.bg} ${className}`}
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-lg transition-transform duration-300 group-hover:-translate-y-1 ${item.iconBg}`}
          >
            {iconMap[item.iconName as keyof typeof iconMap]}
          </div>

          <span
            className={`rounded-full bg-white/20 px-3 py-1 text-xs font-semibold leading-5 ${item.text}`}
          >
            {item.eventCount} Events
          </span>
        </div>

        <div className="mt-6">
          <h3 className={`text-[20px] font-bold leading-7 ${item.text}`}>
            {item.title}
          </h3>

          <p className={`mt-3 max-w-[320px] text-sm leading-6 ${item.desc}`}>
            {item.description}
          </p>
        </div>
      </div>

      <div className="mt-8 flex items-end justify-between gap-4">
        <div>
          <p className={`text-xs font-semibold uppercase ${item.desc}`}>
            {item.featuredLabel}
          </p>
          <p className={`mt-1 text-sm font-semibold ${item.text}`}>
            Next: {item.nextEvent}
          </p>
        </div>

        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-white/30 ${item.text}`}
          aria-hidden="true"
        >
          <ArrowRight className="h-5 w-5" />
        </span>
      </div>
    </Link>
  )
}

const MoreEventsCard = () => {
  return (
    <Link
      to="/events"
      aria-label="Explore all events"
      className="group flex min-h-[240px] flex-col justify-between rounded-2xl border border-indigo-100 bg-white/80 p-8 shadow-lg outline-none transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl focus-visible:ring-4 focus-visible:ring-primary/30"
    >
      <div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:-translate-y-1">
          <ArrowRight className="h-6 w-6" />
        </div>

        <div className="mt-6">
          <h3 className="text-[20px] font-bold leading-7 text-text-primary">
            Explore All Events
          </h3>

          <p className="mt-3 max-w-[320px] text-sm leading-6 text-text-muted">
            Browse every category and find your next experience.
          </p>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-primary">View all events</p>

        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:translate-x-1 group-hover:bg-primary/15"
          aria-hidden="true"
        >
          <ArrowRight className="h-5 w-5" />
        </span>
      </div>
    </Link>
  )
}

export default CategoriesSection
