document.addEventListener('DOMContentLoaded', () => {

  // ===== NAVBAR =====
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        link.classList.toggle('active', scrollY >= top && scrollY < top + height);
      }
    });
  });

  // ===== PARTICLES =====
  const particlesContainer = document.getElementById('heroParticles');
  if (particlesContainer) {
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.width = particle.style.height = (Math.random() * 3 + 1) + 'px';
      particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
      particle.style.animationDelay = (Math.random() * 10) + 's';
      particlesContainer.appendChild(particle);
    }
  }

  // ===== ROLES CONFIGURATION =====
  const ROLE_ORDER = {
    'Ekip Başkanı':           0,
    'Ekip Başkan Yardımcısı': 1,
    'Kıdemli Yönetim Kurulu': 2,
    'Yönetim Kurulu':         3,
    'Yönetim Kurulu Adayı':   4,
    'Üye':                    5
  };

  const NON_MEMBER_ROLES = new Set([
    'Ekip Başkanı',
    'Ekip Başkan Yardımcısı',
    'Kıdemli Yönetim Kurulu',
    'Yönetim Kurulu',
    'Yönetim Kurulu Adayı'
  ]);

  // ===== MEMBER DATA (Static from members-data.js) =====
  function getAllMembers() {
    return typeof MEMBERS !== 'undefined' ? [...MEMBERS] : [];
  }

  // ===== COUNTER ANIMATION & STATS =====
  function animateCounter(el, target, duration) {
    if (!el) return;
    const start = 0;
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + (target - start) * eased);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  function updateStatsAndCounters(animate = false) {
    const all = getAllMembers();
    const total = all.length;
    const managers = all.filter(m => NON_MEMBER_ROLES.has(m.role)).length;
    const memberOnly = all.filter(m => !NON_MEMBER_ROLES.has(m.role)).length;

    const memberCountEl = document.getElementById('memberCount');
    const managerCountEl = document.getElementById('managerCount');
    const totalMemberCountEl = document.getElementById('totalMemberCount');

    if (animate) {
      setTimeout(() => {
        animateCounter(memberCountEl, total, 1500);
        animateCounter(managerCountEl, managers, 1500);
      }, 500);
    } else {
      if (memberCountEl) memberCountEl.textContent = total;
      if (managerCountEl) managerCountEl.textContent = managers;
    }

    if (totalMemberCountEl) totalMemberCountEl.textContent = total;

    const countAll = document.getElementById('countAll');
    const countManager = document.getElementById('countManager');
    const countMember = document.getElementById('countMember');
    if (countAll) countAll.textContent = total;
    if (countManager) countManager.textContent = managers;
    if (countMember) countMember.textContent = memberOnly;
  }

  updateStatsAndCounters(true);

  // ===== HELPER FUNCTIONS =====
  function getDisplayName(member) {
    return member.fullName || member.name;
  }

  function getInitials(member) {
    const name = member.fullName || member.name;
    const parts = name.replace(/[_.]/g, ' ').split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  function getUsername(link) {
    const match = (link || '').match(/instagram\.com\/([^/]+)/);
    return match ? '@' + match[1] : '';
  }

  function avatarHTML(member, cssClass, size) {
    const initials = getInitials(member);
    const displayName = getDisplayName(member);
    if (member.photo) {
      return `<div class="${cssClass} has-photo" style="width:${size}px;height:${size}px;min-width:${size}px"><img src="${member.photo}" alt="${displayName}" onerror="this.parentElement.innerHTML='${initials}';this.parentElement.classList.remove('has-photo')"></div>`;
    }
    return `<div class="${cssClass}" style="width:${size}px;height:${size}px;min-width:${size}px">${initials}</div>`;
  }

  // ===== SCROLL REVEAL OBSERVER =====
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ===== FEATURED MEMBERS (YÖNETİM) =====
  const featuredGrid = document.getElementById('featuredGrid');

  function renderFeaturedMembers() {
    if (!featuredGrid) return;
    featuredGrid.innerHTML = '';
    const all = getAllMembers();
    const managerMembers = all.filter(m => NON_MEMBER_ROLES.has(m.role))
      .sort((a, b) => {
        const rDiff = (ROLE_ORDER[a.role] ?? 99) - (ROLE_ORDER[b.role] ?? 99);
        if (rDiff !== 0) return rDiff;
        return getDisplayName(a).localeCompare(getDisplayName(b), 'tr', { sensitivity: 'base' });
      });

    managerMembers.forEach(member => {
      const card = document.createElement('div');
      card.classList.add('featured-card', 'reveal');

      const cityHtml = member.city ? `
        <div class="featured-city">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path>
            <circle cx="12" cy="9" r="2.5"></circle>
          </svg>
          <span>${member.city}</span>
        </div>` : '';

      card.innerHTML = `
        ${avatarHTML(member, 'featured-avatar', 80)}
        <div class="featured-name">${getDisplayName(member)}</div>
        <div class="featured-role">${member.role.toUpperCase()}</div>
        ${cityHtml}
        <a href="${member.link}" target="_blank" rel="noopener" class="featured-link" onclick="event.stopPropagation()">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="2" width="20" height="20" rx="5"></rect>
            <circle cx="12" cy="12" r="5"></circle>
            <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"></circle>
          </svg>
          Profili Görüntüle
        </a>
      `;
      card.addEventListener('click', () => openMemberModal(member));
      featuredGrid.appendChild(card);
    });

    featuredGrid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  }

  renderFeaturedMembers();

  // ===== MEMBERS GRID =====
  const membersGrid = document.getElementById('membersGrid');
  const searchInput = document.getElementById('memberSearch');
  const searchClear = document.getElementById('searchClear');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const noResults = document.getElementById('noResults');

  let currentFilter = 'all';

  function renderMembers(filter, search) {
    if (!membersGrid) return;
    membersGrid.innerHTML = '';
    let filteredMembers = getAllMembers();

    if (filter && filter !== 'all') {
      if (filter === 'yonetim') {
        filteredMembers = filteredMembers.filter(m => NON_MEMBER_ROLES.has(m.role));
      } else {
        filteredMembers = filteredMembers.filter(m => m.role === filter);
      }
    }

    if (search) {
      const q = search.toLowerCase().trim();
      filteredMembers = filteredMembers.filter(m =>
        m.name.toLowerCase().includes(q) ||
        (m.fullName && m.fullName.toLowerCase().includes(q)) ||
        m.role.toLowerCase().includes(q) ||
        (m.city && m.city.toLowerCase().includes(q)) ||
        m.link.toLowerCase().includes(q)
      );
    }

    filteredMembers = [...filteredMembers].sort((a, b) => {
      const rDiff = (ROLE_ORDER[a.role] ?? 99) - (ROLE_ORDER[b.role] ?? 99);
      if (rDiff !== 0) return rDiff;
      return getDisplayName(a).localeCompare(getDisplayName(b), 'tr', { sensitivity: 'base' });
    });

    if (filteredMembers.length === 0) {
      if (noResults) noResults.classList.add('visible');
    } else {
      if (noResults) noResults.classList.remove('visible');
    }

    filteredMembers.forEach((member, i) => {
      const username = getUsername(member.link);
      const isManager = NON_MEMBER_ROLES.has(member.role);
      const avatarClass = isManager ? 'member-avatar manager-avatar' : 'member-avatar member-avatar-blue';
      const roleBadgeClass = member.role === 'Yönetim Kurulu Adayı'
        ? 'role-candidate'
        : (isManager ? 'role-manager' : 'role-member');

      const cityHtml = member.city ? `
        <div class="member-city">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path>
            <circle cx="12" cy="9" r="2.5"></circle>
          </svg>
          <span>${member.city}</span>
        </div>` : '';

      const card = document.createElement('div');
      card.classList.add('member-card');
      card.style.animationDelay = (i * 0.04) + 's';
      card.innerHTML = `
        <div class="member-card-top">
          ${avatarHTML(member, avatarClass, 56)}
          <div class="member-info">
            <div class="member-name">${getDisplayName(member)}</div>
            <span class="member-role ${roleBadgeClass}">
              ${member.role}
            </span>
            ${cityHtml}
          </div>
        </div>
        <div class="member-card-actions">
          <a href="${member.link}" target="_blank" rel="noopener" class="member-profile-link" onclick="event.stopPropagation()">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="2" width="20" height="20" rx="5"></rect>
              <circle cx="12" cy="12" r="5"></circle>
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"></circle>
            </svg>
            ${username}
          </a>
        </div>
      `;
      card.addEventListener('click', () => openMemberModal(member));
      membersGrid.appendChild(card);
    });
  }

  renderMembers('all', '');

  // Search
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      if (searchClear) searchClear.classList.toggle('visible', val.length > 0);
      renderMembers(currentFilter, val);
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      searchClear.classList.remove('visible');
      renderMembers(currentFilter, '');
    });
  }

  // Filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderMembers(currentFilter, searchInput ? searchInput.value : '');
    });
  });

  // ===== MEMBER MODAL =====
  const modal = document.getElementById('memberModal');
  const modalBody = document.getElementById('modalBody');

  function openMemberModal(member) {
    if (!modal || !modalBody) return;
    const isManager = NON_MEMBER_ROLES.has(member.role);
    const username = getUsername(member.link);
    const modalAvatarClass = isManager ? 'modal-avatar mgr' : 'modal-avatar mbr';
    const roleBadgeClass = member.role === 'Yönetim Kurulu Adayı'
      ? 'role-candidate'
      : (isManager ? 'role-manager' : 'role-member');

    const fullNameRow = member.fullName ? `
        <div class="modal-detail">
          <div class="modal-detail-icon">&#128100;</div>
          <div class="modal-detail-text">
            <div class="modal-detail-label">İsim Soyisim</div>
            <div class="modal-detail-value">${member.fullName}</div>
          </div>
        </div>` : '';

    const cityRow = member.city ? `
        <div class="modal-detail">
          <div class="modal-detail-icon">&#128205;</div>
          <div class="modal-detail-text">
            <div class="modal-detail-label">Şehir / Havalimanı</div>
            <div class="modal-detail-value">${member.city}</div>
          </div>
        </div>` : '';

    modalBody.innerHTML = `
      <div class="modal-header">
        ${avatarHTML(member, modalAvatarClass, 100)}
        <div class="modal-name">${getDisplayName(member)}</div>
        <span class="modal-role-badge ${roleBadgeClass}">
          ${member.role}
        </span>
      </div>
      <div class="modal-body-content">
        ${fullNameRow}
        <div class="modal-detail">
          <div class="modal-detail-icon">&#128100;</div>
          <div class="modal-detail-text">
            <div class="modal-detail-label">Kullanıcı Adı</div>
            <div class="modal-detail-value">${member.name || username}</div>
          </div>
        </div>
        <div class="modal-detail">
          <div class="modal-detail-icon">&#127942;</div>
          <div class="modal-detail-text">
            <div class="modal-detail-label">Mevki</div>
            <div class="modal-detail-value">${member.role}</div>
          </div>
        </div>
        ${cityRow}
        <div class="modal-detail">
          <div class="modal-detail-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="2" width="20" height="20" rx="5"></rect>
              <circle cx="12" cy="12" r="5"></circle>
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"></circle>
            </svg>
          </div>
          <div class="modal-detail-text">
            <div class="modal-detail-label">Instagram</div>
            <div class="modal-detail-value">
              <a href="${member.link}" target="_blank" rel="noopener">${username}</a>
            </div>
          </div>
        </div>
        <div class="modal-action">
          <a href="${member.link}" target="_blank" rel="noopener" class="btn btn-primary">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="2" width="20" height="20" rx="5"></rect>
              <circle cx="12" cy="12" r="5"></circle>
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"></circle>
            </svg>
            Instagram Profilini Ziyaret Et
          </a>
        </div>
      </div>
    `;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  if (modal) {
    const closeBtn = modal.querySelector('.modal-close');
    const backdrop = modal.querySelector('.modal-backdrop');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);
  }

  function closeModal() {
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeLightbox();
    }
  });

  // ===== GALLERY DATA =====
  const GALLERY_PHOTOS = [
    {
      file: 'img/a350.jpg',
      airline: 'Turkish Airlines',
      model: 'Airbus A350-900',
      category: 'commercial'
    },
    {
      file: 'img/THY 777.jpg',
      airline: 'Turkish Airlines',
      model: 'Boeing 777',
      category: 'commercial'
    },
    {
      file: 'img/A320 Neo pegasus.jpg',
      airline: 'Pegasus Airlines',
      model: 'Airbus A320neo',
      category: 'commercial'
    },
    {
      file: 'img/Ajet A321 Neo.jpg',
      airline: 'AJet',
      model: 'Airbus A321neo',
      category: 'commercial'
    },
    {
      file: 'img/Ajet Boeing 737-800.jpg',
      airline: 'AJet',
      model: 'Boeing 737-800',
      category: 'commercial'
    },
    {
      file: 'img/Türk Yıldızları.jpg',
      airline: 'Türk Hava Kuvvetleri',
      model: 'Türk Yıldızları',
      category: 'military'
    },
    {
      file: 'img/Solotürk.jpg',
      airline: 'Türk Hava Kuvvetleri',
      model: 'SoloTürk — F-16',
      category: 'military'
    },
    {
      file: 'img/TC-HGE ambulans helikopter.jpg',
      airline: 'TC-HGE',
      model: 'Ambulans Helikopter',
      category: 'general'
    },
    {
      file: 'img/İran airtour A320-200.jpg',
      airline: 'Iran Air Tour',
      model: 'Airbus A320-200',
      category: 'commercial'
    }
  ];

  // ===== GALLERY RENDER =====
  const galleryGrid = document.getElementById('galleryGrid');

  function renderGallery(filter) {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';
    const filtered = filter === 'all'
      ? GALLERY_PHOTOS
      : GALLERY_PHOTOS.filter(p => p.category === filter);

    filtered.forEach(photo => {
      const item = document.createElement('div');
      item.classList.add('gallery-item', 'reveal');
      item.dataset.category = photo.category;
      item.innerHTML = `
        <div class="gallery-img">
          <img src="${photo.file}" alt="${photo.airline} ${photo.model}" loading="lazy">
        </div>
        <div class="gallery-info">
          <h4>${photo.model}</h4>
          <p>${photo.airline}</p>
        </div>
      `;
      item.addEventListener('click', () => openLightbox(photo));
      galleryGrid.appendChild(item);
    });

    galleryGrid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  }

  renderGallery('all');

  // ===== GALLERY FILTER =====
  const galleryCatBtns = document.querySelectorAll('.gallery-cat-btn');

  galleryCatBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryCatBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderGallery(btn.dataset.category);
    });
  });

  // ===== LIGHTBOX =====
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxInfo = document.getElementById('lightboxInfo');

  function openLightbox(photo) {
    if (!lightbox || !lightboxImg || !lightboxInfo) return;
    lightboxImg.innerHTML = `<img src="${photo.file}" alt="${photo.airline} ${photo.model}">`;
    lightboxInfo.textContent = `${photo.model} — ${photo.airline}`;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  if (lightbox) {
    const lbClose = lightbox.querySelector('.lightbox-close');
    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || !lightbox.querySelector('.lightbox-content').contains(e.target)) {
        closeLightbox();
      }
    });
  }

  function closeLightbox() {
    if (lightbox) lightbox.classList.remove('active');
    if (modal && !modal.classList.contains('active')) {
      document.body.style.overflow = '';
    }
  }
});
