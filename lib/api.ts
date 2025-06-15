import axios from 'axios';
import { Video, Session, Schedule, DashboardStats, DiskUsage, YouTubeConfig, YouTubeStatus } from './types';

// Use relative path for Next.js API routes
const API_BASE_URL = '/api';
const AUTH_GATEWAY_URL = process.env.NEXT_PUBLIC_AUTH_GATEWAY_URL || 'https://auth.streamhib.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Important for session cookies
});

// Dashboard
export const getDashboardStats = async (): Promise<DashboardStats> => {
  // Use Next.js API routes
  const response = await api.get('/dashboard/stats');
  return response.data;
};

export const getDiskUsage = async (): Promise<DiskUsage> => {
  const response = await api.get('/dashboard/disk-usage');
  return response.data;
};

// Videos
export const getVideos = async (): Promise<Video[]> => {
  const response = await api.get('/videos');
  return response.data;
};

export const downloadVideo = async (url: string): Promise<void> => {
  await api.post('/videos/download', { file_id: url });
};

export const deleteVideo = async (filename: string): Promise<void> => {
  await api.post('/videos/delete', { file_name: filename });
};

export const deleteAllVideos = async (): Promise<void> => {
  await api.post('/videos/delete-all');
};

export const renameVideo = async (oldFilename: string, newFilename: string): Promise<void> => {
  await api.post('/videos/rename', { 
    old_name: oldFilename,
    new_name: newFilename 
  });
};

// Sessions
export const getLiveSessions = async (): Promise<Session[]> => {
  const response = await api.get('/sessions/live');
  return response.data;
};

export const getInactiveSessions = async (): Promise<Session[]> => {
  const response = await api.get('/sessions/inactive');
  return response.data;
};

export const startManualSession = async (data: {
  name: string;
  video_file: string;
  platform: string;
  stream_key: string;
}): Promise<void> => {
  await api.post('/sessions/start', {
    session_name: data.name,
    video_file: data.video_file,
    platform: data.platform === 'youtube' ? 'YouTube' : 'Facebook',
    stream_key: data.stream_key
  });
};

export const scheduleSession = async (data: {
  name: string;
  video_file: string;
  platform: string;
  stream_key: string;
  type: string;
  start_time: string;
  end_time?: string;
}): Promise<void> => {
  const scheduleData: any = {
    session_name_original: data.name,
    video_file: data.video_file,
    platform: data.platform === 'youtube' ? 'YouTube' : 'Facebook',
    stream_key: data.stream_key,
    recurrence_type: data.type === 'onetime' ? 'one_time' : 'daily'
  };

  if (data.type === 'onetime') {
    scheduleData.start_time = data.start_time;
    if (data.end_time) {
      const startTime = new Date(data.start_time);
      const endTime = new Date(data.end_time);
      const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      scheduleData.duration = durationHours;
    } else {
      scheduleData.duration = 0; // Manual stop
    }
  } else {
    // Daily schedule
    const startTime = new Date(data.start_time);
    const endTime = data.end_time ? new Date(data.end_time) : new Date(startTime.getTime() + 60 * 60 * 1000);
    
    scheduleData.start_time_of_day = startTime.toTimeString().slice(0, 5);
    scheduleData.stop_time_of_day = endTime.toTimeString().slice(0, 5);
  }

  await api.post('/schedules', scheduleData);
};

export const stopSession = async (sessionId: string): Promise<void> => {
  await api.post('/sessions/stop', { session_id: sessionId });
};

export const reactivateSession = async (sessionId: string): Promise<void> => {
  await api.post('/sessions/reactivate', { session_id: sessionId });
};

export const deleteSession = async (sessionId: string): Promise<void> => {
  await api.post('/sessions/delete', { session_id: sessionId });
};

export const deleteAllInactiveSessions = async (): Promise<void> => {
  await api.post('/sessions/inactive/delete-all');
};

// Schedules
export const getSchedules = async (): Promise<Schedule[]> => {
  const response = await api.get('/schedules');
  return response.data;
};

export const cancelSchedule = async (scheduleId: string): Promise<void> => {
  await api.post('/schedules/cancel', { id: scheduleId });
};

// YouTube
export const getYouTubeStatus = async (): Promise<YouTubeStatus> => {
  const response = await api.get('/youtube/status');
  return response.data;
};

export const getYouTubeConfig = async (): Promise<YouTubeConfig> => {
  const response = await api.get('/youtube/config');
  return response.data;
};

export const saveYouTubeConfig = async (config: YouTubeConfig): Promise<void> => {
  await api.post('/youtube/config', {
    automation_enabled: config.enabled,
    schedule_time: config.schedule_time,
    title_template: config.title_template,
    description_template: config.description_template,
    video_selection_mode: config.video_selection_mode,
    privacy_status: config.privacy_status
  });
};

export const disconnectYouTube = async (): Promise<void> => {
  await api.post('/youtube/disconnect');
};

export const getYouTubeConnectUrl = (): string => {
  return `${typeof window !== 'undefined' ? window.location.origin : ''}/api/youtube/connect`;
};