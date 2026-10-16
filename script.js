/**
 * UAMC.LV - Būvniecības un Mūrēšanas Pakalpojumi
 * Dynamic Industrial Logic, Calculator & Lightbox
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Navigation
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mainNav = document.getElementById('mainNav');

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      const isExpanded = mainNav.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close mobile menu on link click
    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
      });
    });
  }

  // 2. Portfolio Category Filtering
  const filterBtns = document.querySelectorAll('.filter-btn-ind');
  const portfolioBlocks = document.querySelectorAll('.portfolio-block');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioBlocks.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 3. Lightbox Modal Functionality
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClose = document.getElementById('lightboxClose');

  portfolioBlocks.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.portfolio-title-text');
      const loc = item.querySelector('.portfolio-loc-tag');

      if (lightboxModal && img && title) {
        lightboxImg.src = img.src;
        lightboxImg.alt = title.textContent;
        lightboxTitle.textContent = title.textContent;
        lightboxDesc.textContent = loc ? loc.textContent : '';
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (lightboxClose && lightboxModal) {
    lightboxClose.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    });

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // 4. Interactive Industrial Tāmes Konfigurators
  const serviceInputs = document.querySelectorAll('input[name="calc_service"]');
  const areaSlider = document.getElementById('areaSlider');
  const areaValueDisplay = document.getElementById('areaValueDisplay');
  const summaryTotal = document.getElementById('summaryTotal');
  const summaryMetaText = document.getElementById('summaryMetaText');
  const calcApplyBtn = document.getElementById('calcApplyBtn');

  const serviceRates = {
    muresana: { name: 'Mūrēšana (Bauroc / Ytong)', unit: 'm²', rate: 26, min: 30, max: 400, step: 5, defaultVal: 120 },
    fasades: { name: 'Fasādes siltināšana & apdare', unit: 'm²', rate: 38, min: 40, max: 350, step: 5, defaultVal: 140 },
    pamati: { name: 'Pamatu & plātnes betonēšana', unit: 'm²', rate: 55, min: 40, max: 250, step: 5, defaultVal: 90 }
  };

  function updateCalculator() {
    let selectedService = 'muresana';
    serviceInputs.forEach(input => {
      if (input.checked) {
        selectedService = input.value;
      }
    });

    const config = serviceRates[selectedService] || serviceRates.muresana;
    const currentArea = parseInt(areaSlider.value, 10);

    if (areaValueDisplay) areaValueDisplay.textContent = `${currentArea} ${config.unit}`;
    
    const totalEstimate = Math.round(currentArea * config.rate);
    if (summaryTotal) {
      summaryTotal.textContent = `€${totalEstimate.toLocaleString('lv-LV')}`;
    }
    if (summaryMetaText) {
      summaryMetaText.textContent = `Likme ~€${config.rate} / ${config.unit} • ${config.name}`;
    }
  }

  serviceInputs.forEach(input => {
    input.addEventListener('change', () => {
      const selected = input.value;
      const config = serviceRates[selected];
      if (config && areaSlider) {
        areaSlider.min = config.min;
        areaSlider.max = config.max;
        areaSlider.step = config.step;
        areaSlider.value = config.defaultVal;
      }
      updateCalculator();
    });
  });

  if (areaSlider) {
    areaSlider.addEventListener('input', updateCalculator);
  }

  if (calcApplyBtn) {
    calcApplyBtn.addEventListener('click', () => {
      const contactSection = document.getElementById('kontakti');
      const serviceSelect = document.getElementById('contactService');
      const messageField = document.getElementById('contactMessage');

      let selectedVal = 'muresana';
      serviceInputs.forEach(input => {
        if (input.checked) selectedVal = input.value;
      });

      if (serviceSelect) {
        serviceSelect.value = selectedVal;
      }

      if (messageField && areaSlider) {
        const config = serviceRates[selectedVal];
        messageField.value = `Labdien! Vēlos pieteikt tāmes aprēķinu: ${config.name}, apjoms: ${areaSlider.value} ${config.unit}.`;
      }

      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Initial update
  updateCalculator();

  // 5. Contact Form Submission
  const leadForm = document.getElementById('leadContactForm');
  const toastNotice = document.getElementById('toastNotice');

  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('submitLeadBtn');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'NOSŪTA...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = '✓ PIETEIKUMS NOSŪTĪTS';
        submitBtn.style.backgroundColor = '#10b981';

        if (toastNotice) {
          toastNotice.classList.add('show');
          setTimeout(() => {
            toastNotice.classList.remove('show');
          }, 5000);
        }

        leadForm.reset();

        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.backgroundColor = '';
        }, 3000);
      }, 700);
    });
  }
});
