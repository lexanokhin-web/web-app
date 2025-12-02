
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
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/verbs" element={<VerbsPage />} />
        <Route path="/exercise/:blockId" element={<ExercisePage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/pronouns" element={<PronounsPage />} />
        <Route path="/antonyms" element={<AntonymsPage />} />
        <Route path="/synonyms" element={<SynonymsPage />} />
        <Route path="/test-scenario-1" element={<TestScenarioPage filename="verb_test_scenarios" />} />
        <Route path="/test-scenario-2" element={<TestScenarioPage filename="verb_test_scenarios_2" />} />
        <Route path="/test/:blockId" element={<VerbTestPage />} />
      </Routes>
    </Router>
  );
}

export default App;

