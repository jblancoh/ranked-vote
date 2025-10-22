import { getPrisma } from '../utils/prisma.js';
import { POINTS } from '../constants/points.js';
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

  try {
    const [event, totalVotes, topCandidatesAgg, votesByHourAgg] = await prisma.$transaction([
      prisma.event.findUnique({ where: { id } }),

      prisma.vote.count({ where: { eventId: id } }),

      prisma.$queryRaw`
        SELECT candidateId AS "candidateId", SUM(points)::integer AS points
        FROM (
          SELECT "firstPlace" AS candidateId, ${POINTS.firstPlace} AS points FROM votes WHERE "eventId" = ${id}
              UNION ALL
              SELECT "secondPlace" AS candidateId, ${POINTS.secondPlace} AS points FROM votes WHERE "eventId" = ${id}
              UNION ALL
              SELECT "thirdPlace" AS candidateId, ${POINTS.thirdPlace} AS points FROM votes WHERE "eventId" = ${id}
              UNION ALL
              SELECT "fourthPlace" AS candidateId, ${POINTS.fourthPlace} AS points FROM votes WHERE "eventId" = ${id}
              UNION ALL
              SELECT "fifthPlace" AS candidateId, ${POINTS.fifthPlace} AS points FROM votes WHERE "eventId" = ${id}
            ) AS unpivoted_votes
          WHERE candidateId IS NOT NULL
          GROUP BY candidateId
          ORDER BY points DESC
          LIMIT 5
      `,
      
      prisma.$queryRaw`
        SELECT EXTRACT(hour FROM "createdAt")::integer AS hour, COUNT(*)::integer AS count
        FROM votes
        WHERE "eventId" = ${id}
        GROUP BY hour
      `
    ]);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado',
      });
    }

    const votesByHour = votesByHourAgg.reduce((acc, row) => {
      acc[row.hour] = row.count;
      return acc;
    }, {});
    
    let topCandidates = [];
    if (topCandidatesAgg.length > 0) {
      
      const candidateIds = topCandidatesAgg.map(c => c.candidateId);

      const candidateDetails = await prisma.candidate.findMany({
        where: { id: { in: candidateIds } },
        select: { id: true, name: true, municipality: true, photoUrl: true, bio: true }
      });

      const pointsMap = new Map(topCandidatesAgg.map(c => [c.candidateId, c.points]));
      
      topCandidates = candidateDetails
        .map(detail => ({
          ...detail,
          points: pointsMap.get(detail.id) || 0,
        }))
        .sort((a, b) => b.points - a.points); //ordenamos por si findMany no respeta el orden
    }

    res.json({
      success: true,
      data: {
        totalVotes,
        votesByHour,
        topCandidates,
      },
    });

  } catch (error) {
    next(error);
  }
};