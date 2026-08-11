import { useLenis } from '@/hooks/useLenis';
import { useActiveSection } from '@/hooks/useActiveSection';
import { Nav } from '@/components/layout/Nav';
import { SectionIndex } from '@/components/layout/SectionIndex';
import { Footer } from '@/components/layout/Footer';
import { Cursor } from '@/components/fx/Cursor';
import { NoiseOverlay } from '@/components/fx/NoiseOverlay';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Skills } from '@/components/sections/Skills';
import { Experience } from '@/components/sections/Experience';
import { Education } from '@/components/sections/Education';
import { Projects } from '@/components/sections/Projects';
import { Contact } from '@/components/sections/Contact';
import type { SectionId } from '@/types';

const SECTIONS: readonly SectionId[] = [
  'hero',
  'about',
  'skills',
  'experience',
  'education',
  'projects',
  'contact',
];

export const App = () => {
  useLenis();
  const active = useActiveSection(SECTIONS);

  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-full bg-ink px-4 py-2 text-canvas focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[110]"
      >
        Skip to content
      </a>

      <Cursor />
      <NoiseOverlay />
      <Nav active={active} />
      <SectionIndex active={active} />

      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Education />
        <Projects />
        <Contact />
      </main>

      <Footer />
    </>
  );
};

export default App;
