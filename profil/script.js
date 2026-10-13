let cart = [];

// =====================================================
// STUDI KASUS 4 - MANIPULASI DOM
// =====================================================

// Tombol Ubah Profil
$("#btnEditProfile").click(function () {

    $("#editName").val($("#profileName").text());
    $("#editJob").val($("#profileJob").text());
    $("#editDescription").val($("#profileDescription").text());
    $("#editLocation").val($("#profileLocation").text());
    $("#editEmail").val($("#profileEmail").text());

    $("#profileError").hide();

    $("#editModal").fadeIn(250);
});

// Simpan perubahan profil
$("#profileForm").submit(function (e) {
    e.preventDefault();

    const nama = $("#editName").val().trim();
    const job = $("#editJob").val().trim();
    const deskripsi = $("#editDescription").val().trim();
    const lokasi = $("#editLocation").val().trim();
    const email = $("#editEmail").val().trim();

    if (
        nama.length < 3 ||
        job.length < 3 ||
        deskripsi.length < 5 ||
        lokasi.length < 3 ||
        !email.includes("@")
    ) {
        $("#profileError").fadeIn();
        return;
    }

    // Manipulasi DOM dengan .text()
    $("#profileName").text(nama);
    $("#profileJob").text(job);
    $("#profileDescription").text(deskripsi);
    $("#profileLocation").text(lokasi);
    $("#profileEmail").text(email);

    $("#editModal").fadeOut(200);

    showSuccess("✓ Profil berhasil diperbarui!");
});

// =====================================================
// STUDI KASUS 4 - FORM PESAN + VALIDASI
// =====================================================

// Buka form pesan
$("#btnMessage").click(function () {
    $("#messageModal").fadeIn(250);
});

// Validasi email
function validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Submit form pesan
$("#contactForm").submit(function (e) {
    e.preventDefault();

    const nama = $("#nama").val().trim();
    const email = $("#email").val().trim();
    const pesan = $("#pesan").val().trim();

    let valid = true;

    if (nama.length < 3) {
        $("#errNama").show();
        valid = false;
    } else {
        $("#errNama").hide();
    }

    if (!validEmail(email)) {
        $("#errEmail").show();
        valid = false;
    } else {
        $("#errEmail").hide();
    }

    if (pesan.length < 10) {
        $("#errPesan").show();
        valid = false;
    } else {
        $("#errPesan").hide();
    }

    if (!valid) {
        return;
    }

    $("#messageModal").fadeOut(200);

    $("#contactForm")[0].reset();

    showSuccess("✓ Pesan berhasil dikirim!");
});

// Validasi real-time nama
$("#nama").on("input", function () {
    if ($(this).val().trim().length >= 3) {
        $("#errNama").hide();
    }
});

// Validasi real-time email
$("#email").on("input", function () {
    if (validEmail($(this).val().trim())) {
        $("#errEmail").hide();
    }
});

// Validasi real-time pesan
$("#pesan").on("input", function () {
    if ($(this).val().trim().length >= 10) {
        $("#errPesan").hide();
    }
});

// =====================================================
// FITUR TAMBAHAN - KERANJANG
// =====================================================

function rupiah(angka) {
    return "Rp " + angka.toLocaleString("id-ID");
}

// Tambah produk
$(".add-cart").click(function () {

    const id = $(this).data("id");
    const nama = $(this).data("nama");
    const harga = Number($(this).data("harga"));

    const produk = cart.find(item => item.id == id);

    if (produk) {
        produk.qty++;
    } else {
        cart.push({
            id: id,
            nama: nama,
            harga: harga,
            qty: 1
        });
    }

    updateCartUI();

    $(this).text("✓ Ditambahkan");

    setTimeout(() => {
        $(this).text("+ Tambah");
    }, 800);
});

// Update UI keranjang
function updateCartUI() {

    let html = "";
    let totalQty = 0;

    if (cart.length === 0) {

        html = `
            <div class="empty-cart">
                Keranjang masih kosong ♡
            </div>
        `;

    } else {

        cart.forEach(item => {

            totalQty += item.qty;

            html += `
                <div class="cart-row">

                    <div class="cart-row-info">
                        <h4>${item.nama}</h4>
                        <p>${rupiah(item.harga)}</p>
                    </div>

                    <div class="qty-control">
                        <button class="minus" data-id="${item.id}">
                            −
                        </button>

                        <span>${item.qty}</span>

                        <button class="plus" data-id="${item.id}">
                            +
                        </button>
                    </div>

                    <button class="remove-item" data-id="${item.id}">
                        ×
                    </button>

                </div>
            `;
        });
    }

    $("#cartItems").html(html);
    $("#cartCount").text(totalQty);

    // =================================================
    // LATIHAN 1
    // Diskon 10% jika total > Rp100.000
    // =================================================

    let totalHarga = cart.reduce(
        (sum, item) => sum + (item.harga * item.qty),
        0
    );

    let diskon = 0;
    let totalAkhir = totalHarga;

    if (totalHarga > 100000) {

        diskon = totalHarga * 0.1;
        totalAkhir = totalHarga - diskon;

    }

    $("#cartSubtotal").html(rupiah(totalHarga));
    $("#cartDiscount").html("- " + rupiah(diskon));
    $("#cartTotal").html(rupiah(totalAkhir));
}

// Tambah jumlah
$(document).on("click", ".plus", function () {

    const id = $(this).data("id");
    const item = cart.find(item => item.id == id);

    if (item) {
        item.qty++;
        updateCartUI();
    }
});

// Kurangi jumlah
$(document).on("click", ".minus", function () {

    const id = $(this).data("id");
    const item = cart.find(item => item.id == id);

    if (item) {

        item.qty--;

        if (item.qty <= 0) {
            cart = cart.filter(item => item.id != id);
        }

        updateCartUI();
    }
});

// Hapus produk
$(document).on("click", ".remove-item", function () {

    const id = $(this).data("id");

    cart = cart.filter(item => item.id != id);

    updateCartUI();
});

// Buka keranjang
$("#btnCart").click(function () {
    $("#cartModal").fadeIn(250);
});

// =====================================================
// MODAL
// =====================================================

// Tutup modal
$(".close").click(function () {
    $(this).closest(".modal").fadeOut(200);
});

// Tutup jika klik area luar
$(".modal").click(function (e) {

    if (e.target === this) {
        $(this).fadeOut(200);
    }

});

// =====================================================
// LATIHAN 3
// FORM DATA PEMBELI
// =====================================================

$("#btnCheckout").click(function () {

    if (cart.length === 0) {

        alert(
            "Keranjang masih kosong. Silakan pilih produk terlebih dahulu."
        );

        return;
    }

    $("#cartModal").fadeOut(200);
    $("#buyerModal").fadeIn(250);
});

// Validasi nomor HP
function validasiNoHP(nohp) {
    return /^[0-9]{10,15}$/.test(nohp);
}

// Submit checkout
$("#buyerForm").submit(function (e) {

    e.preventDefault();

    const nama = $("#buyerName").val().trim();
    const alamat = $("#buyerAddress").val().trim();
    const nohp = $("#buyerPhone").val().trim();

    let valid = true;

    if (nama.length < 3) {
        $("#errBuyerName").show();
        valid = false;
    } else {
        $("#errBuyerName").hide();
    }

    if (alamat.length < 5) {
        $("#errBuyerAddress").show();
        valid = false;
    } else {
        $("#errBuyerAddress").hide();
    }

    if (!validasiNoHP(nohp)) {
        $("#errBuyerPhone").show();
        valid = false;
    } else {
        $("#errBuyerPhone").hide();
    }

    if (!valid) {
        return;
    }

    let qty = cart.reduce(
        (sum, item) => sum + item.qty,
        0
    );

    let total = cart.reduce(
        (sum, item) => sum + (item.harga * item.qty),
        0
    );

    if (total > 100000) {
        total -= total * 0.1;
    }

    // =================================================
    // LATIHAN 2
    // Simpan riwayat ke localStorage
    // =================================================

    simpanRiwayat(total, qty);

    $("#buyerModal").fadeOut(200);

    showSuccess("✓ Pesanan berhasil dibuat!");

    cart = [];

    updateCartUI();

    $("#buyerForm")[0].reset();
});

// Fungsi simpan riwayat
function simpanRiwayat(total, qty) {

    const riwayat =
        JSON.parse(localStorage.getItem("riwayat")) || [];

    riwayat.push({
        tanggal: new Date().toISOString(),
        total: total,
        qty: qty
    });

    localStorage.setItem(
        "riwayat",
        JSON.stringify(riwayat)
    );
}

// =====================================================
// EFEK VISUAL JQUERY
// =====================================================

// Hover card
$(".skill-card, .product-card").hover(

    function () {
        $(this).css("transform", "translateY(-5px)");
    },

    function () {
        $(this).css("transform", "translateY(0)");
    }

);

// Fungsi notifikasi
function showSuccess(message) {

    $("#successMessage")
        .text(message)
        .stop(true, true)
        .fadeIn(300)
        .delay(2200)
        .fadeOut(400);
}

// Inisialisasi
updateCartUI();
