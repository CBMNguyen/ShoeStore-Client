export function RightArrowDirection(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        position: "absolute",
        top: "50%",
        right: "-40%",
        display: "flex",
        alignItems: "center",

        width: "4rem",
        height: "4rem",
        borderRadius: "50%",
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
        position: "absolute",
        top: "50%",
        left: "-40%",
        display: "flex",
        alignItems: "center",

        width: "4rem",
        height: "4rem",
        borderRadius: "50%",
        backgroundColor: "#bbb",
        justifyContent: "center",
      }}
      onClick={onClick}
    />
  );
}
