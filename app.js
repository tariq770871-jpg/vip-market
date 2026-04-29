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
    `;
    container.appendChild(item);
  });
}

// تشغيل عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", loadProducts);
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

function addToCart(id, name, price) {
  alert(`تمت إضافة ${name} بسعر ${price}$ إلى السلة`);
}

document.addEventListener("DOMContentLoaded", loadProducts);
let cart = [];

function addToCart(id, name, price) {
  cart.push({ id, name, price });
  renderCart();
}

function renderCart() {
  const cartContainer = document.getElementById('cart');
  cartContainer.innerHTML = '';

  cart.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = "cart-item";
    div.innerHTML = `
      ${item.name} - ${item.price} $
      <button onclick="removeFromCart(${index})">حذف</button>
    `;
    cartContainer.appendChild(div);
  });

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  document.getElementById('total').innerText = `الإجمالي: ${total} $`;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function checkout() {
  if (cart.length === 0) {
    alert("السلة فارغة!");
    return;
  }
  alert("تم إرسال الطلب بنجاح!");
  cart = [];
  renderCart();
}
