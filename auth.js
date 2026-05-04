// VIP MARKET GLOBAL - Authentication Module
// Handles login, signup, and session management

// ============================================
// 1. Authentication Manager
// ============================================
class AuthManager {
  constructor() {
    this.currentUser = null;
    this.sessionKey = 'vip_market_session';
    this.init();
  }

  init() {
    this.restoreSession();
    this.setupEventListeners();
  }

  // ============================================
  // 2. Session Management
  // ============================================
  saveSession(user) {
    try {
      const session = {
        user: user,
        timestamp: Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      };
      localStorage.setItem(this.sessionKey, JSON.stringify(session));
      this.currentUser = user;
      return true;
    } catch (error) {
      console.error('Error saving session:', error);
      return false;
    }
  }

  restoreSession() {
    try {
      const sessionData = localStorage.getItem(this.sessionKey);
      if (!sessionData) return false;

      const session = JSON.parse(sessionData);
      
      // Check if session is expired
      if (Date.now() > session.expiresAt) {
        this.clearSession();
        return false;
      }

      this.currentUser = session.user;
      return true;
    } catch (error) {
      console.error('Error restoring session:', error);
      this.clearSession();
      return false;
    }
  }

  clearSession() {
    localStorage.removeItem(this.sessionKey);
    this.currentUser = null;
  }

  isAuthenticated() {
    return this.currentUser !== null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  // ============================================
  // 3. Login Handler
  // ============================================
  async handleLogin(email, password) {
    try {
      // Validate inputs
      if (!this.validateEmail(email)) {
        return { success: false, error: 'البريد الإلكتروني غير صحيح' };
      }

      if (!password || password.length < 6) {
        return { success: false, error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' };
      }

      // Show loading spinner
      LoadingSpinner.show();

      // Call Supabase login
      const result = await supabaseClient.signIn(email, password);

      LoadingSpinner.hide();

      if (result && result.access_token) {
        const user = {
          id: result.user?.id,
          email: result.user?.email,
          name: result.user?.user_metadata?.name || 'مستخدم',
          token: result.access_token
        };

        this.saveSession(user);
        return { success: true, user: user };
      } else {
        return { success: false, error: 'فشل تسجيل الدخول. تحقق من بيانات الدخول.' };
      }
    } catch (error) {
      LoadingSpinner.hide();
      console.error('Login error:', error);
      return { success: false, error: 'حدث خطأ أثناء تسجيل الدخول' };
    }
  }

  // ============================================
  // 4. Signup Handler
  // ============================================
  async handleSignup(email, password, confirmPassword, name) {
    try {
      // Validate inputs
      if (!this.validateEmail(email)) {
        return { success: false, error: 'البريد الإلكتروني غير صحيح' };
      }

      if (!this.validatePassword(password)) {
        return { 
          success: false, 
          error: 'كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير، حرف صغير، ورقم' 
        };
      }

      if (password !== confirmPassword) {
        return { success: false, error: 'كلمات المرور غير متطابقة' };
      }

      if (!name || name.trim().length < 2) {
        return { success: false, error: 'الاسم يجب أن يكون حرفين على الأقل' };
      }

      // Show loading spinner
      LoadingSpinner.show();

      // Call Supabase signup
      const result = await supabaseClient.signUp(email, password, { name: name });

      LoadingSpinner.hide();

      if (result && result.user) {
        return { 
          success: true, 
          message: 'تم إنشاء الحساب بنجاح. يرجى التحقق من بريدك الإلكتروني.' 
        };
      } else {
        return { success: false, error: 'فشل إنشاء الحساب. يرجى المحاولة لاحقاً.' };
      }
    } catch (error) {
      LoadingSpinner.hide();
      console.error('Signup error:', error);
      return { success: false, error: 'حدث خطأ أثناء إنشاء الحساب' };
    }
  }

  // ============================================
  // 5. Logout Handler
  // ============================================
  async handleLogout() {
    try {
      LoadingSpinner.show();
      await supabaseClient.signOut();
      this.clearSession();
      LoadingSpinner.hide();
      return { success: true };
    } catch (error) {
      LoadingSpinner.hide();
      console.error('Logout error:', error);
      return { success: false, error: 'فشل تسجيل الخروج' };
    }
  }

  // ============================================
  // 6. Validation Methods
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

  // ============================================
  // 7. Event Listeners Setup
  // ============================================
  setupEventListeners() {
    // Login form
    const loginForm = document.querySelector('form[data-form="login"]');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.onLoginSubmit(e));
    }

    // Signup form
    const signupForm = document.querySelector('form[data-form="signup"]');
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => this.onSignupSubmit(e));
    }

    // Logout button
    const logoutBtn = document.querySelector('[data-action="logout"]');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.onLogoutClick());
    }
  }

  async onLoginSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.querySelector('input[type="email"]')?.value;
    const password = form.querySelector('input[type="password"]')?.value;

    const result = await this.handleLogin(email, password);

    if (result.success) {
      showNotification('تم تسجيل الدخول بنجاح', 'success');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    } else {
      showNotification(result.error, 'error');
    }
  }

  async onSignupSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.querySelector('input[type="email"]')?.value;
    const password = form.querySelector('input[type="password"]')?.value;
    const confirmPassword = form.querySelector('input[data-field="confirm-password"]')?.value;
    const name = form.querySelector('input[data-field="name"]')?.value;

    const result = await this.handleSignup(email, password, confirmPassword, name);

    if (result.success) {
      showNotification(result.message, 'success');
      form.reset();
    } else {
      showNotification(result.error, 'error');
    }
  }

  async onLogoutClick() {
    const result = await this.handleLogout();
    if (result.success) {
      showNotification('تم تسجيل الخروج بنجاح', 'success');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
    } else {
      showNotification(result.error, 'error');
    }
  }

  // ============================================
  // 8. Protected Route Handler
  // ============================================
  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }

  // ============================================
  // 9. User Profile Update
  // ============================================
  async updateUserProfile(profileData) {
    try {
      if (!this.currentUser) {
        return { success: false, error: 'المستخدم غير مسجل دخول' };
      }

      LoadingSpinner.show();

      const result = await supabaseClient.updateUserProfile(
        this.currentUser.id,
        profileData
      );

      LoadingSpinner.hide();

      if (result) {
        // Update current user data
        this.currentUser = { ...this.currentUser, ...profileData };
        this.saveSession(this.currentUser);
        return { success: true, user: this.currentUser };
      } else {
        return { success: false, error: 'فشل تحديث البيانات' };
      }
    } catch (error) {
      LoadingSpinner.hide();
      console.error('Profile update error:', error);
      return { success: false, error: 'حدث خطأ أثناء تحديث البيانات' };
    }
  }
}

// ============================================
// 10. Initialize Auth Manager
// ============================================
const authManager = new AuthManager();

// ============================================
// 11. Export for use in other files
// ============================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { authManager };
}
