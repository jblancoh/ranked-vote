import express from 'express';
import {
  getAllEvents,
  getCurrentEvent,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  toggleVotingStatus
} from '../controllers/events.controller.js';

const router = express.Router();

/**
 * @route   GET /api/events/current
 * @desc    Get current/active event
 * @access  Public
 */
router.get('/current', getCurrentEvent);

/**
 * @route   GET /api/events
 * @desc    Get all events
 * @access  Public
 */
router.get('/', getAllEvents);

/**
 * @route   GET /api/events/:id
 * @desc    Get event by ID
 * @access  Public
 */
router.get('/:id', getEventById);

/**
 * @route   POST /api/events
 * @desc    Create new event
 * @access  Private (should add auth middleware)
 */
router.post('/', createEvent);

/**
 * @route   PUT /api/events/:id
 * @desc    Update event
 * @access  Private (should add auth middleware)
 */
router.put('/:id', updateEvent);

/**
 * @route   DELETE /api/events/:id
 * @desc    Delete event
 * @access  Private (should add auth middleware)
 */
router.delete('/:id', deleteEvent);

/**
 * @route   PATCH /api/events/:id/voting
 * @desc    Toggle voting status
 * @access  Private (should add auth middleware)
 */
router.patch('/:id/voting', toggleVotingStatus);

export default router;
