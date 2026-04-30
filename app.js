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
