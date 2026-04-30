/* =========================
   GLOBAL SECTION HANDLER
   ========================= */

document.addEventListener("DOMContentLoaded", () => {

  // ===== Smooth Scroll لكل الروابط =====
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const targetId = link.getAttribute("href");
      const target = document.querySelector(targetId);

      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }

      // إغلاق السايدبار لو مفتوح
      const sidebar = document.getElementById("sidebar");
      if (sidebar) sidebar.classList.remove("active");
    });
  });


  // ===== تفعيل أزرار الأقسام (تحويلها لتفاعل) =====
  const sections = ["home", "store", "earn", "trade", "apps", "ai", "contact", "login"];

  sections.forEach(id => {
    const section = document.getElementById(id);
    if (!section) return;

    section.addEventListener("click", () => {
      section.classList.add("active-section");

      setTimeout(() => {
        section.classList.remove("active-section");
      }, 500);
    });
  });


  // ===== متجر: أزرار الطلب =====
  document.querySelectorAll("#store .btn-gold").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const link = btn.getAttribute("href");

      if (link && link.includes("wa.me")) {
        window.open(link, "_blank");
      }
    });
  });


  // ===== التداول =====
  const tradeBtn = document.querySelector("#trade .btn-success");
  if (tradeBtn) {
    tradeBtn.addEventListener("click", () => {
      window.open("https://www.binance.com", "_blank");
    });
  }


  // ===== التطبيقات =====
  const appsSection = document.getElementById("apps");
  if (appsSection) {
    appsSection.innerHTML += `
      <div class="app-actions">
        <button class="btn btn-gold" onclick="alert('سيتم إطلاق أدوات قريباً')">
          فتح أدوات الإدارة
        </button>
      </div>
    `;
  }


  // ===== الذكاء الاصطناعي =====
  const aiSection = document.getElementById("ai");
  if (aiSection) {
    aiSection.innerHTML += `
      <div class="ai-actions">
        <button class="btn btn-success" onclick="alert('جاري تشغيل نموذج AI...')">
          تشغيل الذكاء الاصطناعي
        </button>
      </div>
    `;
  }


  // ===== تواصل =====
  const contactSection = document.getElementById("contact");
  if (contactSection) {
    contactSection.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        a.style.color = "#d4af37";
      });
    });
  }

});
/* ===== Intersection Observer (Optimized) ===== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

function initReveal() {
  const elements = document.querySelectorAll(".card, .product-card");
  elements.forEach(el => observer.observe(el));
}

/* ===== Sidebar Toggle ===== */
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;
  sidebar.classList.toggle("active");
}

/* ===== تفعيل الأزرار ===== */
document.addEventListener("DOMContentLoaded", () => {
  // تشغيل الأنيميشن للكروت
  initReveal();

  // أزرار تسجيل الدخول وإنشاء حساب
  const loginBtn = document.querySelector("#login .btn-gold");
  const signupBtn = document.querySelector("#login .btn-success");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      alert("مرحبًا عزيزنا العميل، تم تسجيل الدخول (تجريبي)");
    });
  }

  if (signupBtn) {
    signupBtn.addEventListener("click", () => {
      alert("مرحبًا عزيزنا العميل، تم إنشاء حساب جديد (تجريبي)");
    });
  }

  // أزرار واتساب في المتجر
  document.querySelectorAll("#store .btn-gold").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const link = btn.getAttribute("href");
      if (link) {
        window.open(link, "_blank");
      }
    });
  });

  // زر كلمة المرور (إظهار/إخفاء)
  document.querySelectorAll(".password-wrapper").forEach(wrapper => {
    const input = wrapper.querySelector("input");
    const eye = wrapper.querySelector(".eye");
    if (!input || !eye) return;

    eye.addEventListener("click", () => {
      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      eye.textContent = isHidden ? "🙈" : "👁";
    });
  });
});
function openModal() {
  document.getElementById("modalOverlay").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modalOverlay").classList.add("hidden");
}
const cards = document.querySelectorAll(".card");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.2
});

cards.forEach(card => {
  observer.observe(card);
});
const cards = document.querySelectorAll(".card");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");

      // إيقاف المراقبة لتحسين الأداء (مثل مواقع الشركات)
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15
});

// تشغيل
cards.forEach(card => observer.observe(card));
document.addEventListener("DOMContentLoaded", () => {

  // ================= SIDEBAR =================
  window.toggleSidebar = function () {
    document.getElementById("sidebar").classList.toggle("active");
  };

  // ================= INTERSECTION OBSERVER =================
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  // Cards + Sections animation
  document.querySelectorAll(".card, .section").forEach(el => {
    observer.observe(el);
  });

  // ================= BUTTON MICRO INTERACTIONS =================
  document.querySelectorAll("button, .card").forEach(el => {
    el.addEventListener("mouseenter", () => {
      el.style.transition = "0.2s";
    });
  });

});
