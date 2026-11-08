import { useRef, useState, useCallback } from 'react';

import Box from '@mui/material/Box';

import { LandingCta } from '../landing-cta';
import { LandingHero } from '../landing-hero';
import { LandingStats } from '../landing-stats';
import { LandingHeader } from '../landing-header';
import { LandingFooter } from '../landing-footer';
import { LandingPillars } from '../landing-pillars';
import { LandingChampions } from '../landing-champions';
import { LandingMobileApp } from '../landing-mobile-app';
import { LandingHowItWorks } from '../landing-how-it-works';
import { LandingStudentMosaic } from '../landing-student-mosaic';
import { LandingQuizzesShowcase } from '../landing-quizzes-showcase';

// ----------------------------------------------------------------------

export function LandingView() {
  const [searchQuery, setSearchQuery] = useState('');
  const quizzesRef = useRef<HTMLDivElement>(null);
  const championsRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  const scrollToQuizzes = useCallback(() => {
    quizzesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const scrollToChampions = useCallback(() => {
    championsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const scrollToHowItWorks = useCallback(() => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const scrollToFeatures = useCallback(() => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F5F4EB' }}>
      {/* Floating Pill Header */}
      <LandingHeader
        onScrollToQuizzes={scrollToQuizzes}
        onScrollToChampions={scrollToChampions}
        onScrollToHowItWorks={scrollToHowItWorks}
        onScrollToFeatures={scrollToFeatures}
      />

      {/* Main Flow */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* 1. Show-stopping Hero (Design 1 & 2 inspired) */}
        <LandingHero
          onScrollToQuizzes={scrollToQuizzes}
          onScrollToChampions={scrollToChampions}
          onScrollToHowItWorks={scrollToHowItWorks}
        />

        {/* 2. Play, Learn and Master (3 Portrait Photo Cards from Design 1) */}
        <LandingPillars onScrollToQuizzes={scrollToQuizzes} />

        {/* 3. Real Live Public Quizzes Showcase with Search & Filters */}
        <div ref={quizzesRef}>
          <LandingQuizzesShowcase searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        </div>

        {/* 4. mcqpro Champions 3D Podium & Leaderboard (from Design 1) */}
        <div ref={championsRef}>
          <LandingChampions onScrollToQuizzes={scrollToQuizzes} />
        </div>

        {/* 5. Be the Top on the List: Masonry Student Achiever Gallery (from Design 1) */}
        <LandingStudentMosaic />

        {/* 6. Here's How It Works: 3 Steps with Real Photos & Yellow Base (from Design 1) */}
        <div ref={howItWorksRef}>
          <LandingHowItWorks />
        </div>

        {/* 7. Progress and Success: Editorial & Metrics (from Design 1) */}
        <div ref={featuresRef}>
          <LandingStats />
        </div>

        {/* 8. Practice on Any Device: Mobile App Mockup Banner (from Design 1) */}
        <LandingMobileApp onScrollToQuizzes={scrollToQuizzes} />

        {/* 9. High-converting CTA Banner */}
        <LandingCta onScrollToQuizzes={scrollToQuizzes} />
      </Box>

      {/* 10. Sleek Dark Footer */}
      <LandingFooter onScrollToQuizzes={scrollToQuizzes} onScrollToFeatures={scrollToFeatures} />
    </Box>
  );
}
