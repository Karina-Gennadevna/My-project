import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Symptoms from '@/components/Symptoms';
import Architect from '@/components/Architect';
import Process from '@/components/Process';
import Deliverables from '@/components/Deliverables';
import ReportPreview from '@/components/ReportPreview';
import RiskMap from '@/components/RiskMap';
import ForWhom from '@/components/ForWhom';
import FinancialRisk from '@/components/FinancialRisk';
import Methodology from '@/components/Methodology';
import Demo from '@/components/Demo';
import FAQ from '@/components/FAQ';
import FinalCTA from '@/components/FinalCTA';

export default function Home() {
  return (
    <main className="bg-base min-h-screen">
      <Nav />
      <Hero />
      <Symptoms />
      <Architect />
      <Process />
      <Deliverables />
      <ReportPreview />
      <RiskMap />
      <ForWhom />
      <FinancialRisk />
      <Methodology />
      <Demo />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
