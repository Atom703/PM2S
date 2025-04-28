import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, X, Check, Trash2, MapPin, Users, AlertCircle, Mail } from 'lucide-react';
import { TeamMember, Skill, Assignment, LocationType, Location, AssignmentType, SmtpSettings, MemberStatus } from '../types';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors, DragStartEvent } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import DraggableMember from './DraggableMember';
import DroppableDay from './DroppableDay';
import ExportCalendarModal from './ExportCalendarModal';

interface PlanningCalendarProps {
  teamMembers: TeamMember[];
  skills: Skill[];
  assignments: Assignment[];
  onAddAssignment: (assignment: Assignment) => void;
  onDeleteAssignment: (id: string) => void;
  onUpdateAssignment: (assignment: Assignment) => void;
  activeLocation: LocationType;
  locations: Location[];
  smtpSettings: SmtpSettings;
}

const PlanningCalendar: React.FC<PlanningCalendarProps> = ({ 
  teamMembers, 
  skills, 
  assignments,
  onAddAssignment,
  onDeleteAssignment,
  onUpdateAssignment,
  activeLocation,
  locations,
  smtpSettings
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAddingAssignment, setIsAddingAssignment] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  
  // Form state
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [taskName, setTaskName] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('17:00');
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>(activeLocation === 'general' ? '' : activeLocation);
  const [assignmentType, setAssignmentType] = useState<AssignmentType>('work');

  // DnD setup
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Filter members based on selected skills
  const filterMembers = (members: TeamMember[]) => {
    return members.filter(member => 
      selectedSkills.length === 0 || 
      selectedSkills.every(skillId => member.skills.includes(skillId))
    );
  };

  // Check if member is already assigned on a specific date
  const isMemberAssignedOnDate = (memberId: string, date: string) => {
    return assignments.some(assignment => 
      assignment.memberId === memberId && 
      assignment.date === date
    );
  };

  // Get available members for a specific date
  const getAvailableMembersForDate = (date: string) => {
    const assignedMemberIds = assignments
      .filter(assignment => assignment.date === date)
      .map(assignment => assignment.memberId);
    
    return filterMembers(teamMembers.filter(member => !assignedMemberIds.includes(member.id)));
  };

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get day of week for first day of month
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  
  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month, day));
  }

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setError(null);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setError(null);
  };

  // Format date as YYYY-MM-DD
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Check if a date has assignments
  const hasAssignments = (date: Date) => {
    const dateStr = formatDate(date);
    return assignments.some(assignment => 
      assignment.date === dateStr && 
      (activeLocation === 'general' || assignment.location === activeLocation)
    );
  };

  // Get assignments for a specific date
  const getAssignmentsForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return assignments.filter(assignment => 
      assignment.date === dateStr &&
      (activeLocation === 'general' || assignment.location === activeLocation)
    );
  };

  // Handle day click
  const handleDayClick = (date: Date) => {
    if (!isDragging) {
      setSelectedDate(date);
      setIsAddingAssignment(false);
      setError(null);
    }
  };

  // Toggle skill selection for filtering
  const toggleFilterSkill = (skillId: string) => {
    setSelectedSkills(prev => 
      prev.includes(skillId) 
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  // Toggle skill selection for assignment
  const toggleSkill = (skillId: string) => {
    if (requiredSkills.includes(skillId)) {
      setRequiredSkills(requiredSkills.filter(id => id !== skillId));
    } else {
      setRequiredSkills([...requiredSkills, skillId]);
    }
  };

  // Handle assignment form submission
  const handleSubmitAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) return;
    
    const dateStr = formatDate(selectedDate);

    // Check if member is already assigned on this date
    if (isMemberAssignedOnDate(selectedMemberId, dateStr)) {
      setError(`Ce membre est déjà assigné à une autre tâche le ${dateStr}`);
      return;
    }
    
    const newAssignment: Assignment = {
      id: Date.now().toString(),
      memberId: selectedMemberId,
      taskName,
      date: dateStr,
      startTime,
      endTime,
      requiredSkills,
      location: activeLocation === 'general' ? undefined : activeLocation,
      type: assignmentType
    };
    
    onAddAssignment(newAssignment);
    setError(null);
    
    // Reset form
    setTaskName('');
    setStartTime('08:00');
    setEndTime('17:00');
    setRequiredSkills([]);
    setAssignmentType('work');
    setIsAddingAssignment(false);
  };

  // Get member by ID
  const getMemberById = (id: string) => {
    return teamMembers.find(member => member.id === id);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
    setError(null);
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setIsDragging(false);
    
    if (!over) return;

    const date = over.id as string;
    const { type, member } = active.data.current as { type: string; member: TeamMember };
    
    if (type !== 'member') return;
    
    // Check if member is already assigned on this date
    if (isMemberAssignedOnDate(member.id, date)) {
      setError(`${member.name} est déjà assigné à une autre tâche ce jour-là`);
      return;
    }
    
    // Create a new assignment for the dragged member
    const newAssignment: Assignment = {
      id: Date.now().toString(),
      memberId: member.id,
      taskName: member.name,
      date,
      startTime: '08:00',
      endTime: '17:00',
      requiredSkills: [],
      location: activeLocation === 'general' ? undefined : activeLocation,
      type: 'work'
    };
    
    onAddAssignment(newAssignment);
    setError(null);
  };

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const assignmentTypes: { value: AssignmentType; label: string }[] = [
    { value: 'work', label: 'Travail' },
    { value: 'leave', label: 'Congés' },
    { value: 'training', label: 'Formation' },
    { value: 'rest', label: 'Repos' },
    { value: 'absent', label: 'Absent' }
  ];

  // Render general view table
  const renderGeneralView = () => {
    const nonGeneralLocations = locations.filter(loc => loc.id !== 'general');
    
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              {nonGeneralLocations.map(location => (
                <th key={location.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {location.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {calendarDays.map((day, index) => {
              if (!day) return null;
              
              return (
                <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {day.getDate()} {monthNames[month]}
                  </td>
                  {nonGeneralLocations.map(location => {
                    const dateStr = formatDate(day);
                    const dayAssignments = assignments.filter(
                      assignment => assignment.date === dateStr && assignment.location === location.id
                    );
                    
                    return (
                      <td key={location.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-b border-gray-200 min-h-[100px]">
                        {dayAssignments.map(assignment => {
                          const member = getMemberById(assignment.memberId);
                          return (
                            <div key={assignment.id} className="mb-1 p-2 bg-indigo-50 rounded-md group relative">
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="font-medium text-gray-900">{member?.name}</span>
                                  <br />
                                  <span className="text-xs text-gray-400">
                                    {assignment.startTime} - {assignment.endTime}
                                  </span>
                                </div>
                                <button
                                  onClick={() => onDeleteAssignment(assignment.id)}
                                  className="text-red-600 hover:text-red-900 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  // Get available members for the current view
  const getAvailableMembersForView = () => {
    if (selectedDate) {
      const dateStr = formatDate(selectedDate);
      return getAvailableMembersForDate(dateStr);
    }
    return filterMembers(teamMembers);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Planning {activeLocation !== 'general' && `- ${locations.find(loc => loc.id === activeLocation)?.name}`}
        </h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700"
          >
            <Mail className="h-5 w-5 mr-2" />
            Exporter
          </button>
          <div className="flex items-center">
            <button
              onClick={goToPreviousMonth}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h3 className="text-lg font-medium text-gray-700 mx-4">
              {monthNames[month]} {year}
            </h3>
            <button
              onClick={goToNextMonth}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <div className="mb-6 space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-md font-medium text-gray-700 mb-3">Filtres</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compétences
            </label>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <button
                  key={skill.id}
                  onClick={() => toggleFilterSkill(skill.id)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedSkills.includes(skill.id)
                      ? 'bg-indigo-100 text-indigo-800 border-2 border-indigo-500'
                      : 'bg-gray-100 text-gray-800 border border-gray-300'
                  }`}
                >
                  {skill.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center">
            <Users className="h-5 w-5 mr-2" /> Membres disponibles
          </h3>
          <div className="flex flex-wrap gap-2">
            {getAvailableMembersForView().map(member => (
              <DraggableMember key={member.id} member={member} />
            ))}
          </div>
        </div>
      </div>

      <DndContext 
        sensors={sensors} 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToWindowEdges]}
      >
        {activeLocation === 'general' ? (
          renderGeneralView()
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {/* Calendar header - day names */}
            {dayNames.map((day, index) => (
              <div key={index} className="text-center font-medium text-gray-500 py-2 hidden md:block">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {calendarDays.map((day, index) => (
              day ? (
                <DroppableDay
                  key={index}
                  day={day}
                  hasAssignments={hasAssignments(day)}
                  assignments={getAssignmentsForDate(day)}
                  isSelected={selectedDate && day.getDate() === selectedDate.getDate() && 
                    day.getMonth() === selectedDate.getMonth() && 
                    day.getFullYear() === selectedDate.getFullYear()}
                  onClick={() => handleDayClick(day)}
                  teamMembers={getAvailableMembersForDate(formatDate(day))}
                  onAddMember={(memberId) => {
                    const dateStr = formatDate(day);
                    if (isMemberAssignedOnDate(memberId, dateStr)) {
                      setError(`Ce membre est déjà assigné à une autre tâche le ${dateStr}`);
                      return;
                    }
                    const member = getMemberById(memberId);
                    const newAssignment: Assignment = {
                      id: Date.now().toString(),
                      memberId,
                      taskName: member?.name || '',
                      date: dateStr,
                      startTime: '08:00',
                      endTime: '17:00',
                      requiredSkills: [],
                      location: activeLocation,
                      type: 'work'
                    };
                    onAddAssignment(newAssignment);
                    setError(null);
                  }}
                  onDeleteAssignment={onDeleteAssignment}
                />
              ) : (
                <div 
                  key={index}
                  className="border rounded-lg p-2 min-h-[100px] bg-gray-50 cursor-default border-gray-200"
                />
              )
            ))}
          </div>
        )}
      </DndContext>

      {/* Selected day details */}
      {selectedDate && activeLocation !== 'general' && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </h3>
            {!isAddingAssignment && (
              <button
                onClick={() => setIsAddingAssignment(true)}
                className="bg-indigo-600 text-white px-3 py-1 rounded-md flex items-center hover:bg-indigo-700 transition text-sm"
              >
                <Plus className="mr-1 h-4 w-4" /> Ajouter une tâche
              </button>
            )}
          </div>

          {isAddingAssignment ? (
            <form onSubmit={handleSubmitAssignment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="taskName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de la tâche
                  </label>
                  <input
                    type="text"
                    id="taskName"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="memberId" className="block text-sm font-medium text-gray-700 mb-1">
                    Membre assigné
                  </label>
                  <select
                    id="memberId"
                    value={selectedMemberId}
                    onChange={(e) => {
                      setSelectedMemberId(e.target.value);
                      const member = getMemberById(e.target.value);
                      if (member) {
                        setTaskName(member.name);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Sélectionner un membre</option>
                    {getAvailableMembersForDate(formatDate(selectedDate)).map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="assignmentType" className="block text-sm font-medium text-gray-700 mb-1">
                  Type d'assignation
                </label>
                <select
                  id="assignmentType"
                  value={assignmentType}
                  onChange={(e) => setAssignmentType(e.target.value as AssignmentType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  {assignmentTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Heure de début
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Heure de fin
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compétences requises
                </label>
                <div className="flex flex-wrap gap-2">
                  {skills.map(skill => (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => toggleSkill(skill.id)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        requiredSkills.includes(skill.id)
                          ? 'bg-indigo-100 text-indigo-800 border-2 border-indigo-500'
                          : 'bg-gray-100 text-gray-800 border border-gray-300'
                      }`}
                    >
                      {skill.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddingAssignment(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center"
                >
                  <X className="mr-2 h-4 w-4" /> Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 flex items-center"
                >
                  <Check className="mr-2 h-4 w-4" /> Enregistrer
                </button>
              </div>
            </form>
          ) : (
            <div>
              {getAssignmentsForDate(selectedDate).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p>Aucune tâche planifiée pour cette journée.</p>
                  <p className="mt-2">Cliquez sur "Ajouter une tâche" pour commencer.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getAssignmentsForDate(selectedDate).map(assignment => {
                    const member = getMemberById(assignment.memberId);
                    const assignmentTypeInfo = assignmentTypes.find(type => type.value === assignment.type);
                    
                    return (
                      <div key={assignment.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{member?.name}</h4>
                            <p className="text-sm text-gray-500">
                              {assignment.startTime} - {assignment.endTime}
                            </p>
                          </div>
                          <button
                            onClick={() => onDeleteAssignment(assignment.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                        {assignment.taskName && assignment.taskName !== member?.name && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-700">
                              Tâche: <span className="text-indigo-600">{assignment.taskName}</span>
                            </p>
                          </div>
                        )}
                        <div className="mt-2">
                          <p className="text-sm text-gray-700">
                            Type: <span className="text-indigo-600">{assignmentTypeInfo?.label || 'Travail'}</span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <ExportCalendarModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        assignments={assignments}
        teamMembers={teamMembers}
        locations={locations}
        startDate={new Date(year, month, 1)}
        endDate={new Date(year, month + 1, 0)}
        smtpSettings={smtpSettings}
        location={activeLocation}
      />
    </div>
  );
};

export default PlanningCalendar;