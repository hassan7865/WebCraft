import { Link } from 'react-router-dom';
import illustrationIntro from '../../assets/illustration.svg';

const Hero = () => {
  return (
    <section id='hero'>
      {/* Flex Container */}
      <div className='container flex flex-col-reverse items-center px-6 mx-auto mt-10 space-y-0 md:space-y-0 md:flex-row'>
        {/* Left Item */}
        <div className='flex flex-col mb-32 space-y-12 md:w-1/2'>
          <h1 className='max-w-md text-4xl font-bold text-center md:text-5xl md:text-left'>
            Code Together. Build Better. Ship Faster.
          </h1>
          <p className='max-w-sm text-center text-darkGrayishBlue md:text-left'>
            The ultimate real-time IDE with integrated project management. Collaborate seamlessly, manage tasks efficiently, and code in any language - all in one powerful platform.
          </p>
          <div className='flex justify-center md:justify-start'>
            <Link
              to='/auth'
              className='p-3 px-6 pt-2 text-white rounded-full baseline hover:opacity-90'
              style={{ backgroundColor: '#00B8E9' }}
            >
              Start Coding Now
            </Link>
          </div>
        </div>
        {/* Image */}
        <div className='md:w-1/2'>
          <img src={illustrationIntro} alt='' />
        </div>
      </div>
    </section>
  );
};

export default Hero;