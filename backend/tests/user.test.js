import supertest from "supertest";
import app from "../src/app.js";
import User from "../src/models/user.js";

import { connectDB, closeDB } from "../src/config/db.js";

const request = supertest(app);

beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    await closeDB();
});

describe("User Endpoints", () => {
    let token;
    let user;

    beforeEach(async () => {
        user = await User.create({
            name: "Test User",
            email: "example@gmail.com",
            password: "pass12345",
        });
    });

    afterEach(async () => {
        await User.deleteMany();
    });

    describe("POST /api/users/auth", () => {
        it("should authenticate user and return token", async () => {
            const res = await request
                .post("/api/users/auth")
                .send({
                    email: "example@gmail.com",
                    password: "pass12345",
                });
            
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("token");
        }
    );

    describe("POST /api/users", () => {
        it("should register a new user", async () => {
            const res = await request
                .post("/api/users")
                .send({
                    name: "New User",
                    email: "new@gmail.com",
                    password: "newpass123",
                });
            
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty("token");
        }
    );
});

// Run the test with the command:
// npm test user.test.js
