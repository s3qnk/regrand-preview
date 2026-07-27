const metrikaId = () => Number(window.REGRAND?.metrikaId) || 0;

export function reachGoal(name) {
	const id = metrikaId();
	if (id && typeof window.ym === 'function') {
		window.ym(id, 'reachGoal', name);
	}
}

// Делегированные цели: клики по телефонам и мессенджерам.
export function initMetrikaEvents() {
	document.addEventListener('click', (e) => {
		const tel = e.target.closest('a[href^="tel:"]');
		if (tel) {
			reachGoal('click_phone');
			return;
		}
		if (e.target.closest('[data-messenger]')) {
			reachGoal('click_messenger');
		}
	});
}
