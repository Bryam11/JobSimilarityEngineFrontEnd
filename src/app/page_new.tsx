'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import {
  Search,
  Target,
  Users,
  TrendingUp,
  Briefcase,
  Star,
  MapPin,
  Clock
} from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  if (user) {
    // Si el usuario está logueado, redirigir al dashboard
    window.location.href = '/dashboard';
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Encuentra el <span className="text-blue-200">trabajo perfecto</span> para ti
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Nuestra plataforma de inteligencia artificial te conecta con oportunidades laborales
              que coinciden perfectamente con tu perfil y habilidades.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                  Comenzar Gratis
                </Button>
              </Link>
              <Link href="/jobs">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4"
                >
                  Explorar Trabajos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir JobMatch?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Utilizamos tecnología avanzada para hacer que tu búsqueda de empleo sea más eficiente y exitosa.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Recomendaciones Inteligentes
                </h3>
                <p className="text-gray-600">
                  Nuestro algoritmo de IA analiza tu perfil y encuentra trabajos que realmente se ajustan a tus habilidades y experiencia.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Búsqueda Avanzada
                </h3>
                <p className="text-gray-600">
                  Filtra por ubicación, salario, tipo de trabajo y más. Encuentra exactamente lo que buscas en segundos.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Red Profesional
                </h3>
                <p className="text-gray-600">
                  Conecta con profesionales de tu área y expande tu red de contactos para futuras oportunidades.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Trabajos Disponibles</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-gray-600">Tasa de Satisfacción</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-600">Empresas Asociadas</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">Soporte Disponible</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Jobs Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Oportunidades Destacadas
            </h2>
            <p className="text-xl text-gray-600">
              Descubre algunas de las mejores oportunidades disponibles
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Desarrollador Full Stack",
                company: "TechCorp",
                location: "Madrid, España",
                type: "Tiempo completo",
                salary: "€45,000 - €65,000",
                posted: "Hace 2 días"
              },
              {
                title: "Diseñador UX/UI",
                company: "CreativeStudio",
                location: "Barcelona, España",
                type: "Remoto",
                salary: "€40,000 - €55,000",
                posted: "Hace 1 día"
              },
              {
                title: "Data Scientist",
                company: "DataLab",
                location: "Valencia, España",
                type: "Híbrido",
                salary: "€50,000 - €70,000",
                posted: "Hace 3 días"
              }
            ].map((job, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">{job.title}</h3>
                      <p className="text-blue-600 font-medium">{job.company}</p>
                    </div>
                    <Star className="h-5 w-5 text-gray-300" />
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="h-4 w-4 mr-2" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Briefcase className="h-4 w-4 mr-2" />
                      {job.type}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Clock className="h-4 w-4 mr-2" />
                      {job.posted}
                    </div>
                  </div>

                  <div className="text-green-600 font-semibold mb-4">{job.salary}</div>

                  <Button className="w-full" variant="outline">
                    Ver Detalles
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/jobs">
              <Button size="lg">
                Ver Todos los Trabajos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para encontrar tu próximo trabajo?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Únete a miles de profesionales que ya han encontrado su trabajo ideal con JobMatch.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Crear Cuenta Gratis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Briefcase className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">JobMatch</span>
              </div>
              <p className="text-gray-400">
                La plataforma de recomendación de trabajos más avanzada del mercado.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Plataforma</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/jobs" className="hover:text-white">Buscar Trabajos</Link></li>
                <li><Link href="/companies" className="hover:text-white">Empresas</Link></li>
                <li><Link href="/salary" className="hover:text-white">Salarios</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">Centro de Ayuda</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contacto</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/terms" className="hover:text-white">Términos de Servicio</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Política de Privacidad</Link></li>
                <li><Link href="/cookies" className="hover:text-white">Cookies</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 JobMatch. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
