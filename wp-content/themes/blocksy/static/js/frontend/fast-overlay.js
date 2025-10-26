import { loadStyle } from '../helpers'

import { whenTransitionEnds } from './helpers/when-transition-ends'

export const fastOverlayPreloadAssets = (el = null) => {
	import('./lazy/overlay')

	if (el) {
		const potentialStyles =
			ct_localizations.dynamic_styles_selectors.filter(
				(styleDescriptor) => {
					return (
						el.matches(styleDescriptor.selector) ||
						el.querySelector(styleDescriptor.selector)
					)
				}
			)

		potentialStyles.map((styleDescriptor) => loadStyle(styleDescriptor.url))
	}
}

export const fastOverlayHandleClick = (e, settings) => {
	settings = {
		container: null,

		// full | fast | skip
		openStrategy: 'full',
		...settings,
	}

	if (
		document.body.hasAttribute('data-panel') &&
		settings.openStrategy !== 'skip'
	) {
		return
	}

	const mount = () => {
		if (settings.openStrategy !== 'skip') {
			document.body.dataset.panel = ''

			settings.container.classList.add('active')

			// allow one frame to move from display: none -> flex
			// Fixes issue with Firefox on first page load
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					document.body.dataset.panel = `in${
						settings.container.dataset.behaviour.indexOf('left') >
						-1
							? ':left'
							: settings.container.dataset.behaviour.indexOf(
									'right'
							  ) > -1
							? ':right'
							: ''
					}`
				})
			})
		}

		if (
			settings.openStrategy === 'full' ||
			settings.openStrategy === 'skip'
		) {
			import('./lazy/overlay').then(({ handleClick }) => {
				handleClick(e, settings)
			})
		}
	}

	const potentialStyles = ct_localizations.dynamic_styles_selectors.filter(
		(styleDescriptor) => {
			return (
				settings.container.matches(styleDescriptor.selector) ||
				settings.container.querySelector(styleDescriptor.selector)
			)
		}
	)

	if (potentialStyles.length > 0) {
		Promise.all(
			potentialStyles.map((styleDescriptor) =>
				loadStyle(styleDescriptor.url)
			)
		).then(mount)
	} else {
		mount()
	}
}

export const fastOverlayMount = (el, { event, focus = false }) => {
	fastOverlayHandleClick(event, {
		isModal: true,
		container: document.querySelector(el.dataset.togglePanel || el.hash),
		clickOutside: true,
		focus,
	})
}
