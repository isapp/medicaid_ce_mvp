import { create } from 'zustand';

interface AssessmentState {
  currentStep: number;
  isEmployed: boolean | null;
  isStudent: boolean | null;
  hasDisability: boolean | null;
  isCaregiver: boolean | null;
  isPregnant: boolean | null;
  
  setCurrentStep: (step: number) => void;
  setIsEmployed: (value: boolean) => void;
  setIsStudent: (value: boolean) => void;
  setHasDisability: (value: boolean) => void;
  setIsCaregiver: (value: boolean) => void;
  setIsPregnant: (value: boolean) => void;
  reset: () => void;
}

const initialState = {
  currentStep: 0,
  isEmployed: null,
  isStudent: null,
  hasDisability: null,
  isCaregiver: null,
  isPregnant: null,
};

export const useAssessmentStore = create<AssessmentState>((set) => ({
  ...initialState,
  
  setCurrentStep: (currentStep) => set({ currentStep }),
  setIsEmployed: (isEmployed) => set({ isEmployed }),
  setIsStudent: (isStudent) => set({ isStudent }),
  setHasDisability: (hasDisability) => set({ hasDisability }),
  setIsCaregiver: (isCaregiver) => set({ isCaregiver }),
  setIsPregnant: (isPregnant) => set({ isPregnant }),
  reset: () => set(initialState),
}));
