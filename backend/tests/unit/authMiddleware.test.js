const jwt = require("jsonwebtoken");
const { authenticate, requireAdmin } = require("../../src/middleware/authMiddleware");

describe("authenticate middleware", () => {
  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it("should call next() and attach user for a valid token", () => {
    const token = jwt.sign({ id: 1, role: "user" }, process.env.JWT_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    const next = jest.fn();

    authenticate(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toHaveProperty("id", 1);
  });

  it("should return 401 with no token", () => {
    const req = { headers: {} };
    const res = mockRes();
    const next = jest.fn();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 for an invalid token", () => {
    const req = { headers: { authorization: "Bearer garbage" } };
    const res = mockRes();
    const next = jest.fn();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe("requireAdmin middleware", () => {
  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it("should call next() for an admin user", () => {
    const req = { user: { role: "admin" } };
    const res = mockRes();
    const next = jest.fn();

    requireAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("should return 403 for a non-admin user", () => {
    const req = { user: { role: "user" } };
    const res = mockRes();
    const next = jest.fn();

    requireAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
