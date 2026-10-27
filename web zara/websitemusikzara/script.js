$(function () {

  // ===== DATA LAGU PER MOOD =====
  const moods = {
    healing: { desc: 'Pelan, hangat, dan menenangkan.', emoji: '🌿', lagu: [
      ['Banana Pancakes', 'Jack Johnson', 'Akustik santai untuk pagi yang lambat.'],
      ['Here Comes the Sun', 'The Beatles', 'Klasik yang membawa harapan baru.'],
      ['Three Little Birds', 'Bob Marley', 'Reggae lembut penuh ketenangan.'] ] },
    heartbreak: { desc: 'Untuk hati yang belum selesai.', emoji: '💔', lagu: [
      ['Someone Like You', 'Adele', 'Ballad piano tentang melepaskan.'],
      ['drivers license', 'Olivia Rodrigo', 'Pop emosional tentang kehilangan.'],
      ['Hati-Hati di Jalan', 'Tulus', 'Lagu perpisahan yang tenang dan dalam.'] ] },
    happy: { desc: 'Naikkan semangat, goyangkan kepala.', emoji: '☀️', lagu: [
      ['Happy', 'Pharrell Williams', 'Funky ceria, susah untuk tidak tersenyum.'],
      ['Dancing Queen', 'ABBA', 'Disko abadi untuk pesta kapan saja.'],
      ["Can't Stop the Feeling!", 'Justin Timberlake', 'Pop riang penuh energi.'] ] },
    latenight: { desc: 'Jalanan sepi, lampu kota, dan pikiran panjang.', emoji: '🌙', lagu: [
      ['Midnight City', 'M83', 'Synth megah ala lampu kota.'],
      ['Blinding Lights', 'The Weeknd', 'Synth-pop untuk perjalanan malam.'],
      ['Nights', 'Frank Ocean', 'R&B atmosferik yang berubah suasana.'] ] }
  };
  let moodAktif = 'healing';
  let favorit = [];

  function tampilMood(key) {
    const m = moods[key];
    $('#moodDesc').text(m.desc);
    const $panel = $('#panel').empty();
    m.lagu.forEach(function (l) {
      const $c = $('<div class="card"></div>');
      $c.append($('<div class="emoji"></div>').text(m.emoji));
      $c.append($('<h3></h3>').text(l[0]));
      $c.append($('<div class="artis"></div>').text(l[1]));
      $c.append($('<p></p>').text(l[2]));
      const sudah = favorit.indexOf(l[0] + ' - ' + l[1]) > -1;
      $c.append($('<button type="button" class="btn-fav"></button>')
        .toggleClass('on', sudah).text(sudah ? '♥ Tersimpan' : '♡ Simpan')
        .data('judul', l[0] + ' - ' + l[1]));
      $panel.append($c);
    });
    // EFEK FADE bertahap per kartu saat pindah kategori
    $panel.find('.card').each(function (i) {
      $(this).delay(i * 150).fadeIn(400);
    });
  }

  // ===== NAVIGASI TAB MOOD (fadeOut -> fadeIn) =====
  tampilMood(moodAktif);
  $('.tab').on('click', function () {
    const key = $(this).data('mood');
    if (key === moodAktif) return;
    moodAktif = key;
    $('.tab').removeClass('active');
    $(this).addClass('active');
    $('body').removeClass('mood-healing mood-heartbreak mood-happy mood-latenight').addClass('mood-' + key);
    $('#panel').stop(true, true).fadeOut(250, function () {
      tampilMood(key);
      $(this).fadeIn(0);
    });
  });

  // ===== FAVORIT: ANIMATE tombol & update daftar =====
  $('#panel').on('click', '.btn-fav', function () {
    const judul = $(this).data('judul');
    const i = favorit.indexOf(judul);
    if (i > -1) favorit.splice(i, 1); else favorit.push(judul);
    $(this).toggleClass('on', i === -1).text(i === -1 ? '♥ Tersimpan' : '♡ Simpan')
      .stop().animate({ fontSize: '17px' }, 100).animate({ fontSize: '13px' }, 100);
    renderFav();
  });
  function renderFav() {
    $('#jmlFav').text(favorit.length);
    const $ul = $('#listFav').empty();
    if (!favorit.length) $ul.append($('<li></li>').text('Belum ada lagu favorit.'));
    favorit.forEach(function (f) { $ul.append($('<li></li>').text('🎵 ' + f)); });
  }
  renderFav();

  // ===== EFEK SLIDE: dropdown navbar & daftar favorit =====
  $('.dropdown').on('mouseenter', function () {
    $(this).find('.dropdown-menu').stop(true, true).slideDown(200);
  }).on('mouseleave', function () {
    $(this).find('.dropdown-menu').stop(true, true).slideUp(200);
  });
  $('#toggleFav').on('click', function () {
    const $l = $('#listFav').stop(true, true).slideToggle(300);
    $(this).find('span').text($l.is(':visible') ? '−' : '+');
  });

  // ===== EFEK FADE & ANIMATE: hero, back to top, scroll halus =====
  $('.hero .container').hide().fadeIn(1200);
  const $top = $('#backToTop');
  $(window).on('scroll', function () {
    $(this).scrollTop() > 300 ? $top.fadeIn(200) : $top.fadeOut(200);
  });
  $top.on('click', function () { $('html, body').animate({ scrollTop: 0 }, 500); });
  $('a[href^="#"]').on('click', function (e) {
    const t = $(this.getAttribute('href'));
    if (t.length) { e.preventDefault(); $('html, body').animate({ scrollTop: t.offset().top - 60 }, 500); }
  });

  // ===== VALIDASI FORM =====
  $.validator.addMethod('usernameOk', function (v, el) {
    return this.optional(el) || /^[a-zA-Z0-9_]{4,15}$/.test(v);
  }, 'Username 4-15 karakter: huruf, angka, atau garis bawah.');

  $('#formProfil').validate({
    rules: {
      nama:       { required: true, minlength: 3 },
      username:   { required: true, usernameOk: true },
      email:      { required: true, email: true },
      umur:       { required: true, digits: true, min: 10, max: 100 },
      moodFav:    { required: true },
      waktu:      { required: true },
      genre:      { required: true, minlength: 2 },
      password:   { required: true, minlength: 8 },
      konfirmasi: { required: true, equalTo: '#password' },
      setuju:     { required: true }
    },
    messages: {
      nama:       { required: 'Nama wajib diisi.', minlength: 'Minimal 3 karakter.' },
      username:   { required: 'Username wajib diisi.' },
      email:      { required: 'Email wajib diisi.', email: 'Format email tidak valid.' },
      umur:       { required: 'Usia wajib diisi.', digits: 'Usia harus berupa angka bulat.', min: 'Usia minimal 10 tahun.', max: 'Usia maksimal 100 tahun.' },
      moodFav:    { required: 'Pilih mood favoritmu.' },
      waktu:      { required: 'Pilih waktu mendengarkan.' },
      genre:      { required: 'Pilih genre favorit.', minlength: 'Pilih minimal 2 genre.' },
      password:   { required: 'Password wajib diisi.', minlength: 'Minimal 8 karakter.' },
      konfirmasi: { required: 'Konfirmasi password wajib diisi.', equalTo: 'Password tidak sama.' },
      setuju:     { required: 'Anda harus menyetujui syarat & ketentuan.' }
    },
    errorPlacement: function (error, el) {
      if (el.attr('type') === 'radio') error.insertAfter(el.closest('.radio-row'));
      else if (el.attr('name') === 'genre') error.insertAfter(el.closest('.genre-grid'));
      else if (el.attr('type') === 'checkbox') error.insertAfter(el.closest('label'));
      else error.insertAfter(el);
    },
    submitHandler: function (form) {
      const $h = $('#hasil').empty();
      $h.append($('<h3></h3>').text('🎉 Profil dibuat, ' + $('#nama').val().trim() + '!'));
      $h.append($('<p></p>').text('@' + $('#username').val() + ' · Mood favorit: ' + $('#moodFav').val() + ' · Waktu: ' + $('input[name=waktu]:checked').val()));
      $('input[name=genre]:checked').each(function () { $h.append($('<span class="tag"></span>').text(this.value)); });
      $h.stop(true, true).slideDown(350);
      form.reset();
      $('#formProfil').validate().resetForm();
      $('#formProfil .valid').removeClass('valid');
    }
  });
});
