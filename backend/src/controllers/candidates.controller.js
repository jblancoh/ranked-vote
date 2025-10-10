import { getPrisma } from '../utils/prisma.js';

/**
 * Get all candidates
 * @route GET /api/candidates
 */
export const getAllCandidates = async (req, res, next) => {
  try {
    const prisma = getPrisma(req.tenantId);
    const { active, page = 1, limit = 10 } = req.query;

    // Parse pagination parameters
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // Validate pagination parameters
    if (pageNumber < 1 || limitNumber < 1 || limitNumber > 100) {
      return res.status(400).json({
        success: false,
        message: 'Parámetros de paginación inválidos. page debe ser >= 1, limit debe estar entre 1 y 100'
      });
    }

    const whereClause = active !== undefined
      ? { active: active === 'true' }
      : {};

    // Get total count for pagination metadata
    const totalCount = await prisma.candidate.count({
      where: whereClause
    });

    // Get paginated candidates
    const candidates = await prisma.candidate.findMany({
      where: whereClause,
      orderBy: {
        order: 'asc'
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
          select: { votes: true }
        }
      },
      skip,
      take: limitNumber
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
        prevPage: hasPrevPage ? pageNumber - 1 : null
      },
      data: candidates
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get candidate by ID
 * @route GET /api/candidates/:id
 */
export const getCandidateById = async (req, res, next) => {
  try {
    const prisma = getPrisma(req.tenantId);
    const { id } = req.params;

    const candidate = await prisma.candidate.findUnique({
      where: { id },
      include: {
        _count: {
          select: { votes: true }
        }
      }
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidato no encontrado'
      });
    }

    res.json({
      success: true,
      data: candidate
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new candidate
 * @route POST /api/candidates
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
        order: order || undefined
      }
    });

    res.status(201).json({
      success: true,
      message: 'Candidato creado exitosamente',
      data: candidate
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update candidate
 * @route PUT /api/candidates/:id
 */
export const updateCandidate = async (req, res, next) => {
  try {
    const prisma = getPrisma(req.tenantId);
    const { id } = req.params;
    const { name, municipality, photoUrl, bio, order, active } = req.body;

    // Check if candidate exists
    const existingCandidate = await prisma.candidate.findUnique({
      where: { id }
    });

    if (!existingCandidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidato no encontrado'
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
        ...(active !== undefined && { active })
      }
    });

    res.json({
      success: true,
      message: 'Candidato actualizado exitosamente',
      data: candidate
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete candidate
 * @route DELETE /api/candidates/:id
 */
export const deleteCandidate = async (req, res, next) => {
  try {
    const prisma = getPrisma(req.tenantId);
    const { id } = req.params;

    // Check if candidate exists
    const existingCandidate = await prisma.candidate.findUnique({
      where: { id }
    });

    if (!existingCandidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidato no encontrado'
      });
    }

    await prisma.candidate.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Candidato eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle candidate active status
 * @route PATCH /api/candidates/:id/toggle
 */
export const toggleCandidateStatus = async (req, res, next) => {
  try {
    const prisma = getPrisma(req.tenantId);
    const { id } = req.params;

    const candidate = await prisma.candidate.findUnique({
      where: { id }
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidato no encontrado'
      });
    }

    const updatedCandidate = await prisma.candidate.update({
      where: { id },
      data: {
        active: !candidate.active
      }
    });

    res.json({
      success: true,
      message: `Candidato ${updatedCandidate.active ? 'activado' : 'desactivado'} exitosamente`,
      data: updatedCandidate
    });
  } catch (error) {
    next(error);
  }
};
