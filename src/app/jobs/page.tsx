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
  SlidersHorizontal,
  BookmarkPlus,
  Eye,
  X,
  Sparkles,
  Target,
  Layers
} from 'lucide-react';
import { Job, JobSearchFilters, SearchMethods } from '@/types';
import { formatRelativeTime, formatSalary, getJobTypeLabel } from '@/lib/utils';
import { jobService } from '@/lib/services';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchMethods, setSearchMethods] = useState<SearchMethods | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'title_only' | 'combined' | 'hybrid'>('hybrid');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [filters, setFilters] = useState<JobSearchFilters>({
    query: '',
    location: '',
    type: '',
    remote: false,
    salaryMin: undefined,
    salaryMax: undefined
  });

  // Cargar métodos de búsqueda al montar el componente
  useEffect(() => {
    const loadSearchMethods = async () => {
      try {
        const methods = await jobService.getSearchMethods();
        setSearchMethods(methods);
        setSelectedMethod(methods.recommended as 'title_only' | 'combined' | 'hybrid');
      } catch (error) {
        console.error('Error loading search methods:', error);
      }
    };

    loadSearchMethods();
  }, []);

  // Cargar trabajos iniciales
  useEffect(() => {
    const loadInitialJobs = async () => {
      try {
        setLoading(true);
        const jobsList = await jobService.getAllJobs(0, 50);
        setJobs(jobsList.jobs);
        setTotalJobs(jobsList.total);
      } catch (error) {
        console.error('Error loading jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialJobs();
  }, []);

  // Función para buscar trabajos
  const handleSearch = async () => {
    if (!filters.query.trim()) {
      // Si no hay query, cargar trabajos generales
      const jobsList = await jobService.getAllJobs(currentPage * 50, 50);
      setJobs(jobsList.jobs);
      setTotalJobs(jobsList.total);
      return;
    }

    try {
      setSearching(true);
      const recommendations = await jobService.searchJobsWithAI({
        query: filters.query,
        top_n: 20,
        method: selectedMethod
      });

      setJobs(recommendations.recommendations);
      setTotalJobs(recommendations.total_results);
    } catch (error) {
      console.error('Error searching jobs:', error);
    } finally {
      setSearching(false);
    }
  };

  // Manejar cambio en los filtros
  const handleFilterChange = (field: keyof JobSearchFilters, value: string | boolean | number | undefined) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Limpiar filtros
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

  // Cargar más trabajos (paginación)
  const loadMoreJobs = async () => {
    try {
      setLoading(true);
      const nextPage = currentPage + 1;
      const jobsList = await jobService.getAllJobs(nextPage * 50, 50);
      setJobs(prev => [...prev, ...jobsList.jobs]);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error('Error loading more jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Obtener icono para el método de búsqueda
  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'title_only':
        return <Target className="h-4 w-4" />;
      case 'combined':
        return <Layers className="h-4 w-4" />;
      case 'hybrid':
        return <Sparkles className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const hasActiveFilters = Object.values(filters).some(value =>
    value !== '' && value !== false && value !== undefined
  );

  if (loading && jobs.length === 0) {
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
            Encuentra tu próxima oportunidad profesional con IA
          </p>
        </div>

        {/* Search Methods Selector */}
        {searchMethods && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="text-sm font-medium text-gray-700">
                  Método de búsqueda:
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(searchMethods.methods).map(([key, method]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedMethod(key as 'title_only' | 'combined' | 'hybrid')}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${selectedMethod === key
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {getMethodIcon(key)}
                      {method.name}
                    </button>
                  ))}
                </div>
              </div>
              {searchMethods.methods[selectedMethod] && (
                <div className="mt-3 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>{searchMethods.methods[selectedMethod].description}</strong>
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {searchMethods.methods[selectedMethod].use_case}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

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
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Ubicación"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSearch}
                  disabled={searching}
                  className="px-6"
                >
                  {searching ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Buscando...
                    </>
                  ) : (
                    'Buscar'
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de trabajo
                    </label>
                    <select
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Todos</option>
                      <option value="full-time">Tiempo completo</option>
                      <option value="part-time">Tiempo parcial</option>
                      <option value="contract">Contrato</option>
                      <option value="internship">Prácticas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trabajo remoto
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.remote}
                        onChange={(e) => handleFilterChange('remote', e.target.checked)}
                        className="mr-2"
                      />
                      Solo trabajos remotos
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Salario mínimo (€)
                    </label>
                    <Input
                      type="number"
                      value={filters.salaryMin || ''}
                      onChange={(e) => handleFilterChange('salaryMin', e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder="30000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Salario máximo (€)
                    </label>
                    <Input
                      type="number"
                      value={filters.salaryMax || ''}
                      onChange={(e) => handleFilterChange('salaryMax', e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder="80000"
                    />
                  </div>
                </div>

                {hasActiveFilters && (
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-sm text-gray-600">Filtros activos:</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                    >
                      <X className="h-3 w-3 mr-1" />
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
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-gray-900">
              {jobs.length > 0 ? `${jobs.length} trabajos encontrados` : 'No hay trabajos disponibles'}
            </h2>
            {filters.query && (
              <span className="text-sm text-gray-500">
                para &quot;{filters.query}&quot; usando método {searchMethods?.methods[selectedMethod]?.name}
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            Total disponibles: {totalJobs.toLocaleString()}
          </div>
        </div>

        {/* Job Cards */}
        <div className="space-y-6">
          {jobs.map((job: Job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 mr-3">
                        {job.title}
                      </h3>
                      {job.rank && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          #{job.rank}
                        </span>
                      )}
                      {job.remote && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full ml-2">
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
                      {job.type && (
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-1" />
                          {getJobTypeLabel(job.type)}
                        </div>
                      )}
                      {job.postedDate && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatRelativeTime(job.postedDate)}
                        </div>
                      )}
                      {job.similarity_score && (
                        <div className="flex items-center">
                          <Sparkles className="h-4 w-4 mr-1" />
                          {Math.round(job.similarity_score * 100)}% relevancia
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-yellow-500 transition-colors">
                    <Star className="h-6 w-6" />
                  </button>
                </div>

                <p className="text-gray-600 mb-4 leading-relaxed">{job.description}</p>

                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.slice(0, 6).map((skill: string, index: number) => (
                      <span key={index} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 6 && (
                      <span className="text-gray-500 text-sm">+{job.skills.length - 6} más</span>
                    )}
                  </div>
                )}

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

          {jobs.length === 0 && !loading && (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron trabajos
                </h3>
                <p className="text-gray-600 mb-4">
                  {filters.query
                    ? 'Intenta con otros términos de búsqueda o cambia el método de búsqueda'
                    : 'No hay trabajos disponibles en este momento'
                  }
                </p>
                {filters.query && (
                  <Button onClick={clearFilters}>
                    Limpiar búsqueda
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Load More */}
        {jobs.length > 0 && jobs.length < totalJobs && !filters.query && (
          <div className="mt-8 flex justify-center">
            <Button
              onClick={loadMoreJobs}
              disabled={loading}
              variant="outline"
              className="px-8"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Cargando...
                </>
              ) : (
                'Cargar más trabajos'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
