import { Zoom } from "react-toastify";

export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export const PRODUCT_TOAST_OPTIONS = {
  autoClose: 2000,
  hideProgressBar: true,
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
