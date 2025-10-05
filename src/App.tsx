import { useState } from 'react';
import FileUpload from './components/FileUpload';
import EvaluationForm from './components/EvaluationForm';
import ResultsDisplay from './components/ResultsDisplay';
import type { UploadResponse, ResultResponse } from './types';
import './App.css';

function App() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadResponse | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<ResultResponse | null>(null);

  const handleUploadSuccess = (response: UploadResponse) => {
    setUploadedFiles(response);
    setEvaluationResult(null);
  };

  const handleEvaluationComplete = (result: ResultResponse) => {
    setEvaluationResult(result);
  };

  const handleReset = () => {
    setUploadedFiles(null);
    setEvaluationResult(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>CV Evaluator</h1>
        <p className="subtitle">AI-Powered Candidate Assessment System</p>
      </header>

      <main className="app-main">
        {!uploadedFiles && (
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        )}

        {uploadedFiles && !evaluationResult && (
          <EvaluationForm
            uploadedFiles={uploadedFiles}
            onEvaluationComplete={handleEvaluationComplete}
            onReset={handleReset}
          />
        )}

        {evaluationResult && (
          <ResultsDisplay
            result={evaluationResult}
            onReset={handleReset}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>© 2025 CV Evaluator. Built with React + TypeScript</p>
      </footer>
    </div>
  );
}

export default App;

