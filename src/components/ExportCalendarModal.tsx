import React, { useState } from 'react';
import { Send, X } from 'lucide-react';
import { Assignment, TeamMember, Location, SmtpSettings } from '../types';

interface ExportCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignments: Assignment[];
  teamMembers: TeamMember[];
  locations: Location[];
  startDate: Date;
  endDate: Date;
  smtpSettings: SmtpSettings;
  location: string;
}

const ExportCalendarModal: React.FC<ExportCalendarModalProps> = ({
  isOpen,
  onClose,
  assignments,
  teamMembers,
  locations,
  startDate,
  endDate,
  smtpSettings,
  location
}) => {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    try {
      const locationName = locations.find(loc => loc.id === location)?.name || 'Général';
      const filteredAssignments = assignments.filter(a => 
        a.location === location || (location === 'general' && a.location)
      );

      const exportData = {
        location: locationName,
        period: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        },
        assignments: filteredAssignments,
        members: teamMembers,
        smtp: smtpSettings
      };

      // TODO: Implement actual email sending logic through a backend service
      console.log('Exporting calendar data:', exportData);
      
      // Simulate sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onClose();
    } catch (error) {
      setError('Une erreur est survenue lors de l\'envoi du planning');
      console.error('Failed to export calendar:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Exporter le Planning</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Adresse email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="exemple@email.com"
              required
            />
          </div>

          <div className="text-sm text-gray-600">
            <p>Période d'export :</p>
            <p>Du {startDate.toLocaleDateString()} au {endDate.toLocaleDateString()}</p>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={sending}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4 mr-2" />
              {sending ? 'Envoi en cours...' : 'Envoyer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExportCalendarModal;