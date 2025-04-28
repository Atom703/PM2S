import React, { useState } from 'react';
import { Briefcase, Plus, Save, X, Edit, Trash2 } from 'lucide-react';
import { Skill } from '../types';

interface SkillsManagerProps {
  skills: Skill[];
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
}

const SkillsManager: React.FC<SkillsManagerProps> = ({ skills, setSkills }) => {
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillName, setSkillName] = useState('');
  const [skillDescription, setSkillDescription] = useState('');

  const handleAddSkill = () => {
    if (editingSkill) {
      setSkills(skills.map(skill => 
        skill.id === editingSkill.id 
          ? { ...skill, name: skillName, description: skillDescription } 
          : skill
      ));
      setEditingSkill(null);
    } else {
      const newSkill: Skill = {
        id: Date.now().toString(),
        name: skillName,
        description: skillDescription
      };
      setSkills([...skills, newSkill]);
    }
    
    setSkillName('');
    setSkillDescription('');
    setIsAddingSkill(false);
  };

  const handleEditSkill = (skill: Skill) => {
    setSkillName(skill.name);
    setSkillDescription(skill.description);
    setEditingSkill(skill);
    setIsAddingSkill(true);
  };

  const handleDeleteSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  const handleCancel = () => {
    setSkillName('');
    setSkillDescription('');
    setEditingSkill(null);
    setIsAddingSkill(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Gestion des Compétences</h2>
        {!isAddingSkill && (
          <button
            onClick={() => setIsAddingSkill(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700 transition"
          >
            <Plus className="mr-2 h-5 w-5" /> Ajouter une Compétence
          </button>
        )}
      </div>

      {isAddingSkill ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingSkill ? 'Modifier une compétence' : 'Ajouter une nouvelle compétence'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="skillName" className="block text-sm font-medium text-gray-700 mb-1">
                Nom de la compétence
              </label>
              <input
                type="text"
                id="skillName"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="skillDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="skillDescription"
                value={skillDescription}
                onChange={(e) => setSkillDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center"
              >
                <X className="mr-2 h-4 w-4" /> Annuler
              </button>
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 flex items-center"
              >
                <Save className="mr-2 h-4 w-4" /> Enregistrer
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {skills.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p>Aucune compétence n'a été ajoutée.</p>
              <p className="mt-2">Cliquez sur "Ajouter une Compétence" pour commencer.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {skills.map((skill) => (
                  <tr key={skill.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800">
                          <Briefcase className="h-4 w-4" />
                        </div>
                        <div className="ml-4 font-medium text-gray-900">{skill.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{skill.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleEditSkill(skill)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteSkill(skill.id)}
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
  );
};

export default SkillsManager;