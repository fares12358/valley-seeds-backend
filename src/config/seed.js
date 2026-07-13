// backend/src/config/seed.js
// Run: npm run seed  (from backend/ directory)
// Safe to re-run — all operations use upsert.
// Admin is created only if no admin exists.

import "dotenv/config";
import mongoose from "mongoose";
import Admin    from "../modules/auth/auth.model.js";
import Content  from "../modules/content/content.model.js";
import Settings from "../modules/settings/settings.model.js";

// ─── Full EN content ──────────────────────────────────────────────────────────
const EN = {
  nav: {
    home: "Home", about: "About", services: "Services",
    technology: "Technology", contact: "Contact", cta: "Get in Touch",
  },
  hero: {
    heading: "Powering Egypt's Agricultural Future",
    subheading: "Valley Seeds bridges world-class seed genetics with the Egyptian farmer — backed by rigorous field science, dedicated agronomists, and digital transparency since 2018.",
    cta_primary: "Request a Quote",
    cta_secondary: "Contact Us",
    stats: [
      { number: "560+",   text: "Active clients across Egypt" },
      { number: "$700K+", text: "Annual distribution volume" },
      { number: "$1.7M+", text: "In trusted partner relationships" },
    ],
  },
  about: {
    eyebrow: "Who we are",
    heading_line1: "Rooted in Egypt.",
    heading_line2: "Connected to the World.",
    body: "In 2021, Valley Seeds was established with a strategic vision for direct access to the finest international seed genetics, serving as the direct bridge between global innovation and Egyptian agriculture.",
    img_main_alt: "Agronomist inspecting seedlings",
    img_secondary_alt: "Hybrid seeds",
  },
  whyUs: {
    eyebrow: "Why Us",
    heading_line1: "Five Reasons to",
    heading_line2: "Choose Valley Seeds",
    reasons: [
      { num: "01", title: "Rigorous Field Trials",       desc: "All varieties are tested in our experimental fields before reaching the market — perfectly adapted to Egyptian conditions." },
      { num: "02", title: "Advanced Digital Management", desc: "Odoo ERP ensures the highest transparency, precision, and financial accuracy for every partner relationship." },
      { num: "03", title: "Integrated Supply Chain",     desc: "Direct global sourcing combined with a robust and extensive nationwide logistics network, ensuring a seamless and reliable seed supply throughout Egypt." },
      { num: "04", title: "Extensive Market Reach",      desc: "560+ active clients guaranteeing strong presence and rapid penetration across all Egyptian governorates." },
      { num: "05", title: "Dedicated Technical Support", desc: "Expert agronomists with you from seedling to harvest — ensuring maximum productivity on every crop." },
    ],
  },
  mission: {
    eyebrow: "Vision & Mission",
    vision: {
      badge:   "Our Vision",
      heading: "Where We're Going",
      body:    "To become the most trusted institution in Egypt's vegetable seed sector — the definitive gateway connecting global agricultural innovation with the Egyptian farmer, contributing to a sustainable agricultural renaissance and reinforcing national food security.",
    },
    missionCard: {
      badge:   "Our Mission",
      heading: "How We'll Get There",
      body:    "To empower Egyptian farmers with seeds of superior genetics, backed by rigorous scientific field trials and expert agronomist support. We forge long-term strategic partnerships with the world's leading seed companies, leveraging cutting-edge technology to guarantee accuracy, transparency, and maximum yield.",
    },
  },
  services: {
    eyebrow: "Core Values",
    heading: "The Principles That",
    heading_accent: "Guide Every Decision",
    values: [
      { name: "Uncompromising Quality",   desc: "Every seed is a promise of a successful harvest. All varieties undergo rigorous field trials before they ever reach the farmer." },
      { name: "Digital Innovation",       desc: "Odoo ERP integration — a core commitment to financial precision, operational clarity, and full transparency." },
      { name: "Technical Accountability", desc: "We are partners in the field — accompanying every farmer from planting to harvest, long after the point of sale." },
      { name: "Shared Growth",            desc: "Partnership Excellence over transactional thinking — a mindset that has built over $1.7M in lasting mutual trust." },
    ],
  },
  technology: {
    eyebrow: "Technical Excellence",
    heading_line1: "Science Before",
    heading_line2: "the Market",
    cards: [
      { name: "R&D & Variety Trials",        desc: "A dedicated research team tests every new variety across Egypt's distinct climatic zones before any commercial release. Our products aren't just globally proven — they're locally validated for Egyptian soil and season." },
      { name: "On-Ground Technical Support", desc: "Our agronomists don't disappear after the sale. They accompany farmers from seedling to harvest — monitoring, advising, and solving in real time. When you plant with Valley Seeds, you never farm alone." },
    ],
  },
  erp: {
    eyebrow: "Digital Infrastructure",
    heading: "Precision Through",
    heading_accent: "Technology",
    body: "We don't just sell seeds — we run a precision agricultural business. Our entire operation is powered by Odoo ERP, giving every partner full visibility into the supply chain.",
    points: [
      { title: "Unified Operations",    text: "Sales, inventory, and finance fully integrated — eliminating errors and enabling confident, real-time decisions." },
      { title: "Partner Transparency",  text: "Accurate data and live tracking give every domestic and international partner a clear, verifiable view of the operation." },
      { title: "Seamless Supply Chain", text: "From global import to last-mile distribution, every movement is tracked and managed with precision." },
    ],
    dashboard: {
      label: "Live Dashboard — Odoo ERP",
      last_updated: "Last updated",
      just_now: "Just now",
      sync_label: "Real-time data synchronization active",
      items: [
        { label: "Active Clients",      val: "560+" },
        { label: "Distribution Volume", val: "$700,000+" },
        { label: "Global Partners",     val: "Active" },
        { label: "Trust Built",         val: "$1.7M+" },
        { label: "Coverage",            val: "All Egypt" },
      ],
    },
  },
  contact: {
    eyebrow: "Get In Touch",
    heading_line1: "Ready to Grow",
    heading_line2: "With Us?",
    subheading: "Whether you're a farmer, distributor, or global seed company — let's build something extraordinary together.",
    form: {
      title: "Send a Message",
      subtitle: "We typically respond within 24 hours",
      name_label: "Full Name",
      name_placeholder: "John Doe",
      email_label: "Email Address",
      email_placeholder: "john@example.com",
      phone_label: "Phone Number",
      phone_placeholder: "+20 1XX XXX XXXX",
      subject_label: "Subject",
      subject_placeholder: "Select a topic",
      subject_options: [
        { value: "general",      label: "General Inquiry" },
        { value: "partnership",  label: "Partnership" },
        { value: "distribution", label: "Distribution" },
        { value: "support",      label: "Technical Support" },
      ],
      message_label: "Your Message",
      message_placeholder: "Tell us about your project, needs, or questions...",
      submit: "Send Message",
      error: "Please fill in all required fields.",
    },
    success: {
      heading: "Message Sent!",
      body:    "Thank you for reaching out. Our team will review your message and get back to you within 24 hours.",
      again:   "Send another message",
    },
    info: [
      { key: "email",    label: "Email",    value: "info@valley-seeds.com",  link: "mailto:info@valley-seeds.com" },
      { key: "phone",    label: "Phone",    value: "+02 012 876 369 86",     link: "tel:+0201287636986" },
      { key: "whatsapp", label: "WhatsApp", value: "+20 128 763 6986",       link: "https://wa.me/201287636986" },
      { key: "website",  label: "Website",  value: "www.valley-seeds.com",   link: "https://www.valley-seeds.com" },
    ],
  },
  footer: {
    tagline: "Egypt's premier importer of elite vegetable seeds. Bridging global agricultural innovation with Egyptian farmers since 2021.",
    quick_links_title: "Quick Links",
    services_title:    "Our Services",
    contact_title:     "Contact Us",
    copyright: "Valley Seeds. All rights reserved. Built with care for Egyptian agriculture.",
    links: [
      { label: "Home",       href: "/" },
      { label: "About",      href: "#about" },
      { label: "Services",   href: "#services" },
      { label: "Technology", href: "#technology" },
      { label: "Contact",    href: "#contact" },
    ],
    services: ["Seed Distribution","Field Trials","Agronomist Support","Odoo ERP Integration","Supply Chain"],
    contact_items: [
      { key: "email",    label: "Email",    value: "info@valley-seeds.com" },
      { key: "phone",    label: "Phone",    value: "+20 128 763 6986" },
      { key: "location", label: "Location", value: "Cairo, Egypt" },
    ],
  },
};

// ─── Full AR content ──────────────────────────────────────────────────────────
const AR = {
  nav: {
    home: "الرئيسية", about: "من نحن", services: "خدماتنا",
    technology: "التقنية", contact: "تواصل معنا", cta: "تواصل الآن",
  },
  hero: {
    heading: "نُشغّل المستقبل الزراعي لمصر",
    subheading: "فالي سيدز تجسر الفجوة بين أفضل جينات البذور العالمية والمزارع المصري — مدعومةً بعلم الحقل الصارم والمهندسين الزراعيين المتخصصين والشفافية الرقمية منذ عام 2018.",
    cta_primary: "اطلب عرض سعر",
    cta_secondary: "تواصل معنا",
    stats: [
      { number: "+560",              text: "عميل نشط في جميع أنحاء مصر" },
      { number: "+700 ألف دولار",   text: "حجم التوزيع السنوي" },
      { number: "+1.7 مليون دولار", text: "في شراكات موثوقة راسخة" },
    ],
  },
  about: {
    eyebrow: "من نحن",
    heading_line1: "جذورنا في مصر.",
    heading_line2: "وتواصلنا مع العالم.",
    body: "في عام 2021، تأسست فالي سيدز برؤية استراتيجية للوصول المباشر إلى أرقى جينات البذور الدولية، لتكون الجسر المباشر بين الابتكار العالمي والزراعة المصرية.",
    img_main_alt: "مهندس زراعي يفحص الشتلات",
    img_secondary_alt: "بذور هجينة",
  },
  whyUs: {
    eyebrow: "لماذا نحن",
    heading_line1: "خمسة أسباب تجعلك",
    heading_line2: "تختار فالي سيدز",
    reasons: [
      { num: "01", title: "تجارب حقلية صارمة",    desc: "تُختبر جميع الأصناف في حقولنا التجريبية قبل طرحها في السوق — متكيّفةً تماماً مع الظروف المصرية." },
      { num: "02", title: "إدارة رقمية متقدمة",   desc: "يضمن نظام Odoo ERP أعلى مستويات الشفافية والدقة والضبط المالي في كل علاقة شراكة." },
      { num: "03", title: "سلسلة إمداد متكاملة",  desc: "مصادر عالمية مباشرة مقترنة بشبكة لوجستية وطنية قوية وشاملة، تضمن إمداداً سلساً وموثوقاً للبذور في جميع أنحاء مصر." },
      { num: "04", title: "انتشار سوقي واسع",     desc: "أكثر من 560 عميلاً نشطاً يضمنون حضوراً قوياً واختراقاً سريعاً في جميع المحافظات المصرية." },
      { num: "05", title: "دعم فني متخصص",        desc: "خبراؤنا الزراعيون بجانبك من الشتلة حتى الحصاد — لضمان أقصى إنتاجية في كل محصول." },
    ],
  },
  mission: {
    eyebrow: "الرؤية والرسالة",
    vision: {
      badge:   "رؤيتنا",
      heading: "إلى أين نتجه",
      body:    "أن نصبح المؤسسة الأكثر ثقةً في قطاع بذور الخضروات بمصر — البوابة الحقيقية التي تربط الابتكار الزراعي العالمي بالمزارع المصري، مساهمين في نهضة زراعية مستدامة وتعزيز الأمن الغذائي الوطني.",
    },
    missionCard: {
      badge:   "رسالتنا",
      heading: "كيف سنصل إلى هناك",
      body:    "تمكين المزارعين المصريين ببذور ذات جينات متفوقة، مدعومة بتجارب حقلية علمية صارمة ودعم مهندسين زراعيين متخصصين. نبني شراكات استراتيجية طويلة الأمد مع كبرى شركات البذور العالمية، مستثمرين أحدث التقنيات لضمان الدقة والشفافية وأعلى عائد.",
    },
  },
  services: {
    eyebrow: "قيمنا الجوهرية",
    heading: "المبادئ التي",
    heading_accent: "تُوجّه كل قرار",
    values: [
      { name: "جودة لا تقبل المساومة", desc: "كل بذرة هي وعد بحصاد ناجح. تخضع جميع الأصناف لتجارب حقلية صارمة قبل أن تصل إلى المزارع." },
      { name: "الابتكار الرقمي",       desc: "تكامل نظام Odoo ERP — التزام جوهري بالدقة المالية والوضوح التشغيلي والشفافية الكاملة." },
      { name: "المساءلة التقنية",      desc: "نحن شركاء في الحقل — نرافق كل مزارع من الزراعة حتى الحصاد، بعد ما بعد نقطة البيع." },
      { name: "النمو المشترك",         desc: "التميز في الشراكة فوق التفكير التجاري — عقلية بنت أكثر من 1.7 مليون دولار من الثقة المتبادلة الراسخة." },
    ],
  },
  technology: {
    eyebrow: "التميز التقني",
    heading_line1: "العلم أولاً",
    heading_line2: "قبل السوق",
    cards: [
      { name: "البحث والتطوير وتجارب الأصناف", desc: "فريق بحثي متخصص يختبر كل صنف جديد عبر المناطق المناخية المتميزة في مصر قبل أي إطلاق تجاري. منتجاتنا ليست مُثبتة عالمياً فحسب — بل هي مُصادق عليها محلياً لتربة مصر ومواسمها." },
      { name: "الدعم الفني الميداني",           desc: "مهندسونا الزراعيون لا يختفون بعد البيع. يرافقون المزارعين من الشتلة حتى الحصاد — يراقبون ويستشيرون ويحلون في الوقت الفعلي. حين تزرع مع فالي سيدز، لن تزرع وحدك أبداً." },
    ],
  },
  erp: {
    eyebrow: "البنية التحتية الرقمية",
    heading: "دقة لا مثيل لها",
    heading_accent: "بقوة التكنولوجيا",
    body: "نحن لا نبيع البذور فحسب — بل ندير عملاً زراعياً دقيقاً. يعمل نظام Odoo ERP على تشغيل عملياتنا بالكامل، مانحاً كل شريك رؤية كاملة لسلسلة الإمداد.",
    points: [
      { title: "عمليات موحّدة",     text: "المبيعات والمخزون والمالية مدمجة بالكامل — تُلغي الأخطاء وتُمكّن من اتخاذ قرارات واثقة في الوقت الفعلي." },
      { title: "شفافية الشريك",    text: "البيانات الدقيقة والتتبع المباشر يمنحان كل شريك محلي ودولي رؤية واضحة وقابلة للتحقق للعملية." },
      { title: "سلسلة إمداد سلسة", text: "من الاستيراد العالمي حتى التوزيع في الميل الأخير، كل حركة تُتتبع وتُدار بدقة عالية." },
    ],
    dashboard: {
      label: "لوحة التحكم المباشرة — Odoo ERP",
      last_updated: "آخر تحديث",
      just_now: "الآن",
      sync_label: "مزامنة البيانات في الوقت الفعلي نشطة",
      items: [
        { label: "العملاء النشطون",   val: "+560" },
        { label: "حجم التوزيع",       val: "+700,000 $" },
        { label: "الشركاء العالميون", val: "نشط" },
        { label: "الثقة المبنية",     val: "+1.7 م $" },
        { label: "التغطية",           val: "جميع أنحاء مصر" },
      ],
    },
  },
  contact: {
    eyebrow: "تواصل معنا",
    heading_line1: "هل أنت مستعد للنمو",
    heading_line2: "معنا؟",
    subheading: "سواء كنت مزارعاً أو موزعاً أو شركة بذور عالمية — لنبنِ معاً شيئاً استثنائياً.",
    form: {
      title: "أرسل رسالة",
      subtitle: "نرد عادةً خلال 24 ساعة",
      name_label: "الاسم الكامل",
      name_placeholder: "محمد أحمد",
      email_label: "البريد الإلكتروني",
      email_placeholder: "example@domain.com",
      phone_label: "رقم الهاتف",
      phone_placeholder: "+20 1XX XXX XXXX",
      subject_label: "الموضوع",
      subject_placeholder: "اختر موضوعاً",
      subject_options: [
        { value: "general",      label: "استفسار عام" },
        { value: "partnership",  label: "شراكة" },
        { value: "distribution", label: "توزيع" },
        { value: "support",      label: "دعم فني" },
      ],
      message_label: "رسالتك",
      message_placeholder: "أخبرنا عن مشروعك أو احتياجاتك أو أسئلتك...",
      submit: "إرسال الرسالة",
      error: "يرجى ملء جميع الحقول المطلوبة.",
    },
    success: {
      heading: "تم الإرسال!",
      body:    "شكراً لتواصلك معنا. سيراجع فريقنا رسالتك ويرد عليك خلال 24 ساعة.",
      again:   "إرسال رسالة أخرى",
    },
    info: [
      { key: "email",    label: "البريد الإلكتروني",  value: "info@valley-seeds.com",  link: "mailto:info@valley-seeds.com" },
      { key: "phone",    label: "الهاتف",              value: "+02 012 876 369 86",     link: "tel:+0201287636986" },
      { key: "whatsapp", label: "واتساب",              value: "+20 128 763 6986",       link: "https://wa.me/201287636986" },
      { key: "website",  label: "الموقع الإلكتروني",  value: "www.valley-seeds.com",   link: "https://www.valley-seeds.com" },
    ],
  },
  footer: {
    tagline: "الشركة الرائدة في مصر لاستيراد بذور الخضروات المتميزة. نربط الابتكار الزراعي العالمي بالمزارعين المصريين منذ عام 2021.",
    quick_links_title: "روابط سريعة",
    services_title:    "خدماتنا",
    contact_title:     "تواصل معنا",
    copyright: "فالي سيدز. جميع الحقوق محفوظة. صُنع باهتمام للزراعة المصرية.",
    links: [
      { label: "الرئيسية",    href: "/" },
      { label: "من نحن",      href: "#about" },
      { label: "خدماتنا",    href: "#services" },
      { label: "التقنية",    href: "#technology" },
      { label: "تواصل معنا", href: "#contact" },
    ],
    services: ["توزيع البذور","التجارب الحقلية","دعم المهندسين الزراعيين","تكامل Odoo ERP","سلسلة الإمداد"],
    contact_items: [
      { key: "email",    label: "البريد الإلكتروني", value: "info@valley-seeds.com" },
      { key: "phone",    label: "الهاتف",             value: "+20 128 763 6986" },
      { key: "location", label: "الموقع",             value: "القاهرة، مصر" },
    ],
  },
};

// ─── Section keys (order matches content model enum) ─────────────────────────
const SECTION_KEYS = ["nav","hero","about","whyUs","mission","services","technology","erp","contact","footer"];

// ─── Default settings ─────────────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  brandName:    "Valley Seeds",
  primaryColor: "#037338",
  accentColor:  "#96C422",
  email:        "info@valley-seeds.com",
  phone:        "+20 128 763 6986",
  whatsapp:     "+20 128 763 6986",
  website:      "www.valley-seeds.com",
  location:     "Cairo, Egypt",
  socialLinks: { facebook: "", linkedin: "", instagram: "", whatsapp: "https://wa.me/201287636986" },
  logoUrl:      "",
  logoWhiteUrl: "",
};

// ─── Main seed function ───────────────────────────────────────────────────────
const seed = async () => {
  try {
    console.log("[seed] Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("[seed] MongoDB connected");

    // 1. Seed content sections
    console.log("[seed] Seeding 10 content sections...");
    for (const key of SECTION_KEYS) {
      await Content.findOneAndUpdate(
        { section: key },
        { $set: { section: key, en: EN[key], ar: AR[key], images: [] } },
        { upsert: true, new: true }
      );
      console.log(`[seed]   ✓ ${key}`);
    }

    // 2. Seed settings
    console.log("[seed] Seeding settings...");
    await Settings.findOneAndUpdate(
      {},
      { $set: DEFAULT_SETTINGS },
      { upsert: true, new: true }
    );
    console.log("[seed]   ✓ Settings upserted");

    // 3. Seed admin — skip if already exists
    console.log("[seed] Seeding admin account...");
    const adminEmail    = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.warn("[seed]   ! ADMIN_EMAIL or ADMIN_PASSWORD not set in .env — skipping admin creation");
    } else {
      const existing = await Admin.findOne({ email: adminEmail.toLowerCase() });
      if (existing) {
        console.log("[seed]   ℹ Admin already exists — skipping (password unchanged)");
      } else {
        await Admin.create({ email: adminEmail, password: adminPassword });
        // pre-save hook in auth.model.js hashes the password automatically
        console.log(`[seed]   ✓ Admin created: ${adminEmail}`);
      }
    }

    console.log("[seed] Done. 12 documents ready in MongoDB.");
  } catch (err) {
    console.error("[seed] Error:", err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("[seed] Disconnecting...");
    process.exit(0);
  }
};

seed();
