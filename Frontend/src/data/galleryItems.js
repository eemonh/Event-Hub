const cloudinaryFetchBase =
  "https://res.cloudinary.com/demo/image/fetch/f_auto,q_auto,w_1400"

export const galleryItems = [
  {
    id: "indie-night-live",
    title: "Indie Night Live",
    category: "Concerts",
    location: "Warehouse Stage, New York",
    date: "April 2026",
    image:
      `${cloudinaryFetchBase}/https://images.unsplash.com/photo-1501386761578-eac5c94b800a`,
    alt: "Crowd cheering under purple stage lights at an indoor concert hosted by Event Hub",
    featured: true,
    summary:
      "A packed live music night with local bands, food stalls, and a closing set that kept the room moving past midnight.",
  },
  {
    id: "founders-table",
    title: "Founders Table",
    category: "Networking",
    location: "Civic Loft, New York",
    date: "March 2026",
    image:
      `${cloudinaryFetchBase}/https://images.unsplash.com/photo-1521737711867-e3b97375f902`,
    alt: "Professionals talking around a table during a hosted networking event",
    featured: false,
    summary:
      "An invite-only evening for founders, operators, and investors built around short talks and meaningful introductions.",
  },
  {
    id: "product-craft-summit",
    title: "Product Craft Summit",
    category: "Conferences",
    location: "Pier 59 Studios, New York",
    date: "February 2026",
    image:
      `${cloudinaryFetchBase}/https://images.unsplash.com/photo-1540575467063-178a50c2df87`,
    alt: "Conference audience seated in front of a lit stage during a hosted summit",
    featured: false,
    summary:
      "A one-day conference for product teams with keynote sessions, hands-on breakouts, and a closing reception.",
  },
  {
    id: "summer-sound-festival",
    title: "Summer Sound Festival",
    category: "Festivals",
    location: "Riverside Park, Brooklyn",
    date: "August 2025",
    image:
      `${cloudinaryFetchBase}/https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f`,
    alt: "Festival crowd with raised hands watching a performer on an outdoor stage",
    featured: false,
    summary:
      "A full-day outdoor celebration with live performances, creator booths, food vendors, and family-friendly programming.",
  },
  {
    id: "makers-exhibition",
    title: "Makers Exhibition",
    category: "Exhibitions",
    location: "Hudson Gallery, Manhattan",
    date: "November 2025",
    image:
      `${cloudinaryFetchBase}/https://images.unsplash.com/photo-1511578314322-379afb476865`,
    alt: "Guests walking through a warmly lit exhibition space during an Event Hub showcase",
    featured: false,
    summary:
      "A curated showcase where independent makers presented installations, prototypes, and limited-run creative work.",
  },
  {
    id: "tech-meetup-afterhours",
    title: "Tech Meetup Afterhours",
    category: "Meetups",
    location: "Northside Studio, Queens",
    date: "October 2025",
    image:
      `${cloudinaryFetchBase}/https://images.unsplash.com/photo-1516321318423-f06f85e504b3`,
    alt: "Speaker presenting to attendees at a hosted technology meetup",
    featured: false,
    summary:
      "A community meetup with lightning talks, product demos, and relaxed time for builders to compare notes.",
  },
]
