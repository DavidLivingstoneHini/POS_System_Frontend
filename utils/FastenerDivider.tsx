import React from "react";
import "../styles/pos.css";

const FastenerDivider: React.FC = () => {
  return (
    <div className="fastener-divider">
      <div className="thread"></div>
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="fastener"></div>
      ))}
    </div>
  );
};

export default FastenerDivider;
