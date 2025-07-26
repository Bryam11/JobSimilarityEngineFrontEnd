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
  Star,
  Share2,
  BookmarkPlus,
  Send,
  Building,
  Users,
  Calendar,
  DollarSign,
  CheckCircle
} from 'lucide-react';
import { Job } from '@/types';
import { formatRelativeTime, formatSalary, getJobTypeLabel } from '@/lib/utils';

// Mock data para el demo
const mockJobDetails: Record<string, Job> = {
  '1': {
    id: '1',
    title: 'Desarrollador Full Stack Senior',
    company: 'TechCorp',
    location: 'Madrid, España',
    type: 'full-time',
    salary: { min: 50000, max: 70000, currency: 'EUR' },
    description: 'Buscamos un desarrollador Full Stack con experiencia en React y Node.js para unirse a nuestro equipo dinámico. Trabajarás en proyectos emocionantes utilizando las últimas tecnologías y colaborarás con un equipo de desarrollo altamente talentoso.\n\nEn TechCorp, valoramos la innovación, el aprendizaje continuo y el crecimiento profesional. Ofrecemos un ambiente de trabajo flexible, oportunidades de desarrollo profesional y beneficios competitivos.',
    requirements: [
      '3+ años de experiencia en desarrollo Full Stack',
      'Dominio de React y Node.js',
      'Experiencia con TypeScript',
      'Conocimiento de bases de datos PostgreSQL',
      'Experiencia con AWS o servicios cloud similares',
      'Metodologías ágiles (Scrum/Kanban)',
      'Git y control de versiones',
      'Inglés conversacional'
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker', 'Git'],
    postedDate: '2025-01-07T10:00:00Z',
    deadline: '2025-02-07T23:59:59Z',
    remote: false,
    logo: '/company-logos/techcorp.png'
  },
  '2': {
    id: '2',
    title: 'Diseñador UX/UI',
    company: 'DesignStudio',
    location: 'Barcelona, España',
    type: 'full-time',
    salary: { min: 40000, max: 55000, currency: 'EUR' },
    description: 'Únete a nuestro equipo de diseño para crear experiencias increíbles que deleiten a nuestros usuarios. Buscamos alguien con pasión por el diseño centrado en el usuario y experiencia en metodologías de design thinking.\n\nEn DesignStudio, trabajamos con clientes de diversos sectores para crear productos digitales innovadores. Tendrás la oportunidad de trabajar en proyectos variados y desafiantes.',
    requirements: [
      '2+ años de experiencia en diseño UX/UI',
      'Dominio de Figma y Adobe Creative Suite',
      'Experiencia en prototipado interactivo',
      'Conocimiento de user research y testing',
      'Portfolio sólido con casos de estudio',
      'Conocimiento de principios de accesibilidad',
      'Experiencia con design systems',
      'Inglés intermedio'
    ],
    skills: ['Figma', 'Adobe XD', 'User Research', 'Prototipado', 'Sketch', 'Principle', 'InVision'],
    postedDate: '2025-01-06T14:30:00Z',
    deadline: '2025-02-06T23:59:59Z',
    remote: true,
    logo: '/company-logos/designstudio.png'
  }
};

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const loadJob = async () => {
      const jobId = params.id as string;
      
      // Simular carga de datos
      setTimeout(() => {
        const jobData = mockJobDetails[jobId];
        if (jobData) {
          setJob(jobData);
        }
        setLoading(false);
      }, 1000);
    };

    loadJob();
  }, [params.id]);

  const handleApply = async () => {
    setIsApplying(true);
    // Simular aplicación
    setTimeout(() => {
      setHasApplied(true);
      setIsApplying(false);
    }, 2000);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title,
        text: `Mira esta oportunidad laboral: ${job?.title} en ${job?.company}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Aquí podrías mostrar un toast de confirmación
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Trabajo no encontrado</h1>
          <p className="text-gray-600 mb-6">El trabajo que buscas no existe o ha sido eliminado.</p>
          <Link href="/jobs">
            <Button>Volver a la búsqueda</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>

        {/* Job Header */}
        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Building className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                    <p className="text-xl text-blue-600 font-semibold">{job.company}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{job.location}</span>
                    {job.remote && (
                      <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Remoto
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Briefcase className="h-5 w-5 mr-2" />
                    <span>{getJobTypeLabel(job.type)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>Publicado {formatRelativeTime(job.postedDate)}</span>
                  </div>
                  {job.deadline && (
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-5 w-5 mr-2" />
                      <span>Hasta {new Date(job.deadline).toLocaleDateString('es-ES')}</span>
                    </div>
                  )}
                </div>

                {job.salary && (
                  <div className="flex items-center text-green-600 text-2xl font-bold mb-6">
                    <DollarSign className="h-6 w-6 mr-2" />
                    {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
                  </div>
                )}
              </div>

              <div className="flex flex-col space-y-2 ml-6">
                <Button onClick={handleShare} variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartir
                </Button>
                <Button 
                  onClick={handleSave} 
                  variant="outline" 
                  size="sm"
                  className={isSaved ? 'bg-yellow-50 border-yellow-300 text-yellow-700' : ''}
                >
                  <Star className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                  {isSaved ? 'Guardado' : 'Guardar'}
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              {hasApplied ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">Ya has aplicado a este trabajo</span>
                </div>
              ) : (
                <Button 
                  onClick={handleApply} 
                  disabled={isApplying}
                  size="lg"
                  className="px-8"
                >
                  {isApplying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Aplicando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Aplicar Ahora
                    </>
                  )}
                </Button>
              )}
              <Button variant="outline" size="lg">
                <BookmarkPlus className="h-4 w-4 mr-2" />
                Aplicación Rápida
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Job Description */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-900">Descripción del Trabajo</h2>
              </CardHeader>
              <CardContent>
                <div className="prose prose-blue max-w-none">
                  {job.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-600 mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-900">Requisitos</h2>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-900">Habilidades Requeridas</h2>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-bold text-gray-900">Sobre {job.company}</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Tamaño de la empresa</p>
                      <p className="font-medium">50-200 empleados</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Industria</p>
                      <p className="font-medium">Tecnología</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Sede principal</p>
                      <p className="font-medium">Madrid, España</p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Ver más trabajos de {job.company}
                </Button>
              </CardContent>
            </Card>

            {/* Similar Jobs */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-bold text-gray-900">Trabajos Similares</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: '2', title: 'Frontend Developer', company: 'StartupX', location: 'Sevilla' },
                    { id: '3', title: 'Backend Developer', company: 'DevCorp', location: 'Valencia' },
                    { id: '4', title: 'Full Stack Developer', company: 'WebTech', location: 'Barcelona' }
                  ].map((similarJob) => (
                    <div key={similarJob.id} className="border-b border-gray-100 last:border-b-0 pb-3 last:pb-0">
                      <Link href={`/jobs/${similarJob.id}`}>
                        <h4 className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                          {similarJob.title}
                        </h4>
                      </Link>
                      <p className="text-blue-600 text-sm">{similarJob.company}</p>
                      <p className="text-gray-500 text-sm">{similarJob.location}</p>
                    </div>
                  ))}
                </div>
                <Link href="/jobs">
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    Ver más trabajos
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Application Tips */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-bold text-gray-900">Consejos para tu Aplicación</h3>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    Personaliza tu CV para este trabajo
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    Incluye una carta de presentación
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    Destaca tus habilidades relevantes
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    Aplica lo antes posible
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
