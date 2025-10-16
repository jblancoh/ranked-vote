import { getPrisma } from '../utils/prisma.js';

/**
 * Get all events
 * @route GET /api/events
 */
export const getAllEvents = async (req, res, next) => {
  try {
    const prisma = getPrisma(req.tenantId);
    const { active } = req.query;

    const whereClause = active !== undefined
      ? { active: active === 'true' }
      : {};

    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: {
        startDate: 'desc'
      }
    });

    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current/active event
 * @route GET /api/events/current
 */
export const getCurrentEvent = async (req, res, next) => {
  try {
    const prisma = getPrisma(req.tenantId);
    const now = new Date();

    const currentEvent = await prisma.event.findFirst({
      where: {
        active: true,
        startDate: { lte: now },
        endDate: { gte: now }
      },
      orderBy: {
        startDate: 'desc'
      }
    });

    if (!currentEvent) {
      return res.status(404).json({
        success: false,
        message: 'No hay eventos activos en este momento'
      });
    }

    res.json({
      success: true,
      data: currentEvent
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get event by ID
 * @route GET /api/events/:id
 */
export const getEventById = async (req, res, next) => {
  try {
    const prisma = getPrisma(req.tenantId);
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new event
 * @route POST /api/events
 */
export const createEvent = async (req, res, next) => {
  try {
    const prisma = getPrisma(req.tenantId);
    const { name, description, startDate, endDate, votingOpen } = req.body;

    const event = await prisma.event.create({
      data: {
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        votingOpen: votingOpen || false
      }
    });

    res.status(201).json({
      success: true,
      message: 'Evento creado exitosamente',
      data: event
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update event
 * @route PUT /api/events/:id
 */
export const updateEvent = async (req, res, next) => {
  try {
    const prisma = getPrisma(req.tenantId);
    const { id } = req.params;
    const { name, description, startDate, endDate, active, votingOpen } = req.body;

    const existingEvent = await prisma.event.findUnique({
      where: { id }
    });

    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(startDate !== undefined && { startDate: new Date(startDate) }),
        ...(endDate !== undefined && { endDate: new Date(endDate) }),
        ...(active !== undefined && { active }),
        ...(votingOpen !== undefined && { votingOpen })
      }
    });

    res.json({
      success: true,
      message: 'Evento actualizado exitosamente',
      data: event
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete event
 * @route DELETE /api/events/:id
 */
export const deleteEvent = async (req, res, next) => {
  try {
    const prisma = getPrisma(req.tenantId);
    const { id } = req.params;

    const existingEvent = await prisma.event.findUnique({
      where: { id }
    });

    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    await prisma.event.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Evento eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle voting status
 * @route PATCH /api/events/:id/voting
 */
export const toggleVotingStatus = async (req, res, next) => {
  try {
    const prisma = getPrisma(req.tenantId);
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        votingOpen: !event.votingOpen
      }
    });

    res.json({
      success: true,
      message: `Votación ${updatedEvent.votingOpen ? 'abierta' : 'cerrada'} exitosamente`,
      data: updatedEvent
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get stats (total votes, hourly turnout, top 5 candidates.)
 * @route GET /api/events/:id/stats
 */
export const getEventStats = async (req, res, next) => {
  const prisma = getPrisma(req.tenantId);
  const { id } = req.params;
  const POINTS = {
    firstPlace: 5,
    secondPlace: 4,
    thirdPlace: 3,
    fourthPlace: 2,
    fifthPlace: 1,
  };

  try {
    const event = await prisma.event.findUnique({
      where: { id: id },
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Evento no encontrado",
      });
    }
    // Total de votos
    const votes = await prisma.vote.findMany({
      where: { eventId: Number(id) },
    });

    // Votos por hora y calculo de puntajes por candidatos
    const votesByHour = {};
    const pointsByCandidate = {};
    for (const vote of votes) {
      const hour = vote.createdAt.getHours();
      votesByHour[hour] = (votesByHour[hour] || 0) + 1;

      pointsByCandidate[vote.firstPlace] =
        (pointsByCandidate[vote.firstPlace] || 0) + POINTS.firstPlace;
      pointsByCandidate[vote.secondPlace] =
        (pointsByCandidate[vote.secondPlace] || 0) + POINTS.secondPlace;
      pointsByCandidate[vote.thirdPlace] =
        (pointsByCandidate[vote.thirdPlace] || 0) + POINTS.thirdPlace;
      pointsByCandidate[vote.fourthPlace] =
        (pointsByCandidate[vote.fourthPlace] || 0) + POINTS.fourthPlace;
      pointsByCandidate[vote.fifthPlace] =
        (pointsByCandidate[vote.fifthPlace] || 0) + POINTS.fifthPlace;
    }

    // Top 5 candidatos
    const topCandidatesArray = Object.entries(pointsByCandidate)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const pointsMap = new Map(topCandidatesArray);

    const candidateIds = Array.from(pointsMap.keys());
    const candidateDetails = await prisma.candidate.findMany({
      where: { id: { in: candidateIds } },
      select: {
        id: true,
        name: true,
        municipality: true,
        photoUrl: true,
        bio: true,
      },
    });

    const candidatesWithPoints = candidateDetails.map((detail) => {
      return {
        ...detail,
        points: pointsMap.get(detail.id) || 0,
      };
    });

    const candidates = candidatesWithPoints.sort((a, b) => b.points - a.points);

    res.json({
      success: true,
      data: {
        totalVotes: votes.length,
        votesByHour,
        topCandidates: candidates,
      },
    });
  } catch (error) {
    next(error);
  }
};
