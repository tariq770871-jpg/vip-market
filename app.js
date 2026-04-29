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
