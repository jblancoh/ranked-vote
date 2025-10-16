/**
 * Authentication Middleware
 * Note: This is a placeholder implementation for Issue #33
 * Full authentication system will be implemented in Issue #26
 */

/**
 * Temporary admin authentication middleware
 * TODO: Replace with proper JWT authentication from Issue #26
 *
 * For now, this checks for an admin API key in the Authorization header
 * Format: Authorization: Bearer <ADMIN_API_KEY>
 */
export const requireAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No se proporcionó token de autenticación'
      });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Formato de token inválido'
      });
    }

    // Temporary validation using environment variable
    // TODO: Replace with JWT verification in Issue #26
    const adminApiKey = process.env.ADMIN_API_KEY || 'dev-admin-key';

    if (token !== adminApiKey) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a este recurso'
      });
    }

    // TODO: In Issue #26, decode JWT and attach user info to req.user
    req.user = {
      role: 'admin',
      id: 'temp-admin-id'
    };

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error en la autenticación',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Optional admin middleware - allows request to proceed but attaches user info if authenticated
 */
export const optionalAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const adminApiKey = process.env.ADMIN_API_KEY || 'dev-admin-key';

      if (token === adminApiKey) {
        req.user = {
          role: 'admin',
          id: 'temp-admin-id'
        };
      }
    }

    next();
  } catch (error) {
    // If optional auth fails, continue without user
    next();
  }
};
