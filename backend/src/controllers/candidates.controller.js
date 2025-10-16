import { getPrisma } from '../utils/prisma.js';

/**
 * Get all candidates
 * @route GET /api/candidates
 */
export const getAllCandidates = async (req, res, next) => {
  try {
    const prisma = getPrisma(req.tenantId);
    const { filter } = req.query;

    // Build dynamic where clause
    const whereClause = {};
    
    // Filter with OR logic for name and municipality
    if (filter && filter.trim().length > 0) {
      whereClause.OR = [
        {
          name: {
            contains: filter.trim(),
            mode: 'insensitive'
          }
        },
        {
          municipality: {
            contains: filter.trim(),
            mode: 'insensitive'
          }
        }
      ];
    }

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
      }
    });

    res.json({
      success: true,
      count: candidates.length,
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
