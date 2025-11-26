import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Stethoscope,
  Heart,
  Activity,
  Users,
  Star,
  Award,
  Clock,
  Phone,
  Mail,
  GraduationCap
} from 'lucide-react'

const leadership = [
  {
    name: 'Dra. Elena Rodríguez',
    position: 'Directora Médica',
    specialty: 'Geriatría y Gerontología',
    experience: '15 años',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Especialista en medicina geriátrica con amplia experiencia en cuidados de larga duración. Licenciada en Medicina por la Universidad Complutense de Ibarra.',
    credentials: ['Doctora en Medicina', 'Especialista en Geriatría', 'Máster en Gerontología'],
    achievements: ['Premio Nacional de Geriatría 2019', '200+ publicaciones científicas']
  },
  {
    name: 'Carmen López',
    position: 'Supervisora de Enfermería',
    specialty: 'Enfermería Geriátrica',
    experience: '12 años',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Supervisora de equipo de enfermería especializada en cuidado de personas mayores. Diplomada en Enfermería con especialización en Geriatría.',
    credentials: ['Diplomada en Enfermería', 'Especialista en Geriatría', 'Formación en Cuidados Paliativos'],
    achievements: ['Certificación en Calidad Asistencial', 'Formadora de personal especializado']
  },
  {
    name: 'Miguel Santos',
    position: 'Fisioterapeuta Principal',
    specialty: 'Rehabilitación Geriátrica',
    experience: '8 años',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Especialista en fisioterapia y rehabilitación para personas de la tercera edad. Graduado en Fisioterapia con formación específica en geriatría.',
    credentials: ['Graduado en Fisioterapia', 'Especialista en Geriatría', 'Máster en Neurorrehabilitación'],
    achievements: ['Certificación en Bobath', 'Experto en hidroterapia geriátrica']
  }
]

const departments = [
  {
    name: 'Equipo Médico',
    icon: Stethoscope,
    color: 'text-blue-600 bg-blue-100',
    count: 8,
    description: 'Médicos geriatras, internistas y especialistas',
    specialties: ['Geriatría', 'Medicina Interna', 'Cardiología', 'Neurología']
  },
  {
    name: 'Enfermería',
    icon: Heart,
    color: 'text-red-600 bg-red-100',
    count: 15,
    description: 'Enfermeras especializadas en cuidado geriátrico',
    specialties: ['Enfermería Geriátrica', 'Cuidados Intensivos', 'Heridas Crónicas', 'Diabetes']
  },
  {
    name: 'Terapeutas',
    icon: Activity,
    color: 'text-green-600 bg-green-100',
    count: 6,
    description: 'Fisioterapeutas y terapeutas ocupacionales',
    specialties: ['Fisioterapia', 'Terapia Ocupacional', 'Logopedia', 'Musicoterapia']
  },
  {
    name: 'Apoyo Social',
    icon: Users,
    color: 'text-purple-600 bg-purple-100',
    count: 12,
    description: 'Trabajadores sociales y auxiliares especializados',
    specialties: ['Trabajo Social', 'Psicología', 'Animación Sociocultural', 'Cuidados Personales']
  }
]


export function StaffSection() {
  // Oculto temporalmente hasta tener las imágenes del equipo
  return null

  return (
    <section id="personal" className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-medium mb-4">
            Nuestro Equipo
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Profesionales dedicados a tu bienestar
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Contamos con un equipo multidisciplinar de profesionales especializados en geriatría,
            comprometidos con proporcionar el mejor cuidado y atención personalizada.
          </p>
        </div>

        {/* Leadership team - Oculto temporalmente hasta tener las imágenes */}
        {false && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Equipo Directivo
            </h3>

            <div className="grid lg:grid-cols-3 gap-8">
              {leadership.map((member, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300">
                  <div className="relative">
                    <div className="aspect-[3/4] overflow-hidden rounded-t-lg">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={300}
                        height={400}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-gray-800">
                        {member.experience} exp.
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-1">
                        {member.name}
                      </h4>
                      <p className="text-primary font-semibold mb-1">
                        {member.position}
                      </p>
                      <p className="text-sm text-gray-600">
                        {member.specialty}
                      </p>
                    </div>

                    <p className="text-sm text-gray-700 leading-relaxed">
                      {member.description}
                    </p>

                    <div className="space-y-2">
                      <h5 className="font-semibold text-gray-900 text-sm">Credenciales:</h5>
                      <div className="flex flex-wrap gap-1">
                        {member.credentials.map((credential, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {credential}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-semibold text-gray-900 text-sm">Logros destacados:</h5>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {member.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Star className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
