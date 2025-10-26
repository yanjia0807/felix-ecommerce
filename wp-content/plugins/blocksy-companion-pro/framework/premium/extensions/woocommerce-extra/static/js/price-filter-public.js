import { registerDynamicChunk } from 'blocksy-frontend'
import { fetchDataFor } from './ajax-filter-public'
import { sprintf } from '@wordpress/i18n/build/sprintf'

const formatPrice = (price) => {
	const { priceFormat, currency, thousand } =
		ct_localizations.blocksy_woo_extra_price_filters

	if (thousand) {
		price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, thousand)
	}

	return sprintf(priceFormat, currency, price)
}

const updateMinThumb = (parent, pos, tooltipMessage) => {
	const el = parent.querySelector('.ct-price-filter-range-handle-min')

	const tooltip = el.querySelector('.ct-tooltip')

	if (tooltip) {
		tooltip.innerText = tooltipMessage
	}

	el.style.insetInlineStart = pos + '%'
}

const updateMaxThumb = (parent, pos, tooltipMessage) => {
	const el = parent.querySelector('.ct-price-filter-range-handle-max')

	const tooltip = el.querySelector('.ct-tooltip')

	if (tooltip) {
		tooltip.innerText = tooltipMessage
	}

	el.style.insetInlineStart = pos + '%'
}

const updateRangeTrack = (parent, minPos, maxPos) => {
	const rangeTrack = parent.querySelector('.ct-price-filter-range-track')
	rangeTrack.style.setProperty('--start', minPos + '%')
	rangeTrack.style.setProperty('--end', maxPos + '%')
}

const handleDrag = (el, event, { parent, minEl, maxEl }) => {
	const minInput = parent.querySelector('.ct-price-filter-min')
	const maxInput = parent.querySelector('.ct-price-filter-max')

	const min = parseFloat(el.min)
	const max = parseFloat(el.max)

	const value = parseFloat(event.target.value)

	const minVal = Math.min(value, parseFloat(minEl.value))
	const maxVal = Math.max(value, parseFloat(maxEl.value))

	const minPos = Math.max(((minVal - min) / (max - min)) * 100, 0)
	const maxPos = Math.min(((maxVal - min) / (max - min)) * 100, 100)

	updateRangeTrack(parent, minPos, maxPos)

	if (minInput && maxInput) {
		minInput.innerText = formatPrice(minVal)
		maxInput.innerText = formatPrice(maxVal)
	}

	updateMinThumb(parent, minPos, formatPrice(minVal))
	updateMaxThumb(parent, maxPos, formatPrice(maxVal))

	minEl.value = minVal
	maxEl.value = maxVal

	if (el.name === 'min_price' && minVal >= maxVal) {
		maxEl.value = Math.min(minVal + 1, max)

		if (maxInput) {
			maxInput.innerText = formatPrice(Math.min(minVal + 1, max))
		}
	}

	if (el.name === 'max_price' && maxVal <= minVal) {
		minEl.value = Math.max(maxVal - 1, min)

		if (minInput) {
			minInput.innerText = formatPrice(Math.max(maxVal - 1, min))
		}
	}
}

const handleMount = (el, { event }) => {
	const isAjax = document.querySelector('[data-ajax-filters*="yes"]')
	const parent = el.closest('.ct-price-filter')
	const minEl = parent.querySelector('[type="range"][name="min_price"]')
	const maxEl = parent.querySelector('[type="range"][name="max_price"]')

	if (event.type === 'input') {
		if (el.type === 'range') {
			handleDrag(el, event, { parent, minEl, maxEl })
		}
		return
	}

	if (event.type === 'change') {
		const searchParams = new URLSearchParams(window.location.search)
		searchParams.set(minEl.name, minEl.value)
		searchParams.set(maxEl.name, maxEl.value)

		searchParams.set('blocksy_ajax', 'yes')

		if (el.name === 'min_price' && el.value === el.min) {
			searchParams.delete(el.name)

			if (searchParams.get('max_price') === el.max) {
				searchParams.delete('max_price')
			}
		}

		if (el.name === 'max_price' && el.value === el.max) {
			searchParams.delete(el.name)

			if (searchParams.get('min_price') === el.min) {
				searchParams.delete('min_price')
			}
		}

		const requestUrl = `${window.location.pathname}${
			searchParams.toString().length ? `?${searchParams.toString()}` : ''
		}`
		if (!isAjax) {
			window.location.href = requestUrl
		} else {
			fetchDataFor(requestUrl)
			window.history.pushState({}, document.title, requestUrl)
		}
	}

	if (event.type === 'click') {
		const { width, left } = parent.getBoundingClientRect()
		const clickPos = ((event.clientX - left) / width) * 100

		const minVal = parseFloat(minEl.min)
		const maxVal = parseFloat(maxEl.max)

		const clickVal = minVal + (clickPos / 100) * (maxVal - minVal)

		const minDiff = Math.abs(clickVal - parseFloat(minEl.value))
		const maxDiff = Math.abs(clickVal - parseFloat(maxEl.value))

		if (minDiff < maxDiff) {
			minEl.value = clickVal
			updateMinThumb(parent, clickPos, formatPrice(minEl.value))
			minEl.dispatchEvent(new Event('change'))
		} else {
			maxEl.value = clickVal
			updateMaxThumb(parent, clickPos, formatPrice(maxEl.value))
			maxEl.dispatchEvent(new Event('change'))
		}

		updateRangeTrack(
			parent,
			((minEl.value - minEl.min) / (maxEl.max - minEl.min)) * 100,
			((maxEl.value - minEl.min) / (maxEl.max - minEl.min)) * 100
		)
	}
}

registerDynamicChunk('blocksy_ext_woo_extra_price_filters', {
	mount: handleMount,
})

window.addEventListener(
	'popstate',
	function (event) {
		fetchDataFor(window.location.href)
	},
	false
)
