import { reachGoal } from './metrika.js';

const STORAGE_KEY = 'regrand_quiz';

function readState() {
	try {
		return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {};
	} catch (e) {
		return {};
	}
}

function writeState(state) {
	try {
		sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch (e) { /* приватный режим — просто без сохранения */ }
}

export function initQuiz() {
	const form = document.querySelector('form[data-form-type="quiz"]');
	if (!form) return;

	const steps = [...form.querySelectorAll('fieldset[data-step]')];
	const total = steps.length;
	const prevBtn = form.querySelector('.quiz__prev');
	const nextBtn = form.querySelector('.quiz__next');
	const bar = form.querySelector('.quiz__progress-bar span');
	const currentLabel = form.querySelector('[data-quiz-current]');
	let started = false;

	const state = readState();
	let step = Math.min(Math.max(Number(state.step) || 1, 1), total);

	// Восстановление ответов после перезагрузки.
	if (state.values) {
		Object.entries(state.values).forEach(([name, value]) => {
			const input = form.querySelector(`input[name="${name}"][value="${CSS.escape(value)}"]`)
				|| (form.elements[name]?.type === 'text' ? form.elements[name] : null);
			if (input?.type === 'radio') input.checked = true;
			else if (input) input.value = value;
		});
	}

	function stepDone(index) {
		const fieldset = steps[index - 1];
		if (!fieldset.dataset.q) return true; // финальный шаг проверяется при сабмите
		return Boolean(fieldset.querySelector('input[type="radio"]:checked'));
	}

	function persist() {
		const values = {};
		form.querySelectorAll('input[type="radio"]:checked').forEach((input) => {
			values[input.name] = input.value;
		});
		const other = form.querySelector('input[name="q_brand_other"]');
		if (other && !other.hidden && other.value) values.q_brand_other = other.value;
		writeState({ step, values });
	}

	function render() {
		steps.forEach((fieldset) => {
			fieldset.hidden = Number(fieldset.dataset.step) !== step;
		});
		prevBtn.hidden = step === 1;
		nextBtn.hidden = step === total;
		nextBtn.disabled = !stepDone(step);
		bar.style.width = `${(step / total) * 100}%`;
		if (currentLabel) currentLabel.textContent = String(step);
	}

	function go(target) {
		step = Math.min(Math.max(target, 1), total);
		persist();
		render();
	}

	prevBtn.addEventListener('click', () => go(step - 1));
	nextBtn.addEventListener('click', () => go(step + 1));

	form.addEventListener('change', (e) => {
		if (e.target.type !== 'radio') return;
		if (!started) {
			started = true;
			reachGoal('quiz_start');
		}
		// Поле «Другая марка».
		const otherInput = form.querySelector('input[name="q_brand_other"]');
		if (otherInput && e.target.name === 'q_brand') {
			otherInput.hidden = !e.target.hasAttribute('data-other');
			if (!otherInput.hidden) otherInput.focus();
		}
		nextBtn.disabled = !stepDone(step);
		persist();
		// Автопереход после выбора (кроме «Другой марки» — там надо ввести текст).
		if (step < total && !e.target.hasAttribute('data-other')) {
			setTimeout(() => go(step + 1), 250);
		}
	});

	form.addEventListener('input', (e) => {
		if (e.target.name === 'q_brand_other') persist();
	});

	render();
}
