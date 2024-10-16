interface TimeBlockProps {
  time: Date;
  style?: React.CSSProperties;
  onMouseEnter?: () => void;
  onMouseDown?: () => void;
  onMouseUp?: () => void; // onMouseUp 추가
}

const TimeBlock: React.FC<TimeBlockProps> = ({ style }) => {
  return (
    <div
      style={{
        ...style, // 전달받은 style을 적용
      }}
      className="p-[5px] border border-solid border-[#EBEBEB] bg-white "
    ></div>
  );
};

export default TimeBlock;
