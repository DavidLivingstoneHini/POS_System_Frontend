import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white text-center py-4 w-full">
      <p>
        &copy; {new Date().getFullYear()} Kamak Paperless LTD. All rights
        reserved.
      </p>
      <p>
        Contact us:{" "}
        <a href="mailto:support@kamakagroup.com" className="underline">
          support@kamakagroup.com
        </a>
      </p>
    </footer>
  );
};

export default Footer;
