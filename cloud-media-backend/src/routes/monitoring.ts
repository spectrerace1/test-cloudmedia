import { Router } from 'express';
import { MonitoringService } from '../services/monitoring.service';
import { authenticate, authorize } from '../middleware/auth';

export const monitoringRouter = Router();
const monitoringService = new MonitoringService();

// Start monitoring on server startup
monitoringService.startMonitoring().catch(error => {
  console.error('Failed to start device monitoring:', error);
});

monitoringRouter.use(authenticate);

// Get device metrics
monitoringRouter.get('/metrics/:deviceId', async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const { period = '1h' } = req.query;
    const metrics = await monitoringService.getDeviceMetrics(deviceId, period as string);
    res.json(metrics);
  } catch (error) {
    next(error);
  }
});

// Get device alerts
monitoringRouter.get('/alerts/:deviceId', async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const { limit = '100' } = req.query;
    const alerts = await monitoringService.getDeviceAlerts(deviceId, parseInt(limit as string));
    res.json(alerts);
  } catch (error) {
    next(error);
  }
});

// Admin only routes
monitoringRouter.use(authorize('admin'));

// Clear device alerts
monitoringRouter.delete('/alerts/:deviceId', async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    await monitoringService.clearAlerts(deviceId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});