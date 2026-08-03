// Кнопки-стрелки для горизонтальных каруселей: [data-carousel] содержит
// [data-carousel-track] и кнопки [data-carousel-prev]/[data-carousel-next].
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

		root.querySelector('[data-carousel-prev]')?.addEventListener('click', () => {
			track.scrollBy({ left: -step(), behavior: 'smooth' });
		});
		root.querySelector('[data-carousel-next]')?.addEventListener('click', () => {
			track.scrollBy({ left: step(), behavior: 'smooth' });
		});
	});
}
