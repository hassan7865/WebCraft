const AboutUs = () => {
  return (
    <section id='about-us' className='py-24' style={{ backgroundColor: '#ffffff' }}>
      {/* Main Container */}
      <div className='container mx-auto px-6'>
        
        {/* Hero Section */}
        <div className='max-w-6xl mx-auto'>
          <div className='grid lg:grid-cols-2 gap-16 items-center'>
            
            {/* Content Side */}
            <div className='space-y-8'>
              <div>
                <h2 className='text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight'>
                  About Us
                </h2>
                <div 
                  className='w-20 h-1 rounded-full mb-8'
                  style={{ backgroundColor: '#00B8E9' }}
                ></div>
              </div>
              
              <div className='space-y-6 text-lg text-gray-600 leading-relaxed'>
                <p>
                  We are a team of passionate software engineers and product designers who have experienced 
                  firsthand the challenges of modern collaborative development. After years of working with 
                  distributed teams across different time zones and struggling with fragmented toolsets, 
                  we decided to build the solution we wished existed.
                </p>
                
                <p>
                  Our platform was born from the understanding that great software is built by great teams, 
                  and great teams need tools that enhance collaboration rather than hinder it. We believe 
                  that geographical boundaries shouldn't limit a team's potential, and that every developer 
                  deserves access to enterprise-grade development tools that are both powerful and intuitive.
                </p>
                
                <p>
                  Today, we continue to evolve our platform based on real-world feedback from the developer 
                  community, ensuring that every feature we build addresses genuine challenges faced by 
                  development teams worldwide. Our commitment remains unchanged: to eliminate friction in 
                  collaborative development and empower teams to focus on what they do best - creating 
                  exceptional software.
                </p>
              </div>
            </div>
            
            {/* Image Side */}
            <div className='relative'>
              <div className='relative overflow-hidden rounded-2xl shadow-2xl'>
                <img 
                  src='https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                  alt='Team collaboration in modern office'
                  className='w-full h-96 lg:h-[500px] object-cover'
                />
                
                {/* Overlay gradient */}
                <div 
                  className='absolute inset-0 opacity-20'
                  style={{ 
                    background: 'linear-gradient(135deg, #00B8E9 0%, transparent 70%)'
                  }}
                ></div>
              </div>
              
              {/* Floating accent element */}
              <div 
                className='absolute -bottom-6 -left-6 w-24 h-24 rounded-2xl shadow-lg flex items-center justify-center'
                style={{ backgroundColor: '#00B8E9' }}
              >
                <div className='text-white text-3xl font-bold'>
                  &lt;/&gt;
                </div>
              </div>
            </div>
            
          </div>
        </div>
        
        {/* Secondary Content */}
        <div className='max-w-4xl mx-auto mt-24 text-center'>
          <h3 className='text-2xl font-semibold text-gray-900 mb-8'>
            Building the Future of Collaborative Development
          </h3>
          <p className='text-lg text-gray-600 leading-relaxed'>
            We're not just building software; we're crafting the infrastructure that enables the next 
            generation of digital innovation. Every line of code we write, every feature we design, 
            and every decision we make is guided by our vision of a world where development teams 
            can collaborate seamlessly, regardless of distance or complexity.
          </p>
        </div>
        
      </div>
    </section>
  );
};

export default AboutUs;