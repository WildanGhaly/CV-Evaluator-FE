import type { ResultResponse } from '../types';
import './ResultsDisplay.css';

interface ResultsDisplayProps {
  result: ResultResponse;
  onReset: () => void;
}

function ScoreCard({ title, score, justification }: { title: string; score: number; justification: string }) {
  const getScoreColor = (score: number) => {
    if (score >= 4) return 'score-high';
    if (score >= 3) return 'score-medium';
    return 'score-low';
  };

  return (
    <div className="score-card">
      <div className="score-header">
        <h4>{title}</h4>
        <span className={`score-badge ${getScoreColor(score)}`}>{score}/5</span>
      </div>
      <p className="score-justification">{justification}</p>
    </div>
  );
}

function ResultsDisplay({ result, onReset }: ResultsDisplayProps) {
  if (result.status !== 'completed' || !result.result) {
    return (
      <div className="results-container">
        <div className="card">
          <h2>Evaluation Status</h2>
          <p>Status: {result.status}</p>
          {result.error && <p className="error-message">{result.error}</p>}
        </div>
      </div>
    );
  }

  const { result: evalResult } = result;

  const getRecommendationColor = (rec: string) => {
    if (rec.includes('strong') || rec.includes('excellent')) return 'recommendation-high';
    if (rec.includes('moderate')) return 'recommendation-medium';
    return 'recommendation-low';
  };

  return (
    <div className="results-container">
      <div className="results-header">
        <h2>Evaluation Results</h2>
        <button onClick={onReset} className="btn btn-secondary">
          Start New Evaluation
        </button>
      </div>

      {/* Overall Summary */}
      <div className="card summary-card">
        <h3>Overall Assessment</h3>
        <div className="overall-stats">
          <div className="stat-item">
            <span className="stat-label">Overall Score</span>
            <span className="stat-value">{evalResult.overall_score.toFixed(2)}/5</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Recommendation</span>
            <span className={`recommendation-badge ${getRecommendationColor(evalResult.recommendation)}`}>
              {evalResult.recommendation}
            </span>
          </div>
        </div>
        <div className="summary-text">
          <p>{evalResult.overall_summary}</p>
        </div>
      </div>

      {/* CV Analysis */}
      <div className="card">
        <div className="section-header">
          <h3>CV Analysis</h3>
          <span className="score-badge score-high">
            Match Rate: {(evalResult.cv_match_rate * 100).toFixed(0)}%
          </span>
        </div>
        <div className="feedback-section">
          <h4>Feedback</h4>
          <p>{evalResult.cv_feedback}</p>
        </div>
        <div className="details-section">
          <h4>Detailed Breakdown</h4>
          <div className="score-grid">
            <ScoreCard
              title="Technical Skills"
              score={evalResult.cv_details.technical_skills.score}
              justification={evalResult.cv_details.technical_skills.justification}
            />
            <ScoreCard
              title="Experience Level"
              score={evalResult.cv_details.experience_level.score}
              justification={evalResult.cv_details.experience_level.justification}
            />
            <ScoreCard
              title="Achievements"
              score={evalResult.cv_details.achievements.score}
              justification={evalResult.cv_details.achievements.justification}
            />
            <ScoreCard
              title="Cultural Fit"
              score={evalResult.cv_details.cultural_fit.score}
              justification={evalResult.cv_details.cultural_fit.justification}
            />
          </div>
        </div>
      </div>

      {/* Project Analysis */}
      <div className="card">
        <div className="section-header">
          <h3>Project Report Analysis</h3>
          <span className="score-badge score-medium">
            Score: {evalResult.project_score.toFixed(2)}/5
          </span>
        </div>
        <div className="feedback-section">
          <h4>Feedback</h4>
          <p>{evalResult.project_feedback}</p>
        </div>
        <div className="details-section">
          <h4>Detailed Breakdown</h4>
          <div className="score-grid">
            <ScoreCard
              title="Correctness"
              score={evalResult.project_details.correctness.score}
              justification={evalResult.project_details.correctness.justification}
            />
            <ScoreCard
              title="Code Quality"
              score={evalResult.project_details.code_quality.score}
              justification={evalResult.project_details.code_quality.justification}
            />
            <ScoreCard
              title="Resilience"
              score={evalResult.project_details.resilience.score}
              justification={evalResult.project_details.resilience.justification}
            />
            <ScoreCard
              title="Documentation"
              score={evalResult.project_details.documentation.score}
              justification={evalResult.project_details.documentation.justification}
            />
            <ScoreCard
              title="Creativity"
              score={evalResult.project_details.creativity.score}
              justification={evalResult.project_details.creativity.justification}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultsDisplay;

