import React, { useState, useEffect } from 'react';
import { Calendar, Users, UserPlus, Briefcase, Settings, Save, Trash2, Edit } from 'lucide-react';
import TeamMemberForm from './components/TeamMemberForm';
import SkillsManager from './components/SkillsManager';
import PlanningCalendar from './components/PlanningCalendar';
import SettingsTab from './components/SettingsTab';
import { TeamMember, Skill, Assignment, LocationType, Location, SmtpSettings } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'team' | 'skills' | 'planning' | 'settings'>('team');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [activeLocation, setActiveLocation] = useState<LocationType>('general');
  const [smtpSettings, setSmtpSettings] = useState<SmtpSettings>({
    host: '',
    port: 587,
    username: '',
    password: '',
    fromEmail: '',
    fromName: '',
    secure: true
  });

  // Define locations
  const locations: Location[] = [
    { id: 'general', name: 'Vue Générale' },
    { id: 'cvo', name: 'CVO' },
    { id: 'citt', name: 'CITT' },
    { id: 'pegomas', name: 'Pégomas' },
    { id: 'auribeau', name: 'Auribeau' },
    { id: 'grasse', name: 'Grasse' },
    { id: 'peymeinade', name: 'Peymeinade' },
    { id: 'saint-vallier', name: 'Saint-Vallier' },
    { id: 'saint-cezaire', name: 'Saint-Cézaire' },
    { id: 'valderoure', name: 'Valderoure' }
  ];

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedTeamMembers = localStorage.getItem('teamMembers');
    const savedSkills = localStorage.getItem('skills');
    const savedAssignments = localStorage.getItem('assignments');
    const savedSmtpSettings = localStorage.getItem('smtpSettings');

    if (savedTeamMembers) setTeamMembers(JSON.parse(savedTeamMembers));
    if (savedSkills) setSkills(JSON.parse(savedSkills));
    if (savedAssignments) setAssignments(JSON.parse(savedAssignments));
    if (savedSmtpSettings) setSmtpSettings(JSON.parse(savedSmtpSettings));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
    localStorage.setItem('skills', JSON.stringify(skills));
    localStorage.setItem('assignments', JSON.stringify(assignments));
    localStorage.setItem('smtpSettings', JSON.stringify(smtpSettings));
  }, [teamMembers, skills, assignments, smtpSettings]);

  const handleAddMember = (member: TeamMember) => {
    if (editingMember) {
      setTeamMembers(teamMembers.map(m => m.id === editingMember.id ? member : m));
      setEditingMember(null);
    } else {
      setTeamMembers([...teamMembers, { ...member, id: Date.now().toString() }]);
    }
    setIsAddingMember(false);
  };

  const handleDeleteMember = (id: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
    // Also remove any assignments for this member
    setAssignments(assignments.filter(assignment => assignment.memberId !== id));
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setIsAddingMember(true);
  };

  const handleAddAssignment = (assignment: Assignment) => {
    setAssignments([...assignments, assignment]);
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments(assignments.filter(assignment => assignment.id !== id));
  };

  const handleUpdateAssignment = (updatedAssignment: Assignment) => {
    setAssignments(assignments.map(assignment => 
      assignment.id === updatedAssignment.id ? updatedAssignment : assignment
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center">
            <Calendar className="mr-2" /> Système de Gestion de Planning
          </h1>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto">
          <ul className="flex">
            <li className="mr-1">
              <button
                onClick={() => setActiveTab('team')}
                className={`px-4 py-3 font-medium flex items-center ${
                  activeTab === 'team' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-indigo-500'
                }`}
              >
                <Users className="mr-2 h-5 w-5" /> Équipe
              </button>
            </li>
            <li className="mr-1">
              <button
                onClick={() => setActiveTab('skills')}
                className={`px-4 py-3 font-medium flex items-center ${
                  activeTab === 'skills' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-indigo-500'
                }`}
              >
                <Briefcase className="mr-2 h-5 w-5" /> Compétences
              </button>
            </li>
            <li className="mr-1">
              <button
                onClick={() => setActiveTab('planning')}
                className={`px-4 py-3 font-medium flex items-center ${
                  activeTab === 'planning' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-indigo-500'
                }`}
              >
                <Calendar className="mr-2 h-5 w-5" /> Planning
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-3 font-medium flex items-center ${
                  activeTab === 'settings' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-indigo-500'
                }`}
              >
                <Settings className="mr-2 h-5 w-5" /> Paramètres
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {/* Team Members Tab */}
        {activeTab === 'team' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Gestion de l'Équipe</h2>
              <button
                onClick={() => {
                  setIsAddingMember(true);
                  setEditingMember(null);
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700 transition"
              >
                <UserPlus className="mr-2 h-5 w-5" /> Ajouter un Membre
              </button>
            </div>

            {isAddingMember ? (
              <TeamMemberForm 
                onSubmit={handleAddMember} 
                onCancel={() => {
                  setIsAddingMember(false);
                  setEditingMember(null);
                }}
                existingMember={editingMember}
                availableSkills={skills}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {teamMembers.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Users className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <p>Aucun membre d'équipe n'a été ajouté.</p>
                    <p className="mt-2">Cliquez sur "Ajouter un Membre" pour commencer.</p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compétences</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Affinités</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {teamMembers.map((member) => (
                        <tr key={member.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
                                {member.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                <div className="text-sm text-gray-500">{member.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                              {member.skills.map((skillId) => {
                                const skill = skills.find(s => s.id === skillId);
                                return skill ? (
                                  <span key={skillId} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                    {skill.name}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                              {member.affinities.map((affinity) => {
                                const affinityMember = teamMembers.find(m => m.id === affinity);
                                return affinityMember ? (
                                  <span key={affinity} className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                    {affinityMember.name}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              onClick={() => handleEditMember(member)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteMember(member.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <SkillsManager skills={skills} setSkills={setSkills} />
        )}

        {/* Planning Tab */}
        {activeTab === 'planning' && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Sélectionner un site</h2>
              <div className="flex flex-wrap gap-2">
                {locations.map(location => (
                  <button
                    key={location.id}
                    onClick={() => setActiveLocation(location.id)}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      activeLocation === location.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {location.name}
                  </button>
                ))}
              </div>
            </div>
            <PlanningCalendar 
              teamMembers={teamMembers} 
              skills={skills} 
              assignments={assignments}
              onAddAssignment={handleAddAssignment}
              onDeleteAssignment={handleDeleteAssignment}
              onUpdateAssignment={handleUpdateAssignment}
              activeLocation={activeLocation}
              locations={locations}
            />
          </>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <SettingsTab
            smtpSettings={smtpSettings}
            onSaveSettings={setSmtpSettings}
          />
        )}
      </main>
    </div>
  );
}

export default App;