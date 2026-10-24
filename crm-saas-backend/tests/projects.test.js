// Authorization tests for the /api/projects endpoints.
// The key guarantee: a user can only see, create and delete THEIR OWN projects.

const { test, before, after, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const { installFakePrisma, tokenFor, startServer } = require("./helpers");

// ─── In-memory fake of the Prisma methods the project service uses ──────────
// Like real Prisma, a filter whose value is `undefined` is IGNORED (matches
// every row). That is what makes a forgotten ownership check dangerous, so the
// fake reproduces it faithfully.
const matches = (row, where) =>
    Object.entries(where).every(([key, value]) => value === undefined || row[key] === value);

let rows;
let nextId;
const calls = { create: 0 };

const fakePrisma = {
    project: {
        findMany: async ({ where }) =>
            rows.filter((p) => matches(p, where)).map((p) => ({ ...p, tasks: [] })),
        create: async ({ data }) => {
            calls.create += 1;
            const row = { id: `p${nextId++}`, tasks: [], ...data };
            rows.push(row);
            return row;
        },
        deleteMany: async ({ where }) => {
            const before = rows.length;
            rows = rows.filter((p) => !matches(p, where));
            return { count: before - rows.length };
        },
    },
};

installFakePrisma(fakePrisma);
const app = require("../src/app");

let api;
before(async () => {
    api = await startServer(app);
});
after(async () => {
    await api.close();
});
beforeEach(() => {
    nextId = 100;
    calls.create = 0;
    rows = [
        { id: "a1", name: "Alice's project", description: null, userId: "alice" },
        { id: "b1", name: "Bob's project", description: null, userId: "bob" },
    ];
});

test("GET /api/projects without a token returns 401", async () => {
    const res = await api.request("GET", "/api/projects");
    assert.equal(res.status, 401);
});

test("GET /api/projects with an invalid token returns 401", async () => {
    const res = await api.request("GET", "/api/projects", { token: "not-a-jwt" });
    assert.equal(res.status, 401);
});

test("GET /api/projects returns only the authenticated user's projects", async () => {
    const res = await api.request("GET", "/api/projects", { token: tokenFor("alice") });
    assert.equal(res.status, 200);
    assert.deepEqual(res.json.map((p) => p.id), ["a1"]);
});

test("POST /api/projects creates a project owned by the token's user", async () => {
    const res = await api.request("POST", "/api/projects", {
        token: tokenFor("alice"),
        // The client tries to assign the project to someone else. Must be ignored.
        body: { name: "  New project  ", description: "demo", userId: "bob" },
    });

    assert.equal(res.status, 200);
    assert.equal(res.json.name, "New project"); // trimmed by the Zod schema
    assert.equal(res.json.userId, "alice");
});

test("POST /api/projects rejects an empty name with 400 and never hits the database", async () => {
    const res = await api.request("POST", "/api/projects", {
        token: tokenFor("alice"),
        body: { name: "   " },
    });

    assert.equal(res.status, 400);
    assert.equal(res.json.error, "Validation failed");
    assert.equal(calls.create, 0);
});

test("DELETE /api/projects/:id removes the user's own project (204)", async () => {
    const res = await api.request("DELETE", "/api/projects/a1", { token: tokenFor("alice") });
    assert.equal(res.status, 204);
    assert.equal(rows.some((p) => p.id === "a1"), false);
});

test("DELETE /api/projects/:id on another user's project returns 404 and deletes nothing", async () => {
    const res = await api.request("DELETE", "/api/projects/b1", { token: tokenFor("alice") });
    assert.equal(res.status, 404);
    assert.equal(rows.some((p) => p.id === "b1"), true); // Bob's project is untouched
});
