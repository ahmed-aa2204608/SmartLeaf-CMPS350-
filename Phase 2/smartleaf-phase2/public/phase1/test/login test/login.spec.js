import { expect } from "chai";
import { loginUser } from "./loginLogic.js";

global.localStorage = {
  store: {},
  setItem(key, value) {
    this.store[key] = value;
  },
  getItem(key) {
    return this.store[key] || null;
  },
  removeItem(key) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  }
};

function mockFetchSuccess(jsonData) {
  return () => Promise.resolve({
    json: () => Promise.resolve(jsonData)
  });
}

// Helper to simulate a failing fetch.
function mockFetchFailure(errorMessage) {
  return () => Promise.reject(new Error(errorMessage));
}

describe("loginUser function", () => {

  afterEach(() => {
    global.localStorage.clear();
  });

  it("rejects with 'Please fill all fields' if username or password is empty", async () => {
    try {
      await loginUser("", "somePassword", mockFetchSuccess({ users: [] }));
      throw new Error("Expected rejection");
    } catch (err) {
      expect(err).to.equal("Please fill all fields");
    }
  });

  it("rejects with 'Invalid credentials' if no matching user is found", async () => {
    const fakeResponse = {
      users: [
        { username: "alice", password: "alice123", role: "student" }
      ]
    };
    try {
      await loginUser("nonexistent", "wrong", mockFetchSuccess(fakeResponse));
      throw new Error("Expected rejection");
    } catch (err) {
      expect(err).to.equal("Invalid credentials");
    }
  });

  it("resolves with 'student.html' for valid student credentials", async () => {
    const fakeResponse = {
      users: [
        { username: "alice", password: "alice123", role: "student" }
      ]
    };
    const redirectUrl = await loginUser("alice", "alice123", mockFetchSuccess(fakeResponse));
    expect(redirectUrl).to.equal("student.html");
    const storedUser = JSON.parse(global.localStorage.getItem("currentUser"));
    expect(storedUser.username).to.equal("alice");
  });

  it("resolves with 'admin.html' for valid admin credentials", async () => {
    const fakeResponse = {
      users: [
        { username: "bob", password: "bob123", role: "admin" }
      ]
    };
    const redirectUrl = await loginUser("bob", "bob123", mockFetchSuccess(fakeResponse));
    expect(redirectUrl).to.equal("admin.html");
  });

  it("resolves with 'instructor.html' for valid instructor credentials", async () => {
    const fakeResponse = {
      users: [
        { username: "drjohnson", password: "johnson123", role: "instructor" }
      ]
    };
    const redirectUrl = await loginUser("drjohnson", "johnson123", mockFetchSuccess(fakeResponse));
    expect(redirectUrl).to.equal("instructor.html");
  });

  it("rejects with 'Unknown user role' for unsupported roles", async () => {
    const fakeResponse = {
      users: [
        { username: "charlie", password: "charlie123", role: "other" }
      ]
    };
    try {
      await loginUser("charlie", "charlie123", mockFetchSuccess(fakeResponse));
      throw new Error("Expected rejection");
    } catch (err) {
      expect(err).to.equal("Unknown user role");
    }
  });

  it("rejects with generic error on fetch failure", async () => {
    try {
      await loginUser("alice", "alice123", mockFetchFailure("Network error"));
      throw new Error("Expected rejection");
    } catch (err) {
      expect(err).to.equal("Error fetching user data. Please try again later.");
    }
  });
});