import { Clock, Building, Users, Heart, Star, Award, Shield, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  {
    icon: Clock,
    title: 'Cuidado 24/7',
    description: 'Personal médico y de enfermería disponible las 24 horas del día, los 7 días de la semana. Monitoreo constante para garantizar la seguridad y bienestar de nuestros residentes.',
    color: 'text-blue-600 bg-blue-100',
    stats: '24h',
    highlight: 'Atención continua'
  },
  {
    icon: Building,
    title: 'Instalaciones Modernas',
    description: 'Equipamiento de última generación en un ambiente cálido y familiar. Habitaciones privadas, áreas comunes amplias y jardines terapéuticos para el bienestar integral.',
    color: 'text-green-600 bg-green-100',
    stats: '5000m²',
    highlight: 'Espacio adaptado'
  },
  {
    icon: Users,
    title: 'Personal Especializado',
    description: 'Equipo multidisciplinar con experiencia en cuidado geriátrico: médicos geriatras, enfermeras especializadas, fisioterapeutas y terapeutas ocupacionales.',
    color: 'text-purple-600 bg-purple-100',
    stats: '50+',
    highlight: 'Profesionales expertos'
  },
  {
    icon: Heart,
    title: 'Atención Personalizada',
    description: 'Planes de cuidado individualizados para cada residente. Evaluación continua de necesidades y adaptación de servicios para optimizar la calidad de vida.',
    color: 'text-red-600 bg-red-100',
    stats: '1:4',
    highlight: 'Ratio cuidador-residente'
  }
]

const achievements = [
  {
    icon: Star,
    title: '4.9/5 Puntuación',
    subtitle: 'Satisfacción familiar'
  },
  {
    icon: Award,
    title: 'Certificación ISO',
    subtitle: 'Calidad garantizada'
  },
  {
    icon: Shield,
    title: '15 años',
    subtitle: 'De experiencia'
  },
  {
    icon: Zap,
    title: '98%',
    subtitle: 'Recomendación'
  }
]

export function WhyChooseUsSection() {
  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-medium mb-4">
            ¿Por qué elegirnos?
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Tu familia merece el mejor cuidado
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Combinamos experiencia profesional con calidez humana para crear un ambiente 
            donde cada residente se sienta como en casa, con la tranquilidad que las familias necesitan.
          </p>
        </div>

        {/* Main features grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className={`p-4 rounded-xl ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {feature.title}
                      </h3>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {feature.stats}
                        </div>
                        <div className="text-xs text-gray-500">
                          {feature.highlight}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quote section */}
        <div className="mt-16 bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 lg:p-12 text-white text-center">
          <blockquote className="text-xl lg:text-2xl font-medium mb-6 italic text-black">
            "En Mia Nonna no solo cuidamos a nuestros residentes, los tratamos como familia. 
            Cada sonrisa, cada momento de bienestar es nuestra mayor recompensa."
          </blockquote>
        </div>
      </div>
    </section>
  )
}
