import request from "supertest";
import app from "../src/app";
import { User } from "../src/modules/user/user.model";

describe("Auth Routes", () => {
    describe("POST /api/auth/signup", () => {
        it("should register a new user", async () => {
            const res = await request(app)
                .post("/api/auth/signup")
                .send({
                    name: "John",
                    email: "john@test.com",
                    password: "password123"
                });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("user");
            expect(res.body.user).toHaveProperty("_id");
            expect(res.body.user).toHaveProperty("name", "John");
            expect(res.body.user).toHaveProperty("email", "john@test.com");
         
            const user = await User.findOne({ email: "john@test.com" });
            expect(user).not.toBeNull()
        })
        it('should not allow duplicate email', async () => {
            await request(app)
                .post("/api/auth/signup")
                .send({
                    name: "John",
                    email: "john@test.com",
          password: "password123"
        });
        const res = await request(app)
        .post("/api/auth/signup")
        .send({
            name: "Jane",
            email: "john@test.com",
            password: "password123"
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toBe("Email is already registered");
        })
    });
})
