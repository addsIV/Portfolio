# 林柏凱 Po Kai Lin — Backend Developer

**🌐 Online resume: [addsiv.github.io/Portfolio](https://addsiv.github.io/Portfolio/)**
Bilingual (English / 中文). Switch language with the toggle at the top right, and use the **PDF** button to download a print-ready copy.

📍 Taipei, Taiwan · ✉️ kl13245768@gmail.com · 🐙 [github.com/addsIV](https://github.com/addsIV)

---

## At a glance

- **6+ years** building and operating backend systems in **.NET (C#)** and **Go**
- Currently designing **AWS serverless** services (Lambda, API Gateway, DynamoDB) for real-time game backends
- Shipped APIs handling **1M+ requests per day**; comfortable with gRPC, RabbitMQ, Kubernetes, and CI/CD
- Care about testability and operations: integration tests, monitoring, alerting, and clear SOPs

## Experience

| Period | Role | Company | What I did |
|---|---|---|---|
| Jun 2025 – present | Backend Developer | **XiTech** | 20+ real-time game backends in Go on AWS Lambda/API Gateway/DynamoDB (round lifecycle, transaction and platform integration); large-scale multiplayer real-time engines on ECS; Terraform across Dev/STG/Prod; Step Functions–orchestrated integration tests; Grafana/Loki + OpenSearch observability and an AI log analyzer (Bedrock + Claude → Slack); AI-assisted delivery with Claude Code skills |
| Dec 2024 – May 2025 | Backend Developer | **DigitNet** | Built and maintained 20+ RabbitMQ consumers/producers; automated re-fetching of incomplete transactions, cutting manual investigation time by 50% |
| Jul 2022 – Nov 2024 | Fullstack Developer | **TitanSoft** | Designed 50+ REST/gRPC APIs in .NET Core (1M+ daily requests); raised test coverage by 30% with SpecFlow; 10+ Vue.js pages; Kubernetes CI/CD pipelines; Slack-alerting monitor for banner placement |
| Jul 2020 – Jun 2022 | Backend Developer | **Wiser Tech** | REST APIs in C#/AngularJS for a multi-language ERP; introduced Git to the team (80% fewer integration conflicts); T-SQL tuning that cut key query times by 90% |

## Skills

- **Languages:** C#, Go, JavaScript, TypeScript, T-SQL
- **Backend:** ASP.NET Core, ASP.NET MVC, gRPC, RabbitMQ, RESTful API design
- **Cloud & infra:** AWS (Lambda, API Gateway, DynamoDB, Step Functions, ECS), Terraform, Docker, Kubernetes, CI/CD
- **Observability & AI tooling:** Grafana/Loki, OpenSearch, AWS Bedrock, Claude Code
- **Testing & tooling:** SpecFlow, Playwright, K6, Postman
- **Frontend:** Vue.js, AngularJS, HTML/CSS, TailwindCSS

## Side projects

- **[LanMirror](https://github.com/addsIV/LanMirror)** — LAN screen mirroring from Mac to any browser over WebRTC, packaged as an Electron app
- **GitVine** — GitKraken-style Git GUI on Electron + git CLI, with a self-screenshot mode for visual tests
- **Game Automation Bot** — Node.js automation bot for a mobile strategy game with a web dashboard, deployed on AWS ECS
- **[This site](https://github.com/addsIV/Portfolio)** — bilingual resume with scroll animations and liquid-glass UI, plain HTML/CSS/JS

## Education

- **B.S. Physics**, Soochow University, Taiwan — graduated 2020, GPA 4.7 / 5
- **Computer Science coursework** (100 credit hours), National Chiao Tung University, Taiwan

---

## 中文摘要

後端工程師，6 年以上 .NET（C#）與 Go 開發經驗，目前於 XiTech 以 AWS serverless（Lambda、API Gateway、DynamoDB）打造遊戲後端。曾設計並維運日均百萬請求的 API，熟悉 gRPC、RabbitMQ、Kubernetes 與 CI/CD，重視測試、監控與可維運性。完整履歷（中英雙語、可下載 PDF）請見 [addsiv.github.io/Portfolio](https://addsiv.github.io/Portfolio/)。

---

<details>
<summary>About this site (for the curious)</summary>

Plain HTML, CSS, and JavaScript with no build step. `index.html` is the resume, `resume-pdf.html` is a standalone printable page (the PDF button builds its own layout in `script.js`), `scroll-fx.js` drives the scroll animations, `glass-surface.js` renders the liquid-glass controls (SVG displacement backdrop-filter, with a frosted fallback on Safari/Firefox), and `.github/workflows/deploy.yml` publishes to GitHub Pages on every push to `main`.

To preview locally:

```bash
npx serve .
```

Before committing, stamp a new build version (it cache-busts the CSS/JS links and updates the version shown in the footer):

```bash
npm run stamp
```

</details>
