import { getPrisma } from '../utils/prisma.js';

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
 * @swagger
 * /api/votes:
 *   post:
 *     summary: Enviar voto
 *     description: Registra un voto con ranking de candidatos (1º a 5º lugar)
 *     tags: [Votes]
 *     security:
 *       - TenantHeader: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstPlace
 *               - secondPlace
 *               - thirdPlace
 *               - fourthPlace
 *               - fifthPlace
 *             properties:
 *               firstPlace:
 *                 type: string
 *                 format: uuid
 *                 description: ID del candidato en 1º lugar
 *                 example: 123e4567-e89b-12d3-a456-426614174000
 *               secondPlace:
 *                 type: string
 *                 format: uuid
 *                 description: ID del candidato en 2º lugar
 *                 example: 123e4567-e89b-12d3-a456-426614174001
 *               thirdPlace:
 *                 type: string
 *                 format: uuid
 *                 description: ID del candidato en 3º lugar
 *                 example: 123e4567-e89b-12d3-a456-426614174002
 *               fourthPlace:
 *                 type: string
 *                 format: uuid
 *                 description: ID del candidato en 4º lugar
 *                 example: 123e4567-e89b-12d3-a456-426614174003
 *               fifthPlace:
 *                 type: string
 *                 format: uuid
 *                 description: ID del candidato en 5º lugar
 *                 example: 123e4567-e89b-12d3-a456-426614174004
 *               voterEmail:
 *                 type: string
 *                 format: email
 *                 description: Email del votante (opcional)
 *                 example: votante@example.com
 *               voterName:
 *                 type: string
 *                 description: Nombre del votante (opcional)
 *                 example: Juan Pérez
 *     responses:
 *       201:
 *         description: Voto registrado exitosamente
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
 *                   example: '¡Voto registrado exitosamente! Gracias por participar.'
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: 123e4567-e89b-12d3-a456-426614174000
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: '2024-01-01T00:00:00.000Z'
 *       400:
 *         description: Error en la validación del voto
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
export const submitVote = async (req, res, next) => {
  try {
    const prisma = getPrisma(req.tenantId);
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
      where: {
        tenantId_voterIp: {
          tenantId: req.tenantId,
          voterIp
        }
      }
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
 * @swagger
 * /api/votes/check:
 *   get:
 *     summary: Verificar estado de voto
 *     description: Verifica si la IP actual ya ha votado
 *     tags: [Votes]
 *     security:
 *       - TenantHeader: []
 *     responses:
 *       200:
 *         description: Estado de voto obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 hasVoted:
 *                   type: boolean
 *                   description: Indica si ya se ha votado desde esta IP
 *                   example: false
 *                 voteDate:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                   description: Fecha del voto si ya se ha votado
 *                   example: '2024-01-01T00:00:00.000Z'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const checkVoteStatus = async (req, res, next) => {
  try {
    const prisma = getPrisma(req.tenantId);
    const voterIp = getClientIp(req);

    const existingVote = await prisma.vote.findUnique({
      where: {
        tenantId_voterIp: {
          tenantId: req.tenantId,
          voterIp
        }
      },
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
 * @swagger
 * /api/votes/count:
 *   get:
 *     summary: Obtener conteo total de votos
 *     description: Retorna el número total de votos registrados
 *     tags: [Votes]
 *     security:
 *       - TenantHeader: []
 *     responses:
 *       200:
 *         description: Conteo de votos obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalVotes:
 *                       type: integer
 *                       example: 150
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const getVoteCount = async (req, res, next) => {
  try {
    const prisma = getPrisma(req.tenantId);
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
 * @swagger
 * /api/votes:
 *   get:
 *     summary: Obtener todos los votos (Admin)
 *     description: Retorna una lista paginada de todos los votos registrados
 *     tags: [Votes]
 *     security:
 *       - TenantHeader: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *           maximum: 1000
 *         description: Número máximo de votos a retornar
 *         example: 100
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *           minimum: 0
 *         description: Número de votos a omitir
 *         example: 0
 *     responses:
 *       200:
 *         description: Lista de votos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Vote'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 150
 *                     limit:
 *                       type: integer
 *                       example: 100
 *                     offset:
 *                       type: integer
 *                       example: 0
 *                     hasMore:
 *                       type: boolean
 *                       example: true
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const getAllVotes = async (req, res, next) => {
  try {
    const prisma = getPrisma(req.tenantId);
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
