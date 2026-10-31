// Tests for the /api/auth endpoints and the Zod request schemas.

const { test, before, after, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { installFakePrisma, startServer } = require("./helpers");

// ─── In-memory fake of the Prisma methods the auth service uses ─────────────
let users;

const fakePrisma = {
    user: {
        findUnique: async ({ where }) =>
            users.find((u) => u.email === where.email) ?? null,
        create: async ({ data }) => {
            if (users.some((u) => u.email === data.email)) {
                // Same error shape Prisma throws on a unique-constraint violation.
                const err = new Error("Unique constraint failed");
                err.code = "P2002";
                throw err;
            }
            const user = { id: `u${users.length + 1}`, role: "USER", ...data };
            users.push(user);
            return user;
        },
    },
};

installFakePrisma(fakePrisma);
const app = require("../src/app");
const { registerSchema, loginSchema } = require("../src/schemas/auth.schema");

let api;
before(async () => {
    api = await startServer(app);
});
after(async () => {
    await api.close();
});
beforeEach(() => {
    users = [
        {
            id: "u1",
            name: "Alice",
            email: "alice@example.com",
            // Low cost factor keeps the test fast; production uses 10.
            password: bcrypt.hashSync("correct-horse", 4),
            role: "USER",
        },
    ];
});

// ─── Schemas ────────────────────────────────────────────────────────────────

test("registerSchema trims and lowercases the email", () => {
    const result = registerSchema.safeParse({
        name: "  Bob  ",
        email: "  Bob@Example.COM ",
        password: "secret123",
    });
    assert.equal(result.success, true);
    assert.equal(result.data.email, "bob@example.com");
    assert.equal(result.data.name, "Bob");
});

test("registerSchema rejects short passwords and invalid emails", () => {
    assert.equal(
        registerSchema.safeParse({ name: "Bob", email: "bob@example.com", password: "123" }).success,
        false,
    );
    assert.equal(
        registerSchema.safeParse({ name: "Bob", email: "not-an-email", password: "secret123" }).success,
        false,
    );
});

test("loginSchema requires a password", () => {
    assert.equal(loginSchema.safeParse({ email: "a@b.co", password: "" }).success, false);
});

// ─── POST /api/auth/login ───────────────────────────────────────────────────

test("login with valid credentials returns a JWT carrying the user id", async () => {
    const res = await api.request("POST", "/api/auth/login", {
        body: { email: "alice@example.com", password: "correct-horse" },
    });

    assert.equal(res.status, 200);
    const payload = jwt.verify(res.json.token, process.env.JWT_SECRET);
    assert.equal(payload.userId, "u1");
});

test("login response never includes the password hash", async () => {
    const res = await api.request("POST", "/api/auth/login", {
        body: { email: "alice@example.com", password: "correct-horse" },
    });
    assert.equal(res.status, 200);
    assert.equal("password" in res.json.user, false);
});

test("login with a wrong password returns 401 'Invalid credentials'", async () => {
    const res = await api.request("POST", "/api/auth/login", {
        body: { email: "alice@example.com", password: "wrong" },
    });
    assert.equal(res.status, 401);
    assert.equal(res.json.error, "Invalid credentials");
});

test("login with an unknown email returns the SAME error (no user enumeration)", async () => {
    const unknown = await api.request("POST", "/api/auth/login", {
        body: { email: "nobody@example.com", password: "whatever" },
    });
    const wrongPassword = await api.request("POST", "/api/auth/login", {
        body: { email: "alice@example.com", password: "wrong" },
    });

    assert.equal(unknown.status, 401);
    assert.deepEqual(unknown.json, wrongPassword.json);
});

test("login with a malformed body returns 400 before touching the database", async () => {
    const res = await api.request("POST", "/api/auth/login", { body: { email: "x" } });
    assert.equal(res.status, 400);
    assert.equal(res.json.error, "Validation failed");
});

// ─── POST /api/auth/register ────────────────────────────────────────────────

test("register creates a user and stores a bcrypt hash, not the plain password", async () => {
    const res = await api.request("POST", "/api/auth/register", {
        body: { name: "Bob", email: "bob@example.com", password: "secret123" },
    });

    assert.equal(res.status, 201);
    const stored = users.find((u) => u.email === "bob@example.com");
    assert.notEqual(stored.password, "secret123");
    assert.equal(await bcrypt.compare("secret123", stored.password), true);
});

test("register response never includes the password hash", async () => {
    const res = await api.request("POST", "/api/auth/register", {
        body: { name: "Carol", email: "carol@example.com", password: "secret123" },
    });
    assert.equal(res.status, 201);
    assert.equal("password" in res.json, false);
    assert.equal(res.json.email, "carol@example.com");
});

test("register with an already used email returns 400", async () => {
    const res = await api.request("POST", "/api/auth/register", {
        body: { name: "Alice 2", email: "alice@example.com", password: "secret123" },
    });
    assert.equal(res.status, 400);
    assert.equal(res.json.error, "Email already registered");
});
