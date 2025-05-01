
export interface SiteSettings {
  id: string;
  site_name: string;
  site_subtitle: string;
  created_at: string;
  updated_at: string;
}

export interface WelcomeMessage {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  active: boolean;
}

export interface Advertisement {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  active: boolean;
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}
