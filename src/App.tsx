import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import { HomePage } from './pages/HomePage';
import { VerbsPage } from './pages/VerbsPage';
import { ArticlesPage } from './pages/ArticlesPage';
import { PronounsPage } from './pages/PronounsPage';
import { FlashCardsPage } from './pages/FlashCardsPage';
import { AntonymsPage } from './pages/AntonymsPage';
import { SynonymsPage } from './pages/SynonymsPage';
import { ExercisePage } from './pages/ExercisePage';
import { TestScenarioPage } from './pages/TestScenarioPage';
import { VerbTestPage } from './pages/VerbTestPage';
import { QuizPage } from './pages/QuizPage';
import { MatchGamePage } from './pages/MatchGamePage';
import { SentenceBuilderPage } from './pages/SentenceBuilderPage';
import { ProfilePage } from './pages/ProfilePage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { PageTransition } from './components/PageTransition';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/verbs" element={<PageTransition><VerbsPage /></PageTransition>} />
        <Route path="/articles" element={<PageTransition><ArticlesPage /></PageTransition>} />
        <Route path="/pronouns" element={<PageTransition><PronounsPage /></PageTransition>} />
        <Route path="/flashcards" element={<PageTransition><FlashCardsPage /></PageTransition>} />
        <Route path="/flashcards/:level" element={<PageTransition><FlashCardsPage /></PageTransition>} />
        <Route path="/flashcards/:level/:categoryId" element={<PageTransition><FlashCardsPage /></PageTransition>} />
        <Route path="/antonyms" element={<PageTransition><AntonymsPage /></PageTransition>} />
        <Route path="/synonyms" element={<PageTransition><SynonymsPage /></PageTransition>} />
        <Route path="/exercise/:blockId" element={<PageTransition><ExercisePage /></PageTransition>} />
        <Route path="/test-scenario-1" element={<PageTransition><TestScenarioPage filename="test_scenario_1" /></PageTransition>} />
        <Route path="/test-scenario-2" element={<PageTransition><TestScenarioPage filename="test_scenario_2" /></PageTransition>} />
        <Route path="/verb-test" element={<PageTransition><VerbTestPage /></PageTransition>} />
        <Route path="/test/:blockId" element={<PageTransition><VerbTestPage /></PageTransition>} />
        <Route path="/quiz/:blockId?" element={<PageTransition><QuizPage /></PageTransition>} />
        <Route path="/match-game" element={<PageTransition><MatchGamePage /></PageTransition>} />
        <Route path="/sentence-builder" element={<PageTransition><SentenceBuilderPage /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
        <Route path="/leaderboard" element={<PageTransition><LeaderboardPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <AnimatedRoutes />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
