import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  ar: {
    translation: {
      nutritionQuizTitle: 'اختبار الأطعمة الصحية',
      question: 'السؤال',
      of: 'من',
      trueBtn: 'صحيح',
      falseBtn: 'غير صحيح',
      correctFeedback: 'إجابة صحيحة!',
      incorrectFeedback: 'إجابة خاطئة',
      showHintBtn: 'إظهار التلميح',
      hideHintBtn: 'إخفاء التلميح',
      nextBtn: 'السؤال التالي',
      skipBtn: 'تخطي',
      funFact: 'معلومة:',
      resetQuiz: 'إعادة الاختبار'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar',
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
