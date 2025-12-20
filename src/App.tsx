
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const VerbsPage = lazy(() => import('./pages/VerbsPage').then(module => ({ default: module.VerbsPage })));
const ExercisePage = lazy(() => import('./pages/ExercisePage').then(module => ({ default: module.ExercisePage })));
const ArticlesPage = lazy(() => import('./pages/ArticlesPage').then(module => ({ default: module.ArticlesPage })));
const PronounsPage = lazy(() => import('./pages/PronounsPage').then(module => ({ default: module.PronounsPage })));
const AntonymsPage = lazy(() => import('./pages/AntonymsPage').then(module => ({ default: module.AntonymsPage })));
const SynonymsPage = lazy(() => import('./pages/SynonymsPage').then(module => ({ default: module.SynonymsPage })));
const FlashCardsPage = lazy(() => import('./pages/FlashCardsPage').then(module => ({ default: module.FlashCardsPage })));
const QuizPage = lazy(() => import('./pages/QuizPage').then(module => ({ default: module.QuizPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(module => ({ default: module.ProfilePage })));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage').then(module => ({ default: module.LeaderboardPage })));
const MatchGamePage = lazy(() => import('./pages/MatchGamePage').then(module => ({ default: module.MatchGamePage })));
const SentenceBuilderPage = lazy(() => import('./pages/SentenceBuilderPage').then(module => ({ default: module.SentenceBuilderPage })));
const BookSelectionPage = lazy(() => import('./pages/Book/BookSelectionPage').then(module => ({ default: module.BookSelectionPage })));
const BookChapterPage = lazy(() => import('./pages/Book/BookChapterPage').then(module => ({ default: module.BookChapterPage })));
const BookQuizPage = lazy(() => import('./pages/Book/BookQuizPage').then(module => ({ default: module.BookQuizPage })));
const A2BookSelectionPage = lazy(() => import('./pages/Book/A2BookSelectionPage'));
const A2BookChapterPage = lazy(() => import('./pages/Book/A2BookChapterPage'));
const A2BookQuizPage = lazy(() => import('./pages/Book/A2BookQuizPage').then(module => ({ default: module.A2BookQuizPage })));
const AdjektivdeklinationPage = lazy(() => import('./pages/AdjektivdeklinationPage').then(module => ({ default: module.AdjektivdeklinationPage })));

// Loading component
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/match-game" element={<MatchGamePage />} />
          <Route path="/sentence-builder" element={<SentenceBuilderPage />} />
          <Route path="/flashcards" element={<FlashCardsPage />} />
          <Route path="/flashcards/:level" element={<FlashCardsPage />} />
          <Route path="/flashcards/:level/:categoryId" element={<FlashCardsPage />} />
          <Route path="/b1-book" element={<BookSelectionPage />} />
          <Route path="/b1-book/quiz" element={<BookQuizPage />} />
          <Route path="/b1-book/:filename" element={<BookChapterPage />} />

          {/* A2 Book Routes */}
          <Route path="/a2-book" element={<A2BookSelectionPage />} />
          <Route path="/a2-book/quiz" element={<A2BookQuizPage />} />
          <Route path="/a2-book/:chapterId" element={<A2BookChapterPage />} />
          <Route path="/quiz/:blockId?" element={<QuizPage />} />
          <Route path="/verbs" element={<VerbsPage />} />
          <Route path="/exercise/:blockId" element={<ExercisePage />} />
          <Route path="/adjektivdeklination" element={<AdjektivdeklinationPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/pronouns" element={<PronounsPage />} />
          <Route path="/antonyms" element={<AntonymsPage />} />
          <Route path="/synonyms" element={<SynonymsPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;

