export const API_BASE_URL = (
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

/*
 * ==========================================
 * COMMON REQUEST HELPER
 * ==========================================
 */

export async function apiRequest(endpoint, options = {}) {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      credentials: "include",

      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },

      ...options,
    }
  );

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const error = new Error(
      data?.message ||
        "Something went wrong. Please try again."
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}


/*
 * ==========================================
 * AUTH API
 * ==========================================
 */

export const authApi = {

  me: async () => {
    return apiRequest(
      "/auth/me",
      {
        method: "GET",
      }
    );
  },


  login: async (credentials) => {
    return apiRequest(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(credentials),
      }
    );
  },


  logout: async () => {
    return apiRequest(
      "/auth/logout",
      {
        method: "POST",
      }
    );
  },


  registerStudent: async (studentData) => {
    return apiRequest(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify(studentData),
      }
    );
  },

};


/*
 * ==========================================
 * QUERY API
 * ==========================================
 */

export const queryApi = {

  create: async (queryData) => {
    return apiRequest(
      "/queries",
      {
        method: "POST",
        body: JSON.stringify(queryData),
      }
    );
  },


  mine: async () => {
    return apiRequest(
      "/queries/my",
      {
        method: "GET",
      }
    );
  },


  all: async () => {
    return apiRequest(
      "/queries",
      {
        method: "GET",
      }
    );
  },


  get: async (id) => {
    return apiRequest(
      `/queries/${id}`,
      {
        method: "GET",
      }
    );
  },


  update: async (id, queryData) => {
    return apiRequest(
      `/queries/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(queryData),
      }
    );
  },


  delete: async (id) => {
    return apiRequest(
      `/queries/${id}`,
      {
        method: "DELETE",
      }
    );
  },

};


/*
 * ==========================================
 * COMPETITION API
 * ==========================================
 */

export const competitionApi = {

  /*
   * ========================================
   * GET ALL COMPETITIONS
   *
   * PUBLIC
   * ========================================
   */

  all: async () => {
    return apiRequest(
      "/competitions",
      {
        method: "GET",
      }
    );
  },


  /*
   * ========================================
   * GET UPCOMING COMPETITIONS
   *
   * PUBLIC
   * ========================================
   */

  upcoming: async () => {
    return apiRequest(
      "/competitions/upcoming",
      {
        method: "GET",
      }
    );
  },


  /*
   * ========================================
   * GET SINGLE COMPETITION
   *
   * PUBLIC
   * ========================================
   */

  get: async (id) => {
    return apiRequest(
      `/competitions/${id}`,
      {
        method: "GET",
      }
    );
  },


  /*
   * ========================================
   * REGISTER FOR COMPETITION
   *
   * STUDENT
   * ========================================
   */

  register: async (id) => {
    return apiRequest(
      `/competitions/${id}/register`,
      {
        method: "POST",
      }
    );
  },

};


/*
 * ==========================================
 * RESULT API
 * ==========================================
 */

export const resultApi = {

  mine: async () => {
    return apiRequest(
      "/results/my",
      {
        method: "GET",
      }
    );
  },

};


/*
 * ==========================================
 * AI API
 * ==========================================
 */

export const aiApi = {

  chat: async (message) => {
    return apiRequest(
      "/ai/chat",
      {
        method: "POST",

        body: JSON.stringify({
          message,
        }),
      }
    );
  },

};
