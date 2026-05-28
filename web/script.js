/* ================================================
   AGRI AI — REBUILT CORE LOGIC
   Clean, Modular, and Robust PWA Implementation
   ================================================ */

const AppState = {
    currentScreen: 'screenHome',
    previousScreen: null,
    resultSource: null,
    selectedFile: null,
    currentLang: localStorage.getItem('agri-lang') || 'en',
    iotInterval: null,
    lastMoisture: 0
};



/* --- Translations --- */
const TRANSLATIONS = {
    en: {
        navHome: 'Home', navDetect: 'Detect', navCrops: 'Crops', navScan: 'Start Scan',
        heroBadge: '🚜 Farmer Support App',
        heroTitle1: 'Healthy Crops', heroTitle2: 'Better Income',
        heroDesc: 'Identify plant disease and get exact treatment steps quickly.',
        heroBtn1: '📸 Scan Your Crop',
        statCrops: 'Crops', statDiseases: 'Diseases', statLangs: 'Languages',
        statAdvice: 'Advice', statFocus: 'Focus',
        selectLang: 'Select Your Language',
        doThisFirst: 'Do This First',
        qaScanLeaf: 'Scan Leaf', qaScanSub: 'Detect diseases instantly',
        qaIoT: 'IoT Monitor', qaIoTSub: 'Live soil metrics',
        qaChat: 'AI Chat', qaChatSub: 'Ask an expert',
        secFeaturesTitle: 'Smart Farming Tools',
        secFeaturesDesc: 'Everything you need for better farming decisions — powered by AI.',
        featDetect: 'Detect Disease', featDetectDesc: 'Scan leaves for instant AI diagnosis.',
        featMonitor: 'Smart Monitor', featMonitorDesc: 'Live soil moisture tracking.',
        todayTip: "Today's Tip",
        workflowTitle: 'Simple 3-Step Workflow', workflowSubtitle: 'Start your journey to better farming in minutes',
        step1Title: 'Upload Crop Photo', step1Desc: 'Take a clear leaf photo from your phone camera.',
        step2Title: 'Check Disease Report', step2Desc: 'Get confidence score and treatment plan instantly.',
        step3Title: 'Take Action', step3Desc: 'Use organic/chemical guidance and required products.',
        back: '← Back', pageDetect: 'Disease Detection',
        uploadTitle: 'Upload Leaf Image', uploadDrag: 'Drag & drop or click to browse',
        uploadFormats: 'JPG / PNG supported', uploadHint: 'Use your camera or upload a leaf image from your device.',
        btnTakePhoto: '📸 Take Photo', btnChoosePhoto: '📂 Choose Photo',
        retake: 'Retake', analyze: 'Analyze Now',
        scanStepsTitle: '🔍 Disease Scan Steps',
        scanStep1: 'Click Choose File and upload crop leaf',
        scanStep2: 'Tap Analyze Now for disease report',
        scanStep3: 'Follow treatment and prevention tips',
        photoTipsTitle: '📸 Good Photo Tips',
        tip1: 'Good natural lighting', tip2: 'Fill frame with the leaf',
        tip3: 'Avoid motion blur', tip4: 'Show the affected area clearly',
        iotTitle: 'IoT Smart Monitor', iotSoilMoisture: 'Soil Moisture',
        fetching: 'Fetching...', lastUpdated: 'Last Updated:',
        iotAIRec: 'AI Recommendation', iotOptRange: 'Optimal Range',
        iotConn: 'Connection', iotLive: 'Live',
        iotMinToday: 'Min Today', iotMaxToday: 'Max Today',
        iotAverage: 'Average', iotReadings: 'Readings',
        iotChartTitle: 'Live Moisture History', iotLast20: 'Last 20 Readings',
        iotWeather: 'Field Weather', iotDetectLoc: 'Detecting location...',
        iotRefreshWeather: '🔄 Refresh Weather',
        iotSoilHealth: 'Soil Health Score', iotWaiting: 'Waiting...',
        iotConnectSensor: 'Connect sensor to get your soil health score.',
        chatGreeting: "👋 Hi! I'm your Agri AI assistant. Ask me anything about crops, diseases, or farming!",
        chatPlaceholder: 'Ask about diseases or farming...',
        iotDry: 'Too Dry', iotDryRec: '🚨 Soil moisture is low! Start irrigation immediately to prevent crop wilting.',
        iotOpt: 'Optimal', iotOptRec: '✅ Soil moisture is at an ideal level for most crops. No action needed.',
        iotWet: 'Too Wet', iotWetRec: '⚠️ Soil is saturated. Stop irrigation and ensure proper drainage to avoid root rot.'
    },
    hi: {
        navHome: 'होम', navDetect: 'पहचानें', navCrops: 'फसलें', navScan: 'स्कैन करें',
        heroBadge: '🌱 AI-संचालित कृषि',
        heroTitle1: 'स्वस्थ फसलें', heroTitle2: 'बेहतर आमदनी',
        heroDesc: 'पौधों की बीमारियों को तुरंत पहचानें और सटीक उपचार कदम जल्दी प्राप्त करें।',
        heroBtn1: '📸 अपनी फसल स्कैन करें',
        statCrops: 'फसलें', statDiseases: 'बीमारियाँ', statLangs: 'भाषाएं',
        statAdvice: 'सलाह', statFocus: 'फोकस',
        selectLang: 'अपनी भाषा चुनें',
        doThisFirst: 'पहले यह करें',
        qaScanLeaf: 'पत्ती स्कैन करें', qaScanSub: 'बीमारियाँ तुरंत पहचानें',
        qaIoT: 'IoT मॉनिटर', qaIoTSub: 'लाइव मिट्टी डेटा',
        qaChat: 'AI चैट', qaChatSub: 'किसी विशेषज्ञ से पूछें',
        secFeaturesTitle: 'स्मार्ट खेती उपकरण',
        secFeaturesDesc: 'बेहतर खेती के फैसलों के लिए सब कुछ — AI द्वारा संचालित।',
        featDetect: 'बीमारी पहचानें', featDetectDesc: 'त्वरित AI निदान के लिए पत्तियाँ स्कैन करें।',
        featMonitor: 'स्मार्ट मॉनिटर', featMonitorDesc: 'लाइव मिट्टी नमी ट्रैकिंग।',
        todayTip: 'आज की टिप',
        workflowTitle: 'सरल 3-चरण प्रक्रिया', workflowSubtitle: 'मिनटों में बेहतर खेती की ओर अपनी यात्रा शुरू करें',
        step1Title: 'फसल फोटो अपलोड करें', step1Desc: 'अपने फोन कैमरे से एक स्पष्ट पत्ती की फोटो लें।',
        step2Title: 'रोग रिपोर्ट देखें', step2Desc: 'विश्वास स्कोर और उपचार योजना तुरंत प्राप्त करें।',
        step3Title: 'कदम उठाएं', step3Desc: 'जैविक/रासायनिक मार्गदर्शन और आवश्यक उत्पादों का उपयोग करें।',
        back: '← वापस', pageDetect: 'बीमारी की पहचान',
        uploadTitle: 'पत्ती की छवि अपलोड करें', uploadDrag: 'यहाँ खींचें और छोड़ें या ब्राउज़ करने के लिए क्लिक करें',
        uploadFormats: 'JPG / PNG समर्थित', uploadHint: 'अपने कैमरे का उपयोग करें या डिवाइस से पत्ती की छवि अपलोड करें।',
        btnTakePhoto: '📸 फोटो लें', btnChoosePhoto: '📂 फोटो चुनें',
        retake: 'फिर से लें', analyze: 'अभी विश्लेषण करें',
        scanStepsTitle: '🔍 रोग स्कैन चरण',
        scanStep1: 'फ़ाइल चुनें पर क्लिक करें और फसल की पत्ती अपलोड करें',
        scanStep2: 'रोग रिपोर्ट के लिए अभी विश्लेषण करें पर टैप करें',
        scanStep3: 'उपचार और रोकथाम युक्तियों का पालन करें',
        photoTipsTitle: '📸 अच्छी फोटो टिप्स',
        tip1: 'अच्छी प्राकृतिक रोशनी', tip2: 'फ्रेम को पत्ती से भरें',
        tip3: 'मोशन ब्लर से बचें', tip4: 'प्रभावित क्षेत्र को स्पष्ट रूप से दिखाएं',
        iotTitle: 'IoT स्मार्ट मॉनिटर', iotSoilMoisture: 'मिट्टी की नमी',
        fetching: 'प्राप्त हो रहा है...', lastUpdated: 'अंतिम अपडेट:',
        iotAIRec: 'AI सिफारिश', iotOptRange: 'आदर्श सीमा',
        iotConn: 'कनेक्शन', iotLive: 'लाइव',
        iotMinToday: 'आज का न्यूनतम', iotMaxToday: 'आज का अधिकतम',
        iotAverage: 'औसत', iotReadings: 'रीडिंग',
        iotChartTitle: 'लाइव नमी इतिहास', iotLast20: 'अंतिम 20 रीडिंग',
        iotWeather: 'खेत का मौसम', iotDetectLoc: 'स्थान का पता लगाया जा रहा है...',
        iotRefreshWeather: '🔄 मौसम रीफ्रेश करें',
        iotSoilHealth: 'मिट्टी स्वास्थ्य स्कोर', iotWaiting: 'प्रतीक्षा कर रहे हैं...',
        iotConnectSensor: 'मिट्टी स्वास्थ्य स्कोर पाने के लिए सेंसर कनेक्ट करें।',
        chatGreeting: '👋 नमस्ते! मैं आपका कृषि AI सहायक हूँ। मुझसे फसल, बीमारी या खेती के बारे में कुछ भी पूछें!',
        chatPlaceholder: 'बीमारियों या खेती के बारे में पूछें...',
        iotDry: 'बहुत सूखा', iotDryRec: '🚨 मिट्टी की नमी कम है! फसल को सूखने से बचाने के लिए तुरंत सिंचाई शुरू करें।',
        iotOpt: 'अनुकूल', iotOptRec: '✅ अधिकांश फसलों के लिए मिट्टी की नमी आदर्श स्तर पर है। किसी कार्रवाई की आवश्यकता नहीं।',
        iotWet: 'बहुत गीला', iotWetRec: '⚠️ मिट्टी संतृप्त है। जड़ सड़न से बचने के लिए सिंचाई रोकें और उचित जल निकासी सुनिश्चित करें।'
    },
    kn: {
        navHome: 'ಹೋಮ್', navDetect: 'ಗುರುತಿಸಿ', navCrops: 'ಬೆಳೆಗಳು', navScan: 'ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
        heroBadge: '🌱 AI-ಚಾಲಿತ ಕೃಷಿ',
        heroTitle1: 'ಆರೋಗ್ಯಕರ ಬೆಳೆಗಳು', heroTitle2: 'ಉತ್ತಮ ಆದಾಯ',
        heroDesc: 'ಸಸ್ಯ ರೋಗಗಳನ್ನು ತಕ್ಷಣ ಪತ್ತೆಹಚ್ಚಿ ಮತ್ತು ಸರಿಯಾದ ಚಿಕಿತ್ಸೆಗಳನ್ನು ಬೇಗ ಪಡೆಯಿರಿ.',
        heroBtn1: '📸 ನಿಮ್ಮ ಬೆಳೆ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
        statCrops: 'ಬೆಳೆಗಳು', statDiseases: 'ರೋಗಗಳು', statLangs: 'ಭಾಷೆಗಳು',
        statAdvice: 'ಸಲಹೆ', statFocus: 'ಗಮನ',
        selectLang: 'ನಿಮ್ಮ ಭಾಷೆ ಆಯ್ಕೆ ಮಾಡಿ',
        doThisFirst: 'ಮೊದಲು ಇದನ್ನು ಮಾಡಿ',
        qaScanLeaf: 'ಎಲೆ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ', qaScanSub: 'ರೋಗಗಳನ್ನು ತಕ್ಷಣ ಪತ್ತೆಹಚ್ಚಿ',
        qaIoT: 'IoT ಮಾನಿಟರ್', qaIoTSub: 'ಲೈವ್ ಮಣ್ಣಿನ ಡೇಟಾ',
        qaChat: 'AI ಚಾಟ್', qaChatSub: 'ತಜ್ಞರನ್ನು ಕೇಳಿ',
        secFeaturesTitle: 'ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಪರಿಕರಗಳು',
        secFeaturesDesc: 'ಉತ್ತಮ ಕೃಷಿ ನಿರ್ಧಾರಗಳಿಗೆ ಎಲ್ಲವೂ — AI ಚಾಲಿತ.',
        featDetect: 'ರೋಗ ಪತ್ತೆಹಚ್ಚಿ', featDetectDesc: 'ತಕ್ಷಣ AI ರೋಗ ನಿರ್ಣಯಕ್ಕಾಗಿ ಎಲೆಗಳನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ.',
        featMonitor: 'ಸ್ಮಾರ್ಟ್ ಮಾನಿಟರ್', featMonitorDesc: 'ಲೈವ್ ಮಣ್ಣಿನ ತೇವಾಂಶ ಟ್ರ್ಯಾಕಿಂಗ್.',
        todayTip: 'ಇಂದಿನ ಸಲಹೆ',
        workflowTitle: 'ಸರಳ 3-ಹಂತದ ಕ್ರಮ', workflowSubtitle: 'ನಿಮಿಷಗಳಲ್ಲಿ ಉತ್ತಮ ಕೃಷಿಯತ್ತ ನಿಮ್ಮ ಪ್ರಯಾಣ ಪ್ರಾರಂಭಿಸಿ',
        step1Title: 'ಬೆಳೆ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ', step1Desc: 'ನಿಮ್ಮ ಫೋನ್ ಕ್ಯಾಮೆರಾದಿಂದ ಸ್ಪಷ್ಟ ಎಲೆ ಫೋಟೋ ತೆಗೆಯಿರಿ.',
        step2Title: 'ರೋಗ ವರದಿ ಪರಿಶೀಲಿಸಿ', step2Desc: 'ವಿಶ್ವಾಸ ಸ್ಕೋರ್ ಮತ್ತು ಚಿಕಿತ್ಸಾ ಯೋಜನೆ ತಕ್ಷಣ ಪಡೆಯಿರಿ.',
        step3Title: 'ಕ್ರಮ ಕೈಗೊಳ್ಳಿ', step3Desc: 'ಸಾವಯವ/ರಾಸಾಯನಿಕ ಮಾರ್ಗದರ್ಶನ ಮತ್ತು ಉತ್ಪನ್ನಗಳನ್ನು ಬಳಸಿ.',
        back: '← ಹಿಂದೆ', pageDetect: 'ರೋಗ ಪತ್ತೆಹಚ್ಚುವಿಕೆ',
        uploadTitle: 'ಎಲೆ ಚಿತ್ರ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ', uploadDrag: 'ಇಲ್ಲಿ ಎಳೆದು ಬಿಡಿ ಅಥವಾ ಬ್ರೌಸ್ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ',
        uploadFormats: 'JPG / PNG ಬೆಂಬಲಿತ', uploadHint: 'ನಿಮ್ಮ ಕ್ಯಾಮೆರಾ ಬಳಸಿ ಅಥವಾ ಸಾಧನದಿಂದ ಎಲೆ ಚಿತ್ರ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.',
        btnTakePhoto: '📸 ಫೋಟೋ ತೆಗೆಯಿರಿ', btnChoosePhoto: '📂 ಫೋಟೋ ಆಯ್ಕೆ ಮಾಡಿ',
        retake: 'ಮತ್ತೆ ತೆಗೆಯಿರಿ', analyze: 'ಈಗ ವಿಶ್ಲೇಷಿಸಿ',
        scanStepsTitle: '🔍 ರೋಗ ಸ್ಕ್ಯಾನ್ ಹಂತಗಳು',
        scanStep1: 'ಫೈಲ್ ಆಯ್ಕೆ ಮಾಡಿ ಕ್ಲಿಕ್ ಮಾಡಿ ಮತ್ತು ಬೆಳೆ ಎಲೆ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
        scanStep2: 'ರೋಗ ವರದಿಗಾಗಿ ಈಗ ವಿಶ್ಲೇಷಿಸಿ ಟ್ಯಾಪ್ ಮಾಡಿ',
        scanStep3: 'ಚಿಕಿತ್ಸೆ ಮತ್ತು ತಡೆಗಟ್ಟುವಿಕೆ ಸಲಹೆಗಳನ್ನು ಅನುಸರಿಸಿ',
        photoTipsTitle: '📸 ಉತ್ತಮ ಫೋಟೋ ಸಲಹೆಗಳು',
        tip1: 'ಉತ್ತಮ ನೈಸರ್ಗಿಕ ಬೆಳಕು', tip2: 'ಎಲೆಯಿಂದ ಫ್ರೇಮ್ ತುಂಬಿಸಿ',
        tip3: 'ಚಲನೆ ಮಸಕು ತಪ್ಪಿಸಿ', tip4: 'ಪ್ರಭಾವಿತ ಪ್ರದೇಶ ಸ್ಪಷ್ಟವಾಗಿ ತೋರಿಸಿ',
        iotTitle: 'IoT ಸ್ಮಾರ್ಟ್ ಮಾನಿಟರ್', iotSoilMoisture: 'ಮಣ್ಣಿನ ತೇವಾಂಶ',
        fetching: 'ಪಡೆಯಲಾಗುತ್ತಿದೆ...', lastUpdated: 'ಕೊನೆಯ ನವೀಕರಣ:',
        iotAIRec: 'AI ಶಿಫಾರಸು', iotOptRange: 'ಸೂಕ್ತ ವ್ಯಾಪ್ತಿ',
        iotConn: 'ಸಂಪರ್ಕ', iotLive: 'ಲೈವ್',
        iotMinToday: 'ಇಂದಿನ ಕನಿಷ್ಠ', iotMaxToday: 'ಇಂದಿನ ಗರಿಷ್ಠ',
        iotAverage: 'ಸರಾಸರಿ', iotReadings: 'ರೀಡಿಂಗ್‌ಗಳು',
        iotChartTitle: 'ಲೈವ್ ತೇವಾಂಶ ಇತಿಹಾಸ', iotLast20: 'ಕಡೆಯ 20 ರೀಡಿಂಗ್‌ಗಳು',
        iotWeather: 'ಹೊಲದ ಹವಾಮಾನ', iotDetectLoc: 'ಸ್ಥಳ ಪತ್ತೆಹಚ್ಚಲಾಗುತ್ತಿದೆ...',
        iotRefreshWeather: '🔄 ಹವಾಮಾನ ರಿಫ್ರೆಶ್ ಮಾಡಿ',
        iotSoilHealth: 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಸ್ಕೋರ್', iotWaiting: 'ಕಾಯಲಾಗುತ್ತಿದೆ...',
        iotConnectSensor: 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಸ್ಕೋರ್ ಪಡೆಯಲು ಸೆನ್ಸರ್ ಸಂಪರ್ಕಿಸಿ.',
        chatGreeting: '👋 ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಕೃಷಿ AI ಸಹಾಯಕ. ಬೆಳೆ, ರೋಗ ಅಥವಾ ಕೃಷಿಯ ಬಗ್ಗೆ ಏನಾದರೂ ಕೇಳಿ!',
        chatPlaceholder: 'ರೋಗ ಅಥವಾ ಕೃಷಿಯ ಬಗ್ಗೆ ಕೇಳಿ...',
        iotDry: 'ತುಂಬಾ ಒಣಗಿದೆ', iotDryRec: '🚨 ಮಣ್ಣಿನ ತೇವಾಂಶ ಕಡಿಮೆಯಾಗಿದೆ! ಬೆಳೆ ಒಣಗುವುದನ್ನು ತಡೆಯಲು ತಕ್ಷಣ ನೀರಾವರಿ ಪ್ರಾರಂಭಿಸಿ.',
        iotOpt: 'ಸೂಕ್ತ', iotOptRec: '✅ ಹೆಚ್ಚಿನ ಬೆಳೆಗಳಿಗೆ ಮಣ್ಣಿನ ತೇವಾಂಶವು ಆದರ್ಶ ಮಟ್ಟದಲ್ಲಿದೆ. ಯಾವುದೇ ಕ್ರಮದ ಅಗತ್ಯವಿಲ್ಲ.',
        iotWet: 'ತುಂಬಾ ಒದ್ದೆ', iotWetRec: '⚠️ ಮಣ್ಣು ಸ್ಯಾಚುರೇಟೆಡ್ ಆಗಿದೆ. ಬೇರು ಕೊಳೆಯುವುದನ್ನು ತಡೆಯಲು ನೀರಾವರಿ ನಿಲ್ಲಿಸಿ ಮತ್ತು ಸರಿಯಾದ ಒಳಚರಂಡಿಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.'
    }
};

const LANG_META = {
    en: { flag: '🌐', name: 'English' },
    hi: { flag: '🇮🇳', name: 'हिन्दी (Hindi)' },
    kn: { flag: '🇮🇳', name: 'ಕನ್ನಡ (Kannada)' }
};

/* --- Core Initialization --- */
window.addEventListener('load', () => {
    applyLanguage(AppState.currentLang);
    updateChatSystemPrompt(AppState.currentLang);
    initApp();
    setupPhotoButtons();
});

function initApp() {
    checkAuth();
    attachProfileButtons();

    // Navigation listener
    window.addEventListener('scroll', () => {
        document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });

    // Initial Data
    renderDailyTip();
    updateMetrics();
}

function attachProfileButtons() {
    document.querySelectorAll('.nav-profile-btn, .mobile-profile-btn').forEach(btn => {
        btn.addEventListener('click', openProfile);
        if (!btn.hasAttribute('type')) btn.setAttribute('type', 'button');
    });
}

/* --- Navigation System --- */
function navigateTo(screenId) {
    const screens = document.querySelectorAll('.screen');
    const target = document.getElementById(screenId);
    
    if (!target) return;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Cleanup current
    if (AppState.currentScreen === 'screenDiseaseDetect' && screenId !== 'screenResult') {
        if(typeof stopCamera === 'function') stopCamera();
    }

    screens.forEach(s => {
        s.classList.remove('active', 'entering');
    });

    // Staggered entrance for grid items
    const gridItems = target.querySelectorAll('.feat-card, .float-card, .form-glass, .product-card, .result-card');
    gridItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });

    target.classList.add('active', 'entering');
    AppState.previousScreen = AppState.currentScreen;
    AppState.currentScreen = screenId;

    // Update Nav UI
    document.querySelectorAll('.nav-link, .bottom-nav-link').forEach(l => {
        l.classList.toggle('active', l.getAttribute('data-screen') === screenId);
    });

    // Vibrate on navigation (mobile)
    if (window.navigator.vibrate) {
        window.navigator.vibrate(50);
    }

    // Sub-initializers
    if (screenId === 'screenDiseaseDetect') initUploadZone();
    if (screenId === 'screenIoT') startIoTMonioting();
    else stopIoTMonioting();
}

function goBackFromResult() {
    if (AppState.resultSource === 'disease') navigateTo('screenDiseaseDetect');
    else navigateTo('screenHome');
}

/* --- i18n Logic --- */
function setLanguage(lang) {
    AppState.currentLang = lang;
    localStorage.setItem('agri-lang', lang);
    applyLanguage(lang);
    closeLangMenu();
    updateChatSystemPrompt(lang);
    
    // Auto-refresh disease result if currently shown to trigger translation in new language
    // We cannot automatically re-run AI inference without the user knowing, so we just clear it or let it be.
    // However, updating the chat greeting is a good idea.
    if (typeof chatHistory !== 'undefined' && chatHistory.length <= 1) {
        clearChat();
    }
    
    // Refresh dynamic content instantly
    if (AppState.currentScreen === 'screenIoT' && typeof fetchIoTData === 'function') {
        fetchIoTData();
    }
}

function applyLanguage(lang) {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    
    // Elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) el.textContent = dict[key];
    });

    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[key]) el.placeholder = dict[key];
    });

    // Update dynamic elements like chat input
    const chatInput = document.getElementById('chatInput');
    if (chatInput && dict['chatPlaceholder']) {
        chatInput.placeholder = dict['chatPlaceholder'];
    }

    // Sync voice assistant language if available
    const voiceLangMap = {
        'en': 'en-US',
        'hi': 'hi-IN',
        'kn': 'kn-IN'
    };
    if (typeof currentVoiceLang !== 'undefined') {
        currentVoiceLang = voiceLangMap[lang] || 'en-US';
        if (typeof updateVoiceSuggestions === 'function') updateVoiceSuggestions();
    }

    // Update Selector
    const meta = LANG_META[lang];
    if (meta) {
        const langCodeEl = document.getElementById('langCode');
        if (langCodeEl) langCodeEl.textContent = meta.name;
        
        const langIconEl = document.querySelector('.lang-icon');
        if (langIconEl) langIconEl.textContent = meta.flag;
    }

    // Update active dropdown item
    document.querySelectorAll('.lang-opt').forEach(opt => {
        const optLang = opt.getAttribute('onclick').match(/'([^']+)'/)[1];
        opt.classList.toggle('active', optLang === lang);
    });
}

function toggleLangMenu() {
    const d = document.getElementById('langDropdown');
    if (d) d.classList.toggle('show');
}

function closeLangMenu() {
    const d = document.getElementById('langDropdown');
    if (d) d.classList.remove('show');
}

/* --- Upload Zone (Desktop) --- */
function initUploadZone() {
    const zone = document.getElementById('cameraArea');
    if (!zone || zone._dragReady) return;
    zone._dragReady = true;

    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.style.borderColor = 'var(--g-400)';
        zone.style.background = 'rgba(62,175,96,0.08)';
    });
    zone.addEventListener('dragleave', () => {
        zone.style.borderColor = '';
        zone.style.background = '';
    });
    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.style.borderColor = '';
        zone.style.background = '';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            loadImageFile(file);
        }
    });
}

function loadImageFile(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = document.getElementById('imagePreview');
        img.src = event.target.result;
        img.style.display = 'block';
        document.getElementById('cameraPlaceholder').style.display = 'none';
        showAnalyzeControls();
    };
    reader.readAsDataURL(file);
    // Store file reference for form submission
    AppState.selectedFile = file;
}

/* --- Upload Logic --- */
function showAnalyzeControls() {
    document.getElementById('uploadControls').classList.add('hidden');
    document.getElementById('analyzeControls').classList.remove('hidden');
}

function setupPhotoButtons() {
    const chooseBtn = document.getElementById('choosePhotoBtn');
    const hint = document.getElementById('uploadHintText');

    if (chooseBtn) chooseBtn.style.display = 'block';
    if (hint) hint.textContent = 'Click to browse files from your computer.';
}

function triggerUpload() {
    const input = document.getElementById('fileInput');
    if (!input) return;
    input.click();
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    loadImageFile(file);
}

function showAnalyzeControls() {
    document.getElementById('uploadControls').classList.add('hidden');
    document.getElementById('analyzeControls').classList.remove('hidden');
}

function retakePhoto() {
    resetDetection();
}

function resetDetection() {
    const img = document.getElementById('imagePreview');
    img.style.display = 'none';
    img.src = '';
    AppState.selectedFile = null;
    document.getElementById('cameraPlaceholder').style.display = 'flex';
    document.getElementById('uploadControls').classList.remove('hidden');
    document.getElementById('analyzeControls').classList.add('hidden');
    const chooseBtn = document.getElementById('choosePhotoBtn');
    if (chooseBtn) chooseBtn.style.display = 'block';
    document.getElementById('fileInput').value = '';
    const cameraInput = document.getElementById('cameraInput');
    if (cameraInput) cameraInput.value = '';
}


/* =====================================================
    BACKEND INTEGRATION — Real Flask API
    ===================================================== */
// Resolve API base from (in order): injected runtime config, meta tag, or same-origin
const API_BASE = (typeof window.API_BASE !== 'undefined' && window.API_BASE) ||
     (typeof window.__API_BASE__ !== 'undefined' && window.__API_BASE__) ||
     document.querySelector('meta[name="api-base"]')?.content ||
     (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://127.0.0.1:5000' : '');



/* Get image file — always use original file to preserve quality */
function getCurrentImageFile() {
    return new Promise((resolve, reject) => {
        if (AppState.selectedFile) {
            return resolve(AppState.selectedFile);
        }
        const fi = document.getElementById('fileInput');
        if (fi && fi.files && fi.files[0]) {
            return resolve(fi.files[0]);
        }
        reject(new Error('No image source available'));
    });
}

/* Main analyze function */
async function analyzeImage() {
    const imgEl = document.getElementById('imagePreview');
    if (!imgEl || !imgEl.src || imgEl.style.display === 'none') {
        alert('Please take or upload a photo first.');
        return;
    }

    if (!navigator.onLine) {
        alert('No internet connection. Please connect to the internet to analyze the image.');
        return;
    }

    showLoading('Analyzing crop health with AI...');
    try {
        const file = await getCurrentImageFile();
        const fd = new FormData();
        fd.append('image', file);
        
        // ADD LANGUAGE
        const plainLangName = AppState.currentLang === 'hi' ? 'Hindi' : AppState.currentLang === 'kn' ? 'Kannada' : 'English';
        fd.append('language', plainLangName);

        const res = await fetch(`${API_BASE}/detect`, { method:'POST', body:fd });
        const data = await res.json();
        hideLoading();

        AppState.resultSource = 'disease';
        if (res.ok && data.status === 'clear' && data.prediction_results) {
            renderRealDiseaseResult(data);
        } else if (data.status === 'blurry') {
            renderBlurryResult(data.message || 'Image is too blurry. Please retake.');
        } else {
            renderErrorResult(data.error || 'Analysis failed. Please try again.');
        }
        navigateTo('screenResult');
    } catch(err) {
        hideLoading();
        renderErrorResult('Server unreachable. Please check your connection and try again.');
    }
}


function renderRealDiseaseResult(data) {
    const pr = data.prediction_results;
    const disease = pr.disease;
    const conf = pr.confidence;
    const isHealthy = disease === 'Healthy';
    const emoji = isHealthy ? '✅' : '🍂';
    const type = isHealthy ? 'success' : 'danger';

    let advisoryHtml = '';
    try {
        const g = JSON.parse(data.guidance);
        advisoryHtml = `
            <div class="advisory-grid">
                <div class="advisory-card advisory-recovery">
                    <div class="advisory-icon">⚡</div>
                    <h4>Quick Recovery</h4>
                    <ul>${g.recovery.map(i => `<li>${i}</li>`).join('')}</ul>
                </div>
                <div class="advisory-card advisory-organic">
                    <div class="advisory-icon">🌿</div>
                    <h4>Organic Cure</h4>
                    <ul>${g.organic.map(i => `<li>${i}</li>`).join('')}</ul>
                </div>
                <div class="advisory-card advisory-chemical">
                    <div class="advisory-icon">🧪</div>
                    <h4>Chemical Info</h4>
                    <ul>${g.chemical.map(i => `<li>${i}</li>`).join('')}</ul>
                </div>
                <div class="advisory-card advisory-prevention">
                    <div class="advisory-icon">🛡️</div>
                    <h4>Prevention</h4>
                    <ul>${g.prevention.map(i => `<li>${i}</li>`).join('')}</ul>
                </div>
            </div>
        `;
    } catch (e) {
        // Fallback to plain text if JSON parsing fails
        advisoryHtml = `<div class="result-card"><div class="result-card-header">🌿 AI Advisory</div><div class="result-card-body" style="white-space:pre-wrap">${data.guidance}</div></div>`;
    }

    const body = document.getElementById('resultBody');
    const title = document.getElementById('resultTitle');
    title.textContent = isHealthy ? 'Analysis Complete' : 'Disease Detected';

    body.innerHTML = `
        <div class="result-hero result-${type}">
            <div class="result-emoji">${emoji}</div>
            <div class="result-name">${disease}</div>
            <div class="result-confidence">${conf}% Confidence</div>
        </div>
        
        <div class="result-card" style="margin:1rem 0">
            <div class="result-card-header">📊 Analysis Metrics</div>
            <div class="result-card-body">
                <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem">
                    <span>AI Confidence:</span>
                    <span style="font-weight:700; color:var(--g-600)">${conf}%</span>
                </div>
                <div style="background:rgba(0,0,0,0.05); border-radius:10px; height:8px; overflow:hidden; margin-bottom:1rem">
                    <div style="height:100%; width:${conf}%; background:var(--g-500)"></div>
                </div>
                
                <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem">
                    <span>Soil Moisture (IoT):</span>
                    <span style="font-weight:700; color:var(--accent-sky)">${AppState.lastMoisture || 0}%</span>
                </div>
                <div style="background:rgba(0,0,0,0.05); border-radius:10px; height:8px; overflow:hidden">
                    <div style="height:100%; width:${AppState.lastMoisture || 0}%; background:var(--accent-sky)"></div>
                </div>
            </div>
        </div>

        <h3 style="margin: 2rem 0 1rem; color: var(--n-900); font-weight: 800;">Expert Treatment Plan</h3>
        ${advisoryHtml}

        <div style="margin-top: 2rem; display: flex; flex-direction: column; gap: 0.75rem;">
            <button class="btn-glow btn-full" style="width:100%" onclick="navigateTo('screenDiseaseDetect')">Scan Another Leaf</button>
            <button class="btn-ghost btn-full" style="width:100%" onclick="navigateTo('screenHome')">Back to Home</button>
        </div>
    `;
}


function renderBlurryResult(msg) {
    const body = document.getElementById('resultBody');
    document.getElementById('resultTitle').textContent = 'Image Quality Issue';
    body.innerHTML = `
        <div class="result-hero result-danger">
            <div class="result-emoji">⚠️</div>
            <div class="result-name">Image Too Blurry</div>
            <div class="result-confidence">${msg}</div>
        </div>
        <div class="result-card">
            <div class="result-card-header">💡 Tips for a better photo</div>
            <div class="result-card-body"><ul>
                <li>Hold your phone steady</li>
                <li>Ensure good lighting</li>
                <li>Get close to the leaf (15-20 cm)</li>
                <li>Tap on the leaf to focus before shooting</li>
            </ul></div>
        </div>
        <button class="btn-glow btn-full" style="margin-top:1.5rem;width:100%" onclick="navigateTo('screenDiseaseDetect')">Try Again</button>
    `;
}

function renderErrorResult(msg) {
    const body = document.getElementById('resultBody');
    document.getElementById('resultTitle').textContent = 'Error';
    body.innerHTML = `
        <div class="result-hero result-danger">
            <div class="result-emoji">❌</div>
            <div class="result-name">Analysis Failed</div>
            <div class="result-confidence">${msg}</div>
        </div>
        <button class="btn-glow btn-full" style="margin-top:1.5rem;width:100%" onclick="navigateTo('screenDiseaseDetect')">Try Again</button>
    `;
}



/* --- Crop recommendation feature removed --- */

function updateTempDisplay(v) {
    const el = document.getElementById('tempValue');
    if (el) el.textContent = v;
}

function toggleMobileMenu() {
    const drawer = document.getElementById('mobDrawer');
    const overlay = document.getElementById('mobOverlay');
    const isOpen = drawer.style.right === '0px';

    if (isOpen) {
        drawer.style.right = '-300px';
        overlay.classList.add('hidden');
        document.body.style.overflow = '';
    } else {
        drawer.style.right = '0px';
        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function renderDailyTip() {
    const tips = ["Water crops early morning", "Rotate crops each season", "Use organic compost", "Check soil pH regularly"];
    const el = document.getElementById('dailyTip');
    if (el) el.textContent = tips[new Date().getDate() % tips.length];
}

function initVoiceAssistant() {
    // Initialize voice assistant with default language
    updateVoiceSuggestions();
    // Reset voice state
    if (window.recognition) {
        window.recognition.stop();
    }
    
    // Only reset elements if they exist (screen is active)
    const transcriptEl = document.getElementById('voiceTranscript');
    const responseEl = document.getElementById('voiceResponse');
    const voiceBtnEl = document.getElementById('voiceBtn');
    
    if (transcriptEl) transcriptEl.textContent = 'Click the microphone to start speaking...';
    if (responseEl) responseEl.textContent = '';
    if (voiceBtnEl) voiceBtnEl.classList.remove('active');
}



/* --- Helpers --- */
function showLoading(txt) {
    const overlay = document.getElementById('loadingOverlay');
    document.getElementById('loadingText').textContent = txt;
    overlay.classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.add('hidden');
}

function renderDailyTip() {
    const tips = ["Water crops early morning", "Rotate crops each season", "Use organic compost", "Check soil pH regularly"];
    const el = document.getElementById('dailyTip');
    if (el) el.textContent = tips[new Date().getDate() % tips.length];
}

function updateMetrics() {
    const m = { temp: '28°C', humid: '65%', moist: '42%' };
    const elTemp = document.getElementById('mTemp');
    if (elTemp) elTemp.textContent = m.temp;
    const elHumid = document.getElementById('mHumid');
    if (elHumid) elHumid.textContent = m.humid;
    const elMoist = document.getElementById('mMoist');
    if (elMoist) elMoist.textContent = m.moist;
}

// Global escape listener
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        hideLoading();
        closeLangMenu();

    }
});



/* --- Voice Assistant Functionality --- */

// Voice Assistant State
let voiceRecognition = null;
let isListening = false;
let currentVoiceLang = 'en-US';

// Language mappings for speech recognition and synthesis
const VOICE_LANGUAGES = {
    'en-US': { name: 'English', recognition: 'en-US', synthesis: 'en-US' },
    'hi-IN': { name: 'Hindi', recognition: 'hi-IN', synthesis: 'hi-IN' },
    'kn-IN': { name: 'Kannada', recognition: 'kn-IN', synthesis: 'kn-IN' }
};

// Initialize voice assistant when navigating to voice screen
if (typeof navigateTo !== 'undefined') {
    const originalNavigateTo2 = navigateTo;
    navigateTo = function(screenId) {
        originalNavigateTo2(screenId);
        if (screenId === 'screenVoiceAssistant') {
            initializeVoiceAssistant();
        }
    };
}

function initializeVoiceAssistant() {
    // Set initial language based on app language
    const langSelect = document.getElementById('voiceLangSelect');
    if (langSelect) {
        langSelect.value = currentVoiceLang;
        updateVoiceSuggestions();
    }
}

function changeVoiceLanguage() {
    const langSelect = document.getElementById('voiceLangSelect');
    currentVoiceLang = langSelect.value;
    updateVoiceSuggestions();
    
    // Stop current recognition if running
    if (isListening) {
        stopVoiceRecognition();
    }
}

function updateVoiceSuggestions() {
    const suggestions = document.getElementById('voiceSuggestions');
    if (!suggestions) return;
    const lang = VOICE_LANGUAGES[currentVoiceLang];
    
    let suggestionTexts = [];
    
    if (currentVoiceLang === 'en-US') {
        suggestionTexts = [
            'What diseases affect tomato plants?',
            'How to treat powdery mildew?',
            'What is the weather forecast for farming?',
            'How can I improve soil health?'
        ];
    } else if (currentVoiceLang === 'hi-IN') {
        suggestionTexts = [
            'टमाटर के पौधों को कौन सी बीमारियाँ होती हैं?',
            'पाउडरी मिल्ड्यू का इलाज कैसे करें?',
            'खेती के लिए मौसम का पूर्वानुमान?',
            'मिट्टी के स्वास्थ्य को कैसे बेहतर बनाया जाए?'
        ];
    } else if (currentVoiceLang === 'kn-IN') {
        suggestionTexts = [
            'ಟೊಮೆಟೊ ಸಸ್ಯಗಳಿಗೆ ಯಾವ ರೋಗಗಳು ಬರುತ್ತವೆ?',
            'ಪೌಡರಿ ಮಿಲ್ಡ್ಯೂವನ್ನು ಹೇಗೆ ಚಿಕಿತ್ಸಿಸುವುದು?',
            'ಕೃಷಿಗಾಗಿ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ?',
            'ಮಣ್ಣಿನ ಆರೋಗ್ಯವನ್ನು ಹೇಗೆ ಸುಧಾರಿಸಬಹುದು?'
        ];
    }
    
    suggestions.innerHTML = suggestionTexts.map(text => 
        `<button class="suggestion-btn" onclick="speakSuggestion('${text}')">${text}</button>`
    ).join('');
}

function speakSuggestion(text) {
    // Set the transcript
    document.getElementById('userTranscript').textContent = text;
    
    // Process the query
    processVoiceQuery(text);
}

function toggleVoiceRecognition() {
    if (isListening) {
        stopVoiceRecognition();
    } else {
        startVoiceRecognition();
    }
}

function startVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
        return;
    }

    // Stop any existing recognition
    if (voiceRecognition) {
        voiceRecognition.stop();
    }

    // Create new recognition instance
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    voiceRecognition = new SpeechRecognition();
    
    // Configure recognition
    voiceRecognition.lang = currentVoiceLang;
    voiceRecognition.continuous = false;
    voiceRecognition.interimResults = false;
    voiceRecognition.maxAlternatives = 1;

    voiceRecognition.onstart = function() {
        isListening = true;
        updateVoiceUI();
        document.getElementById('voiceStatus').textContent = 'Listening... Speak now';
    };

    voiceRecognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById('userTranscript').textContent = transcript;
        
        // Process the voice query
        processVoiceQuery(transcript);
    };

    voiceRecognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        document.getElementById('voiceStatus').textContent = 'Error: ' + event.error;
        stopVoiceRecognition();
    };

    voiceRecognition.onend = function() {
        isListening = false;
        updateVoiceUI();
        if (!document.getElementById('userTranscript').textContent) {
            document.getElementById('voiceStatus').textContent = 'Click the microphone to start speaking';
        }
    };

    try {
        voiceRecognition.start();
    } catch (error) {
        console.error('Failed to start speech recognition:', error);
        document.getElementById('voiceStatus').textContent = 'Failed to start voice recognition';
    }
}

function stopVoiceRecognition() {
    if (voiceRecognition) {
        voiceRecognition.stop();
    }
    isListening = false;
    updateVoiceUI();
}

function updateVoiceUI() {
    const voiceBtn = document.getElementById('voiceBtn');
    const voiceAnim = document.getElementById('voiceAnim');
    const voiceBtnIcon = document.getElementById('voiceBtnIcon');
    const voiceBtnText = document.getElementById('voiceBtnText');
    
    if (isListening) {
        voiceBtn.classList.add('listening');
        voiceAnim.classList.add('listening');
        voiceBtnIcon.textContent = '⏹️';
        voiceBtnText.textContent = 'Stop Listening';
    } else {
        voiceBtn.classList.remove('listening');
        voiceAnim.classList.remove('listening');
        voiceBtnIcon.textContent = '🎤';
        voiceBtnText.textContent = 'Start Listening';
    }
}

function processVoiceQuery(query) {
    const responseElement = document.getElementById('aiResponse');
    responseElement.textContent = 'Processing your question...';
    
    // Convert query to lowercase for easier matching
    const lowerQuery = query.toLowerCase();
    
    let response = '';
    
    // Disease-related queries
    if (lowerQuery.includes('disease') || lowerQuery.includes('बीमारी') || lowerQuery.includes('ರೋಗ')) {
        if (lowerQuery.includes('tomato') || lowerQuery.includes('टमाटर') || lowerQuery.includes('ಟೊಮೆಟೊ')) {
            response = getDiseaseInfo('tomato');
        } else if (lowerQuery.includes('potato') || lowerQuery.includes('आलू') || lowerQuery.includes('ಆಲೂಗಡ್ಡೆ')) {
            response = getDiseaseInfo('potato');
        } else {
            response = 'I can help you identify diseases in tomato, potato, and other crops. Please specify which crop you\'re asking about.';
        }
    }
    
    
    // Treatment queries
    else if (lowerQuery.includes('treat') || lowerQuery.includes('treatment') || lowerQuery.includes('इलाज') || lowerQuery.includes('ಚಿಕಿತ್ಸೆ')) {
        if (lowerQuery.includes('mildew') || lowerQuery.includes('powdery') || lowerQuery.includes('मिल्ड्यू') || lowerQuery.includes('ಮಿಲ್ಡ್ಯೂ')) {
            response = 'For powdery mildew, use copper fungicide or neem oil spray. Ensure good air circulation and avoid overhead watering.';
        } else if (lowerQuery.includes('blight') || lowerQuery.includes('ब्लाइट') || lowerQuery.includes('ಬ್ಲೈಟ್')) {
            response = 'For blight, apply copper fungicide and remove affected plant parts. Improve drainage and avoid working with wet plants.';
        } else {
            response = 'I can provide treatment advice for common plant diseases. Please specify the disease you\'re dealing with.';
        }
    }
    
    // Weather queries
    else if (lowerQuery.includes('weather') || lowerQuery.includes('मौसम') || lowerQuery.includes('ಹವಾಮಾನ')) {
        response = 'I can help you understand weather impacts on farming. For current weather data, please check your local weather service or use our weather integration feature.';
    }
    
    // Default response
    else {
        response = 'I\'m here to help with farming questions! You can ask me about plant diseases, treatments, weather, or general farming advice.';
    }
    
    // Speak the response
    speakResponse(response);
    
    // Display the response
    responseElement.textContent = response;
}

function getDiseaseInfo(crop) {
    const diseases = {
        tomato: 'Common tomato diseases include: 1) Bacterial Spot - treat with copper fungicide, 2) Early Blight - use fungicide sprays, 3) Fusarium Wilt - improve drainage and use resistant varieties.',
        potato: 'Common potato diseases include: 1) Late Blight - apply copper fungicide, 2) Early Blight - use preventive fungicide sprays, 3) Potato Scab - maintain proper soil pH.'
    };
    
    return diseases[crop] || 'I have information about diseases affecting various crops. Please specify the crop.';
}

function speakResponse(text) {
    if (!('speechSynthesis' in window)) {
        console.log('Speech synthesis not supported');
        return;
    }

    // Stop any ongoing speech
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language for speech synthesis
    utterance.lang = currentVoiceLang;
    
    // Adjust voice settings
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    // Try to find a suitable voice for the language
    const voices = speechSynthesis.getVoices();
    const suitableVoice = voices.find(voice => voice.lang.startsWith(currentVoiceLang.split('-')[0]));
    if (suitableVoice) {
        utterance.voice = suitableVoice;
    }
    
    speechSynthesis.speak(utterance);
}

// Load voices when they become available
if ('speechSynthesis' in window) {
    speechSynthesis.onvoiceschanged = function() {
        console.log('Voices loaded:', speechSynthesis.getVoices().length);
    };
}

/* ================================================
   FLOATING CHATBOT WIDGET — AI-Powered (Groq LLaMA 3)
   ================================================ */

const GROQ_API_KEY = ""; // Set your API key here
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Conversation memory (keeps last 10 turns for context)
let chatHistory = [
    {
        role: "system",
        content: `You are AgriBot, an elite agricultural scientist and field expert embedded in the "Agri AI" platform. 
        
Your mission is to provide definitive, high-accuracy answers to ANY agricultural question. Your knowledge base is vast and covers:
- In-depth crop science, genetics, and variety selection
- Advanced pathology (fungal, bacterial, viral, and physiological disorders)
- Soil chemistry, physics, and restorative biology
- Modern and traditional fertilizer protocols (precision farming vs. organic)
- Hydroponics, aquaponics, and greenhouse climate control
- Global agricultural trends, market economics, and supply chain logistics
- Veterinary basics for farm animals (cattle, poultry, goats, pigs)
- Agricultural engineering, tool maintenance, and automation
        - Sustainable and regenerative practices (no-till, cover cropping, carbon farming)

Rules:
1. AUTHORITY: Speak with the confidence of an expert, but keep it accessible for a farmer.
2. ACCURACY: If a user asks an agricultural question, ANSWER IT FULLY. Do not decline agricultural queries.
3. STRUCTURE: Use markdown-like formatting (bullet points, bold text) for readability.
4. LANGUAGE: You MUST ALWAYS respond entirely in English.
5. LIMITS: STRICTLY DECLINE ANY non-agricultural, non-rural, or programming/coding topics. If asked to write code or about unrelated subjects, refuse and remind the user that you only answer agriculture-related questions.
6. VISUALS: Always start with a relevant emoji. Use '🌿' for general farming, '📸' for detection, '🐮' for livestock, etc.`
    }
];

function updateChatSystemPrompt(lang) {
    if (typeof chatHistory !== 'undefined' && chatHistory[0]) {
        const langName = lang === 'hi' ? 'Hindi' : lang === 'kn' ? 'Kannada' : 'English';
        chatHistory[0].content = `You are AgriBot, an elite agricultural scientist and field expert embedded in the "Agri AI" platform. 
        
Your mission is to provide definitive, high-accuracy answers to ANY agricultural question. Your knowledge base is vast and covers:
- In-depth crop science, genetics, and variety selection
- Advanced pathology (fungal, bacterial, viral, and physiological disorders)
- Soil chemistry, physics, and restorative biology
- Modern and traditional fertilizer protocols (precision farming vs. organic)
- Hydroponics, aquaponics, and greenhouse climate control
- Global agricultural trends, market economics, and supply chain logistics
- Veterinary basics for farm animals (cattle, poultry, goats, pigs)
- Agricultural engineering, tool maintenance, and automation
- Sustainable and regenerative practices (no-till, cover cropping, carbon farming)

Rules:
1. AUTHORITY: Speak with the confidence of an expert, but keep it accessible for a farmer.
2. ACCURACY: If a user asks an agricultural question, ANSWER IT FULLY. Do not decline agricultural queries.
3. STRUCTURE: Use markdown-like formatting (bullet points, bold text) for readability.
4. LANGUAGE: You MUST ALWAYS respond entirely in ${langName}. Do not use English unless the selected language is English.
5. LIMITS: STRICTLY DECLINE ANY non-agricultural, non-rural, or programming/coding topics. If asked to write code or about unrelated subjects, refuse and remind the user that you only answer agriculture-related questions.
6. VISUALS: Always start with a relevant emoji. Use '🌿' for general farming, '📸' for detection, '🐮' for livestock, etc.`;
    }
}

let chatOpen = false;
let chatIsLoading = false;

function toggleChatbot() {
    chatOpen = !chatOpen;
    const panel = document.getElementById('chatPanel');
    const btn = document.getElementById('chatToggleBtn');

    if (!panel) return; // nothing to do

    if (chatOpen) {
        // show with animation
        panel.classList.remove('chat-hidden');
        panel.classList.add('chat-open');
        panel.style.display = 'flex';
        if (btn) {
            btn.textContent = '✕';
            btn.setAttribute('aria-expanded', 'true');
            btn.style.fontSize = '1.2rem';
        }
        const input = document.getElementById('chatInput');
        if (input) input.focus({ preventScroll: true });
        // ensure latest messages visible
        const container = document.getElementById('chatMessages');
        if (container) container.scrollTop = container.scrollHeight;
    } else {
        panel.classList.remove('chat-open');
        panel.classList.add('chat-hidden');
        // keep a short timeout before hiding to allow animation
        setTimeout(() => { panel.style.display = 'none'; }, 260);
        if (btn) {
            btn.textContent = '💬';
            btn.setAttribute('aria-expanded', 'false');
            btn.style.fontSize = '1.6rem';
        }
    }
}

// Start hidden properly
document.addEventListener('DOMContentLoaded', () => {
    const panel = document.getElementById('chatPanel');
    if (panel) {
        panel.classList.add('chat-hidden');
        panel.style.display = 'none';
    }
});

function clearChat() {
    // Reset conversation history (keep only system prompt)
    if (typeof chatHistory !== 'undefined' && chatHistory.length > 0) {
        chatHistory = [chatHistory[0]];
    }

    // Clear messages UI
    const container = document.getElementById('chatMessages');
    const dict = TRANSLATIONS[AppState.currentLang] || TRANSLATIONS.en;
    const greetingMsg = dict.chatGreeting || "👋 Hi! I'm your Agri AI assistant. Ask me anything about crops, diseases, or farming!";
    
    if (container) {
        container.innerHTML = `
            <div class="chat-msg ai-msg">
                ${greetingMsg}
            </div>`;
    }

    // Show suggestions again
    const sugg = document.getElementById('chatSuggestions');
    if (sugg) sugg.style.display = 'flex';
}

function sendChatSuggestion(text) {
    document.getElementById('chatInput').value = text;
    sendChatMessage();
    const sugg = document.getElementById('chatSuggestions');
    if (sugg) sugg.style.display = 'none';
}

async function sendChatMessage() {
    if (chatIsLoading) return;
    const input = document.getElementById('chatInput');
    const msg   = input.value.trim();
    if (!msg) return;
    input.value = '';

    appendChatMsg(msg, 'user');
    chatIsLoading = true;

    // Add to history
    chatHistory.push({ role: 'user', content: msg });
    // Keep history under 22 entries (system + 10 turns)
    if (chatHistory.length > 22) {
        chatHistory = [chatHistory[0], ...chatHistory.slice(-20)];
    }

    // Show animated typing dots
    const typingId = appendTypingIndicator();

    try {
        let reply;
        if (!navigator.onLine) {
            // OFFLINE: use local knowledge
            reply = getLocalFallback(msg);
        } else {
            reply = await callGroqAPI(chatHistory);
        }

        // Add AI reply to history
        chatHistory.push({ role: 'assistant', content: reply });

        removeTypingIndicator(typingId);
        appendChatMsg(reply, 'bot');
    } catch (err) {
        console.error('Chat error:', err);
        removeTypingIndicator(typingId);
        // Try local knowledge first, show a proper error if not found
        const localReply = getLocalFallback(msg, true);
        chatHistory.push({ role: 'assistant', content: localReply });
        appendChatMsg(localReply, 'bot');
    }

    chatIsLoading = false;
}

async function callGroqAPI(messages) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000); // 20s timeout

    try {
        // Call our own Flask backend — no CORS issues, API key stays server-side
        const response = await fetch(`${API_BASE}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages }),
            signal: controller.signal
        });

        clearTimeout(timeout);

        const data = await response.json();

        if (!response.ok || !data.success) {
            console.error('Chat backend error:', data.error || response.status);
            throw new Error(data.error || `Server error ${response.status}`);
        }

        return data.reply;
    } catch (err) {
        clearTimeout(timeout);
        if (err.name === 'AbortError') throw new Error('Request timed out after 20s');
        throw err;
    }
}

function appendTypingIndicator() {
    const container = document.getElementById('chatMessages');
    const id = 'typing-' + Date.now();
    const div = document.createElement('div');
    div.id = id;
    div.className = 'typing-indicator';
    div.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
        <small style="margin-left: 8px; color: var(--n-500); font-weight: 600;">AgriBot is thinking...</small>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return id;
}

function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function appendChatMsg(text, role, isTyping = false) {
    const container = document.getElementById('chatMessages');
    const id = 'msg-' + Date.now() + Math.random().toString(36).slice(2);

    const div = document.createElement('div');
    div.id = id;
    
    if (role === 'user') {
        div.className = 'chat-msg user-msg';
        div.style.cssText = 'background:var(--g-600); color:white; border-radius:18px 18px 4px 18px; padding:12px 16px; font-size:0.95rem; max-width:85%; align-self:flex-end; box-shadow:var(--sh-md);';
        div.textContent = text;
    } else {
        div.className = 'chat-msg ai-msg markdown-body';
        div.style.cssText = 'background:var(--white); color:var(--n-800); border:1px solid var(--border); border-radius:18px 18px 18px 4px; padding:12px 16px; font-size:0.95rem; max-width:90%; align-self:flex-start; box-shadow:var(--sh-sm); line-height:1.6;';
        if (typeof marked !== 'undefined') {
            div.innerHTML = marked.parse(text);
        } else {
            div.style.whiteSpace = 'pre-wrap';
            div.textContent = text;
        }
    }

    if (isTyping) div.style.opacity = '0.6';

    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return id;
}

/* --- Local Advisory Data --- */
const LOCAL_ADVISORY = {
    "Tomato Bacterial Spot": {
        recovery: "70-85% if treated early.",
        organic: "Spray neem oil or copper-based fungicides. Remove infected leaves.",
        chemical: "Use Streptomycin or copper oxychloride sprays.",
        prevention: "Use certified seeds, rotate crops, and avoid overhead irrigation."
    },
    "Tomato Early Blight": {
        recovery: "80-90% with proper fungicide application.",
        organic: "Apply Bacillus subtilis or compost tea. Improve air circulation.",
        chemical: "Use Chlorothalonil or Mancozeb fungicides.",
        prevention: "Rotate crops, mulch soil, and keep foliage dry."
    },
    "Tomato Late Blight": {
        recovery: "Low if widespread; needs immediate action.",
        organic: "Copper sprays and removal of all infected plants.",
        chemical: "Use Ridomil Gold or other systemic fungicides.",
        prevention: "Plant resistant varieties and monitor during humid weather."
    },
    "Tomato Leaf Mold": {
        recovery: "Good in greenhouses with humidity control.",
        organic: "Increase ventilation and reduce humidity. Use vinegar sprays.",
        chemical: "Use Difenoconazole or similar fungicides.",
        prevention: "Ensure high spacing between plants and use drip irrigation."
    },
    "Potato Early Blight": {
        recovery: "High with timely fungicide use.",
        organic: "Use crop rotation and maintain plant vigor with compost.",
        chemical: "Apply Mancozeb or Chlorothalonil.",
        prevention: "Avoid nitrogen deficiency and overhead watering."
    },
    "Potato Late Blight": {
        recovery: "Critical; can destroy crops in days.",
        organic: "Immediate removal of infected plants; copper sprays.",
        chemical: "Use Metalaxyl or Cymoxanil-based products.",
        prevention: "Use healthy tubers and avoid planting near tomatoes."
    },
    "Healthy": {
        recovery: "100% - Maintain current care.",
        organic: "Continue using organic fertilizers and natural pest control.",
        chemical: "No chemical intervention needed.",
        prevention: "Continue monitoring and regular soil testing."
    }
};

/* --- Offline Fallback (when no internet) --- */
function getLocalFallback(q, isApiError = false) {
    const lower = q.toLowerCase();

    for (const [disease, info] of Object.entries(LOCAL_ADVISORY)) {
        if (lower.includes(disease.toLowerCase())) {
            return `🌿 ${disease}:\n• Recovery: ${info.recovery}\n• Organic: ${info.organic}\n• Chemical: ${info.chemical}\n• Prevention: ${info.prevention}`;
        }
    }
    if (lower.includes('organic') || lower.includes('pest')) return '🌿 Organic pest control: Neem oil, garlic spray, yellow sticky traps, Bacillus subtilis, companion planting.';
    if (lower.includes('fertilizer') || lower.includes('npk')) return '🧪 NPK Guide:\n• N (Urea): leaf growth\n• P (DAP): root development\n• K (MOP): fruit quality & disease resistance';
    if (lower.includes('irrigat') || lower.includes('water')) return '💧 Best irrigation: Drip (most efficient), Sprinkler (vegetables), Furrow (row crops). Water early morning.';
    if (lower.match(/^(hi|hello|hey|namaste)/)) return '👋 Hello! I\'m AgriBot — your farming assistant. Ask me anything about crops, diseases, soil, fertilizers, or irrigation!';

    // Default — different message depending on context
    if (!navigator.onLine) {
        return '📴 You\'re offline. Try asking about diseases or treatments — I have some local knowledge available!';
    }
    if (isApiError) {
        return '⚠️ AI service is temporarily unavailable. Try asking about a specific disease name — I can answer from local knowledge!';
    }
    return '🌱 I didn\'t catch that. Try asking something like:\n• "How to treat late blight?"\n• "Organic pest control tips?"\n• "How to improve soil health?"';
}

/* =====================================================
   IOT MONITORING LOGIC
   ===================================================== */

function startIoTMonioting() {
    IoTHistory = [];
    fetchIoTData();
    if (AppState.iotInterval) clearInterval(AppState.iotInterval);
    AppState.iotInterval = setInterval(fetchIoTData, 5000);
    if (!IoTWeatherLoaded) fetchIoTWeather();
}

function stopIoTMonioting() {
    if (AppState.iotInterval) {
        clearInterval(AppState.iotInterval);
        AppState.iotInterval = null;
    }
}

async function fetchIoTData() {
    try {
        const res = await fetch(`${API_BASE}/get_moisture`);
        if (!res.ok) throw new Error('Failed to fetch sensor data');
        const data = await res.json();
        updateIoTUI(data);
    } catch (err) {
        console.error('IoT Fetch Error:', err);
        const connStatus = document.getElementById('connectionStatus');
        if (connStatus) {
            connStatus.textContent = 'Offline';
            connStatus.style.color = 'var(--accent-rose)';
        }
    }
}

function updateIoTUI(data) {
    const moisture = data.moisture || 0;
    const lastUpdated = data.last_updated || '--:--:--';
    
    // Update Value & Last Updated
    const valEl = document.getElementById('moistureValue');
    const updateEl = document.getElementById('lastUpdated');
    const connStatus = document.getElementById('connectionStatus');
    
    if (valEl) valEl.textContent = moisture;
    if (updateEl) updateEl.textContent = lastUpdated;
    if (connStatus) {
        connStatus.textContent = 'Live';
        connStatus.style.color = 'var(--g-600)';
    }

    // Update Gauge
    const circle = document.getElementById('moistureProgress');
    if (circle) {
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (moisture / 100) * circumference;
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = offset;
    }

    // Update Status Badge & Recommendation
    const badge = document.getElementById('moistureStatusBadge');
    const recBox = document.getElementById('iotRecommendation');
    const dict = TRANSLATIONS[AppState.currentLang] || TRANSLATIONS.en;
    
    if (badge) {
        badge.className = 'status-badge'; // reset
        if (moisture < 30) {
            badge.classList.add('status-dry');
            badge.textContent = dict.iotDry || 'Too Dry';
            if (recBox) recBox.textContent = dict.iotDryRec || '🚨 Soil moisture is low! Start irrigation immediately to prevent crop wilting.';
        } else if (moisture >= 30 && moisture <= 75) {
            badge.classList.add('status-good');
            badge.textContent = dict.iotOpt || 'Optimal';
            if (recBox) recBox.textContent = dict.iotOptRec || '✅ Soil moisture is at an ideal level for most crops. No action needed.';
        } else {
            badge.classList.add('status-wet');
            badge.textContent = dict.iotWet || 'Too Wet';
            if (recBox) recBox.textContent = dict.iotWetRec || '⚠️ Soil is saturated. Stop irrigation and ensure proper drainage to avoid root rot.';
        }
    }
    
    AppState.lastMoisture = moisture;

    // Enhanced features
    IoTHistory.push(moisture);
    if (IoTHistory.length > 20) IoTHistory.shift();
    updateIoTStats();
    drawMoistureChart();
    updateHealthScore(moisture);
    updateIoTAlert(moisture);
}

/* =====================================================
   IOT ENHANCED HELPER FUNCTIONS
   ===================================================== */

let IoTHistory = [];
let IoTWeatherLoaded = false;

function updateIoTStats() {
    if (IoTHistory.length === 0) return;
    const min = Math.min(...IoTHistory);
    const max = Math.max(...IoTHistory);
    const avg = Math.round(IoTHistory.reduce((a, b) => a + b, 0) / IoTHistory.length);
    const minEl = document.getElementById('moistureMin');
    const maxEl = document.getElementById('moistureMax');
    const avgEl = document.getElementById('moistureAvg');
    const countEl = document.getElementById('moistureCount');
    if (minEl) minEl.textContent = min;
    if (maxEl) maxEl.textContent = max;
    if (avgEl) avgEl.textContent = avg;
    if (countEl) countEl.textContent = IoTHistory.length;
}

function drawMoistureChart() {
    const canvas = document.getElementById('moistureChart');
    if (!canvas || IoTHistory.length < 2) return;
    const wrap = canvas.parentElement;
    const W = wrap.clientWidth || 400;
    const H = wrap.clientHeight || 120;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, W, H);

    const dryY  = H - (30 / 100) * H;
    const wetY  = H - (75 / 100) * H;

    // Zone backgrounds
    ctx.fillStyle = 'rgba(239,68,68,0.07)';  ctx.fillRect(0, dryY, W, H - dryY);
    ctx.fillStyle = 'rgba(34,197,94,0.07)';  ctx.fillRect(0, wetY, W, dryY - wetY);
    ctx.fillStyle = 'rgba(14,165,233,0.07)'; ctx.fillRect(0, 0, W, wetY);

    // Threshold lines
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(239,68,68,0.35)';  ctx.beginPath(); ctx.moveTo(0,dryY); ctx.lineTo(W,dryY); ctx.stroke();
    ctx.strokeStyle = 'rgba(14,165,233,0.35)'; ctx.beginPath(); ctx.moveTo(0,wetY); ctx.lineTo(W,wetY); ctx.stroke();
    ctx.setLineDash([]);

    const stepX = (IoTHistory.length > 1) ? W / (IoTHistory.length - 1) : W;

    // Gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, 'rgba(3,169,244,0.25)');
    grad.addColorStop(1, 'rgba(3,169,244,0.01)');
    ctx.beginPath();
    IoTHistory.forEach((v, i) => {
        const x = i * stepX, y = H - (v / 100) * H;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();

    // Line
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(3,169,244,0.9)';
    ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    IoTHistory.forEach((v, i) => {
        const x = i * stepX, y = H - (v / 100) * H;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Dots
    IoTHistory.forEach((v, i) => {
        const x = i * stepX, y = H - (v / 100) * H;
        const isLast = i === IoTHistory.length - 1;
        ctx.beginPath();
        ctx.arc(x, y, isLast ? 5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = v < 30 ? '#ef4444' : v > 75 ? '#0ea5e9' : '#22c55e';
        ctx.fill();
        if (isLast) { ctx.strokeStyle = 'white'; ctx.lineWidth = 2; ctx.stroke(); }
    });
}

function updateHealthScore(moisture) {
    let score, grade, tip;
    if (moisture >= 40 && moisture <= 65) {
        score = 90 + Math.round(Math.random() * 9);
        grade = '🌟 Excellent'; tip = 'Perfect moisture balance. Crops are thriving in ideal conditions!';
    } else if (moisture >= 30 && moisture < 40) {
        score = 65 + Math.round((moisture - 30) * 2.5);
        grade = '✅ Good'; tip = 'Slightly low. Consider a light irrigation soon.';
    } else if (moisture > 65 && moisture <= 75) {
        score = 70 + Math.round((75 - moisture) * 2);
        grade = '✅ Good'; tip = 'Slightly above optimal. Ensure good drainage is in place.';
    } else if (moisture < 30) {
        score = Math.max(10, moisture * 2);
        grade = '🔴 Critical'; tip = 'Soil is very dry! Irrigate immediately to prevent crop stress.';
    } else {
        score = Math.max(20, 100 - moisture);
        grade = '⚠️ Poor'; tip = 'Soil oversaturated. Stop watering and check drainage channels.';
    }
    score = Math.min(100, score);

    const scoreEl = document.getElementById('healthScore');
    const gradeEl = document.getElementById('healthGrade');
    const tipEl   = document.getElementById('healthTip');
    const ring    = document.getElementById('healthRingFill');

    if (scoreEl) scoreEl.textContent = score;
    if (gradeEl) {
        gradeEl.textContent = grade;
        gradeEl.className = 'health-grade';
        if (score >= 80) gradeEl.classList.add('grade-excellent');
        else if (score >= 60) gradeEl.classList.add('grade-good');
        else if (score >= 40) gradeEl.classList.add('grade-warn');
        else gradeEl.classList.add('grade-bad');
    }
    if (tipEl) tipEl.textContent = tip;
    if (ring) {
        const circ = 2 * Math.PI * 34;
        ring.style.strokeDasharray  = circ;
        ring.style.strokeDashoffset = circ - (score / 100) * circ;
        ring.style.stroke = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';
    }
}

function updateIoTAlert(moisture) {
    const banner = document.getElementById('iotAlertBanner');
    const icon   = document.getElementById('iotAlertIcon');
    const title  = document.getElementById('iotAlertTitle');
    const msg    = document.getElementById('iotAlertMsg');
    if (!banner) return;
    if (moisture < 20) {
        banner.classList.remove('hidden', 'alert-wet');
        banner.classList.add('alert-dry');
        if (icon)  icon.textContent  = '🚨';
        if (title) title.textContent = 'Critical: Soil Dangerously Dry!';
        if (msg)   msg.textContent   = `Moisture at ${moisture}%. Immediate irrigation required. Crops may wilt within hours.`;
    } else if (moisture > 85) {
        banner.classList.remove('hidden', 'alert-dry');
        banner.classList.add('alert-wet');
        if (icon)  icon.textContent  = '🌊';
        if (title) title.textContent = 'Warning: Soil Waterlogged!';
        if (msg)   msg.textContent   = `Moisture at ${moisture}%. Risk of root rot. Stop irrigation and check drainage.`;
    } else {
        banner.classList.add('hidden');
    }
}

async function fetchIoTWeather() {
    const content = document.getElementById('iotWeatherContent');
    if (!content) return;
    content.innerHTML = '<p style="color:var(--n-400);font-size:0.9rem;text-align:center;padding:1rem 0;">📡 Detecting location...</p>';
    if (!navigator.geolocation) {
        content.innerHTML = '<p style="color:var(--accent-warning);">Geolocation not supported.</p>';
        return;
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        try {
            const res  = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature&timezone=auto`);
            const data = await res.json();
            if (!data.current) throw new Error();
            const c    = data.current;
            const temp = Math.round(c.temperature_2m);
            const feels = Math.round(c.apparent_temperature);
            const hum  = c.relative_humidity_2m;
            const wind = Math.round(c.wind_speed_10m);
            const icons = {0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',48:'🌫️',51:'🌦️',53:'🌦️',55:'🌧️',61:'🌧️',63:'🌧️',65:'⛈️',80:'🌦️',81:'🌧️',82:'⛈️',95:'⛈️'};
            const wIcon = icons[c.weather_code] || '🌍';
            content.innerHTML = `
                <div class="iot-weather-main">
                    <div class="weather-big-icon">${wIcon}</div>
                    <div><div class="weather-temp">${temp}°C</div><div class="weather-feels">Feels like ${feels}°C</div></div>
                </div>
                <div class="iot-weather-stats">
                    <div class="iot-weather-stat"><span>💧</span><span>${hum}%</span><small>Humidity</small></div>
                    <div class="iot-weather-stat"><span>💨</span><span>${wind} km/h</span><small>Wind</small></div>
                    <div class="iot-weather-stat"><span>📍</span><span>${lat.toFixed(2)}°N</span><small>Location</small></div>
                </div>`;
            IoTWeatherLoaded = true;
        } catch (e) {
            content.innerHTML = '<p style="color:var(--accent-warning);">⚠️ Could not load weather.</p>';
        }
    }, () => {
        content.innerHTML = '<p style="color:var(--accent-warning);">⚠️ Location access denied.</p>';
    });
}

/* --- Authentication Logic --- */
let currentAuthMode = 'signup';

function toggleAuthMode(mode) {
    currentAuthMode = mode;
    const nameGroup = document.getElementById('nameGroup');
    const authName = document.getElementById('authName');
    const authTitle = document.getElementById('authTitle');
    const authSubtitle = document.getElementById('authSubtitle');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    
    document.getElementById('btnSignup').classList.toggle('active', mode === 'signup');
    document.getElementById('btnLogin').classList.toggle('active', mode === 'login');
    document.getElementById('authError').textContent = '';

    if (mode === 'login') {
        nameGroup.style.display = 'none';
        authName.removeAttribute('required');
        authTitle.textContent = 'Welcome Back';
        authSubtitle.textContent = 'Login to Agri AI to continue.';
        authSubmitBtn.textContent = 'Login';
    } else {
        nameGroup.style.display = 'block';
        authName.setAttribute('required', 'true');
        authTitle.textContent = 'Create Account';
        authSubtitle.textContent = 'Join Agri AI to continue.';
        authSubmitBtn.textContent = 'Sign Up';
    }
}

function checkAuth() {
    const userStr = localStorage.getItem('agri_active_user') || localStorage.getItem('agri_user');
    const overlay = document.getElementById('authOverlay');
    if (!overlay) return;
    
    if (!userStr) {
        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        toggleAuthMode('signup');
    } else {
        overlay.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

function handleAuth(e) {
    e.preventDefault();
    const phone = document.getElementById('authPhone').value.trim();
    const password = document.getElementById('authPassword').value.trim();
    const errorEl = document.getElementById('authError');
    
    if (phone.length !== 10 || isNaN(phone)) {
        errorEl.textContent = 'Please enter a valid 10-digit phone number.';
        return;
    }
    
    if (password.length < 4) {
        errorEl.textContent = 'Password must be at least 4 characters.';
        return;
    }

    let users = JSON.parse(localStorage.getItem('agri_users_db') || '{}');

    if (currentAuthMode === 'signup') {
        const name = document.getElementById('authName').value.trim();
        if (!name) {
            errorEl.textContent = 'Please enter your full name.';
            return;
        }
        if (users[phone]) {
            errorEl.textContent = 'An account with this phone number already exists. Please login.';
            return;
        }
        
        const joinDate = new Date().toLocaleDateString();
        users[phone] = { name, phone, password, joinDate, location: 'Local Farm' };
        localStorage.setItem('agri_users_db', JSON.stringify(users));
        localStorage.setItem('agri_active_user', JSON.stringify(users[phone]));
    } else {
        // Login
        if (!users[phone]) {
            errorEl.textContent = 'Account not found. Please sign up first.';
            return;
        }
        if (users[phone].password !== password) {
            errorEl.textContent = 'Incorrect password.';
            return;
        }
        localStorage.setItem('agri_active_user', JSON.stringify(users[phone]));
    }
    
    errorEl.textContent = '';
    
    // Close overlay
    const overlay = document.getElementById('authOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

/* --- Profile & Logout --- */
function openProfile() {
    const modal = document.getElementById('profileModal');
    if (!modal) return;

    const userStr = localStorage.getItem('agri_active_user');
    if (!userStr) {
        checkAuth();
        return;
    }

    try {
        const user = JSON.parse(userStr);
        document.getElementById('profileName').textContent = user.name || 'User';
        document.getElementById('profilePhone').textContent = '📱 ' + (user.phone || '');
        
        // Extra info
        const elLoc = document.getElementById('profileLocation');
        if (elLoc) elLoc.textContent = user.location || 'Local Farm';
        
        const elLang = document.getElementById('profileLanguage');
        if (elLang) {
            const langNames = { 'en': 'English', 'hi': 'Hindi', 'kn': 'Kannada' };
            elLang.textContent = langNames[AppState.currentLang] || 'English';
        }
        
        const elDate = document.getElementById('profileDate');
        if (elDate) elDate.textContent = user.joinDate || new Date().toLocaleDateString();
        
    } catch(e) {}

    // Use style.display directly — most reliable on mobile
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeProfile() {
    const modal = document.getElementById('profileModal');
    if (!modal) return;
    modal.style.display = 'none';
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

function logout() {
    localStorage.removeItem('agri_active_user');
    closeProfile();
    checkAuth();
}
