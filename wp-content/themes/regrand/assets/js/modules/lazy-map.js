// Фасад карты: iframe Яндекс.Карт грузится по клику или при доскролле.
function load(facade) {
	if (facade.classList.contains('is-loaded')) return;
	const iframe = document.createElement('iframe');
	// С ID организации карта показывает её карточку (название, рейтинг, отзывы),
	// без него — просто точку по адресу.
	// Приоритет: точка-метка (без балуна) → карточка организации → поиск по адресу.
	const pt = facade.dataset.mapPt;
	const oid = facade.dataset.mapOid;
	if (pt) {
		iframe.src = `https://yandex.ru/map-widget/v1/?ll=${encodeURIComponent(pt)}&z=17&pt=${encodeURIComponent(pt)}`;
	} else if (oid) {
		iframe.src = `https://yandex.ru/map-widget/v1/?ol=biz&oid=${encodeURIComponent(oid)}&z=16`;
	} else {
		iframe.src = `https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(facade.dataset.mapQuery || '')}&z=16`;
	}
	if (facade.dataset.mapTheme) {
		iframe.src += `&theme=${encodeURIComponent(facade.dataset.mapTheme)}`;
	}
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
