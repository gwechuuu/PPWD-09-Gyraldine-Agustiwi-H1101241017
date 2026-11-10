$(function () {
    const WA = "6285754673320"; // ganti dengan nomor WhatsApp toko (format 62...)
    const VOUCHER = { BAKERY10: { r: 0.1, min: 0 }, Geman5: { r: 0.05, min: 100000 } };
    const CATS = ["Semua", "Favorit", "Roti Manis", "Roti Tawar", "Pastry", "Kue Ulang Tahun", "Kue Kering"];
    const JAM = ["07:00", "09:00", "11:00", "13:00", "15:00", "17:00"];

    const P = [
        { id: 1, n: "Roti Sobek Cokelat", c: "Roti Manis", p: 18000, e: "🍞", d: "Roti sobek lembut dengan isian cokelat leleh." },
        { id: 2, n: "Donat Gula Halus", c: "Roti Manis", p: 7000, e: "🍩", d: "Donat empuk bertabur gula halus, digoreng pagi ini." },
        { id: 3, n: "Roti Abon Sapi", c: "Roti Manis", p: 16000, e: "🍞", d: "Roti manis gurih dengan abon sapi dan mayones." },
        { id: 4, n: "Baguette Klasik", c: "Roti Tawar", p: 22000, e: "🥖", d: "Kulit renyah, dalam lembut. Cocok untuk sarapan." },
        { id: 5, n: "Roti Tawar Gandum", c: "Roti Tawar", p: 24000, e: "🍞", d: "Roti tawar gandum utuh, tanpa pengawet." },
        { id: 6, n: "Croissant Butter", c: "Pastry", p: 15000, e: "🥐", d: "Berlapis dan harum mentega, paling enak saat hangat." },
        { id: 7, n: "Pain au Chocolat", c: "Pastry", p: 17000, e: "🥐", d: "Pastry berlapis dengan dua batang cokelat." },
        { id: 8, n: "Pie Susu", c: "Pastry", p: 12000, e: "🥧", d: "Pie mungil dengan custard susu yang manis lembut." },
        { id: 9, n: "Pretzel Garam", c: "Pastry", p: 14000, e: "🥨", d: "Pretzel panggang dengan taburan garam laut." },
        { id: 10, n: "Kue Cokelat Ulang Tahun", c: "Kue Ulang Tahun", p: 185000, e: "🎂", d: "Diameter 18 cm, cokelat tiga lapis. Tambahkan tulisan di catatan." },
        { id: 11, n: "Tart Stroberi", c: "Kue Ulang Tahun", p: 210000, e: "🎂", d: "Krim vanila dengan stroberi segar, diameter 18 cm." },
        { id: 12, n: "Cupcake Vanila (6 pcs)", c: "Kue Ulang Tahun", p: 45000, e: "🧁", d: "Satu kotak berisi 6 cupcake dengan frosting pastel." },
        { id: 13, n: "Choco Chip Cookies", c: "Kue Kering", p: 35000, e: "🍪", d: "Toples 250 g, renyah di luar dan lembut di dalam." },
        { id: 14, n: "Nastar Keju", c: "Kue Kering", p: 68000, e: "🍪", d: "Toples 300 g, selai nanas dengan taburan keju." }
    ];

    const store = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
    let cart = store("dp_cart", []), wish = store("dp_wish", []);
    let cat = "Semua", q = "", sort = "def", voucher = null;

    const rp = n => "Rp" + n.toLocaleString("id-ID");
    const esc = s => $("<i>").text(s).html();
    const find = id => P.find(x => x.id == id);
    const save = () => {
        try { localStorage.setItem("dp_cart", JSON.stringify(cart)); localStorage.setItem("dp_wish", JSON.stringify(wish)); } catch (e) { }
    };
    function toast(m) {
        const t = $('<div class="toast">').text(m).appendTo("#toasts");
        setTimeout(() => t.fadeOut(300, () => t.remove()), 2000);
    }

    /* ---------- Katalog ---------- */
    function buildChips() {
        $("#chips").html(CATS.map(c => `<button class="chip ${c === cat ? "on" : ""}" data-cat="${c}">${c === "Favorit" ? "♥ " : ""}${c}</button>`).join(""));
        $("#ddm").html(CATS.filter(c => c !== "Favorit").map(c => `<a data-cat="${c}" href="#produk">${c}</a>`).join(""));
    }
    function render() {
        let l = P.filter(x => (cat === "Semua" || (cat === "Favorit" ? wish.includes(x.id) : x.c === cat)) && (x.n + " " + x.c + " " + x.d).toLowerCase().includes(q));
        if (sort === "lo") l.sort((a, b) => a.p - b.p);
        if (sort === "hi") l.sort((a, b) => b.p - a.p);
        if (sort === "az") l.sort((a, b) => a.n.localeCompare(b.n));
        $("#count").text(l.length + " produk");
        $("#grid").html(l.length ? l.map(x => `<article class="card" data-id="${x.id}">
      <button class="heart ${wish.includes(x.id) ? "on" : ""}" data-id="${x.id}" aria-label="Favorit">♥</button>
      <div class="pic">${x.e}</div><h3>${x.n}</h3><p>${x.c}</p>
      <div class="row"><b>${rp(x.p)}</b><button class="add" data-id="${x.id}">+ Keranjang</button></div></article>`).join("")
            : '<p class="empty">Produk tidak ditemukan. Coba kata kunci lain atau pilih kategori Semua.</p>');
    }
    function setCat(c) { cat = c; buildChips(); render(); }

    $(document).on("click", "[data-cat]", function () { setCat($(this).data("cat")); $("#menu").removeClass("open"); });
    $("#sort").on("change", function () { sort = this.value; render(); });

    $("#grid").on("click", ".heart", function (e) {
        e.stopPropagation();
        const id = +$(this).data("id"), i = wish.indexOf(id);
        i < 0 ? wish.push(id) : wish.splice(i, 1);
        save(); toast(i < 0 ? "Disimpan ke favorit" : "Dihapus dari favorit"); render();
    });
    $("#grid").on("click", ".add", function (e) { e.stopPropagation(); addCart(+$(this).data("id"), 1, ""); });
    $("#grid").on("click", ".card", function () { detail($(this).data("id")); });

    /* ---------- Pencarian ---------- */
    $("#q").on("input", function () {
        q = this.value.trim().toLowerCase();
        const m = q ? P.filter(x => x.n.toLowerCase().includes(q)).slice(0, 5) : [];
        $("#sug").html(m.map(x => `<li data-id="${x.id}"><span>${x.e} ${x.n}</span><small>${rp(x.p)}</small></li>`).join("")).toggle(m.length > 0);
        render();
    });
    $("#sug").on("click", "li", function () { $("#sug").hide(); detail($(this).data("id")); });
    $("#sf").on("submit", function (e) { e.preventDefault(); $("#sug").hide(); location.hash = "#produk"; });
    $(document).on("click", e => { if (!$(e.target).closest(".search").length) $("#sug").hide(); });
    $("#burger").on("click", () => $("#menu").toggleClass("open"));

    /* ---------- Overlay ---------- */
    const openEl = s => { $("#ov").addClass("show"); $(s).addClass("open"); };
    const closeAll = () => { $("#ov").removeClass("show"); $(".drawer.open,.modal.open").removeClass("open"); };
    $("#ov").on("click", closeAll);
    $(document).on("click", "[data-close]", closeAll);
    $(document).on("keydown", e => { if (e.key === "Escape") closeAll(); });

    /* ---------- Detail produk ---------- */
    function detail(id) {
        const x = find(id); let n = 1;
        $("#modal").html(`<button class="x" data-close aria-label="Tutup">✕</button><div class="dpic">${x.e}</div>
      <h2>${x.n}</h2><p class="cat">${x.c}</p><p>${x.d}</p><b class="pr">${rp(x.p)}</b>
      <label>Catatan (opsional)<input id="note" maxlength="60" placeholder="Contoh: tulisan di kue, kurangi manis"></label>
      <div class="qrow"><div class="qty"><button id="mn" aria-label="Kurangi">−</button><span id="mq">1</span><button id="pl" aria-label="Tambah">+</button></div>
      <button id="dadd" class="btn gr">Tambah ke keranjang</button></div>`);
        $("#mn").on("click", () => $("#mq").text(n = Math.max(1, n - 1)));
        $("#pl").on("click", () => $("#mq").text(n = Math.min(50, n + 1)));
        $("#dadd").on("click", () => { addCart(id, n, $("#note").val().trim()); closeAll(); });
        openEl("#modal");
    }

    /* ---------- Keranjang ---------- */
    function addCart(id, qty, note) {
        const k = id + "|" + note, it = cart.find(i => i.k === k);
        it ? (it.q = Math.min(50, it.q + qty)) : cart.push({ k, id, q: qty, note });
        save(); drawCart(); toast("Ditambahkan ke keranjang");
        $("#openCart").addClass("bump"); setTimeout(() => $("#openCart").removeClass("bump"), 300);
    }
    function totals() {
        const sub = cart.reduce((s, i) => s + find(i.id).p * i.q, 0);
        if (voucher && sub < VOUCHER[voucher].min) voucher = null;
        const disc = voucher ? Math.round(sub * VOUCHER[voucher].r) : 0;
        return { sub, disc, total: sub - disc };
    }
    function drawCart() {
        const n = cart.reduce((s, i) => s + i.q, 0), t = totals();
        $("#badge").text(n);
        $("#items").html(cart.length ? cart.map((i, ix) => {
            const x = find(i.id);
            return `<li><span class="em">${x.e}</span><div><b>${x.n}</b>${i.note ? `<small>${esc(i.note)}</small>` : ""}
        <div class="qty"><button data-ix="${ix}" data-d="-1" aria-label="Kurangi">−</button><span>${i.q}</span><button data-ix="${ix}" data-d="1" aria-label="Tambah">+</button></div></div>
        <div class="r"><b>${rp(x.p * i.q)}</b><br><button class="del" data-ix="${ix}">Hapus</button></div></li>`;
        }).join("") : '<p class="empty" style="padding:30px 0">Keranjang masih kosong. Pilih roti favoritmu dulu.</p>');
        $("#sub").text(rp(t.sub)); $("#disc").text("-" + rp(t.disc)); $("#tot").text(rp(t.total));
        $("#toCheckout").prop("disabled", !cart.length);
    }
    $("#items").on("click", ".qty button", function () {
        const i = cart[$(this).data("ix")]; i.q += +$(this).data("d");
        if (i.q < 1) cart.splice($(this).data("ix"), 1);
        save(); drawCart();
    });
    $("#items").on("click", ".del", function () { cart.splice($(this).data("ix"), 1); save(); drawCart(); });
    $("#openCart").on("click", () => openEl("#drawer"));

    $("#vbtn").on("click", function () {
        const c = $("#vin").val().trim().toUpperCase(), v = VOUCHER[c], t = totals();
        if (!v) return $("#vmsg").css("color", "#b3261e").text("Kode voucher tidak dikenal.");
        if (t.sub < v.min) return $("#vmsg").css("color", "#b3261e").text("Belanja minimal " + rp(v.min) + " untuk kode ini.");
        voucher = c; drawCart(); $("#vmsg").css("color", "#3B6B46").text("Voucher " + c + " dipakai.");
    });

    /* ---------- Checkout ---------- */
    const ongkir = () => $("[name=mode]:checked").val() === "antar" && totals().sub < 150000 ? 10000 : 0;
    function sum() {
        const t = totals(), o = ongkir();
        $("#sum").html(`<div class="ln"><span>Subtotal</span><span>${rp(t.sub)}</span></div>
      ${t.disc ? `<div class="ln"><span>Diskon</span><span>-${rp(t.disc)}</span></div>` : ""}
      <div class="ln"><span>Ongkir</span><span>${o ? rp(o) : "Gratis"}</span></div>
      <div class="ln big"><span>Total</span><span>${rp(t.total + o)}</span></div>`);
    }
    $("[name=jam]").html(JAM.map(j => `<option>${j}</option>`).join(""));
    $("#toCheckout").on("click", function () {
        const d = new Date(Date.now() + 864e5), iso = d.toISOString().slice(0, 10);
        $("[name=tgl]").attr("min", new Date().toISOString().slice(0, 10)).val(iso);
        $("#form").show(); $("#done").prop("hidden", true); $("#err").text(""); sum();
        closeAll(); openEl("#co");
    });
    $("[name=mode]").on("change", function () { $("#addr").prop("hidden", this.value !== "antar"); sum(); });

    $("#form").on("submit", function (e) {
        e.preventDefault();
        const f = Object.fromEntries(new FormData(this)); let m = "";
        if (!f.nama.trim()) m = "Isi nama kamu.";
        else if (!/^(\+62|62|0)8\d{7,12}$/.test(f.wa.replace(/[\s-]/g, ""))) m = "Nomor WhatsApp belum valid, contoh 08123456789.";
        else if (f.mode === "antar" && !f.alamat.trim()) m = "Isi alamat pengantaran.";
        else if (!f.tgl) m = "Pilih tanggal pengambilan.";
        $("#err").text(m);
        if (m) return;
        const t = totals(), o = ongkir(), no = "DP" + Date.now().toString().slice(-6);
        const lines = cart.map(i => { const x = find(i.id); return `- ${x.n} x${i.q} (${rp(x.p * i.q)})${i.note ? " [" + i.note + "]" : ""}`; }).join("\n");
        const txt = `Halo Dapur Pagi, saya mau pesan.\nNo. pesanan: ${no}\nNama: ${f.nama}\nWA: ${f.wa}\n${f.mode === "antar" ? "Diantar ke: " + f.alamat : "Ambil di toko"}\nTanggal: ${f.tgl}, jam ${f.jam}\nPembayaran: ${f.bayar}\n\n${lines}\n\n${voucher ? "Voucher: " + voucher + "\n" : ""}Ongkir: ${o ? rp(o) : "Gratis"}\nTotal: ${rp(t.total + o)}`;
        $("#form").hide();
        $("#done").prop("hidden", false).html(`<h2>Pesanan ${no} siap dikirim</h2><p>Kirim pesanan ke WhatsApp toko untuk konfirmasi dan pembayaran.</p>
      <a class="btn gr full" target="_blank" rel="noopener" href="https://wa.me/${WA}?text=${encodeURIComponent(txt)}">Kirim lewat WhatsApp</a>`);
        cart = []; voucher = null; $("#vin").val(""); $("#vmsg").text(""); save(); drawCart();
    });

    buildChips(); render(); drawCart();
});