import React from "react";
import useTheme from "./use-theme";

const lightTheme = {
  body: "#e2e2e2",
  text: "#363537",
  toggleBorder: "#fff",
  gradient: "linear-gradient(#39598A, #79D7ED)",
};

const darkTheme = {
  body: "#363537",
  text: "#FAFAFA",
  toggleBorder: "#6B8096",
  gradient: "linear-gradient(#091236, #1E215D)",
};

const Toggle = () => {
  const [theme, toggleTheme] = useTheme();
  const isLight = theme === "light";
  const colors = isLight ? lightTheme : darkTheme;
  const buttonStyle = {
    position: "relative",
    display: "flex",
    justifyContent: "space-between",
    background: colors.gradient,
    width: "5rem",
    height: "2.5rem",
    borderRadius: "30px",
    border: `2px solid ${colors.toggleBorder}`,
    fontSize: "0.5rem",
    padding: "0.5rem",
    overflow: "hidden",
    cursor: "pointer",
  };
  const imageStyle = {
    maxWidth: "1.5rem",
    height: "auto",
    transition: "all 0.3s linear",
  };

  return (
    <button style={buttonStyle as any} onClick={toggleTheme as any}>
      <img
        src="https://image.flaticon.com/icons/svg/1164/1164954.svg"
        width="224"
        height="224"
        alt="Sun free icon"
        title="Sun free icon"
        style={{
          ...imageStyle,
          transform: isLight ? "translateY(0)" : "translateY(100px)",
        }}
      />
      <img
        src="https://image.flaticon.com/icons/svg/2033/2033921.svg"
        width="224"
        height="224"
        alt="Moon free icon"
        title="Moon free icon"
        style={{
          ...imageStyle,
          transform: isLight ? "translateY(-100px)" : "translateY(0)",
        }}
      />
    </button>
  );
};

export default Toggle;
