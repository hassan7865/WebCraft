import { FaQuoteLeft, FaStar } from 'react-icons/fa';


const Testimonial = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Senior Full-Stack Developer",
      company: "TechFlow Solutions",
      image: "https://21879006.fs1.hubspotusercontent-na1.net/hub/21879006/hubfs/Sarah%20Chen-Spellings.png?length=1400&name=Sarah%20Chen-Spellings.png",
      quote: "The real-time synchronization is a game-changer. Our team can collaborate on complex codebases without merge conflicts, and the integrated project management keeps us aligned on sprint goals.",
      rating: 5
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      role: "Engineering Team Lead",
      company: "DevCorp Inc",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      quote: "We've eliminated the need for multiple tools. Code editing, task assignment, and Kanban boards in one place has increased our productivity by 60%. The multi-language support is flawless.",
      rating: 5
    },
    {
      id: 3,
      name: "Emily Thompson",
      role: "Product Development Manager",
      company: "InnovateLab",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      quote: "The visual project tracking combined with real-time code collaboration has transformed how we deliver features. Our development cycles are 40% faster and our code quality has improved significantly.",
      rating: 5
    }
  ];

  return (
    <section id='testimonials' className="relative overflow-hidden py-24" style={{ backgroundColor: '#f5f5f5' }}>
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-100 to-transparent"></div>
      </div>
      
      {/* Container */}
      <div className='max-w-7xl px-6 mx-auto'>
        {/* Heading Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-full text-sm font-medium mb-6" style={{ backgroundColor: '#00B8E9' }}>
            <FaStar className="w-4 h-4" />
            Developer Testimonials
          </div>
          <h2 className='text-5xl font-bold text-gray-900 mb-6'>
            Trusted by Development Teams Worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See how engineering teams are revolutionizing their development workflow with our integrated platform
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16'>
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className={`group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 ${
                index === 1 ? 'lg:scale-105 lg:z-10' : ''
              }`}
            >
              {/* Quote icon */}
              <div className="absolute -top-4 left-8">
                <div className="text-white p-3 rounded-full shadow-lg transition-all duration-300" style={{ backgroundColor: '#00B8E9' }}>
                  <FaQuoteLeft className="w-5 h-5" />
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-6 pt-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-gray-700 text-lg leading-relaxed mb-8 italic">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img 
                    src={testimonial.image} 
                    className='w-14 h-14 rounded-full object-cover ring-4 transition-all duration-300' 
                   
                    alt={`${testimonial.name} avatar`} 
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h5 className='font-bold text-gray-900 text-lg'>{testimonial.name}</h5>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                  <p className="text-xs font-medium" style={{ color: '#00B8E9' }}>{testimonial.company}</p>
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(0, 184, 233, 0.05) 0%, rgba(0, 184, 233, 0.1) 100%)' }}></div>
            </div>
          ))}
        </div>

       
      </div>

      {/* Background shapes */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full opacity-10 animate-pulse" style={{ backgroundColor: '#00B8E9' }}></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 rounded-full opacity-10 animate-pulse delay-1000" style={{ backgroundColor: '#00B8E9' }}></div>
    </section>
  );
};

export default Testimonial;