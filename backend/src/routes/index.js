import express from 'express';
import candidatesRoutes from './candidates.routes.js';
import votesRoutes from './votes.routes.js';
import resultsRoutes from './results.routes.js';
import eventsRoutes from './events.routes.js';

const router = express.Router();

// API version and info
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Vota Flor API v1.0',
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