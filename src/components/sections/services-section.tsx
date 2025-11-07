import { 
  Stethoscope, 
  Activity, 
  Users, 
  Music, 
  Heart, 
  Apple,
  Clock,
  MapPin,
  CheckCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const featuredServices = [
  {
    icon: Stethoscope,
    title: 'Atención Médica 24/7',
    description: 'Supervisión médica constante con personal especializado en geriatría.',
    features: ['Médico geriatra disponible', 'Enfermería especializada', 'Monitoreo continuo', 'Urgencias médicas'],
    price: 'Incluido',
    highlighted: true
  },
  {
    icon: Activity,
    title: 'Fisioterapia',
    description: 'Programas de rehabilitación física adaptados a cada residente.',
    features: ['Evaluación personalizada', 'Ejercicios adaptados', 'Equipamiento moderno', 'Seguimiento continuo'],
    price: 'Desde 45€/sesión',
    highlighted: true
  },
  {
    icon: Apple,
    title: 'Nutrición Especializada',
    description: 'Dietas personalizadas supervisadas por nutricionistas.',
    features: ['Menús personalizados', 'Control nutricional', 'Dietas terapéuticas', 'Seguimiento médico'],
    price: 'Incluido',
    highlighted: true
  }
]

const allServices = [
  {
    icon: Heart,
    title: 'Terapia Ocupacional',
    description: 'Actividades para mantener la autonomía y habilidades cognitivas.',
    category: 'Terapia'
  },
  {
    icon: Users,
    title: 'Actividades Sociales',
    description: 'Programas de socialización y entretenimiento adaptados.',
    category: 'Social'
  },
  {
    icon: Music,
    title: 'Musicoterapia',
    description: 'Sesiones de música terapéutica para estimular la memoria.',
    category: 'Terapia'
  },
  {
    icon: Activity,
    title: 'Gimnasia Adaptada',
    description: 'Ejercicios suaves para mantener la movilidad y flexibilidad.',
    category: 'Físico'
  },
  {
    icon: Heart,
    title: 'Apoyo Psicológico',
    description: 'Acompañamiento emocional para residentes y familias.',
    category: 'Apoyo'
  },
  {
    icon: Users,
    title: 'Terapia Grupal',
    description: 'Actividades grupales para fomentar la interacción social.',
    category: 'Social'
  }
]

const careTypes = [
  {
    title: 'Tiempo Completo',
    description: 'Cuidado integral 24/7 con residencia permanente en nuestras instalaciones.',
    features: [
      'Habitación privada o compartida',
      'Atención médica y de enfermería',
      'Alimentación completa',
      'Actividades diarias',
      'Servicio de lavandería',
      'Acompañamiento familiar'
    ],
    price: 'Desde 2.800€/mes',
    popular: true
  },
  {
    title: 'Centro de Día',
    description: 'Cuidado durante el día con regreso a casa por la noche.',
    features: [
      'Horario de 8:00 a 18:00',
      'Desayuno, comida y merienda',
      'Actividades terapéuticas',
      'Fisioterapia',
      'Transporte disponible',
      'Seguimiento personalizado'
    ],
    price: 'Desde 1.800€/mes',
    popular: false
  },
  {
    title: 'Respiro Familiar',
    description: 'Cuidado temporal para descanso de familiares cuidadores.',
    features: [
      'Estancias flexibles',
      'Desde 1 día hasta varios meses',
      'Atención completa',
      'Adaptación gradual',
      'Informes diarios',
      'Disponibilidad inmediata'
    ],
    price: 'Desde 120€/día',
    popular: false
  }
]

export function ServicesSection() {
  return (
    <section id="servicios" className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-secondary/20 bg-secondary/10 text-secondary text-sm font-medium mb-4">
            Nuestros Servicios
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Cuidado integral para cada necesidad
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Ofrecemos una amplia gama de servicios especializados para garantizar el bienestar 
            físico, mental y emocional de nuestros residentes.
          </p>
        </div>

        {/* Featured services */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {featuredServices.map((service, index) => (
            <Card key={index} className="relative group hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/20">
              {service.highlighted && (
                <div className="absolute -top-3 left-6">
                  <Badge variant="default" className="bg-primary text-white">
                    Servicio destacado
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full flex items-center justify-center group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300">
                  <service.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <p className="text-gray-600">{service.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-primary mb-2">
                      {service.price}
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Más información
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Care types */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Modalidades de Cuidado
          </h3>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {careTypes.map((careType, index) => (
              <Card key={index} className={`relative group hover:shadow-lg transition-all duration-300 ${careType.popular ? 'ring-2 ring-primary/20' : ''}`}>
                {careType.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge variant="default" className="bg-secondary text-white">
                      Más popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="text-xl text-center">{careType.title}</CardTitle>
                  <p className="text-gray-600 text-center">{careType.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {careType.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t text-center">
                    <div className="text-2xl font-bold text-primary mb-3">
                      {careType.price}
                    </div>
                    <Button 
                      variant={careType.popular ? "default" : "outline"} 
                      className="w-full"
                    >
                      Solicitar información
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All services grid */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Servicios Adicionales
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allServices.map((service, index) => (
              <Card key={index} className="group hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{service.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {service.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{service.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-16 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 lg:p-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Necesitas un servicio personalizado?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Cada residente es único. Adaptamos nuestros servicios a las necesidades específicas 
            de cada persona para garantizar el mejor cuidado posible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="healthcare" size="lg">
              <Clock className="h-4 w-4 mr-2" />
              Consulta gratuita
            </Button>
            <Button variant="outline" size="lg">
              <MapPin className="h-4 w-4 mr-2" />
              Visitar instalaciones
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
