import express from 'express';
import candidatesRoutes from './candidates.routes.js';
import votesRoutes from './votes.routes.js';
import resultsRoutes from './results.routes.js';
import eventsRoutes from './events.routes.js';

const router = express.Router();

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Información de la API
 *     description: Retorna información general sobre la API y sus endpoints disponibles
 *     tags: [API Info]
 *     security:
 *       - TenantHeader: []
 *     responses:
 *       200:
 *         description: Información de la API obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Ranked Vote API v1.0'
 *                 version:
 *                   type: string
 *                   example: '1.0.0'
 *                 endpoints:
 *                   type: object
 *                   properties:
 *                     events:
 *                       type: string
 *                       example: '/api/events'
 *                     candidates:
 *                       type: string
 *                       example: '/api/candidates'
 *                     votes:
 *                       type: string
 *                       example: '/api/votes'
 *                     results:
 *                       type: string
 *                       example: '/api/results'
 *                 documentation:
 *                   type: string
 *                   example: 'https://github.com/dev-night-talk/vota-flor/blob/main/docs/API.md'
 */

// API version and info
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Ranked Vote API v1.0',
    version: '1.0.0',
    endpoints: {
      events: '/api/events',
      candidates: '/api/candidates',
      votes: '/api/votes',
      results: '/api/results'
    },
    documentation: 'https://github.com/dev-night-talk/vota-flor/blob/main/docs/API.md'
  });
});

// Mount routes
router.use('/events', eventsRoutes);
router.use('/candidates', candidatesRoutes);
router.use('/votes', votesRoutes);
router.use('/results', resultsRoutes);

export default router;