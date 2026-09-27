/*
 * ==========================================
 * API BASE URL
 * ==========================================
 */

export const API_BASE_URL = (
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");


/*
 * ==========================================
 * COMMON REQUEST HELPER
 * ==========================================
 */

export async function apiRequest(
  endpoint,
  options = {}
) {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      /*
       * IMPORTANT
       * Allows browser to send/receive
       * authentication cookies.
       */
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
        `Request failed with status ${response.status}.`
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

  /*
   * GET CURRENT USER
   */

  me: async () => {
    return apiRequest(
      "/auth/me",
      {
        method: "GET",
      }
    );
  },


  /*
   * LOGIN
   */

  login: async (credentials) => {
    return apiRequest(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(credentials),
      }
    );
  },


  /*
   * LOGOUT
   */

  logout: async () => {
    return apiRequest(
      "/auth/logout",
      {
        method: "POST",
      }
    );
  },


  /*
   * STUDENT REGISTRATION
   */

  registerStudent: async (studentData) => {
    return apiRequest(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify(studentData),
      }
    );
  },


  /*
   * ALIAS
   *
   * This also allows code such as:
   *
   * authApi.register(...)
   *
   */

  register: async (studentData) => {
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


  update: async (
    id,
    queryData
  ) => {
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
   * GET ALL COMPETITIONS
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
   * GET UPCOMING COMPETITIONS
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
   * GET SINGLE COMPETITION
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
   * REGISTER FOR COMPETITION
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