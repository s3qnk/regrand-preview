// Ротация фразы в заголовке hero: «рулевых реек» → «рулевых колонок» → …
export function initHeroRotate() {
	const el = document.querySelector('.hero__rotate');
	if (!el) return;
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	let phrases;
	try {
		phrases = JSON.parse(el.dataset.rotate);
	} catch (e) {
		return;
	}
	if (!Array.isArray(phrases) || phrases.length < 2) return;

	let index = 0;
	setInterval(() => {
		el.classList.add('is-out');
		setTimeout(() => {
			index = (index + 1) % phrases.length;
			el.textContent = phrases[index];
			el.classList.remove('is-out');
		}, 250);
	}, 3000);
}
