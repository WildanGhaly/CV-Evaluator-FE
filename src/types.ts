export interface UploadResponse {
  cv_id: string;
  report_id: string;
}

export interface EvaluateRequest {
  job_title: string;
  cv_id: string;
  report_id: string;
}

export interface EvaluateResponse {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
}

export interface DetailScore {
  score: number;
  justification: string;
}

export interface CVDetails {
  technical_skills: DetailScore;
  experience_level: DetailScore;
  achievements: DetailScore;
  cultural_fit: DetailScore;
}

export interface ProjectDetails {
  correctness: DetailScore;
  code_quality: DetailScore;
  resilience: DetailScore;
  documentation: DetailScore;
  creativity: DetailScore;
}

export interface EvaluationResult {
  cv_match_rate: number;
  cv_feedback: string;
  project_score: number;
  project_feedback: string;
  overall_score: number;
  overall_summary: string;
  recommendation: string;
  cv_details: CVDetails;
  project_details: ProjectDetails;
}

export interface ResultResponse {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  result?: EvaluationResult;
  error?: string;
}

