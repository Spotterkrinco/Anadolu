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
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = Math.random() * 100 + '%';
    particle.style.width = particle.style.height = (Math.random() * 3 + 1) + 'px';
    particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
    particle.style.animationDelay = (Math.random() * 10) + 's';
    particlesContainer.appendChild(particle);
  }

  // ===== COUNTER ANIMATION =====
  const totalMembers = MEMBERS.length;
  const managers = MEMBERS.filter(m => m.role === 'Manager').length;
  const memberOnly = MEMBERS.filter(m => m.role === 'Member').length;

  function animateCounter(el, target, duration) {
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

  const memberCountEl = document.getElementById('memberCount');
  const managerCountEl = document.getElementById('managerCount');
  const totalMemberCountEl = document.getElementById('totalMemberCount');

  setTimeout(() => {
    animateCounter(memberCountEl, totalMembers, 1500);
    animateCounter(managerCountEl, managers, 1500);
  }, 500);
  totalMemberCountEl.textContent = totalMembers;

  // Filter counts
  document.getElementById('countAll').textContent = totalMembers;
  document.getElementById('countManager').textContent = managers;
  document.getElementById('countMember').textContent = memberOnly;

  // ===== FEATURED MEMBERS (MANAGERS) =====
  const featuredGrid = document.getElementById('featuredGrid');
  const managerMembers = MEMBERS.filter(m => m.role === 'Manager');

  managerMembers.forEach(member => {
    const card = document.createElement('div');
    card.classList.add('featured-card', 'reveal');
    card.innerHTML = `
      ${avatarHTML(member, 'featured-avatar', 80)}
      <div class="featured-name">${member.name}</div>
      <div class="featured-role">MANAGER</div>
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

  // ===== MEMBERS GRID =====
  const membersGrid = document.getElementById('membersGrid');
  const searchInput = document.getElementById('memberSearch');
  const searchClear = document.getElementById('searchClear');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const noResults = document.getElementById('noResults');

  let currentFilter = 'all';

  function getInitials(name) {
    const parts = name.replace(/[_\.]/g, ' ').split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  function getUsername(link) {
    const match = link.match(/instagram\.com\/([^/]+)/);
    return match ? '@' + match[1] : '';
  }

  function avatarHTML(member, cssClass, size) {
    const initials = getInitials(member.name);
    if (member.photo) {
      return `<div class="${cssClass} has-photo" style="width:${size}px;height:${size}px;min-width:${size}px"><img src="${member.photo}" alt="${member.name}" onerror="this.parentElement.innerHTML='${initials}';this.parentElement.classList.remove('has-photo')"></div>`;
    }
    return `<div class="${cssClass}" style="width:${size}px;height:${size}px;min-width:${size}px">${initials}</div>`;
  }

  function renderMembers(filter, search) {
    membersGrid.innerHTML = '';
    let filteredMembers = MEMBERS;

    if (filter && filter !== 'all') {
      filteredMembers = filteredMembers.filter(m => m.role === filter);
    }

    if (search) {
      const q = search.toLowerCase();
      filteredMembers = filteredMembers.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.link.toLowerCase().includes(q)
      );
    }

    if (filteredMembers.length === 0) {
      noResults.classList.add('visible');
    } else {
      noResults.classList.remove('visible');
    }

    filteredMembers.forEach((member, i) => {
      const username = getUsername(member.link);
      const isManager = member.role === 'Manager';
      const avatarClass = isManager ? 'member-avatar manager-avatar' : 'member-avatar member-avatar-blue';
      const card = document.createElement('div');
      card.classList.add('member-card');
      card.style.animationDelay = (i * 0.05) + 's';
      card.innerHTML = `
        <div class="member-card-top">
          ${avatarHTML(member, avatarClass, 56)}
          <div class="member-info">
            <div class="member-name">${member.name}</div>
            <span class="member-role ${isManager ? 'role-manager' : 'role-member'}">
              ${member.role}
            </span>
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
  searchInput.addEventListener('input', (e) => {
    const val = e.target.value;
    searchClear.classList.toggle('visible', val.length > 0);
    renderMembers(currentFilter, val);
  });

  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchClear.classList.remove('visible');
    renderMembers(currentFilter, '');
    searchInput.focus();
  });

  // Filter
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderMembers(currentFilter, searchInput.value);
    });
  });

  // ===== MEMBER MODAL =====
  const modal = document.getElementById('memberModal');
  const modalBody = document.getElementById('modalBody');

  function openMemberModal(member) {
    const isManager = member.role === 'Manager';
    const username = getUsername(member.link);
    const modalAvatarClass = isManager ? 'modal-avatar mgr' : 'modal-avatar mbr';

    modalBody.innerHTML = `
      <div class="modal-header">
        ${avatarHTML(member, modalAvatarClass, 100)}
        <div class="modal-name">${member.name}</div>
        <span class="modal-role-badge ${isManager ? 'role-manager' : 'role-member'}">
          ${member.role}
        </span>
      </div>
      <div class="modal-body-content">
        <div class="modal-detail">
          <div class="modal-detail-icon">&#128100;</div>
          <div class="modal-detail-text">
            <div class="modal-detail-label">Kullanıcı Adı</div>
            <div class="modal-detail-value">${member.name}</div>
          </div>
        </div>
        <div class="modal-detail">
          <div class="modal-detail-icon">&#127942;</div>
          <div class="modal-detail-text">
            <div class="modal-detail-label">Mevki</div>
            <div class="modal-detail-value">${member.role}</div>
          </div>
        </div>
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

  modal.querySelector('.modal-close').addEventListener('click', closeModal);
  modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeLightbox();
    }
  });

  // ===== GALLERY FILTER =====
  const galleryCatBtns = document.querySelectorAll('.gallery-cat-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryCatBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryCatBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.category;
      galleryItems.forEach(item => {
        if (cat === 'all' || item.dataset.category === cat) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // ===== LIGHTBOX =====
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxInfo = document.getElementById('lightboxInfo');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const title = item.querySelector('.gallery-info h4')?.textContent || '';
      const desc = item.querySelector('.gallery-info p')?.textContent || '';
      const placeholder = item.querySelector('.gallery-placeholder');
      if (placeholder) {
        lightboxImg.innerHTML = placeholder.outerHTML;
        lightboxImg.querySelector('.gallery-placeholder').style.height = '300px';
        lightboxImg.querySelector('.gallery-placeholder span').style.fontSize = '72px';
      }
      lightboxInfo.textContent = `${title} — ${desc}`;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    if (!modal.classList.contains('active')) {
      document.body.style.overflow = '';
    }
  }

  // ===== SCROLL REVEAL =====
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // Re-observe featured cards after they're rendered
  document.querySelectorAll('.featured-card.reveal').forEach(el => revealObserver.observe(el));
});
