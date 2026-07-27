import { initForms } from './modules/forms.js';
import { initQuiz } from './modules/quiz.js';
import { initModal } from './modules/modal.js';
import { initPhoneMask } from './modules/phone-mask.js';
import { initMetrikaEvents } from './modules/metrika.js';
import { initLazyMap } from './modules/lazy-map.js';
import { initLazyVideo } from './modules/lazy-video.js';
import { initFaq } from './modules/faq.js';

initPhoneMask();
initModal();
initQuiz();
initForms();
initMetrikaEvents();
initLazyMap();
initLazyVideo();
initFaq();
