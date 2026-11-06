# Biohazard Cleanup Safety Checklist

> A practical, privacy-first informational tool designed for homeowners, landlords, and property managers to organize safety considerations, document potential incidents, and identify when certified professional biohazard remediation is required.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation &amp; How to Run Locally](#installation--how-to-run-locally)
- [User Guide](#user-guide)
  - [1. Safety Awareness Checklist](#1-safety-awareness-checklist)
  - [2. Incident Documentation Form](#2-incident-documentation-form)
  - [3. Professional Remediation Resources](#3-professional-remediation-resources)
- [Privacy &amp; Data Security](#privacy--data-security)
- [Important Safety Restrictions &amp; Disclaimer](#important-safety-restrictions--disclaimer)
- [External &amp; Public Safety Resources](#external--public-safety-resources)
- [License](#license)

---

## Overview

Property owners, landlords, and facility coordinators frequently encounter situations involving suspected biological hazards—such as trauma scenes, sewage backups, unattended death scenes, or hazardous organic contamination. 

**Biohazard Cleanup Safety Checklist** serves as an informational public safety tool that promotes non-disturbance protocols, structured incident documentation, and rapid escalation to certified remediation contractors.

> **Important**: This application is strictly for safety awareness, situational documentation, and qualified contractor consultation. It is **NOT** a do-it-yourself (DIY) cleanup guide.

---

## Key Features

- **Interactive Safety Awareness Checklist**:
  - Categorized into *General Safety Awareness*, *Personal Protective Equipment Awareness*, and *Incident Preparation*.
  - Real-time completion progress tracking with animated visual indicator and item count.
  - Automatic persistence via browser `LocalStorage`.
  - Accessible checklist reset with modal confirmation dialog.

- **Client-Side Incident Documentation**:
  - Structured fields for Incident Title, Date of Discovery, Property Type, Specific Location, Hazard Category, Factual Observations, and Professional Assistance Status.
  - Inline input validation with clear accessible error feedback.
  - Active report draft persistence and live sidebar summary.
  - Dedicated print engine (`window.print()`) that formats official documentation records including checklist statuses and signature lines.

- **Zero-Transmission Privacy Architecture**:
  - 100% client-side operation with no backend server, tracking pixels, or external database queries.
  - Sensitive property incident details remain entirely on the user's local device.

- **Responsive Public Safety Interface**:
  - Mobile-first, accessible layout optimized for smartphones, tablets, and desktop workstations.
  - Professional styling featuring crisp white/slate surfaces, dark navy typography, and subtle teal accents.
  - Accessible focus states, keyboard shortcuts (`Escape` to close modal), and custom touch-friendly form controls.

---

## Technology Stack

- **HTML5**: Semantic tags (`<main>`, `<nav>`, `<section>`, `<article>`, `<fieldset>`, `<legend>`), full ARIA roles.
- **CSS3**: Custom properties (CSS variables), Flexbox, CSS Grid, mobile media queries, and dedicated `@media print` stylesheets.
- **Vanilla JavaScript (ES6+)**: Zero external frameworks or libraries, DOM manipulation, modular architecture, event handling, and HTML5 Web Storage API (`LocalStorage`).
- **No Paid APIs / No Backend**: Completely self-contained and free to deploy anywhere.

---

## Project Structure

```text
biohazard-cleanup-safety-checklist/
├── .gitattributes          # Git line-ending normalization
├── index.html              # Main application markup & semantic layout
├── styles.css              # Custom styling, layout grid & print engine
├── script.js               # Reactive checklist, form validation & local storage logic
├── README.md               # Comprehensive documentation and safety guide
└── LICENSE                 # MIT Open Source License
```

---

## Installation & How to Run Locally

Because the project relies purely on standard HTML5, CSS3, and Vanilla JavaScript, it requires **no build tools, compilers, or server-side runtimes** (such as Node.js or Python).

### Method 1: Direct File Launch
1. Clone or download the repository to your local system:
   ```bash
   git clone https://github.com/your-username/biohazard-cleanup-safety-checklist.git
   cd biohazard-cleanup-safety-checklist
   ```
2. Double-click `index.html` or open it with any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Apple Safari).

### Method 2: Local HTTP Server (Optional)
If you prefer running through a local development server:

* **Using Python 3**:
  ```bash
  python -m http.server 8000
  ```
  Then open `http://localhost:8000` in your browser.

* **Using Node.js (`npx serve`)**:
  ```bash
  npx serve .
  ```

* **Using VS Code Live Server**:
  Right-click `index.html` and select **"Open with Live Server"**.

---

## User Guide

### 1. Safety Awareness Checklist
1. Navigate to the **Safety Checklist** section from the top menu or dashboard card.
2. Review each item across the three awareness categories:
   - **General Safety Awareness**: Keep children and pets away; avoid touching or disturbing suspicious materials; restrict access; seek qualified guidance.
   - **PPE Awareness**: Understand professional barrier categories (gloves, protective suits, eye shields, respiratory protection).
   - **Incident Preparation**: Record discovery dates, document visible conditions from a safe distance, and confirm professional outreach.
3. Your progress updates in real-time and persists automatically across browser refreshes.
4. Click **Reset Checklist** if you wish to start over.

### 2. Incident Documentation Form
1. Enter the required details:
   - **Incident Title**: Brief descriptive title (e.g., *Storage Room Water & Contamination Issue*).
   - **Date of Discovery**: The date the concern was discovered.
   - **Property Type**: Residential, Rental, Commercial, or Other.
   - **General Location**: Room or area description without entering the hazard zone.
   - **Incident Category**: Blood/fluids, suspected biological contamination, unattended death, rodent concerns, or other.
   - **Description**: Factual visual observations (do not handle materials to inspect).
   - **Professional Assistance Contacted**: Yes, No, or Not yet.
2. Click **Save Report** to commit the record to your browser's local storage.
3. Click **Print Report** to generate a clean, official report suitable for property files, insurance adjusters, or remediation specialists.

### 3. Professional Remediation Resources
Review scenarios that warrant certified professional remediation, explore regional resources such as [Biohazard Cleanup Los Angeles](https://www.biohazardcleanuplosangelesca.com/), and consult official public health standards.

---

## Privacy & Data Security

- **Strict Local Execution**: All checklist states and form values are stored solely in your web browser via `window.localStorage`.
- **Zero Server Uploads**: This application does not transmit, upload, or sync data to any cloud service, analytics tracker, or remote database.
- **Data Erasure**: You can wipe all stored records at any time by clicking **"Delete Saved Record"** and **"Reset Checklist"**, or by clearing your browser's website data.

---

## Important Safety Restrictions & Disclaimer

> [!CAUTION]
> **This tool is for informational and organizational purposes only. It is NOT a cleanup manual.**

- **DO NOT** attempt do-it-yourself (DIY) remediation of blood, bodily fluids, animal waste, or chemical/biological spills.
- **DO NOT** touch, sweep, vacuum, or disturb suspected hazardous materials, as disturbance can aerosolize dangerous pathogens.
- **NO CHEMICAL INSTRUCTIONS**: This tool deliberately excludes chemical mixing ratios, bleach solutions, and disinfection protocols. Certified remediation requires hospital-grade, EPA-registered antimicrobial agents handled by trained technicians.
- **NO GUARANTEE OF SAFETY**: Completing the checklist does not eliminate contamination or certify a property as safe. Always retain licensed, insured remediation professionals.

---

## External & Public Safety Resources

For authoritative health regulations and occupational standards, consult:

- **Centers for Disease Control and Prevention (CDC)**: [https://www.cdc.gov/](https://www.cdc.gov/)
- **Occupational Safety and Health Administration (OSHA)**: [https://www.osha.gov/](https://www.osha.gov/)
  - *OSHA Bloodborne Pathogens Standard*: 29 CFR 1910.1030
- **Regional Professional Directory**:
  - [Biohazard Cleanup Los Angeles](https://www.biohazardcleanuplosangelesca.com/)

---

## License

This project is open-source software licensed under the [MIT License](LICENSE).

