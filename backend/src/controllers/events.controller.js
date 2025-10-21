import { getPrisma } from '../utils/prisma.js';

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Obtener todos los eventos
 *     description: Retorna una lista de eventos con opción de filtrar por estado activo
 *     tags: [Events]
 *     security:
 *       - TenantHeader: []
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filtrar eventos por estado activo (true/false)
 *         example: true
 *     responses:
 *       200:
 *         description: Lista de eventos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 1
 *                   description: Número de eventos en la respuesta
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "cmgk803u00010sajt87w66zpv"
 *                         description: ID único del evento
 *                       tenantId:
 *                         type: string
 *                         example: "cmgk803t00000sajte670dar0"
 *                         description: ID del tenant (multi-tenant)
 *                       name:
 *                         type: string
 *                         example: "Certamen Flor de Tabasco 2026"
 *                         description: Nombre del evento
 *                       description:
 *                         type: string
 *                         example: "Elección de la representante floral de Tabasco"
 *                         description: Descripción del evento
 *                       startDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-04-01T00:00:00.000Z"
 *                         description: Fecha y hora de inicio del evento
 *                       endDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-04-30T23:59:59.000Z"
 *                         description: Fecha y hora de fin del evento
 *                       active:
 *                         type: boolean
 *                         example: true
 *                         description: Estado activo del evento
 *                       votingOpen:
 *                         type: boolean
 *                         example: true
 *                         description: Estado de la votación (abierta/cerrada)
 *                       config:
 *                         type: object
 *                         example: {}
 *                         description: Configuración adicional del evento
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-10-10T02:21:32.904Z"
 *                         description: Fecha de creación del evento
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-10-10T02:21:32.904Z"
 *                         description: Fecha de última actualización del evento
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 * @swagger
 * /api/events/current:
 *   get:
 *     summary: Obtener evento actual
 *     description: Retorna el evento que está actualmente activo y dentro del rango de fechas
 *     tags: [Events]
 *     security:
 *       - TenantHeader: []
 *     responses:
 *       200:
 *         description: Evento actual encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Event'
 *       404:
 *         description: No hay eventos activos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Obtener evento por ID
 *     description: Retorna los detalles de un evento específico por su ID
 *     tags: [Events]
 *     security:
 *       - TenantHeader: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del evento
 *         example: 123e4567-e89b-12d3-a456-426614174000
 *     responses:
 *       200:
 *         description: Evento encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Event'
 *       404:
 *         description: Evento no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 * @swagger
 * /api/events:
 *   post:
 *     summary: Crear nuevo evento
 *     description: Crea un nuevo evento en el sistema
 *     tags: [Events]
 *     security:
 *       - TenantHeader: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - startDate
 *               - endDate
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del evento
 *                 example: 'Festival Cultural 2024'
 *               description:
 *                 type: string
 *                 description: Descripción del evento
 *                 example: 'Evento cultural con votación comunitaria'
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora de inicio del evento
 *                 example: '2024-01-01T00:00:00.000Z'
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora de fin del evento
 *                 example: '2024-01-31T23:59:59.000Z'
 *               votingOpen:
 *                 type: boolean
 *                 description: Estado de la votación
 *                 example: true
 *     responses:
 *       201:
 *         description: Evento creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Evento creado exitosamente'
 *                 data:
 *                   $ref: '#/components/schemas/Event'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Actualizar evento
 *     description: Actualiza los datos de un evento existente
 *     tags: [Events]
 *     security:
 *       - TenantHeader: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del evento
 *         example: 123e4567-e89b-12d3-a456-426614174000
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del evento
 *                 example: 'Festival Cultural 2024'
 *               description:
 *                 type: string
 *                 description: Descripción del evento
 *                 example: 'Evento cultural con votación comunitaria'
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora de inicio del evento
 *                 example: '2024-01-01T00:00:00.000Z'
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora de fin del evento
 *                 example: '2024-01-31T23:59:59.000Z'
 *               active:
 *                 type: boolean
 *                 description: Estado activo del evento
 *                 example: true
 *               votingOpen:
 *                 type: boolean
 *                 description: Estado de la votación
 *                 example: true
 *     responses:
 *       200:
 *         description: Evento actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Evento actualizado exitosamente'
 *                 data:
 *                   $ref: '#/components/schemas/Event'
 *       404:
 *         description: Evento no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Eliminar evento
 *     description: Elimina un evento del sistema
 *     tags: [Events]
 *     security:
 *       - TenantHeader: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del evento
 *         example: 123e4567-e89b-12d3-a456-426614174000
 *     responses:
 *       200:
 *         description: Evento eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Evento eliminado exitosamente'
 *       404:
 *         description: Evento no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 * @swagger
 * /api/events/{id}/voting:
 *   patch:
 *     summary: Cambiar estado de votación del evento
 *     description: Alterna el estado de votación (abierta/cerrada) de un evento
 *     tags: [Events]
 *     security:
 *       - TenantHeader: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del evento
 *         example: 123e4567-e89b-12d3-a456-426614174000
 *     responses:
 *       200:
 *         description: Estado de votación actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Votación abierta exitosamente'
 *                 data:
 *                   $ref: '#/components/schemas/Event'
 *       404:
 *         description: Evento no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
