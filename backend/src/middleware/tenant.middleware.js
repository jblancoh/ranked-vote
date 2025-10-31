/**
 * Tenant Isolation Middleware for Prisma
 *
 * Automatically filters all queries by tenantId to ensure data isolation
 * between different tenants in a multi-tenant architecture.
 */
/**
 * Códigos de error del middleware de tenant
 * - TENANT_NOT_FOUND: No existe un tenant con el identificador proporcionado
 * - TENANT_INACTIVE: El tenant existe pero está inactivo
 * - TENANT_IDENTIFICATION_FAILED: Error inesperado al identificar el tenant
 */

// Models that have tenantId field
const TENANT_MODELS = [
  'Candidate',
  'Vote',
  'Event',
  'Result',
  'User'
];

/**
 * Prisma middleware for automatic tenant filtering
 *
 * Usage:
 * import { tenantMiddleware } from './middleware/tenant.middleware.js'
 * prisma.$use(tenantMiddleware)
 */
export const tenantMiddleware = async (params, next) => {
  // Get tenantId from AsyncLocalStorage (set by Express middleware)
  const tenantId = getTenantFromContext();

  // Only apply to models with tenantId
  if (!TENANT_MODELS.includes(params.model)) {
    return next(params);
  }

  // Add tenantId to where clause for queries
  if (params.action === 'findUnique' ||
      params.action === 'findFirst' ||
      params.action === 'findMany') {
    params.args.where = {
      ...params.args.where,
      tenantId
    };
  }

  // Add tenantId to data for create/update operations
  if (params.action === 'create') {
    params.args.data = {
      ...params.args.data,
      tenantId
    };
  }

  if (params.action === 'createMany') {
    if (Array.isArray(params.args.data)) {
      params.args.data = params.args.data.map(item => ({
        ...item,
        tenantId
      }));
    }
  }

  // Add tenantId to where clause for updates and deletes
  if (params.action === 'update' ||
      params.action === 'updateMany' ||
      params.action === 'delete' ||
      params.action === 'deleteMany') {
    params.args.where = {
      ...params.args.where,
      tenantId
    };
  }

  return next(params);
};

/**
 * AsyncLocalStorage for tenant context
 * Allows storing tenant info per request without passing it everywhere
 */
import { AsyncLocalStorage } from 'async_hooks';
const tenantStorage = new AsyncLocalStorage();

/**
 * Express middleware to extract and store tenant context
 *
 * Tenant identification strategies:
 * 1. Subdomain: beauty-pageant.rankedvote.com → tenant slug: beauty-pageant
 * 2. Header: X-Tenant-Id or X-Tenant-Slug
 * 3. Query param: ?tenant=beauty-pageant
 * 4. Default: Use "default" tenant for backward compatibility
 */
export const extractTenantMiddleware = async (req, res, next) => {
  let tenantIdentifier = null;
  let identificationMethod = null;

  // Strategy 1: Subdomain
  const host = req.get('host') || '';
  const subdomain = host.split('.')[0];

  if (subdomain && subdomain !== 'localhost' && subdomain !== 'www') {
    tenantIdentifier = subdomain;
    identificationMethod = 'subdomain';
  }

  // Strategy 2: Headers (takes precedence)
  const headerTenantId = req.get('X-Tenant-Id');
  const headerTenantSlug = req.get('X-Tenant-Slug');

  if (headerTenantId) {
    tenantIdentifier = headerTenantId;
    identificationMethod = 'header-id';
  } else if (headerTenantSlug) {
    tenantIdentifier = headerTenantSlug;
    identificationMethod = 'header-slug';
  }

  // Strategy 3: Query parameter (development/testing)
  if (req.query.tenant) {
    tenantIdentifier = req.query.tenant;
    identificationMethod = 'query';
  }

  // Strategy 4: Default tenant (backward compatibility)
  if (!tenantIdentifier) {
    tenantIdentifier = process.env.DEFAULT_TENANT || 'default';
    identificationMethod = 'default';
  }

  try {
    // Import Prisma client here to avoid circular dependencies
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    // Buscar tenant activo primero
    const tenant = await prisma.tenant.findFirst({
      where: {
        OR: [
          { id: tenantIdentifier },
          { slug: tenantIdentifier },
          { subdomain: tenantIdentifier }
        ],
        active: true
      }
    });

    if (!tenant) {
      // Verificar si existe pero está inactivo
      const tenantExists = await prisma.tenant.findFirst({
        where: {
          OR: [
            { id: tenantIdentifier },
            { slug: tenantIdentifier },
            { subdomain: tenantIdentifier }
          ]
        }
      });

      if (tenantExists && tenantExists.active === false) {
        return res.status(403).json({
          success: false,
          code: 'TENANT_INACTIVE',
          error: 'Tenant inactivo',
          message: 'El tenant existe pero está inactivo. Contacta al administrador para reactivarlo.',
          detalles: {
            identificador: tenantIdentifier,
            metodoIdentificacion: identificationMethod
          }
        });
      }

      return res.status(404).json({
        success: false,
        code: 'TENANT_NOT_FOUND',
        error: 'Tenant no encontrado',
        message: 'No se encontró un tenant con el identificador proporcionado.',
        sugerencias: [
          'Verifica el valor del encabezado X-Tenant-Slug o X-Tenant-Id',
          'Prueba con el parámetro ?tenant=slug en la URL',
          'Confirma que el tenant esté creado y activo en el sistema'
        ],
        detalles: {
          identificador: tenantIdentifier,
          metodoIdentificacion: identificationMethod
        }
      });
    }

    // Store tenant in request and AsyncLocalStorage
    req.tenant = tenant;

    // Run the rest of the request with tenant context
    return tenantStorage.run({ tenantId: tenant.id, tenant }, () => {
      next();
    });

  } catch (error) {
    console.error('Tenant middleware error:', error);
    return res.status(500).json({
      success: false,
      code: 'TENANT_IDENTIFICATION_FAILED',
      error: 'Error al identificar el tenant',
      message: 'Ocurrió un error inesperado al procesar el tenant.',
      detalles: {
        causa: error.message
      }
    });
  }
};

/**
 * Get current tenant from AsyncLocalStorage
 */
export function getTenantFromContext() {
  const store = tenantStorage.getStore();
  return store?.tenantId;
}

/**
 * Get full tenant object from AsyncLocalStorage
 */
export function getTenantObjectFromContext() {
  const store = tenantStorage.getStore();
  return store?.tenant;
}

/**
 * Helper to run a function with specific tenant context
 * Useful for background jobs, migrations, etc.
 */
export function withTenantContext(tenantId, callback) {
  return tenantStorage.run({ tenantId }, callback);
}

export default {
  tenantMiddleware,
  extractTenantMiddleware,
  getTenantFromContext,
  getTenantObjectFromContext,
  withTenantContext
};
