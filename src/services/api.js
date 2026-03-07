const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class ApiService {
  constructor() {
    this.token = localStorage.getItem("token");
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem("token", token);
  }

  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
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
    this.setToken(data.token);
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

  async enrollCourse(courseId) {
    return this.request(`/courses/${courseId}/enroll`, {
      method: "POST",
    });
  }

  // Progress tracking
  async completeLesson(courseId, lessonId) {
    return this.request(`/courses/${courseId}/lessons/${lessonId}/complete`, {
      method: "POST",
    });
  }

  async submitQuiz(courseId, moduleId, answers) {
    return this.request(`/courses/${courseId}/modules/${moduleId}/quiz`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    });
  }
}

export default new ApiService();
