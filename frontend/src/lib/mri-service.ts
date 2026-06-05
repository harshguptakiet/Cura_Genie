/**
 * MRI Service - Handles all MRI-related API calls and database operations
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export interface MRIUploadResponse {
  success: boolean;
  image_id: string;
  uploaded_to_db: boolean;
  analysis: {
    detected_regions: Array<{
      id: string;
      type: string;
      confidence: number;
      coordinates: { x: number; y: number; width: number; height: number };
      location: string;
      risk_level: string;
    }>;
    overall_confidence: number;
    overall_risk_level?: string;
    processing_time: number;
    binary_classification?: {
      predicted_label?: 'yes' | 'no';
      class_probabilities?: {
        yes_tumor?: number;
        no_tumor?: number;
      };
      classification_confidence?: number;
      class_margin?: number;
      source?: string;
    };
    report?: {
      dataset_reference?: {
        name?: string;
        yes_count?: number;
        no_count?: number;
        total?: number;
      };
      uncertainty?: {
        flagged?: boolean;
        flag_reason?: string | null;
      };
    };
    annotated_image?: string;
    visualization_type?: string;
    diagnostic_summary?: string;
    recommendations?: string[];
    requires_expert_review?: boolean;
    flag_reason?: string | null;
    mc_dropout?: {
      mean_probability?: number;
      uncertainty?: number;
      entropy?: number;
    };
    flagged_report_id?: number | null;
  };
  database_info: {
    stored: boolean;
    record_id: string;
    table: string;
    timestamp: string;
  };
  error?: string;
}

export interface MRIImageMetadata {
  id: string;
  user_id: string;
  filename: string;
  file_size: number;
  upload_date: string;
  analysis_status: 'pending' | 'processing' | 'completed' | 'error';
  analysis_results?: any;
  image_url?: string;
  thumbnail_url?: string;
}

export interface FlaggedReport {
  id: number;
  mri_analysis_id: number;
  user_id: string;
  filename?: string;
  file_path?: string;
  created_at?: string;
  flag_reason: string;
  flag_status: 'pending' | 'reviewed';
  model_name?: string;
  mc_mean_probability?: number;
  mc_uncertainty?: number;
  mc_entropy?: number;
  suggested_risk_level?: string;
  auto_summary?: string;
  detected_regions: Array<{
    id: string;
    type: string;
    confidence: number;
    coordinates: { x: number; y: number; width: number; height: number };
    location: string;
    risk_level: string;
  }>;
  annotated_image?: string;
  diagnostic?: {
    overall_risk_level?: string;
    overall_confidence?: number;
    tumor_detected?: boolean;
    num_regions_detected?: number;
    processing_time_seconds?: number;
  };
  binary_classification?: {
    predicted_label?: 'yes' | 'no';
    class_probabilities?: {
      yes_tumor?: number;
      no_tumor?: number;
    };
    classification_confidence?: number;
    class_margin?: number;
    source?: string;
  };
  report?: {
    dataset_reference?: {
      name?: string;
      yes_count?: number;
      no_count?: number;
      total?: number;
    };
    uncertainty?: {
      flagged?: boolean;
      flag_reason?: string | null;
    };
  };
  expert_review?: {
    reviewed_by_user_id?: number | null;
    reviewed_at?: string | null;
    expert_guess?: string | null;
    expert_risk_level?: string | null;
    expert_notes?: string | null;
    expert_regions?: Array<{
      id: string;
      type: string;
      confidence: number;
      coordinates: { x: number; y: number; width: number; height: number };
      location: string;
      risk_level: string;
    }>;
  };
}

const getStoredAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem('auth-storage');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.token || null;
  } catch {
    return null;
  }
};

/**
 * Upload MRI image with progress tracking
 */
export const uploadMRIImage = async (
  file: File, 
  userId: string, 
  onProgress?: (progress: number) => void
): Promise<MRIUploadResponse> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('mri_image', file);
    formData.append('user_id', userId);
    formData.append('analysis_type', 'brain_tumor_detection');
    formData.append('store_in_db', 'true');

    const xhr = new XMLHttpRequest();
    
    // Track upload progress
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    });
    
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response && response.success) {
            resolve(response);
          } else {
            throw new Error(response.error || 'Analysis failed');
          }
        } catch (e) {
          reject(new Error('Failed to parse MRI analysis response'));
        }
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });
    
    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });
    
    xhr.open('POST', `${API_BASE_URL}/api/mri/upload-and-analyze`);
    const authToken = getStoredAuthToken();
    if (authToken) {
      xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
    }
    xhr.send(formData);
  });
};

/**
 * Get all MRI images for a user from database
 */
export const getUserMRIImages = async (userId: string): Promise<MRIImageMetadata[]> => {
  try {
    const authToken = getStoredAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/mri/analysis/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch MRI images: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Failed to fetch user MRI images:', error);
    return [];
  }
};

/**
 * Get specific MRI analysis results
 */
export const getMRIAnalysis = async (imageId: string): Promise<any> => {
  try {
    const authToken = getStoredAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/mri/analysis/${imageId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch MRI analysis: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch MRI analysis:', error);
    throw error;
  }
};

/**
 * Delete MRI image and analysis from database
 */
export const deleteMRIImage = async (imageId: string): Promise<boolean> => {
  try {
    const authToken = getStoredAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/mri/${imageId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to delete MRI image:', error);
    return false;
  }
};

export const getFlaggedReports = async (status: 'pending' | 'reviewed' | 'all' = 'pending') => {
  const authToken = getStoredAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/mri/flagged-reports?status=${status}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch flagged reports: ${response.status}`);
  }

  const data = await response.json();
  return (data.items || []) as FlaggedReport[];
};

export const submitFlaggedReportReview = async (
  reportId: number,
  review: {
    expert_guess: string;
    expert_risk_level: string;
    expert_notes: string;
    expert_regions?: Array<{
      id: string;
      type: string;
      confidence: number;
      coordinates: { x: number; y: number; width: number; height: number };
      location: string;
      risk_level: string;
    }>;
  }
) => {
  const authToken = getStoredAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/mri/flagged-reports/${reportId}/review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: JSON.stringify(review),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to submit flagged review');
  }

  return response.json();
};

/**
 * Export functions for easy import
 */
export {
  uploadMRIImage as upload,
  getUserMRIImages as getUserImages,
  getMRIAnalysis as getAnalysis,
  deleteMRIImage as deleteImage,
  getFlaggedReports,
  submitFlaggedReportReview,
};
