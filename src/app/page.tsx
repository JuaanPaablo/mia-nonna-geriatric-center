import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/sections/hero-section'
import { WhyChooseUsSection } from '@/components/sections/why-choose-us-section'
import { ServicesSection } from '@/components/sections/services-section'
import { FacilitiesSection } from '@/components/sections/facilities-section'
import { StaffSection } from '@/components/sections/staff-section'
import { TestimonialsSection } from '@/components/sections/testimonials-section'
import { ContactSection } from '@/components/sections/contact-section'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <HeroSection />
        <WhyChooseUsSection />
        <ServicesSection />
        <FacilitiesSection />
        <StaffSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      
      <Footer />
    </div>
  )
}
