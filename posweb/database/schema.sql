-- POSWeb Database Schema and Seed Data
-- Generated for Laravel 12 + PostgreSQL
-- Import this file directly into your LuxWatch_bloodsmell database

-- ============================================
-- STEP 1: Fix Schema Permissions (Run as superuser if needed)
-- ============================================
-- GRANT CREATE ON SCHEMA public TO "LuxWatch_bloodsmell";
-- GRANT USAGE ON SCHEMA public TO "LuxWatch_bloodsmell";

-- ============================================
-- STEP 2: Create Migrations Table
-- ============================================
CREATE TABLE IF NOT EXISTS migrations (
    id SERIAL PRIMARY KEY,
    migration VARCHAR(255) NOT NULL,
    batch INTEGER NOT NULL
);

-- ============================================
-- STEP 3: Create Users Table
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP WITH TIME ZONE NULL,
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    phone VARCHAR(20) NULL,
    avatar_url VARCHAR(255) NULL,
    status VARCHAR(50) DEFAULT 'active',
    last_login_at TIMESTAMP WITH TIME ZONE NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP WITH TIME ZONE NULL,
    updated_at TIMESTAMP WITH TIME ZONE NULL,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX IF NOT EXISTS users_status_index ON users(status);
CREATE INDEX IF NOT EXISTS users_email_index ON users(email);
CREATE INDEX IF NOT EXISTS users_deleted_at_index ON users(deleted_at);

-- ============================================
-- STEP 4: Create Password Reset Tokens Table
-- ============================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    email VARCHAR(255) PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NULL
);

-- ============================================
-- STEP 5: Create Sessions Table
-- ============================================
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id BIGINT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    payload TEXT NOT NULL,
    last_activity INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS sessions_user_id_index ON sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_last_activity_index ON sessions(last_activity);

-- ============================================
-- STEP 6: Create Cache Tables
-- ============================================
CREATE TABLE IF NOT EXISTS cache (
    key VARCHAR(255) PRIMARY KEY,
    value TEXT NOT NULL,
    expiration INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS cache_expiration_index ON cache(expiration);

CREATE TABLE IF NOT EXISTS cache_locks (
    key VARCHAR(255) PRIMARY KEY,
    owner VARCHAR(255) NOT NULL,
    expiration INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS cache_locks_expiration_index ON cache_locks(expiration);

-- ============================================
-- STEP 7: Create Jobs Tables
-- ============================================
CREATE TABLE IF NOT EXISTS jobs (
    id BIGSERIAL PRIMARY KEY,
    queue VARCHAR(255) NOT NULL,
    payload TEXT NOT NULL,
    attempts SMALLINT NOT NULL DEFAULT 0,
    reserved_at INTEGER NULL,
    available_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS jobs_queue_index ON jobs(queue);

CREATE TABLE IF NOT EXISTS job_batches (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    total_jobs INTEGER NOT NULL,
    pending_jobs INTEGER NOT NULL,
    failed_jobs INTEGER NOT NULL,
    failed_job_ids TEXT NOT NULL,
    options TEXT NULL,
    cancelled_at INTEGER NULL,
    created_at INTEGER NOT NULL,
    finished_at INTEGER NULL
);

CREATE TABLE IF NOT EXISTS failed_jobs (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(255) UNIQUE NOT NULL,
    connection TEXT NOT NULL,
    queue TEXT NOT NULL,
    payload TEXT NOT NULL,
    exception TEXT NOT NULL,
    failed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- STEP 8: Create Personal Access Tokens Table (Sanctum)
-- ============================================
CREATE TABLE IF NOT EXISTS personal_access_tokens (
    id BIGSERIAL PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) UNIQUE NOT NULL,
    abilities TEXT NULL,
    last_used_at TIMESTAMP WITH TIME ZONE NULL,
    expires_at TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE NULL,
    updated_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX IF NOT EXISTS personal_access_tokens_tokenable_index ON personal_access_tokens(tokenable_type, tokenable_id);
CREATE INDEX IF NOT EXISTS personal_access_tokens_expires_at_index ON personal_access_tokens(expires_at);

-- ============================================
-- STEP 9: Create Audit Logs Table
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NULL,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(255) NOT NULL,
    entity_id BIGINT NOT NULL,
    old_values JSONB NULL,
    new_values JSONB NULL,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(255) NULL,
    created_at TIMESTAMP WITH TIME ZONE NULL,
    updated_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX IF NOT EXISTS audit_logs_entity_index ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS audit_logs_user_id_index ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS audit_logs_created_at_index ON audit_logs(created_at);

-- ============================================
-- STEP 10: Create Roles Table
-- ============================================
CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    guard_name VARCHAR(50) DEFAULT 'sanctum',
    description TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE NULL,
    updated_at TIMESTAMP WITH TIME ZONE NULL
);

-- ============================================
-- STEP 11: Create Permissions Table
-- ============================================
CREATE TABLE IF NOT EXISTS permissions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    guard_name VARCHAR(50) DEFAULT 'sanctum',
    module VARCHAR(50) NULL,
    description TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE NULL,
    updated_at TIMESTAMP WITH TIME ZONE NULL
);

-- ============================================
-- STEP 12: Create Role-User Pivot Table
-- ============================================
CREATE TABLE IF NOT EXISTS role_user (
    role_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    assigned_by BIGINT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, user_id)
);

CREATE INDEX IF NOT EXISTS role_user_user_id_index ON role_user(user_id, role_id);

-- ============================================
-- STEP 13: Create Permission-Role Pivot Table
-- ============================================
CREATE TABLE IF NOT EXISTS permission_role (
    permission_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (permission_id, role_id)
);

CREATE INDEX IF NOT EXISTS permission_role_role_id_index ON permission_role(role_id, permission_id);

-- ============================================
-- STEP 14: Add Foreign Key Constraints
-- ============================================
ALTER TABLE audit_logs ADD CONSTRAINT audit_logs_user_id_foreign 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE personal_access_tokens ADD CONSTRAINT personal_access_tokens_tokenable_foreign 
    FOREIGN KEY (tokenable_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE role_user ADD CONSTRAINT role_user_role_id_foreign 
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE;

ALTER TABLE role_user ADD CONSTRAINT role_user_user_id_foreign 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE role_user ADD CONSTRAINT role_user_assigned_by_foreign 
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE permission_role ADD CONSTRAINT permission_role_permission_id_foreign 
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE;

ALTER TABLE permission_role ADD CONSTRAINT permission_role_role_id_foreign 
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE;

-- ============================================
-- STEP 15: Insert Migration Records
-- ============================================
INSERT INTO migrations (migration, batch) VALUES
('0001_01_01_000000_create_users_table', 1),
('0001_01_01_000001_create_cache_table', 1),
('0001_01_01_000002_create_jobs_table', 1),
('2026_01_02_000002_add_user_profile_fields', 1),
('2026_06_02_155943_create_personal_access_tokens_table', 1),
('2026_06_02_160321_create_audit_logs_table', 1),
('2026_06_02_161451_create_roles_and_permissions_tables', 1);

-- ============================================
-- STEP 16: Seed Roles
-- ============================================
INSERT INTO roles (name, guard_name, description, created_at, updated_at) VALUES
('ADMIN', 'sanctum', 'System administrator with full access to system configuration and user management', NOW(), NOW()),
('OWNER', 'sanctum', 'Business owner with financial oversight and full business control', NOW(), NOW()),
('EMPLOYEE', 'sanctum', 'Staff member with POS operations and limited data access', NOW(), NOW());

-- ============================================
-- STEP 17: Seed Permissions
-- ============================================
INSERT INTO permissions (name, guard_name, module, description, created_at, updated_at) VALUES
-- Authentication permissions
('auth.login', 'sanctum', 'auth', 'Allow user to login', NOW(), NOW()),
('auth.logout', 'sanctum', 'auth', 'Allow user to logout', NOW(), NOW()),
('auth.refresh', 'sanctum', 'auth', 'Allow user to refresh token', NOW(), NOW()),

-- Role management permissions
('roles.view', 'sanctum', 'roles', 'View roles list', NOW(), NOW()),
('roles.create', 'sanctum', 'roles', 'Create new roles', NOW(), NOW()),
('roles.update', 'sanctum', 'roles', 'Update existing roles', NOW(), NOW()),
('roles.delete', 'sanctum', 'roles', 'Delete roles', NOW(), NOW()),
('roles.manage', 'sanctum', 'roles', 'Full role management', NOW(), NOW()),

-- Permission management permissions
('permissions.view', 'sanctum', 'permissions', 'View permissions list', NOW(), NOW()),
('permissions.create', 'sanctum', 'permissions', 'Create new permissions', NOW(), NOW()),
('permissions.update', 'sanctum', 'permissions', 'Update existing permissions', NOW(), NOW()),
('permissions.delete', 'sanctum', 'permissions', 'Delete permissions', NOW(), NOW()),
('permissions.manage', 'sanctum', 'permissions', 'Full permission management', NOW(), NOW()),

-- Token management permissions
('tokens.view', 'sanctum', 'tokens', 'View API tokens', NOW(), NOW()),
('tokens.revoke', 'sanctum', 'tokens', 'Revoke API tokens', NOW(), NOW()),

-- User management permissions
('users.view', 'sanctum', 'users', 'View users list', NOW(), NOW()),
('users.create', 'sanctum', 'users', 'Create new users', NOW(), NOW()),
('users.update', 'sanctum', 'users', 'Update existing users', NOW(), NOW()),
('users.delete', 'sanctum', 'users', 'Delete users', NOW(), NOW()),
('users.suspend', 'sanctum', 'users', 'Suspend user accounts', NOW(), NOW()),

-- Profile permissions
('profile.update', 'sanctum', 'profile', 'Update own profile', NOW(), NOW()),
('profile.password', 'sanctum', 'profile', 'Change own password', NOW(), NOW()),

-- System permissions
('system.health', 'sanctum', 'system', 'Access health endpoints', NOW(), NOW()),
('system.info', 'sanctum', 'system', 'Access system information', NOW(), NOW());

-- ============================================
-- STEP 18: Assign Permissions to Roles
-- ============================================
-- ADMIN permissions (all permissions)
INSERT INTO permission_role (permission_id, role_id, created_at)
SELECT p.id, r.id, NOW()
FROM permissions p, roles r
WHERE r.name = 'ADMIN';

-- OWNER permissions (all permissions)
INSERT INTO permission_role (permission_id, role_id, created_at)
SELECT p.id, r.id, NOW()
FROM permissions p, roles r
WHERE r.name = 'OWNER';

-- EMPLOYEE permissions (only auth, profile, and basic view)
INSERT INTO permission_role (permission_id, role_id, created_at)
SELECT p.id, r.id, NOW()
FROM permissions p, roles r
WHERE r.name = 'EMPLOYEE' AND p.name IN (
    'auth.login',
    'auth.logout',
    'auth.refresh',
    'profile.update',
    'profile.password',
    'system.health'
);

-- ============================================
-- STEP 19: Seed Default Users
-- ============================================
-- Password hashes generated using bcrypt with cost 12
-- admin@watchshop.com / AdminPass123
-- owner@watchshop.com / OwnerPass123
-- employee@watchshop.com / EmployeePass123

INSERT INTO users (name, email, email_verified_at, password, is_active, phone, avatar_url, status, last_login_at, remember_token, created_at, updated_at) VALUES
('System Administrator', 'admin@watchshop.com', NOW(), '$2y$12$fYHTRzMZQ.KiLwNVLM1dfOfO7eRCy9VxM4S7TcgHPZ8KJRCMQ5an2', TRUE, '+1234567890', NULL, 'active', NULL, NULL, NOW(), NOW()),
('Business Owner', 'owner@watchshop.com', NOW(), '$2y$12$3imEkTRBC81qYfO1j396EuFmy/VvYisoQBDo1upuRMiyh0T5sh0Fy', TRUE, '+1234567891', NULL, 'active', NULL, NULL, NOW(), NOW()),
('John Cashier', 'employee@watchshop.com', NOW(), '$2y$12$SO0NRuZu/ODCDGcRIrG46uLsnmn7NExCVjPCDPSTjccSiyhASK5fu', TRUE, '+1234567892', NULL, 'active', NULL, NULL, NOW(), NOW());

-- ============================================
-- STEP 20: Assign Roles to Users
-- ============================================
-- Assign ADMIN role to first user (id=1)
INSERT INTO role_user (role_id, user_id, assigned_by, created_at)
SELECT r.id, u.id, u.id, NOW()
FROM roles r, users u
WHERE r.name = 'ADMIN' AND u.email = 'admin@watchshop.com';

-- Assign OWNER role to second user (id=2)
INSERT INTO role_user (role_id, user_id, assigned_by, created_at)
SELECT r.id, u.id, u.id, NOW()
FROM roles r, users u
WHERE r.name = 'OWNER' AND u.email = 'owner@watchshop.com';

-- Assign EMPLOYEE role to third user (id=3)
INSERT INTO role_user (role_id, user_id, assigned_by, created_at)
SELECT r.id, u.id, u.id, NOW()
FROM roles r, users u
WHERE r.name = 'EMPLOYEE' AND u.email = 'employee@watchshop.com';

-- ============================================
-- STEP 21: Verification Queries
-- ============================================
-- Run these to verify the setup:

-- Check roles
-- SELECT * FROM roles;

-- Check permissions
-- SELECT * FROM permissions;

-- Check users
-- SELECT id, name, email, status FROM users;

-- Check role assignments
-- SELECT u.name, r.name as role 
-- FROM users u 
-- JOIN role_user ru ON u.id = ru.user_id 
-- JOIN roles r ON ru.role_id = r.id;

-- Check permission assignments per role
-- SELECT r.name as role, p.name as permission
-- FROM roles r
-- JOIN permission_role pr ON r.id = pr.role_id
-- JOIN permissions p ON pr.permission_id = p.id
-- ORDER BY r.name, p.name;

-- ============================================
-- END OF SCRIPT
-- ============================================
