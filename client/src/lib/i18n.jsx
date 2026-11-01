import { useState, useEffect, createContext, useContext } from 'react';

export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'kok', label: 'Konkani', native: 'कोंकणी (Goa)' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
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

    // Field checklists
    checklist_title: 'Field Verification Checklist',
    walk_streets: 'Walk the main commercial streets and count operating establishments by type.',
    check_licenses: 'Note how many display a trade licence, GST or Shops & Establishments number.',
    offer_support: 'Offer registration support: share the nearest facilitation desk and Udyam / trade-licence guidance.',
    disclaimer: 'Scores are zone-level anomalies to validate. They are not findings about any business or person, and must not be used as inspection quotas.',
  },

  kok: {
    // Konkani (Goan State Language)
    overview: 'पळोवप (Overview)',
    activity_map: 'आर्थिक नकासो (Activity Map)',
    zone_priorities: 'जागो प्राधान्य (Zone Priorities)',
    flags: 'नोंदवलेले तालुके (Flags)',
    field_tasks: 'क्षेत्र तपासणी (Field Tasks)',
    governance: 'प्रशासन आनी नियंत्रण (Governance)',
    analytics: 'अनालिटिक्स आनी मॉडेल (Analytics)',
    data_pipeline: 'माहिती प्रवाह (Data Pipeline)',
    admin: 'व्यवस्थापक (Admin)',
    methodology: 'पद्धत (Methodology)',
    sign_out: 'भायर पडात (Sign out)',

    search_placeholder: 'जागो, तालुको वा कोड सोदात…',
    priority: 'प्राधान्य (Priority)',
    confidence: 'विश्वासार्हता (Confidence)',
    registered: 'नोंदणीकृत (Registered)',
    expected: 'अपेक्षित (Expected)',
    gap: 'तफावत (Residual Gap)',
    tier_high: 'उंच (High)',
    tier_medium: 'मध्यम (Medium)',
    tier_low: 'उणे (Low)',
    tier_insufficient: 'अपुरी माहिती (Insufficient)',
    offline_mode: 'ऑफलाइन स्थिती सक्रिय',
    sync_now: 'आतांच सिंक करात',
    queued_validations: 'साठविलेले अहवाल',
    export_csv: 'CSV डाऊनलोड',
    export_pdf: 'PDF तपासणी पत्रक',

    checklist_title: 'क्षेत्र तपासणी सुची (Checklist)',
    walk_streets: 'मुख्य रस्त्यांचेर चलून चालू आसात त्या दुकानांची मोजणी करात.',
    check_licenses: 'कितल्या संस्थांकडे व्यापार परवानो (Trade License / GST) आसा ते तपासात.',
    offer_support: 'नोंदणी खातीर मदत करात: उद्यम नोंदणी आनी मार्गदर्शन शिबिर केंद्रांची माहिती दियात.',
    disclaimer: 'हे स्कोअर फक्त तपासणी खातीर आसात. कोणाचेरय थेट आरोप किंवा दंडात्मक कारवाई खातीर नात.',
  },

  mr: {
    // Marathi
    overview: 'आढावा (Overview)',
    activity_map: 'कार्यकलाप नकाशा (Activity Map)',
    zone_priorities: 'झोन प्राधान्यक्रम (Zone Priorities)',
    flags: 'सूचना (Flags)',
    field_tasks: 'क्षेत्रीय कार्ये (Field Tasks)',
    governance: 'प्रशासन व ऑडिट (Governance)',
    analytics: 'विश्लेषण व मॉडेल (Analytics)',
    data_pipeline: 'डेटा पाइपलाइन (Data Pipeline)',
    admin: 'प्रशासक (Admin)',
    methodology: 'कार्यपद्धती (Methodology)',
    sign_out: 'बाहेर पडा (Sign out)',

    search_placeholder: 'झोन, तालुका किंवा कोड शोधा…',
    priority: 'प्राधान्य (Priority)',
    confidence: 'आत्मविश्वास (Confidence)',
    registered: 'नोंदणीकृत (Registered)',
    expected: 'अपेक्षित (Expected)',
    gap: 'तफावत (Gap)',
    tier_high: 'उच्च (High)',
    tier_medium: 'मध्यम (Medium)',
    tier_low: 'कमी (Low)',
    tier_insufficient: 'अपुरा डेटा (Insufficient)',
    offline_mode: 'ऑफलाइन मोड सुरू',
    sync_now: 'आता सिंक करा',
    queued_validations: 'प्रलंबित तपासण्या',
    export_csv: 'CSV निर्यात',
    export_pdf: 'PDF क्षेत्रीय संच',

    checklist_title: 'क्षेत्रीय पडताळणी यादी (Checklist)',
    walk_streets: 'मुख्य रस्त्यांवर प्रत्यक्ष भेट देऊन कार्यरत आस्थापना मोजा.',
    check_licenses: 'किती आस्थापनांकडे व्यापार परवाना, जीएसटी किंवा गुमास्ता क्रमांक आहे ते पहा.',
    offer_support: 'नोंदणीसाठी सहकार्य करा: जवळच्या सुविधा केंद्राची व उद्यम नोंदणीची माहिती द्या.',
    disclaimer: 'हे स्कोअर क्षेत्रीय तपासणीसाठी आहेत; कोणत्याही व्यक्ती किंवा व्यवसायावर ठपका ठेवण्यासाठी नाहीत.',
  },

  hi: {
    // Hindi
    overview: 'अवलोकन (Overview)',
    activity_map: 'गतिविधि मानचित्र (Activity Map)',
    zone_priorities: 'क्षेत्र प्राथमिकता (Zone Priorities)',
    flags: 'अलर्ट (Flags)',
    field_tasks: 'क्षेत्रीय कार्य (Field Tasks)',
    governance: 'शासन एवं नियंत्रण (Governance)',
    analytics: 'विश्लेषण व मॉडल (Analytics)',
    data_pipeline: 'डेटा पाइपलाइन (Data Pipeline)',
    admin: 'व्यवस्थापक (Admin)',
    methodology: 'कार्यप्रणाली (Methodology)',
    sign_out: 'लॉग आउट (Sign out)',

    search_placeholder: 'क्षेत्र, तालुका या कोड खोजें…',
    priority: 'प्राथमिकता (Priority)',
    confidence: 'विश्वसनीयता (Confidence)',
    registered: 'पंजीकृत (Registered)',
    expected: 'अपेक्षित (Expected)',
    gap: 'अंतर (Residual Gap)',
    tier_high: 'उच्च (High)',
    tier_medium: 'मध्यम (Medium)',
    tier_low: 'निम्न (Low)',
    tier_insufficient: 'अपर्याप्त डेटा (Insufficient)',
    offline_mode: 'ऑफ़लाइन मोड सक्रिय',
    sync_now: 'अभी सिंक करें',
    queued_validations: 'कतारबद्ध सत्यापन',
    export_csv: 'CSV डाउनलोड',
    export_pdf: 'PDF फ़ील्ड पैक',

    checklist_title: 'क्षेत्र सत्यापन चेकलिस्ट',
    walk_streets: 'मुख्य वाणिज्यिक मार्गों पर जाकर संचालित दुकानों की गणना करें।',
    check_licenses: 'जाँचें कि कितनों के पास व्यापार लाइसेंस, जीएसटी या दुकान स्थापना संख्या है।',
    offer_support: 'पंजीकरण सहायता प्रदान करें: निकटतम सुविधा केंद्र और उद्यम पंजीकरण का मार्गदर्शन दें।',
    disclaimer: 'यह स्कोर केवल मानव सत्यापन के लिए है; किसी व्यवसाय या व्यक्ति पर कानूनी आरोप नहीं है।',
  },
};

const I18nContext = createContext({
  lang: 'en',
  setLang: () => {},
  t: (k) => k,
});

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('econoscope_lang') || 'en';
  });

  const setLang = (newLang) => {
    setLangState(newLang);
    localStorage.setItem('econoscope_lang', newLang);
  };

  const t = (key) => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
