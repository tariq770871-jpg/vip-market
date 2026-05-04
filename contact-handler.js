// VIP MARKET GLOBAL - Contact Form Handler
// Manages contact form submissions and validation

// ============================================
// 1. Contact Form Manager
// ============================================
class ContactFormManager {
  constructor() {
    this.form = null;
    this.init();
  }

  init() {
    this.setupFormListener();
  }

  // ============================================
  // 2. Form Setup
  // ============================================
  setupFormListener() {
    // Find contact form on the page
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      const isContactForm = form.querySelector('textarea') || 
                           form.getAttribute('data-form') === 'contact';
      
      if (isContactForm) {
        this.form = form;
        form.addEventListener('submit', (e) => this.handleSubmit(e));
      }
    });
  }

  // ============================================
  // 3. Form Submission Handler
  // ============================================
  async handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = this.extractFormData(form);

    // Validate form data
    const validation = this.validateFormData(formData);
    if (!validation.valid) {
      showNotification(validation.error, 'error');
      return;
    }

    // Show loading spinner
    LoadingSpinner.show();

    try {
      // Submit to Supabase
      const result = await supabaseClient.submitContactForm(
        formData.name,
        formData.email,
        formData.message,
        formData.subject || ''
      );

      LoadingSpinner.hide();

      if (result.success) {
        showNotification('تم إرسال رسالتك بنجاح. سنرد عليك قريباً.', 'success');
        form.reset();
        
        // Redirect to success page after 2 seconds
        setTimeout(() => {
          window.location.href = 'success.html';
        }, 2000);
      } else {
        showNotification(result.error, 'error');
      }
    } catch (error) {
      LoadingSpinner.hide();
      console.error('Contact form submission error:', error);
      showNotification('فشل إرسال الرسالة. يرجى المحاولة لاحقاً.', 'error');
    }
  }

  // ============================================
  // 4. Form Data Extraction
  // ============================================
  extractFormData(form) {
    const data = {
      name: form.querySelector('input[name="name"]')?.value || 
             form.querySelector('input[data-field="name"]')?.value || '',
      email: form.querySelector('input[name="email"]')?.value || 
             form.querySelector('input[type="email"]')?.value || '',
      message: form.querySelector('textarea[name="message"]')?.value || 
               form.querySelector('textarea')?.value || '',
      subject: form.querySelector('input[name="subject"]')?.value || 
               form.querySelector('input[data-field="subject"]')?.value || ''
    };

    return data;
  }

  // ============================================
  // 5. Form Validation
  // ============================================
  validateFormData(data) {
    // Validate name
    if (!data.name || data.name.trim().length < 2) {
      return { 
        valid: false, 
        error: 'الاسم يجب أن يكون حرفين على الأقل' 
      };
    }

    // Validate email
    if (!data.email || !this.validateEmail(data.email)) {
      return { 
        valid: false, 
        error: 'البريد الإلكتروني غير صحيح' 
      };
    }

    // Validate message
    if (!data.message || data.message.trim().length < 10) {
      return { 
        valid: false, 
        error: 'الرسالة يجب أن تكون 10 أحرف على الأقل' 
      };
    }

    // Validate message length
    if (data.message.length > 5000) {
      return { 
        valid: false, 
        error: 'الرسالة لا يجب أن تتجاوز 5000 حرف' 
      };
    }

    return { valid: true };
  }

  // ============================================
  // 6. Email Validation
  // ============================================
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // ============================================
  // 7. Form Reset
  // ============================================
  resetForm() {
    if (this.form) {
      this.form.reset();
    }
  }

  // ============================================
  // 8. Get Form Status
  // ============================================
  getFormStatus() {
    return {
      isValid: this.form ? this.validateFormData(this.extractFormData(this.form)).valid : false,
      hasForm: this.form !== null
    };
  }
}

// ============================================
// 9. Newsletter Subscription Handler
// ============================================
class NewsletterManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupNewsletterListener();
  }

  setupNewsletterListener() {
    const newsletterForms = document.querySelectorAll('[data-form="newsletter"]');
    newsletterForms.forEach(form => {
      form.addEventListener('submit', (e) => this.handleSubscribe(e));
    });
  }

  async handleSubscribe(e) {
    e.preventDefault();

    const form = e.target;
    const email = form.querySelector('input[type="email"]')?.value;

    if (!email || !this.validateEmail(email)) {
      showNotification('البريد الإلكتروني غير صحيح', 'error');
      return;
    }

    LoadingSpinner.show();

    try {
      // Subscribe to newsletter
      const result = await supabaseClient.insertData('newsletter_subscribers', {
        email: sanitizeInput(email),
        subscribed_at: new Date().toISOString(),
        status: 'active'
      });

      LoadingSpinner.hide();

      if (result) {
        showNotification('شكراً لاشتراكك في النشرة البريدية', 'success');
        form.reset();
      } else {
        showNotification('فشل الاشتراك. يرجى المحاولة لاحقاً.', 'error');
      }
    } catch (error) {
      LoadingSpinner.hide();
      console.error('Newsletter subscription error:', error);
      showNotification('حدث خطأ أثناء الاشتراك', 'error');
    }
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// ============================================
// 10. Initialize Managers
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const contactFormManager = new ContactFormManager();
  const newsletterManager = new NewsletterManager();

  // Make managers globally accessible
  window.contactFormManager = contactFormManager;
  window.newsletterManager = newsletterManager;

  console.log('✓ Contact form handlers initialized');
});

// ============================================
// 11. Export for use in other files
// ============================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ContactFormManager, NewsletterManager };
}
