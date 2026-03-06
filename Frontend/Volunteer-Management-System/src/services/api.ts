import axios from "axios";

// ==================== TYPE DEFINITIONS ====================

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface TaskData {
  title: string;
  description: string;
  status: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'VOLUNTEER';
  impactScore: number;
  totalHours: number;
  emailVerified: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  token: string;
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'VOLUNTEER';
  impactScore?: number;
  totalHours?: number;
  emailVerified?: boolean;
}

// ==================== AXIOS CONFIG ====================

const API_BASE = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor - adds token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handles errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH APIS ====================

export const authAPI = {
  register: (data: RegisterData) =>
    api.post<{ id: string; name: string; email: string; role: string }>("/auth/register", data),

  login: (data: LoginData) =>
    api.post<LoginResponse>("/auth/login", data),

  getProfile: () => api.get<User>("/auth/profile"),

  verifyEmail: (token: string) => 
    api.get<{ message: string }>(`/auth/verify-email?token=${token}`),

  resendVerification: (email: string) => 
    api.post<{ message: string }>("/auth/resend-verification", { email }),
};

// ==================== TASK APIS ====================

export const taskAPI = {
  getAll: () => api.get<Task[]>("/tasks"),
  getById: (id: string) => api.get<Task>(`/tasks/${id}`),
  create: (data: TaskData) => api.post<Task>("/tasks", data),
  update: (id: string, data: TaskData) => api.put<Task>(`/tasks/${id}`, data),
  delete: (id: string) => api.delete<{ message: string }>(`/tasks/${id}`),
};

// ==================== ADMIN APIS ====================

export const adminAPI = {
  getAllUsers: () => api.get<User[]>("/admin/users"),
  deleteUser: (id: string) => api.delete<{ message: string }>(`/admin/users/${id}`),
  getAllTasks: () => api.get<Task[]>("/admin/tasks/all"),
};

export const registerUser = authAPI.register;
export const loginUser = authAPI.login;
export const getProfile = authAPI.getProfile;
export const verifyEmail = authAPI.verifyEmail;
export const resendVerification = authAPI.resendVerification;

export const getTasks = taskAPI.getAll;
export const getTaskById = taskAPI.getById;
export const createTask = taskAPI.create;
export const updateTask = taskAPI.update;
export const deleteTask = taskAPI.delete;

export const getAllUsers = adminAPI.getAllUsers;
export const deleteUser = adminAPI.deleteUser;
export const getAllTasksAdmin = adminAPI.getAllTasks;

export default api;