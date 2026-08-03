// Кнопки-стрелки для горизонтальных каруселей: [data-carousel] содержит
// [data-carousel-track] и кнопки [data-carousel-prev]/[data-carousel-next].
// С атрибутом data-carousel-autoplay="мс" карусель листается сама;
// пауза при наведении, касании и ручной прокрутке.
const RESUME_DELAY = 6000;

export function initCarousels() {
	document.querySelectorAll('[data-carousel]').forEach((root) => {
		const track = root.querySelector('[data-carousel-track]');
		if (!track) return;

		const step = () => {
			const slide = track.firstElementChild;
			if (!slide) return 300;
			const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
			return slide.getBoundingClientRect().width + gap;
		};

		const scrollBy = (delta) => track.scrollBy({ left: delta, behavior: 'smooth' });

		root.querySelector('[data-carousel-prev]')?.addEventListener('click', () => scrollBy(-step()));
		root.querySelector('[data-carousel-next]')?.addEventListener('click', () => scrollBy(step()));

		initAutoplay(root, track, step, scrollBy);
	});
}

function initAutoplay(root, track, step, scrollBy) {
	const interval = Number(root.dataset.carouselAutoplay);
	if (!interval) return;
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	let paused = false;
	let resumeTimer = null;

	const pause = () => {
		paused = true;
		clearTimeout(resumeTimer);
	};
	const resumeLater = () => {
		clearTimeout(resumeTimer);
		resumeTimer = setTimeout(() => { paused = false; }, RESUME_DELAY);
	};

	root.addEventListener('pointerenter', pause);
	root.addEventListener('pointerleave', resumeLater);
	root.addEventListener('focusin', pause);
	root.addEventListener('focusout', resumeLater);
	track.addEventListener('touchstart', pause, { passive: true });
	track.addEventListener('touchend', resumeLater, { passive: true });

	setInterval(() => {
		if (paused || !isVisible(root)) return;
		const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
		if (atEnd) {
			track.scrollTo({ left: 0, behavior: 'smooth' });
		} else {
			scrollBy(step());
		}
	}, interval);
}

function isVisible(el) {
	const rect = el.getBoundingClientRect();
	return rect.bottom > 0 && rect.top < window.innerHeight;
}
