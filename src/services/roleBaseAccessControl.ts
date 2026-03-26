// =============================================================================
// ACCESSCONTROL IMPLEMENTATION - TYPESCRIPT
// =============================================================================
import { Request, Response, NextFunction } from 'express';
import { capitalizeFirstLetter } from 'libs';
import { AppError } from 'middlewares/error';
import { Role } from 'microservices/auth-service/types';
import { IUserDocument } from 'models/user.model'; // Adjust path as needed
const ADMIN_ASSIGNABLE_ROLES :Role[]= [];
const SUPERADMIN_ASSIGNABLE_ROLES:Role[] = [Role.ADMIN];
// =============================================================================
// 2. PERMISSION CHECKER CLASS (CUSTOM IMPLEMENTATION)
// =============================================================================



export class UserPermissionChecker {
  private user: IUserDocument;
  constructor(user: IUserDocument) {
    this.user = user;
  }
   async canUserUpdate(targetRole: Role): Promise<boolean> {
    if (this.user.role === Role.ADMIN && !ADMIN_ASSIGNABLE_ROLES.includes(targetRole)) {
      throw new AppError(
        `Users with the ${capitalizeFirstLetter(this.user.role)} role are not authorized to update users with the ${capitalizeFirstLetter(targetRole)} role.`,
        400
      );
    }

    if (
      this.user.role === Role.SUPERADMIN &&
      !SUPERADMIN_ASSIGNABLE_ROLES.includes(targetRole)
    ) {
      throw new AppError(
        `Users with the ${capitalizeFirstLetter(this.user.role)} role cannot update users with the ${capitalizeFirstLetter(targetRole)} role.`,
        403
      );
    }

    return true;
  }
}

// Role-based middleware
export function requireRole(allowedRoles:  Role[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
         throw new AppError('Unauthorized: No session found', 401);
      }
      console.log("res session role",req.user.role)
      if (!allowedRoles.includes(req.user.role)) {
         throw new AppError('Access denied: Insufficient role privileges', 403,{
           required: allowedRoles,
          userRole: req.user.role
         });
      }

      next();
    } catch (error: any) {
      next(error);
    }
  };
}
