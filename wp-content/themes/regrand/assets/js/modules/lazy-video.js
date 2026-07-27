// Фасад VK Видео: iframe подгружается только по клику — не влияет на PageSpeed.
function load(facade) {
	if (facade.classList.contains('is-loaded')) return;
	const iframe = document.createElement('iframe');
	iframe.src = `${facade.dataset.videoSrc}&autoplay=1`;
	iframe.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
	iframe.allowFullscreen = true;
	iframe.title = 'VK Видео';
	facade.prepend(iframe);
	facade.classList.add('is-loaded');
}

export function initLazyVideo() {
	document.querySelectorAll('[data-video-src]').forEach((facade) => {
		facade.addEventListener('click', () => load(facade));
		facade.addEventListener('keydown', (event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				load(facade);
			}
		});
	});
}
