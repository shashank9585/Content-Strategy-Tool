
export interface BrandVoice {
  id: string;
  name: string;
  tone: string;
  formality: 'Casual' | 'Professional' | 'Formal' | 'Luxury';
  vocabulary: 'Standard' | 'Sophisticated' | 'Technical' | 'Simple';
  emojiUsage: 'None' | 'Minimal' | 'Frequent';
}

export interface PPCInsight {
  platform: string;
  avgCPC: string;
  benchmark: string;
  reachEstimate: string;
  justification: string;
  budgetShare: string; 
  performanceIndicators: {
    label: string;
    value: string;
  }[];
}

export interface StoryboardFrame {
  id: number;
  description: string;
  visualIntent: string;
  imageUrl?: string;
  notes?: string;
}

export interface CampaignAsset {
  id: string;
  type: 'Hero' | 'Ad' | 'Product' | 'Lifestyle';
  imageUrl: string;
  prompt: string;
  tags: string[];
  aspectRatio: string;
  notes?: string;
}

export interface CampaignContent {
  strategy: string;
  ctas: string[];
  ppc: PPCInsight[];
  visuals: CampaignAsset[];
  storyboard: StoryboardFrame[];
  groundingLinks?: { uri: string; title?: string }[];
  blog: {
    title: string;
    content: string;
    keywords?: string[];
    tags?: string[];
  };
  social: {
    linkedin: string;
    instagram: string;
    socialHooks: string[];
    tags?: string[];
    adCopy: {
      headline: string;
      primaryText: string;
      description: string;
      cta: string;
    };
  };
}

export interface CampaignHistory {
  id: string;
  timestamp: number;
  prompt: string;
  config: {
    goal?: string;
    audience?: string;
    budget?: string;
    locationType?: string;
    locationValue?: string;
    aspectRatio?: string;
    selectedVoiceId?: string;
  };
  results: CampaignContent;
}

export interface CampaignDraft {
  prompt: string;
  primaryGoal: string;
  targetAudience: string;
  budgetRange: string;
  locationType: string;
  locationValue: string;
  selectedVoiceId: string;
  setupMode: 'master' | 'guided';
  preferredAspectRatio: string;
}
