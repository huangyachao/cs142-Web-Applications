// CoolHeaderPure.jsx
import React, { useState, useEffect } from "react";
import "./styles.css";

const CoolHeaderPure = () => {
  const [bgColors, setBgColors] = useState(["#ff7e5f", "#feb47b"]);
  const [hovered, setHovered] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // 每次刷新随机生成渐变颜色
    const randomColor = () =>
      "#" + Math.floor(Math.random() * 16777215).toString(16);
    setBgColors([randomColor(), randomColor()]);

    // 监听滚动
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerStyle = {
    background: `linear-gradient(135deg, ${bgColors[0]}, ${bgColors[1]})`,
    height: scrollY < 100 ? "120px" : "80px",
    opacity: scrollY < 100 ? 1 : 0.9,
    transition: "all 0.3s ease",
  };

  return (
    <header className="cool-header" style={headerStyle}>
      <div className="header-content">
        <h1
          className={`logo ${hovered ? "hovered" : ""}`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          MyUniqueSite
        </h1>
        <div className="motto">Be a trustworthy person</div>
      </div>
    </header>
  );
};

export default CoolHeaderPure;
