import { getPrisma } from '../utils/prisma.js';

/**
 * Sistema de puntuación para votación por ranking.
 * Define los puntos asignados a cada posición en el ranking.
 * 
 * @constant {Object} POINTS
 * @property {number} firstPlace=5 - Puntos para 1º lugar
 * @property {number} secondPlace=4 - Puntos para 2º lugar
 * @property {number} thirdPlace=3 - Puntos para 3º lugar
 * @property {number} fourthPlace=2 - Puntos para 4º lugar
 * @property {number} fifthPlace=1 - Puntos para 5º lugar
 * 
 * @example
 * // Obtener puntos para una posición
 * const pointsFor1st = POINTS.firstPlace; // 5
 * const totalMaxPoints = Object.values(POINTS).reduce((a, b) => a + b); // 15
 */
const POINTS = {
  firstPlace: 5,
  secondPlace: 4,
  thirdPlace: 3,
  fourthPlace: 2,
  fifthPlace: 1
};

/**
 * @swagger
 * /api/results/calculate:
 *   get:
 *     summary: Calcular resultados de votación
 *     description: Calcula los resultados basados en el sistema de votación por ranking (1º=5pts, 2º=4pts, etc.)
 *     tags: [Results]
 *     security:
 *       - TenantHeader: []
 *     responses:
 *       200:
 *         description: Resultados calculados exitosamente
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
 *                       description: Número total de votos
 *                     maxPossiblePoints:
 *                       type: integer
 *                       example: 750
 *                       description: Puntos máximos posibles
 *                     calculatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: '2024-01-01T00:00:00.000Z'
 *                     results:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           candidateId:
 *                             type: string
 *                             format: uuid
 *                           candidateName:
 *                             type: string
 *                           municipality:
 *                             type: string
 *                           photoUrl:
 *                             type: string
 *                             format: uri
 *                           totalPoints:
 *                             type: integer
 *                           percentage:
 *                             type: number
 *                             format: float
 *                           position:
 *                             type: integer
 *                           votes:
 *                             type: object
 *                             properties:
 *                               firstPlace:
 *                                 type: integer
 *                               secondPlace:
 *                                 type: integer
 *                               thirdPlace:
 *                                 type: integer
 *                               fourthPlace:
 *                                 type: integer
 *                               fifthPlace:
 *                                 type: integer
 *                               total:
 *                                 type: integer
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * Calcula los resultados de la votación basado en el sistema de ranking.
 * Sistema de puntos: 1º=5pts, 2º=4pts, 3º=3pts, 4º=2pts, 5º=1pt.
 * 
 * @async
 * @function calculateResults
 * @param {Object} req - Objeto de solicitud Express
 * @param {string} req.tenantId - ID del tenant (multi-tenancy)
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función middleware de siguiente
 * @returns {void} Envía respuesta JSON con resultados calculados
 * @throws {Error} Pasa errores al middleware de manejo de errores
 * 
 * @example
 * // Calcular resultados de votación
 * GET /api/results/calculate
 * 
 * // Respuesta exitosa (200)
 * {
 *   "success": true,
 *   "data": {
 *     "totalVotes": 150,
 *     "maxPossiblePoints": 750,
 *     "calculatedAt": "2025-10-23T10:30:00Z",
 *     "results": [
 *       {
 *         "candidateId": "id1",
 *         "candidateName": "Juan Pérez",
 *         "totalPoints": 425,
 *         "percentage": 56.67,
 *         "position": 1,
 *         "votes": {
 *           "firstPlace": 50,
 *           "secondPlace": 40,
 *           "thirdPlace": 30,
 *           "fourthPlace": 20,
 *           "fifthPlace": 10,
 *           "total": 150
 *         }
 *       }
 *     ]
 *   }
 * }
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
 * @swagger
 * /api/results/top:
 *   get:
 *     summary: Obtener candidatos top
 *     description: Retorna los candidatos mejor posicionados en los resultados
 *     tags: [Results]
 *     security:
 *       - TenantHeader: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *           minimum: 1
 *           maximum: 20
 *         description: Número de candidatos top a retornar
 *         example: 5
 *     responses:
 *       200:
 *         description: Candidatos top obtenidos exitosamente
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
 *                     calculatedAt:
 *                       type: string
 *                       format: date-time
 *                     top:
 *                       type: array
 *                       items:
 *                         type: object
 *                         description: Candidato con su posición y estadísticas
 *       404:
 *         description: No hay resultados disponibles
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

/**
 * Obtiene los candidatos mejor posicionados en los resultados.
 * Retorna los N candidatos con más puntos.
 * 
 * @async
 * @function getTopCandidates
 * @param {Object} req - Objeto de solicitud Express
 * @param {string} req.tenantId - ID del tenant (multi-tenancy)
 * @param {Object} req.query - Parámetros de consulta
 * @param {number} [req.query.limit=5] - Número de candidatos top a retornar (1-20)
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función middleware de siguiente
 * @returns {void} Envía respuesta JSON con candidatos top
 * @throws {Error} Pasa errores al middleware de manejo de errores
 * 
 * @example
 * // Obtener top 3 candidatos
 * GET /api/results/top?limit=3
 * 
 * // Respuesta exitosa (200)
 * {
 *   "success": true,
 *   "data": {
 *     "totalVotes": 150,
 *     "calculatedAt": "2025-10-23T10:30:00Z",
 *     "top": [
 *       {
 *         "candidateId": "id1",
 *         "candidateName": "Juan Pérez",
 *         "totalPoints": 425,
 *         "position": 1
 *       }
 *     ]
 *   }
 * }
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
 * @swagger
 * /api/results/candidate/{id}:
 *   get:
 *     summary: Obtener resultado de candidato específico
 *     description: Retorna la posición y estadísticas de un candidato específico
 *     tags: [Results]
 *     security:
 *       - TenantHeader: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del candidato
 *         example: 123e4567-e89b-12d3-a456-426614174000
 *     responses:
 *       200:
 *         description: Resultado del candidato obtenido exitosamente
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
 *                     calculatedAt:
 *                       type: string
 *                       format: date-time
 *                     result:
 *                       type: object
 *                       description: Resultado detallado del candidato
 *       404:
 *         description: Candidato no encontrado o sin votos
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

/**
 * Obtiene la posición y estadísticas de un candidato específico.
 * 
 * @async
 * @function getCandidateResult
 * @param {Object} req - Objeto de solicitud Express
 * @param {string} req.tenantId - ID del tenant (multi-tenancy)
 * @param {Object} req.params - Parámetros de ruta
 * @param {string} req.params.id - ID único del candidato
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función middleware de siguiente
 * @returns {void} Envía respuesta JSON con resultado del candidato
 * @throws {Error} Pasa errores al middleware de manejo de errores
 * 
 * @example
 * // Obtener resultado de candidato específico
 * GET /api/results/candidate/cmgk803tm000csajt6o5g9vem
 * 
 * // Respuesta exitosa (200)
 * {
 *   "success": true,
 *   "data": {
 *     "totalVotes": 150,
 *     "calculatedAt": "2025-10-23T10:30:00Z",
 *     "result": {
 *       "candidateId": "cmgk803tm000csajt6o5g9vem",
 *       "candidateName": "Juan Pérez",
 *       "totalPoints": 425,
 *       "percentage": 56.67,
 *       "position": 1,
 *       "votes": { ... }
 *     }
 *   }
 * }
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
 * @swagger
 * /api/results/save:
 *   post:
 *     summary: Guardar snapshot de resultados
 *     description: Calcula y guarda una instantánea de los resultados actuales en la base de datos
 *     tags: [Results]
 *     security:
 *       - TenantHeader: []
 *     responses:
 *       200:
 *         description: Resultados guardados exitosamente
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
 *                   example: 'Resultados guardados exitosamente'
 *                 data:
 *                   type: object
 *                   properties:
 *                     savedResults:
 *                       type: integer
 *                       example: 5
 *                       description: Número de resultados guardados
 *                     calculatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: '2024-01-01T00:00:00.000Z'
 *       404:
 *         description: No hay resultados para guardar
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

/**
 * Calcula y guarda una instantánea de los resultados actuales en la base de datos.
 * Reemplaza los resultados anteriores guardados con los nuevos cálculos.
 * 
 * @async
 * @function saveResults
 * @param {Object} req - Objeto de solicitud Express
 * @param {string} req.tenantId - ID del tenant (multi-tenancy)
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función middleware de siguiente
 * @returns {void} Envía respuesta JSON 200 con confirmación y número de resultados guardados
 * @throws {Error} Pasa errores al middleware de manejo de errores
 * 
 * @example
 * // Guardar resultados
 * POST /api/results/save
 * 
 * // Respuesta exitosa (200)
 * {
 *   "success": true,
 *   "message": "Resultados guardados exitosamente",
 *   "data": {
 *     "savedResults": 5,
 *     "calculatedAt": "2025-10-23T10:30:00Z"
 *   }
 * }
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
 * @swagger
 * /api/results:
 *   get:
 *     summary: Obtener resultados guardados
 *     description: Retorna los resultados que han sido guardados previamente como snapshot
 *     tags: [Results]
 *     security:
 *       - TenantHeader: []
 *     responses:
 *       200:
 *         description: Resultados guardados obtenidos exitosamente
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
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       candidateId:
 *                         type: string
 *                         format: uuid
 *                       position:
 *                         type: integer
 *                       votes:
 *                         type: integer
 *                       percentage:
 *                         type: number
 *                         format: float
 *                       candidate:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           name:
 *                             type: string
 *                           municipality:
 *                             type: string
 *                           photoUrl:
 *                             type: string
 *                             format: uri
 *       404:
 *         description: No hay resultados guardados
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

/**
 * Obtiene los resultados que han sido guardados previamente como snapshot.
 * Retorna los resultados en orden de posición.
 * 
 * @async
 * @function getSavedResults
 * @param {Object} req - Objeto de solicitud Express
 * @param {string} req.tenantId - ID del tenant (multi-tenancy)
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función middleware de siguiente
 * @returns {void} Envía respuesta JSON con resultados guardados
 * @throws {Error} Pasa errores al middleware de manejo de errores
 * 
 * @example
 * // Obtener resultados guardados
 * GET /api/results
 * 
 * // Respuesta exitosa (200)
 * {
 *   "success": true,
 *   "count": 5,
 *   "data": [
 *     {
 *       "candidateId": "id1",
 *       "position": 1,
 *       "votes": 425,
 *       "percentage": 56.67,
 *       "candidate": {
 *         "id": "id1",
 *         "name": "Juan Pérez",
 *         "municipality": "Villahermosa",
 *         "photoUrl": "https://example.com/photo.jpg"
 *       }
 *     }
 *   ]
 * }
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
