import React from "react";
function Star({
  value,
  color,
  handleHover,
  handleHoverLeave,
  handleClick,
  isFilled,
}) {
  if (!handleHover) {
    return (
      <span className="Star" style={{ color }}>
        {isFilled ? "★" : "☆"}
      </span>
    );
  }
  return (
    <span
      className="Star fs-3"
      style={{ color, cursor: "pointer" }}
      onMouseEnter={() => handleHover(value)}
      onMouseLeave={() => handleHoverLeave(value)}
      onClick={() => handleClick(value)}
    >
      {isFilled ? "★" : "☆"}
    </span>
  );
}
export default Star;
