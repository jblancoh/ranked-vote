import express from 'express';
import {
  calculateResults,
  getTopCandidates,
  getCandidateResult,
  saveResults,
  getSavedResults
} from '../controllers/results.controller.js';

const router = express.Router();

/**
 * @route   GET /api/results/calculate
 * @desc    Calculate live results
 * @access  Public
 */
router.get('/calculate', calculateResults);

/**
 * @route   GET /api/results/top
 * @desc    Get top N candidates
 * @access  Public
 */
router.get('/top', getTopCandidates);

/**
 * @route   GET /api/results/candidate/:id
 * @desc    Get specific candidate result
 * @access  Public
 */
router.get('/candidate/:id', getCandidateResult);

/**
 * @route   POST /api/results/save
 * @desc    Save/persist results snapshot
 * @access  Private (should add auth middleware)
 */
router.post('/save', saveResults);

/**
 * @route   GET /api/results
 * @desc    Get saved results
 * @access  Public
 */
router.get('/', getSavedResults);

export default router;
