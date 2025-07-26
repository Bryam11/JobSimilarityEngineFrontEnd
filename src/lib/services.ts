import api from './api';
import { User, LoginResponse, RegisterData, Job, JobSearchFilters, ApiResponse } from '@/types';
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
  searchJobs: async (filters: JobSearchFilters): Promise<Job[]> => {
    // Como tu API no tiene endpoint de jobs aún, devolver datos mock
    // Aquí implementarías la llamada real cuando esté disponible

    console.warn('Mock job data returned. Implement API call when available.', filters);

    const mockJobs: Job[] = [
      {
        id: '1',
        title: 'Desarrollador Full Stack Senior',
        company: 'TechCorp',
        location: 'Madrid, España',
        type: 'full-time',
        salary: { min: 50000, max: 70000, currency: 'EUR' },
        description: 'Buscamos un desarrollador Full Stack con experiencia en React y Node.js',
        requirements: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
        postedDate: '2025-01-07T10:00:00Z',
        remote: false
      },
      // ... más trabajos mock
    ];

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockJobs);
      }, 500);
    });
  },

  getJobById: async (id: string): Promise<Job> => {
    // Mock implementation
    const mockJob: Job = {
      id,
      title: 'Desarrollador Full Stack Senior',
      company: 'TechCorp',
      location: 'Madrid, España',
      type: 'full-time',
      salary: { min: 50000, max: 70000, currency: 'EUR' },
      description: 'Buscamos un desarrollador Full Stack con experiencia en React y Node.js',
      requirements: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
      skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
      postedDate: '2025-01-07T10:00:00Z',
      remote: false
    };

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockJob);
      }, 300);
    });
  },

  getRecommendedJobs: async (): Promise<Job[]> => {
    return jobService.searchJobs({
      query: '',
      location: '',
      type: '',
      remote: false,
    });
  },

  applyToJob: async (jobId: string): Promise<ApiResponse<{ applied: boolean }>> => {
    console.log(`Applying to job with ID: ${jobId}`);

    // Mock implementation
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
