# Permiflow SDK Documentation

## Overview

This Role-Based Access Control (RBAC) SDK provides a robust and flexible authorization system with advanced features including resource-based permissions, middleware support, role hierarchy validation, audit logging, and bulk operations.

## Features

- **Role-Based Access Control**: Manage user roles and permissions efficiently.
- **Resource-Based Permissions**: Fine-grained control over resources (e.g., `user:123:read`).
- **Middleware Support**: Works with Express/Fastify for seamless integration.
- **Permission Composition**: Supports AND/OR operations for complex access rules.
- **Role Hierarchy Validation**: Prevents cyclic inheritance.
- **Role Activation/Deactivation**: Temporarily disable roles without deletion.
- **Audit Logging**: Tracks permission changes for compliance and debugging.
- **Caching Layer**: Improves performance with in-memory caching.
- **Bulk Operations**: Create and update roles/permissions in batches.

## Installation

```sh
npm install permiflow
```

## Usage

### Basic Setup

```ts
import {PermissionsManager} from "permiflow";

const manager = new PermissionsManager();

// Add permissions
manager.addPermission({name: "read", resource: "user:123"});
manager.addPermission({name: "write", resource: "user:123"});

// Create roles
manager.createRole("guest", ["user:123:read"]);
manager.createRole("admin", ["user:123:read", "user:123:write"]);

// Check access
console.log(manager.checkAccess("guest", "user:123:read")); // true
console.log(manager.checkAccess("guest", "user:123:write")); // false
console.log(manager.checkAccess("admin", "user:123:write")); // true
```

### Using Middleware with Express

```ts
import express from "express";
import {PermissionsManager, rbacMiddleware} from "permiflow";

const app = express();
const manager = new PermissionsManager();

// Setup permissions and roles
manager.addPermission({name: "read", resource: "user:123"});
manager.createRole("guest", ["user:123:read"]);

// Middleware to check access
app.use("/user/:id", rbacMiddleware(manager, "guest", "user:123:read"));

app.get("/user/:id", (req, res) => {
  res.send("User data");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

### Bulk Operations

```ts
import {PermissionsManager} from "permiflow";

const manager = new PermissionsManager();

// Bulk add permissions
manager.bulkAddPermissions([
  {name: "read", resource: "user:123"},
  {name: "write", resource: "user:123"},
]);

// Bulk create roles
manager.bulkCreateRoles([
  {name: "guest", permissions: ["user:123:read"]},
  {name: "admin", permissions: ["user:123:read", "user:123:write"]},
]);
```

### Audit Logging

```ts
import {PermissionsManager} from "permiflow";

const manager = new PermissionsManager();

// Add permissions and roles
manager.addPermission({name: "read", resource: "user:123"});
manager.createRole("guest", ["user:123:read"]);

// Check access
manager.checkAccess("guest", "user:123:read");

// Check the audit.log file for logged actions
```
