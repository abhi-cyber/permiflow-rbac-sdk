import {Role} from "./Role";
import {Permission} from "./Permission";
import {v4 as uuidv4} from "uuid";
import {auditLog} from "./auditLogger";

export class PermissionsManager {
  private roles: Map<string, Role> = new Map();
  private permissions: Map<string, Permission> = new Map();

  /**
   * Adds a new permission to the manager.
   * @param config - Configuration object for the permission.
   * @returns The created Permission object.
   */
  addPermission(config: {
    name: string;
    resource?: string;
    description?: string;
    deny?: boolean;
  }): Permission {
    if (!config.name) {
      throw new Error("Permission name is required");
    }

    const id = uuidv4();
    const permission = new Permission(
      id,
      config.name,
      config.resource,
      config.description,
      config.deny
    );
    this.permissions.set(
      `${config.resource || "global"}:${config.name}`,
      permission
    );
    auditLog(
      `Permission added: ${config.name} on ${config.resource || "global"}`
    );
    return permission;
  }

  /**
   * Adds multiple permissions to the manager.
   * @param permissions - Array of permission configurations.
   * @returns Array of created Permission objects.
   */
  bulkAddPermissions(
    permissions: {name: string; resource?: string; description?: string}[]
  ): Permission[] {
    return permissions.map((perm) => this.addPermission(perm));
  }

  /**
   * Creates a new role with the specified permissions.
   * @param name - The name of the role.
   * @param permissions - Array of permission identifiers.
   * @returns The created Role object.
   */
  createRole(name: string, permissions: string[] = []): Role {
    if (!name) {
      throw new Error("Role name is required");
    }

    if (this.roles.has(name)) {
      throw new Error(`Role ${name} already exists`);
    }

    const role = new Role(name, permissions);
    this.roles.set(name, role);
    auditLog(`Role created: ${name}`);
    return role;
  }

  /**
   * Creates multiple roles with the specified permissions.
   * @param roles - Array of role configurations.
   * @returns Array of created Role objects.
   */
  bulkCreateRoles(roles: {name: string; permissions?: string[]}[]): Role[] {
    return roles.map((role) =>
      this.createRole(role.name, role.permissions || [])
    );
  }

  /**
   * Checks if a role has access to a specific permission.
   * @param roleName - The name of the role.
   * @param permission - The permission identifier.
   * @returns True if the role has access, false otherwise.
   */
  checkAccess(roleName: string, permission: string): boolean {
    const role = this.roles.get(roleName);
    if (!role) {
      auditLog(`Access check failed: Role ${roleName} does not exist`);
      return false;
    }
    const hasAccess = role.hasPermission(permission);
    auditLog(
      `Access check: Role ${roleName} ${
        hasAccess ? "has" : "does not have"
      } access to ${permission}`
    );
    return hasAccess;
  }
}
