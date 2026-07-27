// Фасад карты: iframe Яндекс.Карт грузится по клику или при доскролле.
function load(facade) {
	if (facade.classList.contains('is-loaded')) return;
	const query = encodeURIComponent(facade.dataset.mapQuery || '');
	const iframe = document.createElement('iframe');
	iframe.src = `https://yandex.ru/map-widget/v1/?text=${query}&z=16`;
	iframe.loading = 'lazy';
	iframe.title = 'Карта проезда';
	facade.prepend(iframe);
	facade.classList.add('is-loaded');
}

export function initLazyMap() {
	const facade = document.querySelector('[data-map]');
	if (!facade) return;

	facade.querySelector('.map-facade__btn')?.addEventListener('click', () => load(facade));

	const observer = new IntersectionObserver((entries) => {
		if (entries.some((entry) => entry.isIntersecting)) {
			load(facade);
			observer.disconnect();
		}
	}, { rootMargin: '200px' });
	observer.observe(facade);
}
