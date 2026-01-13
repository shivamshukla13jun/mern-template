import { Router } from 'express';
import {
  runJobNow,
  getJobStatus,
  startAllJobs,
  stopAllJobs,
} from './cron.controller';
import { authenticate } from '../../middlewares/auth';
import { requireRole } from '../../middlewares/permission';

const router = Router();

// Admin only routes
router.post('/run-now', authenticate, requireRole('admin'), runJobNow);
router.get('/status', authenticate, requireRole('admin'), getJobStatus);
router.post('/start', authenticate, requireRole('admin'), startAllJobs);
router.post('/stop', authenticate, requireRole('admin'), stopAllJobs);

export default router;
