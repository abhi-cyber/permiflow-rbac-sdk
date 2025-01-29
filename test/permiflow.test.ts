import {PermissionsManager} from "../src/PermissionsManager";

describe("Permiflow RBAC", () => {
  let manager: PermissionsManager;

  beforeEach(() => {
    manager = new PermissionsManager();
    manager.addPermission({name: "read", resource: "user:123"});
    manager.addPermission({name: "write", resource: "user:123"});
    manager.createRole("guest", ["user:123:read"]);
    manager.createRole("admin", ["user:123:read", "user:123:write"]);
  });

  test("should check resource-based permissions", () => {
    expect(manager.checkAccess("guest", "user:123:read")).toBe(true);
    expect(manager.checkAccess("guest", "user:123:write")).toBe(false);
    expect(manager.checkAccess("admin", "user:123:write")).toBe(true);
  });

  test("should add and check permissions", () => {
    manager.addPermission({name: "delete", resource: "user:123"});
    manager.createRole("superadmin", ["user:123:delete"]);
    expect(manager.checkAccess("superadmin", "user:123:delete")).toBe(true);
  });

  test("should handle role inheritance", () => {
    const manager = new PermissionsManager();
    manager.addPermission({name: "read", resource: "user:123"});
    manager.addPermission({name: "write", resource: "user:123"});

    const guestRole = manager.createRole("guest", ["user:123:read"]);
    const adminRole = manager.createRole("admin", ["user:123:write"]);

    guestRole.addInheritedRole(adminRole);

    expect(manager.checkAccess("guest", "user:123:read")).toBe(true);
    expect(manager.checkAccess("guest", "user:123:write")).toBe(true);
  });

  test("should handle cyclic role inheritance", () => {
    const manager = new PermissionsManager();
    manager.addPermission({name: "read", resource: "user:123"});

    const roleA = manager.createRole("roleA", ["user:123:read"]);
    const roleB = manager.createRole("roleB", []);

    roleA.addInheritedRole(roleB);
    expect(() => roleB.addInheritedRole(roleA)).toThrow(
      "Role hierarchy cannot have cycles"
    );
  });
});
