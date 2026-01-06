(() => {
  let content = null;

  async function loadContent() {
    const res = await fetch("assets/data/content.json");
    return res.json();
  }

  function byLang(obj, lang) {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj[lang] ?? obj.en ?? "";
  }

  function setHref(id, url) {
    const el = document.getElementById(id);
    if (!el) return;
    el.href = url || "#";
    if (!url) el.setAttribute("aria-disabled", "true");
  }

  function render(lang) {
    // Profile + contact
    document.title = `${byLang(content.profile.name, lang)} — ${byLang(content.profile.role, lang)}`;

    // Bind primary links
    setHref("linkGithub", content.contact.github);
    setHref("linkLinkedin", content.contact.linkedin);

    const wa = content.contact.whatsapp.replace(/\s+/g, "");
    setHref("linkWhatsapp", `https://wa.me/${wa.replace("+","")}`);

    // Email CTAs
    const email = content.contact.email;
    const ctaEmail = document.getElementById("ctaEmail");
    const btnEmail = document.getElementById("btnEmail");
    if (ctaEmail) ctaEmail.href = `mailto:${email}`;
    if (btnEmail) btnEmail.href = `mailto:${email}`;

    const btnWhats = document.getElementById("btnWhats");
    if (btnWhats) btnWhats.href = `https://wa.me/${wa.replace("+","")}`;

    // Resume button
    const resumeBtn = document.getElementById("ctaResume");
    if (resumeBtn) {
      resumeBtn.addEventListener("click", () => {
        window.open(content.contact.resumePath, "_blank", "noopener");
      }, { once: true });
    }

    // About highlights
    const hl = (window.OSF_I18N?.dict?.[lang]?.highlights) || [];
    const ul = document.getElementById("highlightsList");
    ul.innerHTML = "";
    hl.forEach(t => {
      const li = document.createElement("li");
      li.textContent = t;
      ul.appendChild(li);
    });

    // Services
    const services = document.getElementById("servicesGrid");
    services.innerHTML = "";
    content.sections.services.forEach(s => {
      const card = document.createElement("div");
      card.className = "card fade";
      card.innerHTML = `
        <h3>${byLang(s.title, lang)}</h3>
        <p class="muted">${byLang(s.desc, lang)}</p>
      `;
      services.appendChild(card);
    });

    // Projects
    const pg = document.getElementById("projectsGrid");
    pg.innerHTML = "";
    content.sections.projects.forEach(p => {
      const card = document.createElement("div");
      card.className = "card projectCard fade";
      const tags = (p.tags || []).map(t => `<span class="tag">${t}</span>`).join("");
      const links = (p.links || []).map(l => {
        const url = l.url || "";
        const label = byLang(l.label, lang);
        const safe = url ? `href="${url}" target="_blank" rel="noopener"` : `href="#" aria-disabled="true"`;
        return `<a ${safe}>${label}</a>`;
      }).join("");
      card.innerHTML = `
        <h3>${p.name}</h3>
        <p class="muted">${byLang(p.desc, lang)}</p>
        <div class="tags">${tags}</div>
        <div class="links">${links}</div>
      `;
      pg.appendChild(card);
    });

    // Experience
    const tl = document.getElementById("experienceTimeline");
    tl.innerHTML = "";
    content.sections.experience.forEach(e => {
      const item = document.createElement("div");
      item.className = "item fade";
      const bullets = (e.bullets?.[lang] || e.bullets?.en || []).map(b => `<li>${b}</li>`).join("");
      item.innerHTML = `
        <div class="item__top">
          <div>
            <div class="item__title">${e.company} — ${byLang(e.title, lang)}</div>
            <div class="item__meta">${byLang(e.dates, lang)}</div>
          </div>
        </div>
        <ul>${bullets}</ul>
      `;
      tl.appendChild(item);
    });

    // Skills
    const chips = document.getElementById("skillsChips");
    chips.innerHTML = "";
    content.sections.skills.forEach(s => {
      const chip = document.createElement("span");
      chip.className = "chip fade";
      chip.textContent = s;
      chips.appendChild(chip);
    });

    // Education
    const eg = document.getElementById("educationGrid");
    eg.innerHTML = "";
    content.sections.education.forEach(ed => {
      const c = document.createElement("div");
      c.className = "card fade";
      c.innerHTML = `
        <h3>${byLang(ed.degree, lang)}</h3>
        <p class="muted">${byLang(ed.school, lang)} • ${ed.dates}</p>
      `;
      eg.appendChild(c);
    });

    // Certifications
    const cg = document.getElementById("certGrid");
    cg.innerHTML = "";
    content.sections.certifications.forEach(cert => {
      const c = document.createElement("div");
      c.className = "card fade";
      c.innerHTML = `
        <h3>${byLang(cert.title, lang)}</h3>
        <p class="muted">${byLang(cert.details, lang)}</p>
      `;
      cg.appendChild(c);
    });

    // Contact list
    const cl = document.getElementById("contactList");
    cl.innerHTML = "";
    const rows = [
      { k: lang === "ar" ? "البريد" : "Email", v: content.contact.email, href:`mailto:${content.contact.email}` },
      { k: lang === "ar" ? "الهاتف" : "Phone", v: content.contact.phone, href:`tel:${content.contact.phone}` },
      { k: lang === "ar" ? "واتساب" : "WhatsApp", v: content.contact.whatsapp, href:`https://wa.me/${wa.replace("+","")}` },
      { k: lang === "ar" ? "GitHub" : "GitHub", v: "Semo71", href: content.contact.github },
      { k: lang === "ar" ? "LinkedIn" : "LinkedIn", v: "osamah-fatah", href: content.contact.linkedin }
    ];
    rows.forEach(r => {
      const row = document.createElement("a");
      row.className = "contactRow";
      row.href = r.href;
      row.target = r.href.startsWith("http") ? "_blank" : "";
      row.rel = r.href.startsWith("http") ? "noopener" : "";
      row.innerHTML = `<span class="contactRow__k">${r.k}</span><span class="contactRow__v">${r.v}</span>`;
      cl.appendChild(row);
    });

    // Year
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    // Fade-in on view
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("is-in");
      });
    }, { threshold: 0.08 });

    document.querySelectorAll(".fade").forEach(el => io.observe(el));
  }

  function wireUI() {
    // Language toggle
    const langBtn = document.getElementById("langToggle");
    if (langBtn) langBtn.addEventListener("click", () => {
      const cur = window.OSF_I18N.getLang();
      window.OSF_I18N.setLang(cur === "ar" ? "en" : "ar");
    });

    // Mobile menu
    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener("click", () => {
        const expanded = menuBtn.getAttribute("aria-expanded") === "true";
        menuBtn.setAttribute("aria-expanded", String(!expanded));
        mobileMenu.hidden = expanded;
      });

      mobileMenu.addEventListener("click", (e) => {
        const t = e.target;
        if (t && t.matches("a")) {
          menuBtn.setAttribute("aria-expanded", "false");
          mobileMenu.hidden = true;
        }
      });
    }

    // Mailto form
    const form = document.getElementById("contactForm");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const name = String(fd.get("name") || "");
        const email = String(fd.get("email") || "");
        const message = String(fd.get("message") || "");
        const subject = encodeURIComponent(`Portfolio message from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
        window.location.href = `mailto:${content.contact.email}?subject=${subject}&body=${body}`;
      });
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    content = await loadContent();

    // First render based on current language
    const lang = window.OSF_I18N?.getLang?.() || "en";
    render(lang);
    wireUI();

    // Re-render on language changes
    document.addEventListener("lang:changed", (e) => render(e.detail.lang));
  });
})();