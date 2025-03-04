import React, { useState } from "react";
import { Button } from "@material-tailwind/react";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-64" : "w-16"
        } bg-blue-600 min-h-screen transition-all duration-300 flex flex-col items-center shadow-lg`}
      >
        {/* Toggle Button */}
        <Button
          size="sm"
          className="m-4 bg-blue-800 hover:bg-blue-700 rounded-full"
          onClick={toggleSidebar}
        >
          {isOpen ? "<" : 
           <FontAwesomeIcon icon={faBars} /> 
          }
        </Button>

        {/* Logo Section */}
        <div
          className={`text-white text-lg font-bold mb-6 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          {/* Logo Placeholder */}
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-4 w-full px-4">
          {[
            { name: "Your posts", path: "/yourposts" },
            // { name: "Post", path: "/post" },
            // { name: "Feed", path: "/feed" },
            { name: "Friends", path: "/friends" },
            { name: "Add Friend", path: "/addfriend" },
            { name: "Requests", path: "/requests" },
            { name: "Message Center", path: "/recentchats" },
          ].map((link, index) => (
            <a
              key={index}
              href={link.path}
              className="text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium text-center"
            >
              {isOpen ? link.name : link.name[0]}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
