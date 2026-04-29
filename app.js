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
document.getElementById('addProductForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('productName').value;
  const description = document.getElementById('productDescription').value;
  const price = document.getElementById('productPrice').value;

  const { error } = await supabase.from('products').insert([
    { name, description, price }
  ]);

  if (error) {
    alert("خطأ في إضافة المنتج: " + error.message);
  } else {
    alert("تمت إضافة المنتج بنجاح ✅");
    loadProducts(); // إعادة تحميل المنتجات
  }
});
async function loadOrders() {
  const { data, error } = await supabase.from('orders').select(`
    id, status, created_at,
    products (name, price)
  `);

  if (error) {
    console.error("خطأ في جلب الطلبات:", error);
    return;
  }

  const container = document.getElementById('ordersList');
  container.innerHTML = '';

  data.forEach(order => {
    const div = document.createElement('div');
    div.className = "order-item";
    div.innerHTML = `
      <p>طلب رقم: ${order.id}</p>
      <p>المنتج: ${order.products?.name || "غير معروف"} - ${order.products?.price || 0} $</p>
      <p>الحالة: ${order.status}</p>
      <button onclick="updateOrderStatus(${order.id}, 'approved')">قبول</button>
      <button onclick="updateOrderStatus(${order.id}, 'delivered')">تسليم</button>
    `;
    container.appendChild(div);
  });
}

async function updateOrderStatus(orderId, newStatus) {
  const { error } = await supabase.from('orders')
    .update({ status: newStatus })
    .eq('id', orderId);

  if (error) {
    alert("خطأ في تحديث الحالة: " + error.message);
  } else {
    alert("تم تحديث حالة الطلب ✅");
    loadOrders();
  }
}

// تشغيل عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  loadOrders();
});
