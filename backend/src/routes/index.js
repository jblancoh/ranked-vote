import express from 'express';

const router = express.Router();

// Placeholder route
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Vota Flor API' });
});

export default router;
