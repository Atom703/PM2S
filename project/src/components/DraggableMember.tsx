import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { TeamMember } from '../types';

interface DraggableMemberProps {
  member: TeamMember;
}

const DraggableMember: React.FC<DraggableMemberProps> = ({ member }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: member.id,
    data: {
      type: 'member',
      member
    }
  });
  
  const style = transform ? {
    transform: CSS.Transform.toString(transform),
    zIndex: isDragging ? 50 : undefined,
  } : undefined;

  // Define status colors
  const statusColors = {
    available: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
    leave: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100',
    training: 'bg-green-50 text-green-700 hover:bg-green-100',
    rest: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
    absent: 'bg-red-50 text-red-700 hover:bg-red-100'
  };

  const statusColor = member.status ? statusColors[member.status] : statusColors.available;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`px-3 py-2 rounded-md shadow-sm flex items-center transition-colors select-none cursor-grab touch-none ${
        isDragging 
          ? 'shadow-lg ring-2 ring-indigo-500' 
          : statusColor
      }`}
    >
      <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold mr-2">
        {member.name.charAt(0).toUpperCase()}
      </div>
      <span className="pointer-events-none">{member.name}</span>
    </div>
  );
};

export default DraggableMember;