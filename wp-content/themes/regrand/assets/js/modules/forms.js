import { reachGoal } from './metrika.js';

const GENERIC_SUCCESS = 'Заявка отправлена! Перезвоним в рабочее время.';

function phoneDigits(value) {
	let d = value.replace(/\D/g, '');
	if (d.startsWith('8')) d = '7' + d.slice(1);
	return d;
}

// Ответы квиза: пары «вопрос → ответ» из data-атрибутов разметки.
function collectQuizAnswers(form) {
	const answers = {};
	form.querySelectorAll('fieldset[data-q]').forEach((fieldset) => {
		const checked = fieldset.querySelector('input[type="radio"]:checked');
		if (!checked) return;
		let value = checked.value;
		if (checked.hasAttribute('data-other')) {
			const other = fieldset.querySelector('input[type="text"]');
			value = other?.value.trim() || 'Другая марка';
		}
		answers[fieldset.dataset.q] = value;
	});
	return answers;
}

function setStatus(form, message, isError) {
	const status = form.querySelector('.lead-form__status');
	if (!status) return;
	status.textContent = message;
	status.classList.toggle('is-error', Boolean(isError));
	status.classList.toggle('is-success', !isError);
}

function showSuccess(form) {
	const status = form.querySelector('.lead-form__status');
	const message = status?.dataset.successText || GENERIC_SUCCESS;
	form.querySelectorAll('fieldset, .lead-form__row, .quiz__nav, .quiz__progress, .consent, input, button').forEach((el) => {
		el.hidden = true;
	});
	setStatus(form, '✓ ' + message, false);
	form.classList.add('is-sent');
}

async function submit(form) {
	const type = form.dataset.formType || 'hero';
	const phoneInput = form.querySelector('input[name="phone"]');
	const digits = phoneDigits(phoneInput?.value || '');
	if (digits.length !== 11) {
		phoneInput?.classList.add('is-invalid');
		setStatus(form, 'Укажите номер телефона полностью', true);
		return;
	}
	phoneInput.classList.remove('is-invalid');

	const consent = form.querySelector('input[name="consent"]');
	if (consent && !consent.checked) {
		setStatus(form, 'Подтвердите согласие на обработку персональных данных', true);
		return;
	}

	const payload = {
		form: type,
		name: form.querySelector('input[name="name"]')?.value.trim() || '',
		phone: digits,
		consent: true,
		website: form.querySelector('input[name="website"]')?.value || '',
		ts: Number(form.querySelector('input[name="ts"]')?.value) || 0,
		referer: window.location.href,
	};
	if (type === 'quiz') {
		payload.answers = collectQuizAnswers(form);
	}

	const button = form.querySelector('button[type="submit"]');
	const label = button?.textContent;
	if (button) {
		button.disabled = true;
		button.textContent = 'Отправляем…';
	}

	try {
		const response = await fetch(window.REGRAND.endpoint, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		});
		const data = await response.json();
		if (data.success) {
			reachGoal(form.dataset.goal || 'lead');
			showSuccess(form);
			try {
				sessionStorage.removeItem('regrand_quiz');
			} catch (e) { /* приватный режим */ }
		} else {
			setStatus(form, data.message || 'Не удалось отправить. Позвоните нам по телефону.', true);
		}
	} catch (e) {
		setStatus(form, 'Ошибка сети. Позвоните нам по телефону из шапки сайта.', true);
	} finally {
		if (button && !form.classList.contains('is-sent')) {
			button.disabled = false;
			button.textContent = label;
		}
	}
}

export function initForms() {
	const loadedAt = Math.floor(Date.now() / 1000);
	document.querySelectorAll('form[data-lead-form]').forEach((form) => {
		const ts = form.querySelector('input[name="ts"]');
		if (ts) ts.value = String(loadedAt);
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			submit(form);
		});
	});
}
