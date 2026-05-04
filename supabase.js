// VIP MARKET GLOBAL - Supabase Configuration
// This file handles all database connections and API calls

// ============================================
// 1. Supabase Configuration
// ============================================
const SUPABASE_URL = 'https://vclsqisvkyalshvpsqkd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjbHNxaXN2a3lhbHNodnBzcWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU0NjIzNzYsImV4cCI6MjAzMTAzODM3Nn0.V9u6E4Qk_N-S6996pYJ0u1V4-u5U-l_Y88P8w1M_U0E';

// ============================================
// 2. Supabase Client Class
// ============================================
class SupabaseClient {
  constructor(url, key) {
    this.url = url;
    this.key = key;
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
      'apikey': key
    };
  }

  // Generic fetch method
  async request(method, path, body = null) {
    try {
      const options = {
        method,
        headers: this.headers
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${this.url}${path}`, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Supabase request error:', error);
      throw error;
    }
  }

  // ============================================
  // 3. Authentication Methods
  // ============================================
  async signUp(email, password, userData = {}) {
    const body = {
      email,
      password,
      data: userData
    };
    return this.request('POST', '/auth/v1/signup', body);
  }

  async signIn(email, password) {
    const body = {
      email,
      password
    };
    return this.request('POST', '/auth/v1/token?grant_type=password', body);
  }

  async signOut() {
    // Clear local session
    localStorage.removeItem('supabase_session');
    return true;
  }

  async getCurrentUser() {
    const session = localStorage.getItem('supabase_session');
    if (!session) return null;
    
    try {
      return JSON.parse(session);
    } catch (e) {
      return null;
    }
  }

  // ============================================
  // 4. Database Methods
  // ============================================
  async insertData(table, data) {
    return this.request('POST', `/rest/v1/${table}`, data);
  }

  async getData(table, filters = {}) {
    let query = `/rest/v1/${table}`;
    
    if (Object.keys(filters).length > 0) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(filters)) {
        params.append(key, `eq.${value}`);
      }
      query += `?${params.toString()}`;
    }

    return this.request('GET', query);
  }

  async updateData(table, id, data) {
    return this.request('PATCH', `/rest/v1/${table}?id=eq.${id}`, data);
  }

  async deleteData(table, id) {
    return this.request('DELETE', `/rest/v1/${table}?id=eq.${id}`);
  }

  // ============================================
  // 5. Contact Form Submission
  // ============================================
  async submitContactForm(name, email, message, subject = '') {
    try {
      const data = {
        name: sanitizeInput(name),
        email: sanitizeInput(email),
        message: sanitizeInput(message),
        subject: sanitizeInput(subject),
        created_at: new Date().toISOString(),
        status: 'new'
      };

      const result = await this.insertData('contact_requests', data);
      return { success: true, data: result };
    } catch (error) {
      console.error('Contact form submission error:', error);
      return { success: false, error: 'فشل إرسال الرسالة. يرجى المحاولة لاحقاً.' };
    }
  }

  // ============================================
  // 6. User Profile Methods
  // ============================================
  async getUserProfile(userId) {
    try {
      const result = await this.getData('user_profiles', { id: userId });
      return result[0] || null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  async updateUserProfile(userId, profileData) {
    try {
      return await this.updateData('user_profiles', userId, profileData);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // ============================================
  // 7. Validation Methods
  // ============================================
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  }
}

// ============================================
// 8. Utility Functions
// ============================================
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

function validateFormData(data, schema) {
  for (const [key, rules] of Object.entries(schema)) {
    const value = data[key];

    if (rules.required && !value) {
      return { valid: false, error: `${key} مطلوب` };
    }

    if (rules.type === 'email' && value && !supabaseClient.validateEmail(value)) {
      return { valid: false, error: 'البريد الإلكتروني غير صحيح' };
    }

    if (rules.minLength && value && value.length < rules.minLength) {
      return { valid: false, error: `${key} يجب أن يكون ${rules.minLength} أحرف على الأقل` };
    }

    if (rules.maxLength && value && value.length > rules.maxLength) {
      return { valid: false, error: `${key} يجب أن يكون ${rules.maxLength} أحرف على الأكثر` };
    }
  }

  return { valid: true };
}

// ============================================
// 9. Initialize Supabase Client
// ============================================
const supabaseClient = new SupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// 10. Export for use in other files
// ============================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { supabaseClient, sanitizeInput, validateFormData };
}
