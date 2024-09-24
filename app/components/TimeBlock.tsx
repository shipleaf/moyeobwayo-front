interface TimeBlockProps {
  time: Date;
  style?: React.CSSProperties;
  onMouseEnter: () => void;
  onMouseDown: () => void;
  onMouseUp: () => void; // onMouseUp 추가
}

const TimeBlock: React.FC<TimeBlockProps> = ({
  time,
  style,
  onMouseEnter,
  onMouseDown,
  onMouseUp, // onMouseUp 추가
}) => {
  return (
    <div
      style={{
        padding: "10px",
        border: "1px solid gray",
        cursor: "pointer",
        ...style, // 전달받은 style을 적용
      }}
      onMouseEnter={onMouseEnter} // 마우스가 블록을 지나갈 때 이벤트 처리
      onMouseDown={onMouseDown} // 마우스를 클릭할 때 이벤트 처리
      onMouseUp={onMouseUp} // 마우스를 뗄 때 이벤트 처리
    >
      {/* 시간을 표시하거나, 다른 블록 콘텐츠를 추가할 수 있습니다. */}
    </div>
  );
};

export default TimeBlock;
