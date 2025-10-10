import express from 'express';
import {
  getAdminStats,
  getVoteStats,
  getCandidateStats,
  clearStatsCache
} from '../controllers/stats.controller.js';
import { requireAdmin } from '../middleware/auth.middleware.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiter for stats endpoints
const statsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: 'Demasiadas solicitudes de estadísticas, por favor intenta más tarde.'
});

// Apply rate limiting to all stats routes
router.use(statsLimiter);

/**
 * @route   GET /api/admin/stats
 * @desc    Get aggregated statistics for admin dashboard
 * @access  Admin only
 * @cache   5 minutes
 */
router.get('/', requireAdmin, getAdminStats);

/**
 * @route   GET /api/admin/stats/votes
 * @desc    Get detailed vote statistics
 * @access  Admin only
 */
router.get('/votes', requireAdmin, getVoteStats);

/**
 * @route   GET /api/admin/stats/candidates
 * @desc    Get candidate statistics with vote breakdown
 * @access  Admin only
 */
router.get('/candidates', requireAdmin, getCandidateStats);

/**
 * @route   POST /api/admin/stats/clear-cache
 * @desc    Clear statistics cache
 * @access  Admin only
 */
router.post('/clear-cache', requireAdmin, clearStatsCache);

export default router;
