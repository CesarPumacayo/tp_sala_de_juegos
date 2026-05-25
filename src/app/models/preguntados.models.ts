export interface Pregunta {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  opciones?: string[];
}

export interface TriviaResponse {
  results: any[];
}