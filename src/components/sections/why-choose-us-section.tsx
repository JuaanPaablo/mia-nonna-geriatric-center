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

        {/* Achievements */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Nuestros logros hablan por nosotros
          </h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full flex items-center justify-center group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300">
                  <achievement.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-xl font-bold text-gray-900 mb-1">
                  {achievement.title}
                </div>
                <div className="text-sm text-gray-600">
                  {achievement.subtitle}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote section */}
        <div className="mt-16 bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 lg:p-12 text-white text-center">
          <blockquote className="text-xl lg:text-2xl font-medium mb-6 italic">
            "En Mia Nonna no solo cuidamos a nuestros residentes, los tratamos como familia. 
            Cada sonrisa, cada momento de bienestar es nuestra mayor recompensa."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Heart className="h-6 w-6" />
            </div>
            <div className="text-left">
              <div className="font-semibold">Dra. Elena Rodríguez</div>
              <div className="text-white/80 text-sm">Directora Médica</div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Listo para conocer más sobre nuestros servicios?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Te invitamos a visitarnos y conocer de primera mano nuestras instalaciones y equipo profesional. 
            La tranquilidad de tu familia es nuestra prioridad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contacto"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Solicitar Visita
            </a>
            <a
              href="#servicios"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Ver Servicios
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
