"use client";

import { LibraryBooks, LibraryAddCheck, VerifiedUser, AssignmentInd } from "@mui/icons-material";
import { useState } from "react";

export default function Cards() {
  return (
    <div className="grid grid-cols-2 gap-6 mb-20">
      <SolicitudCard 
        title="Solicitud Multiple" 
        icon={<LibraryBooks sx={{ fontSize: 50, color: "#FFFFFF" }} />}
        animationDirection="top-left"
      />
      
      <SolicitudCard 
        title="Solicitar Solvencia" 
        icon={<LibraryAddCheck sx={{ fontSize: 50, color: "#FFFFFF" }} />}
        animationDirection="top-right"
      />
      
      <SolicitudCard 
        title="Solicitar Constancia" 
        icon={<VerifiedUser sx={{ fontSize: 50, color: "#FFFFFF" }} />}
        animationDirection="bottom-left"
      />
      
      <SolicitudCard 
        title="Solicitar Carnet" 
        icon={<AssignmentInd sx={{ fontSize: 50, color: "#FFFFFF" }} />}
        animationDirection="bottom-right"
      />
    </div>
  );
}

function SolicitudCard({ title, icon, animationDirection }) {
  const [isHovered, setIsHovered] = useState(false);
  const titleParts = title.split(" ");
  
  // Define transform and shadow based on animation direction
  const getHoverStyles = () => {
    if (!isHovered) return {};
    
    let transform = "scale(1.05) ";
    let shadowClass = "shadow-xl";
    
    switch (animationDirection) {
      case "top-left":
        transform += "translate(-7px, -7px)";
        break;
      case "top-right":
        transform += "translate(7px, -7px)";
        break;
      case "bottom-left":
        transform += "translate(-7px, 7px)";
        break;
      case "bottom-right":
        transform += "translate(7px, 7px)";
        break;
      default:
        transform += "translate(0, 0)";
    }
    
    return {
      transform,
      boxShadow: isHovered ? 
        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" : 
        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    };
  };
  
  return (
    <div 
      className="bg-[#f2f2f2ff] rounded-2xl shadow-md shadow-gray-400 border border-[#a6a6a6ff] flex justify-center items-center cursor-pointer w-[320px] h-52 transition-all duration-300 ease-in-out"
      style={getHoverStyles()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col mr-8">
        {titleParts.length > 1 ? (
          <>
            <h2 className="text-2xl font-extrabold text-black italic text-center">{titleParts[0]}</h2>
            <h2 className="text-2xl font-extrabold text-black italic text-center">{titleParts.slice(1).join(" ")}</h2>
          </>
        ) : null}
      </div>
      <div className={`bg-gradient-to-t from-[#D7008A] to-[#41023B] rounded-lg h-20 w-26 flex items-center justify-center shadow-md rotate-[10deg] transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
        {icon}
      </div>
    </div>
  );
}