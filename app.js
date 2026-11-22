(function () {
  const STATE_KEY = "haanes_1kl_norskhefte_v2";
  const VOKALER = ["a", "e", "i", "o", "u", "y", "æ", "ø", "å"];

  // Fast rekkefølge på alle ark i heftet (totalt 17 ark + Ark 0)
  const SHEET_PLAN = [
    { id: "1", type: "norsk", num: 1, defaultWeek: "Uke 37" },
    { id: "2", type: "norsk", num: 2, defaultWeek: "Uke 38" },
    { id: "3", type: "norsk", num: 3, defaultWeek: "Uke 39" },
    { id: "4", type: "norsk", num: 4, defaultWeek: "Uke 41" },
    { id: "5", type: "norsk", num: 5, defaultWeek: "Uke 42" },
    { id: "rep1", type: "rep1", label: "Repetering 1", defaultWeek: "Uke 43" },
    { id: "6", type: "norsk", num: 6, defaultWeek: "Uke 44" },
    { id: "7", type: "norsk", num: 7, defaultWeek: "Uke 45" },
    { id: "8", type: "norsk", num: 8, defaultWeek: "Uke 46" },
    { id: "9", type: "norsk", num: 9, defaultWeek: "Uke 47" },
    { id: "10", type: "norsk", num: 10, defaultWeek: "Uke 48" },
    { id: "rep2", type: "rep2", label: "Repetering 2", defaultWeek: "Uke 49" },
    { id: "11", type: "norsk", num: 11, defaultWeek: "Uke 50" },
    { id: "12", type: "norsk", num: 12, defaultWeek: "Uke 51" },
    { id: "13", type: "norsk", num: 13, defaultWeek: "Uke 2" },
    { id: "14", type: "norsk", num: 14, defaultWeek: "Uke 3" },
    { id: "oppsummering", type: "oppsummering", label: "Oppsummering", defaultWeek: "" }
  ];

  let activeSheet = "1";
  let showPageNumbers = true;

  function getLetters(norsk) {
    if (!norsk) return [];
    if (Array.isArray(norsk.bokstaver)) return norsk.bokstaver.map((b) => b.toUpperCase());
    if (norsk.bokstav) return [norsk.bokstav.toUpperCase()];
    return [];
  }


function createDefaultSettings() {
    const map = {
      "0": { visible: true, showToc: true }
    };

    SHEET_PLAN.forEach((item) => {
      if (item.type === "norsk") {
        map[item.id] = {
          visible: true,
          weekLabel: item.defaultWeek,
          norsk: {
            show: true,
            intro: true,
            match: true,
            words: true,
            onlyFirstWord: true,
            rhyme: true
          }
        };
      } else if (item.type === "rep1") {
        map[item.id] = {
          visible: true,
          weekLabel: item.defaultWeek,
          tasks: {
            vowels: true,
            firstSound: true,
            readMatch: true,
            writeWords: true
          }
        };
} else if (item.type === "rep2") {
     map[item.id] = {
       visible: true,
       weekLabel: item.defaultWeek,
       tasks: {
         vowels: true,
         findPos: true,
         writeWords: true,
         chooseWord: true
       }
     };
} else if (item.type === "oppsummering") {
     map[item.id] = {
       visible: true,
       weekLabel: item.defaultWeek,
       tasks: {
         alphabet: true,
         vowels: true,
         colorByLetter: true,
         writeWords: true,
       }
        };
      }
    });

    return map;
  }


  let sheetSettings = loadSettings();

  function loadSettings() {
    try {
      const saved = localStorage.getItem(STATE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const defaults = createDefaultSettings();
        if (parsed["0"]) {
          defaults["0"] = { ...defaults["0"], ...parsed["0"] };
        }
        SHEET_PLAN.forEach((item) => {
          if (parsed[item.id]) {
            defaults[item.id] = {
              ...defaults[item.id],
              ...parsed[item.id],
              norsk: defaults[item.id].norsk
                ? { ...defaults[item.id].norsk, ...(parsed[item.id].norsk || {}) }
                : undefined,
              tasks: defaults[item.id].tasks
                ? { ...defaults[item.id].tasks, ...(parsed[item.id].tasks || {}) }
                : undefined
            };
          }
        });
        return defaults;
      }
    } catch (e) {
      console.warn("Kunne ikke lese lagrede innstillinger:", e);
    }
    return createDefaultSettings();
  }

  function saveSettings() {
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify(sheetSettings));
    } catch (e) {
      console.warn("Kunne ikke lagre innstillinger:", e);
    }
  }

  const ICON_DOC = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
  const ICON_STAR = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
  const ICON_EYE_OPEN = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
  const ICON_EYE_OFF = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

  // ==========================================
  // INNLOGGING OG VANNMERKE FOR HÅNES SKOLE
  // ==========================================
  const HAANES_AUTH = {
    user: "Haanes",
    pass: "Hest1234",
    storageKey: "haanes_arbeidshefte_auth"
  };

  function updateAuthButtons(isLoggedIn) {
    const loginBtn = document.getElementById("sidebarLoginBtn");
    const logoutBtn = document.getElementById("sidebarLogoutBtn");

    if (isLoggedIn) {
      if (loginBtn) loginBtn.classList.add("hidden");
      if (logoutBtn) logoutBtn.classList.remove("hidden");
    } else {
      if (loginBtn) loginBtn.classList.remove("hidden");
      if (logoutBtn) logoutBtn.classList.add("hidden");
    }
  }

  function openLoginModal() {
    const modal = document.getElementById("loginModal");
    const errorMsg = document.getElementById("loginErrorMsg");
    if (errorMsg) errorMsg.classList.add("hidden");
    if (modal) modal.classList.remove("hidden");
  }

  function handleLoginSubmit(event) {
    event.preventDefault();
    const usernameInput = document.getElementById("loginUsername").value.trim();
    const passwordInput = document.getElementById("loginPassword").value;
    const errorMsg = document.getElementById("loginErrorMsg");

    if (usernameInput.toLowerCase() === HAANES_AUTH.user.toLowerCase() && passwordInput === HAANES_AUTH.pass) {
      sessionStorage.setItem(HAANES_AUTH.storageKey, "logged_in");
      document.body.classList.remove("show-watermark");
      document.getElementById("loginModal").classList.add("hidden");
      if (errorMsg) errorMsg.classList.add("hidden");
      updateAuthButtons(true);
    } else {
      if (errorMsg) errorMsg.classList.remove("hidden");
    }
  }

  function continueWithWatermark() {
    sessionStorage.setItem(HAANES_AUTH.storageKey, "guest");
    document.body.classList.add("show-watermark");
    document.getElementById("loginModal").classList.add("hidden");
    updateAuthButtons(false);
  }

  function logoutUser() {
    sessionStorage.removeItem(HAANES_AUTH.storageKey);
    document.body.classList.add("show-watermark");
    updateAuthButtons(false);
    openLoginModal();
  }

  function initAuthWatermark() {
    const savedState = sessionStorage.getItem(HAANES_AUTH.storageKey);
    const modal = document.getElementById("loginModal");

    if (savedState === "logged_in") {
      document.body.classList.remove("show-watermark");
      if (modal) modal.classList.add("hidden");
      updateAuthButtons(true);
    } else if (savedState === "guest") {
      document.body.classList.add("show-watermark");
      if (modal) modal.classList.add("hidden");
      updateAuthButtons(false);
    } else {
      document.body.classList.add("show-watermark");
      if (modal) modal.classList.remove("hidden");
      updateAuthButtons(false);
    }

    const form = document.getElementById("haanesLoginForm");
    if (form) form.addEventListener("submit", handleLoginSubmit);

    const guestBtn = document.getElementById("btnContinueWatermark");
    if (guestBtn) guestBtn.addEventListener("click", continueWithWatermark);

    const loginBtn = document.getElementById("sidebarLoginBtn");
    if (loginBtn) loginBtn.addEventListener("click", openLoginModal);

    const logoutBtn = document.getElementById("sidebarLogoutBtn");
    if (logoutBtn) logoutBtn.addEventListener("click", logoutUser);
  }

  // REDIGER UKENUMRE-MODAL
  document.getElementById("btn-edit-weeks").addEventListener("click", () => {
    const grid = document.getElementById("weeks-editor-grid");
    grid.innerHTML = "";

    SHEET_PLAN.forEach((item) => {
      if (item.type === "oppsummering") return; // Oppsummering har ikke ukenummer

      let displayTitle = item.label;
      if (item.type === "norsk") {
        const norsk = window.NORSK_DATA[item.num] || {};
        const letterLabel = getLetters(norsk).join("").toLowerCase();
        displayTitle = `Ark ${item.num}${letterLabel ? ` (${letterLabel})` : ""}`;
      }

      const row = document.createElement("div");
      row.className = "week-edit-item";
      row.innerHTML = `
        <span>${displayTitle}</span>
        <input type="text" data-sheet="${item.id}" value="${sheetSettings[item.id].weekLabel}" />
      `;
      row.querySelector("input").addEventListener("input", (e) => {
        sheetSettings[item.id].weekLabel = e.target.value;
        saveSettings();
        renderSidebarCards();
        renderSheets();
      });
      grid.appendChild(row);
    });

    document.getElementById("weeks-modal").classList.remove("hidden");
  });

  document.getElementById("btn-reset-weeks").addEventListener("click", () => {
    SHEET_PLAN.forEach((item) => {
      sheetSettings[item.id].weekLabel = item.defaultWeek;
    });
    saveSettings();
    document.getElementById("btn-edit-weeks").click();
    renderSidebarCards();
    renderSheets();
  });

  document.getElementById("btn-close-weeks").addEventListener("click", () => {
    document.getElementById("weeks-modal").classList.add("hidden");
  });

  document.getElementById("chk-show-pagenums").addEventListener("change", (e) => {
    showPageNumbers = e.target.checked;
    renderSheets();
  });

  setupPrintModals();

  // RENDER KORTENE I VENSTREMENYEN
  function renderSidebarCards() {
    const container = document.getElementById("sheet-cards-list");
    container.innerHTML = "";

    // KORT FOR ARK 0 (FORSIDE & INNHOLDSFORTEGNELSE)
    const cfg0 = sheetSettings["0"];
    const isCoverSelected = activeSheet === "0";
    const coverCard = document.createElement("div");
    coverCard.dataset.sheet = "0";
    coverCard.className =
      "sheet-card" +
      (isCoverSelected ? " active" : "") +
      (!cfg0.visible ? " is-hidden-sheet" : "");

    coverCard.innerHTML = `
      <div class="card-top-row" style="margin-bottom: ${isCoverSelected && cfg0.visible ? "8px" : "0"};">
        <div class="card-title-left">
          ${ICON_DOC}
          <span>Forside &amp; Innholdsfortegnelse</span>
        </div>
        <div class="card-meta-right">
          <span class="week-badge">Hefte</span>
          <button type="button" class="eye-btn" data-action="toggle-visible" title="${cfg0.visible ? "Skjul forside fra utskrift" : "Vis forside"}">
            ${cfg0.visible ? ICON_EYE_OPEN : ICON_EYE_OFF}
          </button>
        </div>
      </div>

      ${isCoverSelected && cfg0.visible ? `
        <div class="card-subtasks-row">
          <button type="button" class="mini-chip ${cfg0.showToc ? "on" : ""}" data-action="toggle-toc">Innholdsfortegnelse</button>
        </div>
      ` : ""}
    `;

    coverCard.addEventListener("click", (e) => {
      if (e.target.closest("button")) return;
      isManualSidebarClick = true;
      clearTimeout(manualClickTimer);
      manualClickTimer = setTimeout(() => { isManualSidebarClick = false; }, 700);

      activeSheet = "0";
      renderSidebarCards();
      const target = document.getElementById("sheet-page-cover") || document.getElementById("sheet-page-toc");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    coverCard.querySelector('[data-action="toggle-visible"]').addEventListener("click", (e) => {
      e.stopPropagation();
      cfg0.visible = !cfg0.visible;
      saveSettings();
      renderSidebarCards();
      renderSheets();
    });

    const tocBtn = coverCard.querySelector('[data-action="toggle-toc"]');
    if (tocBtn) {
      tocBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        cfg0.showToc = !cfg0.showToc;
        saveSettings();
        renderSidebarCards();
        renderSheets();
      });
    }

    container.appendChild(coverCard);

    // KORT FOR ALLE ARK I SHEET_PLAN
    SHEET_PLAN.forEach((item) => {
      const cfg = sheetSettings[item.id];
      const isSelected = activeSheet === item.id;
      const isSpecial = item.type !== "norsk";

      let titleText = "";
      if (item.type === "norsk") {
        const norsk = window.NORSK_DATA[item.num] || {};
        const letterLabel = getLetters(norsk).join("").toLowerCase();
        titleText = `Arbeidsark ${item.num}${letterLabel ? ` – ${letterLabel}` : ""}`;
      } else {
        titleText = item.label;
      }

      let subtaskChips = "";
      if (isSelected) {
        if (item.type === "norsk") {
          subtaskChips = `
            <button type="button" class="mini-chip ${cfg.norsk.intro ? "on" : ""}" data-sub="norsk.intro">Bokstavhus</button>
            <button type="button" class="mini-chip ${cfg.norsk.match ? "on" : ""}" data-sub="norsk.match">Sett strek</button>
            <button type="button" class="mini-chip ${cfg.norsk.words ? "on" : ""}" data-sub="norsk.words">Skrive ord</button>
            <button type="button" class="mini-chip ${cfg.norsk.onlyFirstWord ? "on" : ""}" data-sub="norsk.onlyFirstWord">Kun 1. ord</button>
            <button type="button" class="mini-chip ${cfg.norsk.rhyme ? "on" : ""}" data-sub="norsk.rhyme">Rimeord</button>
          `;
        } else if (item.type === "rep1") {
          subtaskChips = `
            <button type="button" class="mini-chip ${cfg.tasks.vowels ? "on" : ""}" data-sub="tasks.vowels">Vokal/konsonant</button>
            <button type="button" class="mini-chip ${cfg.tasks.firstSound ? "on" : ""}" data-sub="tasks.firstSound">Sistelyd</button>
            <button type="button" class="mini-chip ${cfg.tasks.readMatch ? "on" : ""}" data-sub="tasks.readMatch">Les og strek</button>
            <button type="button" class="mini-chip ${cfg.tasks.writeWords ? "on" : ""}" data-sub="tasks.writeWords">Skriv ord</button>
          `;
} else if (item.type === "rep2") {
       subtaskChips = `
         <button type="button" class="mini-chip ${cfg.tasks.vowels ? "on" : ""}" data-sub="tasks.vowels">Vokal/konsonant</button>
         <button type="button" class="mini-chip ${cfg.tasks.findPos ? "on" : ""}" data-sub="tasks.findPos">Finn bokstaven</button>
         <button type="button" class="mini-chip ${cfg.tasks.writeWords ? "on" : ""}" data-sub="tasks.writeWords">Skriv ord</button>
         <button type="button" class="mini-chip ${cfg.tasks.chooseWord ? "on" : ""}" data-sub="tasks.chooseWord">Velg riktig ord</button>
       `;
} else if (item.type === "oppsummering") {
       subtaskChips = `
         <button type="button" class="mini-chip ${cfg.tasks.alphabet ? "on" : ""}" data-sub="tasks.alphabet">Alfabetet</button>
         <button type="button" class="mini-chip ${cfg.tasks.vowels ? "on" : ""}" data-sub="tasks.vowels">Vokal/konsonant</button>
         <button type="button" class="mini-chip ${cfg.tasks.colorByLetter ? "on" : ""}" data-sub="tasks.colorByLetter">Fargelegg bilde</button>
         <button type="button" class="mini-chip ${cfg.tasks.writeWords ? "on" : ""}" data-sub="tasks.writeWords">Skriv ord</button>
       `;
        }
      }

      const card = document.createElement("div");
      card.dataset.sheet = item.id;
      card.className =
        "sheet-card" +
        (isSpecial ? " special-sheet-card" : "") +
        (isSelected ? " active" : "") +
        (!cfg.visible ? " is-hidden-sheet" : "");

      const badgeText = cfg.weekLabel || (item.type === "oppsummering" ? "Slutt" : "");

      card.innerHTML = `
        <div class="card-top-row" style="margin-bottom: ${isSelected && subtaskChips ? "8px" : "0"};">
          <div class="card-title-left">
            ${isSpecial ? ICON_STAR : ICON_DOC}
            <span>${titleText}</span>
          </div>
          <div class="card-meta-right">
            ${badgeText ? `<span class="week-badge ${isSpecial ? "special-badge" : ""}">${badgeText}</span>` : ""}
            <button type="button" class="eye-btn" data-action="toggle-visible" title="${cfg.visible ? "Skjul ark fra utskrift" : "Vis ark"}">
              ${cfg.visible ? ICON_EYE_OPEN : ICON_EYE_OFF}
            </button>
          </div>
        </div>

        ${isSelected && subtaskChips ? `<div class="card-subtasks-row">${subtaskChips}</div>` : ""}
      `;

      card.addEventListener("click", (e) => {
        if (e.target.closest("button")) return;
        isManualSidebarClick = true;
        clearTimeout(manualClickTimer);
        manualClickTimer = setTimeout(() => { isManualSidebarClick = false; }, 700);

        activeSheet = item.id;
        renderSidebarCards();
        const targetSheet = document.getElementById(`sheet-page-${item.id}-norsk`);
        if (targetSheet) {
          targetSheet.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });

      card.querySelector('[data-action="toggle-visible"]').addEventListener("click", (e) => {
        e.stopPropagation();
        cfg.visible = !cfg.visible;
        saveSettings();
        renderSidebarCards();
        renderSheets();
      });

      card.querySelectorAll("[data-sub]").forEach((chip) => {
        chip.addEventListener("click", (e) => {
          e.stopPropagation();
          const subPath = chip.getAttribute("data-sub");
          const [group, key] = subPath.split(".");
          cfg[group][key] = !cfg[group][key];

          if (subPath === "norsk.onlyFirstWord") {
            cfg.norsk.rhyme = cfg.norsk.onlyFirstWord;
            if (cfg.norsk.onlyFirstWord) cfg.norsk.words = true;
          }

          if (group === "norsk") {
            cfg.norsk.show = cfg.norsk.intro || cfg.norsk.match || cfg.norsk.words || cfg.norsk.rhyme;
          }

          saveSettings();
          renderSidebarCards();
          renderSheets();
        });
      });

      container.appendChild(card);
    });
  }

  // BYGG ETT BREDT BOKSTAVHUS (SVG) MED RØDT TAK FOR VOKALER OG BLÅTT TAK FOR KONSONANTER
  function renderBokstavhusSVG(upper) {
    const lower = upper.toLowerCase();
    const isVowel = VOKALER.includes(lower);
    const roofColor = isVowel ? "#ef1c1c" : "#0284c7";
    const roofLabel = isVowel ? "BOKSTAVHUS - VOKAL" : "BOKSTAVHUS - KONSONANT";
    const fontSize = 104;
    const baselineY = 128;

    return `
      <svg class="bokstavhus-svg" viewBox="0 0 660 165" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${roofLabel} ${upper} ${lower}">
        <path d="M566 22 C563 16, 568 10, 573 11 C577 8, 584 10, 584 15 C588 17, 587 23, 582 24 Z" fill="#64748b" />
        <rect x="566" y="21" width="14" height="14" fill="#0f172a" />
        <polygon points="56,28 604,28 656,52 4,52" fill="${roofColor}" stroke="#0f172a" stroke-width="2.2" stroke-linejoin="round" />
        <text x="330" y="45" text-anchor="middle" fill="#ffffff" font-family="Trykkskrift, sans-serif" font-size="15.5" font-weight="700" letter-spacing="1.8">${roofLabel}</text>
        <rect x="16" y="52" width="628" height="106" fill="#ffffff" stroke="#0f172a" stroke-width="1.6" />
        <line x1="16" y1="90" x2="644" y2="90" stroke="#0f172a" stroke-width="1.8" stroke-dasharray="4 4" />
        <line x1="16" y1="128" x2="644" y2="128" stroke="#0f172a" stroke-width="3.2" />
        <text x="34" y="${baselineY}" font-family="Trykkskrift, sans-serif" font-size="${fontSize}" letter-spacing="6" fill="#64748b">${upper}${lower}</text>
      </svg>
    `;
  }

  // BYGG BREDE BOKSTAVHUS UTEN TAK OG PIPE FOR ORDSKRIVING
  function renderOrdhusSVG(word, small = false) {
    const fontSize = 104;
    const baselineY = 80;
    const cls = small ? "ordhus-svg ordhus-svg-compact" : "ordhus-svg";

    return `
      <svg class="${cls}" viewBox="0 0 820 116" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Skrivelinjer for ${word}">
        <rect x="2" y="4" width="816" height="106" fill="#ffffff" stroke="#0f172a" stroke-width="1.6" />
        <line x1="2" y1="42" x2="818" y2="42" stroke="#0f172a" stroke-width="1.8" stroke-dasharray="4 4" />
        <line x1="2" y1="80" x2="818" y2="80" stroke="#0f172a" stroke-width="3.2" />
        ${word ? `<text x="18" y="${baselineY}" font-family="Trykkskrift, sans-serif" font-size="${fontSize}" fill="#64748b">${word}</text>` : ""}
      </svg>
    `;
  }

  // BYGG BILDE FOR ORD (bilder/ord.png) MED EMOJI SOM RESERVE HVIS BILDET MANGLER
  function renderWordImgHTML(item) {
    const slug = (item.bilde || item.ord || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_");
    const fallback = item.emoji
      ? `<span class="word-emoji-fallback" style="display:none;">${item.emoji}</span>`
      : "";
    return `
      <img src="bilder/${slug}.png" alt="${item.ord}" class="word-icon-img"
           onerror="this.style.display='none';if(this.nextElementSibling)this.nextElementSibling.style.display='inline-block';" />
      ${fallback}
    `;
  }

  // RENDER VANLIG NORSK-ARK (ARK 1–14)
  function renderNorskBodyHTML(norsk, cfg) {
    const letters = getLetters(norsk);
    if (!norsk || letters.length === 0) return "";

    let taskNum = 1;
    let html = `<section class="subject-section norsk full-page-section">`;

    if (cfg.intro) {
      const letterRowsHTML = letters
        .map((upper) => {
          const lower = upper.toLowerCase();
          return `
            <div class="letter-pair-row">
              <div class="media-box">
                <img src="bokstaver/bokstav/bokst_${lower}.png" alt="Bokstav ${upper} ${lower}"
                     onerror="this.style.display='none';this.nextElementSibling.style.display='block';" />
                <div class="fallback-letter" style="display:none;">${upper} ${lower}</div>
              </div>
              <div class="bokstavhus-wrapper">
                ${renderBokstavhusSVG(upper)}
              </div>
            </div>`;
        })
        .join("");

      html += `
        <div class="task-block">
          <p class="task-title">${taskNum++}. Spor skriveretning og øv på å skrive bokstavene i bokstavhuset:</p>
          <div class="letter-intro-stack">
            ${letterRowsHTML}
          </div>
        </div>`;
    }

    if (cfg.match && Array.isArray(norsk.strekOrd)) {
      const leftItems = norsk.strekOrd.slice(0, 3);
      const rightItems = norsk.strekOrd.slice(3, 6);

      const coloredLetters = letters
        .map((upper) => {
          const lower = upper.toLowerCase();
          const cls = VOKALER.includes(lower) ? "vowel-letter" : "consonant-letter";
          return `<span class="task-letter ${cls}">${lower}</span>`;
        })
        .join(" eller ");

      const coloredBadgeHTML = letters
        .map((upper) => {
          const lower = upper.toLowerCase();
          const cls = VOKALER.includes(lower) ? "vowel-letter" : "consonant-letter";
          return `<span class="badge-letter-pair ${cls}">${upper}${lower}</span>`;
        })
        .join(" ");

      html += `
        <div class="task-block">
          <p class="task-title">${taskNum++}. Sett strek fra bokstavene til bildene som begynner på ${coloredLetters}:</p>
          <div class="match-grid">
            <div class="match-col left-col">
              ${leftItems
                .map(
                  (item) => `
                <div class="match-item">
                  <span class="match-word-wrap">${renderWordImgHTML(item)}</span>
                </div>`
                )
                .join("")}
            </div>
            <div class="center-letter-badge">${coloredBadgeHTML}</div>
            <div class="match-col right-col">
              ${rightItems
                .map(
                  (item) => `
                <div class="match-item">
                  <span class="match-word-wrap">${renderWordImgHTML(item)}</span>
                </div>`
                )
                .join("")}
            </div>
          </div>
        </div>`;
    }

    if (cfg.words && Array.isArray(norsk.skriveOrd)) {
      const wordsToRender = cfg.onlyFirstWord ? norsk.skriveOrd.slice(0, 1) : norsk.skriveOrd;
      const taskText = cfg.onlyFirstWord
        ? "Spor ordet og skriv det på linjen:"
        : "Spor ordene og skriv dem på linjene:";

      html += `
        <div class="task-block">
          <p class="task-title">${taskNum++}. ${taskText}</p>
          <div class="word-houses-stack">
            ${wordsToRender
              .map((w) => `<div class="word-house-row">${renderOrdhusSVG(w.ord)}</div>`)
              .join("")}
          </div>
        </div>`;
    }

    if (cfg.rhyme && Array.isArray(norsk.rimOrd) && norsk.rimOrd.length >= 4) {
      const oppsett = (norsk.rimOppsett || "kryss").toLowerCase();
      const isThreePairs = norsk.rimOrd.length >= 6;
      let rhymeHTML = "";

      if (isThreePairs) {
        let topRhyme, bottomRhyme;

        if (oppsett === "rett") {
          topRhyme = [norsk.rimOrd[0], norsk.rimOrd[2], norsk.rimOrd[4]];
          bottomRhyme = [norsk.rimOrd[1], norsk.rimOrd[3], norsk.rimOrd[5]];
        } else if (oppsett === "oppned") {
          topRhyme = [norsk.rimOrd[0], norsk.rimOrd[1], norsk.rimOrd[2]];
          bottomRhyme = [norsk.rimOrd[4], norsk.rimOrd[5], norsk.rimOrd[3]];
        } else if (oppsett === "miks") {
          topRhyme = [norsk.rimOrd[0], norsk.rimOrd[2], norsk.rimOrd[4]];
          bottomRhyme = [norsk.rimOrd[3], norsk.rimOrd[5], norsk.rimOrd[1]];
        } else {
          topRhyme = [norsk.rimOrd[0], norsk.rimOrd[2], norsk.rimOrd[4]];
          bottomRhyme = [norsk.rimOrd[5], norsk.rimOrd[1], norsk.rimOrd[3]];
        }

        rhymeHTML = `
          <div class="rhyme-grid-horizontal">
            <div class="rhyme-row top-row">
              ${topRhyme.map((item) => `<div class="rhyme-item">${renderWordImgHTML(item)}</div>`).join("")}
            </div>
            <div class="rhyme-row bottom-row">
              ${bottomRhyme.map((item) => `<div class="rhyme-item">${renderWordImgHTML(item)}</div>`).join("")}
            </div>
          </div>`;
      } else {
        let leftRhyme, rightRhyme;

        if (oppsett === "rett") {
          leftRhyme = [norsk.rimOrd[0], norsk.rimOrd[2]];
          rightRhyme = [norsk.rimOrd[1], norsk.rimOrd[3]];
        } else if (oppsett === "oppned") {
          leftRhyme = [norsk.rimOrd[0], norsk.rimOrd[1]];
          rightRhyme = [norsk.rimOrd[2], norsk.rimOrd[3]];
        } else {
          leftRhyme = [norsk.rimOrd[0], norsk.rimOrd[2]];
          rightRhyme = [norsk.rimOrd[3], norsk.rimOrd[1]];
        }

        rhymeHTML = `
          <div class="rhyme-grid">
            <div class="rhyme-col left-col">
              ${leftRhyme.map((item) => `<div class="rhyme-item">${renderWordImgHTML(item)}</div>`).join("")}
            </div>
            <div class="rhyme-col right-col">
              ${rightRhyme.map((item) => `<div class="rhyme-item">${renderWordImgHTML(item)}</div>`).join("")}
            </div>
          </div>`;
      }

      html += `
        <div class="task-block">
          <p class="task-title">${taskNum++}. Sett strek mellom ordene som rimer:</p>
          ${rhymeHTML}
        </div>`;
    }

    html += `</section>`;
    return html;
  }

  // RENDER REPETERING 1 (BOKSTAVENE: i s l o r e v a b t)
  function renderRep1BodyHTML(data, tasks) {
    if (!data) return "";
    let taskNum = 1;
    let html = `<section class="subject-section norsk rep-section full-page-section">`;


// 1. Vokal eller konsonant (sorte bokstaver)
 if (tasks.vowels && Array.isArray(data.bokstaver)) {
   const tilesHTML = data.bokstaver
     .map((b) => `<span class="rep-letter-pill">${b.toLowerCase()}</span>`)
     .join("");

   html += `
     <div class="task-block">
       <p class="task-title">${taskNum++}. Sett strek fra vokalene til den røde boksen, og fra konsonantene til den blå boksen:</p>
       <div class="rep-roof-row">
         <div class="rep-roof-box roof-vowel">VOKALER</div>
         <div class="rep-roof-box roof-consonant">KONSONANTER</div>
       </div>
       <div class="rep-letters-scatter">
         ${tilesHTML}
       </div>
     </div>`;
 }

 // 2. Sistelyd (sorte bokstaver)
 const soundItems = data.sistelyd || data.forstelyd;
 if (tasks.firstSound && Array.isArray(soundItems)) {
   html += `
     <div class="task-block">
       <p class="task-title">${taskNum++}. Sett ring rundt <strong style="font-size: 1.18em; font-weight: 800;">SISTE</strong> lyden i ordet:</p>
       <div class="rep-sound-grid">
         ${soundItems
           .map(
             (item) => `
           <div class="rep-sound-card">
             <div class="rep-sound-img">${renderWordImgHTML(item)}</div>
             <div class="rep-sound-choices">
               ${item.valg
                 .map((ch) => `<span class="rep-choice-circle">${ch}</span>`)
                 .join("")}
             </div>
           </div>`
           )
           .join("")}
       </div>
     </div>`;
 }


// 3. Les ordet, sett strek til riktig bilde og videre til rimeord
    if (tasks.readMatch && data.lesOgStrek) {
      const hasRhymeCol = Array.isArray(data.lesOgStrek.rimBilder);
      html += `
        <div class="task-block">
          <p class="task-title">${taskNum++}. ${
            hasRhymeCol
              ? "Les ordet, sett strek til riktig bilde og videre til ordet som rimer:"
              : "Les ordet og sett strek til riktig bilde:"
          }</p>
          <div class="rep-read-match-grid ${hasRhymeCol ? "cols-3" : ""}">
            <div class="rep-read-col">
              ${data.lesOgStrek.ord.map((w) => `<div class="rep-word-card">${w}</div>`).join("")}
            </div>
            <div class="rep-read-col">
              ${data.lesOgStrek.bilder
                .map((b) => `<div class="rep-img-card">${renderWordImgHTML(b)}</div>`)
                .join("")}
            </div>
            ${
              hasRhymeCol
                ? `<div class="rep-read-col">
                    ${data.lesOgStrek.rimBilder
                      .map((r) => `<div class="rep-img-card">${renderWordImgHTML(r)}</div>`)
                      .join("")}
                  </div>`
                : ""
            }
          </div>
        </div>`;
    }

    // 4. Skriv ordet i ordhuset
    if (tasks.writeWords && Array.isArray(data.skrivOrd)) {
      html += `
        <div class="task-block">
          <p class="task-title">${taskNum++}. Se på bildet og skriv hele ordet i ordhuset to ganger:</p>
          <div class="rep-write-stack">
            ${data.skrivOrd
              .map(
                (item) => `
              <div class="rep-write-row">
                <div class="rep-write-pic">${renderWordImgHTML(item)}</div>
                <div class="rep-write-house">${renderOrdhusSVG(item.hint || "", true)}</div>
              </div>`
              )
              .join("")}
          </div>
        </div>`;
    }

    html += `</section>`;
    return html;
  }

  // RENDER REPETERING 2 (BOKSTAVENE: ø m å j d u g n p y)
  function renderRep2BodyHTML(data, tasks) {
    if (!data) return "";
    let taskNum = 1;
    let html = `<section class="subject-section norsk rep-section full-page-section">`;

// 1. Vokal eller konsonant (sorte bokstaver)
 if (tasks.vowels && Array.isArray(data.bokstaver)) {
   const tilesHTML = data.bokstaver
     .map((b) => `<span class="rep-letter-pill">${b.toLowerCase()}</span>`)
     .join("");

   html += `
     <div class="task-block">
       <p class="task-title">${taskNum++}. Sett strek fra vokalene til den røde boksen, og fra konsonantene til den blå boksen:</p>
       <div class="rep-roof-row">
         <div class="rep-roof-box roof-vowel">VOKALER</div>
         <div class="rep-roof-box roof-consonant">KONSONANTER</div>
       </div>
       <div class="rep-letters-scatter">
         ${tilesHTML}
       </div>
     </div>`;
 }

    // 2. Finn bokstaven i ordet (først, inni, sist)
    if (tasks.findPos && Array.isArray(data.finnBokstav)) {
      html += `
        <div class="task-block">
          <p class="task-title">${taskNum++}. Kryss av hvor i ordet du hører bokstaven (først, inni eller sist):</p>
          <div class="rep-pos-grid">
            ${data.finnBokstav
              .map((item) => {
                const cls = VOKALER.includes(item.bokstav.toLowerCase()) ? "vowel-letter" : "consonant-letter";
                return `
                  <div class="rep-pos-card">
                    <div class="rep-pos-header">
                      <span class="rep-pos-letter ${cls}">${item.bokstav.toUpperCase()}${item.bokstav.toLowerCase()}</span>
                    </div>
                    <div class="rep-pos-img">${renderWordImgHTML(item)}</div>
                    <div class="rep-pos-boxes">
                      <span class="rep-pos-box"></span>
                      <span class="rep-pos-box"></span>
                      <span class="rep-pos-box"></span>
                    </div>
                  </div>`;
              })
              .join("")}
          </div>
        </div>`;
    }

// 3. Skriv ordet i ordhuset (3 ord)
 if (tasks.writeWords && Array.isArray(data.skrivOrd)) {
   html += `
     <div class="task-block">
       <p class="task-title">${taskNum++}. Se på bildet og skriv hele ordet i ordhuset to ganger:</p>
       <div class="rep-write-stack">
         ${data.skrivOrd
           .map(
             (item) => `
           <div class="rep-write-row">
             <div class="rep-write-pic">${renderWordImgHTML(item)}</div>
             <div class="rep-write-house">${renderOrdhusSVG(item.hint || "", true)}</div>
           </div>`
           )
           .join("")}
       </div>
     </div>`;
 }

// 4. Les ordene og sett ring rundt riktig ord til bildet
 if (tasks.chooseWord && Array.isArray(data.velgOrd)) {
   html += `
     <div class="task-block">
       <p class="task-title">${taskNum++}. Les ordene og sett ring rundt ordet som passer til bildet:</p>
       <div class="rep-choose-grid">
         ${data.velgOrd
           .map(
             (item) => `
           <div class="rep-choose-card">
             <div class="rep-choose-img">${renderWordImgHTML(item)}</div>
             <div class="rep-choose-words">
               ${item.valg.map((w) => `<span class="rep-choose-word">${w}</span>`).join("")}
             </div>
           </div>`
           )
           .join("")}
       </div>
     </div>`;
 }

    html += `</section>`;
    return html;
  }

  // RENDER OPPSUMMERING (HELE ALFABETET A–Å)
  function renderOppsummeringBodyHTML(data, tasks) {
    if (!data) return "";
    let taskNum = 1;
    let html = `<section class="subject-section norsk rep-section full-page-section">`;

// 1. Fyll inn bokstavene som mangler i alfabetet (lys rød på vokaler, lys blå på konsonanter, helt hvit der det mangler)
    if (tasks.alphabet && Array.isArray(data.alfabet)) {
      const vokalerSet = new Set(["A", "E", "I", "O", "U", "Y", "Æ", "Ø", "Å"]);
      html += `
        <div class="task-block">
          <p class="task-title">${taskNum++}. Fyll inn bokstavene som mangler i alfabetet:</p>
          <div class="alpha-grid">
            ${data.alfabet
              .map((item) => {
                const char = item.vis === "lower" ? item.lower : item.upper;
                const isVowel = vokalerSet.has(item.upper.toUpperCase());
                const cellClass = item.mangler
                  ? "alpha-missing"
                  : isVowel
                    ? "alpha-vowel"
                    : "alpha-consonant";
                return `
                  <div class="alpha-cell ${cellClass}">
                    ${item.mangler ? "" : `<span>${char}</span>`}
                  </div>`;
              })
              .join("")}
          </div>
        </div>`;
    }

// 2. Fargelegg vokalene røde og konsonantene blå (4 vokaler + 5 konsonanter uten fyll)
    if (tasks.vowels && Array.isArray(data.fargeleggBokstaver)) {
      html += `
        <div class="task-block">
          <p class="task-title">${taskNum++}. Fargelegg vokalene <strong style="color:#dc2626;">røde</strong> og konsonantene <strong style="color:#2563eb;">blå</strong>:</p>
          <div class="vowel-color-row">
            ${data.fargeleggBokstaver
              .map((v) => `<div class="hollow-letter-card"><span class="hollow-letter">${v}</span></div>`)
              .join("")}
          </div>
        </div>`;
    }

    // 3. Skriv ordene til bildene
    if (tasks.writeWords && Array.isArray(data.skrivOrd)) {
      html += `
        <div class="task-block">
          <p class="task-title">${taskNum++}. Se på bildene og skriv ordene i ordhusene:</p>
          <div class="rep-write-stack">
            ${data.skrivOrd
              .map(
                (item) => `
              <div class="rep-write-row">
                <div class="rep-write-pic">${renderWordImgHTML(item)}</div>
                <div class="rep-write-house">${renderOrdhusSVG("", true)}</div>
              </div>`
              )
              .join("")}
          </div>
        </div>`;
    }

// 4. Fargelegg bildet etter bokstavkode
if (tasks.colorByLetter) {
  html += `
    <div class="task-block">
      <p class="task-title">${taskNum++}. Fargelegg tegningen etter fargekoden:</p>
      <div class="color-scene-single">
        <img src="bilder/tegning.png" alt="Fargelegg tegningen" class="color-scene-img" />
      </div>
    </div>`;
}

    html += `</section>`;
    return html;
  }

  // BYGG ENKELT A4-SIDE
  function createA4PageElement({ id, title, weekLabel, subjectTag, bodyHTML, pageIndex, totalPages }) {
    const article = document.createElement("article");
    article.id = id;

    if (subjectTag === "Oversikt") {
      article.className = "a4-sheet toc-sheet";
    } else if (subjectTag === "Skriving") {
      article.className = "a4-sheet norsk-sheet";
    } else {
      article.className = "a4-sheet";
    }

    const parts = title.split(/\s*[–-]\s*/);
    const baseTitle = parts[0] || title;
    const rawDetail = parts.slice(1).join(" - ").trim();

    let formattedTitle = title;
    if (subjectTag === "Skriving" && rawDetail && baseTitle.startsWith("Arbeidsark")) {
      formattedTitle = `${baseTitle} - Bokstavene: ${rawDetail.toLowerCase()}`;
    }

    const hideHeaderFooter = id === "sheet-page-cover";

    article.innerHTML = `
      <div class="sheet-inner-top">
        ${hideHeaderFooter ? "" : `
          <header class="sheet-header">
            <div class="sheet-title-block">
              <h1>${formattedTitle}</h1>
            </div>
            <div class="student-meta">
              <span>Hånes skole${weekLabel ? ` • ${weekLabel}` : ""}</span>
            </div>
          </header>
        `}

        ${bodyHTML}
      </div>

      ${hideHeaderFooter ? "" : `
        <footer class="sheet-footer ${!showPageNumbers ? "hide-pagenum" : ""}">
          <span>Hånes skole</span>
          <span class="page-num-text">Side ${pageIndex} av ${totalPages}</span>
        </footer>
      `}
    `;

    return article;
  }

  // RENDER ALLE SYNLIGE A4-SIDER
  function renderSheets() {
    const sheetsContainerEl = document.getElementById("sheets-container");
    sheetsContainerEl.innerHTML = "";

    const cfg0 = sheetSettings["0"] || { visible: true, showToc: true };
    const showCover = Boolean(cfg0.visible);
    const showToc = Boolean(cfg0.visible && cfg0.showToc);

    const taskPages = [];
    const tocEntries = [];
    let currentPageNum = 1 + (showCover ? 1 : 0) + (showToc ? 1 : 0);

    SHEET_PLAN.forEach((item) => {
      const cfg = sheetSettings[item.id];
      if (!cfg || !cfg.visible) return;

      if (item.type === "norsk") {
        const norsk = window.NORSK_DATA[item.num];
        if (!cfg.norsk.show || !norsk) return;

        const letters = getLetters(norsk);
        const letterLabel = letters.join("").toLowerCase();
        const titleSuffix = letterLabel ? ` – ${letterLabel}` : "";

        taskPages.push({
          id: `sheet-page-${item.id}-norsk`,
          title: `Arbeidsark ${item.num}${titleSuffix}`,
          weekLabel: cfg.weekLabel,
          subjectTag: "Skriving",
          bodyHTML: renderNorskBodyHTML(norsk, cfg.norsk)
        });

        const lettersStr = letters.join(", ");
        tocEntries.push({
          sheetTitle: `Arbeidsark ${item.num}`,
          weekLabel: cfg.weekLabel || "",
          topicHTML: lettersStr ? `Bokstaver: <strong>${lettersStr}</strong>` : "",
          subjects: "Skriving",
          pageRange: `${currentPageNum}`
        });
        currentPageNum++;
      } else if (item.type === "rep1") {
        const repData = window.REPETERING_DATA && window.REPETERING_DATA["rep1"];
        if (!repData) return;

        taskPages.push({
          id: `sheet-page-${item.id}-norsk`,
          title: `Repetering 1 – i s l o r e v a b t`,
          weekLabel: cfg.weekLabel,
          subjectTag: "Skriving",
          bodyHTML: renderRep1BodyHTML(repData, cfg.tasks)
        });

        tocEntries.push({
          sheetTitle: "Repetering 1",
          weekLabel: cfg.weekLabel || "",
          topicHTML: `Bokstaver: <strong>I, S, L, O, R, E, V, A, B, T</strong>`,
          subjects: "Repetering",
          pageRange: `${currentPageNum}`,
          isSpecial: true
        });
        currentPageNum++;
      } else if (item.type === "rep2") {
        const repData = window.REPETERING_DATA && window.REPETERING_DATA["rep2"];
        if (!repData) return;

        taskPages.push({
          id: `sheet-page-${item.id}-norsk`,
          title: `Repetering 2 – ø m å j d u g n p y`,
          weekLabel: cfg.weekLabel,
          subjectTag: "Skriving",
          bodyHTML: renderRep2BodyHTML(repData, cfg.tasks)
        });

        tocEntries.push({
          sheetTitle: "Repetering 2",
          weekLabel: cfg.weekLabel || "",
          topicHTML: `Bokstaver: <strong>Ø, M, Å, J, D, U, G, N, P, Y</strong>`,
          subjects: "Repetering",
          pageRange: `${currentPageNum}`,
          isSpecial: true
        });
        currentPageNum++;
      } else if (item.type === "oppsummering") {
        const oppData = window.REPETERING_DATA && window.REPETERING_DATA["oppsummering"];
        if (!oppData) return;

        taskPages.push({
          id: `sheet-page-${item.id}-norsk`,
          title: `Oppsummering – Hele alfabetet`,
          weekLabel: "",
          subjectTag: "Skriving",
          bodyHTML: renderOppsummeringBodyHTML(oppData, cfg.tasks)
        });

        tocEntries.push({
          sheetTitle: "Oppsummering",
          weekLabel: "",
          topicHTML: `Tema: <strong>Hele alfabetet (A–Å)</strong>`,
          subjects: "Oppsummering",
          pageRange: `${currentPageNum}`,
          isSpecial: true
        });
        currentPageNum++;
      }
    });

    const pagesToRender = [];

    // 1. FORSIDE (SIDE 1)
    if (showCover) {
      pagesToRender.push({
        id: "sheet-page-cover",
        title: "",
        weekLabel: "",
        subjectTag: "",
        isCover: true,
        bodyHTML: `
          <div class="hefte-cover">
            <div class="cover-inner-border"></div>
            <div class="cover-top-blobs">
              <div class="cover-blob-top-1"></div>
              <div class="cover-blob-top-2"></div>
            </div>

            <div class="cover-header-block">
              <h1 class="cover-title">Arbeidshefte for 1. klasse</h1>
              <div class="cover-divider"></div>
              <p class="cover-subtitle">Bokstavinnlæring</p>
            </div>

            <div class="cover-info-box">
              <ul class="cover-bullets">
                <li><span class="cover-dot"></span><span>Heftet tar for seg hvordan bokstavene skrives.</span></li>
                <li><span class="cover-dot"></span><span>Det er lagt inn enkle øveoppgaver og repeteringsark.</span></li>
              </ul>
            </div>

            <div class="cover-image-wrap">
              <div class="cover-image-frame">
                <img src="bilder/forside_arbeidshefte.png" alt="Forsideillustrasjon" class="cover-image" />
              </div>
            </div>

            <div class="cover-name-box">
              <label>Navn:</label>
              <div class="cover-line"></div>
            </div>

            <div class="cover-bottom-area">
              <div class="cover-school-footer">
                <div class="school-line"></div>
                <span class="school-name">HÅNES SKOLEENHET</span>
                <div class="school-line"></div>
              </div>
            </div>

            <div class="cover-bottom-blobs">
              <div class="cover-blob-bot-1"></div>
              <div class="cover-blob-bot-2"></div>
            </div>
          </div>
        `
      });
    }

// 2. INNHOLDSFORTEGNELSE (SIDE 2)
    if (showToc) {
      const tocRowsHTML = tocEntries.length > 0
        ? tocEntries.map((entry) => {
            const formattedTopic = entry.topicHTML
              ? entry.topicHTML.replace(/(:\s*)(.*)$/i, (_, prefix, rest) => prefix + rest.toLowerCase())
              : "";

            return `
              <div class="toc-row">
                <div class="toc-left">
                  <span class="toc-sheet">${entry.sheetTitle}</span>
                  ${entry.weekLabel ? `<span class="toc-week">(${entry.weekLabel})</span>` : ""}
                  ${formattedTopic ? `<span class="toc-letters">${formattedTopic}</span>` : ""}
                </div>
                <div class="toc-dots"></div>
                <div class="toc-right">
                  <span class="toc-page">s. ${entry.pageRange}</span>
                </div>
              </div>
            `;
          }).join("")
        : `<p class="toc-empty">Ingen arbeidsark er valgt for visning.</p>`;

      pagesToRender.push({
        id: "sheet-page-toc",
        title: "Innholdsfortegnelse",
        weekLabel: "",
        subjectTag: "Oversikt",
        isToc: true,
        bodyHTML: `
          <div class="hefte-toc">
            <p class="toc-intro">Oversikt over utvalgte arbeidsark i dette heftet:</p>
            <div class="toc-list">
              ${tocRowsHTML}
            </div>
          </div>
        `
      });
    }

    // 3. ARBEIDSARK
    pagesToRender.push(...taskPages);

    pagesToRender.forEach((pageData, idx) => {
      const pageEl = createA4PageElement({
        ...pageData,
        pageIndex: idx + 1,
        totalPages: pagesToRender.length
      });
      sheetsContainerEl.appendChild(pageEl);
    });

    updatePageScale();
    initScrollSync();
  }

  function setupPrintModals() {
    const printBtn = document.getElementById("btn-print") || document.querySelector(".btn-print-main");
    const optionsModal = document.getElementById("print-options-modal");
    const guideModal = document.getElementById("pdf-guide-modal");
    const readyModal = document.getElementById("pdf-ready-modal");
    const zoomModal = document.getElementById("guide-zoom-modal");

    if (!printBtn || !optionsModal) return;

    const scopeRadios = optionsModal.querySelectorAll('input[name="printScope"]');
    const includeArk0Cb = document.getElementById("print-include-ark0");
    const estimateEl = document.getElementById("print-estimate-text");
    const currentLabelEl = document.getElementById("print-current-label");

    let awaitingPdfSave = false;

    function getActiveSheetId() {
      const activeCard = document.querySelector(".sheet-card.active");
      if (activeCard && activeCard.dataset && activeCard.dataset.sheet && activeCard.dataset.sheet !== "0") {
        return activeCard.dataset.sheet;
      }
      return "1";
    }

    function getDisplayNameForId(id) {
      const found = SHEET_PLAN.find((x) => x.id === id);
      if (!found) return "Arbeidsark 1";
      return found.type === "norsk" ? `Arbeidsark ${found.num}` : found.label;
    }

    function updatePrintEstimate() {
      const scope = optionsModal.querySelector('input[name="printScope"]:checked').value;
      const activeId = getActiveSheetId();
      currentLabelEl.textContent = getDisplayNameForId(activeId);

      document.getElementById("print-scope-selected-card").classList.toggle("active", scope === "selected");
      document.getElementById("print-scope-current-card").classList.toggle("active", scope === "current");

      let totalPages = 0;

      if (includeArk0Cb.checked) {
        const cfg0 = sheetSettings["0"] || { visible: true, showToc: true };
        totalPages += cfg0.showToc ? 2 : 1;
      }

      if (scope === "selected") {
        SHEET_PLAN.forEach((item) => {
          const cfg = sheetSettings[item.id];
          if (!cfg || !cfg.visible) return;
          if (item.type === "norsk" && (!cfg.norsk.show || !window.NORSK_DATA[item.num])) return;
          totalPages++;
        });
      } else {
        const cfg = sheetSettings[activeId];
        if (cfg) totalPages++;
      }

      const physicalSheets = Math.ceil(totalPages / 2);
      estimateEl.textContent = `${physicalSheets} ark (${totalPages} sider)`;
    }

    function applyPrintFilterAndPrint() {
      const scope = optionsModal.querySelector('input[name="printScope"]:checked').value;
      const includeArk0 = includeArk0Cb.checked;
      const activeId = getActiveSheetId();

      const prevArk0Visible = sheetSettings["0"] ? sheetSettings["0"].visible : true;
      let rerendered = false;

      if (sheetSettings["0"] && sheetSettings["0"].visible !== includeArk0) {
        sheetSettings["0"].visible = includeArk0;
        renderSheets();
        rerendered = true;
      }

      const allSheets = document.querySelectorAll(".a4-sheet");
      allSheets.forEach((el) => {
        el.classList.remove("print-skip");
        if (scope === "current") {
          const isArk0 = el.id === "sheet-page-cover" || el.id === "sheet-page-toc";
          const isTargetSheet = el.id === `sheet-page-${activeId}-norsk`;
          if (!isTargetSheet && !(includeArk0 && isArk0)) {
            el.classList.add("print-skip");
          }
        }
      });

      window.print();

      document.querySelectorAll(".a4-sheet.print-skip").forEach((el) => el.classList.remove("print-skip"));
      if (rerendered && sheetSettings["0"]) {
        sheetSettings["0"].visible = prevArk0Visible;
        renderSheets();
      }
    }

    printBtn.addEventListener("click", (e) => {
      e.preventDefault();
      includeArk0Cb.checked = sheetSettings["0"] ? Boolean(sheetSettings["0"].visible) : true;
      updatePrintEstimate();
      optionsModal.classList.remove("hidden");
    });

    scopeRadios.forEach((r) => r.addEventListener("change", updatePrintEstimate));
    includeArk0Cb.addEventListener("change", updatePrintEstimate);

    document.getElementById("btn-do-normal-print").addEventListener("click", () => {
      optionsModal.classList.add("hidden");
      applyPrintFilterAndPrint();
    });

    document.getElementById("btn-open-pdf-guide").addEventListener("click", () => {
      optionsModal.classList.add("hidden");
      guideModal.classList.remove("hidden");
    });

    document.getElementById("btn-continue-save-pdf").addEventListener("click", () => {
      guideModal.classList.add("hidden");
      awaitingPdfSave = true;
      applyPrintFilterAndPrint();
    });

    window.addEventListener("afterprint", () => {
      if (awaitingPdfSave) {
        awaitingPdfSave = false;
        readyModal.classList.remove("hidden");
      }
    });

    const filePicker = document.getElementById("pdf-file-picker");
    let currentBlobUrl = null;

    document.getElementById("btn-open-saved-pdf").addEventListener("click", () => {
      filePicker.value = "";
      filePicker.click();
    });

    filePicker.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      if (currentBlobUrl) {
        URL.revokeObjectURL(currentBlobUrl);
      }
      currentBlobUrl = URL.createObjectURL(file);

      const linkWrap = document.getElementById("opened-pdf-link-wrap");
      const pdfLink = document.getElementById("opened-pdf-link");
      if (pdfLink && linkWrap) {
        pdfLink.href = currentBlobUrl;
        pdfLink.textContent = `📄 Åpne «${file.name}» i ny fane →`;
        linkWrap.classList.remove("hidden");
      }

      setTimeout(() => {
        window.open(currentBlobUrl, "_blank", "noopener");
      }, 150);
    });

    document.querySelectorAll(".pmodal-tabs").forEach((tabBar) => {
      tabBar.addEventListener("click", (e) => {
        const btn = e.target.closest(".pmodal-tab");
        if (!btn) return;
        const container = tabBar.closest(".pmodal-body");
        tabBar.querySelectorAll(".pmodal-tab").forEach((t) => t.classList.remove("active"));
        container.querySelectorAll(".pmodal-tab-pane").forEach((p) => p.classList.remove("active"));
        btn.classList.add("active");
        const target = document.getElementById(btn.dataset.tabTarget);
        if (target) target.classList.add("active");
      });
    });

    document.querySelectorAll("[data-zoom-img]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("guide-zoom-img").src = el.dataset.zoomImg;
        document.getElementById("guide-zoom-title").textContent = el.dataset.zoomTitle || "Veiledningsbilde";
        zoomModal.classList.remove("hidden");
      });
    });

    document.querySelectorAll("[data-close-pmodal]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.getElementById(btn.dataset.closePmodal).classList.add("hidden");
      });
    });

    [optionsModal, guideModal, readyModal, zoomModal].forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.add("hidden");
      });
    });
  }

  let sheetScrollObserver = null;
  let isManualSidebarClick = false;
  let manualClickTimer = null;

  function initScrollSync() {
    if (sheetScrollObserver) {
      sheetScrollObserver.disconnect();
    }

    const sheets = document.querySelectorAll("#sheets-container .a4-sheet");
    if (!sheets.length) return;

    const visibilityMap = new Map();

    sheetScrollObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        visibilityMap.set(entry.target.id, entry.intersectionRatio);
      });

      if (isManualSidebarClick) return;

      let bestId = null;
      let maxRatio = 0;

      visibilityMap.forEach((ratio, id) => {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          bestId = id;
        }
      });

      if (!bestId || maxRatio < 0.15) return;

      let sheetId = "0";
      if (bestId.startsWith("sheet-page-") && bestId !== "sheet-page-cover" && bestId !== "sheet-page-toc") {
        const parts = bestId.split("-");
        if (parts[2]) sheetId = parts[2];
      }

      setActiveSidebarCard(sheetId);
    }, {
      threshold: [0, 0.15, 0.3, 0.5, 0.75, 1.0]
    });

    sheets.forEach((sheet) => sheetScrollObserver.observe(sheet));
  }

  function setActiveSidebarCard(sheetId) {
    if (activeSheet === sheetId) return;
    activeSheet = sheetId;
    renderSidebarCards();

    const targetCard = document.querySelector(`.sheet-card[data-sheet="${sheetId}"]`);
    if (targetCard) {
      targetCard.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
  }

  let customZoom = null;

  function updatePageScale() {
    const container = document.getElementById("sheets-container");
    const pages = Array.from(document.querySelectorAll("#sheets-container .a4-sheet"));

    if (!container || pages.length === 0) return;

    const scrollWrapper = container.parentElement || container;
    const firstPage = pages[0];

    const pageW = firstPage.offsetWidth;
    const pageH = firstPage.offsetHeight;

    if (!pageW || !pageH) return;

    const containerW = scrollWrapper.clientWidth - 96;
    const containerH = window.innerHeight - 36;

    let scale;
    if (customZoom !== null) {
      scale = customZoom;
    } else {
      const scaleW = containerW / pageW;
      const scaleH = containerH / pageH;
      scale = Math.min(scaleW, scaleH, 1.15);
    }

    scale = Math.max(scale, 0.25);

    pages.forEach((page, index) => {
      page.style.transform = `scale(${scale})`;
      page.style.transformOrigin = "top center";

      const nextPage = pages[index + 1];

      const getSheetKey = (el) => {
        if (!el) return "";
        if (el.id === "sheet-page-cover" || el.id === "sheet-page-toc") return "ark-0";
        const parts = el.id.split("-");
        return parts.length >= 3 ? `ark-${parts[2]}` : el.id;
      };

      const isLastPageOfSheet = !nextPage || getSheetKey(nextPage) !== getSheetKey(page);
      const spacing = isLastPageOfSheet ? 32 : 14;

      page.style.marginBottom = `${(scale - 1) * pageH + spacing}px`;
    });

    const zoomText = document.getElementById("zoomValText");
    if (zoomText) {
      const pct = Math.round(scale * 100);
      zoomText.textContent = customZoom !== null ? `${pct}%` : `Auto\n(${pct}%)`;
    }
  }

  function changeZoom(delta) {
    const page = document.querySelector("#sheets-container .a4-sheet");
    if (!page) return;

    const currentMatrix = window.getComputedStyle(page).transform;
    let currentScale = 1;

    if (currentMatrix && currentMatrix !== "none") {
      const values = currentMatrix.split("(")[1].split(")")[0].split(",");
      currentScale = parseFloat(values[0]) || 1;
    }

    const base = customZoom !== null ? customZoom : currentScale;
    customZoom = Math.min(Math.max(Math.round((base + delta) * 100) / 100, 0.3), 2.0);
    updatePageScale();
  }

  function resetZoom() {
    customZoom = null;
    updatePageScale();
  }

  function initZoomControls() {
    const btnIn = document.getElementById("btn-zoom-in");
    const btnOut = document.getElementById("btn-zoom-out");
    const btnReset = document.getElementById("zoomValText");

    if (btnIn) btnIn.addEventListener("click", () => changeZoom(0.05));
    if (btnOut) btnOut.addEventListener("click", () => changeZoom(-0.05));
    if (btnReset) btnReset.addEventListener("click", resetZoom);

    window.addEventListener("resize", updatePageScale);
  }

  window.openAppSwitchModal = function () {
    const modal = document.getElementById("appSwitchModal");
    if (modal) modal.style.display = "flex";
  };

  window.closeAppSwitchModal = function () {
    const modal = document.getElementById("appSwitchModal");
    if (modal) modal.style.display = "none";
  };

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      window.closeAppSwitchModal();
    }
  });

  // INIT
  initAuthWatermark();
  initZoomControls();
  renderSidebarCards();
  renderSheets();
})();