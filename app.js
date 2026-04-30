let cart = [];

// تحميل المنتجات
async function loadProducts() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    console.error("خطأ في جلب البيانات:", error);
    return;
  }

  const container = document.getElementById('products');
  container.innerHTML = '';

  data.forEach(product => {
    const item = document.createElement('div');
    item.className = "product-card";
    item.innerHTML = `
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <strong>${product.price} $</strong>
      <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})">أضف إلى السلة</button>
    `;
    container.appendChild(item);
  });
}

// إضافة للسلة
function addToCart(id, name, price) {
  cart.push({ id, name, price });
  renderCart();
}

// عرض السلة
function renderCart() {
  const cartContainer = document.getElementById('cart');
  cartContainer.innerHTML = '';

  cart.forEach((item, index) => {
    const div = document.createElement('div');
    div.innerHTML = `
      ${item.name} - ${item.price} $
      <button onclick="removeFromCart(${index})">حذف</button>
    `;
    cartContainer.appendChild(div);
  });

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  document.getElementById('total').innerText = `الإجمالي: ${total} $`;
}

// حذف من السلة
function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

// إتمام الطلب
async function checkout() {
  if (cart.length === 0) {
    alert("السلة فارغة!");
    return;
  }

  const userEmail = document.getElementById("email").value;
  const userPhone = prompt("أدخل رقم هاتفك للتأكيد عبر واتساب:");

  for (const item of cart) {
    await fetch("https://<project>.supabase.co/functions/v1/dynamic-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userEmail,
        userPhone,
        productId: item.id
      })
    });
  }

  alert("تم إرسال الطلبات بنجاح ✅ سيتم التواصل معك عبر واتساب لإتمام الدفع.");
  cart = [];
  renderCart();
}

// زر العين لرؤية كلمة السر
document.getElementById("togglePassword").addEventListener("click", () => {
  const passwordInput = document.getElementById("password");
  const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
});

// زر نسيت كلمة السر
document.getElementById("forgotPassword").addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  if (!email) {
    alert("أدخل بريدك الإلكتروني أولاً!");
    return;
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) {
    alert("خطأ في إرسال رابط إعادة
