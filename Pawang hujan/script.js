jQuery.fx.off = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

$(function () {
    const rupiah = n => 'Rp ' + Math.round(n).toLocaleString('id-ID');
    const acak = (a, b) => Math.random() * (b - a) + a;

    function toast(pesan, tipe) {
        $('#toast').stop(true, true).removeClass('success error').addClass(tipe)
            .text(pesan).fadeIn(250).delay(2800).fadeOut(400);
    }
    function kilat() { $('#flash').stop(true, true).fadeIn(60).fadeOut(180).fadeIn(60).fadeOut(350); }

    // ===== 1. MODE GELAP / TERANG (event click + localStorage) =====
    function setTema(t) {
        $('html').attr('data-theme', t);
        $('#themeBtn').text(t === 'dark' ? '☀️' : '🌙');
        try { localStorage.setItem('tema', t); } catch (e) {}
    }
    let tersimpan = 'light';
    try { tersimpan = localStorage.getItem('tema') || 'light'; } catch (e) {}
    setTema(tersimpan);
    $('#themeBtn').on('click', function () {
        const baru = $('html').attr('data-theme') === 'dark' ? 'light' : 'dark';
        setTema(baru);
        if (baru === 'dark') kilat();
    });

    // ===== 2. NAVBAR: dropdown slideDown/slideUp + hamburger slideToggle =====
    $('.dropdown')
        .on('mouseenter', function () { $(this).find('.dropdown-menu').stop(true, true).slideDown(200); })
        .on('mouseleave', function () { $(this).find('.dropdown-menu').stop(true, true).slideUp(200); });
    $('#burger').on('click', function () { $('.nav-list').stop(true, true).slideToggle(250); });

    // ===== 3. TAB PAKET (click + fadeIn); tab Badai memicu kilat =====
    function bukaTab(target) {
        $('.tab').removeClass('active').filter('[data-target="' + target + '"]').addClass('active');
        $('.tab-panel').hide();
        $(target).fadeIn(300);
        if (target === '#tab-badai') kilat();
    }
    $('.tab-panel').hide().first().show();
    $('.tab').on('click', function () { bukaTab($(this).data('target')); });
    $('.dropdown-menu a').on('click', function () { bukaTab($(this).data('tab')); });

    // ===== 4. KARTU MELAYANG (animate) =====
    $('.card')
        .on('mouseenter', function () { $(this).stop().animate({ top: '-8px' }, 150); })
        .on('mouseleave', function () { $(this).stop().animate({ top: '0px' }, 150); });

    // ===== 5. EFEK HUJAN (animate berulang) + TOMBOL USIR HUJAN =====
    let hujan = true;
    function jatuhkan($d) {
        const tinggi = $('.hero').outerHeight();
        $d.css({ left: acak(0, 100) + '%', top: -20 }).animate({ top: tinggi }, acak(700, 1500), 'linear', function () {
            if (hujan) jatuhkan($d);
        });
    }
    for (let i = 0; i < 40; i++) {
        const $d = $('<span class="drop"></span>').appendTo('#hujan');
        setTimeout(() => jatuhkan($d), acak(0, 1200));
    }
    $('#usirBtn').on('click', function () {
        if (hujan) {
            hujan = false;
            $('.drop').stop(true).fadeOut(400);
            $('#pelangi').fadeIn(600);
            $(this).text('🌧️ Panggil Hujan Lagi');
            toast('Hujan berhasil diusir! Langit cerah. ☀️', 'success');
        } else {
            hujan = true;
            $('#pelangi').fadeOut(300);
            $('.drop').show().each(function () { jatuhkan($(this)); });
            $(this).text('⛈️ Usir Hujan Sekarang');
        }
    });

    // ===== 6. TOMBOL "BAYAR NANTI" YANG KABUR (mouseenter + animate) =====
    $('#bayarNanti').on('mouseenter touchstart', function () {
        const lebar = $('.bayar-wrap').width() - $(this).outerWidth();
        $(this).stop().animate({ left: acak(0, lebar) + 'px', top: acak(0, 40) + 'px' }, 180).css('transform', 'none');
    }).on('click', function () { toast('Ketangkap? Tetap tidak bisa. Pawang tidak terima utang!', 'error'); });

    // ===== 7. COUNTER STATISTIK (animate angka saat terlihat) =====
    let sudahHitung = false;
    function hitung() {
        if (sudahHitung || $(window).scrollTop() < $('.stats').offset().top - $(window).height() + 80) return;
        sudahHitung = true;
        $('.count').each(function () {
            const $el = $(this), akhir = Number($el.data('to'));
            $({ n: 0 }).animate({ n: akhir }, { duration: 1500,
                step: function () { $el.text(Math.floor(this.n).toLocaleString('id-ID')); },
                complete: function () { $el.text(akhir.toLocaleString('id-ID')); } });
        });
    }

    // ===== 8. GENERATOR MANTRA (fadeOut/fadeIn) =====
    const mantra = [
        'Awan awan menjauhlah, undangan sudah tercetak, uang sudah habis.',
        'Wahai hujan, tolong menepi, ini bukan jadwalmu.',
        'Bismillah, cerah. Kalau tidak cerah, ya tetap bismillah.',
        'Langit biru, hati biru, dompet biru. Tapi acara tetap kering.',
        'Jemuran tetangga aman, mantan dilarang datang.'
    ];
    $('#mantraBtn').on('click', function () {
        $('#mantraTeks').stop(true, true).fadeOut(150, function () {
            $(this).text('“' + mantra[Math.floor(Math.random() * mantra.length)] + '”').fadeIn(300);
        });
    });

    // ===== 9. KUIS PELUANG HUJAN =====
    $('#kuisBox .opsi button').on('click', function () {
        $(this).siblings().removeClass('pilih').end().addClass('pilih').parent().data('skor', $(this).data('skor'));
        if ($('#kuisBox .opsi').filter(function () { return $(this).data('skor') === undefined; }).length) return;
        let total = 0;
        $('#kuisBox .opsi').each(function () { total += $(this).data('skor'); });
        const hasil = total <= 2 ? ['Peluang hujan 20%. Santai, tapi tetap waspada.', 'Cerah Ceria', '#tab-cerah', '500000']
            : total <= 4 ? ['Peluang hujan 60%. Awan sudah mulai ngelirik.', 'Mendung Manja', '#tab-mendung', '1000000']
            : ['Peluang hujan 95%. Langit sudah siap konser.', 'Badai? Hadapi Saja', '#tab-badai', '2500000'];
        $('#hasilKuis').html('<strong>' + hasil[0] + '</strong><br>Rekomendasi: Paket ' + hasil[1] +
            '<br><button type="button" class="btn btn-garis pakai" data-tab="' + hasil[2] + '" data-harga="' + hasil[3] + '">Pakai paket ini</button>')
            .stop(true, true).slideDown(300);
    });
    $('#hasilKuis').on('click', '.pakai', function () {
        $('#paket').val($(this).data('harga')).trigger('change');
        $('html, body').animate({ scrollTop: $('#booking').offset().top - 60 }, 500);
        toast('Paket dipilih otomatis di form booking.', 'success');
    });

    // ===== 10. FAQ ACCORDION (slideToggle) =====
    $('.faq-q').on('click', function () {
        const $a = $(this).next('.faq-a');
        $('.faq-a').not($a).slideUp(200).prev().find('span').text('+');
        $a.slideToggle(200);
        $(this).find('span').text($a.is(':visible') ? '+' : '–');
    });

    // ===== 11. KALKULATOR ESTIMASI BIAYA (animate angka) =====
    let totalLama = 0;
    function hitungTotal() {
        const harga = Number($('#paket').val()) || 0;
        const tamu = parseInt($('#tamu').val(), 10) || 0;
        const baru = harga ? harga + tamu * 2000 : 0;
        $({ n: totalLama }).stop(true).animate({ n: baru }, { duration: 500, step: function () { $('#total').text(rupiah(this.n)); } });
        totalLama = baru;
    }
    $('#paket').on('change', hitungTotal);
    $('#tamu').on('input', hitungTotal);

    // ===== 12. PAYUNG MENGIKUTI KURSOR (mousemove) =====
    $(document).one('mousemove', function () { $('#payung').show(); });
    $(document).on('mousemove', function (e) { $('#payung').css({ left: e.clientX + 14, top: e.clientY + 8 }); });

    // ===== 13. EASTER EGG: ketik "cerah" (keydown) =====
    let ketik = '';
    $(document).on('keydown', function (e) {
        if ($(e.target).is('input, textarea, select')) return;
        ketik = (ketik + e.key.toLowerCase()).slice(-5);
        if (ketik === 'cerah') {
            if (hujan) $('#usirBtn').trigger('click');
            toast('🌈 Kamu menemukan jurus rahasia!', 'success');
        }
    });

    // ===== 14. JUDUL TAB BERUBAH SAAT DITINGGAL =====
    const judulAsli = document.title;
    $(document).on('visibilitychange', function () {
        document.title = document.hidden ? 'Hujan turun... balik lagi dong ☔' : judulAsli;
    });

    // ===== 15. BACK TO TOP + SMOOTH SCROLL =====
    $(window).on('scroll', function () {
        $(this).scrollTop() > 300 ? $('#backToTop').fadeIn(200) : $('#backToTop').fadeOut(200);
        hitung();
    });
    hitung();
    $('#backToTop').on('click', function () { $('html, body').animate({ scrollTop: 0 }, 500); });
    $('a[href^="#"]').on('click', function (e) {
        const href = $(this).attr('href');
        if (href.length < 2 || !$(href).length) return;
        e.preventDefault();
        $('html, body').animate({ scrollTop: $(href).offset().top - 60 }, 500);
        if ($(window).width() <= 720) $('.nav-list').slideUp(200);
    });

    // ===== 16. FORM BOOKING + JQUERY VALIDATION + CUSTOM METHOD =====
    $.validator.addMethod('nomorHp', function (v, el) {
        return this.optional(el) || /^(08|628)[0-9]{8,11}$/.test(v);
    }, 'Nomor HP tidak valid (contoh: 081234567890)');
    $.validator.addMethod('hurufSaja', function (v, el) {
        return this.optional(el) || /^[A-Za-z\s.']+$/.test(v);
    }, 'Nama hanya boleh berisi huruf');
    $.validator.addMethod('tanggalDepan', function (v, el) {
        if (this.optional(el)) return true;
        const hariIni = new Date(); hariIni.setHours(0, 0, 0, 0);
        return new Date(v) >= hariIni;
    }, 'Tanggal acara tidak boleh di masa lalu (hujannya sudah lewat)');

    const validator = $('#formBooking').validate({
        rules: {
            nama: { required: true, minlength: 3, hurufSaja: true },
            email: { required: true, email: true },
            hp: { required: true, nomorHp: true },
            tanggal: { required: true, tanggalDepan: true },
            paket: { required: true },
            tamu: { required: true, digits: true, min: 10, max: 1000 },
            lokasi: { required: true, minlength: 15 },
            setuju: { required: true }
        },
        messages: {
            nama: { required: 'Nama wajib diisi', minlength: 'Nama minimal 3 karakter' },
            email: { required: 'Email wajib diisi', email: 'Format email tidak valid' },
            hp: { required: 'Nomor WhatsApp wajib diisi' },
            tanggal: { required: 'Tanggal acara wajib diisi' },
            paket: { required: 'Pilih salah satu paket' },
            tamu: { required: 'Jumlah tamu wajib diisi', digits: 'Harus berupa angka', min: 'Minimal 10 tamu', max: 'Maksimal 1000 tamu' },
            lokasi: { required: 'Lokasi wajib diisi', minlength: 'Lokasi minimal 15 karakter' },
            setuju: { required: 'Centang dulu, hujan juga punya hak' }
        },
        errorElement: 'div',
        errorClass: 'pesan-error',
        errorPlacement: function (error, el) {
            error.hide().insertAfter(el.is(':checkbox') ? el.closest('label') : el).slideDown(150);
        },
        highlight: function (el) { $(el).addClass('is-error').removeClass('is-valid'); },
        unhighlight: function (el) { $(el).removeClass('is-error').addClass('is-valid'); },
        invalidHandler: function () { toast('Periksa kembali isian formulir!', 'error'); },
        submitHandler: function (form) {
            toast('Terima kasih, ' + $('#nama').val().trim() + '! Pawang segera dikirim.', 'success');
            $('#sukses').stop(true, true).slideDown(300).delay(3500).slideUp(300);
            form.reset();
            validator.resetForm();
            $('#formBooking .is-error, #formBooking .is-valid').removeClass('is-error is-valid');
            hitungTotal();
        }
    });
});
