

// BAGIAN PRODUK KLIK BUKET 

// Tunggu sampai semua elemen HTML dimuat
document.addEventListener('DOMContentLoaded', () => {
    const trigger = document.querySelector('.dropdown-trigger');
    const container = document.querySelector('.dropdown-container');
    const filterButtons = document.querySelectorAll('[data-filter]');
    const boxes = document.querySelectorAll('.products .box-container .box');

    // 1. Fungsi Klik untuk memunculkan pilihan Buket
    if (trigger) {
        trigger.onclick = (e) => {
            e.stopPropagation();
            container.classList.toggle('show');
        };
    }

    // 2. Fungsi Filter (Saring Gambar)
    filterButtons.forEach(button => {
        button.onclick = (e) => {
            e.stopPropagation();

            // Ambil target kategori (misal: 'bunga', 'uang', dll)
            let target = button.getAttribute('data-filter');

            // Saring setiap kotak produk
            boxes.forEach(box => {
                box.style.display = 'none'; // Sembunyikan dulu
                // Jika kategori cocok atau pilih 'all', tampilkan
                if (box.classList.contains(target) || target === 'all') {
                    box.style.display = 'block';
                }
            });

            // Atur tombol active
            document.querySelectorAll('.list').forEach(l => l.classList.remove('active'));
            if(button.closest('.dropdown-container')) {
                container.classList.add('active');
            } else {
                button.classList.add('active');
            }

            // Tutup menu dropdown setelah memilih
            container.classList.remove('show');
        };
    });

    // Klik di mana saja di luar menu untuk menutup dropdown
    window.onclick = () => {
        if (container) container.classList.remove('show');
    };
});