interface TimeBlockProps {
  time: string;
  style?: React.CSSProperties;
  className?: string;
  onMouseEnter?: () => void;
  onMouseDown?: () => void;
  onMouseUp?: () => void; // onMouseUp 추가
}

const TimeBlock: React.FC<TimeBlockProps> = ({ style, className }) => {
  return (
    <div
      style={{
        ...style, // 전달받은 style을 적용
      }}
      className={`${className} p-[5px] border border-solid border-[#EBEBEB] box-border`}
    ></div>
  );
};

export default TimeBlock;
