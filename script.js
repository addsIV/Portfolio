// Resume Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections for scroll animations
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Avatar functionality removed - no longer needed

    // Skill tags hover effect
    document.querySelectorAll('.skill-tag').forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Contact info click handlers
    document.querySelectorAll('.contact-item').forEach(item => {
        const emailSpan = item.querySelector('span');
        const emailLink = item.querySelector('a');
        
        if (emailSpan && emailSpan.textContent.includes('@')) {
            item.style.cursor = 'pointer';
            item.addEventListener('click', function() {
                navigator.clipboard.writeText(emailSpan.textContent).then(() => {
                    showNotification('Email copied to clipboard!');
                });
            });
        }
        
        if (emailSpan && emailSpan.textContent.includes('+')) {
            item.style.cursor = 'pointer';
            item.addEventListener('click', function() {
                navigator.clipboard.writeText(emailSpan.textContent).then(() => {
                    showNotification('Phone number copied to clipboard!');
                });
            });
        }
    });

    // Print functionality
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            window.print();
        }
    });

    // Theme toggle (optional feature)
    let isDarkMode = false;
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            toggleDarkMode();
        }
    });

    function toggleDarkMode() {
        isDarkMode = !isDarkMode;
        const body = document.body;
        
        if (isDarkMode) {
            body.style.background = 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)';
            document.querySelector('.container').style.background = '#2c3e50';
            document.querySelector('.container').style.color = '#ecf0f1';
        } else {
            body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            document.querySelector('.container').style.background = 'white';
            document.querySelector('.container').style.color = '#333';
        }
    }

    // Notification system
    function showNotification(message) {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4A90E2;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Content editing functionality completely removed - resume is now static

    // Export to PDF functionality (using browser's print)
    function exportToPDF() {
        const originalTitle = document.title;
        const currentLang = document.body.classList.contains('chinese-mode') ? 'zh' : 'en';
        document.title = currentLang === 'zh' ? '林柏凱_履歷' : 'Po_Kai_Lin_Resume';

        // Hide floating elements during print
        const floatingElements = document.querySelectorAll('.floating-language-toggle, .floating-pdf-download, .notification');
        floatingElements.forEach(el => el.style.display = 'none');

        // Add print-specific styles
        document.body.classList.add('printing');

        window.print();

        // Restore after print
        setTimeout(() => {
            floatingElements.forEach(el => {
                if (el.classList.contains('notification')) {
                    el.style.display = '';
                } else {
                    el.style.display = 'flex';
                }
            });
            document.body.classList.remove('printing');
            document.title = originalTitle;
        }, 1000);
    }

    // Initialize PDF download functionality
    const downloadPDFBtn = document.getElementById('downloadPDF');
    if (downloadPDFBtn) {
        downloadPDFBtn.addEventListener('click', exportToPDF);
    }

    // Add keyboard shortcut for PDF export
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'E') {
            e.preventDefault();
            exportToPDF();
        }
    });

    // Timeline interactions
    initializeTimeline();

    // Interactive features hint removed - resume is now static

    // Language Toggle Switch Functionality
    let currentLang = 'en';
    const langToggle = document.getElementById('langToggle');
    const langLabels = document.querySelectorAll('.lang-label');

    if (langToggle) {
        langToggle.addEventListener('change', function() {
            currentLang = this.checked ? 'zh' : 'en';
            toggleLanguage();
        });
    }

    function toggleLanguage() {
        // Update all elements with translation data
        const translatableElements = document.querySelectorAll('[data-en][data-zh]');

        translatableElements.forEach(element => {
            if (currentLang === 'zh') {
                element.textContent = element.getAttribute('data-zh');
            } else {
                element.textContent = element.getAttribute('data-en');
            }
        });

        // Update label highlighting
        langLabels.forEach((label, index) => {
            if (index === 0) { // EN label
                label.classList.toggle('active', currentLang === 'en');
            } else { // 中文 label
                label.classList.toggle('active', currentLang === 'zh');
            }
        });

        // Update toggle switch state
        if (langToggle) {
            langToggle.checked = currentLang === 'zh';
        }

        // Update background theme
        document.body.classList.toggle('chinese-mode', currentLang === 'zh');

        // Save language preference
        localStorage.setItem('preferredLanguage', currentLang);

        // Show notification with flag emojis
        const message = currentLang === 'zh' ? '🇹🇼 已切換至繁體中文' : '🇺🇸 Switched to English';
        showNotification(message);
    }

    // Load saved language preference
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && savedLang !== currentLang) {
        currentLang = savedLang;
        toggleLanguage();
    } else {
        // Initialize label highlighting for default language
        toggleLanguage();
    }
});

// Timeline functionality
function initializeTimeline() {
    // Handle details toggle buttons
    document.querySelectorAll('.details-toggle').forEach(button => {
        button.addEventListener('click', function() {
            const details = this.parentNode.querySelector('.technical-details');
            const isActive = details.classList.contains('active');

            // Close all other details first
            document.querySelectorAll('.technical-details.active').forEach(detail => {
                if (detail !== details) {
                    detail.classList.remove('active');
                    detail.parentNode.querySelector('.details-toggle').classList.remove('active');
                }
            });

            // Toggle current details
            if (isActive) {
                details.classList.remove('active');
                this.classList.remove('active');
            } else {
                details.classList.add('active');
                this.classList.add('active');
            }
        });
    });

    // Animate timeline items on scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';

                // Add a slight delay for staggered animation
                const delay = Array.from(timelineItems).indexOf(entry.target) * 200;
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, delay);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });

    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });

    // Add hover effects for timeline markers
    document.querySelectorAll('.timeline-marker').forEach(marker => {
        const timelineItem = marker.closest('.timeline-item');
        const year = timelineItem.dataset.year;

        marker.addEventListener('mouseenter', function() {
            // Create tooltip showing year
            const tooltip = document.createElement('div');
            tooltip.className = 'timeline-tooltip';
            tooltip.textContent = year;
            tooltip.style.cssText = `
                position: absolute;
                top: -35px;
                left: 50%;
                transform: translateX(-50%);
                background: #2c3e50;
                color: white;
                padding: 5px 10px;
                border-radius: 5px;
                font-size: 0.8rem;
                font-weight: 500;
                white-space: nowrap;
                z-index: 10;
                pointer-events: none;
            `;

            // Add arrow
            const arrow = document.createElement('div');
            arrow.style.cssText = `
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                border-top: 5px solid #2c3e50;
            `;
            tooltip.appendChild(arrow);

            this.appendChild(tooltip);
        });

        marker.addEventListener('mouseleave', function() {
            const tooltip = this.querySelector('.timeline-tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });

    // Code snippet copy functionality
    document.querySelectorAll('.code-snippet').forEach(snippet => {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-btn';
        copyButton.innerHTML = '📋 Copy';
        copyButton.style.cssText = `
            position: absolute;
            top: 15px;
            right: 15px;
            background: rgba(74, 144, 226, 0.8);
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 0.8rem;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        snippet.style.position = 'relative';
        snippet.appendChild(copyButton);

        snippet.addEventListener('mouseenter', () => {
            copyButton.style.opacity = '1';
        });

        snippet.addEventListener('mouseleave', () => {
            copyButton.style.opacity = '0';
        });

        copyButton.addEventListener('click', () => {
            const code = snippet.querySelector('code').textContent;
            navigator.clipboard.writeText(code).then(() => {
                copyButton.innerHTML = '✅ Copied!';
                setTimeout(() => {
                    copyButton.innerHTML = '📋 Copy';
                }, 2000);
            });
        });
    });

    // Timeline progress indicator
    createTimelineProgress();
}

function createTimelineProgress() {
    const timelineContainer = document.querySelector('.timeline-container');
    if (!timelineContainer) return;

    const progressBar = document.createElement('div');
    progressBar.className = 'timeline-progress';
    progressBar.style.cssText = `
        position: absolute;
        left: 30px;
        top: 0;
        width: 3px;
        background: #27ae60;
        border-radius: 2px;
        transform-origin: top;
        transform: scaleY(0);
        transition: transform 0.3s ease;
        z-index: 1;
    `;

    timelineContainer.appendChild(progressBar);

    // Update progress on scroll
    window.addEventListener('scroll', () => {
        const timelineRect = timelineContainer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const timelineHeight = timelineContainer.offsetHeight;

        if (timelineRect.top < windowHeight && timelineRect.bottom > 0) {
            const scrollProgress = Math.max(0, Math.min(1,
                (windowHeight - timelineRect.top) / (timelineHeight + windowHeight)
            ));
            progressBar.style.transform = `scaleY(${scrollProgress})`;
        }
    });
}
