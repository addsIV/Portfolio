// Resume Interactive Features

// Career length, computed live (month precision) from the first full-time role.
const CAREER_START = '2020-07';
function monthsBetween(from, to) {
    const [fy, fm] = from.split('-').map(Number);
    const ty = to ? Number(to.split('-')[0]) : new Date().getFullYear();
    const tm = to ? Number(to.split('-')[1]) : new Date().getMonth() + 1;
    return Math.max(0, (ty - fy) * 12 + (tm - fm) + (to ? 1 : 0));
}
function formatSpan(months, lang) {
    const y = Math.floor(months / 12), m = months % 12;
    if (lang === 'zh') return (y ? y + ' 年' : '') + (m ? (y ? ' ' : '') + m + ' 個月' : '') || '未滿 1 個月';
    const parts = [];
    if (y) parts.push(y + (y === 1 ? ' yr' : ' yrs'));
    if (m) parts.push(m + (m === 1 ? ' mo' : ' mos'));
    return parts.join(' ') || '< 1 mo';
}
function careerYears() { return Math.floor(monthsBetween(CAREER_START) / 12); }
function careerBadge(lang) { return formatSpan(monthsBetween(CAREER_START), lang); }
window.careerYears = careerYears;
window.careerBadge = careerBadge;

function applyCareerTokens() {
    const years = careerYears();
    document.querySelectorAll('[data-en][data-zh]').forEach((el) => {
        for (const attr of ['data-en', 'data-zh']) {
            const v = el.getAttribute(attr);
            if (!v || !v.includes('{{')) continue;
            const lang = attr === 'data-zh' ? 'zh' : 'en';
            el.setAttribute(attr, v.replace(/\{\{years\}\}/g, years).replace(/\{\{careerBadge\}\}/g, careerBadge(lang)));
        }
        if (el.textContent.includes('{{')) el.textContent = el.getAttribute('data-en');
    });
    document.querySelectorAll('.job-length[data-from]').forEach((el) => {
        const months = monthsBetween(el.dataset.from, el.dataset.to || '');
        el.setAttribute('data-en', '· ' + formatSpan(months, 'en'));
        el.setAttribute('data-zh', '· ' + formatSpan(months, 'zh'));
        el.textContent = el.getAttribute('data-en');
    });
}
document.addEventListener('DOMContentLoaded', function() {
    applyCareerTokens();

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
            bottom: 28px;
            left: 50%;
            padding: 12px 22px;
            border-radius: 999px;
            color: #f1f5f9;
            z-index: 1600;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 500;
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            transform: translate(-50%, 16px);
            transition: opacity 0.3s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        `;
        if (window.GlassSurface) {
            window.GlassSurface.apply(notification, { distortionScale: -160, blur: 12, backgroundOpacity: 0.14 });
        } else {
            notification.style.background = 'rgba(15, 23, 42, 0.92)';
            notification.style.border = '1px solid rgba(148, 163, 184, 0.3)';
        }

        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translate(-50%, 0)';
        }));

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translate(-50%, 16px)';
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
                    <div class="pdf-contact-item">GitHub: github.com/addsIV</div>
                </div>
                <div class="pdf-tech-badges">
                    <span class="pdf-tech-badge">${careerBadge(isZh ? 'zh' : 'en')}</span>
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
                            '我是一位專業的後端開發者，擁有${careerYears()}年以上開發和維護可擴展系統的經驗。我專精於.NET Core、ASP.NET MVC、Go和現代網路技術，在API開發、微服務架構、AWS無伺服器架構和系統整合方面具有豐富經驗。在我的職業生涯中，我成功處理了每日超過100萬請求的高流量應用程式，同時保持最佳效能和可靠性。' :
                            'I am a dedicated Backend Developer with ${careerYears()}+ years of experience developing and maintaining scalable systems. I specialize in .NET Core, ASP.NET MVC, Go, and modern web technologies, with expertise in API development, microservices architecture, AWS serverless architecture, and system integration. Throughout my career, I have successfully handled high-traffic applications processing 1M+ daily requests while maintaining optimal performance and reliability.'
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
                            '我在協作環境中表現出色，喜歡指導初級開發人員，同時持續學習新技術以保持在後端開發領域的領先地位。我相信團隊合作、知識分享的力量，致力於建構不僅滿足技術需求，更能推動有意義商業影響的解決方案。對 AI 輔助開發，我抱持開放但嚴謹的態度：積極用它加速，但每一段產出的程式碼都要經過審閱、測試並真正理解後才上線。' :
                            'I thrive in collaborative environments and enjoy mentoring junior developers while continuously learning new technologies to stay at the forefront of backend development. I believe in the power of teamwork, knowledge sharing, and building solutions that not only meet technical requirements but also drive meaningful business impact. I approach AI-assisted development with an open mind and a rigorous hand: I use it aggressively to move faster, but every generated change is reviewed, tested, and understood before it ships.'
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
                        <li>${isZh ? '以 Go 在 AWS Lambda、API Gateway、DynamoDB 上設計並上線 20+ 款即時遊戲後端，涵蓋回合流程、交易與平台整合' : 'Designed and shipped 20+ real-time game backends in Go on AWS Lambda, API Gateway and DynamoDB, from round lifecycle to transaction and platform integration'}</li>
                        <li>${isZh ? '以 Terraform 管理 Dev/STG/Prod 多環境基礎設施，含容器映像與 ECS 上以 WebSocket 運作的即時多人遊戲引擎' : 'Managed Dev/STG/Prod infrastructure as code with Terraform, including container images and ECS-hosted real-time multiplayer game engines over WebSocket'}</li>
                        <li>${isZh ? '建置以 AWS Step Functions 編排的自動化整合測試與自製 Postman collection 執行器，每次部署自動執行' : 'Built automated integration test suites orchestrated by AWS Step Functions plus a custom Postman-collection runner, executed on every deploy'}</li>
                        <li>${isZh ? '以 Grafana/Loki 與 OpenSearch 建立可觀測性，並開發 AI 日誌分析器（AWS Bedrock + Claude），每 3 小時將 Prod 錯誤分類推送至 Slack' : 'Set up observability with Grafana/Loki and OpenSearch, and built an AI log analyzer (AWS Bedrock + Claude) that triages production errors to Slack every 3 hours'}</li>
                        <li>${isZh ? '對大型多人即時遊戲引擎進行壓測與強化，以 lease 鎖消除回合重疊的競態問題' : 'Load-tested and hardened a large-scale multiplayer real-time engine, eliminating a round-overlap race with lease-based locking'}</li>
                        <li>${isZh ? '導入 AI 輔助開發：將新遊戲專案範本與 PR review 分流做成可重用的 Claude Code skills，讓團隊交付流程可重複' : 'Introduced AI-assisted development: codified new-game scaffolding and PR-review triage as reusable Claude Code skills, making delivery repeatable across the team'}</li>
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
                        <li>${isZh ? '設計並實施50+個.NET Core的RESTful和gRPC API，處理每日100萬+請求，維持99.9%正常運行時間' : 'Designed and implemented 50+ RESTful and gRPC APIs in .NET Core, handling 1M+ daily requests with 99.9% uptime'}</li>
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

            <!-- Projects Section -->
            <div class="pdf-section">
                <div class="pdf-section-title">${isZh ? '個人專案' : 'Side Projects'}</div>
                <div class="pdf-content-item">
                    <div class="pdf-item-header">
                        <div class="pdf-item-title">${isZh ? 'LanMirror' : 'LanMirror'} <span style="font-weight:normal;font-size:9pt;color:#555">github.com/addsIV/LanMirror</span></div>
                    </div>
                    <div class="pdf-content-text">${isZh ? '以 WebRTC 將 Mac 畫面鏡像到區網內任何瀏覽器（VP9、40 Mbps、低延遲），打包成已簽章的 Electron app，用來取代需訂閱的工具。' : 'LAN screen mirroring from Mac to any browser over WebRTC (VP9, 40 Mbps, low latency), packaged as a signed Electron app. Built to replace a subscription tool for the team.'}</div>
                    <div class="pdf-content-text" style="color:#555">Electron • WebRTC • Node.js</div>
                </div>
                <div class="pdf-content-item">
                    <div class="pdf-item-header">
                        <div class="pdf-item-title">${isZh ? 'GitVine' : 'GitVine'}</div>
                    </div>
                    <div class="pdf-content-text">${isZh ? '以 Electron 與 git CLI 打造的 GitKraken 風格 Git GUI，內建自我截圖模式做自動化視覺測試。' : 'A GitKraken-style Git GUI built on Electron and the git CLI, with a self-screenshot mode for automated visual testing.'}</div>
                    <div class="pdf-content-text" style="color:#555">Electron • Git • JavaScript</div>
                </div>
                <div class="pdf-content-item">
                    <div class="pdf-item-header">
                        <div class="pdf-item-title">${isZh ? '遊戲自動化機器人' : 'Game Automation Bot'}</div>
                    </div>
                    <div class="pdf-content-text">${isZh ? '手機策略遊戲的 Node.js 自動化機器人，附網頁儀表板，容器化後部署於 AWS ECS。' : 'A Node.js automation bot for a mobile strategy game, with a web dashboard, containerised and deployed to AWS ECS.'}</div>
                    <div class="pdf-content-text" style="color:#555">Node.js • Docker • AWS ECS</div>
                </div>
                <div class="pdf-content-item">
                    <div class="pdf-item-header">
                        <div class="pdf-item-title">${isZh ? '本站' : 'This site'} <span style="font-weight:normal;font-size:9pt;color:#555">github.com/addsIV/Portfolio</span></div>
                    </div>
                    <div class="pdf-content-text">${isZh ? '中英雙語履歷網站，含捲動動畫與液態玻璃介面，純 HTML/CSS/JS，部署於 GitHub Pages。' : 'Bilingual resume with scroll-driven animations and liquid-glass UI, written in plain HTML/CSS/JS and deployed on GitHub Pages.'}</div>
                    <div class="pdf-content-text" style="color:#555">HTML/CSS • JavaScript • GitHub Pages</div>
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
                            <span class="pdf-skill-tag">AWS Lambda</span>
                            <span class="pdf-skill-tag">DynamoDB</span>
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
                            <span class="pdf-skill-tag">Terraform</span>
                            <span class="pdf-skill-tag">Docker</span>
                            <span class="pdf-skill-tag">Grafana / Loki</span>
                            <span class="pdf-skill-tag">OpenSearch</span>
                            <span class="pdf-skill-tag">Claude Code</span>
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
