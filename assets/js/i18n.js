(() => {
  const STORAGE_KEY = "osf_portfolio_lang";
  const DEFAULT_LANG = "en";

  const dict = {
    en: {
      nav: { about:"About", projects:"Projects", experience:"Experience", skills:"Skills", education:"Education", contact:"Contact" },
      cta: { resume:"Resume", viewWork:"View work", emailMe:"Email me", whatsappMe:"WhatsApp me", send:"Send" },
      labels: {
        location:"Location", focus:"Focus", focusValue:"Mobile • Backend",
        whatsapp:"WhatsApp", openTo:"Open to: Mobile apps • Flutter • Android • Backend support",
        backToTop:"Back to top ↑",
        sayHi:"Say hi", contactHint:"Best channel: email. WhatsApp also works.",
        quickMessage:"Quick message", quickMessageHint:"This opens your email app (no backend needed for GitHub Pages).",
        noSpam:"No forms, no tracking, no spam. Just mailto.",
        testimonialsPlaceholder:"Coming soon. (Or we can hide this section entirely.)"
      },
      form: { name:"Name", email:"Email", message:"Message" },
      sections: {
        about:"About", aboutSub:"A quick intro — clean, human, and product-minded.",
        services:"Services",
        projects:"Projects", projectsSub:"Featured work — more screenshots coming soon.",
        experience:"Experience", experienceSub:"Where I’ve worked and what I focused on.",
        skills:"Skills", skillsSub:"Tools I use to ship stable products.",
        education:"Education",
        certifications:"Certifications",
        testimonials:"Testimonials", testimonialsSub:"Optional — add later if you want.",
        contact:"Contact", contactSub:"Let’s build something clean and fast."
      },
      about: { highlights:"Highlights" },
      highlights: [
        "Mobile-focused developer with strong UX/UI attention.",
        "Clean architecture mindset (SOLID + reusable components).",
        "Comfortable with Flutter and Native Android.",
        "API integration, Firebase, and data persistence (Room)."
      ]
    },
    ar: {
      nav: { about:"نبذة", projects:"المشاريع", experience:"الخبرة", skills:"المهارات", education:"التعليم", contact:"تواصل" },
      cta: { resume:"السيرة", viewWork:"شاهد الأعمال", emailMe:"راسلني", whatsappMe:"واتساب", send:"إرسال" },
      labels: {
        location:"الموقع", focus:"التركيز", focusValue:"موبايل • باك-إند",
        whatsapp:"واتساب", openTo:"متاح لـ: تطبيقات موبايل • Flutter • Android • دعم باك-إند",
        backToTop:"العودة للأعلى ↑",
        sayHi:"تواصل معي", contactHint:"الأفضل: البريد. والواتساب ممتاز كذلك.",
        quickMessage:"رسالة سريعة", quickMessageHint:"هذا يفتح تطبيق البريد (بدون باك-إند على GitHub Pages).",
        noSpam:"بدون نماذج، بدون تتبع، بدون إزعاج. فقط mailto.",
        testimonialsPlaceholder:"قريبًا. (أو نخفي هذا القسم بالكامل.)"
      },
      form: { name:"الاسم", email:"البريد", message:"الرسالة" },
      sections: {
        about:"نبذة", aboutSub:"تعريف سريع — بسيط، إنساني، ومهتم بالمنتج.",
        services:"الخدمات",
        projects:"المشاريع", projectsSub:"أعمال مختارة — صور أكثر قريبًا.",
        experience:"الخبرة", experienceSub:"أين عملت وماذا كان تركيزي.",
        skills:"المهارات", skillsSub:"أدوات أستخدمها لتسليم منتجات مستقرة.",
        education:"التعليم",
        certifications:"الشهادات",
        testimonials:"آراء العملاء", testimonialsSub:"اختياري — نضيفه لاحقًا لو رغبت.",
        contact:"تواصل", contactSub:"خلّنا نبني شيء نظيف وسريع."
      },
      about: { highlights:"نقاط سريعة" },
      highlights: [
        "مطوّر يركّز على الموبايل مع اهتمام عالي بالـ UX/UI.",
        "هندسة نظيفة (SOLID + مكوّنات قابلة لإعادة الاستخدام).",
        "مرن بين Flutter وAndroid Native.",
        "ربط API وFirebase وحفظ بيانات (Room)."
      ]
    }
  };

  function getLang() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  }
  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang === "ar" ? "ar" : "en";
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.body.dataset.lang = lang;
    applyI18n(lang);
    document.dispatchEvent(new CustomEvent("lang:changed", { detail: { lang } }));
  }

  function deepGet(obj, path) {
    return path.split(".").reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), obj);
  }

  function applyI18n(lang) {
    const d = dict[lang] || dict.en;

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      const v = deepGet(d, key);
      if (typeof v === "string") el.textContent = v;
    });
  }

  window.OSF_I18N = { getLang, setLang, dict };
  document.addEventListener("DOMContentLoaded", () => setLang(getLang()));
})();