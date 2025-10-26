import {
	Fragment,
	createElement,
	createPortal,
	useEffect,
	useState,
	useRef,
} from '@wordpress/element'

const ContentWithBeforeAndAfter = ({
	tagName: TagName,
	children,
	before,
	after,
	...rest
}) => {
	const [data, setData] = useState(null)

	const beforeContent = before ? before : ''
	const afterContent = after ? after : ''

	const dynamicContent = useRef(null)

	const hasHtml =
		beforeContent.indexOf('<') !== -1 || afterContent.indexOf('<') !== -1

	useEffect(() => {
		if (hasHtml) {
			setData(Math.random())
		}
	}, [before, after])

	// No portal is needed if there's no HTML in before or after
	if (!hasHtml) {
		return (
			<Fragment>
				{beforeContent}
				{children}
				{afterContent}
			</Fragment>
		)
	}

	return (
		<Fragment>
			<span
				ref={dynamicContent}
				dangerouslySetInnerHTML={{
					__html: `${before}<span></span>${after}`,
				}}
				{...rest}
			/>

			{dynamicContent.current &&
				dynamicContent.current.querySelector('span') &&
				createPortal(
					children,
					dynamicContent.current.querySelector('span')
				)}
		</Fragment>
	)
}

export default ContentWithBeforeAndAfter
