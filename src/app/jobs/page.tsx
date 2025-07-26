'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/Loading';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  Star,
  Filter,
  SlidersHorizontal,
  BookmarkPlus,
  Eye,
  X
} from 'lucide-react';
import { Job, JobSearchFilters } from '@/types';
import { formatRelativeTime, formatSalary, getJobTypeLabel } from '@/lib/utils';

// Mock data ampliado para el demo
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Desarrollador Full Stack Senior',
    company: 'TechCorp',
    location: 'Madrid, España',
    type: 'full-time',
    salary: { min: 50000, max: 70000, currency: 'EUR' },
    description: 'Buscamos un desarrollador Full Stack con experiencia en React y Node.js para unirse a nuestro equipo dinámico. Trabajarás en proyectos emocionantes utilizando las últimas tecnologías.',
    requirements: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
    postedDate: '2025-01-07T10:00:00Z',
    remote: false
  },
  {
    id: '2',
    title: 'Diseñador UX/UI',
    company: 'DesignStudio',
    location: 'Barcelona, España',
    type: 'full-time',
    salary: { min: 40000, max: 55000, currency: 'EUR' },
    description: 'Únete a nuestro equipo de diseño para crear experiencias increíbles que deleiten a nuestros usuarios. Buscamos alguien con pasión por el diseño centrado en el usuario.',
    requirements: ['Figma', 'Adobe XD', 'Prototipado', 'User Research'],
    skills: ['Figma', 'Adobe XD', 'User Research', 'Prototipado', 'Sketch'],
    postedDate: '2025-01-06T14:30:00Z',
    remote: true
  },
  {
    id: '3',
    title: 'Data Scientist',
    company: 'DataLab',
    location: 'Valencia, España',
    type: 'full-time',
    salary: { min: 55000, max: 75000, currency: 'EUR' },
    description: 'Análisis de datos y machine learning para productos innovadores. Trabajarás con grandes conjuntos de datos para extraer insights valiosos.',
    requirements: ['Python', 'TensorFlow', 'SQL', 'Estadística'],
    skills: ['Python', 'TensorFlow', 'Pandas', 'SQL', 'Machine Learning', 'R'],
    postedDate: '2025-01-05T09:15:00Z',
    remote: false
  },
  {
    id: '4',
    title: 'Frontend Developer',
    company: 'StartupX',
    location: 'Sevilla, España',
    type: 'contract',
    salary: { min: 35000, max: 45000, currency: 'EUR' },
    description: 'Desarrollo de interfaces modernas con React para una startup en crecimiento. Oportunidad única de trabajar en un ambiente dinámico.',
    requirements: ['React', 'CSS', 'JavaScript'],
    skills: ['React', 'CSS', 'JavaScript', 'HTML', 'Sass'],
    postedDate: '2025-01-08T11:00:00Z',
    remote: true
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: 'CloudTech',
    location: 'Bilbao, España',
    type: 'full-time',
    salary: { min: 60000, max: 80000, currency: 'EUR' },
    description: 'Infraestructura en la nube y automatización. Buscamos alguien que sea apasionado de la automatización y las mejores prácticas DevOps.',
    requirements: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins'],
    postedDate: '2025-01-08T16:20:00Z',
    remote: false
  },
  {
    id: '6',
    title: 'Product Manager',
    company: 'InnovateCorp',
    location: 'Remoto',
    type: 'full-time',
    salary: { min: 65000, max: 85000, currency: 'EUR' },
    description: 'Gestión de producto para aplicaciones SaaS. Lidera el desarrollo de productos desde la concepción hasta el lanzamiento.',
    requirements: ['Product Management', 'Agile', 'Analytics', 'SQL'],
    skills: ['Product Management', 'Agile', 'Scrum', 'Analytics', 'SQL', 'Jira'],
    postedDate: '2025-01-04T13:45:00Z',
    remote: true
  },
  {
    id: '7',
    title: 'Backend Developer Java',
    company: 'Enterprise Solutions',
    location: 'Zaragoza, España',
    type: 'full-time',
    salary: { min: 45000, max: 60000, currency: 'EUR' },
    description: 'Desarrollo de aplicaciones empresariales con Java y Spring. Trabajarás en sistemas de alta concurrencia y disponibilidad.',
    requirements: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker'],
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'Maven', 'Git'],
    postedDate: '2025-01-03T08:30:00Z',
    remote: false
  },
  {
    id: '8',
    title: 'QA Automation Engineer',
    company: 'QualityFirst',
    location: 'Málaga, España',
    type: 'full-time',
    salary: { min: 38000, max: 50000, currency: 'EUR' },
    description: 'Automatización de pruebas para aplicaciones web y móviles. Asegura la calidad del software mediante testing automatizado.',
    requirements: ['Selenium', 'Cypress', 'JavaScript', 'Testing'],
    skills: ['Selenium', 'Cypress', 'JavaScript', 'Testing', 'Pytest', 'API Testing'],
    postedDate: '2025-01-02T15:20:00Z',
    remote: true
  }
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<JobSearchFilters>({
    query: '',
    location: '',
    type: '',
    remote: false,
    salaryMin: undefined,
    salaryMax: undefined
  });

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setJobs(mockJobs);
      setFilteredJobs(mockJobs);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Aplicar filtros
    let filtered = jobs;

    if (filters.query) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(filters.query.toLowerCase()) ||
        job.company.toLowerCase().includes(filters.query.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(filters.query.toLowerCase()))
      );
    }

    if (filters.location) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.type) {
      filtered = filtered.filter(job => job.type === filters.type);
    }

    if (filters.remote) {
      filtered = filtered.filter(job => job.remote);
    }

    if (filters.salaryMin) {
      filtered = filtered.filter(job => 
        job.salary && job.salary.min >= filters.salaryMin!
      );
    }

    if (filters.salaryMax) {
      filtered = filtered.filter(job => 
        job.salary && job.salary.max <= filters.salaryMax!
      );
    }

    setFilteredJobs(filtered);
  }, [filters, jobs]);

  const handleFilterChange = (key: keyof JobSearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      location: '',
      type: '',
      remote: false,
      salaryMin: undefined,
      salaryMax: undefined
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== false && value !== undefined
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Cargando trabajos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Buscar Trabajos
          </h1>
          <p className="text-gray-600">
            Encuentra tu próxima oportunidad profesional
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por título, empresa o habilidades..."
                  value={filters.query}
                  onChange={(e) => handleFilterChange('query', e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Ubicación"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="pl-10 md:w-48"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filtros
                {hasActiveFilters && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {Object.values(filters).filter(v => v !== '' && v !== false && v !== undefined).length}
                  </span>
                )}
              </Button>
            </div>

            {/* Filtros Expandidos */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Trabajo
                    </label>
                    <select
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Todos</option>
                      <option value="full-time">Tiempo completo</option>
                      <option value="part-time">Tiempo parcial</option>
                      <option value="contract">Contrato</option>
                      <option value="internship">Prácticas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salario Mínimo (€)
                    </label>
                    <Input
                      type="number"
                      placeholder="30000"
                      value={filters.salaryMin || ''}
                      onChange={(e) => handleFilterChange('salaryMin', e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salario Máximo (€)
                    </label>
                    <Input
                      type="number"
                      placeholder="80000"
                      value={filters.salaryMax || ''}
                      onChange={(e) => handleFilterChange('salaryMax', e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.remote}
                        onChange={(e) => handleFilterChange('remote', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Solo trabajos remotos</span>
                    </label>
                  </div>
                </div>

                {hasActiveFilters && (
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {filteredJobs.length} trabajos encontrados
                    </span>
                    <Button variant="ghost" onClick={clearFilters} className="text-sm">
                      <X className="h-4 w-4 mr-1" />
                      Limpiar filtros
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredJobs.length} Trabajos Encontrados
          </h2>
          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
            <option>Más recientes</option>
            <option>Mejor puntuados</option>
            <option>Salario más alto</option>
            <option>Salario más bajo</option>
          </select>
        </div>

        {/* Job Cards */}
        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 mr-3">
                        {job.title}
                      </h3>
                      {job.remote && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Remoto
                        </span>
                      )}
                    </div>
                    <p className="text-blue-600 font-medium text-lg mb-3">{job.company}</p>
                    <div className="flex items-center text-gray-600 text-sm space-x-6">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-1" />
                        {getJobTypeLabel(job.type)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatRelativeTime(job.postedDate)}
                      </div>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-yellow-500 transition-colors">
                    <Star className="h-6 w-6" />
                  </button>
                </div>

                <p className="text-gray-600 mb-4 leading-relaxed">{job.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-green-600 font-bold text-lg">
                    {job.salary && formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
                  </div>
                  <div className="flex space-x-3">
                    <Button variant="outline">
                      <BookmarkPlus className="h-4 w-4 mr-2" />
                      Guardar
                    </Button>
                    <Link href={`/jobs/${job.id}`}>
                      <Button>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalles
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredJobs.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron trabajos
                </h3>
                <p className="text-gray-600 mb-4">
                  Intenta ajustar tus filtros o términos de búsqueda
                </p>
                <Button onClick={clearFilters}>
                  Limpiar filtros
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {filteredJobs.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              <Button variant="outline" disabled>
                Anterior
              </Button>
              <Button className="bg-blue-600 text-white">1</Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
