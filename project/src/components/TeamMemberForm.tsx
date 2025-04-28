import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { TeamMember, Skill, MemberStatus } from '../types';

interface TeamMemberFormProps {
  onSubmit: (member: TeamMember) => void;
  onCancel: () => void;
  existingMember: TeamMember | null;
  availableSkills: Skill[];
}

const TeamMemberForm: React.FC<TeamMemberFormProps> = ({ 
  onSubmit, 
  onCancel, 
  existingMember,
  availableSkills
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [affinities, setAffinities] = useState<string[]>([]);
  const [status, setStatus] = useState<MemberStatus>('available');
  const [statusStart, setStatusStart] = useState('');
  const [statusEnd, setStatusEnd] = useState('');

  // Initialize form with existing member data if editing
  useEffect(() => {
    if (existingMember) {
      setName(existingMember.name);
      setEmail(existingMember.email);
      setSelectedSkills(existingMember.skills);
      setAffinities(existingMember.affinities);
      if (existingMember.status) {
        setStatus(existingMember.status);
      }
      if (existingMember.statusPeriod) {
        setStatusStart(existingMember.statusPeriod.start);
        setStatusEnd(existingMember.statusPeriod.end);
      }
    }
  }, [existingMember]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const memberData: TeamMember = {
      id: existingMember ? existingMember.id : '',
      name,
      email,
      skills: selectedSkills,
      affinities,
      status: status === 'available' ? undefined : status,
      statusPeriod: status !== 'available' && statusStart && statusEnd ? {
        start: statusStart,
        end: statusEnd
      } : undefined
    };
    
    onSubmit(memberData);
    
    // Reset form
    setName('');
    setEmail('');
    setSelectedSkills([]);
    setAffinities([]);
    setStatus('available');
    setStatusStart('');
    setStatusEnd('');
  };

  const toggleSkill = (skillId: string) => {
    if (selectedSkills.includes(skillId)) {
      setSelectedSkills(selectedSkills.filter(id => id !== skillId));
    } else {
      setSelectedSkills([...selectedSkills, skillId]);
    }
  };

  const statusOptions: { value: MemberStatus; label: string }[] = [
    { value: 'available', label: 'Disponible' },
    { value: 'leave', label: 'Congés' },
    { value: 'training', label: 'Formation' },
    { value: 'rest', label: 'Repos' },
    { value: 'absent', label: 'Absent' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {existingMember ? 'Modifier un membre' : 'Ajouter un nouveau membre'}
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Statut
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as MemberStatus)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {status !== 'available' && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="statusStart" className="block text-sm font-medium text-gray-700 mb-1">
                Date de début
              </label>
              <input
                type="date"
                id="statusStart"
                value={statusStart}
                onChange={(e) => setStatusStart(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="statusEnd" className="block text-sm font-medium text-gray-700 mb-1">
                Date de fin
              </label>
              <input
                type="date"
                id="statusEnd"
                value={statusEnd}
                onChange={(e) => setStatusEnd(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>
        )}
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Compétences
          </label>
          <div className="flex flex-wrap gap-2">
            {availableSkills.map(skill => (
              <button
                key={skill.id}
                type="button"
                onClick={() => toggleSkill(skill.id)}
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
          {availableSkills.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Aucune compétence disponible. Veuillez d'abord ajouter des compétences dans l'onglet Compétences.
            </p>
          )}
        </div>
        
        <div className="flex justify-end mt-6 space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center"
          >
            <X className="mr-2 h-4 w-4" /> Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 flex items-center"
          >
            <Save className="mr-2 h-4 w-4" /> Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeamMemberForm;