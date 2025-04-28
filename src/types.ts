import { ReactNode } from 'react';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  skills: string[]; // Array of skill IDs
  affinities: string[]; // Array of team member IDs
  status?: MemberStatus;
  statusPeriod?: {
    start: string;
    end: string;
  };
}

export interface Skill {
  id: string;
  name: string;
  description: string;
}

export interface Assignment {
  id: string;
  memberId: string;
  taskName: string;
  date: string; // ISO date string
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  requiredSkills: string[]; // Array of skill IDs
  location?: LocationType;
  type: AssignmentType;
}

export type AssignmentType = 'work' | 'leave' | 'training' | 'rest' | 'absent';

export type MemberStatus = 'available' | 'leave' | 'training' | 'rest' | 'absent';

export type LocationType = 
  | 'general'
  | 'cvo'
  | 'citt'
  | 'pegomas'
  | 'auribeau'
  | 'grasse'
  | 'peymeinade'
  | 'saint-vallier'
  | 'saint-cezaire'
  | 'valderoure';

export interface Location {
  id: LocationType;
  name: string;
}

export interface CalendarExport {
  period: {
    start: string;
    end: string;
  };
  assignments: Assignment[];
  members: TeamMember[];
  locations: Location[];
}

export interface SmtpSettings {
  host: string;
  port: number;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
  secure: boolean;
}

export interface TabProps {
  children: ReactNode;
  isActive: boolean;
}