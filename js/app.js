document.addEventListener('DOMContentLoaded', () => {

  // ===== NAVBAR =====
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }
  });

  if (navToggle && navMenu) {
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
  }

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 120;
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

  // ===== PARTICLES BACKGROUND =====
  const particlesContainer = document.getElementById('heroParticles');
  if (particlesContainer) {
    particlesContainer.innerHTML = '';
    for (let i = 0; i < 35; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.width = particle.style.height = (Math.random() * 3 + 1.5) + 'px';
      particle.style.animationDuration = (Math.random() * 14 + 10) + 's';
      particle.style.animationDelay = (Math.random() * 8) + 's';
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

  const ROLE_META = {
    'Ekip Başkanı': {
      icon: '👑',
      badgeClass: 'role-president',
      title: 'Ekip Başkanı'
    },
    'Ekip Başkan Yardımcısı': {
      icon: '⭐',
      badgeClass: 'role-vice-president',
      title: 'Ekip Başkan Yardımcısı'
    },
    'Kıdemli Yönetim Kurulu': {
      icon: '🛡️',
      badgeClass: 'role-senior-board',
      title: 'Kıdemli Yönetim Kurulu'
    },
    'Yönetim Kurulu': {
      icon: '✈️',
      badgeClass: 'role-board',
      title: 'Yönetim Kurulu'
    },
    'Yönetim Kurulu Adayı': {
      icon: '⚡',
      badgeClass: 'role-candidate',
      title: 'Yönetim Kurulu Adayı'
    },
    'Üye': {
      icon: '📷',
      badgeClass: 'role-member',
      title: 'Spotter'
    }
  };

  const NON_MEMBER_ROLES = new Set([
    'Ekip Başkanı',
    'Ekip Başkan Yardımcısı',
    'Kıdemli Yönetim Kurulu',
    'Yönetim Kurulu',
    'Yönetim Kurulu Adayı'
  ]);

  // ===== MEMBER DATA STATE =====
  // Default to static MEMBERS loaded from members-data.js (robust offline / file:// support)
  let currentMembersList = typeof MEMBERS !== 'undefined' ? [...MEMBERS] : [];

  function getAllMembers() {
    return currentMembersList;
  }

  // ===== TRY DYNAMIC LOAD FROM EXCEL (if running on HTTP/HTTPS server) =====
  async function tryLoadFromExcel() {
    if (typeof XLSX === 'undefined') return;
    try {
      const res = await fetch('üyeller.xlsx', { cache: 'no-cache' });
      if (!res.ok) return;
      const arrayBuffer = await res.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      if (!jsonData || jsonData.length <= 1) return;

      const knownPhotos = {
        'spoterkrinco': 'img/members/Emir Ali Aydar.jpg',
        'cinarspotting': 'img/members/Çağan Çınar.jpg',
        'spotter_ruzgar': 'img/members/Rüzgar Büyükyenigün.jpg',
        'emrespotter': 'img/members/Emre Bıyık.jpg',
        'ltauspotter': 'img/members/Ltau Spoter.jpg',
        'spotterahmet58': 'img/members/Ahmet güney üzüm.jpg',
        'spotter_taha1': 'img/members/Taha ARslan.jpg',
        'memospotting': 'img/members/Mehmet Küçükalemdar.jpg',
        'spotter_keremm': 'img/members/Ali Kerem Öztürk.jpg'
      };

      const parsed = [];
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (!row || !row[0]) continue;
        const link = String(row[0] || '').trim();
        const role = String(row[1] || 'Üye').trim();
        let fullName = String(row[2] || '').trim();
        const city = String(row[3] || '').trim();

        let username = link;
        if (link.includes('instagram.com/')) {
          username = link.split('instagram.com/')[1].split('/')[0].split('?')[0];
        }

        if (username === 'memospotting' && (!fullName || fullName === 'memospotting')) {
          fullName = 'Mehmet Küçükalemdar';
        } else if (username === 'spotter_keremm' && !fullName) {
          fullName = 'Ali Kerem Öztürk';
        }

        const photo = knownPhotos[username] || '';

        parsed.push({
          name: username,
          fullName: fullName,
          city: city,
          role: role,
          link: link,
          photo: photo
        });
      }

      if (parsed.length > 0) {
        currentMembersList = parsed;
        console.log(`[AST] Excel (üyeller.xlsx) güncel verileri başarıyla yüklendi: ${parsed.length} üye.`);
        updateStatsAndCounters(false);
        renderFeaturedMembers();
        renderMembers(currentFilter, searchInput ? searchInput.value : '');
      }
    } catch (e) {
      // Offline or CORS restricted — static MEMBERS is already serving
    }
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
        animateCounter(memberCountEl, total, 1400);
        animateCounter(managerCountEl, managers, 1400);
      }, 400);
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

  function getUsername(link, fallbackName) {
    if (fallbackName && !fallbackName.startsWith('http')) {
      return '@' + fallbackName;
    }
    const match = (link || '').match(/instagram\.com\/([^/]+)/);
    return match ? '@' + match[1] : '';
  }

  function getCleanHandle(member) {
    if (member.name) return member.name;
    const match = (member.link || '').match(/instagram\.com\/([^/]+)/);
    return match ? match[1] : '';
  }

  function formatLocationHTML(cityStr) {
    if (!cityStr) return '';
    if (cityStr.includes('/')) {
      const parts = cityStr.split('/');
      const city = parts[0].trim();
      const icao = parts[1].trim();
      return `
        <div class="member-location">
          <span class="icao-badge">${icao}</span>
          <span class="city-name">${city}</span>
        </div>
      `;
    }
    return `
      <div class="member-location">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path>
          <circle cx="12" cy="9" r="2.5"></circle>
        </svg>
        <span class="city-name">${cityStr}</span>
      </div>
    `;
  }

  function avatarHTML(member, cssClass, size) {
    const displayName = getDisplayName(member);
    const hasPhoto = Boolean(member.photo);
    const photoSrc = hasPhoto ? member.photo : 'img/default-avatar.svg';
    const isManager = NON_MEMBER_ROLES.has(member.role);
    const roleBorderClass = isManager ? 'avatar-mgr' : 'avatar-mbr';
    const defaultClass = !hasPhoto ? 'is-default-avatar' : 'has-custom-photo';

    return `
      <div class="${cssClass} ${roleBorderClass} ${defaultClass}" style="width:${size}px;height:${size}px;min-width:${size}px">
        <img src="${photoSrc}" alt="${displayName}" loading="lazy" onerror="this.onerror=null;this.src='img/default-avatar.svg';this.parentElement.classList.add('is-default-avatar');">
      </div>
    `;
  }

  // ===== SCROLL REVEAL OBSERVER =====
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ===== FEATURED MEMBERS (YÖNETİM KADROSU) =====
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

      const meta = ROLE_META[member.role] || { icon: '✈️', badgeClass: 'role-manager' };
      const handle = getCleanHandle(member);
      const isNamed = Boolean(member.fullName);

      card.innerHTML = `
        <div class="featured-badge ${meta.badgeClass}">
          <span class="badge-icon">${meta.icon}</span>
          <span>${member.role.toUpperCase()}</span>
        </div>
        <div class="featured-avatar-wrap">
          ${avatarHTML(member, 'featured-avatar', 92)}
        </div>
        <div class="featured-info">
          <div class="featured-name">${getDisplayName(member)}</div>
          ${isNamed ? `<div class="featured-handle">@${handle}</div>` : ''}
          ${formatLocationHTML(member.city)}
        </div>
        <div class="featured-actions">
          <a href="${member.link}" target="_blank" rel="noopener" class="featured-ig-btn" onclick="event.stopPropagation()">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="2" width="20" height="20" rx="5"></rect>
              <circle cx="12" cy="12" r="5"></circle>
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"></circle>
            </svg>
            <span>Instagram'da Takip Et</span>
            <span class="btn-arrow">&#8599;</span>
          </a>
        </div>
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
        (m.name && m.name.toLowerCase().includes(q)) ||
        (m.fullName && m.fullName.toLowerCase().includes(q)) ||
        (m.role && m.role.toLowerCase().includes(q)) ||
        (m.city && m.city.toLowerCase().includes(q)) ||
        (m.link && m.link.toLowerCase().includes(q))
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
      const handle = getCleanHandle(member);
      const isNamed = Boolean(member.fullName);
      const meta = ROLE_META[member.role] || { icon: '📷', badgeClass: 'role-member' };

      const card = document.createElement('div');
      card.classList.add('member-card');
      card.style.animationDelay = (i * 0.03) + 's';

      card.innerHTML = `
        <div class="member-card-header">
          <div class="member-avatar-box">
            ${avatarHTML(member, 'member-avatar', 66)}
          </div>
          <div class="member-primary">
            <div class="member-title-row">
              <span class="member-card-name" title="${getDisplayName(member)}">${getDisplayName(member)}</span>
            </div>
            ${isNamed ? `<div class="member-card-handle">@${handle}</div>` : ''}
            <div class="member-badge-row">
              <span class="member-role-badge ${meta.badgeClass}">
                <span class="role-icon">${meta.icon}</span> ${member.role}
              </span>
            </div>
          </div>
        </div>

        <div class="member-card-details">
          ${formatLocationHTML(member.city)}
        </div>

        <div class="member-card-actions">
          <a href="${member.link}" target="_blank" rel="noopener" class="member-profile-btn" onclick="event.stopPropagation()">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="2" width="20" height="20" rx="5"></rect>
              <circle cx="12" cy="12" r="5"></circle>
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"></circle>
            </svg>
            <span class="btn-text">@${handle}</span>
            <span class="arrow-sym">&#8599;</span>
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
    const handle = getCleanHandle(member);
    const meta = ROLE_META[member.role] || { icon: '📷', badgeClass: 'role-member' };

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
          <div class="modal-detail-label">Şehir & Havalimanı (ICAO)</div>
          <div class="modal-detail-value">${member.city}</div>
        </div>
      </div>` : '';

    modalBody.innerHTML = `
      <div class="modal-header">
        <div class="modal-avatar-container">
          ${avatarHTML(member, 'modal-avatar', 110)}
        </div>
        <div class="modal-name">${getDisplayName(member)}</div>
        <div class="modal-handle">@${handle}</div>
        <div class="modal-badge-wrap">
          <span class="modal-role-badge ${meta.badgeClass}">
            <span class="role-icon">${meta.icon}</span> ${member.role}
          </span>
        </div>
      </div>
      <div class="modal-body-content">
        ${fullNameRow}
        <div class="modal-detail">
          <div class="modal-detail-icon">&#128247;</div>
          <div class="modal-detail-text">
            <div class="modal-detail-label">Instagram Kullanıcı Adı</div>
            <div class="modal-detail-value">@${handle}</div>
          </div>
        </div>
        <div class="modal-detail">
          <div class="modal-detail-icon">&#127942;</div>
          <div class="modal-detail-text">
            <div class="modal-detail-label">Ekip Görevi</div>
            <div class="modal-detail-value">${member.role}</div>
          </div>
        </div>
        ${cityRow}
        <div class="modal-action">
          <a href="${member.link}" target="_blank" rel="noopener" class="btn btn-primary modal-btn">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="2" width="20" height="20" rx="5"></rect>
              <circle cx="12" cy="12" r="5"></circle>
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"></circle>
            </svg>
            Instagram Profilini Görüntüle &#8599;
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

  // ===== GALLERY DATA (All 13 project spotting photos) =====
  const GALLERY_PHOTOS = [
    {
      file: 'img/a350.jpg',
      airline: 'Turkish Airlines',
      model: 'Airbus A350-900',
      category: 'commercial',
      desc: 'İstanbul Havalimanı (LTFM)'
    },
    {
      file: 'img/THY 777.jpg',
      airline: 'Turkish Airlines',
      model: 'Boeing 777-300ER',
      category: 'commercial',
      desc: 'İstanbul Havalimanı (LTFM)'
    },
    {
      file: 'img/A320 Neo pegasus.jpg',
      airline: 'Pegasus Airlines',
      model: 'Airbus A320neo',
      category: 'commercial',
      desc: 'Sabiha Gökçen Havalimanı (LTFJ)'
    },
    {
      file: 'img/Pegasus A320 NEO.jpg',
      airline: 'Pegasus Airlines',
      model: 'Airbus A320neo (TC-NCJ)',
      category: 'commercial',
      desc: 'Short Final Yaklaşması'
    },
    {
      file: 'img/Ajet 737 Max 8.jpg',
      airline: 'AJet',
      model: 'Boeing 737 MAX 8',
      category: 'commercial',
      desc: 'Yeni Filo Renkleri'
    },
    {
      file: 'img/Ajet A321 Neo.jpg',
      airline: 'AJet',
      model: 'Airbus A321neo',
      category: 'commercial',
      desc: 'Pist Başı Tırmanış'
    },
    {
      file: 'img/Ajet Boeing 737-800.jpg',
      airline: 'AJet',
      model: 'Boeing 737-800',
      category: 'commercial',
      desc: 'İniş Hattı'
    },
    {
      file: 'img/indeniosa a340.jpg.jpeg',
      airline: 'Hi Fly / Garuda Indonesia',
      model: 'Airbus A340-300',
      category: 'commercial',
      desc: 'Dört Motorlu Efsane'
    },
    {
      file: 'img/İran airtour A320-200.jpg',
      airline: 'Iran Air Tour',
      model: 'Airbus A320-200',
      category: 'commercial',
      desc: 'Uluslararası Sefer'
    },
    {
      file: 'img/Solotürk.jpg',
      airline: 'Türk Hava Kuvvetleri',
      model: 'F-16C Blok 30 SoloTürk',
      category: 'military',
      desc: 'Akrobasi Uçuşu'
    },
    {
      file: 'img/Türk Yıldızları.jpg',
      airline: 'Türk Hava Kuvvetleri',
      model: 'NF-5A/B Türk Yıldızları',
      category: 'military',
      desc: 'Milli Gururumuz'
    },
    {
      file: 'img/A400 Atlas.jpg',
      airline: 'Türk Hava Kuvvetleri',
      model: 'Airbus A400M Atlas',
      category: 'military',
      desc: 'Stratejik Askeri Nakliye'
    },
    {
      file: 'img/TC-HGE ambulans helikopter.jpg',
      airline: 'T.C. Sağlık Bakanlığı',
      model: 'EC-135 Ambulans Helikopter',
      category: 'general',
      desc: 'TC-HGE Acil Havacılık'
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
          <div class="gallery-hover-overlay">
            <span class="gallery-zoom-icon">&#128269;</span>
          </div>
        </div>
        <div class="gallery-info">
          <h4>${photo.model}</h4>
          <p class="gallery-airline">${photo.airline}</p>
          <span class="gallery-badge">${photo.desc || ''}</span>
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
    lightboxInfo.innerHTML = `
      <h3>${photo.model}</h3>
      <p>${photo.airline} &bull; ${photo.desc || ''}</p>
    `;
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

  // Attempt dynamic load from Excel if supported
  tryLoadFromExcel();
});
