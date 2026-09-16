/* ---------------- Product data ---------------- */
const products = [
  {
    id: 'p1',
    name: 'Golden Clover Necklace',
    price: 45000,
    bg: '#efe0c3',
    image: 'neckleace/43.jpeg',
    icon: `<path d="M60 20 C35 20 22 45 22 65 C22 92 40 108 60 108 C80 108 98 92 98 65 C98 45 85 20 60 20" fill="none" stroke="#c9a227" stroke-width="3.5"/><path d="M60 78 L48 92 L60 106 L72 92 Z" fill="#f6efe0" stroke="#c9a227" stroke-width="3"/>`
  },
  {
    id: 'p2',
    name: 'Royal Screw Bracelet',
    price: 38000,
    bg: '#e9d4c9',
    image: 'bango/7.jpeg',
    icon: `<ellipse cx="60" cy="60" rx="46" ry="26" fill="none" stroke="#c9a227" stroke-width="7"/><circle cx="20" cy="55" r="3" fill="#c9a227"/><circle cx="100" cy="55" r="3" fill="#c9a227"/>`
  },
  {
    id: 'p3',
    name: 'Elegant Halo Ring',
    price: 52000,
    bg: '#f3ecd8',
    image: 'rings/1.jpeg',
    icon: `<circle cx="60" cy="76" r="22" fill="none" stroke="#c9a227" stroke-width="6"/><path d="M48 50 L60 28 L72 50 Z" fill="#f6efe0" stroke="#c9a227" stroke-width="3"/><circle cx="60" cy="42" r="7" fill="#fff" stroke="#c9a227" stroke-width="2.5"/>`
  },
  {
    id: 'p4',
    name: 'Crystal Hoop Earrings',
    price: 28000,
    bg: '#ecdfd0',
    image: 'earrings/5.jpeg',
    icon: `<circle cx="42" cy="58" r="26" fill="none" stroke="#c9a227" stroke-width="7"/><circle cx="78" cy="58" r="26" fill="none" stroke="#c9a227" stroke-width="7"/>`
  },
  {
    id: 'p5',
    name: 'Luxury Sunglasses',
    price: 35000,
    bg: '#e7d3d9',
    image: 'image/WhatsApp Image 2026-09-09 at 7.47.33 PM (1).jpeg',
    icon: `<circle cx="40" cy="60" r="22" fill="#2a2320" opacity=".85"/><circle cx="80" cy="60" r="22" fill="#2a2320" opacity=".85"/><path d="M62 58 L58 58" stroke="#2a2320" stroke-width="4"/><path d="M18 55 L4 48" stroke="#2a2320" stroke-width="4"/><path d="M102 55 L116 48" stroke="#2a2320" stroke-width="4"/>`
  }
];

const nairaFmt = n => '\u20A6' + n.toLocaleString('en-NG');

/* ---------------- Render products ---------------- */
const grid = document.getElementById('productGrid');
grid.innerHTML = products.map(p => `
  <div class="product-card" data-id="${p.id}">
    <div class="product-thumb" style="background:${p.bg}">
      <img src="${p.image}" alt="${p.name}">
    </div>
    <div class="product-info">
      <h3>${p.name}</h3>
      <p class="product-price">${nairaFmt(p.price)}</p>
      <button class="add-cart" data-add="${p.id}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>
        Add to Cart
      </button>
    </div>
  </div>
`).join('');

/* ---------------- Cart logic ---------------- */
let cart = {}; // id -> qty

const cartCountEl = document.getElementById('cartCount');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const orderWhatsappBtn = document.getElementById('orderWhatsapp');

function renderCart(){
  const ids = Object.keys(cart);
  const totalQty = ids.reduce((s,id)=>s+cart[id],0);
  cartCountEl.textContent = totalQty;

  if(ids.length === 0){
    cartItemsEl.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    cartTotalEl.textContent = nairaFmt(0);
    orderWhatsappBtn.disabled = true;
    return;
  }

  let total = 0;
  cartItemsEl.innerHTML = ids.map(id => {
    const p = products.find(x=>x.id===id);
    const lineTotal = p.price * cart[id];
    total += lineTotal;
    return `
      <div class="cart-line">
        <span>${p.name} <span class="qty">× ${cart[id]}</span></span>
        <strong>${nairaFmt(lineTotal)}</strong>
      </div>
    `;
  }).join('');
  cartTotalEl.textContent = nairaFmt(total);
  orderWhatsappBtn.disabled = false;
}

function addToCart(id){
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
}

grid.addEventListener('click', e => {
  const addBtn = e.target.closest('[data-add]');
  if(addBtn){
    addToCart(addBtn.dataset.add);
    addBtn.classList.add('added');
    const original = addBtn.innerHTML;
    addBtn.innerHTML = 'Added ✓';
    setTimeout(()=>{ addBtn.innerHTML = original; addBtn.classList.remove('added'); }, 1000);
    openCart();
    return;
  }
});

function openCart(){
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('open');
}
function closeCartFn(){
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('open');
}
document.getElementById('cartBtn').addEventListener('click', openCart);
document.getElementById('closeCart').addEventListener('click', closeCartFn);
cartOverlay.addEventListener('click', closeCartFn);

orderWhatsappBtn.addEventListener('click', () => {
  const orderLines = Object.keys(cart).map(id => {
    const product = products.find(item => item.id === id);
    const quantity = cart[id];
    const lineTotal = product.price * quantity;
    const imageUrl = new URL(product.image, window.location.href).href;
    return `${product.name}\nQty: ${quantity}\nUnit price: ${nairaFmt(product.price)}\nAmount: ${nairaFmt(lineTotal)}\nPicture: ${imageUrl}`;
  });
  const total = Object.keys(cart).reduce((sum, id) => {
    const product = products.find(item => item.id === id);
    return sum + product.price * cart[id];
  }, 0);
  const message = `Hello Excel Fabrik, I would like to place this order:\n\n${orderLines.join('\n\n')}\n\nTotal: ${nairaFmt(total)}`;
  const whatsappUrl = `https://wa.me/2347012753562?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
});

renderCart();

/* ---------------- Hero carousel ---------------- */
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.hero-dots button');
let current = 0;
let autoTimer;

function goToSlide(i){
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = (i + slides.length) % slides.length;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
}

document.getElementById('heroNext').addEventListener('click', () => { goToSlide(current+1); restartAuto(); });
document.getElementById('heroPrev').addEventListener('click', () => { goToSlide(current-1); restartAuto(); });
dots.forEach(dot => dot.addEventListener('click', () => { goToSlide(Number(dot.dataset.slide)); restartAuto(); }));

function restartAuto(){
  clearInterval(autoTimer);
  autoTimer = setInterval(() => goToSlide(current+1), 6000);
}
restartAuto();

/* ---------------- Animated navigation ---------------- */
const navs = document.querySelectorAll('.main-nav');

function moveNavIndicator(nav, link){
  nav.style.setProperty('--indicator-left', `${link.offsetLeft}px`);
  nav.style.setProperty('--indicator-width', `${link.offsetWidth}px`);
}

function setActiveNavLink(nav, link){
  nav.querySelectorAll('a').forEach(item => item.classList.toggle('active', item === link));
  requestAnimationFrame(() => moveNavIndicator(nav, link));
}

function getCurrentNavLink(nav){
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const currentHash = window.location.hash;
  const matchingLink = [...nav.querySelectorAll('a')].find(link => {
    const target = new URL(link.href, window.location.href);
    const targetPath = target.pathname.split('/').pop() || 'index.html';
    return targetPath === currentPath && (!currentHash || target.hash === currentHash);
  });

  return matchingLink || nav.querySelector('a.active') || nav.querySelector('a');
}

navs.forEach(nav => {
  const initialLink = getCurrentNavLink(nav);
  setActiveNavLink(nav, initialLink);
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setActiveNavLink(nav, link));
  });
});

window.addEventListener('resize', () => {
  navs.forEach(nav => moveNavIndicator(nav, nav.querySelector('a.active')));
});

/* ---------------- Mobile nav ---------------- */
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
navToggle.addEventListener('click', () => {
  mainNav.classList.toggle('mobile-open');
});

/* ---------------- Newsletter ---------------- */
document.getElementById('newsletterForm').addEventListener('submit', e => {
  e.preventDefault();
  document.getElementById('newsMsg').textContent = 'Thanks for subscribing!';
  e.target.reset();
});

/* ---------------- Search (placeholder behavior) ---------------- */
document.getElementById('searchBtn').addEventListener('click', () => {
  document.getElementById('top-picks').scrollIntoView({behavior:'smooth'});
});
