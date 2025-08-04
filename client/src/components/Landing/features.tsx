const Features = () => {
  const features = [
    {
      id: '01',
      title: 'Real-time Code Synchronization',
      description: 'Collaborate seamlessly with your team through instant code synchronization. See changes as they happen, avoid conflicts, and maintain consistency across all development environments with our advanced real-time technology.'
    },
    {
      id: '02', 
      title: 'Integrated Project Management',
      description: 'Streamline your development workflow with built-in project management tools. Track milestones, monitor progress, and coordinate team efforts all within your coding environment for maximum efficiency.'
    },
    {
      id: '03',
      title: 'Smart Task Assignment',
      description: 'Distribute work intelligently with our automated task assignment system. Match tasks to team members based on skills, availability, and workload to optimize productivity and delivery timelines.'
    },
    {
      id: '04',
      title: 'Visual Kanban Board',
      description: 'Visualize your project flow with intuitive Kanban boards. Drag and drop tasks, track progress stages, and maintain clear visibility of your development pipeline from conception to deployment.'
    },
    {
      id: '05',
      title: 'Multi-Language Support',
      description: 'Code in your preferred language with comprehensive support for all major programming languages. Enjoy syntax highlighting, intelligent autocomplete, and language-specific tools in one unified environment.'
    }
  ];

  return (
    <section id='features' className='py-20' style={{ backgroundColor: '#f5f5f5' }}>
      {/* Main Container */}
      <div className='container mx-auto px-6'>
        {/* Header Section */}
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold mb-6 text-gray-800'>
            The Complete Development Ecosystem
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
            Experience the future of collaborative development with our real-time IDE that seamlessly integrates 
            advanced project management, intelligent task distribution, and comprehensive language support.
          </p>
        </div>

        {/* Features Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto'>
          {features.map((feature) => (
            <div 
              key={feature.id}
              className='bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100'
            >
              {/* Feature Number */}
              <div className='flex items-center mb-6'>
                <div 
                  className='w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4'
                  style={{ backgroundColor: '#00B8E9' }}
                >
                  {feature.id}
                </div>
                <div className='w-full h-px bg-gradient-to-r from-gray-200 to-transparent'></div>
              </div>

              {/* Feature Content */}
              <h3 className='text-xl font-bold text-gray-800 mb-4 leading-tight'>
                {feature.title}
              </h3>
              <p className='text-gray-600 leading-relaxed'>
                {feature.description}
              </p>

              {/* Subtle accent line */}
              <div 
                className='w-16 h-1 rounded-full mt-6'
                style={{ backgroundColor: '#00B8E9', opacity: 0.3 }}
              ></div>
            </div>
          ))}
        </div>

    
      
      </div>
    </section>
  );
};

export default Features;