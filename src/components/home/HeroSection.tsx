import React from 'react';
import HeroNav from './HeroNav';
import HeroSlider from './HeroSlider';

const HeroSection: React.FC = () => {
  return (
    <div className="relative pt-14 sm:pt-16">
      <HeroNav />
      <HeroSlider />
    </div>
  );
};

export default HeroSection;
