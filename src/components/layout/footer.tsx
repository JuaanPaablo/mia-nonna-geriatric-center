import Link from 'next/link'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Heart,
  Shield,
  Award,
  Users
} from 'lucide-react'

const navigation = {
  services: [
    { name: 'Atención Médica 24/7', href: '#servicios' },
    { name: 'Fisioterapia', href: '#servicios' },
    { name: 'Terapia Ocupacional', href: '#servicios' },
    { name: 'Nutrición Especializada', href: '#servicios' },
    { name: 'Actividades Sociales', href: '#servicios' },
    { name: 'Apoyo Psicológico', href: '#servicios' },
  ],
  care: [
    { name: 'Tiempo Completo', href: '#servicios' },
    { name: 'Centro de Día', href: '#servicios' },
    { name: 'Respiro Familiar', href: '#servicios' },
    { name: 'Cuidados Especializados', href: '#servicios' },
  ],
  company: [
    { name: 'Sobre Nosotros', href: '#' },
    { name: 'Nuestro Equipo', href: '#personal' },
    { name: 'Instalaciones', href: '#instalaciones' },
    { name: 'Testimonios', href: '#testimonios' },
    { name: 'Blog', href: '#' },
    { name: 'Trabaja con Nosotros', href: '#' },
  ],
  support: [
    { name: 'Contacto', href: '#contacto' },
    { name: 'Preguntas Frecuentes', href: '#' },
    { name: 'Política de Privacidad', href: '#' },
    { name: 'Términos y Condiciones', href: '#' },
            { name: 'Portal del Familiar', href: '/login' },
  ],
}

const social = [
  {
    name: 'Facebook',
    href: 'https://facebook.com/mianonna',
    icon: Facebook,
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/mianonna',
    icon: Instagram,
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/company/mianonna',
    icon: Linkedin,
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/@mianonna',
    icon: Youtube,
  },
]

const certifications = [
  {
    icon: Shield,
    title: 'ISO 9001',
    description: 'Calidad certificada'
  },
  {
    icon: Award,
    title: 'Premio Nacional',
    description: 'Excelencia geriátrica'
  },
  {
    icon: Users,
    title: 'Registro Oficial',
    description: 'Centro autorizado'
  },
  {
    icon: Heart,
    title: '15 años',
    description: 'De experiencia'
  }
]

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-6 gap-8">
          {/* Company info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center bg-gradient-to-r from-primary to-secondary">
                <img
                  src="/images/nonna.jpg"
                  alt="Logo Mia Nonna"
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">Mia Nonna</h3>
                <p className="text-gray-400 text-sm">Centro Geriátrico</p>
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed">
              Brindamos cuidado profesional y cariñoso a personas mayores, 
              creando un ambiente familiar donde cada residente se sienta como en casa.
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              <a 
                href="https://wa.me/593998313608" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-gray-300">+593 99 831 3608</span>
              </a>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-gray-300">info@mianonna.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-gray-300">Calle de la Salud, 123<br />28001 Madrid, España</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-gray-300">Atención 24/7</span>
              </div>
            </div>

            {/* Social links */}
            <div className="flex space-x-4">
              {social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-lg flex items-center justify-center transition-colors duration-200"
                  aria-label={item.name}
                >
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Servicios</h4>
            <ul className="space-y-2">
              {navigation.services.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-300 hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Care types */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Tipos de Cuidado</h4>
            <ul className="space-y-2">
              {navigation.care.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-300 hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Empresa</h4>
            <ul className="space-y-2">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-300 hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Soporte</h4>
            <ul className="space-y-2">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-300 hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm text-center md:text-left">
              <p>© 2025 Mia Nonna Centro Geriátrico. Todos los derechos reservados.</p>
            </div>
            
            <div className="flex items-center gap-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-primary transition-colors duration-200">
                Política de Privacidad
              </a>
              <a href="#" className="hover:text-primary transition-colors duration-200">
                Términos de Uso
              </a>
              <a href="#" className="hover:text-primary transition-colors duration-200">
                Cookies
              </a>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-xs">
              Desarrollado por <a href="https://www.ionoshub.net/" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors duration-200">ionoshub.net</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
