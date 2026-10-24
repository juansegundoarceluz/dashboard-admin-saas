// Regression tests for the security fixes:
//   - the old unauthenticated /api/users routes are gone
//   - /api/task requires a JWT and is scoped to the caller's own projects
//   - a signed token without a userId is rejected

const { test, before, after, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");
const { installFakePrisma, tokenFor, startServer } = require("./helpers");

// Like real Prisma, a filter whose value is `undefined` is IGNORED.
const matches = (row, where) =>
    Object.entries(where).every(([key, value]) => value === undefined || row[key] === value);

let projects;
let tasks;
let nextId;
const calls = { taskCreate: 0 };

const fakePrisma = {
    project: {
        findFirst: async ({ where }) => projects.find((p) => matches(p, where)) ?? null,
    },
    task: {
        create: async ({ data }) => {
            calls.taskCreate += 1;
            const row = { id: `t${nextId++}`, completed: false, ...data };
            tasks.push(row);
            return row;
        },
        findMany: async ({ where }) =>
            tasks
                .map((t) => ({ ...t, project: projects.find((p) => p.id === t.projectId) }))
                .filter((t) => matches(t.project, where.project)),
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
    calls.taskCreate = 0;
    projects = [
        { id: "a1", name: "Alice's project", userId: "alice" },
        { id: "b1", name: "Bob's project", userId: "bob" },
    ];
    tasks = [
        { id: "ta", title: "Alice's task", completed: false, projectId: "a1" },
        { id: "tb", title: "Bob's task", completed: false, projectId: "b1" },
    ];
});

// ─── Removed routes ─────────────────────────────────────────────────────────

test("the old /api/users routes no longer exist", async () => {
    const list = await api.request("GET", "/api/users");
    const create = await api.request("POST", "/api/users/create", {
        body: { name: "x", email: "x@x.co", password: "plain" },
    });
    assert.equal(list.status, 404);
    assert.equal(create.status, 404);
});

// ─── Token hardening ────────────────────────────────────────────────────────

test("a correctly signed token WITHOUT a userId is rejected", async () => {
    const token = jwt.sign({ role: "ADMIN" }, process.env.JWT_SECRET);
    const res = await api.request("GET", "/api/projects", { token });
    assert.equal(res.status, 401);
});

// ─── /api/task ──────────────────────────────────────────────────────────────

test("task routes require authentication", async () => {
    const list = await api.request("GET", "/api/task");
    const create = await api.request("POST", "/api/task/create", {
        body: { title: "t", projectId: "a1" },
    });
    assert.equal(list.status, 401);
    assert.equal(create.status, 401);
});

test("GET /api/task returns only tasks from the caller's own projects", async () => {
    const res = await api.request("GET", "/api/task", { token: tokenFor("alice") });
    assert.equal(res.status, 200);
    assert.deepEqual(res.json.map((t) => t.id), ["ta"]);
});

test("POST /api/task/create adds a task to the caller's own project", async () => {
    const res = await api.request("POST", "/api/task/create", {
        token: tokenFor("alice"),
        body: { title: "  Write tests  ", projectId: "a1" },
    });
    assert.equal(res.status, 201);
    assert.equal(res.json.title, "Write tests");
    assert.equal(res.json.projectId, "a1");
});

test("POST /api/task/create in someone else's project returns 404 and creates nothing", async () => {
    const res = await api.request("POST", "/api/task/create", {
        token: tokenFor("alice"),
        body: { title: "Sneaky", projectId: "b1" },
    });
    assert.equal(res.status, 404);
    assert.equal(calls.taskCreate, 0);
});

test("POST /api/task/create validates the body before touching the database", async () => {
    const res = await api.request("POST", "/api/task/create", {
        token: tokenFor("alice"),
        body: { title: "", projectId: "a1" },
    });
    assert.equal(res.status, 400);
    assert.equal(calls.taskCreate, 0);
});
