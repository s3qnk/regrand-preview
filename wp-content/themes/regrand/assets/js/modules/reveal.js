// Плавное появление элементов при скролле (с каскадом внутри блока).
// Классы вешает JS: без JS всё видно сразу, деградация безопасная.
const TARGETS = [
	'.section__title', '.section__subtitle',
	'.service-card', '.benefit', '.process__step',
	'.case', '.promo', '.warranty-card',
	'.certificate', '.video-tile', '.contacts__item',
	'.faq__item',
].join(', ');

export function initReveal() {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const elements = [...document.querySelectorAll(TARGETS)];
	elements.forEach((el) => {
		el.classList.add('reveal');
		const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
		el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 7) * 70}ms`;
	});

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add('is-visible');
				observer.unobserve(entry.target);
			}
		});
	}, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

	elements.forEach((el) => observer.observe(el));
}
