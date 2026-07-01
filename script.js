document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. NAVBAR SCROLL EFFECT
  // ==========================================
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ==========================================
  // 2. MOBILE MENU MENU TOGGLE
  // ==========================================
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinksList = document.querySelectorAll('.nav-links a');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navLinksList.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
      
      // Update active state
      navLinksList.forEach(lnk => lnk.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Update active navigation link on scroll
  const sections = document.querySelectorAll('section');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 120)) {
        current = section.getAttribute('id');
      }
    });

    navLinksList.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // ==========================================
  // 3. SCROLL REVEAL ANIMATION (INTERSECTION OBSERVER)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve once animated
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================
  // 4. STAT COUNTERS ANIMATION
  // ==========================================
  const statsSection = document.querySelector('.about-section');
  const statNumbers = document.querySelectorAll('.stat-number');
  let countersStarted = false;

  const startCounters = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const duration = 2000; // 2 seconds
      const stepTime = Math.abs(Math.floor(duration / target));
      let current = 0;
      
      const timer = setInterval(() => {
        current += Math.ceil(target / 40); // Increment speed adjustment
        if (current >= target) {
          stat.textContent = target + (stat.textContent.includes('%') || target === 99 ? '%' : '+');
          clearInterval(timer);
        } else {
          stat.textContent = current;
        }
      }, stepTime);
    });
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        startCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3
  });

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // ==========================================
  // 5. DOCTORS SPECIALTY FILTER
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const doctorCards = document.querySelectorAll('.doctor-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      doctorCards.forEach(card => {
        card.classList.remove('fade-in-animation');
        const specialty = card.getAttribute('data-specialty');

        if (filterValue === 'all' || specialty === filterValue) {
          card.classList.remove('hidden');
          // Trigger reflow for animation restart
          void card.offsetWidth;
          card.classList.add('fade-in-animation');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ==========================================
  // 6. BOOKING FORM PRE-SELECTION FROM CARDS
  // ==========================================
  const selectDocBtns = document.querySelectorAll('.select-doctor-btn');
  const deptSelect = document.getElementById('pDept');
  const docSelect = document.getElementById('pDoc');

  selectDocBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const docName = btn.getAttribute('data-name');
      const docDept = btn.getAttribute('data-dept');

      // Pre-select Department
      for (let option of deptSelect.options) {
        if (option.value === docDept || option.text.includes(docDept)) {
          deptSelect.value = option.value;
          break;
        }
      }

      // Pre-select Doctor
      for (let option of docSelect.options) {
        if (option.value === docName || option.text.includes(docName)) {
          docSelect.value = option.value;
          break;
        }
      }
    });
  });

  // ==========================================
  // 7. TESTIMONIALS SLIDER
  // ==========================================
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');
  const dotsContainer = document.getElementById('sliderDots');
  let currentSlide = 0;
  let sliderInterval;

  // Create dot elements
  slides.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.classList.add('slide-dot');
    if (idx === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(idx));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.slide-dot');

  const updateSliderUI = () => {
    slides.forEach((slide, idx) => {
      slide.classList.remove('active');
      dots[idx].classList.remove('active');
    });
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  };

  const nextSlideFunc = () => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSliderUI();
  };

  const prevSlideFunc = () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSliderUI();
  };

  const goToSlide = (idx) => {
    currentSlide = idx;
    updateSliderUI();
    resetAutoPlay();
  };

  const startAutoPlay = () => {
    sliderInterval = setInterval(nextSlideFunc, 6000); // 6 seconds auto-rotate
  };

  const resetAutoPlay = () => {
    clearInterval(sliderInterval);
    startAutoPlay();
  };

  if (slides.length > 0) {
    prevBtn.addEventListener('click', () => {
      prevSlideFunc();
      resetAutoPlay();
    });
    
    nextBtn.addEventListener('click', () => {
      nextSlideFunc();
      resetAutoPlay();
    });

    startAutoPlay();

    // Pause autoplay when hovering over testimonials
    const testimonialSection = document.getElementById('testimonials');
    testimonialSection.addEventListener('mouseenter', () => clearInterval(sliderInterval));
    testimonialSection.addEventListener('mouseleave', startAutoPlay);
  }

  // ==========================================
  // 8. APPOINTMENT FORM SUBMISSION & SUCCESS MODAL
  // ==========================================
  const appointmentForm = document.getElementById('appointmentForm');
  const successModal = document.getElementById('successModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalDetails = document.getElementById('modalDetails');

  appointmentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Fetch form values
    const name = document.getElementById('pName').value;
    const phone = document.getElementById('pPhone').value;
    const email = document.getElementById('pEmail').value || 'Not provided';
    const date = document.getElementById('pDate').value;
    const department = document.getElementById('pDept').value;
    const doctor = document.getElementById('pDoc').value || 'Any Available Specialist';

    // Mock MR (Medical Record) Number generation
    const randomMR = 'KIH-' + Math.floor(100000 + Math.random() * 900000);

    // Build details list for Modal popup
    modalDetails.innerHTML = `
      <p><strong>Appointment ID:</strong> ${randomMR}</p>
      <p><strong>Patient Name:</strong> ${name}</p>
      <p><strong>Phone Number:</strong> ${phone}</p>
      <p><strong>Department:</strong> ${department}</p>
      <p><strong>Consultant:</strong> ${doctor}</p>
      <p><strong>Preferred Date:</strong> ${date}</p>
      <p style="margin-top: 10px; font-size: 0.8rem; color: var(--primary);">* A confirmation SMS has been dispatched to ${phone}.</p>
    `;

    // Show popup
    successModal.classList.add('active');

    // Reset Form
    appointmentForm.reset();
  });

  closeModalBtn.addEventListener('click', () => {
    successModal.classList.remove('active');
  });

  // Close modal when clicking on overlay background
  successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
      successModal.classList.remove('active');
    }
  });

  // ==========================================
  // 9. NEWSLETTER FORM SUBMISSION
  // ==========================================
  const newsletterForm = document.getElementById('newsletterForm');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector('input');
    alert(`Thank you for subscribing! We will dispatch medical newsletters to: ${emailInput.value}`);
    newsletterForm.reset();
  });

});
