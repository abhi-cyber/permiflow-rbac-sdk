import {PermissionsManager} from "./PermissionsManager";
import {Request, Response, NextFunction} from "express";

export function rbacMiddleware(
  manager: PermissionsManager,
  roleName: string,
  permission: string
) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!manager.checkAccess(roleName, permission)) {
      return res.status(403).json({error: "Access Denied"});
    }
    next();
  };
}
