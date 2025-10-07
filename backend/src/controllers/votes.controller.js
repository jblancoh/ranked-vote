import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get client IP address
 */
const getClientIp = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() ||
         req.headers['x-real-ip'] ||
         req.connection.remoteAddress ||
         req.socket.remoteAddress ||
         req.ip;
};

/**
 * Submit a vote
 * @route POST /api/votes
 */
export const submitVote = async (req, res, next) => {
  try {
    // Accept both formats: firstPlace/first, secondPlace/second, etc.
    const {
      firstPlace: fp,
      secondPlace: sp,
      thirdPlace: tp,
      fourthPlace: fop,
      fifthPlace: fip,
      first,
      second,
      third,
      fourth,
      fifth,
      voterEmail,
      voterName
    } = req.body;

    const firstPlace = fp || first;
    const secondPlace = sp || second;
    const thirdPlace = tp || third;
    const fourthPlace = fop || fourth;
    const fifthPlace = fip || fifth;

    const voterIp = getClientIp(req);

    // Check if IP has already voted
    const existingVote = await prisma.vote.findUnique({
      where: { voterIp }
    });

    if (existingVote) {
      return res.status(400).json({
        success: false,
        message: 'Ya has votado anteriormente. Solo se permite un voto por persona.'
      });
    }

    // Validate all positions are different candidates
    const positions = [firstPlace, secondPlace, thirdPlace, fourthPlace, fifthPlace];
    const uniquePositions = new Set(positions);

    if (uniquePositions.size !== positions.length) {
      return res.status(400).json({
        success: false,
        message: 'No puedes votar por el mismo candidato en múltiples posiciones'
      });
    }

    // Validate all candidates exist and are active
    const candidates = await prisma.candidate.findMany({
      where: {
        id: { in: positions },
        active: true
      }
    });

    if (candidates.length !== positions.length) {
      return res.status(400).json({
        success: false,
        message: 'Uno o más candidatos seleccionados no son válidos o están inactivos'
      });
    }

    // Create vote
    const vote = await prisma.vote.create({
      data: {
        voterIp,
        voterEmail,
        firstPlace,
        secondPlace,
        thirdPlace,
        fourthPlace,
        fifthPlace
      }
    });

    res.status(201).json({
      success: true,
      message: '¡Voto registrado exitosamente! Gracias por participar.',
      data: {
        id: vote.id,
        createdAt: vote.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Check if IP has already voted
 * @route GET /api/votes/check
 */
export const checkVoteStatus = async (req, res, next) => {
  try {
    const voterIp = getClientIp(req);

    const existingVote = await prisma.vote.findUnique({
      where: { voterIp },
      select: {
        id: true,
        createdAt: true
      }
    });

    res.json({
      success: true,
      hasVoted: !!existingVote,
      voteDate: existingVote?.createdAt || null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get total vote count
 * @route GET /api/votes/count
 */
export const getVoteCount = async (req, res, next) => {
  try {
    const totalVotes = await prisma.vote.count();

    res.json({
      success: true,
      data: {
        totalVotes
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all votes (admin only - should be protected)
 * @route GET /api/votes
 */
export const getAllVotes = async (req, res, next) => {
  try {
    const { limit = 100, offset = 0 } = req.query;

    const votes = await prisma.vote.findMany({
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        voterIp: true,
        voterEmail: true,
        firstPlace: true,
        secondPlace: true,
        thirdPlace: true,
        fourthPlace: true,
        fifthPlace: true,
        createdAt: true
      }
    });

    const totalVotes = await prisma.vote.count();

    res.json({
      success: true,
      data: votes,
      pagination: {
        total: totalVotes,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + votes.length < totalVotes
      }
    });
  } catch (error) {
    next(error);
  }
};
