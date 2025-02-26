import supertest from "supertest";
import app from "../src/app.js";
import User from "../src/models/user.js";
import Goal from "../src/models/goal.js";

import { connectDB, closeDB } from "../src/config/db.js";

const request = supertest(app);

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await closeDB();
});

describe("Goal Endpoints", () => {
  let token;
  let user;
  let goal;

  beforeEach(async () => {
    user = await User.create({
      name: "Test User",
      email: "example@gmail.com",
      password: "pass12345",
    });
  });

  afterEach(async () => {
    await User.deleteMany();
    await Goal.deleteMany();
  });
});

describe("POST /api/goals", () => {
  it("should create a new goal", async () => {
    const res = await request
      .post("/api/goals")
      .send({
        title: "Test Goal",
        description: "Test Description",
        category: "Test Category",
        startDate: "2021-01-01",
        endDate: "2021-12-31",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.title).toEqual("Test Goal");
  });
});
