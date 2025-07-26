'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingPage, LoadingSpinner } from '@/components/ui/Loading';
import {
  User,
  MapPin,
  Briefcase,
  Calendar,
  Plus,
  X,
  Save,
  Edit,
  Building,
  GraduationCap
} from 'lucide-react';
import { generateInitials } from '@/lib/utils';

export default function ProfilePage() {
  const { user, updateProfile, loading } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.fullName || '',
    title: user?.professionalTitle || '',
    company: user?.company || '',
    location: user?.location || '',
    bio: user?.bio || '',
    skills: user?.skills || [],
  });
  const [newSkill, setNewSkill] = useState('');

  if (loading) {
    return <LoadingPage />;
  }

  if (!user) {
    window.location.href = '/login';
    return null;
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(formData);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.fullName || '',
      title: user.professionalTitle || '',
      company: user.company || '',
      location: user.location || '',
      bio: user.bio || '',
      skills: user.skills || [],
    });
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
          <p className="text-gray-600">Gestiona tu información profesional</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.fullName}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    generateInitials(user.fullName)
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">{user.fullName}</h2>
                {user.professionalTitle && (
                  <p className="text-blue-600 font-medium mb-2">{user.professionalTitle}</p>
                )}
                {user.company && (
                  <p className="text-gray-600 mb-2">{user.company}</p>
                )}
                {user.location && (
                  <p className="text-gray-500 text-sm flex items-center justify-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {user.location}
                  </p>
                )}

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">12</div>
                      <div className="text-sm text-gray-600">Aplicaciones</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">45</div>
                      <div className="text-sm text-gray-600">Vistas</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <h3 className="font-semibold text-gray-900">Acciones Rápidas</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Ver mis aplicaciones
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Trabajos guardados
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <User className="h-4 w-4 mr-2" />
                    Configuración
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
                {!editing ? (
                  <Button variant="outline" onClick={() => setEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleCancel}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                      {saving ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Guardar
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Input
                      label="Nombre completo"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!editing}
                    />
                  </div>
                  <div>
                    <Input
                      label="Email"
                      value={user.email}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <Input
                      label="Título profesional"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      disabled={!editing}
                      placeholder="Ej: Desarrollador Full Stack"
                    />
                  </div>
                  <div>
                    <Input
                      label="Empresa"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      disabled={!editing}
                      placeholder="Ej: TechCorp"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      label="Ubicación"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      disabled={!editing}
                      placeholder="Ej: Madrid, España"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Biografía
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      disabled={!editing}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                      placeholder="Cuéntanos sobre ti, tu experiencia y tus objetivos profesionales..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Habilidades</h3>
                {editing && (
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Nueva habilidad"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      className="w-40"
                    />
                    <Button onClick={addSkill} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                    >
                      {skill}
                      {editing && (
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </span>
                  ))}
                  {formData.skills.length === 0 && (
                    <p className="text-gray-500 text-sm">
                      {editing ? 'Añade tus habilidades profesionales' : 'No hay habilidades añadidas'}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Experiencia Laboral</h3>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Añadir
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Ejemplo de experiencia */}
                  <div className="border-l-2 border-blue-200 pl-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">Desarrollador Full Stack</h4>
                        <p className="text-blue-600 font-medium">TechCorp</p>
                        <p className="text-gray-600 text-sm">Madrid, España</p>
                        <p className="text-gray-500 text-sm">Enero 2022 - Presente</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-gray-600 mt-2 text-sm">
                      Desarrollo de aplicaciones web usando React y Node.js. Colaboración en equipos ágiles
                      para entregar funcionalidades de alta calidad.
                    </p>
                  </div>

                  <div className="text-center py-8 text-gray-500">
                    <Building className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Añade tu experiencia laboral para mostrar tu trayectoria profesional</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Educación</h3>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Añadir
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <GraduationCap className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>Añade tu formación académica para completar tu perfil</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
