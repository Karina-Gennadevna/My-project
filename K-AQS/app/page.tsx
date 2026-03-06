import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import ForWhom from '@/components/ForWhom';
import Symptoms from '@/components/Symptoms';
import Deliverables from '@/components/Deliverables';
import Methodology from '@/components/Methodology';
import Demo from '@/components/Demo';
import FinancialRisk from '@/components/FinancialRisk';
import Architect from '@/components/Architect';
import Process from '@/components/Process';
import FAQ from '@/components/FAQ';
import FinalCTA from '@/components/FinalCTA';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ForWhom />
        <Symptoms />
        <Deliverables />
        <Methodology />
        <Demo />
        <FinancialRisk />
        <Architect />
        <Process />
        <FAQ />
        <FinalCTA />
      </main>
      <footer className="border-t border-white/[0.06] py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 text-sm">
          <span>
            © 2025 <span className="text-blue-500 font-semibold">K-AQS™</span>. Все права защищены.
          </span>
          <span>Система архитектурной диагностики управляемости бизнеса</span>
        </div>
      </footer>
    </>
  );
}
