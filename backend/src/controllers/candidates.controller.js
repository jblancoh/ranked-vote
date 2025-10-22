import { getPrisma } from "../utils/prisma.js";

/**
 * @swagger
 * /api/candidates:
 *   get:
 *     summary: Obtener todos los candidatos
 *     description: Retorna una lista paginada de candidatos con opción de filtrar por estado activo
 *     tags: [Candidates]
 *     security:
 *       - TenantHeader: []
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filtrar candidatos por estado activo (true/false)
 *         example: true
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página para paginación
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Número de elementos por página
 *         example: 10
 *     responses:
 *       200:
 *         description: Lista de candidatos obtenida exitosamente
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
 *                   description: Número de candidatos en la página actual
 *                 totalCount:
 *                   type: integer
 *                   example: 17
 *                   description: Número total de candidatos
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 2
 *                       description: Página actual
 *                     totalPages:
 *                       type: integer
 *                       example: 4
 *                       description: Total de páginas
 *                     limit:
 *                       type: integer
 *                       example: 5
 *                       description: Elementos por página
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                       description: Indica si hay página siguiente
 *                     hasPrevPage:
 *                       type: boolean
 *                       example: true
 *                       description: Indica si hay página anterior
 *                     nextPage:
 *                       type: integer
 *                       nullable: true
 *                       example: 3
 *                       description: Número de página siguiente (null si no hay)
 *                     prevPage:
 *                       type: integer
 *                       nullable: true
 *                       example: 1
 *                       description: Número de página anterior (null si no hay)
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "cmgk803tm000csajt6o5g9vem"
 *                         description: ID único del candidato
 *                       name:
 *                         type: string
 *                         example: "Embajadora Nacajuca"
 *                         description: Nombre del candidato
 *                       municipality:
 *                         type: string
 *                         example: "Nacajuca"
 *                         description: Municipio del candidato
 *                       photoUrl:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                         description: URL de la foto del candidato
 *                       bio:
 *                         type: string
 *                         example: "Representante del municipio de Nacajuca"
 *                         description: Biografía del candidato
 *                       order:
 *                         type: integer
 *                         example: 6
 *                         description: Orden de aparición del candidato
 *                       active:
 *                         type: boolean
 *                         example: true
 *                         description: Estado activo del candidato
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-10-10T02:21:32.891Z"
 *                         description: Fecha de creación
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-10-10T02:21:32.891Z"
 *                         description: Fecha de última actualización
 *                       _count:
 *                         type: object
 *                         properties:
 *                           votes:
 *                             type: integer
 *                             example: 0
 *                             description: Número de votos recibidos
 *       400:
 *         description: Parámetros de paginación inválidos
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
export const getAllCandidates = async (req, res, next) => {
  try {
    const prisma = getPrisma(req.tenantId);
    const { active, page = 1, limit = 20 } = req.query;

    // Parse pagination parameters
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // Validate pagination parameters
    if (pageNumber < 1 || limitNumber < 1 || limitNumber > 100) {
      return res.status(400).json({
        success: false,
        message:
          "Parámetros de paginación inválidos. page debe ser >= 1, limit debe estar entre 1 y 100",
      });
    }

    const whereClause =
      active !== undefined ? { active: active === "true" } : {};

    // Get total count for pagination metadata
    const totalCount = await prisma.candidate.count({
      where: whereClause,
    });

    // Get paginated candidates
    const candidates = await prisma.candidate.findMany({
      where: whereClause,
      orderBy: {
        order: "asc",
      },
      select: {
        id: true,
        name: true,
        municipality: true,
        photoUrl: true,
        bio: true,
        order: true,
        active: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { votes: true },
        },
      },
      skip,
      take: limitNumber,
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNumber);
    const hasNextPage = pageNumber < totalPages;
    const hasPrevPage = pageNumber > 1;

    res.json({
      success: true,
      count: candidates.length,
      totalCount,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        limit: limitNumber,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? pageNumber + 1 : null,
        prevPage: hasPrevPage ? pageNumber - 1 : null,
      },
      data: candidates,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/candidates/{id}:
 *   get:
 *     summary: Obtener candidato por ID
 *     description: Retorna los detalles de un candidato específico por su ID
 *     tags: [Candidates]
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
 *         description: Candidato encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Candidate'
 *       404:
 *         description: Candidato no encontrado
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
export const getCandidateById = async (req, res, next) => {
  try {
    const prisma = getPrisma(req.tenantId);
    const { id } = req.params;

    const candidate = await prisma.candidate.findUnique({
      where: { id },
      include: {
        _count: {
          select: { votes: true },
        },
      },
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidato no encontrado",
      });
    }

    res.json({
      success: true,
      data: candidate,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/candidates:
 *   post:
 *     summary: Crear nuevo candidato
 *     description: Crea un nuevo candidato en el sistema
 *     tags: [Candidates]
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
 *               - municipality
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre completo del candidato
 *                 example: 'Juan Pérez'
 *               municipality:
 *                 type: string
 *                 description: Municipio del candidato
 *                 example: 'Villahermosa'
 *               photoUrl:
 *                 type: string
 *                 format: uri
 *                 description: URL de la foto del candidato
 *                 example: 'https://example.com/photo.jpg'
 *               bio:
 *                 type: string
 *                 description: Biografía del candidato
 *                 example: 'Descripción del candidato'
 *               order:
 *                 type: integer
 *                 description: Orden de aparición del candidato
 *                 example: 1
 *     responses:
 *       201:
 *         description: Candidato creado exitosamente
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
 *                   example: 'Candidato creado exitosamente'
 *                 data:
 *                   $ref: '#/components/schemas/Candidate'
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
export const createCandidate = async (req, res, next) => {
  try {
    const prisma = getPrisma(req.tenantId);
    const { name, municipality, photoUrl, bio, order } = req.body;

    const candidate = await prisma.candidate.create({
      data: {
        name,
        municipality,
        photoUrl,
        bio,
        order: order || undefined,
      },
    });

    res.status(201).json({
      success: true,
      message: "Candidato creado exitosamente",
      data: candidate,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/candidates/{id}:
 *   put:
 *     summary: Actualizar candidato
 *     description: Actualiza los datos de un candidato existente
 *     tags: [Candidates]
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre completo del candidato
 *                 example: 'Juan Pérez'
 *               municipality:
 *                 type: string
 *                 description: Municipio del candidato
 *                 example: 'Villahermosa'
 *               photoUrl:
 *                 type: string
 *                 format: uri
 *                 description: URL de la foto del candidato
 *                 example: 'https://example.com/photo.jpg'
 *               bio:
 *                 type: string
 *                 description: Biografía del candidato
 *                 example: 'Descripción del candidato'
 *               order:
 *                 type: integer
 *                 description: Orden de aparición del candidato
 *                 example: 1
 *               active:
 *                 type: boolean
 *                 description: Estado activo del candidato
 *                 example: true
 *     responses:
 *       200:
 *         description: Candidato actualizado exitosamente
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
 *                   example: 'Candidato actualizado exitosamente'
 *                 data:
 *                   $ref: '#/components/schemas/Candidate'
 *       404:
 *         description: Candidato no encontrado
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
export const updateCandidate = async (req, res, next) => {
  try {
    const prisma = getPrisma(req.tenantId);
    const { id } = req.params;
    const { name, municipality, photoUrl, bio, order, active } = req.body;

    // Check if candidate exists
    const existingCandidate = await prisma.candidate.findUnique({
      where: { id },
    });

    if (!existingCandidate) {
      return res.status(404).json({
        success: false,
        message: "Candidato no encontrado",
      });
    }

    const candidate = await prisma.candidate.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(municipality !== undefined && { municipality }),
        ...(photoUrl !== undefined && { photoUrl }),
        ...(bio !== undefined && { bio }),
        ...(order !== undefined && { order }),
        ...(active !== undefined && { active }),
      },
    });

    res.json({
      success: true,
      message: "Candidato actualizado exitosamente",
      data: candidate,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/candidates/{id}:
 *   delete:
 *     summary: Eliminar candidato
 *     description: Elimina un candidato del sistema
 *     tags: [Candidates]
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
 *         description: Candidato eliminado exitosamente
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
 *                   example: 'Candidato eliminado exitosamente'
 *       404:
 *         description: Candidato no encontrado
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
export const deleteCandidate = async (req, res, next) => {
  try {
    const prisma = getPrisma(req.tenantId);
    const { id } = req.params;

    // Check if candidate exists
    const existingCandidate = await prisma.candidate.findUnique({
      where: { id },
    });

    if (!existingCandidate) {
      return res.status(404).json({
        success: false,
        message: "Candidato no encontrado",
      });
    }

    await prisma.candidate.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Candidato eliminado exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/candidates/{id}/toggle:
 *   patch:
 *     summary: Cambiar estado activo del candidato
 *     description: Alterna el estado activo/inactivo de un candidato
 *     tags: [Candidates]
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
 *         description: Estado del candidato actualizado exitosamente
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
 *                   example: 'Candidato activado exitosamente'
 *                 data:
 *                   $ref: '#/components/schemas/Candidate'
 *       404:
 *         description: Candidato no encontrado
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
export const toggleCandidateStatus = async (req, res, next) => {
  try {
    const prisma = getPrisma(req.tenantId);
    const { id } = req.params;

    const candidate = await prisma.candidate.findUnique({
      where: { id },
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidato no encontrado",
      });
    }

    const updatedCandidate = await prisma.candidate.update({
      where: { id },
      data: {
        active: !candidate.active,
      },
    });

    res.json({
      success: true,
      message: `Candidato ${updatedCandidate.active ? "activado" : "desactivado"} exitosamente`,
      data: updatedCandidate,
    });
  } catch (error) {
    next(error);
  }
};
