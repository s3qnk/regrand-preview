// Лайтбокс: клик по [data-lightbox] открывает полноразмерное фото поверх страницы.
// Элементы с одинаковым значением data-lightbox листаются стрелками.
let overlay = null;
let items = [];
let index = 0;

function render() {
	const { href, caption } = items[index];
	overlay.querySelector('.lightbox__img').src = href;
	overlay.querySelector('.lightbox__caption').textContent = caption;
	const hasNav = items.length > 1;
	overlay.querySelector('.lightbox__prev').hidden = !hasNav;
	overlay.querySelector('.lightbox__next').hidden = !hasNav;
}

function step(delta) {
	index = (index + delta + items.length) % items.length;
	render();
}

function close() {
	if (!overlay) return;
	overlay.remove();
	overlay = null;
	document.removeEventListener('keydown', onKeydown);
}

function onKeydown(event) {
	if (event.key === 'Escape') close();
	if (event.key === 'ArrowLeft') step(-1);
	if (event.key === 'ArrowRight') step(1);
}

function captionFor(link) {
	return link.title
		|| link.closest('figure')?.querySelector('figcaption')?.textContent
		|| link.querySelector('img')?.alt
		|| '';
}

function open(links, start) {
	items = links.map((a) => ({ href: a.href, caption: captionFor(a) }));
	index = start;
	overlay = document.createElement('div');
	overlay.className = 'lightbox';
	overlay.innerHTML = `
		<button type="button" class="lightbox__close" aria-label="Закрыть">&times;</button>
		<button type="button" class="lightbox__prev" aria-label="Предыдущее фото">&#8592;</button>
		<img class="lightbox__img" alt="">
		<button type="button" class="lightbox__next" aria-label="Следующее фото">&#8594;</button>
		<p class="lightbox__caption"></p>`;
	overlay.addEventListener('click', (event) => {
		if (event.target === overlay || event.target.classList.contains('lightbox__close')) close();
	});
	overlay.querySelector('.lightbox__prev').addEventListener('click', () => step(-1));
	overlay.querySelector('.lightbox__next').addEventListener('click', () => step(1));
	document.addEventListener('keydown', onKeydown);
	document.body.appendChild(overlay);
	render();
}

export function initLightbox() {
	document.addEventListener('click', (event) => {
		const link = event.target.closest('[data-lightbox]');
		if (!link) return;
		event.preventDefault();
		const group = [...document.querySelectorAll(`[data-lightbox="${link.dataset.lightbox}"]`)];
		open(group, group.indexOf(link));
	});
}
