import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { SmtpSettings } from '../types';

interface SettingsTabProps {
  smtpSettings: SmtpSettings;
  onSaveSettings: (settings: SmtpSettings) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ smtpSettings, onSaveSettings }) => {
  const [settings, setSettings] = useState<SmtpSettings>(smtpSettings);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(settings);
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Paramètres SMTP</h2>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="host" className="block text-sm font-medium text-gray-700 mb-1">
                  Serveur SMTP
                </label>
                <input
                  type="text"
                  id="host"
                  value={settings.host}
                  onChange={(e) => setSettings({ ...settings, host: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  placeholder="smtp.example.com"
                />
              </div>

              <div>
                <label htmlFor="port" className="block text-sm font-medium text-gray-700 mb-1">
                  Port
                </label>
                <input
                  type="number"
                  id="port"
                  value={settings.port}
                  onChange={(e) => setSettings({ ...settings, port: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  placeholder="587"
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  id="username"
                  value={settings.username}
                  onChange={(e) => setSettings({ ...settings, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  value={settings.password}
                  onChange={(e) => setSettings({ ...settings, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="fromEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email expéditeur
                </label>
                <input
                  type="email"
                  id="fromEmail"
                  value={settings.fromEmail}
                  onChange={(e) => setSettings({ ...settings, fromEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="fromName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom expéditeur
                </label>
                <input
                  type="text"
                  id="fromName"
                  value={settings.fromName}
                  onChange={(e) => setSettings({ ...settings, fromName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="secure"
                checked={settings.secure}
                onChange={(e) => setSettings({ ...settings, secure: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="secure" className="ml-2 block text-sm text-gray-900">
                Utiliser une connexion sécurisée (SSL/TLS)
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setSettings(smtpSettings);
                  setIsEditing(false);
                }}
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
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Serveur SMTP</p>
                <p className="mt-1">{settings.host}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Port</p>
                <p className="mt-1">{settings.port}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Nom d'utilisateur</p>
                <p className="mt-1">{settings.username}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email expéditeur</p>
                <p className="mt-1">{settings.fromEmail}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Nom expéditeur</p>
                <p className="mt-1">{settings.fromName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Connexion sécurisée</p>
                <p className="mt-1">{settings.secure ? 'Oui' : 'Non'}</p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Modifier les paramètres
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsTab;