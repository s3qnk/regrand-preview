import { reachGoal } from './metrika.js';

// Любая кнопка [data-modal="name"] открывает <dialog id="modal-name">
// и шлёт в Метрику цель open_name.
export function initModal() {
	document.addEventListener('click', (e) => {
		const trigger = e.target.closest('[data-modal]');
		if (!trigger) return;
		const dialog = document.getElementById('modal-' + trigger.dataset.modal);
		if (!dialog) return;
		dialog.showModal();
		reachGoal('open_' + trigger.dataset.modal);
	});

	document.querySelectorAll('dialog.modal').forEach((dialog) => {
		dialog.querySelector('.modal__close')?.addEventListener('click', () => dialog.close());
		dialog.addEventListener('click', (e) => {
			if (e.target === dialog) dialog.close();
		});
	});
}
