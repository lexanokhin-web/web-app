

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { VerbsPage } from './pages/VerbsPage';
import { ExercisePage } from './pages/ExercisePage';
import { ArticlesPage } from './pages/ArticlesPage';
import { PronounsPage } from './pages/PronounsPage';
import { AntonymsPage } from './pages/AntonymsPage';
import { SynonymsPage } from './pages/SynonymsPage';
import { TestScenarioPage } from './pages/TestScenarioPage';
import { VerbTestPage } from './pages/VerbTestPage';
import { FlashCardsPage } from './pages/FlashCardsPage';
import { QuizPage } from './pages/QuizPage';
import { ProfilePage } from './pages/ProfilePage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { MatchGamePage } from './pages/MatchGamePage';
import { SentenceBuilderPage } from './pages/SentenceBuilderPage';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/match-game" element={<MatchGamePage />} />
        <Route path="/sentence-builder" element={<SentenceBuilderPage />} />
        <Route path="/flashcards" element={<FlashCardsPage />} />
        <Route path="/flashcards/:level" element={<FlashCardsPage />} />
        <Route path="/flashcards/:level/:categoryId" element={<FlashCardsPage />} />
        <Route path="/quiz/:blockId?" element={<QuizPage />} />
        <Route path="/verbs" element={<VerbsPage />} />
        <Route path="/exercise/:blockId" element={<ExercisePage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/pronouns" element={<PronounsPage />} />
        <Route path="/antonyms" element={<AntonymsPage />} />
        <Route path="/synonyms" element={<SynonymsPage />} />
        <Route path="/test-scenario-1" element={<TestScenarioPage filename="verb_test_scenarios" />} />
        <Route path="/test-scenario-2" element={<TestScenarioPage filename="verb_test_scenarios2" />} />
        <Route path="/test/:blockId" element={<VerbTestPage />} />
      </Routes>
    </Router>
  );
}

export default App;

