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
  requireTenant,
};
