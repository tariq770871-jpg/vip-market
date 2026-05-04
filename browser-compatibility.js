// VIP MARKET GLOBAL - Browser Compatibility Module
// Ensures compatibility across different browsers

// ============================================
// 1. Browser Detection
// ============================================
class BrowserDetector {
  static detect() {
    const ua = navigator.userAgent;
    
    return {
      isChrome: /Chrome/.test(ua) && /Google Inc/.test(navigator.vendor),
      isFirefox: /Firefox/.test(ua),
      isSafari: /Safari/.test(ua) && !/Chrome/.test(ua),
      isEdge: /Edg/.test(ua),
      isIE: /Trident/.test(ua),
      isMobile: /Mobile|Android|iPhone/.test(ua),
      isTablet: /iPad|Android/.test(ua),
      version: this.getVersion(ua)
    };
  }

  static getVersion(ua) {
    const match = ua.match(/(?:Chrome|Firefox|Safari|Edg)\/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  static getInfo() {
    const browser = this.detect();
    return {
      name: this.getName(browser),
      version: browser.version,
      isMobile: browser.isMobile,
      isTablet: browser.isTablet
    };
  }

  static getName(browser) {
    if (browser.isChrome) return 'Chrome';
    if (browser.isFirefox) return 'Firefox';
    if (browser.isSafari) return 'Safari';
    if (browser.isEdge) return 'Edge';
    if (browser.isIE) return 'Internet Explorer';
    return 'Unknown';
  }
}

// ============================================
// 2. Feature Detection
// ============================================
class FeatureDetector {
  static features = {
    localStorage: typeof localStorage !== 'undefined',
    sessionStorage: typeof sessionStorage !== 'undefined',
    indexedDB: typeof indexedDB !== 'undefined',
    serviceWorker: 'serviceWorker' in navigator,
    fetch: typeof fetch !== 'undefined',
    promise: typeof Promise !== 'undefined',
    async: this.supportsAsync(),
    arrow: this.supportsArrow(),
    spread: this.supportsSpread(),
    destructuring: this.supportsDestructuring(),
    template: this.supportsTemplate(),
    classes: this.supportsClasses(),
    modules: this.supportsModules(),
    webWorkers: typeof Worker !== 'undefined',
    webSockets: typeof WebSocket !== 'undefined',
    geolocation: 'geolocation' in navigator,
    notifications: 'Notification' in window,
    vibration: 'vibrate' in navigator,
    camera: 'getUserMedia' in navigator.mediaDevices || false,
    microphone: 'getUserMedia' in navigator.mediaDevices || false,
    clipboard: 'clipboard' in navigator,
    intersectionObserver: 'IntersectionObserver' in window,
    mutationObserver: 'MutationObserver' in window,
    resizeObserver: 'ResizeObserver' in window,
    performanceAPI: 'performance' in window,
    webGL: this.supportsWebGL(),
    canvas: this.supportsCanvas(),
    svg: this.supportsSVG(),
    video: this.supportsVideo(),
    audio: this.supportsAudio()
  };

  static supportsAsync() {
    try {
      eval('(async () => {})');
      return true;
    } catch (e) {
      return false;
    }
  }

  static supportsArrow() {
    try {
      eval('() => {}');
      return true;
    } catch (e) {
      return false;
    }
  }

  static supportsSpread() {
    try {
      eval('[...[1,2,3]]');
      return true;
    } catch (e) {
      return false;
    }
  }

  static supportsDestructuring() {
    try {
      eval('const {a} = {a: 1}');
      return true;
    } catch (e) {
      return false;
    }
  }

  static supportsTemplate() {
    try {
      eval('`template`');
      return true;
    } catch (e) {
      return false;
    }
  }

  static supportsClasses() {
    try {
      eval('class A {}');
      return true;
    } catch (e) {
      return false;
    }
  }

  static supportsModules() {
    return 'noModule' in document.createElement('script');
  }

  static supportsWebGL() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  static supportsCanvas() {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext && canvas.getContext('2d'));
  }

  static supportsSVG() {
    return !!document.createElementNS && 
           !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;
  }

  static supportsVideo() {
    const video = document.createElement('video');
    return !!(video.canPlayType);
  }

  static supportsAudio() {
    const audio = document.createElement('audio');
    return !!(audio.canPlayType);
  }

  static getReport() {
    return this.features;
  }

  static checkFeature(feature) {
    return this.features[feature] || false;
  }
}

// ============================================
// 3. Polyfills
// ============================================
class PolyfillManager {
  static apply() {
    this.polyfillFetch();
    this.polyfillPromise();
    this.polyfillObjectAssign();
    this.polyfillArrayIncludes();
    this.polyfillStringIncludes();
    this.polyfillStartsWith();
    this.polyfillEndsWith();
    this.polyfillPadStart();
    this.polyfillPadEnd();
  }

  static polyfillFetch() {
    if (typeof fetch === 'undefined') {
      window.fetch = function(url, options) {
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open(options?.method || 'GET', url);
          
          if (options?.headers) {
            Object.keys(options.headers).forEach(key => {
              xhr.setRequestHeader(key, options.headers[key]);
            });
          }

          xhr.onload = () => {
            resolve({
              status: xhr.status,
              ok: xhr.status >= 200 && xhr.status < 300,
              json: () => Promise.resolve(JSON.parse(xhr.responseText)),
              text: () => Promise.resolve(xhr.responseText)
            });
          };

          xhr.onerror = () => reject(new Error('Network error'));
          xhr.send(options?.body);
        });
      };
    }
  }

  static polyfillPromise() {
    if (typeof Promise === 'undefined') {
      console.warn('Promise not supported. Consider upgrading your browser.');
    }
  }

  static polyfillObjectAssign() {
    if (typeof Object.assign === 'undefined') {
      Object.assign = function(target, ...sources) {
        sources.forEach(source => {
          Object.keys(source).forEach(key => {
            target[key] = source[key];
          });
        });
        return target;
      };
    }
  }

  static polyfillArrayIncludes() {
    if (!Array.prototype.includes) {
      Array.prototype.includes = function(searchElement) {
        return this.indexOf(searchElement) !== -1;
      };
    }
  }

  static polyfillStringIncludes() {
    if (!String.prototype.includes) {
      String.prototype.includes = function(search) {
        return this.indexOf(search) !== -1;
      };
    }
  }

  static polyfillStartsWith() {
    if (!String.prototype.startsWith) {
      String.prototype.startsWith = function(search) {
        return this.substr(0, search.length) === search;
      };
    }
  }

  static polyfillEndsWith() {
    if (!String.prototype.endsWith) {
      String.prototype.endsWith = function(search) {
        return this.substr(-search.length) === search;
      };
    }
  }

  static polyfillPadStart() {
    if (!String.prototype.padStart) {
      String.prototype.padStart = function(length, fill) {
        const str = String(this);
        if (str.length >= length) return str;
        return String(fill).repeat(length - str.length) + str;
      };
    }
  }

  static polyfillPadEnd() {
    if (!String.prototype.padEnd) {
      String.prototype.padEnd = function(length, fill) {
        const str = String(this);
        if (str.length >= length) return str;
        return str + String(fill).repeat(length - str.length);
      };
    }
  }
}

// ============================================
// 4. Compatibility Warnings
// ============================================
class CompatibilityWarner {
  static checkCompatibility() {
    const browser = BrowserDetector.detect();
    const warnings = [];

    // Check for outdated browsers
    if (browser.isIE) {
      warnings.push('Internet Explorer is not fully supported. Please upgrade to a modern browser.');
    }

    if (browser.isChrome && browser.version < 90) {
      warnings.push('Your Chrome version is outdated. Please update for better performance.');
    }

    if (browser.isFirefox && browser.version < 88) {
      warnings.push('Your Firefox version is outdated. Please update for better performance.');
    }

    if (browser.isSafari && browser.version < 14) {
      warnings.push('Your Safari version is outdated. Please update for better performance.');
    }

    // Check for missing features
    const features = FeatureDetector.getReport();
    if (!features.localStorage) {
      warnings.push('Local storage is not available. Some features may not work properly.');
    }

    if (!features.fetch) {
      warnings.push('Fetch API is not available. The application may not work properly.');
    }

    // Log warnings
    warnings.forEach(warning => {
      console.warn('⚠️ Compatibility Warning:', warning);
    });

    return warnings;
  }

  static displayWarnings() {
    const warnings = this.checkCompatibility();
    if (warnings.length > 0) {
      const message = warnings.join('\n\n');
      console.log('%c⚠️ Browser Compatibility Issues', 'color: orange; font-weight: bold;');
      console.log(message);
    }
  }
}

// ============================================
// 5. Initialize Compatibility Module
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Apply polyfills
  PolyfillManager.apply();

  // Check compatibility
  CompatibilityWarner.displayWarnings();

  // Log browser info
  const browserInfo = BrowserDetector.getInfo();
  console.log('🌐 Browser Info:', browserInfo);

  // Make detectors globally accessible
  window.BrowserDetector = BrowserDetector;
  window.FeatureDetector = FeatureDetector;
  window.PolyfillManager = PolyfillManager;
  window.CompatibilityWarner = CompatibilityWarner;

  console.log('✓ Browser compatibility module initialized');
});

// ============================================
// 6. Export for use in other files
// ============================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    BrowserDetector,
    FeatureDetector,
    PolyfillManager,
    CompatibilityWarner
  };
}
