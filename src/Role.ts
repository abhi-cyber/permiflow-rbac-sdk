export class Role {
  private permissions: Set<string> = new Set();
  private deniedPermissions: Set<string> = new Set();
  private inheritedRoles: Set<Role> = new Set();
  private isActive: boolean = true;
  private static MAX_DEPTH = 5;

  constructor(public readonly name: string, initialPermissions: string[] = []) {
    initialPermissions.forEach((permission) =>
      this.permissions.add(permission)
    );
  }

  addPermission(permission: string): void {
    this.permissions.add(permission);
  }

  denyPermission(permission: string): void {
    this.deniedPermissions.add(permission);
  }

  removePermission(permission: string): void {
    this.permissions.delete(permission);
  }

  addInheritedRole(role: Role, depth: number = 0): void {
    if (depth > Role.MAX_DEPTH) {
      throw new Error("Exceeded maximum role inheritance depth");
    }
    if (this.hasCyclicDependency(role)) {
      throw new Error("Role hierarchy cannot have cycles");
    }
    this.inheritedRoles.add(role);
  }

  hasPermission(permission: string): boolean {
    if (!this.isActive || this.deniedPermissions.has(permission)) return false;
    return (
      this.permissions.has(permission) ||
      Array.from(this.inheritedRoles).some((role) =>
        role.hasPermission(permission)
      )
    );
  }

  deactivate(): void {
    this.isActive = false;
  }

  activate(): void {
    this.isActive = true;
  }

  private hasCyclicDependency(
    role: Role,
    visited: Set<Role> = new Set()
  ): boolean {
    if (role === this) return true;
    if (visited.has(role)) return false;
    visited.add(role);
    for (const inherited of role.inheritedRoles) {
      if (this.hasCyclicDependency(inherited, visited)) {
        return true;
      }
    }
    for (const ourInherited of this.inheritedRoles) {
      if (ourInherited === role || ourInherited.hasCyclicDependency(role)) {
        return true;
      }
    }

    return false;
  }
}
