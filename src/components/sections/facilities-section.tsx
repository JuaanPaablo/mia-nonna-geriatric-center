'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Home, 
  Utensils, 
  Activity, 
  Flower2, 
  Shield, 
  Wifi,
  Car,
  Users,
  Stethoscope,
  Bath,
  Bed,
  TreePine
} from 'lucide-react'

const facilities = [
  {
    id: 1,
    title: 'Habitaciones Privadas',
    description: 'Espacios cómodos y adaptados con baño privado, mobiliario ergonómico y sistema de llamada de emergencia.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Alojamiento',
    features: ['Baño privado', 'Mobiliario adaptado', 'Llamada de emergencia', 'Aire acondicionado']
  },
  {
    id: 2,
    title: 'Comedor Principal',
    description: 'Ambiente acogedor para las comidas con capacidad para todos los residentes y menús adaptados.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Alimentación',
    features: ['Ambiente familiar', 'Menús adaptados', 'Ayuda personalizada', 'Horarios flexibles']
  },
  {
    id: 3,
    title: 'Sala de Fisioterapia',
    description: 'Equipamiento especializado para rehabilitación física y mantenimiento de la movilidad.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Salud',
    features: ['Equipos modernos', 'Fisioterapeuta especializado', 'Tratamientos individuales', 'Seguimiento personalizado']
  },
  {
    id: 4,
    title: 'Jardín Terapéutico',
    description: 'Espacio verde seguro para actividades al aire libre y terapia con la naturaleza.',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Exterior',
    features: ['Senderos accesibles', 'Zonas de descanso', 'Plantas terapéuticas', 'Actividades grupales']
  },
  {
    id: 5,
    title: 'Sala de Actividades',
    description: 'Espacio multiusos para talleres, actividades sociales y entretenimiento adaptado.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Social',
    features: ['Talleres diarios', 'Entretenimiento', 'Socialización', 'Estimulación cognitiva']
  },
  {
    id: 6,
    title: 'Enfermería',
    description: 'Centro médico equipado para atención sanitaria inmediata y seguimiento de tratamientos.',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Salud',
    features: ['Atención 24h', 'Equipos médicos', 'Farmacia', 'Consultas médicas']
  }
]

const amenities = [
  {
    icon: Wifi,
    title: 'WiFi gratuito',
    description: 'Conexión a internet en todas las áreas'
  },
  {
    icon: Users,
    title: 'Sala de visitas',
    description: 'Espacios privados para familias'
  },
  {
    icon: TreePine,
    title: 'Zona verde',
    description: 'Amplios jardines y terrazas'
  }
]

const categoryColors = {
  'Alojamiento': 'bg-blue-100 text-blue-800',
  'Alimentación': 'bg-green-100 text-green-800',
  'Salud': 'bg-red-100 text-red-800',
  'Exterior': 'bg-yellow-100 text-yellow-800',
  'Social': 'bg-purple-100 text-purple-800'
}

export function FacilitiesSection() {
  const [selectedFacility, setSelectedFacility] = useState(facilities[0])
  const [selectedCategory, setSelectedCategory] = useState('Todos')

  const categories = ['Todos', ...Array.from(new Set(facilities.map(f => f.category)))]
  
  const filteredFacilities = selectedCategory === 'Todos' 
    ? facilities 
    : facilities.filter(f => f.category === selectedCategory)

  return (
    <section id="instalaciones" className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-secondary/20 bg-secondary/10 text-secondary text-sm font-medium mb-4">
            Nuestras Instalaciones
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Un hogar adaptado y confortable
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Nuestras instalaciones están diseñadas para proporcionar comodidad, seguridad y bienestar, 
            creando un ambiente familiar donde cada residente se sienta como en casa.
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Main facility showcase */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={selectedFacility.image}
                alt={selectedFacility.title}
                width={600}
                height={450}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="absolute top-4 left-4">
              <Badge className={categoryColors[selectedFacility.category as keyof typeof categoryColors]}>
                {selectedFacility.category}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                {selectedFacility.title}
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                {selectedFacility.description}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Características destacadas:</h4>
              <div className="grid grid-cols-2 gap-3">
                {selectedFacility.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="healthcare" className="w-fit">
              <Home className="h-4 w-4 mr-2" />
              Solicitar visita
            </Button>
          </div>
        </div>

        {/* Facilities grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredFacilities.map((facility) => (
            <Card 
              key={facility.id} 
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedFacility.id === facility.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedFacility(facility)}
            >
              <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
                <Image
                  src={facility.image}
                  alt={facility.title}
                  width={400}
                  height={300}
                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-2 right-2">
                  <Badge className={categoryColors[facility.category as keyof typeof categoryColors]}>
                    {facility.category}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2">{facility.title}</h4>
                <p className="text-sm text-gray-600 line-clamp-2">{facility.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Amenities */}
        <div className="bg-white rounded-2xl p-8 lg:p-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Servicios y Comodidades
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {amenities.map((amenity, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                  <amenity.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {amenity.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {amenity.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
