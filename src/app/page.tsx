import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeaturedProperties from '@/components/FeaturedProperties';
import HowItWorks from '@/components/HowItWorks';
import AgentCTA from '@/components/AgentCTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <FeaturedProperties />
      <HowItWorks />
      <AgentCTA />
      <Footer />
    </main>
  );
}
