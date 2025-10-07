import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get all events
 * @route GET /api/events
 */
export const getAllEvents = async (req, res, next) => {
  try {
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
