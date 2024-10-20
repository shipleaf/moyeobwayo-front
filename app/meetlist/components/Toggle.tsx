import React from 'react';

interface ToggleProps {
  isToggled: boolean;
}

const Toggle: React.FC<ToggleProps> = ({ isToggled=true}) => {
  return (
    <div
      className={`w-10 h-5 rounded-full cursor-pointer flex items-center transition-colors py-1
      duration-300 ${isToggled ? 'bg-[#4A4ACC]' : 'bg-[#5F5F5F]'}`}
      
    >
      <div
        className={`h-4 w-4 bg-white rounded-full transition-transform duration-300 
        ${isToggled ? 'translate-x-5' : 'translate-x-0'} 
        mx-0.5`}
      ></div>
    </div>
  );
};

export default Toggle;