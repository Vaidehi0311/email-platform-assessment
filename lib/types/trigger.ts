export type Trigger = {
  id: string;
  name: string;
  event_name: string;
  conditions: Record<string, unknown>;
  template_id: string | null;
  send_once: boolean;
  active: boolean;
  created_at: string | null;
  templates: { name: string } | null;
};

export type TemplateOption = {
  id: string;
  name: string;
};
