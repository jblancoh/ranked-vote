import express from 'express';
import {
  getAllCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  toggleCandidateStatus
} from '../controllers/candidates.controller.js';

const router = express.Router();

/**
 * @route   GET /api/candidates
 * @desc    Get all candidates with optional filters
 * @query   filter - Search text that applies to name OR municipality (partial match)
 * @access  Public
 * @example GET /api/candidates?filter=juan (searches in name OR municipality)
 */
router.get('/', getAllCandidates);

/**
 * @route   GET /api/candidates/:id
 * @desc    Get candidate by ID
 * @access  Public
 */
router.get('/:id', getCandidateById);

/**
 * @route   POST /api/candidates
 * @desc    Create new candidate
 * @access  Private (should add auth middleware)
 */
router.post('/', createCandidate);

/**
 * @route   PUT /api/candidates/:id
 * @desc    Update candidate
 * @access  Private (should add auth middleware)
 */
router.put('/:id', updateCandidate);

/**
 * @route   DELETE /api/candidates/:id
 * @desc    Delete candidate
 * @access  Private (should add auth middleware)
 */
router.delete('/:id', deleteCandidate);

/**
 * @route   PATCH /api/candidates/:id/toggle
 * @desc    Toggle candidate active status
 * @access  Private (should add auth middleware)
 */
router.patch('/:id/toggle', toggleCandidateStatus);

export default router;
