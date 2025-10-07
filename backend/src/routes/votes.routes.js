import express from 'express';
import {
  submitVote,
  checkVoteStatus,
  getVoteCount,
  getAllVotes
} from '../controllers/votes.controller.js';

const router = express.Router();

/**
 * @route   POST /api/votes
 * @desc    Submit a vote
 * @access  Public
 */
router.post('/', submitVote);

/**
 * @route   GET /api/votes/check
 * @desc    Check if IP has already voted
 * @access  Public
 */
router.get('/check', checkVoteStatus);

/**
 * @route   GET /api/votes/count
 * @desc    Get total vote count
 * @access  Public
 */
router.get('/count', getVoteCount);

/**
 * @route   GET /api/votes
 * @desc    Get all votes
 * @access  Private (should add auth middleware)
 */
router.get('/', getAllVotes);

export default router;
