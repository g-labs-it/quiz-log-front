import { useRef, useState, useCallback } from 'react';

import Box from '@mui/material/Box';

import { LandingCta } from '../landing-cta';
import { LandingHero } from '../landing-hero';
import { LandingHeader } from '../landing-header';
import { LandingFooter } from '../landing-footer';
import { LandingFeatures } from '../landing-features';
import { LandingHowItWorks } from '../landing-how-it-works';
import { LandingQuizzesShowcase } from '../landing-quizzes-showcase';

// ----------------------------------------------------------------------

export function LandingView() {
  const [searchQuery, setSearchQuery] = useState('');
  const quizzesRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);

  const scrollToQuizzes = useCallback(() => {
    quizzesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const scrollToFeatures = useCallback(() => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const scrollToHowItWorks = useCallback(() => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* Fixed Sticky Header */}
      <LandingHeader
        onScrollToQuizzes={scrollToQuizzes}
        onScrollToFeatures={scrollToFeatures}
        onScrollToHowItWorks={scrollToHowItWorks}
      />

      {/* Main Sections */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <LandingHero
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onScrollToQuizzes={scrollToQuizzes}
        />

        <div ref={quizzesRef}>
          <LandingQuizzesShowcase searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        </div>

        <div ref={featuresRef}>
          <LandingFeatures />
        </div>

        <div ref={howItWorksRef}>
          <LandingHowItWorks />
        </div>

        <LandingCta onScrollToQuizzes={scrollToQuizzes} />
      </Box>

      {/* Footer */}
      <LandingFooter onScrollToQuizzes={scrollToQuizzes} onScrollToFeatures={scrollToFeatures} />
    </Box>
  );
}
