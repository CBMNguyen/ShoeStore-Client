import { Zoom } from "react-toastify";

export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export const PRODUCT_TOAST_OPTIONS = {
  autoClose: 1500,
  transition: Zoom,
};

export const STYLE_MODEL = {
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 1112,

  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",

  width: "100%",
  height: "100%",
  overflow: "hidden",
  outline: 0,

  backgroundColor: "rgba(0, 0, 0, 0.5)",
  transition: "all 0.2s easy-in-out 0s",
};

export const STAR_COLORS = {
  1: "#f44336",
  2: "#FF5722",
  3: "#FF9800",
  4: "#FFC107",
  5: "#FFEB3B",
};

export const STAR_MEANINGS = {
  0: "No Rating 🚫",
  1: "Terrible 🤮",
  2: "Mediocre 😒",
  3: "Average 😐",
  4: "Solid 🙂",
  5: "Fantastic 🔥",
};
