"use client"

interface TimeBlockProps {
  time: Date;
  style?: React.CSSProperties;
}

const TimeBlock: React.FC<TimeBlockProps> = ({ style }) => {
  return (
    <div
      style={{
        ...style, // 전달받은 style을 적용
      }}
      className="p-[5px] border border-solid border-[#EBEBEB] bg-white rounded-[10px]"
    ></div>
  );
};

export default TimeBlock;
