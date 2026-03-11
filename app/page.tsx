import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import HowItWorks from '@/components/HowItWorks'
import Reviews from '@/components/Reviews'
import OrderForm from '@/components/OrderForm'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Services />
      <HowItWorks />
      <Reviews />
      <OrderForm />
      <Footer />
    </main>
  )
}
