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

  async signup(name, email, password) {
    return apiFetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  async sendOtp(email) {
    return apiFetch('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async loginOtp(email, otp, role) {
    const data = await apiFetch('/auth/login-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp, role }),
    });
    setToken(data.token);
    return data;
  },

  async forgotPassword(email) {
    return apiFetch('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async verifyResetOtp(email, otp) {
    return apiFetch('/auth/verify-reset-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },

  async resetPassword(email, otp, newPassword) {
    return apiFetch('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword }),
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
      method: 'PUT',
      body: JSON.stringify({ rating, comment }),
    });
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
