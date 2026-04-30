export interface SegmentActivity {
  first_brand_name: string;
  session_count: number;
  segment: string;
}

export interface PieSlice {
  name: string;
  value: number;
}

export interface BarSlice {
  name: string;
  value: number;
}

export interface SessionBrandDrillDown {
  session_id: string;
  user_name?: string;
  contact_email?: string;
  action?: string;
  first_brand_name?: string;
  individual_id?: string;
  segment_id?: string;
  segment_name?: string;
  timestamp?: string | number;
  action_at?: string | number;
  login_time?: string | number;
  logout_time?: string | number;
  session_duration_minutes?: number;
}