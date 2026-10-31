// Shared test helpers.
//
// The tests exercise the real Express app (routes, middlewares, controllers,
// services) but replace the Prisma client with an in-memory fake, so they run
// without a database and without generating the Prisma client.
//
// Each test file runs in its own process (node --test), so the module cache
// override below never leaks between files.

process.env.JWT_SECRET = "test-secret-do-not-use-in-production";
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
process.env.NODE_ENV = "test";

const jwt = require("jsonwebtoken");

/** Replace src/config/prisma with a fake. Call BEFORE requiring the app. */
function installFakePrisma(fake) {
    const prismaPath = require.resolve("../src/config/prisma");
    require.cache[prismaPath] = {
        id: prismaPath,
        filename: prismaPath,
        loaded: true,
        exports: fake,
    };
}

/** Sign a JWT the same way the auth service does. */
function tokenFor(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

/** Start the Express app on a random port and return a tiny fetch wrapper. */
async function startServer(app) {
    const server = app.listen(0);
    await new Promise((resolve) => server.once("listening", resolve));
    const baseUrl = `http://127.0.0.1:${server.address().port}`;

    async function request(method, path, { token, body } = {}) {
        const headers = {};
        if (token) headers.Authorization = `Bearer ${token}`;
        if (body !== undefined) headers["Content-Type"] = "application/json";

        const res = await fetch(baseUrl + path, {
            method,
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });

        const text = await res.text();
        let json = null;
        try {
            json = text ? JSON.parse(text) : null;
        } catch {
            // non-JSON body (e.g. 204 No Content)
        }
        return { status: res.status, json };
    }

    return { request, close: () => new Promise((resolve) => server.close(resolve)) };
}

module.exports = { installFakePrisma, tokenFor, startServer };
