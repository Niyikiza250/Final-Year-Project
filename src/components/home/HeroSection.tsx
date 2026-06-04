import React from 'react';
import HeroNav from './HeroNav';
import HeroSlider from './HeroSlider';

const HeroSection: React.FC = () => {
  return (
    <div className="relative">
      <HeroSlider />
    </div>
  );
};

export default HeroSection;
