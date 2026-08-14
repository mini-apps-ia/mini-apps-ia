export type SubscriptionRow = {
  id: string;
  user_id: string;
  plan: string;
  status: string;
  active: boolean;
  mp_preapproval_id: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
};

export type DevocionalRow = {
  id: string;
  user_id: string;
  content: string;
  title: string | null;
  created_at: string;
};

export type ConteudoRow = {
  id: string;
  user_id: string;
  type: string;
  input: Record<string, unknown> | null;
  output: string;
  created_at: string;
};
