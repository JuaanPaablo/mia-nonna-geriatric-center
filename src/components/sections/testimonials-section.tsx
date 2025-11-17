'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Star, 
  Quote, 
  ChevronLeft, 
  ChevronRight,
  Heart,
  Users,
  Calendar,
  MapPin
} from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'María González',
    relation: 'Hija de residente',
    residentName: 'Carmen González',
    stayDuration: '2 años',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    content: 'El cuidado que recibe mi madre en Mia Nonna es excepcional. El personal es muy atento y profesional. Mi madre está feliz y nosotros estamos tranquilos sabiendo que está en las mejores manos. Las instalaciones son excelentes y el trato es muy familiar.',
    highlight: 'Personal muy atento y profesional',
    date: 'Marzo 2024',
    verified: true
  },
  {
    id: 2,
    name: 'Carlos Ruiz',
    relation: 'Hijo de residente',
    residentName: 'Antonio Ruiz',
    stayDuration: '1 año',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    content: 'Estamos muy tranquilos sabiendo que papá está en buenas manos. Las instalaciones son excelentes y el equipo médico es de primer nivel. Han mejorado mucho su calidad de vida y nosotros podemos visitarlo cuando queramos. Lo recomiendo sin dudas.',
    highlight: 'Equipo médico de primer nivel',
    date: 'Febrero 2024',
    verified: true
  },
  {
    id: 3,
    name: 'Ana Martínez',
    relation: 'Familiar',
    residentName: 'Rosa Martínez',
    stayDuration: '6 meses',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    content: 'La atención personalizada y el ambiente familiar hacen que mi abuela se sienta como en casa. Las actividades diarias la mantienen activa y feliz. El personal de enfermería es muy profesional y cariñoso. Estamos muy contentos con la decisión.',
    highlight: 'Ambiente familiar y actividades diarias',
    date: 'Enero 2024',
    verified: true
  },
  {
    id: 4,
    name: 'Luis Fernández',
    relation: 'Esposo de residente',
    residentName: 'Pilar Fernández',
    stayDuration: '3 años',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    content: 'Después de 3 años en Mia Nonna puedo decir que fue la mejor decisión. Mi esposa recibe el cuidado especializado que necesita para su diabetes y problemas de movilidad. El personal la conoce bien y siempre está pendiente de sus necesidades.',
    highlight: 'Cuidado especializado y personalizado',
    date: 'Diciembre 2023',
    verified: true
  },
  {
    id: 5,
    name: 'Isabel Moreno',
    relation: 'Hija de residente',
    residentName: 'Francisco Moreno',
    stayDuration: '8 meses',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    content: 'Mi padre tiene Alzheimer y necesitaba cuidados especializados. En Mia Nonna no solo recibe el tratamiento médico adecuado, sino que también participa en actividades que estimulan su memoria. Hemos visto una gran mejoría en su estado de ánimo.',
    highlight: 'Cuidados especializados en Alzheimer',
    date: 'Noviembre 2023',
    verified: true
  },
  {
    id: 6,
    name: 'Roberto Silva',
    relation: 'Hijo de residente',
    residentName: 'Mercedes Silva',
    stayDuration: '1.5 años',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    content: 'La fisioterapia y las actividades de estimulación cognitiva han ayudado mucho a mi madre. El equipo multidisciplinar trabaja de forma coordinada y siempre nos mantienen informados sobre su evolución. Es como tener una familia extendida cuidando de ella.',
    highlight: 'Equipo multidisciplinar coordinado',
    date: 'Octubre 2023',
    verified: true
  }
]

export function TestimonialsSection() {
  // Oculto temporalmente hasta tener las imágenes de los testimonios
  return null

  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('Todos')

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <section id="testimonios" className="py-16 lg:py-24 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-medium mb-4">
            Testimonios
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Lo que dicen las familias
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Nada nos llena más de orgullo que los testimonios de las familias que han confiado en nosotros 
            para el cuidado de sus seres queridos.
          </p>
        </div>

        {/* Featured testimonial */}
        <div className="relative mb-16">
          <Card className="max-w-4xl mx-auto shadow-xl border-0">
            <CardContent className="p-8 lg:p-12">
              <div className="grid lg:grid-cols-3 gap-8 items-center">
                {/* Image */}
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-lg">
                      <Image
                        src={testimonials[currentTestimonial].image}
                        alt={testimonials[currentTestimonial].name}
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    {testimonials[currentTestimonial].verified && (
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <Heart className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900">
                      {testimonials[currentTestimonial].name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {testimonials[currentTestimonial].relation}
                    </p>
                    <div className="flex justify-center mt-2">
                      {renderStars(testimonials[currentTestimonial].rating)}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-2 space-y-4">
                  <Quote className="h-8 w-8 text-primary/30" />
                  
                  <blockquote className="text-lg text-gray-700 leading-relaxed italic">
                    &ldquo;{testimonials[currentTestimonial].content}&rdquo;
                  </blockquote>
                  
                  <div className="bg-primary/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-primary" />
                      <span className="font-medium text-gray-900">Destacado:</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {testimonials[currentTestimonial].highlight}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>Residente: {testimonials[currentTestimonial].residentName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Estancia: {testimonials[currentTestimonial].stayDuration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{testimonials[currentTestimonial].date}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full shadow-lg"
            onClick={prevTestimonial}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full shadow-lg"
            onClick={nextTestimonial}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {testimonials.slice(0, 6).map((testimonial, index) => (
            <Card 
              key={testimonial.id} 
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                index === currentTestimonial ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setCurrentTestimonial(index)}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {testimonial.name}
                      </h4>
                      {testimonial.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verificado
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      {testimonial.relation}
                    </p>
                    <div className="flex">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 line-clamp-3">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                
                <div className="text-xs text-gray-500">
                  {testimonial.date}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mb-16">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentTestimonial ? 'bg-primary w-8' : 'bg-gray-300'
              }`}
              onClick={() => setCurrentTestimonial(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
