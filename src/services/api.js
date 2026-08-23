const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const request = async (path, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new ApiError(payload.message || "Something went wrong. Please try again.", response.status);
    }

    return payload;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("The server is unavailable. Please try again in a moment.", 0);
  }
};

export const authApi = {
  login: (mobileNumber, password) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ mobileNumber, password }),
    }),
  register: (student) =>
    request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(student),
    }),
  me: () => request("/api/auth/me"),
  logout: () => request("/api/auth/logout", { method: "POST" }),
};
