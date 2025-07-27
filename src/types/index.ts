export interface User {
  id: number;
  email: string;
  fullName: string;
  professionalTitle?: string;
  company?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  avatar?: string;
  experience?: Experience[];
  education?: Education[];
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

export interface Job {
  id: string | number;
  title: string;
  company: string;
  location: string;
  type?: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements?: string[];
  skills?: string[];
  postedDate?: string;
  deadline?: string;
  remote?: boolean;
  logo?: string;
  // Nuevos campos para las recomendaciones
  rank?: number;
  similarity_score?: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  loading: boolean;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  professionalTitle?: string;
  company?: string;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface JobSearchFilters {
  query: string;
  location: string;
  type: Job['type'] | '';
  remote: boolean;
  salaryMin?: number;
  salaryMax?: number;
}

// Nuevos interfaces para los métodos de búsqueda
export interface SearchMethod {
  name: string;
  description: string;
  use_case: string;
}

export interface SearchMethods {
  methods: {
    title_only: SearchMethod;
    combined: SearchMethod;
    hybrid: SearchMethod;
  };
  recommended: string;
}

export interface RecommendationRequest {
  query: string;
  top_n: number;
  method: 'title_only' | 'combined' | 'hybrid';
}

export interface RecommendationResponse {
  success: boolean;
  query: string;
  method: string;
  total_results: number;
  recommendations: Job[];
}

export interface JobsListResponse {
  total: number;
  skip: number;
  limit: number;
  jobs: Job[];
}
