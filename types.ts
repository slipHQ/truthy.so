export type Quiz = {
  id?: string;
  friendly_id?: string;
  description: string;
  start_code: string;
  target_output: string;
  solution: string;
  language: string;
  views?: string;
};

export type Profile = {
  username: string;
  avatar_url: string;
  full_name: string;
};

export type SaveQuiz = Quiz & {
  created_at: Date;
  updated_at: Date;
  created_by: string;
};
