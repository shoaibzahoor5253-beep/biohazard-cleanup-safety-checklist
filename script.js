/**
 * Biohazard Cleanup Safety Checklist
 * Client-side script handling:
 * - Safety Awareness Checklist with LocalStorage persistence
 * - Incident Documentation Form with validation, LocalStorage, and print engine
 * - Dashboard status synchronization
 * - Accessible Modal & Toast systems
 * - Responsive navigation
 */

(function () {
  'use strict';

  // Storage Keys
  const STORAGE_CHECKLIST_KEY = 'biohazard_checklist_state_v1';
  const STORAGE_REPORT_KEY = 'biohazard_incident_report_v1';

  // DOM Elements - Navigation & Global
  const navToggle = document.getElementById('nav-toggle');
  const primaryNav = document.getElementById('primary-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const currentYearSpan = document.getElementById('current-year');

  // DOM Elements - Checklist
  const checklistInputs = document.querySelectorAll('.checklist-input');
  const checklistProgressFill = document.getElementById('checklist-progressbar-fill');
  const checklistProgressBar = document.getElementById('checklist-progressbar');
  const checklistCountText = document.getElementById('checklist-count-text');
  const checklistPercentageText = document.getElementById('checklist-percentage-text');
  const btnResetChecklist = document.getElementById('btn-reset-checklist');
  const dashChecklistBadge = document.getElementById('dash-checklist-badge');
  const dashChecklistFill = document.getElementById('dash-checklist-fill');
  const dashChecklistLabel = document.getElementById('dash-checklist-label');

  // DOM Elements - Documentation Form
  const incidentForm = document.getElementById('incident-form');
  const fieldTitle = document.getElementById('incident-title');
  const fieldDate = document.getElementById('incident-date');
  const fieldProperty = document.getElementById('property-type');
  const fieldLocation = document.getElementById('incident-location');
  const fieldCategory = document.getElementById('incident-category');
  const fieldDesc = document.getElementById('incident-description');
  const btnClearForm = document.getElementById('btn-clear-form');
  const btnPrintReport = document.getElementById('btn-print-report');
  const formFeedback = document.getElementById('form-feedback');

  // DOM Elements - Saved Report Aside Panel & Dashboard Status
  const savedReportBadge = document.getElementById('saved-report-badge');
  const savedReportContent = document.getElementById('saved-report-content');
  const savedReportActions = document.getElementById('saved-report-actions');
  const btnQuickPrint = document.getElementById('btn-quick-print');
  const btnDeleteReport = document.getElementById('btn-delete-report');
  const dashReportBadge = document.getElementById('dash-report-badge');
  const dashReportText = document.getElementById('dash-report-text');
  const dashReportStatus = document.getElementById('dash-report-status');

  // DOM Elements - Modal & Toast & Print
  const modal = document.getElementById('confirmation-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalMessage = document.getElementById('modal-message');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalCancelBtn = document.getElementById('modal-cancel-btn');
  const modalConfirmBtn = document.getElementById('modal-confirm-btn');
  const toastContainer = document.getElementById('toast-container');
  const printTemplate = document.getElementById('print-template');

  let activeModalConfirmCallback = null;

  /* ==========================================================================
     1. Initialization
     ========================================================================== */
  function init() {
    // Set dynamic current year in footer
    if (currentYearSpan) {
      currentYearSpan.textContent = new Date().getFullYear();
    }

    // Set default date in incident form to today if empty
    if (fieldDate && !fieldDate.value) {
      const today = new Date().toISOString().split('T')[0];
      fieldDate.value = today;
    }

    // Initialize Mobile Navigation
    initNavigation();

    // Initialize Checklist
    loadChecklistState();
    attachChecklistListeners();

    // Initialize Incident Form & Saved Report
    loadSavedReport();
    attachFormListeners();

    // Initialize Modal & Print Handlers
    initModalEvents();
  }

  /* ==========================================================================
     2. Navigation & Mobile Menu
     ========================================================================== */
  function initNavigation() {
    if (navToggle && primaryNav) {
      navToggle.addEventListener('click', function () {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', String(!isExpanded));
        primaryNav.classList.toggle('is-open', !isExpanded);
      });
    }

    // Close mobile nav on link click and update active state
    navLinks.forEach(link => {
      link.addEventListener('click', function () {
        if (primaryNav.classList.contains('is-open')) {
          primaryNav.classList.remove('is-open');
          if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
        }

        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
      });
    });

    // Update active nav based on scroll position
    window.addEventListener('scroll', throttle(highlightActiveSectionOnScroll, 100));
  }

  function highlightActiveSectionOnScroll() {
    const scrollPos = window.scrollY + 140;
    const sections = document.querySelectorAll('section[id], header[id]');

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  /* ==========================================================================
     3. Safety Awareness Checklist
     ========================================================================== */
  function attachChecklistListeners() {
    checklistInputs.forEach(input => {
      input.addEventListener('change', function () {
        const itemEl = this.closest('.checklist-item');
        if (itemEl) {
          itemEl.classList.toggle('is-checked', this.checked);
        }
        saveChecklistState();
        updateChecklistProgressUI();
      });
    });

    if (btnResetChecklist) {
      btnResetChecklist.addEventListener('click', function () {
        openConfirmModal({
          title: 'Reset Safety Checklist',
          message: 'Are you sure you want to reset all checklist items? Your checked items will be cleared in your browser storage.',
          confirmText: 'Reset Checklist',
          confirmClass: 'btn-danger',
          onConfirm: resetChecklist
        });
      });
    }
  }

  function saveChecklistState() {
    try {
      const state = {};
      checklistInputs.forEach(input => {
        const id = input.getAttribute('data-item-id') || input.id;
        state[id] = input.checked;
      });
      localStorage.setItem(STORAGE_CHECKLIST_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('LocalStorage error saving checklist:', e);
    }
  }

  function loadChecklistState() {
    try {
      const raw = localStorage.getItem(STORAGE_CHECKLIST_KEY);
      if (!raw) {
        updateChecklistProgressUI();
        return;
      }
      const state = JSON.parse(raw);
      checklistInputs.forEach(input => {
        const id = input.getAttribute('data-item-id') || input.id;
        if (state[id] === true) {
          input.checked = true;
          const itemEl = input.closest('.checklist-item');
          if (itemEl) itemEl.classList.add('is-checked');
        } else {
          input.checked = false;
        }
      });
    } catch (e) {
      console.warn('LocalStorage error loading checklist:', e);
    }
    updateChecklistProgressUI();
  }

  function resetChecklist() {
    checklistInputs.forEach(input => {
      input.checked = false;
      const itemEl = input.closest('.checklist-item');
      if (itemEl) itemEl.classList.remove('is-checked');
    });

    try {
      localStorage.removeItem(STORAGE_CHECKLIST_KEY);
    } catch (e) {
      console.warn('LocalStorage remove error:', e);
    }

    updateChecklistProgressUI();
    showToast('Safety Checklist has been reset.', 'info');
  }

  function updateChecklistProgressUI() {
    const total = checklistInputs.length;
    let checked = 0;
    checklistInputs.forEach(input => {
      if (input.checked) checked++;
    });

    const percent = total > 0 ? Math.round((checked / total) * 100) : 0;

    // Update section progress display
    if (checklistProgressBar) {
      checklistProgressBar.setAttribute('aria-valuenow', String(percent));
    }
    if (checklistProgressFill) {
      checklistProgressFill.style.width = percent + '%';
    }
    if (checklistCountText) {
      checklistCountText.textContent = `${checked} of ${total} items completed`;
    }
    if (checklistPercentageText) {
      checklistPercentageText.textContent = `${percent}%`;
    }

    // Update Dashboard Card 1
    if (dashChecklistBadge) {
      dashChecklistBadge.textContent = `${checked} / ${total} Complete`;
      if (checked === total && total > 0) {
        dashChecklistBadge.classList.add('badge-success');
      } else {
        dashChecklistBadge.classList.remove('badge-success');
      }
    }
    if (dashChecklistFill) {
      dashChecklistFill.style.width = percent + '%';
    }
    if (dashChecklistLabel) {
      dashChecklistLabel.textContent = `${percent}% completed`;
    }
  }

  /* ==========================================================================
     4. Incident Documentation Form
     ========================================================================== */
  function attachFormListeners() {
    if (incidentForm) {
      incidentForm.addEventListener('submit', function (e) {
        e.preventDefault();
        handleFormSubmit();
      });
    }

    // Radio change visual handler
    const radioInputs = document.querySelectorAll('input[name="professionalContacted"]');
    radioInputs.forEach(radio => {
      radio.addEventListener('change', function () {
        document.querySelectorAll('.radio-label').forEach(label => label.classList.remove('is-selected'));
        const parentLabel = this.closest('.radio-label');
        if (parentLabel && this.checked) {
          parentLabel.classList.add('is-selected');
        }
        clearFieldError('contacted-error');
      });
    });

    // Clear individual field errors on input
    if (fieldTitle) fieldTitle.addEventListener('input', () => clearFieldError('title-error', fieldTitle));
    if (fieldDate) fieldDate.addEventListener('change', () => clearFieldError('date-error', fieldDate));
    if (fieldProperty) fieldProperty.addEventListener('change', () => clearFieldError('property-error', fieldProperty));
    if (fieldLocation) fieldLocation.addEventListener('input', () => clearFieldError('location-error', fieldLocation));
    if (fieldCategory) fieldCategory.addEventListener('change', () => clearFieldError('category-error', fieldCategory));
    if (fieldDesc) fieldDesc.addEventListener('input', () => clearFieldError('desc-error', fieldDesc));

    // Clear Form button
    if (btnClearForm) {
      btnClearForm.addEventListener('click', function () {
        openConfirmModal({
          title: 'Clear Form Inputs',
          message: 'Clear all entered data in this form? (This will reset the form inputs on screen without deleting saved records).',
          confirmText: 'Clear Form',
          confirmClass: 'btn-danger',
          onConfirm: resetFormInputs
        });
      });
    }

    // Print Report button
    if (btnPrintReport) {
      btnPrintReport.addEventListener('click', function () {
        prepareAndTriggerPrint();
      });
    }

    // Quick print from aside card
    if (btnQuickPrint) {
      btnQuickPrint.addEventListener('click', function () {
        prepareAndTriggerPrint();
      });
    }

    // Delete stored record button
    if (btnDeleteReport) {
      btnDeleteReport.addEventListener('click', function () {
        openConfirmModal({
          title: 'Delete Stored Incident Report',
          message: 'Are you sure you want to permanently delete this saved documentation report from your browser storage?',
          confirmText: 'Delete Report',
          confirmClass: 'btn-danger',
          onConfirm: deleteSavedReport
        });
      });
    }
  }

  function validateForm() {
    let isValid = true;

    // Title validation
    if (!fieldTitle.value.trim()) {
      showFieldError('title-error', 'Please enter a descriptive incident title.', fieldTitle);
      isValid = false;
    } else {
      clearFieldError('title-error', fieldTitle);
    }

    // Date validation
    if (!fieldDate.value) {
      showFieldError('date-error', 'Please select the date of discovery.', fieldDate);
      isValid = false;
    } else {
      clearFieldError('date-error', fieldDate);
    }

    // Property Type validation
    if (!fieldProperty.value) {
      showFieldError('property-error', 'Please select a property category.', fieldProperty);
      isValid = false;
    } else {
      clearFieldError('property-error', fieldProperty);
    }

    // General Location validation
    if (!fieldLocation.value.trim()) {
      showFieldError('location-error', 'Please specify the general location on the property.', fieldLocation);
      isValid = false;
    } else {
      clearFieldError('location-error', fieldLocation);
    }

    // Incident Category validation
    if (!fieldCategory.value) {
      showFieldError('category-error', 'Please choose an incident category.', fieldCategory);
      isValid = false;
    } else {
      clearFieldError('category-error', fieldCategory);
    }

    // Description validation
    if (!fieldDesc.value.trim()) {
      showFieldError('desc-error', 'Please provide a factual visual description of the situation.', fieldDesc);
      isValid = false;
    } else if (fieldDesc.value.trim().length < 10) {
      showFieldError('desc-error', 'Please provide a slightly more descriptive observation (at least 10 characters).', fieldDesc);
      isValid = false;
    } else {
      clearFieldError('desc-error', fieldDesc);
    }

    // Radio validation: professional contacted
    const contactedChecked = document.querySelector('input[name="professionalContacted"]:checked');
    if (!contactedChecked) {
      showFieldError('contacted-error', 'Please indicate whether professional assistance has been contacted.');
      isValid = false;
    } else {
      clearFieldError('contacted-error');
    }

    return isValid;
  }

  function showFieldError(errorElId, message, inputEl) {
    const errorEl = document.getElementById(errorElId);
    if (errorEl) {
      errorEl.textContent = message;
    }
    if (inputEl) {
      inputEl.classList.add('has-error');
    }
  }

  function clearFieldError(errorElId, inputEl) {
    const errorEl = document.getElementById(errorElId);
    if (errorEl) {
      errorEl.textContent = '';
    }
    if (inputEl) {
      inputEl.classList.remove('has-error');
    }
  }

  function clearAllErrors() {
    const errorSpans = document.querySelectorAll('.field-error');
    errorSpans.forEach(span => { span.textContent = ''; });
    const inputsWithErrors = document.querySelectorAll('.has-error');
    inputsWithErrors.forEach(input => { input.classList.remove('has-error'); });
    if (formFeedback) {
      formFeedback.hidden = true;
      formFeedback.textContent = '';
      formFeedback.className = 'form-feedback';
    }
  }

  function handleFormSubmit() {
    if (!validateForm()) {
      showToast('Please complete all required fields.', 'warning');
      return;
    }

    const contactedVal = document.querySelector('input[name="professionalContacted"]:checked').value;

    const reportData = {
      incidentTitle: fieldTitle.value.trim(),
      incidentDate: fieldDate.value,
      propertyType: fieldProperty.value,
      incidentLocation: fieldLocation.value.trim(),
      incidentCategory: fieldCategory.value,
      incidentDescription: fieldDesc.value.trim(),
      professionalContacted: contactedVal,
      savedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(STORAGE_REPORT_KEY, JSON.stringify(reportData));
      renderSavedReportCard(reportData);
      updateDashboardReportStatus(reportData);
      showToast('Incident documentation saved to local storage.', 'info');

      if (formFeedback) {
        formFeedback.hidden = false;
        formFeedback.className = 'form-feedback success';
        formFeedback.textContent = 'Report successfully saved locally in your browser.';
      }
    } catch (e) {
      console.error('Failed to save incident report:', e);
      showToast('Unable to save report to local browser storage.', 'error');
    }
  }

  function resetFormInputs() {
    incidentForm.reset();
    clearAllErrors();
    document.querySelectorAll('.radio-label').forEach(label => label.classList.remove('is-selected'));
    // Reset date to today
    const today = new Date().toISOString().split('T')[0];
    fieldDate.value = today;
    showToast('Form fields cleared.', 'info');
  }

  function deleteSavedReport() {
    try {
      localStorage.removeItem(STORAGE_REPORT_KEY);
      renderSavedReportCard(null);
      updateDashboardReportStatus(null);
      showToast('Saved incident documentation deleted.', 'info');
    } catch (e) {
      console.warn('Error deleting report:', e);
    }
  }

  function loadSavedReport() {
    try {
      const raw = localStorage.getItem(STORAGE_REPORT_KEY);
      if (!raw) {
        renderSavedReportCard(null);
        updateDashboardReportStatus(null);
        return;
      }
      const data = JSON.parse(raw);
      populateFormFields(data);
      renderSavedReportCard(data);
      updateDashboardReportStatus(data);
    } catch (e) {
      console.warn('Error loading saved report:', e);
      renderSavedReportCard(null);
      updateDashboardReportStatus(null);
    }
  }

  function populateFormFields(data) {
    if (!data) return;
    if (fieldTitle && data.incidentTitle) fieldTitle.value = data.incidentTitle;
    if (fieldDate && data.incidentDate) fieldDate.value = data.incidentDate;
    if (fieldProperty && data.propertyType) fieldProperty.value = data.propertyType;
    if (fieldLocation && data.incidentLocation) fieldLocation.value = data.incidentLocation;
    if (fieldCategory && data.incidentCategory) fieldCategory.value = data.incidentCategory;
    if (fieldDesc && data.incidentDescription) fieldDesc.value = data.incidentDescription;

    if (data.professionalContacted) {
      const targetRadio = document.querySelector(`input[name="professionalContacted"][value="${data.professionalContacted}"]`);
      if (targetRadio) {
        targetRadio.checked = true;
        const parentLabel = targetRadio.closest('.radio-label');
        if (parentLabel) parentLabel.classList.add('is-selected');
      }
    }
  }

  function renderSavedReportCard(data) {
    if (!savedReportContent) return;

    if (!data) {
      savedReportBadge.textContent = 'Draft Status';
      savedReportBadge.className = 'badge';
      savedReportContent.innerHTML = `
        <div class="empty-report-state">
          <div class="empty-icon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
          </div>
          <p class="empty-text">No incident report saved yet.</p>
          <p class="empty-subtext">Fill out the incident form on the left and click "Save Report" to store a local copy.</p>
        </div>
      `;
      if (savedReportActions) savedReportActions.hidden = true;
      return;
    }

    savedReportBadge.textContent = 'Saved Locally';
    savedReportBadge.className = 'badge badge-success';

    const formattedDate = formatDateString(data.incidentDate);
    const savedTime = data.savedAt ? new Date(data.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

    savedReportContent.innerHTML = `
      <div class="stored-report-meta">
        <h4 class="stored-title">${escapeHTML(data.incidentTitle)}</h4>
        <div class="stored-meta-row">
          <span class="stored-meta-label">Discovered:</span>
          <span>${escapeHTML(formattedDate)}</span>
        </div>
        <div class="stored-meta-row">
          <span class="stored-meta-label">Property:</span>
          <span>${escapeHTML(data.propertyType)}</span>
        </div>
        <div class="stored-meta-row">
          <span class="stored-meta-label">Location:</span>
          <span>${escapeHTML(data.incidentLocation)}</span>
        </div>
        <div class="stored-meta-row">
          <span class="stored-meta-label">Category:</span>
          <span>${escapeHTML(data.incidentCategory)}</span>
        </div>
        <div class="stored-meta-row">
          <span class="stored-meta-label">Pro Contacted:</span>
          <span><strong>${escapeHTML(data.professionalContacted)}</strong></span>
        </div>
      </div>
      <div class="stored-desc-box">
        <strong>Observations:</strong><br>
        ${escapeHTML(data.incidentDescription)}
      </div>
      <div class="stored-meta-row" style="font-size:0.75rem; color:#94a3b8;">
        <span>Last saved: ${savedTime}</span>
      </div>
    `;

    if (savedReportActions) savedReportActions.hidden = false;
  }

  function updateDashboardReportStatus(data) {
    if (!dashReportBadge || !dashReportText || !dashReportStatus) return;

    const indicator = dashReportStatus.querySelector('.status-indicator');

    if (!data) {
      dashReportBadge.textContent = 'No Report Saved';
      dashReportBadge.className = 'dash-card-badge';
      dashReportText.textContent = 'Ready for new documentation';
      if (indicator) {
        indicator.className = 'status-indicator';
      }
    } else {
      dashReportBadge.textContent = 'Report Saved';
      dashReportBadge.className = 'dash-card-badge badge-success';
      dashReportText.textContent = `Saved: "${data.incidentTitle.slice(0, 24)}${data.incidentTitle.length > 24 ? '...' : ''}"`;
      if (indicator) {
        indicator.className = 'status-indicator status-saved';
      }
    }
  }

  /* ==========================================================================
     5. Print Engine
     ========================================================================== */
  function prepareAndTriggerPrint() {
    // Collect report details: prioritize active form values if valid, else saved storage
    let currentData = null;

    if (fieldTitle.value.trim()) {
      const radio = document.querySelector('input[name="professionalContacted"]:checked');
      currentData = {
        incidentTitle: fieldTitle.value.trim(),
        incidentDate: fieldDate.value || new Date().toISOString().split('T')[0],
        propertyType: fieldProperty.value || 'Not specified',
        incidentLocation: fieldLocation.value.trim() || 'Not specified',
        incidentCategory: fieldCategory.value || 'Not specified',
        incidentDescription: fieldDesc.value.trim() || 'No visual description recorded.',
        professionalContacted: radio ? radio.value : 'Not specified',
        savedAt: new Date().toISOString()
      };
    } else {
      try {
        const raw = localStorage.getItem(STORAGE_REPORT_KEY);
        if (raw) currentData = JSON.parse(raw);
      } catch (e) {
        console.warn(e);
      }
    }

    if (!currentData || !currentData.incidentTitle) {
      showToast('Please enter an Incident Title before printing.', 'warning');
      if (fieldTitle) fieldTitle.focus();
      return;
    }

    // Collect checklist completion summary
    const checklistSummary = [];
    checklistInputs.forEach(input => {
      const titleSpan = input.closest('.checklist-item')?.querySelector('.item-title');
      const text = titleSpan ? titleSpan.textContent.trim() : input.id;
      checklistSummary.push({
        text: text,
        checked: input.checked
      });
    });

    // Populate Print Template
    renderPrintTemplate(currentData, checklistSummary);

    // Call native window.print()
    setTimeout(() => {
      window.print();
    }, 100);
  }

  function renderPrintTemplate(data, checklistItems) {
    if (!printTemplate) return;

    const formattedDate = formatDateString(data.incidentDate);
    const printedTimestamp = new Date().toLocaleString();

    let checklistHTML = '';
    checklistItems.forEach(item => {
      const symbol = item.checked ? '[X]' : '[  ]';
      checklistHTML += `<div class="print-checklist-item"><strong>${symbol}</strong> ${escapeHTML(item.text)}</div>`;
    });

    printTemplate.innerHTML = `
      <div class="print-document">
        <div class="print-header">
          <div>
            <h1 class="print-header-title">Biohazard Incident Documentation Report</h1>
            <p class="print-header-sub">Property Safety Awareness &amp; Incident Record</p>
          </div>
          <div class="print-badge">Confidential Record</div>
        </div>

        <table class="print-table">
          <tbody>
            <tr>
              <th>Incident Title</th>
              <td colspan="3"><strong>${escapeHTML(data.incidentTitle)}</strong></td>
            </tr>
            <tr>
              <th>Date Discovered</th>
              <td>${escapeHTML(formattedDate)}</td>
              <th>Property Type</th>
              <td>${escapeHTML(data.propertyType)}</td>
            </tr>
            <tr>
              <th>General Location</th>
              <td>${escapeHTML(data.incidentLocation)}</td>
              <th>Hazard Category</th>
              <td>${escapeHTML(data.incidentCategory)}</td>
            </tr>
            <tr>
              <th>Pro Assistance Contacted?</th>
              <td colspan="3"><strong>${escapeHTML(data.professionalContacted)}</strong></td>
            </tr>
          </tbody>
        </table>

        <div class="print-block">
          <h2 class="print-block-title">Visual Situation Description</h2>
          <div class="print-desc-box">${escapeHTML(data.incidentDescription)}</div>
        </div>

        <div class="print-block">
          <h2 class="print-block-title">Associated Safety Awareness Checklist Status</h2>
          <div class="print-checklist-summary">
            ${checklistHTML}
          </div>
        </div>

        <div class="print-disclaimer-box">
          <strong>Official Safety &amp; Informational Notice:</strong> This document is an informational record for property documentation and qualified remediation consultation. It does not certify decontamination, does not replace professional environmental hygiene assessment, and must not be used as a DIY remediation guide. Potentially hazardous biological materials must only be remediated and disposed of by certified biohazard specialists in compliance with OSHA and local regulations.
        </div>

        <div class="print-signature-grid">
          <div>
            <div class="print-signature-line">Documented By (Print Name &amp; Signature)</div>
          </div>
          <div>
            <div class="print-signature-line">Date &amp; Time Printed: ${printedTimestamp}</div>
          </div>
        </div>
      </div>
    `;
  }

  /* ==========================================================================
     6. Modal Dialog System
     ========================================================================== */
  function initModalEvents() {
    if (!modal) return;

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) {
        closeModal();
      }
    });

    if (modalConfirmBtn) {
      modalConfirmBtn.addEventListener('click', function () {
        if (typeof activeModalConfirmCallback === 'function') {
          activeModalConfirmCallback();
        }
        closeModal();
      });
    }
  }

  function openConfirmModal(opts) {
    if (!modal) return;
    modalTitle.textContent = opts.title || 'Confirm Action';
    modalMessage.textContent = opts.message || 'Are you sure?';
    modalConfirmBtn.textContent = opts.confirmText || 'Confirm';

    // Reset button styles
    modalConfirmBtn.className = 'btn ' + (opts.confirmClass || 'btn-danger');

    activeModalConfirmCallback = opts.onConfirm;
    modal.hidden = false;
    modalConfirmBtn.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    activeModalConfirmCallback = null;
  }

  /* ==========================================================================
     7. Toast Notification System
     ========================================================================== */
  function showToast(message, type = 'info') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'toast-error' : type === 'warning' ? 'toast-warning' : ''}`;
    toast.setAttribute('role', 'status');

    let iconSvg = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
    `;

    if (type === 'error' || type === 'warning') {
      iconSvg = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      `;
    }

    toast.innerHTML = `
      <span aria-hidden="true">${iconSvg}</span>
      <span>${escapeHTML(message)}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 200ms ease, transform 200ms ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 200);
    }, 3500);
  }

  /* ==========================================================================
     8. Utility Functions
     ========================================================================== */
  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatDateString(dateStr) {
    if (!dateStr) return 'Not recorded';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const d = new Date(year, month, day);
        return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
      }
      return dateStr;
    } catch (e) {
      return dateStr;
    }
  }

  function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function (...args) {
      const context = this;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function () {
          if ((Date.now() - lastRan) >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

