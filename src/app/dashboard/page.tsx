'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingPage } from '@/components/ui/Loading';
import { 
  Search, 
  Briefcase, 
  TrendingUp, 
  MapPin, 
  Clock, 
  Star,
  BookmarkPlus,
  Eye
} from 'lucide-react';
import { Job } from '@/types';
import { jobService } from '@/lib/services';
import { formatRelativeTime, formatSalary, getJobTypeLabel } from '@/lib/utils';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      if (!user) return;
      
      try {
        setJobsLoading(true);
        
        // Cargar trabajos recomendados basados en el perfil del usuario
        const recommendedQuery = user.professionalTitle || 'desarrollador';
        const recommended = await jobService.getRecommendedJobs(recommendedQuery);
        setRecommendedJobs(recommended.slice(0, 3));
        
        // Cargar trabajos recientes
        const allJobs = await jobService.getAllJobs(0, 20);
        setRecentJobs(allJobs.jobs.slice(0, 5));
        
      } catch (error) {
        console.error('Error loading jobs:', error);
      } finally {
        setJobsLoading(false);
      }
    };

    loadJobs();
  }, [user]);

  if (loading) {
    return <LoadingPage />;
  }

  if (!user) {
    window.location.href = '/login';
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Hola, {user.fullName}! 👋
          </h1>
          <p className="text-gray-600">
            {user.professionalTitle ? `${user.professionalTitle}${user.company ? ` en ${user.company}` : ''}` : 'Encuentra tu próximo trabajo ideal'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Buscar Trabajos</h3>
                  <p className="text-sm text-gray-600">Encuentra oportunidades</p>
                </div>
              </div>
              <Link href="/jobs" className="mt-4 block">
                <Button className="w-full">Buscar Ahora</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <Briefcase className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Mi Perfil</h3>
                  <p className="text-sm text-gray-600">Actualizar información</p>
                </div>
              </div>
              <Link href="/profile" className="mt-4 block">
                <Button variant="outline" className="w-full border-green-300 text-green-700 hover:bg-green-50">
                  Ver Perfil
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Estadísticas</h3>
                  <p className="text-sm text-gray-600">Tu progreso</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Aplicaciones:</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Vistas perfil:</span>
                  <span className="font-medium">45</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recommended Jobs */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Trabajos Recomendados</h2>
              <Link href="/jobs?recommended=true">
                <Button variant="outline" size="sm">Ver Todos</Button>
              </Link>
            </div>

            {jobsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recommendedJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 mr-2">
                              {job.title}
                            </h3>
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              Recomendado
                            </span>
                          </div>
                          <p className="text-blue-600 font-medium mb-2">{job.company}</p>
                          <div className="flex items-center text-gray-600 text-sm space-x-4">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.location}
                            </div>
                            <div className="flex items-center">
                              <Briefcase className="h-4 w-4 mr-1" />
                              {job.type ? getJobTypeLabel(job.type) : 'No especificado'}
                            </div>
                            {job.postedDate && (
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {formatRelativeTime(job.postedDate)}
                              </div>
                            )}
                          </div>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-yellow-500">
                          <Star className="h-5 w-5" />
                        </button>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills && job.skills.slice(0, 4).map((skill, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                        {job.skills && job.skills.length > 4 && (
                          <span className="text-gray-500 text-xs">+{job.skills.length - 4} más</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-green-600 font-semibold">
                          {job.salary && formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <BookmarkPlus className="h-4 w-4 mr-1" />
                            Guardar
                          </Button>
                          <Link href={`/jobs/${job.id}`}>
                            <Button size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Ver Detalles
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Recent Jobs */}
            <Card className="mb-6">
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Trabajos Recientes</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentJobs.map((job) => (
                    <div key={job.id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                      <h4 className="font-medium text-gray-900 text-sm mb-1">{job.title}</h4>
                      <p className="text-blue-600 text-xs mb-2">{job.company}</p>
                      <div className="flex items-center text-gray-500 text-xs">
                        <MapPin className="h-3 w-3 mr-1" />
                        {job.location}
                      </div>
                      <div className="text-green-600 text-xs font-medium mt-1">
                        {job.salary && formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/jobs" className="block mt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    Ver Más Trabajos
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Profile Completion */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Completa tu Perfil</h3>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progreso</span>
                    <span className="font-medium">70%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Información básica
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Experiencia laboral
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                    Habilidades
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                    Educación
                  </li>
                </ul>
                <Link href="/profile">
                  <Button size="sm" className="w-full">
                    Completar Perfil
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
