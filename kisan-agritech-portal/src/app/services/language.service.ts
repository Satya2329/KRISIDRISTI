import { Injectable, signal } from '@angular/core';
import { SupportedLanguage, LanguageOption } from '../models/language.model';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  currentLang = signal<SupportedLanguage>('en');

  readonly languages: LanguageOption[] = [
    { code: 'en', label: 'English', state: 'All India' },
    { code: 'hi', label: 'हिन्दी', state: 'North & Central India' },
    { code: 'or', label: 'ଓଡ଼ିଆ', state: 'Odisha' },
    { code: 'bn', label: 'বাংলা', state: 'West Bengal & Tripura' },
    { code: 'te', label: 'తెలుగు', state: 'Andhra Pradesh & Telangana' },
    { code: 'ta', label: 'தமிழ்', state: 'Tamil Nadu' },
    { code: 'mr', label: 'मराठी', state: 'Maharashtra' },
    { code: 'gu', label: 'ગુજરાતી', state: 'Gujarat' },
    { code: 'kn', label: 'ಕನ್ನಡ', state: 'Karnataka' },
    { code: 'ml', label: 'മലയാളം', state: 'Kerala' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ', state: 'Punjab' },
    { code: 'as', label: 'অসমীয়া', state: 'Assam' }
  ];

  private dictionary: Record<SupportedLanguage, Record<string, string>> = {
    en: {
      appName: 'KisanSetu AI',
      tagline: 'Smart Agriculture & Farmer Support Portal',
      login: 'Farmer Login',
      register: 'New Farmer Registration',
      phoneNumber: 'Mobile Number',
      password: 'Password',
      fullName: 'Full Name',
      stateName: 'State / Region',
      cropType: 'Primary Crop (e.g. Rice, Wheat)',
      submitLogin: 'Enter Portal',
      submitRegister: 'Create Account',
      dashboard: 'Dashboard',
      welcome: 'Welcome, Kisan Bandhu',
      aiChatTitle: 'Krishi AI Chat',
      aiChatDesc: 'Consult with an AI agronomist on pests, fertilizers, and weather.',
      imageUploadTitle: 'Crop Disease Scanner',
      imageUploadDesc: 'Diagnose leaf and plant diseases by uploading photos or testing verified samples.',
      voiceTitle: 'Talk with Voice Assistant',
      voiceDesc: 'Speak in your regional language. Hands-free queries directly from your field.',
      openService: 'Launch Service',
      backToDashboard: 'Back to Dashboard',
      logout: 'Sign Out'
    },
    hi: {
      appName: 'किसान सेतु AI',
      tagline: 'स्मार्ट कृषि एवं किसान सहायता पोर्टल',
      login: 'किसान लॉगिन',
      register: 'नया किसान पंजीकरण',
      phoneNumber: 'मोबाइल नंबर',
      password: 'पासवर्ड',
      fullName: 'पूरा नाम',
      stateName: 'राज्य / क्षेत्र',
      cropType: 'मुख्य फसल (जैसे धान, गेहूं)',
      submitLogin: 'पोर्टल में प्रवेश करें',
      submitRegister: 'खाता बनाएं',
      dashboard: 'डैशबोर्ड',
      welcome: 'स्वागत है, किसान बंधु',
      aiChatTitle: 'कृषि AI चैट',
      aiChatDesc: 'कीट, खाद, मिट्टी और मौसम संबंधी सलाह प्राप्त करें।',
      imageUploadTitle: 'फसल रोग स्कैनर',
      imageUploadDesc: 'पत्ती की तस्वीर अपलोड कर या नमूना चुनकर तुरंत फसल रोग की पहचान करें।',
      voiceTitle: 'आवाज सहायक से बात करें',
      voiceDesc: 'खेत में काम करते हुए अपनी भाषा में बोलकर जानकारी प्राप्त करें।',
      openService: 'शुरू करें',
      backToDashboard: 'डैशबोर्ड पर जाएं',
      logout: 'लॉगआउट'
    },
    or: {
      appName: 'କିଷାନ ସେତୁ AI',
      tagline: 'ସ୍ମାର୍ଟ କୃଷି ଓ ଚାଷୀ ସହାୟତା ପୋର୍ଟାଲ',
      login: 'ଚାଷୀ ଲଗଇନ୍',
      register: 'ନୂତନ ଚାଷୀ ପଞ୍ଜୀକରଣ',
      phoneNumber: 'ମୋବାଇଲ୍ ନମ୍ବର',
      password: 'ପାସୱାର୍ଡ',
      fullName: 'ପୂରା ନାମ',
      stateName: 'ରାଜ୍ୟ / ଜିଲ୍ଲା',
      cropType: 'ମୁଖ୍ୟ ଫସଲ (ଯଥା ଧାନ, ମାଣ୍ଡିଆ)',
      submitLogin: 'ପ୍ରବେଶ କରନ୍ତୁ',
      submitRegister: 'ଖାତା ଖୋଲନ୍ତୁ',
      dashboard: 'ଡ୍ୟାସବୋର୍ଡ',
      welcome: 'ସ୍ଵାଗତମ୍, କୃଷକ ବନ୍ଧୁ',
      aiChatTitle: 'କୃଷି AI ଚାଟ୍',
      aiChatDesc: 'ରୋଗ ପୋକ, ସାର ଓ ପାଣିପାଗ ସମ୍ପର୍କରେ AI ବିଶେଷଜ୍ଞଙ୍କ ସହ ପରାମର୍ଶ କରନ୍ତୁ।',
      imageUploadTitle: 'ଫସଲ ରୋଗ ସ୍କାନର',
      imageUploadDesc: 'ପତ୍ରର ଫଟୋ ଉଠାଇ ବା ନମୁନା ବାଛି ରୋଗ ଚିହ୍ନଟ କରନ୍ତୁ।',
      voiceTitle: 'ଭଏସ୍ ସହାୟକ ସହିତ କଥା ହୁଅନ୍ତୁ',
      voiceDesc: 'ନିଜ ଭାଷାରେ କହି ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ, ହାତ ବ୍ୟବହାର ନକରି ଚାଷ କାମ ସହ ଉତ୍ତର ପାଆନ୍ତୁ।',
      openService: 'ଆରମ୍ଭ କରନ୍ତୁ',
      backToDashboard: 'ଡ୍ୟାସବୋର୍ଡକୁ ଫେରନ୍ତୁ',
      logout: 'ଲଗଆଉଟ୍'
    },
    bn: {
      appName: 'কিষাণ সেতু AI', tagline: 'স্মার্ট কৃষি ও কৃষক সহায়তা পোর্টাল', login: 'কৃষক লগইন', register: 'নতুন কৃষক নিবন্ধন', phoneNumber: 'মোবাইল নম্বর', password: 'পাসওয়ার্ড', fullName: 'পুরো নাম', stateName: 'রাজ্য / জেলা', cropType: 'প্রধান ফসল', submitLogin: 'লগইন করুন', submitRegister: 'অ্যাকাউন্ট খুলুন', dashboard: 'ড্যাশবোর্ড', welcome: 'স্বাগতম, কৃষক বন্ধু', aiChatTitle: 'কৃষি AI চ্যাট', aiChatDesc: 'কীটপতঙ্গ, সার এবং আবহাওয়া সংক্রান্ত তথ্যের জন্য আলোচনা করুন।', imageUploadTitle: 'ফসল রোগ স্ক্যানার', imageUploadDesc: 'পাতার ছবি আপলোড করে বা নমুনা বেছে নিয়ে তাৎক্ষণিক রোগ নির্ণয় করুন।', voiceTitle: 'ভয়েস সহকারী', voiceDesc: 'ক্ষেতে কাজ করার সময় মুখে কথা বলে নির্দেশনা পান।', openService: 'শুরু করুন', backToDashboard: 'ড্যাশবোর্ডে ফিরুন', logout: 'লগআউট'
    },
    te: {
      appName: 'కిసాన్ సేతు AI', tagline: 'స్మార్ట్ వ్యవసాయ & రైతు సహాయ వేదిక', login: 'రైతు లాగిన్', register: 'కొత్త రైతు నమోదు', phoneNumber: 'మొబైల్ సంఖ్య', password: 'పాస్‌వర్డ్', fullName: 'పూర్తి పేరు', stateName: 'రాష్ట్రం / జిల్లా', cropType: 'ప్రధాన పంట', submitLogin: 'ప్రవేశించండి', submitRegister: 'ఖాతా సృష్టించండి', dashboard: 'డ్యాష్‌బోర్డ్', welcome: 'స్వాగతం, రైతు మిత్రమా', aiChatTitle: 'వ్యవసాయ AI చాట్', aiChatDesc: 'పురుగులు, ఎరువులు, పంట యాజమాన్యం పై AI సలహాదారుని అడగండి.', imageUploadTitle: 'పంట తెగుళ్ల స్కానర్', imageUploadDesc: 'ఆకు ఫోటో తీసి లేదా నమూనా ఎంచుకుని తెగులును గుర్తించండి.', voiceTitle: 'వాయిస్ సహాయకుడు', voiceDesc: 'పొలంలో పని చేస్తూనే మీ స్వంత భాషలో మాట్లాడి సమాధానం పొందండి.', openService: 'ప్రారంభించండి', backToDashboard: 'డ్యాష్‌బోర్డ్‌కు తిరిగి వెళ్ళండి', logout: 'లాగౌట్'
    },
    ta: {
      appName: 'கிசான் சேது AI', tagline: 'நவீன வேளாண்மை மற்றும் உழவர் உதவி தளம்', login: 'விவசாயி உள்நுழைவு', register: 'புதிய விவசாயி பதிவு', phoneNumber: 'கைபேசி எண்', password: 'கடவுச்சொல்', fullName: 'முழு பெயர்', stateName: 'மாநிலம் / மாவட்டம்', cropType: 'முதன்மை பயிர்', submitLogin: 'உள்நுழைக', submitRegister: 'கணக்கு தொடங்கு', dashboard: 'முகப்பு பலகை', welcome: 'வருக, உழவர் தோழரே', aiChatTitle: 'வேளாண் AI உரையாடல்', aiChatDesc: 'பூச்சி மேலாண்மை, உரங்கள் மற்றும் வானிலை குறித்து ஆலோசனை பெறுங்கள்.', imageUploadTitle: 'பயிர் நோய் கண்டறிதல்', imageUploadDesc: 'இலையின் படத்தை பதிவேற்றி அல்லது மாதிரியை தேர்வு செய்து நோயை கண்டறியுங்கள்.', voiceTitle: 'குரல் வழி உரையாடல்', voiceDesc: 'வயலில் வேலை செய்தபடியே உங்கள் மொழியில் பேசி வழிகாட்டல் பெறுங்கள்.', openService: 'தொடங்கு', backToDashboard: 'முகப்பு பலகைக்கு செல்', logout: 'வெளியேறு'
    },
    mr: {
      appName: 'किसान सेतू AI', tagline: 'स्मार्ट शेती व शेतकरी सहाय्य पोर्टल', login: 'शेतकरी लॉगिन', register: 'नवीन शेतकरी नोंदणी', phoneNumber: 'मोबाईल नंबर', password: 'पासवर्ड', fullName: 'पूर्ण नाव', stateName: 'राज्य / जिल्हा', cropType: 'मुख्य पीक', submitLogin: 'प्रवेश करा', submitRegister: 'खाते तयार करा', dashboard: 'डॅशबोर्ड', welcome: 'स्वागत आहे, बळीराजा', aiChatTitle: 'कृषी AI संवाद', aiChatDesc: 'कीड नियंत्रण, खते आणि हवामानाबाबत कृषी तज्ज्ञ AI शी थेट बोला.', imageUploadTitle: 'पीक रोग स्कॅनर', imageUploadDesc: 'पानाचा फोटो अपलोड करून किंवा नमुना निवडून रोग ओळखा.', voiceTitle: 'आवाजाद्वारे संवाद', voiceDesc: 'शेतात काम करत असताना आपल्या बोलीभाषेत बोलून मार्गदर्शन मिळवा.', openService: 'सुरू करा', backToDashboard: 'डॅशबोर्डवर परत जा', logout: 'लॉगआउट'
    },
    gu: {
      appName: 'કિસાન સેતુ AI', tagline: 'સ્માર્ટ ખેતી અને ખેડૂત સહાયતા પોર્ટલ', login: 'ખેડૂત લૉગિન', register: 'નવા ખેડૂત નોંધણી', phoneNumber: 'મોબાઇલ નંબર', password: 'પાસવર્ડ', fullName: 'પૂરું નામ', stateName: 'રાજ્ય / જિલ્લો', cropType: 'મુખ્ય પાક', submitLogin: 'પ્રવેશ કરો', submitRegister: 'ખાતું બનાવો', dashboard: 'ડેશબોર્ડ', welcome: 'સ્વાગત છે, ખેડૂત મિત્ર', aiChatTitle: 'કૃષિ AI ચેટ', aiChatDesc: 'રોગ, જીવાત, ખાતર અને હવામાન બાબતે AI નિષ્ણાત સાથે વાતચીત કરો.', imageUploadTitle: 'પાક રોગ સ્કેનર', imageUploadDesc: 'પાનનો ફોટો અપલોડ કરી કે નમૂનો પસંદ કરીને તાત્કાલિક રોગ ઓળખો.', voiceTitle: 'વોઇસ સહાયક', voiceDesc: 'ખેતરમાં કામ કરતાં કરતાં પોતાની ભાષામાં બોલીને સલાહ મેળવો.', openService: 'શરૂ કરો', backToDashboard: 'ડેશબોર્ડ પર પાછા જાઓ', logout: 'લૉગઆઉટ'
    },
    kn: {
      appName: 'ಕಿಸಾನ್ ಸೇತು AI', tagline: 'ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಮತ್ತು ರೈತ ನೆರವು ತಾಣ', login: 'ರೈತ ಲಾಗಿನ್', register: 'ಹೊಸ ರೈತರ ನೋಂದಣಿ', phoneNumber: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ', password: 'ಪಾಸ್ವರ್ಡ್', fullName: 'ಪೂರ್ಣ ಹೆಸರು', stateName: 'ರಾಜ್ಯ / ಜಿಲ್ಲೆ', cropType: 'ಪ್ರಮುಖ ಬೆಳೆ', submitLogin: 'ಪ್ರವೇಶಿಸಿ', submitRegister: 'ಖಾತೆ ರಚಿಸಿ', dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', welcome: 'ಸ್ವಾಗತ, ರೈತ ಬಾಂಧವ', aiChatTitle: 'ಕೃಷಿ AI ಸಂವಾದ', aiChatDesc: 'ಕೀಟನಾಶಕ, ರಸಗೊಬ್ಬರ ಮತ್ತು ಮಣ್ಣಿನ ಆರೋಗ್ಯದ ಕುರಿತು AI ತಜ್ಞರನ್ನು ಸಂಪರ್ಕಿಸಿ.', imageUploadTitle: 'ಬೆಳೆ ರೋಗ ಸ್ಕ್ಯಾನರ್', imageUploadDesc: 'ಎಲೆಯ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಅಥವಾ ಮಾದರಿ ಆಯ್ಕೆ ಮಾಡಿ ರೋಗ ಪತ್ತೆಹಚ್ಚಿ.', voiceTitle: 'ಧ್ವನಿ ಸಹಾಯಕ', voiceDesc: 'ಹೊಲದಲ್ಲಿ ಕೆಲಸ ಮಾಡುತ್ತಲೇ ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡಿ ಮಾಹಿತಿ ಪಡೆಯಿರಿ.', openService: 'ಪ್ರಾರಂಭಿಸಿ', backToDashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ', logout: 'ಲಾಗ್‌ಔಟ್'
    },
    ml: {
      appName: 'കിസാൻ സേതു AI', tagline: 'സ്മാർട്ട് കാർഷിക കർഷക സഹായ പോർട്ടൽ', login: 'കർഷക ലോഗിൻ', register: 'പുതിയ കർഷക രജിസ്ട്രേഷൻ', phoneNumber: 'മൊബൈൽ നമ്പർ', password: 'പാസ്‌വേഡ്', fullName: 'മുഴുവൻ പേര്', stateName: 'സംസ്ഥാനം / ജില്ല', cropType: 'പ്രധാന വിള', submitLogin: 'പ്രവേശിക്കുക', submitRegister: 'അക്കൗണ്ട് നിർമ്മിക്കുക', dashboard: 'ഡാഷ്‌ബോർഡ്', welcome: 'സ്വാഗതം, കർഷക സുഹൃത്തേ', aiChatTitle: 'കൃഷി AI ചാറ്റ്', aiChatDesc: 'കീടനാശിനികൾ, വളപ്രയോഗം, വിള സംരക്ഷണം എന്നിവയിൽ വിദഗ്ദ്ധോപദേശം നേടുക.', imageUploadTitle: 'വിള രോഗ സ്കാനർ', imageUploadDesc: 'ഇലയുടെ ഫോട്ടോ അപ്‌‌‌‌ലോഡ് ചെയ്തോ സാമ്പിൾ തിരഞ്ഞെടുത്തോ രോഗം കണ്ടെത്തുക.', voiceTitle: 'വോയ്‌സ് അസിസ്റ്റന്റ്', voiceDesc: 'വയലിൽ ജോലി ചെയ്യുമ്പോൾ തന്നെ മാതൃഭാഷയിൽ സംസാരിച്ച് പരിഹാരം നേടുക.', openService: 'തുടങ്ങുക', backToDashboard: 'ഡാഷ്‌ബോർഡിലേക്ക് മടങ്ങുക', logout: 'ലോഗൗട്ട്'
    },
    pa: {
      appName: 'ਕਿਸਾਨ ਸੇਤੂ AI', tagline: 'ਸਮਾਰਟ ਖੇਤੀ ਅਤੇ ਕਿਸਾਨ ਸਹਾਇਤਾ ਪੋਰਟਲ', login: 'ਕਿਸਾਨ ਲੌਗਇਨ', register: 'ਨਵੀਂ ਕਿਸਾਨ ਰਜਿਸਟ੍ਰੇਸ਼ਨ', phoneNumber: 'ਮੋਬਾਈਲ ਨੰਬਰ', password: 'ਪਾਸਵਰਡ', fullName: 'ਪੂਰਾ ਨਾਮ', stateName: 'ਰਾਜ / ਜ਼ਿਲ੍ਹਾ', cropType: 'ਮੁੱਖ ਫਸਲ', submitLogin: 'ਪ੍ਰਵੇਸ਼ ਕਰੋ', submitRegister: 'ਖਾਤਾ ਬਣਾਓ', dashboard: 'ਡੈਸ਼ਬੋਰਡ', welcome: 'ਜੀ ਆਇਆਂ ਨੂੰ, ਕਿਸਾਨ ਵੀਰੋ', aiChatTitle: 'ਖੇਤੀਬਾੜੀ AI ਚੈਟ', aiChatDesc: 'ਕੀੜੇ-ਮਕੌੜੇ, ਖਾਦਾਂ ਅਤੇ ਮੌਸਮ ਬਾਰੇ AI ਮਾਹਿਰ ਨਾਲ ਸਲਾਹ ਕਰੋ।', imageUploadTitle: 'ਫਸਲ ਰੋਗ ਸਕੈਨਰ', imageUploadDesc: 'ਪੱਤੇ ਦੀ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ ਜਾਂ ਨਮੂਨਾ ਚੁਣ ਕੇ ਬਿਮਾਰੀ ਦੀ ਜਾਂਚ ਕਰੋ।', voiceTitle: 'ਆਵਾਜ਼ ਸਹਾਇਕ', voiceDesc: 'ਖੇਤਾਂ ਵਿੱਚ ਕੰਮ ਕਰਦੇ ਹੋਏ ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਬੋਲ ਕੇ ਸਲਾਹ ਲਵੋ।', openService: 'ਸ਼ੁਰੂ ਕਰੋ', backToDashboard: 'ਡੈਸ਼ਬੋਰਡ ਤੇ ਵਾਪਸ ਜਾਓ', logout: 'ਲਾਗਆਉਟ'
    },
    as: {
      appName: 'কিষাণ সেতু AI', tagline: 'স্মাৰ্ট কৃষি আৰু কৃষক সাহায্য পৰ্টেল', login: 'কৃষক প্ৰৱেশ', register: 'নতুন কৃষক পঞ্জীয়ন', phoneNumber: 'ম’বাইল নম্বৰ', password: 'পাছৱৰ্ড', fullName: 'সম্পূৰ্ণ নাম', stateName: 'ৰাজ্য / জিলা', cropType: 'প্ৰধান শস্য', submitLogin: 'প্ৰৱেশ কৰক', submitRegister: 'একাউণ্ট খোলক', dashboard: 'ডেশ্বব’ৰ্ড', welcome: 'স্বাগতম, কৃষক বন্ধু', aiChatTitle: 'কৃষি AI বাৰ্তালাপ', aiChatDesc: 'কীট-পতঙ্গ, সাৰ আৰু বতৰ সম্পৰ্কে AI বিশেষজ্ঞৰ পৰামৰ্শ লওক।', imageUploadTitle: 'শস্য ৰোগ স্কেনাৰ', imageUploadDesc: 'পাতৰ ফটো আপলোড কৰি বা নমুনা বাছি লৈ ৰোগ চিনাক্ত কৰক।', voiceTitle: 'কণ্ঠ সহায়ক', voiceDesc: 'পথাৰত কাম কৰি থকা অৱস্থাত মুখৰে কৈ সহজ সমাধান পাওক।', openService: 'আৰম্ভ কৰক', backToDashboard: 'ডেশ্বব’ৰ্ডলৈ উভতি যাওক', logout: 'প্ৰস্থান'
    }
  };

  setLanguage(lang: SupportedLanguage) {
    this.currentLang.set(lang);
  }

  t(key: string): string {
    const lang = this.currentLang();
    return this.dictionary[lang]?.[key] || this.dictionary['en']?.[key] || key;
  }
}