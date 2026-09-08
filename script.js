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

    // Scroll reveal animations live in scroll-fx.js

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

    // Export to PDF functionality (generates and downloads actual PDF)
    function exportToPDF() {
        const currentLang = document.body.classList.contains('chinese-mode') ? 'zh' : 'en';
        const fileName = currentLang === 'zh' ? '林柏凱_履歷.pdf' : 'Po_Kai_Lin_Resume.pdf';

        // Show loading notification
        showNotification(currentLang === 'zh' ? '🔄 正在生成PDF...' : '🔄 Generating PDF...');

        // Create PDF content directly
        const pdfContent = createPDFContent(currentLang);

        // Configure PDF options
        const opt = {
            margin: [15, 15, 15, 15], // top, left, bottom, right in mm
            filename: fileName,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                letterRendering: true,
                allowTaint: false
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait',
                compress: true
            }
        };

        // Generate and download PDF
        html2pdf().set(opt).from(pdfContent).save().then(() => {
            showNotification(currentLang === 'zh' ? '✅ PDF下載完成！' : '✅ PDF downloaded successfully!');
        }).catch(error => {
            console.error('PDF generation error:', error);
            showNotification(currentLang === 'zh' ? '❌ PDF生成失敗' : '❌ PDF generation failed');
        });
    }

    // Create PDF content function
    function createPDFContent(lang) {
        const isZh = lang === 'zh';

        const content = document.createElement('div');
        content.style.cssText = `
            font-family: Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.4;
            color: black;
            background: white;
            padding: 15pt;
            max-width: 180mm;
            margin: 0 auto;
        `;

        content.innerHTML = `
            <style>
                .pdf-header { text-align: center; margin-bottom: 25pt; padding-bottom: 15pt; border-bottom: 2pt solid black; }
                .pdf-name { font-size: 20pt; font-weight: bold; margin-bottom: 8pt; }
                .pdf-title { font-size: 14pt; margin-bottom: 12pt; color: #333; }
                .pdf-contact { font-size: 11pt; line-height: 1.6; }
                .pdf-contact-item { display: block; margin: 3pt 0; }
                .pdf-tech-badges { margin-top: 10pt; font-size: 11pt; }
                .pdf-tech-badge { display: inline; }
                .pdf-tech-badge::after { content: " • "; font-weight: bold; }
                .pdf-tech-badge:last-child::after { content: ""; }
                .pdf-section { margin-bottom: 25pt; page-break-inside: avoid; }
                .pdf-section-title { font-size: 14pt; font-weight: bold; text-transform: uppercase; border-bottom: 1pt solid black; padding-bottom: 4pt; margin-bottom: 12pt; }
                .pdf-content-item { margin-bottom: 15pt; page-break-inside: avoid; }
                .pdf-content-item:not(:last-child) { border-bottom: 1pt solid #ccc; padding-bottom: 12pt; }
                .pdf-item-header { margin-bottom: 8pt; }
                .pdf-item-title { font-size: 13pt; font-weight: bold; margin-bottom: 4pt; }
                .pdf-item-subtitle { font-size: 11pt; margin-bottom: 3pt; }
                .pdf-item-duration { font-size: 10pt; color: #666; margin-bottom: 3pt; }
                .pdf-responsibilities { list-style: none; padding-left: 0; margin: 8pt 0; }
                .pdf-responsibilities li { margin-bottom: 4pt; padding-left: 12pt; position: relative; line-height: 1.4; }
                .pdf-responsibilities li::before { content: "• "; position: absolute; left: 0; font-weight: bold; }
                .pdf-content-text { font-size: 10pt; line-height: 1.4; text-align: justify; margin: 8pt 0; }
                .pdf-skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15pt; }
                .pdf-skill-category { margin-bottom: 15pt; }
                .pdf-skill-category-title { font-size: 12pt; font-weight: bold; margin-bottom: 6pt; }
                .pdf-skills-list { font-size: 10pt; line-height: 1.5; }
                .pdf-skill-tag { display: inline; }
                .pdf-skill-tag::after { content: " • "; font-weight: bold; }
                .pdf-skill-tag:last-child::after { content: ""; }
            </style>

            <!-- Header -->
            <div class="pdf-header">
                <div class="pdf-name">${isZh ? '林柏凱' : 'Po Kai Lin'}</div>
                <div class="pdf-title">${isZh ? '後端開發者' : 'Backend Developer'}</div>
                <div class="pdf-contact">
                    <div class="pdf-contact-item">${isZh ? '電子郵件' : 'Email'}: kl13245768@gmail.com</div>
                    <div class="pdf-contact-item">${isZh ? '電話' : 'Phone'}: (+886) 988-079-258</div>
                    <div class="pdf-contact-item">${isZh ? '地點' : 'Location'}: ${isZh ? '台北市，台灣' : 'Taipei City, Taiwan'}</div>
                </div>
                <div class="pdf-tech-badges">
                    <span class="pdf-tech-badge">${isZh ? '5年以上' : '5+ Years'}</span>
                    <span class="pdf-tech-badge">${isZh ? '後端' : 'Backend'}</span>
                    <span class="pdf-tech-badge">.NET</span>
                </div>
            </div>

            <!-- About Section -->
            <div class="pdf-section">
                <div class="pdf-section-title">${isZh ? '關於我' : 'About Me'}</div>

                <div class="pdf-content-item">
                    <div class="pdf-item-header">
                        <div class="pdf-item-title">${isZh ? '專業概述' : 'Professional Overview'}</div>
                    </div>
                    <div class="pdf-content-text">
                        ${isZh ?
                            '我是一位專業的後端開發者，擁有5年以上開發和維護可擴展系統的經驗。我專精於.NET Core、ASP.NET MVC、Go和現代網路技術，在API開發、微服務架構、AWS無伺服器架構和系統整合方面具有豐富經驗。在我的職業生涯中，我成功處理了每日超過100萬請求的高流量應用程式，同時保持最佳效能和可靠性。' :
                            'I am a dedicated Backend Developer with 5+ years of experience developing and maintaining scalable systems. I specialize in .NET Core, ASP.NET MVC, Go, and modern web technologies, with expertise in API development, microservices architecture, AWS serverless architecture, and system integration. Throughout my career, I have successfully handled high-traffic applications processing 1M+ daily requests while maintaining optimal performance and reliability.'
                        }
                    </div>
                </div>

                <div class="pdf-content-item">
                    <div class="pdf-item-header">
                        <div class="pdf-item-title">${isZh ? '技術專長' : 'Technical Expertise'}</div>
                    </div>
                    <div class="pdf-content-text">
                        ${isZh ?
                            '我的技術專長涵蓋C#、Go程式設計、AWS無伺服器架構（Lambda、API Gateway、DynamoDB）、T-SQL資料庫優化、RabbitMQ訊息佇列系統、Kubernetes容器化技術，以及Vue.js和AngularJS等前端技術。我熱衷於撰寫乾淨、可維護的程式碼，實施自動化測試策略，並提供推動業務成長的強健解決方案。' :
                            'My technical expertise spans across C#, Go programming, AWS serverless architecture (Lambda, API Gateway, DynamoDB), database optimization with T-SQL, message queuing systems like RabbitMQ, containerization with Kubernetes, and frontend technologies including Vue.js and AngularJS. I\'m passionate about writing clean, maintainable code, implementing automated testing strategies, and delivering robust solutions that drive business growth.'
                        }
                    </div>
                </div>

                <div class="pdf-content-item">
                    <div class="pdf-item-header">
                        <div class="pdf-item-title">${isZh ? '專業價值觀' : 'Professional Values'}</div>
                    </div>
                    <div class="pdf-content-text">
                        ${isZh ?
                            '我在協作環境中表現出色，喜歡指導初級開發人員，同時持續學習新技術以保持在後端開發領域的領先地位。我相信團隊合作、知識分享的力量，致力於建構不僅滿足技術需求，更能推動有意義商業影響的解決方案。' :
                            'I thrive in collaborative environments and enjoy mentoring junior developers while continuously learning new technologies to stay at the forefront of backend development. I believe in the power of teamwork, knowledge sharing, and building solutions that not only meet technical requirements but also drive meaningful business impact.'
                        }
                    </div>
                </div>
            </div>

            <!-- Experience Section -->
            <div class="pdf-section">
                <div class="pdf-section-title">${isZh ? '工作經歷' : 'Work Experience'}</div>

                <div class="pdf-content-item">
                    <div class="pdf-item-header">
                        <div class="pdf-item-title">${isZh ? '後端開發者' : 'Backend Developer'}</div>
                        <div class="pdf-item-subtitle">XiTech</div>
                        <div class="pdf-item-duration">${isZh ? '2025年6月 - 至今' : 'Jun. 2025 - Present'}</div>
                    </div>
                    <ul class="pdf-responsibilities">
                        <li>${isZh ? '使用Go和AWS無伺服器架構開發可擴展的後端系統' : 'Developing scalable backend systems using Go and AWS serverless architecture'}</li>
                        <li>${isZh ? '使用AWS Lambda、API Gateway和DynamoDB實施微服務，打造高效能應用程式' : 'Implementing microservices with AWS Lambda, API Gateway, and DynamoDB for high-performance applications'}</li>
                    </ul>
                </div>

                <div class="pdf-content-item">
                    <div class="pdf-item-header">
                        <div class="pdf-item-title">${isZh ? '後端開發者' : 'Backend Developer'}</div>
                        <div class="pdf-item-subtitle">DigitNet</div>
                        <div class="pdf-item-duration">${isZh ? '2024年12月 - 2025年5月' : 'Dec. 2024 - May 2025'}</div>
                    </div>
                    <ul class="pdf-responsibilities">
                        <li>${isZh ? '開發和維護20+個RabbitMQ消費者和生產者，用於系統整合' : 'Developed and maintained 20+ RabbitMQ consumers and producers for system integration'}</li>
                        <li>${isZh ? '建立詳細的標準作業程序並實施自動重新獲取不完整交易資料的工作流程，減少50%的人工調查時間' : 'Created detailed SOPs and implemented a workflow to automatically refetch incomplete transaction data, reducing manual investigation time by 50%'}</li>
                    </ul>
                </div>

                <div class="pdf-content-item">
                    <div class="pdf-item-header">
                        <div class="pdf-item-title">${isZh ? '全端工程師' : 'Fullstack Developer'}</div>
                        <div class="pdf-item-subtitle">TitanSoft</div>
                        <div class="pdf-item-duration">${isZh ? '2022年7月 - 2024年11月' : 'Jul. 2022 - Nov. 2024'}</div>
                    </div>
                    <ul class="pdf-responsibilities">
                        <li>${isZh ? '設計並實施50+個.NET Core的RESTful和gRPC API，處理每日100萬+請求，維持90%正常運行時間' : 'Designed and implemented 50+ RESTful and gRPC APIs in .NET Core, handling 1M+ daily requests with 90% uptime'}</li>
                        <li>${isZh ? '實施整合測試，提升30%測試覆蓋率，運用SpecFlow增強測試可讀性和可維護性' : 'Implemented integration tests to improve test coverage by 30%, leveraging SpecFlow for enhanced test readability and maintainability'}</li>
                        <li>${isZh ? '開發和維護10+個Vue.js前端頁面' : 'Developed and maintained 10+ Vue.js frontend pages'}</li>
                        <li>${isZh ? '實施10+個Kubernetes的yaml CI/CD自動化腳本' : 'Implemented over 10 CI/CD automation scripts in yaml for Kubernetes'}</li>
                        <li>${isZh ? '設計監控解決方案確保橫幅正確放置，並透過Slack提供即時問題警報，減少人工檢查和回應時間' : 'Designed a monitoring solution to ensure correct banner placements and provide immediate issue alerts via Slack, reducing manual checks and response time'}</li>
                    </ul>
                </div>

                <div class="pdf-content-item">
                    <div class="pdf-item-header">
                        <div class="pdf-item-title">${isZh ? '後端開發者' : 'Backend Developer'}</div>
                        <div class="pdf-item-subtitle">Wiser Tech</div>
                        <div class="pdf-item-duration">${isZh ? '2020年7月 - 2022年6月' : 'Jul. 2020 - Jun. 2022'}</div>
                    </div>
                    <ul class="pdf-responsibilities">
                        <li>${isZh ? '使用C#、AngularJS和JavaScript開發和維護10+個RESTful API，實現客製化用戶功能並提升整合效率' : 'Developed and maintained 10+ RESTful APIs using C#, AngularJS, and JavaScript, enabling customized user functionality and improving integration efficiency'}</li>
                        <li>${isZh ? '引入Git作為團隊版本控制系統，改善協作並減少80%的整合衝突' : 'Introduced Git as the team\'s version control system, improving collaboration and reducing integration conflicts by 80%'}</li>
                        <li>${isZh ? '維護和重構多語言ERP系統，提升系統穩定性和可維護性' : 'Maintained and refactored multi-language ERP systems, improving system stability and maintainability'}</li>
                        <li>${isZh ? '提供優化的T-SQL查詢以支援用戶追蹤和稽核關鍵資料，減少90%的查詢時間' : 'Provided optimized T-SQL queries to support users in tracking and auditing critical data, reducing query time by 90%'}</li>
                    </ul>
                </div>
            </div>

            <!-- Education Section -->
            <div class="pdf-section">
                <div class="pdf-section-title">${isZh ? '學歷' : 'Education'}</div>

                <div class="pdf-content-item">
                    <div class="pdf-item-header">
                        <div class="pdf-item-title">${isZh ? '物理學學士學位' : 'Bachelor of Science in Physics'}</div>
                        <div class="pdf-item-subtitle">${isZh ? '東吳大學，台灣' : 'SooChow University, Taiwan'}</div>
                        <div class="pdf-item-duration">${isZh ? '畢業：2020年' : 'Graduated: 2020'}</div>
                    </div>
                    <div class="pdf-content-text">GPA：4.7/5</div>
                </div>

                <div class="pdf-content-item">
                    <div class="pdf-item-header">
                        <div class="pdf-item-title">${isZh ? '資訊工程學系' : 'Computer Science'}</div>
                        <div class="pdf-item-subtitle">${isZh ? '國立交通大學，台灣' : 'National Chiao Tung University, Taiwan'}</div>
                        <div class="pdf-item-duration">${isZh ? '肄業' : 'Attended'}</div>
                    </div>
                    <div class="pdf-content-text">${isZh ? '在學士學位修得100學分' : 'Earned 100 hours toward a Bachelor\'s Degree'}</div>
                </div>
            </div>

            <!-- Skills Section -->
            <div class="pdf-section">
                <div class="pdf-section-title">${isZh ? '技術技能' : 'Technical Skills'}</div>

                <div class="pdf-skills-grid">
                    <div class="pdf-skill-category">
                        <div class="pdf-skill-category-title">${isZh ? '程式語言' : 'Programming Languages'}</div>
                        <div class="pdf-skills-list">
                            <span class="pdf-skill-tag">C#</span>
                            <span class="pdf-skill-tag">Go</span>
                            <span class="pdf-skill-tag">JavaScript</span>
                            <span class="pdf-skill-tag">TypeScript</span>
                            <span class="pdf-skill-tag">T-SQL</span>
                        </div>
                    </div>

                    <div class="pdf-skill-category">
                        <div class="pdf-skill-category-title">${isZh ? '框架與技術' : 'Frameworks & Technologies'}</div>
                        <div class="pdf-skills-list">
                            <span class="pdf-skill-tag">ASP.NET Core</span>
                            <span class="pdf-skill-tag">ASP.NET MVC</span>
                            <span class="pdf-skill-tag">Vue.js</span>
                            <span class="pdf-skill-tag">AngularJS</span>
                            <span class="pdf-skill-tag">RabbitMQ</span>
                            <span class="pdf-skill-tag">gRPC</span>
                        </div>
                    </div>

                    <div class="pdf-skill-category">
                        <div class="pdf-skill-category-title">${isZh ? '前端與樣式' : 'Frontend & Styling'}</div>
                        <div class="pdf-skills-list">
                            <span class="pdf-skill-tag">HTML</span>
                            <span class="pdf-skill-tag">CSS</span>
                            <span class="pdf-skill-tag">TailwindCSS</span>
                        </div>
                    </div>

                    <div class="pdf-skill-category">
                        <div class="pdf-skill-category-title">${isZh ? '工具與平台' : 'Tools & Platforms'}</div>
                        <div class="pdf-skills-list">
                            <span class="pdf-skill-tag">AWS</span>
                            <span class="pdf-skill-tag">Git</span>
                            <span class="pdf-skill-tag">Postman</span>
                            <span class="pdf-skill-tag">Playwright</span>
                            <span class="pdf-skill-tag">K6</span>
                            <span class="pdf-skill-tag">SpecFlow</span>
                            <span class="pdf-skill-tag">Vim</span>
                            <span class="pdf-skill-tag">Kubernetes</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return content;
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

    function toggleLanguage(silent) {
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

        if (silent) return;
        // Show notification with flag emojis
        const message = currentLang === 'zh' ? '🇹🇼 已切換至繁體中文' : '🇺🇸 Switched to English';
        showNotification(message);
    }

    // Load saved language preference
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && savedLang !== currentLang) {
        currentLang = savedLang;
        toggleLanguage(true);
    } else {
        // Initialize label highlighting for default language
        toggleLanguage(true);
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
