import { create } from 'zustand';

interface EmploymentState {
  path: 'traditional' | 'bank' | 'manual' | null;
  employerName: string;
  hoursWorked: number;
  activityDate: string;
  documents: File[];
  
  setPath: (path: 'traditional' | 'bank' | 'manual') => void;
  setEmployerName: (name: string) => void;
  setHoursWorked: (hours: number) => void;
  setActivityDate: (date: string) => void;
  addDocument: (file: File) => void;
  removeDocument: (index: number) => void;
  reset: () => void;
}

const initialState = {
  path: null,
  employerName: '',
  hoursWorked: 0,
  activityDate: '',
  documents: [],
};

export const useEmploymentStore = create<EmploymentState>((set) => ({
  ...initialState,
  
  setPath: (path) => set({ path }),
  setEmployerName: (employerName) => set({ employerName }),
  setHoursWorked: (hoursWorked) => set({ hoursWorked }),
  setActivityDate: (activityDate) => set({ activityDate }),
  addDocument: (file) => set((state) => ({ documents: [...state.documents, file] })),
  removeDocument: (index) => set((state) => ({
    documents: state.documents.filter((_, i) => i !== index),
  })),
  reset: () => set(initialState),
}));
