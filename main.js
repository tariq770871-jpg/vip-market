// VIP MARKET GLOBAL - Main JavaScript File
// Handles UI/UX interactions, sidebar, and form validations

// ============================================
// 1. Sidebar Management
// ============================================
class SidebarManager {
  constructor() {
    this.sidebar = document.querySelector('aside');
    this.overlay = null;
    this.isOpen = true;
    this.init();
  }

  init() {
    this.createOverlay();
    this.setupEventListeners();
    this.setupNavLinks();
  }

  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-30 hidden';
    this.overlay.id = 'sidebar-overlay';
    document.body.appendChild(this.overlay);
  }

  setupEventListeners() {
    // Toggle sidebar on mobile
    const menuButton = document.querySelector('[data-menu-toggle]');
    if (menuButton) {
      menuButton.addEventListener('click', () => this.toggleSidebar());
    }

    // Close sidebar when clicking overlay
    this.overlay.addEventListener('click', () => this.closeSidebar());

    // Close sidebar on link click (mobile)
    if (window.innerWidth < 768) {
      this.sidebar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => this.closeSidebar());
      });
    }
  }

  setupNavLinks() {
    const navLinks = this.sidebar.querySelectorAll('nav a');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href !== '#') {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          this.navigateTo(href);
        });
      }
    });
  }

  toggleSidebar() {
    if (this.isOpen) {
      this.closeSidebar();
    } else {
      this.openSidebar();
    }
  }

  openSidebar() {
    this.sidebar.classList.remove('-translate-x-full');
    this.overlay.classList.remove('hidden');
    this.isOpen = true;
  }

  closeSidebar() {
    this.sidebar.classList.add('-translate-x-full');
    this.overlay.classList.add('hidden');
    this.isOpen = false;
  }

  navigateTo(page) {
    // Smooth navigation
    window.location.href = page;
  }
}

// ============================================
// 2. Loading Spinner Management
// ============================================
class LoadingSpinner {
  static show() {
    let spinner = document.getElementById('loading-spinner');
    if (!spinner) {
      spinner = document.createElement('div');
      spinner.id = 'loading-spinner';
      spinner.className = 'fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 hidden';
      spinner.innerHTML = `
        <div class="flex flex-col items-center gap-4">
          <div class="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p class="text-primary font-label">جاري التحميل...</p>
        </div>
      `;
      document.body.appendChild(spinner);
    }
    spinner.classList.remove('hidden');
  }

  static hide() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
      spinner.classList.add('hidden');
    }
  }
}

// ============================================
// 3. Form Validation & Submission
// ============================================
class FormHandler {
  constructor() {
    this.forms = document.querySelectorAll('form');
    this.init();
  }

  init() {
    this.forms.forEach(form => {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    
    if (!this.validateForm(form)) {
      this.showError(form, 'يرجى ملء جميع الحقول المطلوبة بشكل صحيح');
      return;
    }

    LoadingSpinner.show();
    
    // Simulate form submission
    setTimeout(() => {
      LoadingSpinner.hide();
      this.showSuccess(form, 'تم إرسال النموذج بنجاح');
      form.reset();
    }, 1500);
  }

  validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        this.highlightError(input);
      } else {
        this.clearError(input);
      }
    });

    return isValid;
  }

  highlightError(input) {
    input.classList.add('border-status-error');
    input.classList.remove('border-outline/30');
  }

  clearError(input) {
    input.classList.remove('border-status-error');
    input.classList.add('border-outline/30');
  }

  showError(form, message) {
    let errorDiv = form.querySelector('.form-error');
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.className = 'form-error bg-status-error/20 border border-status-error text-status-error p-md rounded-lg mb-md';
      form.insertBefore(errorDiv, form.firstChild);
    }
    errorDiv.textContent = message;
  }

  showSuccess(form, message) {
    let successDiv = form.querySelector('.form-success');
    if (!successDiv) {
      successDiv = document.createElement('div');
      successDiv.className = 'form-success bg-status-success/20 border border-status-success text-status-success p-md rounded-lg mb-md';
      form.insertBefore(successDiv, form.firstChild);
    }
    successDiv.textContent = message;
    
    setTimeout(() => {
      successDiv.remove();
    }, 3000);
  }
}

// ============================================
// 4. Image Optimization
// ============================================
class ImageOptimizer {
  static init() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      // Add lazy loading
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }

      // Handle image errors
      img.addEventListener('error', () => {
        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ccc" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif" font-size="14"%3EImage not found%3C/text%3E%3C/svg%3E';
      });
    });
  }
}

// ============================================
// 5. Accessibility & Performance
// ============================================
class AccessibilityManager {
  static init() {
    // Ensure focus management
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const sidebar = document.querySelector('aside');
        if (sidebar && !sidebar.classList.contains('-translate-x-full')) {
          const manager = window.sidebarManager;
          if (manager) manager.closeSidebar();
        }
      }
    });
  }
}

// ============================================
// 6. Initialize on DOM Ready
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all managers
  window.sidebarManager = new SidebarManager();
  new FormHandler();
  ImageOptimizer.init();
  AccessibilityManager.init();

  // Add overflow-x hidden to body
  document.body.style.overflowX = 'hidden';

  console.log('✓ VIP MARKET GLOBAL - UI/UX initialized successfully');
});

// ============================================
// 7. Utility Functions
// ============================================
function sanitizeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  const bgColor = type === 'success' ? 'bg-status-success' : type === 'error' ? 'bg-status-error' : 'bg-status-info';
  notification.className = `fixed top-4 right-4 ${bgColor} text-white px-lg py-md rounded-lg shadow-lg z-50 animate-fade-in`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}
