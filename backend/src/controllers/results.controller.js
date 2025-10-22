import { getPrisma } from '../utils/prisma.js';
import { POINTS } from '../constants/points.js';

/**
 * Calculate results based on ranked voting
 * @route GET /api/results/calculate
 */
export const calculateResults = async (req, res, next) => {
  try {
    const prisma = getPrisma(req.tenantId);
    // Get all votes
    const votes = await prisma.vote.findMany({
      select: {
        firstPlace: true,
        secondPlace: true,
        thirdPlace: true,
        fourthPlace: true,
        fifthPlace: true
      }
    });

    if (votes.length === 0) {
      return res.json({
        success: true,
        data: {
          totalVotes: 0,
          maxPossiblePoints: 0,
          calculatedAt: new Date(),
          results: []
        }
      });
    }

    // Calculate points for each candidate
    const candidatePoints = {};

    votes.forEach(vote => {
      // First place
      if (!candidatePoints[vote.firstPlace]) {
        candidatePoints[vote.firstPlace] = { points: 0, positions: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
      }
      candidatePoints[vote.firstPlace].points += POINTS.firstPlace;
      candidatePoints[vote.firstPlace].positions[1]++;

      // Second place
      if (!candidatePoints[vote.secondPlace]) {
        candidatePoints[vote.secondPlace] = { points: 0, positions: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
      }
      candidatePoints[vote.secondPlace].points += POINTS.secondPlace;
      candidatePoints[vote.secondPlace].positions[2]++;

      // Third place
      if (!candidatePoints[vote.thirdPlace]) {
        candidatePoints[vote.thirdPlace] = { points: 0, positions: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
      }
      candidatePoints[vote.thirdPlace].points += POINTS.thirdPlace;
      candidatePoints[vote.thirdPlace].positions[3]++;

      // Fourth place
      if (!candidatePoints[vote.fourthPlace]) {
        candidatePoints[vote.fourthPlace] = { points: 0, positions: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
      }
      candidatePoints[vote.fourthPlace].points += POINTS.fourthPlace;
      candidatePoints[vote.fourthPlace].positions[4]++;

      // Fifth place
      if (!candidatePoints[vote.fifthPlace]) {
        candidatePoints[vote.fifthPlace] = { points: 0, positions: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
      }
      candidatePoints[vote.fifthPlace].points += POINTS.fifthPlace;
      candidatePoints[vote.fifthPlace].positions[5]++;
    });

    // Get candidate details
    const candidateIds = Object.keys(candidatePoints);
    const candidates = await prisma.candidate.findMany({
      where: {
        id: { in: candidateIds }
      }
    });

    // Calculate maximum possible points
    const totalVotes = votes.length;
    const maxPossiblePoints = totalVotes * POINTS.firstPlace;

    // Build results array
    const results = candidates.map(candidate => {
      const stats = candidatePoints[candidate.id];
      const percentage = (stats.points / maxPossiblePoints) * 100;

      return {
        candidateId: candidate.id,
        candidateName: candidate.name,
        municipality: candidate.municipality,
        photoUrl: candidate.photoUrl,
        totalPoints: stats.points,
        percentage: parseFloat(percentage.toFixed(2)),
        votes: {
          firstPlace: stats.positions[1],
          secondPlace: stats.positions[2],
          thirdPlace: stats.positions[3],
          fourthPlace: stats.positions[4],
          fifthPlace: stats.positions[5],
          total: Object.values(stats.positions).reduce((a, b) => a + b, 0)
        }
      };
    });

    // Sort by points (descending)
    results.sort((a, b) => b.totalPoints - a.totalPoints);

    // Add ranking position
    results.forEach((result, index) => {
      result.position = index + 1;
    });

    res.json({
      success: true,
      data: {
        totalVotes,
        maxPossiblePoints,
        calculatedAt: new Date(),
        results
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get top candidates
 * @route GET /api/results/top
 */
export const getTopCandidates = async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;

    // Reuse calculate logic
    const calculationResult = await calculateResults(
      { query: {}, tenantId: req.tenantId },
      {
        json: (data) => data,
        status: () => ({ json: (data) => data })
      },
      (error) => {
        throw error;
      }
    );

    if (!calculationResult.success) {
      return res.status(404).json(calculationResult);
    }

    const topCandidates = calculationResult.data.results.slice(0, parseInt(limit));

    res.json({
      success: true,
      data: {
        totalVotes: calculationResult.data.totalVotes,
        calculatedAt: calculationResult.data.calculatedAt,
        top: topCandidates
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get candidate ranking position
 * @route GET /api/results/candidate/:id
 */
export const getCandidateResult = async (req, res, next) => {
  try {
    const prisma = getPrisma(req.tenantId);
    const { id } = req.params;

    // Check if candidate exists
    const candidate = await prisma.candidate.findUnique({
      where: { id }
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidato no encontrado'
      });
    }

    // Calculate all results
    const calculationResult = await calculateResults(
      { query: {}, tenantId: req.tenantId },
      {
        json: (data) => data,
        status: () => ({ json: (data) => data })
      },
      (error) => {
        throw error;
      }
    );

    if (!calculationResult.success) {
      return res.status(404).json(calculationResult);
    }

    // Find candidate in results
    const candidateResult = calculationResult.data.results.find(
      r => r.candidateId === id
    );

    if (!candidateResult) {
      return res.status(404).json({
        success: false,
        message: 'Este candidato aún no tiene votos'
      });
    }

    res.json({
      success: true,
      data: {
        totalVotes: calculationResult.data.totalVotes,
        calculatedAt: calculationResult.data.calculatedAt,
        result: candidateResult
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Save/persist results snapshot
 * @route POST /api/results/save
 */
export const saveResults = async (req, res, next) => {
  try {
    const prisma = getPrisma(req.tenantId);
    // Calculate current results
    const calculationResult = await calculateResults(
      { query: {}, tenantId: req.tenantId },
      {
        json: (data) => data,
        status: () => ({ json: (data) => data })
      },
      (error) => {
        throw error;
      }
    );

    if (!calculationResult.success) {
      return res.status(404).json(calculationResult);
    }

    // Delete previous results
    await prisma.result.deleteMany({});

    // Save new results
    const resultsToSave = calculationResult.data.results.map(result => ({
      candidateId: result.candidateId,
      position: result.position,
      votes: result.totalPoints,
      percentage: result.percentage
    }));

    await prisma.result.createMany({
      data: resultsToSave
    });

    res.json({
      success: true,
      message: 'Resultados guardados exitosamente',
      data: {
        savedResults: resultsToSave.length,
        calculatedAt: calculationResult.data.calculatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get saved results
 * @route GET /api/results
 */
export const getSavedResults = async (req, res, next) => {
  try {
    const prisma = getPrisma(req.tenantId);
    const results = await prisma.result.findMany({
      orderBy: {
        position: 'asc'
      },
      include: {
        candidate: {
          select: {
            id: true,
            name: true,
            municipality: true,
            photoUrl: true
          }
        }
      }
    });

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No hay resultados guardados'
      });
    }

    res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    next(error);
  }
};