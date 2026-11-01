import { useState, useEffect, createContext, useContext } from 'react';

export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
];

export const TRANSLATIONS = {
  en: {
    // Navigation
    overview: 'Overview',
    activity_map: 'Activity map',
    zone_priorities: 'Zone priorities',
    flags: 'Flags',
    field_tasks: 'Field tasks',
    governance: 'Governance',
    analytics: 'Analytics & model',
    data_pipeline: 'Data & pipeline',
    admin: 'Admin',
    methodology: 'Methodology',
    sign_out: 'Sign out',
    priority_monitor: 'Priority Monitor',
    intelligence: 'Intelligence',
    administration: 'Administration',
    about: 'About',

    // Topbar
    data_through: 'Data through',
    demo_dataset: 'Demo dataset (synthetic)',

    // Overview Page (Dashboard)
    overview_title: 'Where do records and activity diverge?',
    overview_sub: '{zones} zones across 12 talukas · each compared with zones of the same kind',
    shadow_map: 'Shadow map',
    plan_visits: "Plan this month's visits",
    high_priority_zones: 'High-priority zones',
    see_ranked_list: 'see ranked list',
    medium_zones: 'medium',
    new_widening_gaps: 'New or widening gaps',
    emergence_view: 'emergence view',
    insufficient_data_zones: 'Zones with insufficient data',
    zones_carry_score: 'of zones carry a score',
    field_hit_rate: 'Field hit rate vs random',
    no_validations_yet: 'no validations yet',
    prioritised_vs_control: 'prioritised vs control',
    reg_vs_expected: 'Registered vs expected footprint',
    reg_vs_expected_sub: 'Statewide totals for scored zones. The expected line is what independent signals suggest should be on record.',
    zones_by_tier: 'Zones by priority tier',
    priority_formula: 'Priority = peer-relative gap × confidence',
    open_flags_by_type: 'open flags by type',
    statewide_footer: 'Statewide the two lines sit close together by design: the model looks for zones that depart from their peers, not for a statewide shortfall.',

    // Common actions & labels
    search_placeholder: 'Search zone, taluka or code…',
    priority: 'Priority',
    confidence: 'Confidence',
    registered: 'Registered',
    expected: 'Expected',
    gap: 'Peer-relative gap',
    tier_high: 'High',
    tier_medium: 'Medium',
    tier_low: 'Low',
    tier_insufficient: 'Insufficient data',
    offline_mode: 'Offline Mode Active',
    sync_now: 'Sync Now',
    queued_validations: 'queued validations',
    export_csv: 'Export CSV',
    export_pdf: 'Export PDF (Field Pack)',

    // Landing Page
    landing_nav_how: 'How it works',
    landing_nav_model: 'The model',
    landing_nav_signin: 'Sign in',
    landing_nav_open: 'Open portal',
    hero_title_1: 'See where the economy is',
    hero_title_em: 'growing, shrinking or missing',
    hero_title_2: 'from the records.',
    hero_lead: 'EconoScope compares official business records with what satellites, tourism data and infrastructure show on the ground, zone by zone. Every flag comes with a reason and a confidence score, and it never points at an individual business.',
    open_portal_arrow: 'Open the portal →',
    signin_portal_arrow: 'Sign in to the portal →',
    how_model_works: 'How the model works',
    zones_monitored: 'zones monitored monthly',
    data_sources_combined: 'data sources combined',
    zones_flagged: 'zones flagged for a closer look',
    goa_latest_demo: 'Goa, latest month · demo data',
    hexagon_h3: '⬡ Hexagon H3',
    square_grid: '▦ Square',
    activity: 'Activity',
    gap_vs_peers: 'Gap vs peers',
    how_it_works: 'How it works',
    three_steps: 'Three steps, repeated every month.',
    step1_title: 'Combine the data',
    step1_desc: 'Business registrations and survey counts are combined with night-time satellite lights, built-up area and tourism figures, added up to ~2.7 km zones across Goa.',
    step2_title: 'Compare with the records',
    step2_desc: 'Each zone is compared only with zones of the same kind. The model works out what should be on record there and flags zones that sit far from their peers, or are changing unusually fast.',
    step3_title: 'Check on the ground',
    step3_desc: 'Each flag carries its evidence and a confidence score. Field teams visit the top zones and a random control set, offer registration support, and their findings recalibrate the model.',
    what_model_does_title: 'What the model does',
    what_model_does_desc: 'In plain words: it works out how many businesses should be on record in each zone, given what can be observed there and in similar zones, and tells you where the records fall short or run ahead. It also says how sure it is.',
    four_alert_kinds: 'Four kinds of alert',
    explore_pilot: 'Explore the Goa pilot',
    explore_pilot_desc: 'Sign in with a demo account to browse the map, review alerts and record field validations.',

    // Field checklists & alerts
    checklist_title: 'Field Verification Checklist',
    walk_streets: 'Walk the main commercial streets and count operating establishments by type.',
    check_licenses: 'Note how many display a trade licence, GST or Shops & Establishments number.',
    offer_support: 'Offer registration support: share the nearest facilitation desk and Udyam / trade-licence guidance.',
    disclaimer: 'Scores are zone-level anomalies to validate. They are not findings about any business or person, and must not be used as inspection quotas.',
  },

  hi: {
    // Navigation
    overview: 'अवलोकन (Overview)',
    activity_map: 'आर्थिक गतिविधि नक्शा (Activity map)',
    zone_priorities: 'क्षेत्रीय प्राथमिकताएं (Zone priorities)',
    flags: 'समीक्षा संकेत (Flags)',
    field_tasks: 'क्षेत्रीय कार्य (Field tasks)',
    governance: 'शासन एवं सुरक्षा (Governance)',
    analytics: 'विश्लेषण एवं मॉडल (Analytics & model)',
    data_pipeline: 'डेटा एवं पाइपलाइन (Data & pipeline)',
    admin: 'प्रशासन (Admin)',
    methodology: 'कार्यप्रणाली (Methodology)',
    sign_out: 'साइन आउट (Sign out)',
    priority_monitor: 'प्राथमिकता निगरानी',
    intelligence: 'आर्थिक बुद्धिमत्ता',
    administration: 'प्रशासनिक नियंत्रण',
    about: 'परिचय',

    // Topbar
    data_through: 'डेटा अद्यतन',
    demo_dataset: 'प्रदर्शनी डेटा (सिंथेटिक)',

    // Overview Page (Dashboard)
    overview_title: 'अभिलेख और आर्थिक गतिविधि कहाँ भिन्न हैं?',
    overview_sub: '12 तालुकों में {zones} क्षेत्र · प्रत्येक की तुलना उसी प्रकार के क्षेत्रों से',
    shadow_map: 'शैडो मैप',
    plan_visits: 'इस माह की यात्राएं तय करें',
    high_priority_zones: 'उच्च प्राथमिकता वाले क्षेत्र',
    see_ranked_list: 'रैंक सूची देखें',
    medium_zones: 'मध्यम',
    new_widening_gaps: 'नए या बढ़ते अंतर',
    emergence_view: 'उभरते अंतर देखें',
    insufficient_data_zones: 'अपर्याप्त डेटा वाले क्षेत्र',
    zones_carry_score: 'क्षेत्रों का स्कोर उपलब्ध है',
    field_hit_rate: 'यादृच्छिक तुलना में क्षेत्रीय सटीकता',
    no_validations_yet: 'कोई सत्यापन नहीं हुआ',
    prioritised_vs_control: 'प्राथमिकता बनाम नियंत्रण',
    reg_vs_expected: 'पंजीकृत बनाम अपेक्षित आर्थिक पदचिह्न',
    reg_vs_expected_sub: 'मूल्यांकित क्षेत्रों के लिए राज्यव्यापी कुल संख्या। अपेक्षित रेखा वह है जो स्वतंत्र संकेतकों के अनुसार रिकॉर्ड में होनी चाहिए।',
    zones_by_tier: 'प्राथमिकता श्रेणी अनुसार क्षेत्र',
    priority_formula: 'प्राथमिकता = समान-क्षेत्र अंतर × विश्वास स्कोर',
    open_flags_by_type: 'प्रकार अनुसार खुले संकेत',
    statewide_footer: 'राज्यव्यापी दोनों रेखाएं जानबूझकर निकट रहती हैं: मॉडल अपने साथियों से भिन्न होने वाले क्षेत्रों की तलाश करता है, न कि राज्यव्यापी कमी की।',

    // Common actions & labels
    search_placeholder: 'क्षेत्र, तालुका या कोड खोजें…',
    priority: 'प्राथमिकता',
    confidence: 'विश्वास स्कोर',
    registered: 'पंजीकृत संख्या',
    expected: 'अपेक्षित संख्या',
    gap: 'समान-क्षेत्र अंतर',
    tier_high: 'उच्च प्राथमिकता',
    tier_medium: 'मध्यम प्राथमिकता',
    tier_low: 'निम्न प्राथमिकता',
    tier_insufficient: 'अपर्याप्त डेटा',
    offline_mode: 'ऑफ़लाइन मोड सक्रिय',
    sync_now: 'तुरंत सिंक करें',
    queued_validations: 'लंबित सत्यापन',
    export_csv: 'सीएसवी निर्यात',
    export_pdf: 'फील्ड पैक (पीडीएफ) निर्यात',

    // Landing Page
    landing_nav_how: 'यह कैसे काम करता है',
    landing_nav_model: 'मॉडल प्रणाली',
    landing_nav_signin: 'साइन इन करें',
    landing_nav_open: 'पोर्टल खोलें',
    hero_title_1: 'देखें कि अर्थव्यवस्था कहाँ',
    hero_title_em: 'बढ़ रही है, सिकुड़ रही है या गायब है',
    hero_title_2: 'आधिकारिक रिकॉर्ड से।',
    hero_lead: 'इकोनोस्कोप आधिकारिक व्यापार रिकॉर्ड की तुलना उपग्रह, पर्यटन और अवसंरचना डेटा से करता है, क्षेत्र दर क्षेत्र। प्रत्येक संकेत के साथ एक कारण और विश्वास स्कोर होता है, और यह कभी किसी व्यक्तिगत व्यवसाय को लक्षित नहीं करता।',
    open_portal_arrow: 'पोर्टल खोलें →',
    signin_portal_arrow: 'पोर्टल में साइन इन करें →',
    how_model_works: 'मॉडल कैसे कार्य करता है',
    zones_monitored: 'प्रति माह मॉनिटर किए जाने वाले क्षेत्र',
    data_sources_combined: 'संयुक्त डेटा स्रोत',
    zones_flagged: 'सत्यापन हेतु चिह्नित क्षेत्र',
    goa_latest_demo: 'गोवा, नवीनतम माह · प्रदर्शनी डेटा',
    hexagon_h3: '⬡ षट्कोणीय H3',
    square_grid: '▦ वर्गाकार',
    activity: 'गतिविधि',
    gap_vs_peers: 'समान क्षेत्रों से अंतर',
    how_it_works: 'यह कैसे काम करता है',
    three_steps: 'तीन चरण, जो प्रत्येक माह दोहराए जाते हैं।',
    step1_title: 'डेटा का एकीकरण',
    step1_desc: 'व्यावसायिक पंजीकरण और सर्वेक्षण को उपग्रह रात्रि रोशनी, निर्माण क्षेत्र और पर्यटन संकेतकों के साथ जोड़ा जाता है, जो गोवा के ~2.7 किमी क्षेत्रों में विभाजित हैं।',
    step2_title: 'अभिलेखों के साथ तुलना',
    step2_desc: 'प्रत्येक क्षेत्र की तुलना केवल उसी प्रकार के समान क्षेत्रों से की जाती है ताकि अपेक्षित आर्थिक गतिविधि का सटीक अनुमान लगाया जा सके।',
    step3_title: 'धरातल पर सत्यापन',
    step3_desc: 'प्रत्येक संकेत के साथ साक्ष्य और विश्वास स्कोर होता है। क्षेत्रीय दल शीर्ष क्षेत्रों का दौरा कर उद्यम पंजीकरण सहायता प्रदान करते हैं।',
    what_model_does_title: 'मॉडल कैसे कार्य करता है',
    what_model_does_desc: 'सरल शब्दों में: यह गणना करता है कि प्रत्येक क्षेत्र में कितने व्यवसाय पंजीकृत होने चाहिए, और बताता है कि वास्तविक रिकॉर्ड कहाँ कम या अधिक हैं।',
    four_alert_kinds: 'चार प्रकार के संकेत',
    explore_pilot: 'गोवा पायलट प्रोजेक्ट देखें',
    explore_pilot_desc: 'मानचित्र देखने, संकेतों की समीक्षा करने और क्षेत्रीय सत्यापन दर्ज करने हेतु डेमो खाते से साइन इन करें।',

    // Field checklists & alerts
    checklist_title: 'क्षेत्रीय सत्यापन चेकलिस्ट',
    walk_streets: 'मुख्य व्यावसायिक सड़कों का सर्वेक्षण करें और प्रकार के अनुसार सक्रिय प्रतिष्ठानों की गणना करें।',
    check_licenses: 'जांचें कि कितने प्रतिष्ठान ट्रेड लाइसेंस, जीएसटी या दुकान प्रतिष्ठान नंबर प्रदर्शित कर रहे हैं।',
    offer_support: 'पंजीकरण सहायता प्रदान करें: निकटतम सुविधा केंद्र और उद्यम / ट्रेड लाइसेंस मार्गदर्शन साझा करें।',
    disclaimer: 'स्कोर सत्यापन हेतु क्षेत्रीय स्तर की विसंगतियां हैं। ये किसी व्यवसाय या व्यक्ति के विरुद्ध निष्कर्ष नहीं हैं, और इन्हें निरीक्षण कोटा के रूप में उपयोग नहीं किया जाना चाहिए।',
  },
};

const I18nContext = createContext({
  lang: 'en',
  setLang: () => {},
  t: (k, fallback) => fallback || k,
});

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem('econoscope_lang');
      return (saved === 'hi' || saved === 'en') ? saved : 'en';
    } catch {
      return 'en';
    }
  });

  const setLang = (newLang) => {
    setLangState(newLang);
    try {
      localStorage.setItem('econoscope_lang', newLang);
    } catch {}
  };

  const t = (key, fallback = '') => {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    if (dict && dict[key]) return dict[key];
    const enDict = TRANSLATIONS.en;
    if (enDict && enDict[key]) return enDict[key];
    return fallback || key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t, languages: LANGUAGES }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
