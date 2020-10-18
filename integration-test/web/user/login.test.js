const { request } = require("../../index");
const { User } = require("../../../server/model");
const db = require("../../setup/db_setup");
const mongoose = require("mongoose");
let apikey = process.env.API_KEY;
beforeEach(() => {
  let mockResponse = () => {
    const response = {};
    response.status = jest.fn().mockReturnValue(response);
    response.body = jest.fn().mockReturnValue(response);
    response.json = jest.fn().mockReturnValue(response);
    response.sendStatus = jest.fn().mockReturnValue(response);
    response.clearCookie = jest.fn().mockReturnValue(response);
    response.cookie = jest.fn().mockReturnValue(response);
    return response;
  };
  mockResponse();
});

// Connects to test database
db.setupDB();

/**
 * Login test
 */
describe("Login", () => {
  it("should respond with HTTP 401 for missing apikey", async (done) => {
    const response = await request.post("/api/login");

    expect(response.status).toBe(401);
    done();
  });

  it("should respond with user object for authenticated user", async (done) => {
    let response = await request
      .post("/api/signup")
      .send({
        name: "Zell",
        email: "testing@gmail.com",
        password: "Password2@",
        phone: "09036040503",
      })
      .set("apikey", apikey);

    response = await request
      .post("/api/login")
      .send({
        email: "testing@gmail.com",
        password: "Password2@",
      })
      .set("apikey", apikey);
    expect(response.body.data.name).toBeTruthy();
    expect(response.body.data.email).toBeTruthy();
    expect(response.status).toBe(200);
    done();
  });

  it("should respond with error message for missing password parameter", async (done) => {
    let response = await request
      .post("/api/login")
      .send({
        email: "testing@gmail.com",
      })
      .set("apikey", apikey);
    expect(response.status).toBe(422);
    done();
  });
});