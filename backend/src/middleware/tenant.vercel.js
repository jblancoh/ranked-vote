/**
 * Vercel-Compatible Tenant Middleware
 *
 * Works in serverless environments (Vercel, Netlify, AWS Lambda)
 * No AsyncLocalStorage - uses request object directly
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

    // Strategy 3: Subdomain
    if (!tenantIdentifier) {
      const host = req.get("host") || "";
      // Remove port from host if present
      const hostWithoutPort = host.split(":")[0];
      const subdomain = hostWithoutPort.split(".")[0];

      if (
        subdomain &&
        subdomain !== "localhost" &&
        subdomain !== "www" &&
        subdomain !== "api" &&
        subdomain !== "127"
      ) {
        tenantIdentifier = subdomain;
      }
    }

    // Strategy 4: Default tenant from environment
    if (!tenantIdentifier) {
      tenantIdentifier = defaultTenant;
    }

    // Look up tenant in database
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
      return res.status(404).json({
        success: false,
        error: "Tenant not found",
        message: `No active tenant found for identifier: ${tenantIdentifier}`,
        hint: `Check X-Tenant-Slug header, use ?tenant=slug query parameter, or configure DEFAULT_TENANT environment variable (currently: ${defaultTenant})`,
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
      error: "Failed to identify tenant",
      message: error.message,
    });
  }
};

/**
 * Generic Tenant-aware Prisma client factory
 *
 * Creates a Prisma client that automatically filters by tenant for ALL operations
 * on models that have a 'tenantId' field. No need to manually add each model!
 *
 * How it works:
 * - Intercepts all query operations (findMany, findFirst, create, update, delete, etc)
 * - Automatically adds { tenantId } to all where clauses for reads
 * - Automatically adds { tenantId } to data payload for writes
 * - Works for any model with a tenantId field - ZERO hardcoding needed!
 *
 * Usage in controllers:
 *   const prisma = getTenantPrisma(req.tenantId);
 *   const candidates = await prisma.candidate.findMany(); // Automatically filtered by tenant
 *   const votes = await prisma.vote.findMany();           // Also filtered by tenant
 *   const newEvent = await prisma.event.create({...});    // Automatically sets tenantId
 *
 * Benefits over hardcoded approach:
 * ✓ Add new models without editing this file
 * ✓ No need to maintain CRUD operations per model
 * ✓ Less code, fewer bugs
 * ✓ Future-proof for schema changes
 */
export function getTenantPrisma(tenantId) {
  if (!tenantId) {
    throw new Error("tenantId is required for getTenantPrisma");
  }

  return prisma.$extends({
    query: {
      $allModels: {
        // Read operations - add tenantId filter
        async findMany({ args, query }) {
          args.where = { ...args.where, tenantId };
          return query(args);
        },
        async findFirst({ args, query }) {
          args.where = { ...args.where, tenantId };
          return query(args);
        },
        async findUnique({ args, query }) {
          args.where = { ...args.where, tenantId };
          return query(args);
        },
        async findUniqueOrThrow({ args, query }) {
          args.where = { ...args.where, tenantId };
          return query(args);
        },
        async count({ args, query }) {
          args.where = { ...args.where, tenantId };
          return query(args);
        },
        async aggregate({ args, query }) {
          args.where = { ...args.where, tenantId };
          return query(args);
        },
        async groupBy({ args, query }) {
          args.where = { ...args.where, tenantId };
          return query(args);
        },

        // Write operations - add tenantId to data
        async create({ args, query }) {
          args.data = { ...args.data, tenantId };
          return query(args);
        },
        async createMany({ args, query }) {
          if (Array.isArray(args.data)) {
            args.data = args.data.map((item) => ({ ...item, tenantId }));
          }
          return query(args);
        },
        async update({ args, query }) {
          args.where = { ...args.where, tenantId };
          return query(args);
        },
        async updateMany({ args, query }) {
          args.where = { ...args.where, tenantId };
          return query(args);
        },
        async upsert({ args, query }) {
          args.where = { ...args.where, tenantId };
          args.create = { ...args.create, tenantId };
          return query(args);
        },

        // Delete operations - add tenantId filter
        async delete({ args, query }) {
          args.where = { ...args.where, tenantId };
          return query(args);
        },
        async deleteMany({ args, query }) {
          args.where = { ...args.where, tenantId };
          return query(args);
        },
      },
    },
  });
}

/**
 * Helper middleware to attach tenant-aware Prisma to request
 * Makes it easier to use in controllers
 *
 * Usage:
 *   app.use(extractTenantMiddleware);
 *   app.use(attachTenantPrismaMiddleware);
 *
 *   // In controller:
 *   const candidates = await req.prisma.candidate.findMany(); // Auto-filtered by tenant
 *   const votes = await req.prisma.vote.findMany();           // Auto-filtered by tenant
 *   // No need to manually add tenantId filters!
 */
export const attachTenantPrismaMiddleware = (req, res, next) => {
  if (!req.tenantId) {
    return res.status(500).json({
      success: false,
      error: "Tenant context not set",
      message:
        "extractTenantMiddleware must run before attachTenantPrismaMiddleware",
    });
  }

  req.prisma = getTenantPrisma(req.tenantId);
  next();
};

/**
 * Require tenant middleware
 * Returns 401 if tenant is not set
 */
export const requireTenant = (req, res, next) => {
  if (!req.tenant || !req.tenantId) {
    return res.status(401).json({
      success: false,
      error: "Tenant required",
      message: "This endpoint requires tenant identification",
    });
  }
  next();
};

export default {
  extractTenantMiddleware,
  getTenantPrisma,
  attachTenantPrismaMiddleware,
  requireTenant,
};
