import { Router } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { authenticate, authorize } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const analyticsRouter = Router();
const analyticsService = new AnalyticsService();

analyticsRouter.use(authenticate);

// Device Analytics
analyticsRouter.get('/device/:deviceId', async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const { period = '24h' } = req.query;
    const analytics = await analyticsService.getDeviceAnalytics(deviceId, period as string);
    res.json(analytics);
  } catch (error) {
    next(error);
  }
});

// Branch Analytics
analyticsRouter.get('/branch/:branchId', async (req, res, next) => {
  try {
    const { branchId } = req.params;
    const { period = '24h' } = req.query;
    const analytics = await analyticsService.getBranchAnalytics(branchId, period as string);
    res.json(analytics);
  } catch (error) {
    next(error);
  }
});

// Playlist Analytics
analyticsRouter.get('/playlist/:playlistId', async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const { period = '24h' } = req.query;
    const analytics = await analyticsService.getPlaylistAnalytics(playlistId, period as string);
    res.json(analytics);
  } catch (error) {
    next(error);
  }
});

// System Analytics (Admin only)
analyticsRouter.get('/system', authorize('admin'), async (req, res, next) => {
  try {
    const { period = '24h' } = req.query;
    const analytics = await analyticsService.getSystemAnalytics(period as string);
    res.json(analytics);
  } catch (error) {
    next(error);
  }
});

// Export Analytics
analyticsRouter.get('/export/:type/:id', authorize('admin'), async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const { period = '24h', format = 'json' } = req.query;

    if (!['json', 'csv'].includes(format as string)) {
      throw new AppError(400, 'Invalid format. Use json or csv');
    }

    const data = await analyticsService.exportAnalytics(
      type,
      id,
      period as string,
      format as 'json' | 'csv'
    );

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${type}-${id}-analytics.csv`);
    }

    res.send(data);
  } catch (error) {
    next(error);
  }
});