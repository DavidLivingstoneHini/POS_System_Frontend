import React from "react";
import "../styles/pos.css";

const CustomLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="loader">
        {/* You can use any spinner or loading animation here */}
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    </div>
  );
};

export default CustomLoader;
