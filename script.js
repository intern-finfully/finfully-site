
        function openModal(imgSrc) {
            const modal = document.getElementById('screenshot-modal');
            const img = document.getElementById('modal-img');
            img.src = imgSrc;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scroll
        }

        function closeModal() {
            const modal = document.getElementById('screenshot-modal');
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scroll
        }

        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });

        // Intersection Observer for scroll-reveal
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        function observeReveal() {
            document.querySelectorAll('.reveal').forEach(el => {
                observer.observe(el);
            });
        }
        observeReveal();

        // Navbar Logic
        const mobileToggle = document.getElementById('mobile-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navItems = document.querySelectorAll('.nav-item');
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        const contentGroups = document.querySelectorAll('.content-group');
        const sections = document.querySelectorAll('section');

        // Group Mapping
        const groupMapping = {
            'Introduction': 'group-introduction',
            'Analysis': 'group-analysis',
            'Capabilities': 'group-capabilities',
            'Outcomes': 'group-outcomes',
            'Execution': 'group-execution'
        };

        function switchGroup(groupId) {
            const currentActive = document.querySelector('.content-group.active');
            if (currentActive && currentActive.id === groupId) return; // Prevent reset if already active

            contentGroups.forEach(group => {
                if (group.id === groupId) {
                    group.classList.add('active');
                    // Optional: Reset animations only when switching to a NEW group
                    group.querySelectorAll('.reveal').forEach(r => r.classList.remove('active'));
                    // Small delay to ensure display: block is processed before observe
                    setTimeout(() => {
                        group.querySelectorAll('.reveal').forEach(el => observer.observe(el));
                    }, 100);
                } else {
                    group.classList.remove('active');
                }
            });
        }

        // Mobile Menu Toggle
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-active');
            mobileToggle.classList.toggle('active');
        });

        // Nav Item Click (Tab Switching)
        navItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            const groupName = link.textContent.trim().split(' ')[0];
            const groupId = groupMapping[groupName];

            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 1024) {
                    item.classList.toggle('mobile-expand');
                } else {
                    // Switch group and scroll to top
                    switchGroup(groupId);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });

        // Dropdown Item Click
        dropdownItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const targetId = item.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                const parentGroup = targetSection.closest('.content-group');

                if (parentGroup) {
                    switchGroup(parentGroup.id);
                }

                if (window.innerWidth <= 1024) {
                    navMenu.classList.remove('mobile-active');
                    navItems.forEach(ni => ni.classList.remove('mobile-expand'));
                }
            });
        });

        // Navbar Scroll Logic
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Navigation Highlighting
        window.addEventListener('scroll', () => {
            let current = '';
            const activeGroup = document.querySelector('.content-group.active');
            if (!activeGroup) return;

            const activeSections = activeGroup.querySelectorAll('section');
            activeSections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (pageYOffset >= (sectionTop - 150)) {
                    current = section.getAttribute('id');
                }
            });

            navItems.forEach(item => {
                const link = item.querySelector('.nav-link');
                const subLinks = item.querySelectorAll('.dropdown-item');
                let isParentActive = false;

                subLinks.forEach(sub => {
                    sub.classList.remove('active');
                    if (sub.getAttribute('href').substring(1) === current) {
                        sub.classList.add('active');
                        isParentActive = true;
                    }
                });

                if (isParentActive) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        });