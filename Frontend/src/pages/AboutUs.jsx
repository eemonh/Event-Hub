const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      {/* 1. Hero Section */}
      <section className="py-24 px-6 flex flex-col items-center text-center">
        <p className="text-purple-600 font-bold text-xs tracking-widest uppercase mb-4">
          About EventHub
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight max-w-4xl leading-tight mb-6">
          Connecting Communities Through Unforgettable Experiences.
        </h1>
        <p className="text-gray-500 max-w-2xl text-base md:text-lg">
          We believe in the power of shared moments. Our mission is to provide a
          seamless, intuitive platform that empowers organizers to create, and attendees
          to discover, events that matter.
        </p>
      </section>

      {/* 2. Our Story Section */}
      <section className="bg-[#f8f9fa] py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600 text-sm md:text-base leading-relaxed">
              <p>
                Founded in 2020 out of a sheer frustration with fragmented event
                management tools, EventHub was born from a simple idea: bringing people
                together shouldn't be difficult. What started as a small passion project in a
                shared workspace quickly evolved into a robust platform serving thousands
                of communities worldwide.
              </p>
              <p>
                We recognized that whether it's a local tech meetup, a massive music
                festival, or a specialized corporate seminar, the underlying need is the same
                —a reliable, elegant bridge between organizers and their audience. Our team
                spent years refining the user experience, ensuring that the technology stays
                out of the way so the event itself can shine.
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Team collaborating around a table"
              className="rounded-2xl shadow-md w-full object-cover aspect-[4/3]"
            />
          </div>
        </div>
      </section>

      {/* 3. Core Values Section */}
      <section className="bg-[#fcfaff] py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Core Values</h2>
            <p className="text-gray-500">
              The principles that guide our product, our team, and our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Value Card 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden z-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-[100px] -z-10"></div>
              <div className="mb-6 text-purple-700">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 11C17.6569 11 19 9.65685 19 8C19 6.34315 17.6569 5 16 5C14.3431 5 13 6.34315 13 8C13 9.65685 14.3431 11 16 11Z" />
                  <path d="M8 11C9.65685 11 11 9.65685 11 8C11 6.34315 9.65685 5 8 5C6.34315 5 5 6.34315 5 8C5 9.65685 6.34315 11 8 11Z" />
                  <path d="M8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13Z" />
                  <path d="M16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community First</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Every feature we build is designed to foster connection and lower the barriers to gathering people together.
              </p>
            </div>

            {/* Value Card 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden z-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] -z-10"></div>
              <div className="mb-6 text-blue-600">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 1L15.2469 3.913L19.463 3.652L20.4431 7.747L23.826 10L22.2131 13.834L24 18L19.957 19.435L18.426 23.348L14.417 22.087L12 25L9.58301 22.087L5.57397 23.348L4.04297 19.435L0 18L1.78699 13.834L0.17395 10L3.55695 7.747L4.53699 3.652L8.75305 3.913L12 1Z" />
                  <path d="M10.4998 16.5L6.49982 12.5L7.91382 11.086L10.4998 13.672L16.0858 8.08594L17.4998 9.49994L10.4998 16.5Z" fill="white"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Trust & Clarity</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                We prioritize transparent communication, secure transactions, and intuitive interfaces that organizers and attendees can rely on.
              </p>
            </div>

            {/* Value Card 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden z-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-[100px] -z-10"></div>
              <div className="mb-6 text-green-500">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2.05V10H19.36L11 21.95V14H4.64L13 2.05Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Empowering Action</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                We believe in providing powerful, yet accessible tools that turn ambitious event ideas into successful realities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Leadership Team Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-gray-500 max-w-2xl text-sm md:text-base">
              The dedicated professionals working behind the scenes to make EventHub the premier
              destination for event management.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Team Member 1 */}
            <div className="group">
              <div className="overflow-hidden rounded-2xl mb-5">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                  alt="Michael Chen"
                  className="w-full aspect-[4/5] object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Michael Chen</h3>
              <p className="text-purple-600 text-sm font-medium mt-1">Founder & CEO</p>
            </div>

            {/* Team Member 2 */}
            <div className="group">
              <div className="overflow-hidden rounded-2xl mb-5">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                  alt="Sarah Jenkins"
                  className="w-full aspect-[4/5] object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Sarah Jenkins</h3>
              <p className="text-purple-600 text-sm font-medium mt-1">Chief Technology Officer</p>
            </div>

            {/* Team Member 3 */}
            <div className="group">
              <div className="overflow-hidden rounded-2xl mb-5">
                <img
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                  alt="David Althaus"
                  className="w-full aspect-[4/5] object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900">David Althaus</h3>
              <p className="text-purple-600 text-sm font-medium mt-1">Head of Design</p>
            </div>

            {/* Team Member 4 */}
            <div className="group">
              <div className="overflow-hidden rounded-2xl mb-5">
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                  alt="Elena Rodriguez"
                  className="w-full aspect-[4/5] object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Elena Rodriguez</h3>
              <p className="text-purple-600 text-sm font-medium mt-1">Head of Community</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
