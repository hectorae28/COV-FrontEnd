"use client";
import React, { useState } from "react";
import {
  Award, Users, FileText, Briefcase, BookOpen,
  MessageSquare, Globe, Scale, Calculator,
  Calendar, Trophy, Plus, Trash2, ChevronDown,
  ChevronUp, Save
} from "lucide-react";
import { initialJuntaDData } from "../../../Models/PaginaWeb/SobreCOV/JuntaDData";

// Available icons for selection
const availableIcons = {
  Award: Award,
  Users: Users,
  FileText: FileText,
  Briefcase: Briefcase,
  BookOpen: BookOpen,
  MessageSquare: MessageSquare,
  Globe: Globe,
  Scale: Scale,
  Calculator: Calculator,
  Calendar: Calendar,
  Trophy: Trophy
};

export default function JuntaDDashboard({ moduleInfo }) {
  // Load initial data from the separate file
  const [primaryMembers, setPrimaryMembers] = useState(initialJuntaDData.primaryMembers);
  const [secondaryMembers, setSecondaryMembers] = useState(initialJuntaDData.secondaryMembers);
  const [eventsCommissionMembers, setEventsCommissionMembers] = useState(initialJuntaDData.eventsCommissionMembers);
  const [sportsCommissionMembers, setSportsCommissionMembers] = useState(initialJuntaDData.sportsCommissionMembers);
  const [eventsDescription, setEventsDescription] = useState(initialJuntaDData.eventsDescription);

  // State for expanded sections
  const [expandedPrimary, setExpandedPrimary] = useState(null);
  const [expandedSecondary, setExpandedSecondary] = useState(null);
  const [expandedEvents, setExpandedEvents] = useState(null);
  const [expandedSports, setExpandedSports] = useState(null);
  
  // State for save message
  const [saveMessage, setSaveMessage] = useState("");

  // Handle member updates
  const updatePrimaryMember = (id, field, value) => {
    setPrimaryMembers(primaryMembers.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const updateSecondaryMember = (id, field, value) => {
    setSecondaryMembers(secondaryMembers.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const updateEventsCommissionMember = (id, field, value) => {
    setEventsCommissionMembers(eventsCommissionMembers.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const updateSportsCommissionMember = (id, field, value) => {
    setSportsCommissionMembers(sportsCommissionMembers.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  // Add new members
  const addPrimaryMember = () => {
    const newId = primaryMembers.length > 0 
      ? Math.max(...primaryMembers.map(item => item.id)) + 1 
      : 1;
    setPrimaryMembers([...primaryMembers, { id: newId, name: '', role: '', icon: 'Award' }]);
    setExpandedPrimary(newId);
  };

  const addSecondaryMember = () => {
    const newId = secondaryMembers.length > 0 
      ? Math.max(...secondaryMembers.map(item => item.id)) + 1 
      : 1;
    setSecondaryMembers([...secondaryMembers, { id: newId, name: '', role: '', icon: 'FileText' }]);
    setExpandedSecondary(newId);
  };

  const addEventsCommissionMember = () => {
    const newId = eventsCommissionMembers.length > 0 
      ? Math.max(...eventsCommissionMembers.map(item => item.id)) + 1 
      : 1;
    setEventsCommissionMembers([...eventsCommissionMembers, { id: newId, name: '', role: '' }]);
    setExpandedEvents(newId);
  };

  const addSportsCommissionMember = () => {
    const newId = sportsCommissionMembers.length > 0 
      ? Math.max(...sportsCommissionMembers.map(item => item.id)) + 1 
      : 1;
    setSportsCommissionMembers([...sportsCommissionMembers, { id: newId, name: '' }]);
    setExpandedSports(newId);
  };

  // Remove members
  const removePrimaryMember = (id) => {
    setPrimaryMembers(primaryMembers.filter(member => member.id !== id));
    if (expandedPrimary === id) setExpandedPrimary(null);
  };

  const removeSecondaryMember = (id) => {
    setSecondaryMembers(secondaryMembers.filter(member => member.id !== id));
    if (expandedSecondary === id) setExpandedSecondary(null);
  };

  const removeEventsCommissionMember = (id) => {
    setEventsCommissionMembers(eventsCommissionMembers.filter(member => member.id !== id));
    if (expandedEvents === id) setExpandedEvents(null);
  };

  const removeSportsCommissionMember = (id) => {
    setSportsCommissionMembers(sportsCommissionMembers.filter(member => member.id !== id));
    if (expandedSports === id) setExpandedSports(null);
  };

  // Move members up and down
  const moveMemberUp = (array, setArray, id) => {
    const index = array.findIndex(item => item.id === id);
    if (index > 0) {
      const newArray = [...array];
      [newArray[index - 1], newArray[index]] = [newArray[index], newArray[index - 1]];
      setArray(newArray);
    }
  };

  const moveMemberDown = (array, setArray, id) => {
    const index = array.findIndex(item => item.id === id);
    if (index < array.length - 1) {
      const newArray = [...array];
      [newArray[index], newArray[index + 1]] = [newArray[index + 1], newArray[index]];
      setArray(newArray);
    }
  };

  // Save changes
  const saveChanges = () => {
    // Here you would implement the logic to save all changes to your backend
    console.log({
      primaryMembers,
      secondaryMembers,
      eventsCommissionMembers,
      eventsDescription,
      sportsCommissionMembers
    });
    
    // Show success message
    setSaveMessage("Cambios guardados exitosamente");
    setTimeout(() => {
      setSaveMessage("");
    }, 3000);
  };

  return (
    <div className="p-6">
      <div className="flex-col flex md:flex-row justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: moduleInfo.color }}>
            {moduleInfo.title}
          </h2>
          <p className="text-gray-600">
            Aquí se edita la sección de Junta Directiva de la página web
          </p>
        </div>
      </div>
      
      {saveMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {saveMessage}
        </div>
      )}
      
      <div className="space-y-6">
        {/* Primary Members Section */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Miembros Principales</h3>
            <button 
              onClick={addPrimaryMember}
              className="flex items-center gap-1 text-white px-3 py-1 rounded-md text-sm transition-colors"
              style={{ backgroundColor: moduleInfo.color }}
            >
              <Plus size={16} />
              Añadir
            </button>
          </div>
          
          <div className="space-y-3">
            {primaryMembers.map((member) => (
              <div key={member.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div 
                  className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
                  onClick={() => setExpandedPrimary(expandedPrimary === member.id ? null : member.id)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#C40180] to-[#590248] flex items-center justify-center text-white">
                      {React.createElement(availableIcons[member.icon], { size: 14 })}
                    </div>
                    <span className="font-medium">{member.role || "Nuevo cargo"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveMemberUp(primaryMembers, setPrimaryMembers, member.id);
                      }}
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveMemberDown(primaryMembers, setPrimaryMembers, member.id);
                      }}
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      <ChevronDown size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removePrimaryMember(member.id);
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                {expandedPrimary === member.id && (
                  <div className="p-4 border-t border-gray-200 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => updatePrimaryMember(member.id, 'name', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                        <input
                          type="text"
                          value={member.role}
                          onChange={(e) => updatePrimaryMember(member.id, 'role', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icono</label>
                      <select
                        value={member.icon}
                        onChange={(e) => updatePrimaryMember(member.id, 'icon', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        {Object.keys(availableIcons).map((iconName) => (
                          <option key={iconName} value={iconName}>
                            {iconName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Members Section */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Miembros Secundarios</h3>
            <button 
              onClick={addSecondaryMember}
              className="flex items-center gap-1 text-white px-3 py-1 rounded-md text-sm transition-colors"
              style={{ backgroundColor: moduleInfo.color }}
            >
              <Plus size={16} />
              Añadir
            </button>
          </div>
          
          <div className="space-y-3">
            {secondaryMembers.map((member) => (
              <div key={member.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div 
                  className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
                  onClick={() => setExpandedSecondary(expandedSecondary === member.id ? null : member.id)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#C40180] to-[#590248] flex items-center justify-center text-white">
                      {React.createElement(availableIcons[member.icon], { size: 14 })}
                    </div>
                    <span className="font-medium">{member.role || "Nuevo cargo"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveMemberUp(secondaryMembers, setSecondaryMembers, member.id);
                      }}
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveMemberDown(secondaryMembers, setSecondaryMembers, member.id);
                      }}
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      <ChevronDown size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSecondaryMember(member.id);
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                {expandedSecondary === member.id && (
                  <div className="p-4 border-t border-gray-200 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => updateSecondaryMember(member.id, 'name', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                        <input
                          type="text"
                          value={member.role}
                          onChange={(e) => updateSecondaryMember(member.id, 'role', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Icono</label>
                      <select
                        value={member.icon}
                        onChange={(e) => updateSecondaryMember(member.id, 'icon', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        {Object.keys(availableIcons).map((iconName) => (
                          <option key={iconName} value={iconName}>
                            {iconName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Events Commission Section */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Comisión de Jornadas y Eventos</h3>
            <button 
              onClick={addEventsCommissionMember}
              className="flex items-center gap-1 text-white px-3 py-1 rounded-md text-sm transition-colors"
              style={{ backgroundColor: moduleInfo.color }}
            >
              <Plus size={16} />
              Añadir
            </button>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={eventsDescription}
              onChange={(e) => setEventsDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md min-h-[100px]"
            />
          </div>
          
          <div className="space-y-3">
            {eventsCommissionMembers.map((member) => (
              <div key={member.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div 
                  className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
                  onClick={() => setExpandedEvents(expandedEvents === member.id ? null : member.id)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#C40180] to-[#590248] flex items-center justify-center text-white">
                      <Calendar size={14} />
                    </div>
                    <span className="font-medium">{member.role || "Nuevo cargo"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveMemberUp(eventsCommissionMembers, setEventsCommissionMembers, member.id);
                      }}
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveMemberDown(eventsCommissionMembers, setEventsCommissionMembers, member.id);
                      }}
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      <ChevronDown size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeEventsCommissionMember(member.id);
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                {expandedEvents === member.id && (
                  <div className="p-4 border-t border-gray-200 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => updateEventsCommissionMember(member.id, 'name', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                        <input
                          type="text"
                          value={member.role}
                          onChange={(e) => updateEventsCommissionMember(member.id, 'role', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sports Commission Section */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Comisión de Deporte</h3>
            <button 
              onClick={addSportsCommissionMember}
              className="flex items-center gap-1 text-white px-3 py-1 rounded-md text-sm transition-colors"
              style={{ backgroundColor: moduleInfo.color }}
            >
              <Plus size={16} />
              Añadir
            </button>
          </div>
          
          <div className="space-y-3">
            {sportsCommissionMembers.map((member) => (
              <div key={member.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div 
                  className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
                  onClick={() => setExpandedSports(expandedSports === member.id ? null : member.id)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#C40180] to-[#590248] flex items-center justify-center text-white">
                      <Trophy size={14} />
                    </div>
                    <span className="font-medium">{member.name || "Nuevo miembro"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveMemberUp(sportsCommissionMembers, setSportsCommissionMembers, member.id);
                      }}
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveMemberDown(sportsCommissionMembers, setSportsCommissionMembers, member.id);
                      }}
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      <ChevronDown size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSportsCommissionMember(member.id);
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                {expandedSports === member.id && (
                  <div className="p-4 border-t border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => updateSportsCommissionMember(member.id, 'name', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Save button at the bottom */}
      <div className="mt-8 flex justify-center">
        <button 
          onClick={saveChanges}
          className="flex items-center gap-2 text-white px-6 py-3 rounded-md shadow-md transition-colors"
          style={{ backgroundColor: moduleInfo.color }}
        >
          <Save size={20} />
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}
