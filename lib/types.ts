export interface Video {
  id: string;
  filename: string;
  size?: number;
  created_at?: string;
}

export interface Session {
  id: string;
  name: string;
  video_file: string;
  platform: 'youtube' | 'facebook';
  stream_key: string;
  type: 'manual' | 'scheduled';
  start_time?: string;
  stop_time?: string;
  status?: 'active' | 'inactive' | 'scheduled';
}

export interface Schedule {
  id: string;
  name: string;
  video: string;
  platform: 'youtube' | 'facebook';
  type: 'onetime' | 'daily';
  start_time: string;
  end_time?: string;
  stream_key: string;
}

export interface DashboardStats {
  live_sessions: number;
  scheduled_onetime: number;
  scheduled_daily: number;
  inactive_sessions: number;
  video_count: number;
}

export interface DiskUsage {
  status: 'normal' | 'almost_full' | 'full';
  total: string;
  used: string;
  free: string;
  percentage: number;
}

export interface YouTubeConfig {
  enabled: boolean;
  schedule_time: string;
  title_template: string;
  description_template: string;
  video_selection_mode: 'sequential' | 'random';
  privacy_status: 'public' | 'private' | 'unlisted';
}

export interface YouTubeStatus {
  connected: boolean;
  channel_name?: string;
}