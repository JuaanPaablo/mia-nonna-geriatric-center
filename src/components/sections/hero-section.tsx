'use client'

import { Button } from '@/components/ui/button'
import { Heart, Shield, Users, Clock } from 'lucide-react'

const features = [
  {
    icon: Clock,
    title: 'Atención 24/7',
    description: 'Cuidado profesional las 24 horas del día'
  },
  {
    icon: Heart,
    title: 'Cuidado Especializado',
    description: 'Personal médico y de enfermería especializado'
  },
  {
    icon: Shield,
    title: 'Ambiente Seguro',
    description: 'Instalaciones adaptadas y seguras para nuestros residentes'
  },
  {
    icon: Users,
    title: 'Atención Personalizada',
    description: 'Planes de cuidado individualizados'
  }
]

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-gray-900/[0.04] bg-[size:40px_40px]" />
      
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-medium">
                ✨ Centro geriátrico de confianza desde 2010
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Cuidado con{' '}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  corazón
                </span>{' '}
                para tus seres queridos
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                En Mia Nonna ofrecemos un ambiente familiar y profesional donde cada residente 
                recibe el cuidado personalizado que merece, con la tranquilidad que tu familia necesita.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="healthcare" className="text-base px-8 py-4">
                <a href="#contacto" className="flex items-center gap-2">
                  Solicitar Información
                  <Heart className="h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 py-4">
                <a href="#servicios">
                  Conocer Servicios
                </a>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Familias atendidas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">15+</div>
                <div className="text-sm text-gray-600">Años de experiencia</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">Atención médica</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Cuidado profesional en centro geriátrico"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Heart className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      98% de satisfacción
                    </div>
                    <div className="text-sm text-gray-600">
                      de las familias
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute top-8 right-8 w-20 h-20 bg-secondary/20 rounded-full blur-2xl" />
            <div className="absolute bottom-8 left-8 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
          </div>
        </div>

        {/* Features grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center group"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full flex items-center justify-center group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Wave separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="w-full h-12 fill-white"
        >
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            opacity=".25"
          />
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            opacity=".5"
          />
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
          />
        </svg>
      </div>
    </section>
  )
}
