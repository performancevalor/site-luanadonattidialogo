(function () {
  const data = window.SITE_DATA;
  const body = document.body;
  const root = body.dataset.root || ".";
  const asset = (path) => `${root}/${path}`;
  const imageUrl = (path) => /^https?:\/\//i.test(path) ? path : asset(path);
  const page = body.dataset.page || "home";
  const currentYear = new Date().getFullYear();
  const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  })[character]);

  const waLink = (message) => `https://wa.me/${data.professional.whatsapp}?text=${encodeURIComponent(message)}`;
  const generalMessage = `Olá, Luana JD! Vim pelo seu site e gostaria de conversar sobre imóveis em São Paulo.`;

  const navItems = [
    ["01", "Início", "index.html"],
    ["02", "Trajetória", "trajetoria.html"],
    ["03", "Resultados", "resultados.html"],
    ["04", "Equipe", "equipe.html"],
    ["05", "Imóveis", "imoveis.html"],
    ["06", "Faça parte", "trabalhe-comigo.html"],
    ["07", "Contato", "contato.html"],
  ];

  const header = document.querySelector("[data-site-header]");
  if (header) {
    header.innerHTML = `
      <a class="skip-link" href="#conteudo">Ir para o conteúdo</a>
      <header class="site-header">
        <button class="menu-button" type="button" aria-label="Abrir menu" aria-controls="drawer" aria-expanded="false"><i></i><i></i><i></i></button>
        <a class="header-logo" href="${asset("index.html")}" aria-label="Luana Donatti — página inicial">
          <img src="${asset("assets/images/logo-luana-donatti.svg")}" alt="Luana Donatti" width="360" height="92">
        </a>
        <span class="header-balance" aria-hidden="true"></span>
      </header>
      <div class="drawer-backdrop" data-drawer-close></div>
      <aside class="drawer" id="drawer" aria-hidden="true" aria-label="Menu principal">
        <div class="drawer-top">
          <a class="brand" href="${asset("index.html")}"><span class="brand-mark">LJD</span><span class="brand-copy"><strong>Luana Donatti</strong><span>Gerente de Vendas · Diálogo</span></span></a>
          <button class="drawer-close" type="button" aria-label="Fechar menu" data-drawer-close>×</button>
        </div>
        <nav class="drawer-nav">${navItems.map(([n,label,url]) => `<a href="${asset(url)}"><span>${n}</span>${label}</a>`).join("")}</nav>
        <div class="drawer-bottom">
          <strong>Luana JD</strong><br>${data.professional.whatsappDisplay} · ${data.professional.creci}
          <div class="drawer-social">
            <a href="${data.professional.instagram}" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="${waLink(generalMessage)}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </div>
      </aside>`;
  }

  const footer = document.querySelector("[data-site-footer]");
  if (footer) {
    footer.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div>
              <a class="brand" href="${asset("index.html")}"><span class="brand-mark">LJD</span><span class="brand-copy"><strong>Luana Donatti</strong><span>Gerente de Vendas · Diálogo</span></span></a>
              <p>14 anos no mercado imobiliário, liderança comercial e atendimento humanizado para compradores, corretores e parceiros.</p>
              <div class="dialogo-lockup" aria-label="Luana é gerente da Diálogo Engenharia">
                <img src="${asset("assets/images/logo-dialogo.svg")}" alt="Diálogo Engenharia" width="205" height="76">
              </div>
            </div>
            <nav class="footer-links" aria-label="Navegação no rodapé">
              <strong>Navegue</strong>
              ${navItems.slice(1).map(([,label,url]) => `<a href="${asset(url)}">${label}</a>`).join("")}
            </nav>
            <div class="footer-links">
              <strong>Converse com a Luana JD</strong>
              <a href="${waLink(generalMessage)}" target="_blank" rel="noopener noreferrer">${data.professional.whatsappDisplay}</a>
              <a href="${data.professional.instagram}" target="_blank" rel="noopener noreferrer">${data.professional.instagramHandle}</a>
              <span>${data.professional.creci}</span>
              <a href="${asset("politica-de-privacidade.html")}">Privacidade e LGPD</a>
            </div>
          </div>
          <div class="footer-small"><span>© ${currentYear} Luana Donatti. Todos os direitos reservados.</span><span>Empreendimentos sujeitos a confirmação de disponibilidade e condições.</span></div>
        </div>
      </footer>
      <a class="floating-whatsapp" href="${waLink(generalMessage)}" target="_blank" rel="noopener noreferrer" aria-label="Conversar com Luana JD pelo WhatsApp"><img src="${asset("assets/icons/whatsapp.svg")}" alt="" aria-hidden="true"></a>`;
  }

  const menuButton = document.querySelector(".menu-button");
  const drawer = document.querySelector(".drawer");
  let lastFocus = null;
  const setMenu = (open) => {
    body.classList.toggle("menu-open", open);
    menuButton?.setAttribute("aria-expanded", String(open));
    menuButton?.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    drawer?.setAttribute("aria-hidden", String(!open));
    if (open) { lastFocus = document.activeElement; drawer?.querySelector("a,button")?.focus(); }
    else if (lastFocus) { lastFocus.focus(); }
  };
  menuButton?.addEventListener("click", () => setMenu(!body.classList.contains("menu-open")));
  document.querySelectorAll("[data-drawer-close]").forEach((el) => el.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && body.classList.contains("menu-open")) setMenu(false); });

  const cardMarkup = (property) => `
    <article class="property-card" data-neighborhood="${property.neighborhood}" data-status="${property.status}">
      <a href="${asset(`imoveis/${property.slug}.html`)}" aria-label="Conhecer ${property.name}">
        <div class="property-card-media">
          <img src="${asset(`assets/images/properties/covers/${property.slug}-card.webp`)}" alt="Imagem em alta definição de ${property.name}" width="1600" height="1000" loading="lazy" decoding="async">
          <span class="status-chip">${property.status}</span>
        </div>
        <div class="property-card-body">
          <small>${property.neighborhood} · ${property.type}</small>
          <h3>${property.shortName}</h3>
          <p>${property.specs}</p>
          <div class="property-card-footer"><span>Ver detalhes</span><span aria-hidden="true">↗</span></div>
        </div>
      </a>
    </article>`;

  document.querySelectorAll("[data-property-grid]").forEach((grid) => {
    const limit = Number(grid.dataset.limit || data.properties.length);
    grid.innerHTML = data.properties.slice(0, limit).map(cardMarkup).join("");
  });

  const filters = document.querySelector("[data-property-filters]");
  if (filters) {
    const values = ["Todos", ...new Set(data.properties.map((item) => item.neighborhood))];
    filters.innerHTML = values.map((label, index) => `<button class="filter-button" type="button" aria-pressed="${index === 0}" data-filter="${label}">${label}</button>`).join("");
    filters.addEventListener("click", (event) => {
      const button = event.target.closest("[data-filter]");
      if (!button) return;
      filters.querySelectorAll("button").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      const selected = button.dataset.filter;
      document.querySelectorAll("[data-property-grid] .property-card").forEach((card) => card.classList.toggle("hidden", selected !== "Todos" && card.dataset.neighborhood !== selected));
    });
  }

  const awardsGrid = document.querySelector("[data-awards-grid]");
  if (awardsGrid) {
    awardsGrid.innerHTML = data.awards.map((award) => `<article class="proof-card"><span class="year">${award.year}</span><h3>${award.title}</h3><p>${award.detail}</p></article>`).join("");
  }

  const photoBook = document.querySelector("[data-photo-book]");
  if (photoBook && data.photoBook?.length) {
    const photoMarkup = (photo, duplicate = false) => `
      <figure class="photo-book-card"${duplicate ? ' aria-hidden="true"' : ""}>
        <img src="${asset(photo.src)}" alt="${duplicate ? "" : photo.alt}" width="900" height="1200" loading="lazy" decoding="async">
        <figcaption><span>${photo.caption}</span><small>Luana Donatti</small></figcaption>
      </figure>`;
    photoBook.innerHTML = `
      <div class="photo-book-track">
        ${data.photoBook.map((photo) => photoMarkup(photo)).join("")}
        ${data.photoBook.map((photo) => photoMarkup(photo, true)).join("")}
      </div>`;

    const toggle = document.querySelector("[data-photo-book-toggle]");
    toggle?.addEventListener("click", () => {
      const paused = photoBook.classList.toggle("is-paused");
      toggle.setAttribute("aria-pressed", String(paused));
      toggle.innerHTML = paused ? '<span aria-hidden="true">▶</span> Continuar' : '<span aria-hidden="true">‖</span> Pausar';
    });
  }

  if (page === "property") {
    const slug = body.dataset.slug;
    const property = data.properties.find((item) => item.slug === slug);
    if (!property) {
      window.location.replace(asset("404.html"));
    } else {
      const target = document.querySelector("[data-property-page]");
      const interestMessage = `Olá, Luana JD! Vim pelo seu site e gostaria de mais informações sobre ${property.name}.`;
      const related = data.properties.filter((item) => item.slug !== property.slug).slice(0, 6);
      const gallery = window.PROPERTY_GALLERIES?.[property.slug] || [{ url: property.image, category: "empreendimento", caption: property.shortName }];
      const preferredGallery = gallery.filter((item) => !["plantas", "implantacao"].includes(item.category));
      const previewGallery = (preferredGallery.length ? preferredGallery : gallery).slice(0, 6);
      const galleryCategories = [...new Set(gallery.map((item) => item.category))];
      const galleryItem = (item, index) => `
        <figure class="property-gallery-item" data-gallery-category="${escapeHtml(item.category)}" data-gallery-index="${index}">
          <button class="property-gallery-media" type="button" data-lightbox-open="${index}" aria-label="Ampliar: ${escapeHtml(item.caption)}">
            <img data-gallery-src="${item.url}" alt="${escapeHtml(item.caption)}" width="1200" height="800" loading="lazy" decoding="async" referrerpolicy="no-referrer">
            <span class="gallery-zoom" aria-hidden="true">Ampliar</span>
          </button>
          <figcaption><small>${escapeHtml(item.category)}</small>${escapeHtml(item.caption)}</figcaption>
        </figure>`;
      const heroImage = imageUrl(property.image);
      target.innerHTML = `
        <section class="property-hero">
          <div class="property-hero-media"><img src="${heroImage}" alt="Perspectiva artística de ${property.name}" width="1600" height="1000" fetchpriority="high" decoding="async" referrerpolicy="no-referrer"></div>
          <div class="container property-hero-copy">
            <nav class="breadcrumbs" aria-label="Navegação estrutural"><a href="${asset("index.html")}">Início</a><span>/</span><a href="${asset("imoveis.html")}">Imóveis</a><span>/</span><span>${property.shortName}</span></nav>
            <span class="eyebrow">${property.status} · ${property.neighborhood}</span>
            <h1>${property.name}</h1>
            <p>${property.specs}</p>
            <div class="property-meta">
              <div class="meta-item"><small>Tipo</small><strong>${property.type}</strong></div>
              <div class="meta-item"><small>Bairro</small><strong>${property.neighborhood}</strong></div>
              <div class="meta-item"><small>Status</small><strong>${property.status}</strong></div>
              <div class="meta-item"><small>Mobilidade</small><strong>${property.mobility}</strong></div>
            </div>
          </div>
        </section>
        <section class="section property-gallery-section" id="galeria">
          <div class="container">
            <div class="property-gallery-heading">
              <div><p class="eyebrow">Galeria oficial Diálogo</p><h2 class="section-title">Conheça cada detalhe.</h2></div>
              <div><p class="section-copy">${gallery.length} imagens oficiais entre perspectivas, decorados, plantas e ambientes do empreendimento.</p><button class="button button-primary" type="button" data-open-gallery>Ver galeria completa</button></div>
            </div>
            <div class="property-gallery-preview">
               ${previewGallery.map((item) => galleryItem(item, gallery.indexOf(item))).join("")}
            </div>
            <p class="disclaimer">Imagens e perspectivas artísticas disponibilizadas no site oficial da Diálogo. Consulte o material e o memorial descritivo vigente.</p>
          </div>
        </section>
        <section class="section">
          <div class="container detail-grid">
            <div data-reveal>
              <p class="eyebrow">Leitura consultiva</p>
              <h2 class="section-title">Um endereço para avaliar com contexto.</h2>
              <p class="section-copy">${property.description}</p>
              <ul class="highlight-list">${property.highlights.map((item) => `<li>${item}</li>`).join("")}</ul>
              <div class="button-row"><a class="button button-whatsapp" href="${waLink(interestMessage)}" target="_blank" rel="noopener noreferrer"><img src="${asset("assets/icons/whatsapp.svg")}" alt="">Falar com Luana JD</a></div>
            </div>
            <div data-reveal>
              <p class="eyebrow">Localização</p>
              <h2 class="section-title">${property.neighborhood}</h2>
              <p class="section-copy">${property.address}</p>
              <iframe class="map-frame" title="Mapa de ${property.name}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${encodeURIComponent(property.address)}&output=embed"></iframe>
            </div>
          </div>
        </section>
        <section class="section dark-section">
          <div class="container">
            <p class="eyebrow">Seleção Luana Donatti</p><h2 class="section-title">Continue comparando.</h2>
            <div class="property-grid" style="margin-top:2rem">${related.map(cardMarkup).join("")}</div>
            <p class="disclaimer">${data.sourceNote}</p>
          </div>
        </section>
        <dialog class="gallery-dialog" data-property-gallery aria-labelledby="gallery-dialog-title">
          <div class="gallery-dialog-shell">
            <header class="gallery-dialog-header">
              <div><small>Galeria oficial Diálogo</small><h2 id="gallery-dialog-title">${property.shortName}</h2></div>
              <button type="button" class="gallery-dialog-close" data-close-gallery aria-label="Fechar galeria">×</button>
            </header>
            <nav class="gallery-dialog-filters" aria-label="Filtrar imagens">
              <button type="button" aria-pressed="true" data-gallery-filter="todos">Todas <span>${gallery.length}</span></button>
              ${galleryCategories.map((category) => `<button type="button" aria-pressed="false" data-gallery-filter="${escapeHtml(category)}">${escapeHtml(category)} <span>${gallery.filter((item) => item.category === category).length}</span></button>`).join("")}
            </nav>
             <div class="gallery-dialog-grid">${gallery.map((item, index) => galleryItem(item, index)).join("")}</div>
             <footer class="gallery-dialog-footer">Gostou deste empreendimento? <a href="${waLink(interestMessage)}" target="_blank" rel="noopener noreferrer">Fale com a Luana JD pelo WhatsApp →</a></footer>
           </div>
         </dialog>
         <dialog class="image-lightbox" data-image-lightbox aria-label="Visualizador de imagens de ${property.shortName}">
           <div class="image-lightbox-shell">
             <button type="button" class="image-lightbox-close" data-lightbox-close aria-label="Fechar imagem">×</button>
             <button type="button" class="image-lightbox-nav image-lightbox-prev" data-lightbox-prev aria-label="Imagem anterior">←</button>
             <figure class="image-lightbox-figure">
               <img src="" alt="" width="2000" height="1333" data-lightbox-image>
               <figcaption><span data-lightbox-category></span><strong data-lightbox-caption></strong><small data-lightbox-counter></small></figcaption>
             </figure>
             <button type="button" class="image-lightbox-nav image-lightbox-next" data-lightbox-next aria-label="Próxima imagem">→</button>
           </div>
         </dialog>`;

      const galleryDialog = target.querySelector("[data-property-gallery]");
      const lightbox = target.querySelector("[data-image-lightbox]");
      const lightboxImage = lightbox?.querySelector("[data-lightbox-image]");
      const lightboxCaption = lightbox?.querySelector("[data-lightbox-caption]");
      const lightboxCategory = lightbox?.querySelector("[data-lightbox-category]");
      const lightboxCounter = lightbox?.querySelector("[data-lightbox-counter]");
      let visibleGalleryIndices = gallery.map((_, index) => index);
      let activeLightboxIndices = visibleGalleryIndices;
      let lightboxPosition = 0;
      const syncDialogState = () => body.classList.toggle("dialog-open", Boolean(galleryDialog?.open || lightbox?.open));
      const loadGalleryImages = () => galleryDialog?.querySelectorAll("img[data-gallery-src]").forEach((image) => {
        if (!image.src) image.src = image.dataset.gallerySrc;
      });
      const renderLightbox = () => {
        const itemIndex = activeLightboxIndices[lightboxPosition];
        const item = gallery[itemIndex];
        if (!item || !lightboxImage) return;
        lightboxImage.src = item.url;
        lightboxImage.alt = item.caption;
        lightboxCaption.textContent = item.caption;
        lightboxCategory.textContent = item.category;
        lightboxCounter.textContent = `${lightboxPosition + 1} / ${activeLightboxIndices.length}`;
      };
      const openLightbox = (index) => {
        activeLightboxIndices = galleryDialog?.open ? visibleGalleryIndices : gallery.map((_, itemIndex) => itemIndex);
        lightboxPosition = Math.max(0, activeLightboxIndices.indexOf(index));
        renderLightbox();
        lightbox?.showModal();
        syncDialogState();
      };
      const moveLightbox = (direction) => {
        lightboxPosition = (lightboxPosition + direction + activeLightboxIndices.length) % activeLightboxIndices.length;
        renderLightbox();
      };
      target.querySelectorAll(".property-gallery-preview img[data-gallery-src]").forEach((image) => { image.src = image.dataset.gallerySrc; });
      target.addEventListener("click", (event) => {
        const trigger = event.target.closest("[data-lightbox-open]");
        if (trigger) openLightbox(Number(trigger.dataset.lightboxOpen));
      });
      target.querySelector("[data-open-gallery]")?.addEventListener("click", () => {
        loadGalleryImages();
        galleryDialog?.showModal();
        syncDialogState();
      });
      target.querySelector("[data-close-gallery]")?.addEventListener("click", () => galleryDialog?.close());
      galleryDialog?.addEventListener("close", syncDialogState);
      galleryDialog?.addEventListener("click", (event) => { if (event.target === galleryDialog) galleryDialog.close(); });
      lightbox?.querySelector("[data-lightbox-close]")?.addEventListener("click", () => lightbox.close());
      lightbox?.querySelector("[data-lightbox-prev]")?.addEventListener("click", () => moveLightbox(-1));
      lightbox?.querySelector("[data-lightbox-next]")?.addEventListener("click", () => moveLightbox(1));
      lightbox?.addEventListener("close", syncDialogState);
      lightbox?.addEventListener("click", (event) => { if (event.target === lightbox) lightbox.close(); });
      lightbox?.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") { event.preventDefault(); moveLightbox(-1); }
        if (event.key === "ArrowRight") { event.preventDefault(); moveLightbox(1); }
      });
      galleryDialog?.querySelector(".gallery-dialog-filters")?.addEventListener("click", (event) => {
        const button = event.target.closest("[data-gallery-filter]");
        if (!button) return;
        const selected = button.dataset.galleryFilter;
        galleryDialog.querySelectorAll("[data-gallery-filter]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
        galleryDialog.querySelectorAll("[data-gallery-category]").forEach((item) => item.classList.toggle("hidden", selected !== "todos" && item.dataset.galleryCategory !== selected));
        visibleGalleryIndices = gallery.map((item, index) => ({ item, index })).filter(({ item }) => selected === "todos" || item.category === selected).map(({ index }) => index);
      });
      document.title = `${property.shortName} | Luana Donatti`;
    }
  }

  const applicationForm = document.querySelector("[data-application-form]");
  if (applicationForm) {
    const status = applicationForm.querySelector("[data-form-status]");
    const submit = applicationForm.querySelector("button[type='submit']");
    applicationForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      status.className = "form-status";
      if (applicationForm.website.value) return;
      submit.disabled = true;
      submit.textContent = "Enviando...";
      const payload = Object.fromEntries(new FormData(applicationForm).entries());
      try {
        const response = await fetch("/api/candidatura", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result.ok) throw new Error(result.error || "Não foi possível enviar agora.");
        applicationForm.reset();
        status.textContent = "Recebemos seus dados. A equipe da Luana JD fará o contato pelo canal informado.";
        status.className = "form-status success is-visible";
      } catch (error) {
        status.textContent = "Não foi possível concluir o envio agora. Tente novamente ou fale com a Luana JD pelo WhatsApp.";
        status.className = "form-status error is-visible";
      } finally {
        submit.disabled = false;
        submit.textContent = "Enviar meu perfil";
        status.focus?.();
      }
    });
  }

  const revealItems = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: .08 });
    revealItems.forEach((item) => observer.observe(item));
  } else revealItems.forEach((item) => item.classList.add("is-visible"));
})();
