import { create } from 'zustand';

export interface FormInputData {
  name: string;
  age: number;
  email: string;
  gender: 'male' | 'female' | 'other';
  terms: boolean;
  image: File | null;
  country: string;
  password: string;
  confirmPassword: string;
}

export interface SubmittedForm {
  name: string;
  age: number;
  email: string;
  gender: 'male' | 'female' | 'other';
  terms: boolean;
  image: string | null;
  country: string;
  password: string;
  confirmPassword: string;
  id: string;
  timestamp: number;
  isNew: boolean;
}

interface FormState {
  submissions: SubmittedForm[];
  countries: string[];
  addSubmission: (data: Omit<SubmittedForm, 'id' | 'timestamp' | 'isNew'>) => void;
  markAsSeen: (id: string) => void;
}

export const useFormStore = create<FormState>((set) => ({
  submissions: [],
  countries: [
    'Belarus',
    'Poland',
    'Ukraine',
    'Lithuania',
    'Latvia',
    'Germany',
    'France',
    'Italy',
    'Spain',
    'United Kingdom',
    'United States',
    'Canada',
    'Australia',
    'Japan',
    'China',
    'India',
    'Brazil',
    'Mexico',
    'Sweden',
    'Norway',
  ],
  addSubmission: (data) =>
    set((state) => ({
      submissions: [
        {
          ...data,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          isNew: true,
        },
        ...state.submissions,
      ],
    })),
  markAsSeen: (id) =>
    set((state) => ({
      submissions: state.submissions.map((s) =>
        s.id === id ? { ...s, isNew: false } : s
      ),
    })),
}));