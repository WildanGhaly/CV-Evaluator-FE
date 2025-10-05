import { useState, useRef } from 'react';
import { uploadFiles } from '../api';
import type { UploadResponse } from '../types';
import './FileUpload.css';

interface FileUploadProps {
  onUploadSuccess: (response: UploadResponse) => void;
}

function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [projectFile, setProjectFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cvInputRef = useRef<HTMLInputElement>(null);
  const projectInputRef = useRef<HTMLInputElement>(null);

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('CV must be a PDF file');
        return;
      }
      setCvFile(file);
      setError(null);
    }
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Project Report must be a PDF file');
        return;
      }
      setProjectFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cvFile || !projectFile) {
      setError('Please select both files');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const response = await uploadFiles(cvFile, projectFile);
      onUploadSuccess(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload files. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <div className="card">
        <h2>Upload Documents</h2>
        <p className="description">
          Upload the candidate's CV and project report to begin the evaluation process.
        </p>

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="file-input-group">
            <label htmlFor="cv-upload" className="file-label">
              <span className="label-text">Candidate CV (PDF)</span>
              <span className="file-info">
                {cvFile ? cvFile.name : 'No file selected'}
              </span>
            </label>
            <input
              ref={cvInputRef}
              id="cv-upload"
              type="file"
              accept=".pdf"
              onChange={handleCvChange}
              className="file-input"
            />
            <button
              type="button"
              onClick={() => cvInputRef.current?.click()}
              className="btn btn-secondary"
            >
              Choose CV File
            </button>
          </div>

          <div className="file-input-group">
            <label htmlFor="project-upload" className="file-label">
              <span className="label-text">Project Report (PDF)</span>
              <span className="file-info">
                {projectFile ? projectFile.name : 'No file selected'}
              </span>
            </label>
            <input
              ref={projectInputRef}
              id="project-upload"
              type="file"
              accept=".pdf"
              onChange={handleProjectChange}
              className="file-input"
            />
            <button
              type="button"
              onClick={() => projectInputRef.current?.click()}
              className="btn btn-secondary"
            >
              Choose Project File
            </button>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!cvFile || !projectFile || isUploading}
            className="btn btn-primary"
          >
            {isUploading ? 'Uploading...' : 'Upload Documents'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FileUpload;

