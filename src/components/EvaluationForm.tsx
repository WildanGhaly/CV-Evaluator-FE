import { useState, useEffect } from 'react';
import { evaluateDocuments, getResult } from '../api';
import type { UploadResponse, ResultResponse } from '../types';
import './EvaluationForm.css';

interface EvaluationFormProps {
  uploadedFiles: UploadResponse;
  onEvaluationComplete: (result: ResultResponse) => void;
  onReset: () => void;
}

function EvaluationForm({ uploadedFiles, onEvaluationComplete, onReset }: EvaluationFormProps) {
  const [jobTitle, setJobTitle] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [status, setStatus] = useState<'idle' | 'queued' | 'processing' | 'completed' | 'failed'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [evaluationId, setEvaluationId] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: number;

    if (evaluationId && (status === 'queued' || status === 'processing')) {
      intervalId = window.setInterval(async () => {
        try {
          const result = await getResult(evaluationId);
          setStatus(result.status);

          if (result.status === 'completed') {
            clearInterval(intervalId);
            setIsEvaluating(false);
            onEvaluationComplete(result);
          } else if (result.status === 'failed') {
            clearInterval(intervalId);
            setIsEvaluating(false);
            setError(result.error || 'Evaluation failed. Please try again.');
          }
        } catch (err) {
          console.error('Error polling result:', err);
        }
      }, 2000); // Poll every 2 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [evaluationId, status, onEvaluationComplete]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jobTitle.trim()) {
      setError('Please enter a job title');
      return;
    }

    setIsEvaluating(true);
    setError(null);

    try {
      const response = await evaluateDocuments({
        job_title: jobTitle,
        cv_id: uploadedFiles.cv_id,
        report_id: uploadedFiles.report_id,
      });

      setEvaluationId(response.id);
      setStatus(response.status);
    } catch (err) {
      setIsEvaluating(false);
      setError(err instanceof Error ? err.message : 'Failed to start evaluation. Please try again.');
    }
  };

  return (
    <div className="evaluation-form-container">
      <div className="card">
        <h2>Start Evaluation</h2>
        <p className="description">
          Documents uploaded successfully! Enter the job title to begin the AI evaluation.
        </p>

        <div className="upload-info">
          <div className="info-item">
            <span className="info-label">CV ID:</span>
            <code className="info-value">{uploadedFiles.cv_id}</code>
          </div>
          <div className="info-item">
            <span className="info-label">Report ID:</span>
            <code className="info-value">{uploadedFiles.report_id}</code>
          </div>
        </div>

        {!isEvaluating ? (
          <form onSubmit={handleSubmit} className="evaluation-form">
            <div className="form-group">
              <label htmlFor="job-title" className="form-label">
                Job Title
              </label>
              <input
                id="job-title"
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g., Backend Engineer"
                className="form-input"
              />
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <div className="button-group">
              <button type="submit" className="btn btn-primary">
                Start Evaluation
              </button>
              <button type="button" onClick={onReset} className="btn btn-secondary">
                Upload New Files
              </button>
            </div>
          </form>
        ) : (
          <div className="evaluation-status">
            <div className="status-indicator">
              <div className="spinner"></div>
              <div className="status-content">
                <h3>Evaluation in Progress</h3>
                <p className="status-text">
                  {status === 'queued' && 'Your evaluation is queued and will start shortly...'}
                  {status === 'processing' && 'AI is analyzing the documents...'}
                </p>
                {evaluationId && (
                  <code className="evaluation-id">Job ID: {evaluationId}</code>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EvaluationForm;

