import React from 'react';

const page: React.FC = () => {
  const pdfUrl = 'docs/[모여봐요]개인정보처리방침.pdf';

  return (
    <div className="h-screen flex justify-center items-center bg-gray-50">
      <iframe
        src={pdfUrl}
        title="Privacy Policy"
        className="w-full h-full border-0"
      />
    </div>
  );
};

export default page;
