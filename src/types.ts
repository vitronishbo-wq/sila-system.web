export interface Province {
  id: string;
  name: string;
  capital: string;
  x: number; // Percent width in SVG representation
  y: number; // Percent height in SVG representation
  schools: number;
  students: number;
  teachers: number;
  isActive: boolean;
}

export interface ProblemMetric {
  id: string;
  title: string;
  metric: string;
  description: string;
  iconName: string;
}

export interface FucMilestone {
  id: string;
  phase: string;
  age: string;
  label: string;
  description: string;
  dataRegistered: string[];
  systemIntegration: string;
  color: string;
}

export interface StudentJourneyStep {
  id: number;
  stage: string;
  age: string;
  title: string;
  narrative: string;
  systemAction: string;
  visualState: 'birth' | 'nif' | 'school' | 'class' | 'grade' | 'transfer';
  dataPayload: Record<string, string>;
}

export interface EducationCapability {
  id: string;
  title: string;
  category: 'Gestão' | 'Secretaria' | 'Pedagógico' | 'Supervisão';
  description: string;
  detailedScope: string[];
  iconName: string;
}

export interface PilotPhase {
  id: number;
  phase: string;
  title: string;
  status: 'Concluído' | 'Pronto' | 'Planeado';
  locationName: string;
  scope: string;
  timeline: string;
  metrics: { label: string; value: string }[];
}
