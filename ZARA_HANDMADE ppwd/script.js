$(document).ready(function () {

const products = [
    {id:1,name:"Mochi Bear Keychain",category:"accessories",price:35000,icon:"🧸"},
    {id:2,name:"Mini Crochet Bag",category:"accessories",price:85000,icon:"👜"},
    {id:3,name:"Floral Beaded Bracelet",category:"accessories",price:45000,icon:"📿"},
    {id:4,name:"Vanilla Cloud Candle",category:"decor",price:65000,icon:"🕯️"},
    {id:5,name:"Brownie Bear Pouch",category:"pouch",price:70000,icon:"🧸"},
    {id:6,name:"Cute Ribbon Scrunchie",category:"accessories",price:30000,icon:"🎀"},
    {id:7,name:"Mini Handmade Gift Box",category:"gift",price:95000,icon:"🎁"},
    {id:8,name:"Personalized Name Keychain",category:"gift",price:55000,icon:"🔑"}
];

let cart = JSON.parse(localStorage.getItem("zaraCart")) || [];
let activeCategory = "all";

function rupiah(number){
    return "Rp" + number.toLocaleString("id-ID");
}

function showToast(message){
    $("#toast").text(message).stop(true,true).fadeIn(250).delay(1500).fadeOut(400);
}

function renderProducts(list){
    const area = $("#productList");
    if(!area.length) return;
    area.empty();

    if(list.length === 0){
        area.html("<p>Produk tidak ditemukan ♡</p>");
        return;
    }

    $.each(list,function(_,p){
        area.append(`
            <article class="product-card">
                <div class="product-img">${p.icon}</div>
                <div class="product-content">
                    <small>${p.category}</small>
                    <h3>${p.name}</h3>
                    <p class="price">${rupiah(p.price)}</p>
                    <button class="add-btn" data-id="${p.id}">+ Tambah ke Keranjang</button>
                </div>
            </article>
        `);
    });
}

function filteredProducts(){
    const keyword = ($("#searchInput").val() || "").toLowerCase();
    return products.filter(p =>
        (activeCategory === "all" || p.category === activeCategory) &&
        p.name.toLowerCase().includes(keyword)
    );
}

function updateProducts(){
    renderProducts(filteredProducts());
}

function updateCart(){
    const area = $("#cartItems");
    if(!area.length) return;

    area.empty();
    let subtotal = 0;
    let totalQty = 0;

    if(cart.length === 0){
        area.html('<p style="text-align:center;color:#9a7865;padding:30px 0">Keranjang masih kosong ♡</p>');
    }

    $.each(cart,function(_,item){
        const product = products.find(p => p.id === item.id);
        if(!product) return;

        const itemTotal = product.price * item.qty;
        subtotal += itemTotal;
        totalQty += item.qty;

        area.append(`
            <div class="cart-item">
                <div class="mini-img">${product.icon}</div>
                <div>
                    <h4>${product.name}</h4>
                    <p>${rupiah(product.price)}</p>
                    <div class="qty">
                        <button class="minus" data-id="${product.id}">−</button>
                        <span>${item.qty}</span>
                        <button class="plus" data-id="${product.id}">+</button>
                    </div>
                </div>
                <button class="remove" data-id="${product.id}">hapus</button>
            </div>
        `);
    });

    const discount = subtotal > 100000 ? subtotal * .10 : 0;
    const total = subtotal - discount;

    $("#cartCount").text(totalQty);
    $("#subtotal").text(rupiah(subtotal));
    $("#discount").text(discount ? "-" + rupiah(discount) : rupiah(0));
    $("#total").text(rupiah(total));
    localStorage.setItem("zaraCart",JSON.stringify(cart));
}

function openCart(){
    $("#cartSidebar").addClass("open");
    $("#overlay").addClass("show");
}

function closeCart(){
    $("#cartSidebar").removeClass("open");
    $("#overlay").removeClass("show");
}

$(".filter").click(function(){
    $(".filter").removeClass("active");
    $(this).addClass("active");
    activeCategory = $(this).data("category");
    updateProducts();
});

$("#searchInput").on("input",updateProducts);

$(document).on("click",".add-btn",function(){
    const id = Number($(this).data("id"));
    const found = cart.find(item => item.id === id);

    if(found) found.qty++;
    else cart.push({id:id,qty:1});

    updateCart();
    showToast("Produk ditambahkan ke keranjang ♡");
});

$(document).on("click",".plus",function(){
    const item = cart.find(x => x.id === Number($(this).data("id")));
    if(item) item.qty++;
    updateCart();
});

$(document).on("click",".minus",function(){
    const id = Number($(this).data("id"));
    const item = cart.find(x => x.id === id);
    if(item){
        item.qty--;
        if(item.qty <= 0) cart = cart.filter(x => x.id !== id);
    }
    updateCart();
});

$(document).on("click",".remove",function(){
    const id = Number($(this).data("id"));
    cart = cart.filter(x => x.id !== id);
    updateCart();
    showToast("Produk dihapus.");
});

$("#btnCart").click(openCart);
$("#closeCart,#overlay").click(closeCart);

$("#menuBtn").click(function(){
    $("#navMenu").slideToggle(250).toggleClass("open");
});

$("#checkoutBtn").click(function(){
    if(cart.length === 0){
        showToast("Keranjang kamu masih kosong ♡");
        return;
    }
    $("#buyerModal").addClass("show");
});

$("#closeModal").click(function(){
    $("#buyerModal").removeClass("show");
});

$("#buyerForm").submit(function(e){
    e.preventDefault();

    const name = $("#buyerName").val().trim();
    const address = $("#buyerAddress").val().trim();
    const phone = $("#buyerPhone").val().trim();
    let valid = true;

    $("#nameError,#addressError,#phoneError").text("");

    if(name.length < 3){
        $("#nameError").text("Nama minimal 3 karakter.");
        valid = false;
    }
    if(address.length < 10){
        $("#addressError").text("Alamat minimal 10 karakter.");
        valid = false;
    }
    if(!/^08\d{8,11}$/.test(phone)){
        $("#phoneError").text("Nomor harus 10–13 digit dan diawali 08.");
        valid = false;
    }

    if(valid){
        const totalText = $("#total").text();
        const history = JSON.parse(localStorage.getItem("riwayatZara")) || [];
        history.push({
            tanggal:new Date().toLocaleString("id-ID"),
            nama:name,
            total:totalText,
            qty:cart.reduce((sum,item)=>sum+item.qty,0)
        });
        localStorage.setItem("riwayatZara",JSON.stringify(history));

        $("#buyerModal").removeClass("show");
        cart = [];
        updateCart();
        closeCart();
        $("#buyerForm")[0].reset();
        showToast("Pesanan berhasil dibuat! Terima kasih ♡");
    }
});

function initProfile(){
    if(!$("#profileName").length) return;

    $("#editProfile").click(function(){
        $("#profileModal").addClass("show");
    });

    $("#closeProfileModal").click(function(){
        $("#profileModal").removeClass("show");
    });

    $("#profileEffect").click(function(){
        $("#profileCard").fadeOut(250).fadeIn(500).slideUp(200).slideDown(350);
    });

    $("#profileForm").submit(function(e){
        e.preventDefault();

        $("#profileName").text($("#editName").val().trim() || "Zaharatussita");
        $("#profileRole").text($("#editRole").val().trim() || "Owner & Handmade Creator");
        $("#profileBio").text($("#editBio").val().trim() || "Handmade creator");
        $("#profileLocation").text($("#editLocation").val().trim() || "Indonesia");
        $("#profileEmail").text($("#editEmail").val().trim() || "email@example.com");

        $("#profileModal").removeClass("show");
        $("#profileToast").stop(true,true).fadeIn(250).delay(1500).fadeOut(400);
    });

    $("#contactForm").submit(function(e){
        e.preventDefault();

        let valid = true;
        const nama = $("#nama").val().trim();
        const email = $("#email").val().trim();
        const pesan = $("#pesan").val().trim();

        $("#errNama,#errEmail,#errPesan").removeClass("error");

        if(nama.length < 3){
            $("#errNama").addClass("error");
            valid = false;
        }

        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            $("#errEmail").addClass("error");
            valid = false;
        }

        if(pesan.length < 10){
            $("#errPesan").addClass("error");
            valid = false;
        }

        if(valid){
            $("#successMessage").fadeIn(250).delay(2000).fadeOut(400);
            this.reset();
        }
    });

    $("#nama,#email,#pesan").on("input",function(){
        $(this).next("small").removeClass("error");
    });
}

if($("#productList").length){
    renderProducts(products);
    updateCart();
}

initProfile();

});