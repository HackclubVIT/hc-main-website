const API_BASE = '/api';

export function setToken(token) {
  if (token) {
    localStorage.setItem('hc_session_token', token);
  } else {
    localStorage.removeItem('hc_session_token');
  }
}

export function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('hc_session_token');
  }
  return null;
}

export function clearToken() {
  localStorage.removeItem('hc_session_token');
}

async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  let data = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (err) {
      throw new Error('Server returned an invalid response format.');
    }
  }

  if (!response.ok) {
    if (response.status === 502 || response.status === 503 || response.status === 504) {
      throw new Error('Backend server is temporarily connecting or offline. Please make sure the backend server is running on port 5000.');
    }
    throw new Error(data.error || `API Request failed with status ${response.status}`);
  }

  return data;
}

// Client API Layer Callers
export const api = {
  // Authentication
  async login(email, password, role) {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
    setToken(data.token);
    return data;
  },

  async signup(name, email, password, registerNumber, department) {
    return apiFetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, registerNumber, department }),
    });
  },

  // Forgot password — requests a 6-digit reset code sent to email
  async forgotPassword(email) {
    return apiFetch('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Verify reset code — validates the 6-digit code
  async verifyResetCode(resetCode) {
    return apiFetch('/auth/verify-reset-code', {
      method: 'POST',
      body: JSON.stringify({ resetCode }),
    });
  },

  // Reset password — submits the new password with the 6-digit reset code
  async resetPassword(resetCode, newPassword) {
    return apiFetch('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ resetCode, newPassword }),
    });
  },

  async getMe() {
    return apiFetch('/auth/me');
  },

  // Global Sync
  async getData() {
    return apiFetch('/data');
  },

  // Public Leaderboard (No auth required)
  async getPublicLeaderboard() {
    return apiFetch('/public/leaderboard');
  },

  // Projects
  async submitProject(projectData) {
    return apiFetch('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  },

  async rateProject(projectId, rating, comment) {
    return apiFetch(`/projects/${projectId}/rate`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
    });
  },

  async getProjectLeaderboard() {
    return apiFetch('/projects/leaderboard');
  },

  // Uploads
  async updateUploadStatus(uploadId, status) {
    return apiFetch(`/uploads/${uploadId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Announcements
  async createAnnouncement(announcementData) {
    return apiFetch('/announcements', {
      method: 'POST',
      body: JSON.stringify(announcementData),
    });
  },

  // User Administration
  async updateUser(userId, userData) {
    return apiFetch(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  async deleteUser(userId) {
    return apiFetch(`/users/${userId}`, {
      method: 'DELETE',
    });
  },

  // Feedback & Bug Reports
  async submitFeedback(feedbackData) {
    return apiFetch('/feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });
  },

  // Leaderboard Actions
  async refreshLeaderboard() {
    return apiFetch('/leaderboard/refresh', {
      method: 'POST',
    });
  },

  async publishWinners(winnersData) {
    return apiFetch('/leaderboard/winners', {
      method: 'POST',
      body: JSON.stringify(winnersData),
    });
  },

  // Recruitment
  async submitRecruitmentApplication(applicationData) {
    return apiFetch('/recruitment/apply', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  },

  async getRecruitmentApplications() {
    return apiFetch('/recruitment/applications');
  },

  async updateRecruitmentApplicationStatus(applicationId, status) {
    return apiFetch(`/recruitment/applications/${applicationId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  async deleteRecruitmentApplication(applicationId) {
    return apiFetch(`/recruitment/applications/${applicationId}`, {
      method: 'DELETE',
    });
  },

  async clearAllRecruitmentApplications() {
    return apiFetch('/recruitment/applications/all', {
      method: 'DELETE',
    });
  },

  // Signup Allowlist (Admin)
  async getAllowlist() {
    return apiFetch('/allowlist');
  },

  async addAllowedEmail(email) {
    return apiFetch('/allowlist', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async removeAllowedEmail(id) {
    return apiFetch(`/allowlist/${id}`, {
      method: 'DELETE',
    });
  },
};
