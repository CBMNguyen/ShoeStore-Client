export function RightArrowDirection(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        position: "absolute",
        top: "50%",
        right: "-20%",
        display: "block",
      }}
      onClick={onClick}
    />
  );
}

export function LeftArrowDirection(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        position: "absolute",
        top: "50%",
        left: "-20%",
        display: "block",
      }}
      onClick={onClick}
    />
  );
}
