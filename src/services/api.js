const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const token = localStorage.getItem("token");

    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, { ...options, headers });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }
      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
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

  // User endpoints
  async getProfile() {
    return this.request("/users/profile");
  }

  async updateProfile(profileData) {
    return this.request("/users/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  async completeOnboarding(onboardingData) {
    return this.request("/users/onboarding", {
      method: "POST",
      body: JSON.stringify(onboardingData),
    });
  }

  async getActivities() {
    return this.request("/users/activities");
  }

  // Course endpoints
  async getCourses() {
    return this.request("/courses");
  }

  async getCourse(id) {
    return this.request(`/courses/${id}`);
  }

  async createCourse(courseData) {
    return this.request("/courses", {
      method: "POST",
      body: JSON.stringify(courseData),
    });
  }

  async updateCourse(courseId, courseData) {
    return this.request(`/courses/${courseId}`, {
      method: "PUT",
      body: JSON.stringify(courseData),
    });
  }

  async deleteCourse(courseId) {
    return this.request(`/courses/${courseId}`, {
      method: "DELETE",
    });
  }

  async enrollCourse(courseId) {
    return this.request(`/courses/${courseId}/enroll`, {
      method: "POST",
    });
  }

  async completeLesson(courseId, moduleId, lessonId) {
    return this.request(
      `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/complete`,
      {
        method: "POST",
      },
    );
  }

  // Admin endpoints
  async getAllUsers() {
    return this.request("/admin/users");
  }

  async getSystemStats() {
    return this.request("/admin/stats");
  }

  async updateUserRole(userId, role) {
    return this.request(`/admin/users/${userId}/role`, {
      method: "PUT",
      body: JSON.stringify({ role }),
    });
  }

  async deleteUser(userId) {
    return this.request(`/admin/users/${userId}`, {
      method: "DELETE",
    });
  }

  async deleteAdminCourse(courseId) {
    return this.request(`/admin/courses/${courseId}`, {
      method: "DELETE",
    });
  }

  // Password reset
  async requestPasswordReset(email) {
    return this.request("/password/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async verifyResetCode(email, code) {
    return this.request("/password/verify-code", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    });
  }

  async resetPassword(email, code, newPassword) {
    return this.request("/password/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, code, newPassword }),
    });
  }

  // AI endpoints
  async generateQuestions(content, numQuestions = 5, difficulty = "medium") {
    return this.request("/ai/generate-questions", {
      method: "POST",
      body: JSON.stringify({ content, numQuestions, difficulty }),
    });
  }

  async scoreQuiz(questions, answers) {
    return this.request("/ai/score-quiz", {
      method: "POST",
      body: JSON.stringify({ questions, answers }),
    });
  }

  // Logout helper
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
  }

  isAuthenticated() {
    return !!localStorage.getItem("token");
  }

  getCurrentUser() {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
  }
}

export default new ApiService();
