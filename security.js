// VIP MARKET GLOBAL - Security & Performance Module
// Handles security measures, input sanitization, and performance optimization

// ============================================
// 1. Security Manager
// ============================================
class SecurityManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupSecurityHeaders();
    this.sanitizeAllInputs();
    this.preventXSS();
    this.setupCSP();
    this.monitorPerformance();
  }

  // ============================================
  // 2. Input Sanitization
  // ============================================
  sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  sanitizeAllInputs() {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        input.value = this.sanitizeInput(input.value);
      });
    });
  }

  // ============================================
  // 3. XSS Prevention
  // ============================================
  preventXSS() {
    // Replace innerHTML with textContent for dynamic content
    const dynamicElements = document.querySelectorAll('[data-dynamic]');
    dynamicElements.forEach(element => {
      const originalInnerHTML = element.innerHTML;
      element.textContent = originalInnerHTML;
    });

    // Monitor for inline scripts
    this.monitorScriptInjection();
  }

  monitorScriptInjection() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeName === 'SCRIPT' && !node.src) {
              console.warn('Potential XSS attack detected: inline script added');
              node.remove();
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // ============================================
  // 4. Content Security Policy
  // ============================================
  setupCSP() {
    // Check for CSP violations
    document.addEventListener('securitypolicyviolation', (e) => {
      console.warn('CSP Violation:', {
        violatedDirective: e.violatedDirective,
        blockedURI: e.blockedURI,
        sourceFile: e.sourceFile,
        lineNumber: e.lineNumber
      });
    });
  }

  // ============================================
  // 5. Error Handling
  // ============================================
  setupErrorHandling() {
    // Global error handler
    window.addEventListener('error', (e) => {
      console.error('Global error:', e.error);
      // Log to server but don't show technical details to user
      this.logErrorToServer(e.error);
    });

    // Unhandled promise rejection
    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled promise rejection:', e.reason);
      this.logErrorToServer(e.reason);
    });
  }

  logErrorToServer(error) {
    // Send error to server for logging (implement based on your backend)
    try {
      const errorData = {
        message: error.message || 'Unknown error',
        stack: error.stack || '',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Error logged:', errorData);
      }
    } catch (e) {
      console.error('Error logging failed:', e);
    }
  }

  // ============================================
  // 6. Performance Monitoring
  // ============================================
  monitorPerformance() {
    // Check if Performance API is available
    if (window.performance && window.performance.timing) {
      window.addEventListener('load', () => {
        this.logPerformanceMetrics();
      });
    }

    // Monitor Core Web Vitals
    this.monitorWebVitals();
  }

  logPerformanceMetrics() {
    const timing = window.performance.timing;
    const metrics = {
      pageLoadTime: timing.loadEventEnd - timing.navigationStart,
      domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
      resourceLoadTime: timing.responseEnd - timing.fetchStart,
      domInteractiveTime: timing.domInteractive - timing.navigationStart
    };

    console.log('Performance Metrics:', metrics);
    
    // Warn if page load is slow
    if (metrics.pageLoadTime > 3000) {
      console.warn('Page load time is slow:', metrics.pageLoadTime + 'ms');
    }
  }

  monitorWebVitals() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.log('LCP:', entry.renderTime || entry.loadTime);
          }
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.log('LCP monitoring not supported');
      }
    }
  }

  // ============================================
  // 7. API Security
  // ============================================
  validateAPIResponse(response) {
    if (!response || typeof response !== 'object') {
      throw new Error('Invalid API response');
    }
    return response;
  }

  // ============================================
  // 8. Local Storage Security
  // ============================================
  secureSetItem(key, value) {
    try {
      // Don't store sensitive data in localStorage
      if (this.isSensitiveKey(key)) {
        console.warn('Attempting to store sensitive data in localStorage');
        return false;
      }
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Error setting localStorage item:', e);
      return false;
    }
  }

  secureGetItem(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('Error getting localStorage item:', e);
      return null;
    }
  }

  isSensitiveKey(key) {
    const sensitiveKeys = ['password', 'token', 'secret', 'apikey', 'key'];
    return sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive));
  }

  // ============================================
  // 9. CSRF Protection
  // ============================================
  generateCSRFToken() {
    const token = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('csrf_token', token);
    return token;
  }

  getCSRFToken() {
    return sessionStorage.getItem('csrf_token');
  }

  validateCSRFToken(token) {
    return token === this.getCSRFToken();
  }

  // ============================================
  // 10. Rate Limiting
  // ============================================
  setupRateLimiting() {
    const requestCounts = new Map();
    const RATE_LIMIT = 10; // requests
    const TIME_WINDOW = 60000; // 1 minute

    return {
      checkLimit: (key) => {
        const now = Date.now();
        const userRequests = requestCounts.get(key) || [];
        
        // Remove old requests outside the time window
        const recentRequests = userRequests.filter(time => now - time < TIME_WINDOW);
        
        if (recentRequests.length >= RATE_LIMIT) {
          return false;
        }
        
        recentRequests.push(now);
        requestCounts.set(key, recentRequests);
        return true;
      }
    };
  }

  // ============================================
  // 11. Security Headers Check
  // ============================================
  setupSecurityHeaders() {
    // These should be set on the server, but we can check them
    const securityHeaders = [
      'X-Content-Type-Options',
      'X-Frame-Options',
      'X-XSS-Protection',
      'Strict-Transport-Security'
    ];

    // Check if headers are present (this is just for logging)
    console.log('Security headers should be configured on the server');
  }

  // ============================================
  // 12. Dependency Integrity Check
  // ============================================
  checkDependencyIntegrity() {
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
      if (!script.integrity && script.src.includes('cdn')) {
        console.warn('Script without integrity check:', script.src);
      }
    });
  }

  // ============================================
  // 13. Data Validation
  // ============================================
  validateData(data, schema) {
    for (const [key, rules] of Object.entries(schema)) {
      const value = data[key];

      if (rules.required && !value) {
        throw new Error(`${key} is required`);
      }

      if (rules.type && value && typeof value !== rules.type) {
        throw new Error(`${key} must be of type ${rules.type}`);
      }

      if (rules.minLength && value && value.length < rules.minLength) {
        throw new Error(`${key} must be at least ${rules.minLength} characters`);
      }

      if (rules.maxLength && value && value.length > rules.maxLength) {
        throw new Error(`${key} must not exceed ${rules.maxLength} characters`);
      }

      if (rules.pattern && value && !rules.pattern.test(value)) {
        throw new Error(`${key} format is invalid`);
      }
    }

    return true;
  }
}

// ============================================
// 14. Performance Optimization
// ============================================
class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.optimizeImages();
    this.minifyResources();
    this.setupLazyLoading();
    this.optimizeCSS();
  }

  // ============================================
  // 15. Image Optimization
  // ============================================
  optimizeImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      // Add loading="lazy" if not present
      if (!img.loading) {
        img.loading = 'lazy';
      }

      // Add srcset for responsive images
      if (!img.srcset) {
        img.srcset = `${img.src} 1x, ${img.src} 2x`;
      }

      // Add error handling
      img.addEventListener('error', () => {
        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ccc" width="100" height="100"/%3E%3C/svg%3E';
      });
    });
  }

  // ============================================
  // 16. Lazy Loading Setup
  // ============================================
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              observer.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        observer.observe(img);
      });
    }
  }

  // ============================================
  // 17. CSS Optimization
  // ============================================
  optimizeCSS() {
    // Remove unused CSS (this should be done at build time)
    // Here we just log a reminder
    console.log('CSS should be minified and optimized at build time');
  }

  // ============================================
  // 18. Resource Minification
  // ============================================
  minifyResources() {
    // Check if resources are minified
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
      if (script.src && !script.src.includes('.min.js')) {
        console.warn('Non-minified script detected:', script.src);
      }
    });
  }

  // ============================================
  // 19. Cache Optimization
  // ============================================
  setupCaching() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.log('Service Worker registration failed:', err);
      });
    }
  }
}

// ============================================
// 20. Initialize Security & Performance
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const securityManager = new SecurityManager();
  const performanceOptimizer = new PerformanceOptimizer();

  // Make managers globally accessible
  window.securityManager = securityManager;
  window.performanceOptimizer = performanceOptimizer;

  console.log('✓ Security and performance modules initialized');
});

// ============================================
// 21. Export for use in other files
// ============================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SecurityManager, PerformanceOptimizer };
}
