/**
 * Vercel-Compatible Tenant Middleware
 *
 * Works in serverless environments (Vercel, Netlify, AWS Lambda)
 * No AsyncLocalStorage - uses request object directly
 */
/**
 * Códigos de error del middleware de tenant
 * - TENANT_NOT_FOUND: No existe un tenant con el identificador proporcionado
 * - TENANT_INACTIVE: El tenant existe pero está inactivo
 * - TENANT_IDENTIFICATION_FAILED: Error inesperado al identificar el tenant
 * - TENANT_REQUIRED: No se proporcionó información de tenant donde era necesaria
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Extract tenant from request
 *
 * Strategies (in order of priority):
 * 1. Header: X-Tenant-Slug or X-Tenant-Id
 * 2. Query param: ?tenant=slug
 * 3. Subdomain: beauty-pageant.example.com
 * 4. Default: env variable DEFAULT_TENANT (always used, can be configured per deployment)
 */
export const extractTenantMiddleware = async (req, res, next) => {
  try {
    let tenantIdentifier = null;
    const defaultTenant = process.env.DEFAULT_TENANT || "default";

    // Strategy 1: Header (best for API clients)
    tenantIdentifier = req.get("X-Tenant-Slug") || req.get("X-Tenant-Id");

    // Strategy 2: Query param (useful for development/testing)
    if (!tenantIdentifier && req.query.tenant) {
      tenantIdentifier = req.query.tenant;
    }

    // Strategy 4: Default tenant from environment
    if (!tenantIdentifier) {
      tenantIdentifier = defaultTenant;
    }

    // Buscar tenant activo primero
    const tenant = await prisma.tenant.findFirst({
      where: {
        OR: [
          { id: tenantIdentifier },
          { slug: tenantIdentifier },
          { subdomain: tenantIdentifier },
        ],
        active: true,
      },
    });

    if (!tenant) {
      // Verificar si existe pero está inactivo
      const tenantExists = await prisma.tenant.findFirst({
        where: {
          OR: [
            { id: tenantIdentifier },
            { slug: tenantIdentifier },
            { subdomain: tenantIdentifier },
          ],
        },
      });

      if (tenantExists && tenantExists.active === false) {
        return res.status(403).json({
          success: false,
          code: "TENANT_INACTIVE",
          error: "Tenant inactivo",
          message: "El tenant existe pero está inactivo. Contacta al administrador para reactivarlo.",
          detalles: {
            identificador: tenantIdentifier,
          },
        });
      }

      return res.status(404).json({
        success: false,
        code: "TENANT_NOT_FOUND",
        error: "Tenant no encontrado",
        message: "No se encontró un tenant con el identificador proporcionado.",
        sugerencias: [
          "Verifica el valor del encabezado X-Tenant-Slug o X-Tenant-Id",
          "Prueba con el parámetro ?tenant=slug en la URL",
          `Configura la variable de entorno DEFAULT_TENANT (actual: ${defaultTenant})`,
        ],
        detalles: {
          identificador: tenantIdentifier,
        },
      });
    }

    // Attach tenant to request object
    req.tenant = tenant;
    req.tenantId = tenant.id;

    next();
  } catch (error) {
    console.error("Tenant middleware error:", error);
    return res.status(500).json({
      success: false,
      code: "TENANT_IDENTIFICATION_FAILED",
      error: "Error al identificar el tenant",
      message: "Ocurrió un error inesperado al procesar el tenant.",
      detalles: {
        causa: error.message,
      },
    });
  }
};

/**
 * Generic Tenant-aware Prisma client factory
 *
 * Creates a Prisma client that automatically filters by tenant for ALL operations
 * on models that have a 'tenantId' field. No need to manually add each model!
 *
 */
export const requireTenant = (req, res, next) => {
  if (!req.tenant || !req.tenantId) {
    return res.status(401).json({
      success: false,
      code: "TENANT_REQUIRED",
      error: "Tenant requerido",
      message: "Este endpoint requiere identificación de tenant.",
      sugerencias: [
        "Incluye el encabezado X-Tenant-Slug o X-Tenant-Id",
        "Usa el parámetro de consulta ?tenant=slug durante desarrollo",
      ],
    });
  }
  next();
};

export default {
  extractTenantMiddleware,
  requireTenant,
};
