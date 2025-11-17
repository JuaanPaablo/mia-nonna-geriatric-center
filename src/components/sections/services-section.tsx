import { 
  UtensilsCrossed,
  Activity, 
  Brain,
  Palette,
  Music,
  Heart,
  Stethoscope,
  Shield,
  BookOpen,
  CheckCircle,
  Sparkles,
  HeartHandshake,
  Calendar
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const includedServices = [
  {
    category: 'Alimentación',
    icon: UtensilsCrossed,
    items: [
      'Desayuno completo',
      'Media mañana',
      'Almuerzo nutritivo',
      'Media tarde'
    ],
    color: 'text-orange-600'
  },
  {
    category: 'Actividades Físicas',
    icon: Activity,
    items: [
      'Ejercicios físicos adaptados',
      'Rutinas de movilidad'
    ],
    color: 'text-blue-600'
  },
  {
    category: 'Terapias Cognitivas',
    icon: Brain,
    items: [
      'Terapias cognitivas',
      'Ejercicios de memoria',
      'Estimulación mental'
    ],
    color: 'text-purple-600'
  },
  {
    category: 'Actividades Creativas',
    icon: Palette,
    items: [
      'Manualidades',
      'Pintura',
      'Artes creativas'
    ],
    color: 'text-pink-600'
  },
  {
    category: 'Entretenimiento',
    icon: Music,
    items: [
      'Canto',
      'Actividades musicales'
    ],
    color: 'text-green-600'
  },
  {
    category: 'Atención Médica',
    icon: Stethoscope,
    items: [
      'Chequeos médicos mensuales',
      'Seguimiento de salud'
    ],
    color: 'text-red-600'
  },
  {
    category: 'Apoyo Psicológico',
    icon: Heart,
    items: [
      'Charlas con psicólogos',
      'Acompañamiento emocional'
    ],
    color: 'text-rose-600'
  },
  {
    category: 'Seguridad y Prevención',
    icon: Shield,
    items: [
      'Visitas de Cruz Roja',
      'Educación preventiva'
    ],
    color: 'text-indigo-600'
  },
  {
    category: 'Material Educativo',
    icon: BookOpen,
    items: [
      'Material didáctico incluido',
      'Recursos educativos'
    ],
    color: 'text-amber-600'
  }
]

export function ServicesSection() {
  return (
    <section id="servicios" className="py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-secondary/20 bg-secondary/10 text-secondary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Plan Integral
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Todo incluido en un solo plan
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Un programa completo diseñado para el bienestar integral de nuestros residentes, 
            combinando atención médica, actividades recreativas y apoyo emocional.
          </p>
        </div>

        {/* Main pricing card */}
        <div className="max-w-5xl mx-auto mb-16">
          <Card className="relative overflow-hidden border-2 border-primary/20 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full -ml-32 -mb-32"></div>
            
            <CardHeader className="text-center relative z-10 pb-8">
              <CardTitle className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Plan Mensual Completo
              </CardTitle>
              <div className="mt-6">
                <div className="text-5xl lg:text-6xl font-bold text-primary mb-2">
                  $500
                </div>
                <p className="text-gray-600 text-lg">Matrícula mensual</p>
                <p className="text-sm text-gray-500 mt-2">
                  Incluye material didáctico y todos los servicios
                </p>
              </div>
              
              {/* Flexibility and Payment Options - Prominent */}
              <div className="mt-10 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="p-6 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-xl border-2 border-blue-300/60 hover:border-blue-400 hover:shadow-xl transition-all transform hover:scale-[1.02]">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-white shadow-md">
                      <HeartHandshake className="h-7 w-7 text-blue-600 flex-shrink-0" />
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-bold text-gray-900 mb-2">
                        Nos adaptamos a las necesidades de cada uno
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed font-medium">
                        Cada residente es único. Personalizamos nuestros servicios según las necesidades individuales.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 rounded-xl border-2 border-green-300/60 hover:border-green-400 hover:shadow-xl transition-all transform hover:scale-[1.02]">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-white shadow-md">
                      <Calendar className="h-7 w-7 text-green-600 flex-shrink-0" />
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-bold text-gray-900 mb-2">
                        Pagos flexibles y diferidos
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed font-medium">
                        Entendemos que cada situación es diferente. Ofrecemos opciones de pago adaptadas a tu realidad.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="relative z-10 px-6 lg:px-12 pb-12">
              {/* Services Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {includedServices.map((service, index) => (
                  <div 
                    key={index} 
                    className="bg-white rounded-lg p-5 border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10">
                        <service.icon className={`h-6 w-6 ${service.color}`} />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {service.category}
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {service.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle className={`h-4 w-4 ${service.color} flex-shrink-0 mt-0.5`} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Additional note */}
              <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/10">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Servicios en constante mejora
                    </p>
                    <p className="text-sm text-gray-600">
                      Continuamente implementamos nuevas actividades y servicios para enriquecer 
                      la experiencia de nuestros residentes.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-8 text-center">
                <a
                  href="https://wa.me/593998313608?text=Hola%2C%20deseo%20recibir%20informaci%C3%B3n%20sobre%20el%20plan%20mensual%20completo%20de%20Mia%20Nonna"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button size="lg" className="px-8 py-6 text-lg flex items-center gap-2">
                    <svg 
                      viewBox="0 0 32 32" 
                      fill="currentColor" 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="w-6 h-6 text-green-500"
                    >
                      <path d="M16.003 2.667c-7.343 0-13.333 5.989-13.333 13.333 0 2.369.624 4.682 1.806 6.712L2.059 29.207c-.134.401-.034.848.258 1.144.293.296.734.399 1.138.264l6.577-2.198c1.954.966 4.119 1.475 6.332 1.475h.001c7.343 0 13.333-5.989 13.333-13.333 0-7.344-5.99-13.333-13.333-13.333zm0 24.001c-2.049 0-4.045-.522-5.792-1.509l-.412-.228-4.744 1.587 1.56-4.667-.267-.43c-1.12-1.808-1.713-3.894-1.713-6.021 0-6.084 4.95-11.034 11.033-11.034 6.084 0 11.034 4.95 11.034 11.034s-4.95 11.034-11.034 11.034zm6.252-8.666c-.339-.169-2.01-.993-2.322-1.105-.312-.112-.54-.169-.767.17-.227.338-.88 1.104-1.08 1.331-.199.226-.399.254-.738.085-.339-.17-1.432-.527-2.725-1.682-1.008-.899-1.687-2.01-1.887-2.34-.199-.339-.021-.522.148-.69.152-.151.339-.396.508-.595.169-.199.226-.339.339-.565.113-.227.056-.425-.028-.595-.085-.169-.767-1.853-1.049-2.54-.277-.666-.557-.575-.767-.585l-.651-.012c-.198 0-.521.074-.793.352s-1.041 1.017-1.041 2.48c0 1.462 1.066 2.877 1.216 3.077.151.199 2.106 3.219 5.106 4.389.714.308 1.27.491 1.704.628.716.228 1.37.196 1.885.119.576-.086 1.758-.719 2.008-1.417.25-.699.25-1.298.176-1.416-.072-.119-.31-.196-.648-.364z"/>
                    </svg>
                    Consultar por WhatsApp
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
