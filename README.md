# Playwright TypeScript Test Framework

This repository contains a **modular, cross-browser test automation framework** using [Playwright](https://playwright.dev/) with **TypeScript** for both **UI** and **API testing**.  
The project supports:
- Separate UI and API test suites
- Parallel cross-browser execution (Chromium, Firefox, WebKit)
- GitHub Actions CI integration
- Automatic HTML test report upload as build artifacts

---

## 📂 Project Structure

playwright-tests/  
├── playwright.config.ts # Central Playwright config  
├── package.json # Project dependencies & scripts  
├── tsconfig.json # TypeScript config  
│  
├── tests/  
│ ├── ui/  
│ │ ├── example-ui.spec.ts # Sample UI test  
│ │ └── helpers/ # UI helper utilities  
│ └── api/  
│ ├── example-api.spec.ts # Sample API test  
│ └── helpers/ # API helper utilities  
│
├── utils/  
│ └── env.ts # (optional) environment helpers  
│  
└── .github/  
└── workflows/  
└── ci.yml # GitHub Actions pipeline  


## ⚙️ Setup Instructions

---
### Prerequisites
- Node.js **v18+**
- npm **v9+**

Verify:
```bash
node -v
npm -v
```

### Install dependencies
``` npm install```

### Install PlayWright browsers
```
npx playwright install --with-deps
```
### Run Tests Locally
#### Run All Tests
```
npm test
```
#### Run Only UI Tests
```
npm run test:ui

```
#### Run Only API tests
```
npm run test:api
```
#### Run in Specific Browser
```
npm run test:chrome
npm run test:firefox
npm run test:webkit

```
#### View HTML Report
After any test run:
```
npm run report

```

## Continuous Integration
The workflow file at
.github/workflows/ci.yml
automatically runs UI tests (across all browsers) and API tests in parallel whenever you push to main or open a pull request.  


## Key Features

Parallel matrix strategy: Chromium, Firefox, and WebKit run concurrently.  

API tests run in parallel with UI tests.  

Artifacts upload: Each job uploads its Playwright HTML report for download.  