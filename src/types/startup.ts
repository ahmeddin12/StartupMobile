export enum StartupStage {
  IDEA = 'Idea',
  PRE_SEED = 'Pre-seed',
  SEED = 'Seed',
  SERIES_A = 'Series A',
  SERIES_B = 'Series B',
  SERIES_C = 'Series C',
  GROWTH = 'Growth'
}

export enum Industry {
  AGTECH = 'AgTech',
  AI = 'AI',
  BLOCKCHAIN = 'Blockchain',
  CLEAN_TECH = 'CleanTech',
  ED_TECH = 'EdTech',
  E_COMMERCE = 'E-commerce',
  FIN_TECH = 'FinTech',
  HEALTH_TECH = 'HealthTech',
  IOT = 'IoT',
  MANUFACTURING = 'Manufacturing',
  SAAS = 'SaaS',
  SECURITY = 'Security',
  SOCIAL_MEDIA = 'Social Media',
  SUSTAINABILITY = 'Sustainability',
  VR_AR = 'VR/AR',
  OTHER = 'Other'
}

export interface StartupSubmission {
  name: string;
  description: string;
  pitch: string;
  industries: Industry[];
  stage: StartupStage;
  website?: string;
  logo?: File;
  founderId: string;
  status: string;
  score?: number;
}
