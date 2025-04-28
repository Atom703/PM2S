import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Assignment, TeamMember } from '../types';
import { Trash2 } from 'lucide-react';

interface DroppableDayProps {
  day: Date;
  hasAssignments: boolean;
  assignments: Assignment[];
  isSelected: boolean;
  onClick: () => void;
  teamMembers: TeamMember[];
  onAddMember: (memberId: string) => void;
  onDeleteAssignment: (id: string) => void;
}

const DroppableDay: React.FC<DroppableDayProps> = ({ 
  day, 
  hasAssignments, 
  assignments, 
  isSelected, 
  onClick,
  teamMembers,
  onAddMember,
  onDeleteAssignment
}) => {
  const dateStr = day.toISOString().split('T')[0];
  const { isOver, setNodeRef } = useDroppable({
    id: dateStr,
    data: {
      date: dateStr,
      type: 'day'
    }
  });

  const getMemberById = (id: string) => {
    return teamMembers.find(member => member.id === id);
  };

  return (
    <div 
      ref={setNodeRef}
      onClick={onClick}
      className={`
        border rounded-lg p-2 min-h-[100px] transition-all duration-200 touch-none
        ${isOver ? 'bg-indigo-50 border-indigo-300 scale-105 ring-2 ring-indigo-400' : 'bg-white'}
        ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200'}
        cursor-pointer hover:border-indigo-300
      `}
    >
      <div className="flex justify-between items-center mb-1">
        <span className={`text-sm font-medium ${
          day.getDay() === 0 || day.getDay() === 6 ? 'text-red-500' : 'text-gray-700'
        }`}>
          {day.getDate()}
        </span>
        {hasAssignments && (
          <span className="h-2 w-2 bg-indigo-500 rounded-full"></span>
        )}
      </div>
      <div className="space-y-1">
        {assignments.map(assignment => {
          const member = getMemberById(assignment.memberId);
          return (
            <div 
              key={assignment.id}
              className="text-xs bg-indigo-50 text-indigo-700 p-1 rounded truncate group relative"
              title={`${assignment.taskName} (${assignment.startTime} - ${assignment.endTime})`}
            >
              <div className="flex justify-between items-center">
                <span className="truncate">{member?.name}: {assignment.taskName}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteAssignment(assignment.id);
                  }}
                  className="text-red-600 hover:text-red-900 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2">
        <select
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            if (e.target.value) {
              onAddMember(e.target.value);
              e.target.value = '';
            }
          }}
          className="w-full text-xs border border-gray-300 rounded-md p-1"
        >
          <option value="">Ajouter un membre...</option>
          {teamMembers.map(member => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DroppableDay;