'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, Phone, Mail, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Inicio', href: '#' },
  { name: 'Servicios', href: '#servicios' },
  { name: 'Instalaciones', href: '#instalaciones' },
  { name: 'Personal', href: '#personal' },
  { name: 'Testimonios', href: '#testimonios' },
  { name: 'Contacto', href: '#contacto' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2 text-sm">
            <div className="flex items-center space-x-6">
              <a 
                href="https://wa.me/593998313608" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                <Phone className="h-3 w-3" />
                <span>+593 99 831 3608</span>
              </a>
              <div className="flex items-center space-x-2">
                <Mail className="h-3 w-3" />
                <span>info@mianonna.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-gradient-to-r from-primary to-secondary">
                <img
                  src="/images/nonna.jpg"
                  alt="Logo Mia Nonna"
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mia Nonna</h1>
                <p className="text-sm text-gray-600">Centro Geriátrico</p>
              </div>
            </Link>
          </div>  

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-primary transition-colors duration-200 font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href="#contacto">Solicitar Información</Link>
            </Button>
            <Button variant="healthcare" asChild>
              <Link 
                href="/login" 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Portal Admin
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden fixed inset-x-0 top-[calc(100%)] bg-white border-t shadow-lg transition-all duration-300 ease-in-out",
          mobileMenuOpen
            ? "max-h-screen opacity-100 visible"
            : "max-h-0 opacity-0 invisible overflow-hidden"
        )}
      >
        <div className="container mx-auto px-4 py-6">
          <nav className="space-y-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block py-2 text-gray-700 hover:text-primary transition-colors duration-200 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
          </nav>
          
          <div className="mt-6 space-y-3">
            <Button variant="outline" className="w-full" asChild>
              <Link href="#contacto" onClick={() => setMobileMenuOpen(false)}>
                Solicitar Información
              </Link>
            </Button>
            <Button variant="healthcare" className="w-full" asChild>
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                Portal Admin
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
