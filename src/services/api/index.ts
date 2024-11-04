import { authService } from './auth.service';
import { branchService } from './branch.service';
import { deviceService } from './device.service';
import { mediaService } from './media.service';
import { playlistService } from './playlist.service';
import { scheduleService } from './schedule.service';
import { monitoringService } from './monitoring.service';
import { analyticsService } from './analytics.service';
import { createWebSocketService } from './websocket.service';

export {
  authService,
  branchService,
  deviceService,
  mediaService,
  playlistService,
  scheduleService,
  monitoringService,
  analyticsService,
  createWebSocketService
};

export { default as api } from './axios';