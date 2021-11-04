export type Quiz = {
  friendly_id: string;
  description: string;
  start_code: string;
  target_output: string;
  language: string;
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
