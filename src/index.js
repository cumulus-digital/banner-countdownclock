import { zonedTimeToUtc, utcToZonedTime, format, parse } from 'date-fns';

const globalStyle = require('!!raw-loader!sass-loader!./style.scss').default;

class CountdownBanner extends HTMLElement {
	now;
	endDate;

	showDays = true;
	showSeconds = true;
	show2Digits = true;
	showLabels = true;

	clockEl;
	daysEl;
	hoursEl;
	minutesEl;
	secondsEl;

	clockInterval;

	trueFalse(attr) {
		return !!['true', 'yes'].includes(attr.toLowerCase());
	}

	constructor() {
		super();
		const globalStyleEl = document.createElement('style');
		globalStyleEl.innerHTML = globalStyle;
		this.attachShadow({ mode: 'open' });
		this.appendChild(globalStyleEl);
		this.shadowRoot.append(globalStyleEl.cloneNode(1));

		if (this.parentElement.nodeName === 'A') {
			this.parentElement.style.setProperty('display', 'block');
			this.parentElement.style.setProperty('text-decoration', 'none');
		}

		const baseStyle = {
			display: 'flex',
			'background-color':
				this.getAttribute('background-color') || 'transparent',
			'background-size': 'cover',
			'background-repeat': 'no-repeat',
			width: this.getAttribute('width') || '300px',
			height: this.getAttribute('height') || '250px',
			'--font-family': this.getAttribute('font-family') || 'sans-serif',
			'--clock-fontsize': this.getAttribute('clock-fontsize', '55px'),
			'--clock-align': this.getAttribute('clock-align', 'center'),
			'--clock-justify': this.getAttribute('clock-justify', 'center'),
			'--clock-margin': this.getAttribute('clock-margin') || '.5em 0 0',
			'--clock-color': this.getAttribute('clock-color') || '#fff',
			'--clock-digit-gap':
				this.getAttribute('clock-digit-gap') || '0.1em',
		};
		for (let k in baseStyle) {
			this.style.setProperty(k, baseStyle[k]);
		}

		if (this.hasAttribute('load-font')) {
			const link = document.createElement('link');
			link.setAttribute('rel', 'stylesheet');
			link.setAttribute('href', this.getAttribute('load-font'));
			document.head.append(link);
		}

		// Set our background from attributes
		if (this.hasAttribute('background-image')) {
			this.style.setProperty(
				'background-image',
				`url(${this.getAttribute('background-image')})`
			);
		}

		if (this.hasAttribute('clock-margin')) {
			this.style.setProperty(
				'--clock-margin',
				this.getAttribute('clock-margin')
			);
		}

		// Generate the clock
		if (this.hasAttribute('end')) {
			if (this.hasAttribute('clock-show-days')) {
				this.showDays = this.trueFalse(
					this.getAttribute('clock-show-days')
				);
			}
			if (this.hasAttribute('clock-show-seconds')) {
				this.showSeconds = this.trueFalse(
					this.getAttribute('clock-show-seconds')
				);
			}
			if (this.hasAttribute('clock-show-2digits')) {
				this.show2Digits = this.trueFalse(
					this.getAttribute('clock-show-2digits')
				);
			}
			if (this.hasAttribute('clock-show-labels')) {
				this.showLabels = this.trueFalse(
					this.getAttribute('clock-show-labels')
				);
			}

			this.now = new Date();

			this.endDate = Date.parse(this.getAttribute('end'));
			if (!this.endDate || this.endDate === NaN) {
				console.error(
					'Failed to parse end date! Be sure it is in ISO 8601 format!',
					'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format',
					'To convert times, try',
					'https://time.lol/'
				);
			}

			this.clockEl = document.createElement('div');
			this.clockEl.className = `
				clock-display
				${this.showDays ? 'show-days' : ''}
				${this.showSeconds ? 'show-seconds' : ''}
			`;
			this.daysEl = document.createElement('div');
			this.daysEl.className = 'digit days';
			this.hoursEl = document.createElement('div');
			this.hoursEl.className = 'digit hours';
			this.minutesEl = document.createElement('div');
			this.minutesEl.className = 'digit minutes';
			this.secondsEl = document.createElement('div');
			this.secondsEl.className = 'digit seconds';

			let separator = document.createElement('i');
			separator.innerHTML = this.getAttribute('clock-separator') || '';

			this.clockEl.append(
				this.daysEl,
				separator.cloneNode(1),
				this.hoursEl,
				separator.cloneNode(1),
				this.minutesEl,
				separator.cloneNode(1),
				this.secondsEl
			);
			this.shadowRoot.append(this.clockEl);
			this.updateClock();
			this.clockInterval = setInterval(() => this.updateClock(), 1000);
		}
	}

	updateClock() {
		this.now = new Date();
		const _second = 1000;
		const _minute = _second * 60;
		const _hour = _minute * 60;
		const _day = _hour * 24;

		var distance = this.endDate - this.now;
		if (distance < 0) {
			clearInterval(this.clockInterval);
			this.clockInterval = null;
			if (this.hasAttribute('end-message')) {
				this.clockEl.innerHTML = this.getAttribute('end-message');
			}
			return;
		}

		const timeParts = ['days', 'hours', 'minutes', 'seconds'];
		const time = {
			days: Math.floor(distance / _day),
			hours: this.showDays
				? Math.floor((distance % _day) / _hour)
				: Math.floor(distance / _hour),
			minutes: Math.floor((distance % _hour) / _minute),
			seconds: Math.floor((distance % _minute) / _second),
		};

		timeParts.forEach((t) => {
			let l = t.charAt(0).toUpperCase() + t.substring(1);
			if (time[t] > 1) {
				this[`${t}El`].classList.add('plural');
			} else {
				this[`${t}El`].classList.remove('plural');
			}
			if (this.show2Digits && time[t] < 10) {
				time[t] = `0${time[t]}`;
			}

			this[`${t}El`].innerHTML = `
				<time>
					${time[t]}
					${this.showLabels ? `<span>${l}</span>` : ''}
				</time>
			`;
		});

		if (!this.showDays) {
			this.daysEl.style.setProperty('display', 'none');
			this.daysEl.nextElementSibling.style.setProperty('display', 'none');
		}
		if (!this.showSeconds) {
			this.secondsEl.style.setProperty('display', 'none');
			this.minutesEl.nextElementSibling.style.setProperty(
				'display',
				'none'
			);
		}
	}
}
customElements.define('countdown-banner', CountdownBanner);
