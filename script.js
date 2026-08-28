// DATABASE PRODUK INFLORIST
const PRODUCTS = {
    p1: {
        id: 'p1',
        title: 'Buket Mawar Red Romance',
        category: 'bunga',
        categoryName: 'Buket Bunga',
        price: 150000,
        oldPrice: 180000,
        image: 'assets/buket_bunga.jpg',
        description: 'Perpaduan mawar merah segar pilihan dengan bunga baby’s breath & eucalyptus yang diwrap estetik menggunakan kain spunbond berkualitas tinggi.'
    },
    p2: {
        id: 'p2',
        title: 'Money Bouquet Elegance',
        category: 'uang',
        categoryName: 'Buket Uang',
        price: 250000,
        oldPrice: 280000,
        image: 'assets/buket_uang.jpg',
        description: 'Buket uang estetik dikombinasikan dengan dried flowers mewah. Susunan lembaran uang dijamin rapi dan tidak merusak fisik uang.'
    },
    p3: {
        id: 'p3',
        title: 'Sweet Chocolate Snack Bouquet',
        category: 'snack',
        categoryName: 'Buket Snack',
        price: 85000,
        oldPrice: 100000,
        image: 'assets/buket_snack.jpg',
        description: 'Rangkaian aneka cokelat favorit (KitKat, Pocky, Oreo, dll.) yang disusun manis dengan warna wrapper cerah. Hadiah manis untuk teman & pacar.'
    },
    p4: {
        id: 'p4',
        title: 'Buket Wisuda Teddy Sunflower',
        category: 'wisuda',
        categoryName: 'Buket Wisuda',
        price: 135000,
        oldPrice: 160000,
        image: 'assets/buket_wisuda.jpg',
        description: 'Buket bunga matahari dengan boneka wisuda teddy bear menggemaskan bertoga. Kado sempurna perayaan kelulusan tercinta.'
    },
    p5: {
        id: 'p5',
        title: 'Birthday Snack Tower Tier 3',
        category: 'tower',
        categoryName: 'Snack Tower',
        price: 175000,
        oldPrice: 200000,
        image: 'assets/snack_tower.jpg',
        description: 'Snack tower bertingkat 3 yang disusun tinggi bagai kue ulang tahun dengan topper & pita merah emas. Sangat meriah untuk pesta!'
    },
    p6: {
        id: 'p6',
        title: 'Dried Flower Wooden Frame',
        category: 'frame',
        categoryName: 'Frame Foto',
        price: 120000,
        oldPrice: 145000,
        image: 'assets/frame_foto.jpg',
        description: 'Bingkai kayu transparan estetik berisi racikan bunga kering (dried flowers) tahan bertahun-tahun serta kartu kenangan ucapan.'
    },
    p7: {
        id: 'p7',
        title: 'Buket Bunga Soft Pink Peony',
        category: 'bunga',
        categoryName: 'Buket Bunga',
        price: 110000,
        oldPrice: 130000,
        image: 'assets/buket1.jpg',
        description: 'Rangkaian bunga warna pastel pink yang lembut dan anggun. Sangat cocok untuk kado hari ibu, anniversary, atau ulang tahun.'
    },
    p8: {
        id: 'p8',
        title: 'Money Bouquet Royal Red',
        category: 'uang',
        categoryName: 'Buket Uang',
        price: 350000,
        oldPrice: 400000,
        image: 'assets/buket_uang.jpg',
        description: 'Buket uang kelas sultan dengan hiasan bunga merah mewah dan aksen pita emas gliter. Tampil super elegan & berkelas.'
    }
};

// WA STORE NUMBER
const WA_NUMBER = "6285233749306";

// STATE MANAGEMENT
let cart = JSON.parse(localStorage.getItem('inflorist_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('inflorist_wishlist')) || [];

// FORMAT RUPIAH HELPER
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
}

// INITIAL DOM LOAD
document.addEventListener('DOMContentLoaded', () => {
    updateBadges();
    renderCart();
    renderWishlist();
    initFilterAndSearch();
    initScrollReveal();
    initScrollSpy();
    initHeroPetals();
    initFallingPetals();
    initClickSparkles();
    initDrawersAndModals();
});

// BADGES COUNTER
function updateBadges() {
    const totalCartQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const cartBadges = document.querySelectorAll('.cart-badge');
    cartBadges.forEach(b => b.textContent = totalCartQty);

    const wishlistBadges = document.querySelectorAll('.wishlist-badge');
    wishlistBadges.forEach(b => b.textContent = wishlist.length);
}

// TOAST NOTIFICATION
function showToast(message, icon = 'fa-check-circle') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// CART MANAGEMENT
function addToCart(id, note = '') {
    const product = PRODUCTS[id];
    if (!product) return;

    const existingIndex = cart.findIndex(item => item.id === id);
    if (existingIndex > -1) {
        cart[existingIndex].qty += 1;
        if (note) cart[existingIndex].note = note;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            qty: 1,
            note: note
        });
    }

    localStorage.setItem('inflorist_cart', JSON.stringify(cart));
    updateBadges();
    renderCart();
    showToast(`${product.title} telah ditambahkan ke keranjang!`, 'fa-shopping-bag');
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('inflorist_cart', JSON.stringify(cart));
    updateBadges();
    renderCart();
    showToast('Produk dihapus dari keranjang', 'fa-trash');
}

function updateCartQty(id, delta) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            removeFromCart(id);
            return;
        }
        localStorage.setItem('inflorist_cart', JSON.stringify(cart));
        updateBadges();
        renderCart();
    }
}

function renderCart() {
    const cartBody = document.getElementById('cartBody');
    const cartSubtotal = document.getElementById('cartSubtotal');
    if (!cartBody || !cartSubtotal) return;

    if (cart.length === 0) {
        cartBody.innerHTML = `
            <div class="empty-drawer-msg">
                <i class="fas fa-shopping-basket"></i>
                <p>Keranjang belanja kamu masih kosong.</p>
                <a href="#products" class="btn btn-secondary" style="margin-top: 1.5rem;" onclick="closeDrawer('cartDrawer')">Pilih Buket Now</a>
            </div>
        `;
        cartSubtotal.textContent = 'Rp 0';
        return;
    }

    let subtotal = 0;
    let html = '';

    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;

        html += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <div class="price">${formatRupiah(item.price)}</div>
                    ${item.note ? `<small style="color: var(--pink); display:block; font-size:1.1rem;">Note: ${item.note}</small>` : ''}
                    <div class="cart-qty-controls">
                        <button onclick="updateCartQty('${item.id}', -1)">-</button>
                        <span>${item.qty}</span>
                        <button onclick="updateCartQty('${item.id}', 1)">+</button>
                    </div>
                </div>
                <button class="remove-item-btn" onclick="removeFromCart('${item.id}')" title="Hapus"><i class="fas fa-times"></i></button>
            </div>
        `;
    });

    cartBody.innerHTML = html;
    cartSubtotal.textContent = formatRupiah(subtotal);
}

// CHECKOUT VIA WHATSAPP
function checkoutWhatsApp() {
    if (cart.length === 0) {
        showToast('Keranjang kamu masih kosong!', 'fa-exclamation-circle');
        return;
    }

    let subtotal = 0;
    let itemsListText = '';

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        itemsListText += `${index + 1}. *${item.title}*\n   - Kuantitas: ${item.qty}x\n   - Harga: ${formatRupiah(item.price)}\n${item.note ? `   - Catatan: ${item.note}\n` : ''}`;
    });

    const waText = `Halo Admin Inflorist, saya ingin memesan buket berikut:\n\n` +
        `${itemsListText}\n` +
        `-----------------------------------------\n` +
        `*Total Pembayaran: ${formatRupiah(subtotal)}*\n\n` +
        `Mohon informasi rekening pembayaran & estimasi waktu pengerjaan. Terima kasih!`;

    const encodedText = encodeURIComponent(waText);
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodedText}`, '_blank');
}

// WISHLIST MANAGEMENT
function toggleWishlist(id) {
    const product = PRODUCTS[id];
    if (!product) return;

    const index = wishlist.indexOf(id);
    if (index > -1) {
        wishlist.splice(index, 1);
        showToast('Dihapus dari favorit', 'fa-heart-broken');
    } else {
        wishlist.push(id);
        showToast(`${product.title} disimpan ke favorit!`, 'fa-heart');
    }

    localStorage.setItem('inflorist_wishlist', JSON.stringify(wishlist));
    updateBadges();
    renderWishlist();
    updateHeartIcons();
}

function updateHeartIcons() {
    document.querySelectorAll('.box').forEach(box => {
        const id = box.getAttribute('data-id');
        const favBtn = box.querySelector('.toggle-fav-btn i');
        if (favBtn) {
            if (wishlist.includes(id)) {
                favBtn.style.color = 'var(--pink)';
            } else {
                favBtn.style.color = '';
            }
        }
    });
}

function renderWishlist() {
    const wishlistBody = document.getElementById('wishlistBody');
    if (!wishlistBody) return;

    if (wishlist.length === 0) {
        wishlistBody.innerHTML = `
            <div class="empty-drawer-msg">
                <i class="fas fa-heart-broken"></i>
                <p>Belum ada buket favorit yang disimpan.</p>
            </div>
        `;
        return;
    }

    let html = '';
    wishlist.forEach(id => {
        const product = PRODUCTS[id];
        if (product) {
            html += `
                <div class="wishlist-item">
                    <img src="${product.image}" alt="${product.title}">
                    <div class="wishlist-item-info">
                        <h4>${product.title}</h4>
                        <div class="price">${formatRupiah(product.price)}</div>
                        <button class="btn btn-secondary" style="padding: 0.5rem 1.2rem; font-size: 1.2rem; margin-top: 0.5rem;" onclick="addToCart('${product.id}')">
                            + Keranjang
                        </button>
                    </div>
                    <button class="remove-item-btn" onclick="toggleWishlist('${product.id}')" title="Hapus"><i class="fas fa-trash"></i></button>
                </div>
            `;
        }
    });

    wishlistBody.innerHTML = html;
    updateHeartIcons();
}

// QUICK VIEW MODAL
function openQuickView(id) {
    const product = PRODUCTS[id];
    if (!product) return;

    const quickViewContent = document.getElementById('quickViewContent');
    if (!quickViewContent) return;

    quickViewContent.innerHTML = `
        <div class="quick-view-img">
            <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="quick-view-info">
            <span class="category-tag">${product.categoryName}</span>
            <h3>${product.title}</h3>
            <div class="price">${formatRupiah(product.price)} <span style="text-decoration: line-through; font-size:1.4rem; color:#999; margin-left:1rem;">${formatRupiah(product.oldPrice)}</span></div>
            <p>${product.description}</p>
            
            <label style="font-size: 1.3rem; font-weight:600; margin-bottom: 0.5rem; display:block;">Catatan Khusus (Warna pita / ucapan):</label>
            <input type="text" id="quickViewNote" class="quick-view-note-input" placeholder="Contoh: Pita Merah, ucapan 'Happy Birthday'">

            <div style="display: flex; gap: 1rem;">
                <button class="btn" style="flex:1;" onclick="submitQuickViewCart('${product.id}')"><i class="fas fa-shopping-bag"></i> Tambah Ke Keranjang</button>
                <button class="btn btn-secondary" onclick="toggleWishlist('${product.id}')"><i class="fas fa-heart"></i></button>
            </div>
        </div>
    `;

    openModal('quickViewModal');
}

function submitQuickViewCart(id) {
    const noteInput = document.getElementById('quickViewNote');
    const note = noteInput ? noteInput.value.trim() : '';
    addToCart(id, note);
    closeModal('quickViewModal');
}

// DRAWER & MODAL TOGGLERS
function initDrawersAndModals() {
    const cartIconBtn = document.getElementById('cartIconBtn');
    const wishlistIconBtn = document.getElementById('wishlistIconBtn');
    const openCartFooterLink = document.getElementById('openCartFooterLink');
    const openWishlistFooterLink = document.getElementById('openWishlistFooterLink');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const closeWishlistBtn = document.getElementById('closeWishlistBtn');
    const cartOverlay = document.getElementById('cartOverlay');
    const wishlistOverlay = document.getElementById('wishlistOverlay');

    if (cartIconBtn) cartIconBtn.onclick = () => openDrawer('cartDrawer');
    if (openCartFooterLink) openCartFooterLink.onclick = (e) => { e.preventDefault(); openDrawer('cartDrawer'); };
    if (wishlistIconBtn) wishlistIconBtn.onclick = () => openDrawer('wishlistDrawer');
    if (openWishlistFooterLink) openWishlistFooterLink.onclick = (e) => { e.preventDefault(); openDrawer('wishlistDrawer'); };

    if (closeCartBtn) closeCartBtn.onclick = () => closeDrawer('cartDrawer');
    if (closeWishlistBtn) closeWishlistBtn.onclick = () => closeDrawer('wishlistDrawer');

    if (cartOverlay) cartOverlay.onclick = () => closeDrawer('cartDrawer');
    if (wishlistOverlay) wishlistOverlay.onclick = () => closeDrawer('wishlistDrawer');

    const customOrderTriggerBtn = document.getElementById('customOrderTriggerBtn');
    if (customOrderTriggerBtn) {
        customOrderTriggerBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            openModal('customOrderModal');
        };
    }

    document.addEventListener('click', (e) => {
        const target = e.target.closest('.open-custom-modal');
        if (target) {
            e.preventDefault();
            openModal('customOrderModal');
        }
    });
}

function openDrawer(drawerId) {
    const drawer = document.getElementById(drawerId);
    const overlayId = drawerId === 'cartDrawer' ? 'cartOverlay' : 'wishlistOverlay';
    const overlay = document.getElementById(overlayId);

    if (drawer && overlay) {
        overlay.classList.add('show');
        drawer.classList.add('show');
    }
}

function closeDrawer(drawerId) {
    const drawer = document.getElementById(drawerId);
    const overlayId = drawerId === 'cartDrawer' ? 'cartOverlay' : 'wishlistOverlay';
    const overlay = document.getElementById(overlayId);

    if (drawer && overlay) {
        overlay.classList.remove('show');
        drawer.classList.remove('show');
    }
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('show');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('show');
}

// CUSTOM ORDER & CONTACT FORM HANDLERS
function handleCustomOrderSubmit(e) {
    e.preventDefault();
    const type = document.getElementById('customType').value;
    const budget = document.getElementById('customBudget').value;
    const color = document.getElementById('customColor').value;
    const message = document.getElementById('customMessage').value;
    const date = document.getElementById('customDate').value;

    const waText = `Halo Admin Inflorist, saya ingin *Pesan Custom Buket*:\n\n` +
        `• Jenis Buket: ${type}\n` +
        `• Estimasi Budget: ${budget}\n` +
        `• Tema Warna Wrapping: ${color}\n` +
        `• Isi Ucapan: "${message || '-'}"\n` +
        `• Tanggal Pengiriman: ${date}\n\n` +
        `Mohon diproses konsultasi desain & ketersediaan stoknya. Terima kasih!`;

    const encodedText = encodeURIComponent(waText);
    closeModal('customOrderModal');
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodedText}`, '_blank');
}

function handleContactSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail') ? document.getElementById('contactEmail').value : '';
    const phone = document.getElementById('contactPhone').value;
    const message = document.getElementById('contactMessage').value;
    const topicRadio = document.querySelector('input[name="contactTopic"]:checked');
    const topic = topicRadio ? topicRadio.value : 'Tanya Stok & Harga';

    const waText = `Halo Admin Inflorist, perkenalkan saya:\n` +
        `• Nama: ${name}\n` +
        `• Topik: *${topic}*\n` +
        `${email ? `• Email: ${email}\n` : ''}` +
        `• No HP/WA: ${phone}\n\n` +
        `Pesan/Pertanyaan:\n"${message}"`;

    const encodedText = encodeURIComponent(waText);
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodedText}`, '_blank');
}

// FILTER & SEARCH PRODUCTS
function initFilterAndSearch() {
    const filterButtons = document.querySelectorAll('.product-filter .list');
    const searchInput = document.getElementById('productSearch');
    const boxes = document.querySelectorAll('.products .box-container .box');

    function applyFilterAndSearch() {
        const activeFilterBtn = document.querySelector('.product-filter .list.active');
        const filterCategory = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
        const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';

        boxes.forEach(box => {
            const category = box.getAttribute('data-category');
            const title = box.querySelector('h3').textContent.toLowerCase();
            const categoryTag = box.querySelector('.category-tag').textContent.toLowerCase();

            const matchesCategory = filterCategory === 'all' || category === filterCategory;
            const matchesSearch = searchQuery === '' || title.includes(searchQuery) || categoryTag.includes(searchQuery);

            if (matchesCategory && matchesSearch) {
                box.style.display = 'flex';
                box.classList.add('reveal', 'active');
            } else {
                box.style.display = 'none';
            }
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('open-custom-modal')) return;
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyFilterAndSearch();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', applyFilterAndSearch);
    }
}

function filterProducts(category) {
    const filterBtn = document.querySelector(`.product-filter .list[data-filter="${category}"]`);
    if (filterBtn) {
        filterBtn.click();
    }
}

// SCROLL REVEAL INTERSECTION OBSERVER
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(r => observer.observe(r));
}

// HERO FLOATING PETALS ANIMATION
function initHeroPetals() {
    const homeSection = document.querySelector('.home');
    if (!homeSection) return;

    for (let i = 0; i < 8; i++) {
        const petal = document.createElement('div');
        petal.className = 'floating-petal';
        petal.innerHTML = `<i class="fas fa-seedling" style="color: var(--pink); font-size: ${1.5 + Math.random()}rem;"></i>`;
        petal.style.left = `${Math.random() * 90}%`;
        petal.style.top = `${Math.random() * 80}%`;
        petal.style.animationDuration = `${6 + Math.random() * 6}s`;
        petal.style.animationDelay = `${Math.random() * 4}s`;
        homeSection.appendChild(petal);
    }
}

// CONTINUOUS FALLING PETALS ANIMATION
function initFallingPetals() {
    const container = document.getElementById('petalsFallingContainer');
    if (!container) return;

    const icons = ['fa-spa', 'fa-leaf', 'fa-heart', 'fa-seedling'];
    const colors = ['#e84393', '#ff758c', '#fd79a8', '#fab1a0'];

    function createPetal() {
        const petal = document.createElement('div');
        petal.className = 'falling-petal-item';
        
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const randomSize = 1.2 + Math.random() * 1.5;
        const randomLeft = Math.random() * 95;
        const randomDuration = 8 + Math.random() * 8;

        petal.innerHTML = `<i class="fas ${randomIcon}" style="color:${randomColor}; font-size:${randomSize}rem;"></i>`;
        petal.style.left = `${randomLeft}%`;
        petal.style.animationDuration = `${randomDuration}s`;

        container.appendChild(petal);

        setTimeout(() => {
            petal.remove();
        }, randomDuration * 1000);
    }

    // Spawn falling petals periodically
    setInterval(createPetal, 1400);
}

// INTERACTIVE CLICK BURST SPARKLES
function initClickSparkles() {
    document.addEventListener('click', (e) => {
        // Spawn sparkle particles at click coordinate
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'sparkle-particle';
            particle.innerHTML = `<i class="fas fa-heart"></i>`;
            particle.style.left = `${e.clientX}px`;
            particle.style.top = `${e.clientY}px`;

            const angle = Math.random() * Math.PI * 2;
            const distance = 40 + Math.random() * 50;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;

            particle.style.setProperty('--dx', `${dx}px`);
            particle.style.setProperty('--dy', `${dy}px`);

            document.body.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 800);
        }
    });
}

// SCROLL SPY & AUTOMATIC ACTIVE NAV UNDERLINE MOVER
function initScrollSpy() {
    const navLinks = document.querySelectorAll('header .navbar a');
    const sections = document.querySelectorAll('section[id]');

    function updateActiveLink() {
        let currentSectionId = 'home';
        const scrollPosition = window.scrollY + 220;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    // Run on scroll & window resize
    window.addEventListener('scroll', updateActiveLink);
    window.addEventListener('resize', updateActiveLink);
    updateActiveLink();

    // Click handling for smooth activation & mobile menu close
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Close mobile menu if toggled
            const toggler = document.getElementById('toggler');
            if (toggler) toggler.checked = false;
        });
    });
}