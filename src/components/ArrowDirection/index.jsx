export function RightArrowDirection(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        top: "50%",
        right: "-20%",
        width: "4rem",
        height: "4rem",
        display: "flex",
        borderRadius: "50%",
        alignItems: "center",
        position: "absolute",
        justifyContent: "center",
        backgroundColor: "#bbb",
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
        top: "50%",
        left: "-20%",
        width: "4rem",
        height: "4rem",
        display: "flex",
        borderRadius: "50%",
        position: "absolute",
        alignItems: "center",
        backgroundColor: "#bbb",
        justifyContent: "center",
      }}
      onClick={onClick}
    />
  );
}
