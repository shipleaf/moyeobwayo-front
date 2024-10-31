interface TimeBlockProps {
  time: Date;
  style?: React.CSSProperties;
  className?: string;
  onMouseEnter?: () => void;
  onMouseDown?: () => void;
  onMouseUp?: () => void; // onMouseUp 추가
}

const SampleTimeBlock: React.FC<TimeBlockProps> = ({ style, className }) => {
  return (
    <div
      style={{
        ...style, // 전달받은 style을 적용
      }}
      className={`${className} p-[5px] border border-solid border-[#EBEBEB]`}
    ></div>
  );
};

export default SampleTimeBlock;