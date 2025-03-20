"use client";

import Image from 'next/image';
import { useState } from 'react';
import { Description, EventNote, School, Forum, Inbox } from '@mui/icons-material';

export default function AppBar() {
  const [selectedItem, setSelectedItem] = useState('Solicitudes');

  return (
    <div className="bg-gradient-to-t from-[#D7008A] to-[#41023B] h-full">
      {/* Logo */}
      <div className="p-8">
        <Image
          src="/assets/logo.png"
          alt="Colegio de Odontólogos de Venezuela"
          width={220}
          height={80}
          className="mx-auto"
        />
      </div>

      {/* Separador */}
      <div className="border-t border-gray-300/40 w-11/12 mx-auto"></div>

      {/* Menú */}
      <nav className="mt-6 space-y-6">
        <SidebarItem
          icon={<Description className="h-5 w-5" />}
          text="Solicitudes"
          active={selectedItem === 'Solicitudes'}
          onClick={() => setSelectedItem('Solicitudes')}
        />
        <Divider />
        <SidebarItem
          icon={<EventNote className="h-5 w-5" />}
          text="Eventos"
          active={selectedItem === 'Eventos'}
          onClick={() => setSelectedItem('Eventos')}
        />
        <Divider />
        <SidebarItem
          icon={<School className="h-5 w-5" />}
          text="Cursos"
          active={selectedItem === 'Cursos'}
          onClick={() => setSelectedItem('Cursos')}
        />
        <Divider />
        <SidebarItem
          icon={<Forum className="h-5 w-5" />}
          text="Notificaciones"
          active={selectedItem === 'Notificaciones'}
          onClick={() => setSelectedItem('Notificaciones')}
        />
        <Divider />
        <SidebarItem
          icon={<Inbox className="h-5 w-5" />}
          text="Bandeja"
          active={selectedItem === 'Bandeja'}
          onClick={() => setSelectedItem('Bandeja')}
        />
      </nav>
    </div>
    
  );
}

function SidebarItem({ icon, text, active, onClick }) {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center px-4 py-2 rounded-lg mx-auto transition-colors w-4/5 ${
        active
          ? 'bg-gray-200 text-[#41023B] font-bold'
          : 'bg-transparent text-white/60 hover:bg-[#41023B] hover:text-white'
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span>{text}</span>
    </a>
  );
}

function Divider() {
  return <div className="border-t border-gray-300/40 w-4/5 mx-auto"></div>;
}