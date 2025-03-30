export interface MedicalData {
  [key: string]: string[];
}

export interface QuestionNode {
  id: number;
  question: string;
  options: string[];
  allowCustom?: boolean;
  getNext: (answers: string[]) => number | null;
}

export interface QuestionTree {
  [key: number]: QuestionNode;
}

export interface SurveyAnswers {
  [key: number]: string[];
}

export type MedicalCategory = "Basic Needs" | "Body Parts" | "Emotions" | "Actions" | "Patient Specific" | "Custom";

export type TypedMedicalData = {
  [K in MedicalCategory]: string[];
}; 