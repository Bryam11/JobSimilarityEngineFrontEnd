'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingPage } from '@/components/ui/Loading';
import { 
  ArrowLeft,
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign,
  Star,
  BookmarkPlus,
  Share2,
  Users,
  TrendingUp,
  Award,
  CheckCircle,
  Building
} from 'lucide-react';
import { Job } from '@/types';
import { formatRelativeTime, formatSalary, getJobTypeLabel } from '@/lib/utils';
import { jobService } from '@/lib/services';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const loadJob = async () => {
      if (!params.id) return;
      
      try {
        setLoading(true);
        const jobData = await jobService.getJobById(params.id as string);
        setJob(jobData);
      } catch (error) {
        console.error('Error loading job:', error);
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [params.id]);

  const handleApply = async () => {
    if (!job) return;
    
    try {
      setApplying(true);
      await jobService.applyToJob(job.id);
      setApplied(true);
    } catch (error) {
      console.error('Error applying to job:', error);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Trabajo no encontrado</h1>
          <p className="text-gray-600 mb-4">El trabajo que buscas no existe o ya no está disponible.</p>
          <Link href="/jobs">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a trabajos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <Card className="mb-6">
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl font-bold mr-4">
                        {job.company.charAt(0)}
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                        <p className="text-xl text-blue-600 font-medium">{job.company}</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="h-5 w-5 mr-2" />
                        <span>{job.type ? getJobTypeLabel(job.type) : 'No especificado'}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-2" />
                        <span>{job.postedDate ? `Publicado ${formatRelativeTime(job.postedDate)}` : 'Fecha no disponible'}</span>
                      </div>
                      {job.salary && (
                        <div className="flex items-center">
                          <DollarSign className="h-5 w-5 mr-2" />
                          <span className="font-medium">
                            {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
                          </span>
                        </div>
                      )}
                      {job.similarity_score && (
                        <div className="flex items-center">
                          <TrendingUp className="h-5 w-5 mr-2" />
                          <span>{Math.round(job.similarity_score * 100)}% relevancia</span>
                        </div>
                      )}
                      {job.rank && (
                        <div className="flex items-center">
                          <Award className="h-5 w-5 mr-2" />
                          <span>Ranking #{job.rank}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-6">
                    <Button variant="outline" size="sm">
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <BookmarkPlus className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Apply Button */}
                <div className="border-t pt-6">
                  <Button
                    onClick={handleApply}
                    disabled={applying || applied}
                    className="w-full md:w-auto px-8 py-3 text-lg"
                  >
                    {applying ? (
                      'Aplicando...'
                    ) : applied ? (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Aplicación enviada
                      </>
                    ) : (
                      'Aplicar a este trabajo'
                    )}
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">
                    Tu perfil será enviado directamente a {job.company}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card className="mb-6">
              <CardHeader>
                <h2 className="text-2xl font-bold text-gray-900">Descripción del trabajo</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                  {job.description}
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <h3 className="text-xl font-bold text-gray-900">Requisitos</h3>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {job.requirements.map((requirement: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-bold text-gray-900">Habilidades requeridas</h3>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill: string, index: number) => (
                      <span 
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Quick Apply */}
            <Card className="mb-6 sticky top-6">
              <CardHeader>
                <h3 className="font-bold text-gray-900">Aplicación rápida</h3>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleApply}
                  disabled={applying || applied}
                  className="w-full mb-4"
                >
                  {applying ? (
                    'Aplicando...'
                  ) : applied ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Aplicado
                    </>
                  ) : (
                    'Aplicar ahora'
                  )}
                </Button>
                
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span>25+ aplicaciones</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Aplicación rápida</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <span>Alta demanda</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardHeader>
                <h3 className="font-bold text-gray-900">Acerca de {job.company}</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{job.company}</p>
                      <p className="text-sm text-gray-600">Empresa tecnológica</p>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p>
                      Una empresa líder en su sector, comprometida con la innovación 
                      y el desarrollo profesional de sus empleados.
                    </p>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Ver más empleos de {job.company}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
