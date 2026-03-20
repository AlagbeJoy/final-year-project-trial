const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const token = localStorage.getItem("token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  }

  // Auth endpoints
  async register(userData) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    const data = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("currentUser", JSON.stringify(data.user));
    }
    return data;
  }

  // ========== COURSE ENDPOINTS ==========

  /**
   * Get all courses
   */
  async getCourses() {
    return this.request("/courses", {
      method: "GET",
    });
  }

  /**
   * Get a single course by ID
   */
  async getCourse(courseId) {
    return this.request(`/courses/${courseId}`, {
      method: "GET",
    });
  }

  /**
   * Create a new course (lecturer only)
   */
  async createCourse(courseData) {
    return this.request("/courses", {
      method: "POST",
      body: JSON.stringify(courseData),
    });
  }

  /**
   * Update an existing course (lecturer only)
   */
  async updateCourse(courseId, courseData) {
    return this.request(`/courses/${courseId}`, {
      method: "PUT",
      body: JSON.stringify(courseData),
    });
  }

  async getCourses() {
    return this.request("/courses");
  }

  async getCourse(id) {
    return this.request(`/courses/${id}`);
  }

  /**
   * Delete a course (lecturer only)
   */
  async deleteCourse(courseId) {
    return this.request(`/courses/${courseId}`, {
      method: "DELETE",
    });
  }

  /**
   * Enroll in a course (student only)
   */
  async enrollCourse(courseId) {
    return this.request(`/courses/${courseId}/enroll`, {
      method: "POST",
    });
  }

  /**
   * Unenroll from a course (student only)
   */
  async unenrollCourse(courseId) {
    return this.request(`/courses/${courseId}/unenroll`, {
      method: "POST",
    });
  }

  /**
   * Get courses a user is enrolled in
   */
  async getMyCourses() {
    return this.request("/courses/my-courses", {
      method: "GET",
    });
  }

  /**
   * Get courses created by a lecturer
   */
  async getMyCreatedCourses() {
    return this.request("/courses/my-created", {
      method: "GET",
    });
  }

  // ========== LESSON PROGRESS ENDPOINTS ==========

  /**
   * Complete a lesson and earn XP
   */
  async completeLesson(courseId, moduleId, lessonId) {
    return this.request(
      `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/complete`,
      {
        method: "POST",
      },
    );
  }

  /**
   * Submit a quiz and get results
   */
  async submitQuiz(courseId, moduleId, answers) {
    return this.request(
      `/courses/${courseId}/modules/${moduleId}/quiz/submit`,
      {
        method: "POST",
        body: JSON.stringify({ answers }),
      },
    );
  }

  // ========== USER PROFILE ENDPOINTS ==========

  /**
   * Get current user profile
   */
  async getProfile() {
    return this.request("/users/profile", {
      method: "GET",
    });
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData) {
    return this.request("/users/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  /**
   * Get user's activity feed
   */
  async getActivities() {
    return this.request("/users/activities", {
      method: "GET",
    });
  }

  /**
   * Get user's badges
   */
  async getBadges() {
    return this.request("/users/badges", {
      method: "GET",
    });
  }

  // ========== ADMIN ENDPOINTS ==========

  /**
   * Get all users (admin only)
   */
  async getAllUsers() {
    return this.request("/admin/users", {
      method: "GET",
    });
  }

  /**
   * Update user role (admin only)
   */
  async updateUserRole(userId, role) {
    return this.request(`/admin/users/${userId}/role`, {
      method: "PUT",
      body: JSON.stringify({ role }),
    });
  }

  /**
   * Delete user (admin only)
   */
  async deleteUser(userId) {
    return this.request(`/admin/users/${userId}`, {
      method: "DELETE",
    });
  }

  /**
   * Get system stats (admin only)
   */
  async getSystemStats() {
    return this.request("/admin/stats", {
      method: "GET",
    });
  }

  // ========== UTILITY METHODS ==========

  /**
   * Logout - clear local storage
   */
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem("token");
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser() {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
  }
}

export default new ApiService();
