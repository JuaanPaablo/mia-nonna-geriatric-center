'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { contactFormSchema, type ContactFormData } from '@/lib/validations'
import { generateWhatsAppUrl } from '@/lib/utils'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  Heart,
  Calendar,
  Users
} from 'lucide-react'

const contactInfo = [
  {
    icon: Phone,
    title: 'Teléfono',
    value: '+34 912 345 678',
    description: 'Atención telefónica 24/7',
    action: 'tel:+34912345678'
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    value: '+34 612 345 678',
    description: 'Respuesta inmediata',
    action: 'whatsapp'
  },
  {
    icon: Mail,
    title: 'Email',
    value: 'info@mianonna.com',
    description: 'Respuesta en 24h',
    action: 'mailto:info@mianonna.com'
  },
  {
    icon: MapPin,
    title: 'Ubicación',
    value: 'Calle de la Salud, 123',
    description: '28001 Madrid, España',
    action: 'maps'
  }
]

const schedule = [
  {
    icon: Users,
    title: 'Visitas',
    hours: 'Lunes a Domingo: 10:00 - 20:00',
    note: 'Cita previa recomendada'
  },
  {
    icon: Phone,
    title: 'Atención telefónica',
    hours: 'Lunes a Viernes: 8:00 - 22:00',
    note: 'Sábados y Domingos: 9:00 - 21:00'
  },
  {
    icon: Calendar,
    title: 'Urgencias médicas',
    hours: '24 horas, 7 días a la semana',
    note: 'Personal médico siempre disponible'
  }
]

const careTypes = [
  { value: 'full_time', label: 'Tiempo Completo (Residencia permanente)' },
  { value: 'day_care', label: 'Centro de Día (Horario diurno)' },
  { value: 'respite', label: 'Respiro Familiar (Estancia temporal)' },
  { value: 'consultation', label: 'Consulta informativa' }
]

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema)
  })

  const watchedValues = watch()

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real app, you would submit to your API
      console.log('Form data:', data)
      
      setIsSubmitted(true)
      reset()
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWhatsAppContact = () => {
    const message = `Hola, me interesa conocer más sobre los servicios de Mia Nonna para ${watchedValues.residentName || 'mi familiar'}.`
    const whatsappUrl = generateWhatsAppUrl('+34612345678', message)
    window.open(whatsappUrl, '_blank')
  }

  if (isSubmitted) {
    return (
      <section id="contacto" className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¡Gracias por contactarnos!
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Hemos recibido tu solicitud y nos pondremos en contacto contigo en las próximas 24 horas. 
              Mientras tanto, puedes contactarnos directamente por WhatsApp para una respuesta más rápida.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="healthcare" onClick={handleWhatsAppContact}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Contactar por WhatsApp
              </Button>
              <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                Enviar otra consulta
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="contacto" className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-medium mb-4">
            Contacto
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Estamos aquí para ayudarte
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            ¿Tienes preguntas sobre nuestros servicios? ¿Te gustaría agendar una visita? 
            Contáctanos y te proporcionaremos toda la información que necesitas.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact information */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Información de contacto
            </h3>
            
            {contactInfo.map((info, index) => (
              <Card key={index} className="group hover:shadow-md transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300">
                      <info.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {info.title}
                      </h4>
                      <p className="text-gray-900 font-medium mb-1">
                        {info.value}
                      </p>
                      <p className="text-sm text-gray-600">
                        {info.description}
                      </p>
                      {info.action === 'whatsapp' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2 w-full"
                          onClick={handleWhatsAppContact}
                        >
                          <MessageCircle className="h-3 w-3 mr-2" />
                          Contactar ahora
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Horarios de atención
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {schedule.map((item, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <item.icon className="h-4 w-4 text-primary" />
                      <h5 className="font-semibold text-gray-900 text-sm">
                        {item.title}
                      </h5>
                    </div>
                    <p className="text-sm text-gray-900 mb-1">{item.hours}</p>
                    <p className="text-xs text-gray-600">{item.note}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" />
                  Solicitar información
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Completa el formulario y nos pondremos en contacto contigo en menos de 24 horas.
                </p>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Family contact info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="familyName">
                        Nombre del familiar <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="familyName"
                        placeholder="Tu nombre completo"
                        {...register('familyName')}
                      />
                      {errors.familyName && (
                        <p className="text-sm text-red-600">{errors.familyName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Teléfono <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+34 XXX XXX XXX"
                        {...register('phone')}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-600">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu.email@ejemplo.com"
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Resident info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="residentName">
                        Nombre del residente <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="residentName"
                        placeholder="Nombre de la persona a cuidar"
                        {...register('residentName')}
                      />
                      {errors.residentName && (
                        <p className="text-sm text-red-600">{errors.residentName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="residentAge">
                        Edad del residente <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="residentAge"
                        type="number"
                        min="0"
                        max="150"
                        placeholder="85"
                        {...register('residentAge', { valueAsNumber: true })}
                      />
                      {errors.residentAge && (
                        <p className="text-sm text-red-600">{errors.residentAge.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="careType">
                      Tipo de cuidado <span className="text-red-500">*</span>
                    </Label>
                    <Select onValueChange={(value) => setValue('careType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo de cuidado" />
                      </SelectTrigger>
                      <SelectContent>
                        {careTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.careType && (
                      <p className="text-sm text-red-600">{errors.careType.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">
                      Mensaje <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Cuéntanos más sobre las necesidades específicas del residente, preguntas sobre servicios, preferencias de horarios para contacto, etc."
                      rows={4}
                      {...register('message')}
                    />
                    {errors.message && (
                      <p className="text-sm text-red-600">{errors.message.message}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      id="acceptTerms"
                      type="checkbox"
                      className="rounded border-gray-300"
                      {...register('acceptTerms')}
                    />
                    <Label htmlFor="acceptTerms" className="text-sm text-gray-700">
                      Acepto los{' '}
                      <a href="#" className="text-primary hover:underline">
                        términos y condiciones
                      </a>{' '}
                      y la{' '}
                      <a href="#" className="text-primary hover:underline">
                        política de privacidad
                      </a>
                      . <span className="text-red-500">*</span>
                    </Label>
                  </div>
                  {errors.acceptTerms && (
                    <p className="text-sm text-red-600">{errors.acceptTerms.message}</p>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      type="submit"
                      variant="healthcare"
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Enviar solicitud
                        </>
                      )}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleWhatsAppContact}
                      className="flex-1"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp directo
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 lg:p-12 text-white text-center">
          <Heart className="h-12 w-12 mx-auto mb-4 opacity-80" />
          <h3 className="text-2xl lg:text-3xl font-bold mb-4">
            Tu tranquilidad es nuestra prioridad
          </h3>
          <p className="text-lg mb-6 max-w-2xl mx-auto opacity-90">
            En Mia Nonna entendemos lo importante que es para ti encontrar el mejor cuidado 
            para tu ser querido. Estamos aquí para acompañarte en cada paso del proceso.
          </p>
          <p className="text-sm opacity-80">
            📞 Llamadas disponibles 24/7 • 📱 WhatsApp con respuesta inmediata • 📧 Email con respuesta en 24h
          </p>
        </div>
      </div>
    </section>
  )
}
