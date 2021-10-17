export type Quiz = {
  description: string;
  start_code: string;
  target_output: string;
  language: string;
};

export type SaveQuiz = Quiz & {
  created_at: Date,
  updated_at: Date,
  created_by: string
}