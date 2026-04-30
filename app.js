/* ===== Intersection Observer (Optimized) ===== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");

      // تحسين الأداء: إيقاف المراقبة بعد الظهور
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15
});

/* مراقبة العناصر */
function initReveal() {
  const elements = document.querySelectorAll(".card, .product-card");

  elements.forEach(el => observer.observe(el));
}

/* ===== Sidebar Toggle (Safer) ===== */
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;

  sidebar.classList.toggle("active");
}

/* ===== Password Toggle (Flexible + Multi-safe) ===== */
document.addEventListener("DOMContentLoaded", () => {

  initReveal();

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
