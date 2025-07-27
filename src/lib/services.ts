import api from './api';
import {
  User,
  LoginResponse,
  RegisterData,
  Job,
  JobSearchFilters,
  ApiResponse,
  SearchMethods,
  RecommendationRequest,
  RecommendationResponse,
  JobsListResponse
} from '@/types';
import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  sub: string; // email
  fullName: string;
  id: number;
  iat: number;
  exp: number;
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse & { user: User }> => {
    const response = await api.post('/auth/login', { email, password });
    const { token, tokenType } = response.data;

    // Decodificar el JWT para extraer información del usuario
    const decoded = jwtDecode<JWTPayload>(token);

    const user: User = {
      id: decoded.id,
      email: decoded.sub,
      fullName: decoded.fullName,
      professionalTitle: undefined,
      company: undefined,
      location: undefined,
      bio: undefined,
      skills: [],
    };

    return {
      token,
      tokenType,
      user
    };
  },

  register: async (userData: RegisterData): Promise<LoginResponse & { user: User }> => {
    const response = await api.post('/auth/register', userData);
    const { token, tokenType } = response.data;

    // Decodificar el JWT para extraer información del usuario
    const decoded = jwtDecode<JWTPayload>(token);

    const user: User = {
      id: decoded.id,
      email: decoded.sub,
      fullName: decoded.fullName,
      professionalTitle: userData.professionalTitle,
      company: userData.company,
      location: undefined,
      bio: undefined,
      skills: [],
    };

    return {
      token,
      tokenType,
      user
    };
  },

  getProfile: async (): Promise<User> => {
    // Como tu API no tiene endpoint de perfil aún, 
    // decodificamos el token para obtener la info básica
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth-token='))
      ?.split('=')[1];

    if (!token) {
      throw new Error('No token found');
    }

    const decoded = jwtDecode<JWTPayload>(token);

    return {
      id: decoded.id,
      email: decoded.sub,
      fullName: decoded.fullName,
      professionalTitle: undefined,
      company: undefined,
      location: undefined,
      bio: undefined,
      skills: [],
    };
  },

  updateProfile: async (userData: Partial<User>): Promise<User> => {
    // Endpoint no disponible aún, simular actualización local
    const currentUser = await authService.getProfile();
    return { ...currentUser, ...userData };
  },
};

export const jobService = {
  // Obtener métodos de búsqueda disponibles
  getSearchMethods: async (): Promise<SearchMethods> => {
    const response = await api.get('/model/search-methods');
    return response.data;
  },

  // Buscar trabajos con recomendaciones por IA
  searchJobsWithAI: async (request: RecommendationRequest): Promise<RecommendationResponse> => {
    const response = await api.post('/model/recommend', request);

    // Transformar los datos para que coincidan con nuestro interface Job
    const transformedRecommendations = response.data.recommendations.map((job: Job) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      rank: job.rank,
      similarity_score: job.similarity_score,
      // Campos opcionales que no vienen de la API
      type: undefined,
      salary: undefined,
      requirements: [],
      skills: [],
      postedDate: undefined,
      remote: undefined,
      logo: undefined
    }));

    return {
      ...response.data,
      recommendations: transformedRecommendations
    };
  },

  // Obtener todos los trabajos (con paginación)
  getAllJobs: async (skip: number = 0, limit: number = 100): Promise<JobsListResponse> => {
    const response = await api.get(`/model/jobs?skip=${skip}&limit=${limit}`);

    // Transformar los datos para que coincidan con nuestro interface Job
    const transformedJobs = response.data.jobs.map((job: Job) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      // Campos opcionales que no vienen de la API
      type: undefined,
      salary: undefined,
      requirements: [],
      skills: [],
      postedDate: undefined,
      remote: undefined,
      logo: undefined
    }));

    return {
      ...response.data,
      jobs: transformedJobs
    };
  },

  // Método legacy para compatibilidad con búsqueda tradicional
  searchJobs: async (filters: JobSearchFilters): Promise<Job[]> => {
    if (filters.query) {
      // Si hay una query, usar el sistema de recomendaciones IA
      const recommendations = await jobService.searchJobsWithAI({
        query: filters.query,
        top_n: 20,
        method: 'hybrid'
      });
      return recommendations.recommendations;
    } else {
      // Si no hay query, obtener trabajos generales
      const jobsList = await jobService.getAllJobs(0, 50);
      return jobsList.jobs;
    }
  },

  getJobById: async (id: string | number): Promise<Job> => {
    // Buscar el trabajo en la lista general primero
    try {
      const jobsList = await jobService.getAllJobs(0, 1000); // Obtener más trabajos para buscar
      const job = jobsList.jobs.find(j => j.id.toString() === id.toString());

      if (job) {
        return job;
      }
    } catch (error) {
      console.error('Error fetching job by ID:', error);
    }

    // Si no se encuentra, devolver un trabajo mock
    return {
      id,
      title: 'Trabajo no encontrado',
      company: 'N/A',
      location: 'N/A',
      description: 'Este trabajo no está disponible en este momento.',
      type: undefined,
      salary: undefined,
      requirements: [],
      skills: [],
      postedDate: undefined,
      remote: undefined
    };
  },

  getRecommendedJobs: async (query: string = 'desarrollador'): Promise<Job[]> => {
    try {
      const recommendations = await jobService.searchJobsWithAI({
        query,
        top_n: 10,
        method: 'hybrid'
      });
      return recommendations.recommendations;
    } catch (error) {
      console.error('Error getting recommended jobs:', error);
      // Fallback a trabajos generales si falla la recomendación
      const jobsList = await jobService.getAllJobs(0, 10);
      return jobsList.jobs;
    }
  },

  applyToJob: async (jobId: string | number): Promise<ApiResponse<{ applied: boolean }>> => {
    console.log(`Applying to job with ID: ${jobId}`);

    // Mock implementation - aquí implementarías el endpoint real cuando esté disponible
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: { applied: true },
          message: 'Aplicación enviada correctamente'
        });
      }, 1000);
    });
  },
};
