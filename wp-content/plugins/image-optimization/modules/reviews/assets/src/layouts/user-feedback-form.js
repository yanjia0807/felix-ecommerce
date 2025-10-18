import styled from '@emotion/styled';
import { Popover, Flex } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { escapeHTML } from '@wordpress/escape-html';
import { __ } from '@wordpress/i18n';
import useStorage from '../hooks/use-storage';
import Typography from '../../../../../assets/dev/js/components/typography';
import API from '../api';
import DismissButton from '../components/dismiss-button';
import FeedbackForm from '../components/feedback-form';
import RatingForm from '../components/rating-form';
import ReviewForm from '../components/review-form';
import { useNotifications, useSettings } from '../hooks/use-settings';

const UserFeedbackForm = ( ) => {
	const { success, error } = useNotifications();
	const { save, get } = useStorage();
	const {
		rating,
		setRating,
		feedback,
		isOpened,
		setIsOpened,
		setCurrentPage,
	} = useSettings();

	useEffect( () => {
		/**
		 * Show the popover if the user has not submitted repo feedback.
		 */
		if ( window?.imageOptimizerReviewData?.reviewData?.rating > 3 && ! window?.imageOptimizerReviewData?.reviewData?.repo_review_clicked ) {
			setCurrentPage( 'review' );
			setRating( window?.imageOptimizerReviewData?.reviewData?.rating ); // re-add the saved rating
		}
	}, [] );

	/**
	 * Close the popover.
	 * @param {Object} event
	 * @param {string} reason
	 */
	const handleClose = ( event, reason ) => {
		if ( 'backdropClick' !== reason ) {
			setIsOpened( false );
		}
	};

	const id = isOpened ? 'reviews-popover' : undefined;

	const { currentPage } = useSettings();

	const headerMessage = {
		ratings: __( 'How would you rate Image Optimizer so far?', 'image-optimization' ),
		feedback: __( 'We’re thrilled to hear that! What would make it even better?', 'image-optimization' ),
		review: __( "We're thrilled you're enjoying Image Optimizer", 'image-optimization' ),
	};

	const handleSubmit = async ( close, avoidClosing = false ) => {
		try {
			const response = await API.sendFeedback( { rating, feedback } ).then( async ( res ) => {
				await save( {
					image_optimizer_review_data: {
						...get.data.image_optimizer_review_data,
						rating: parseInt( rating ),
						feedback: escapeHTML( feedback ),
						submitted: true,
					},
				} );

				return res;
			} );

			if ( ! response?.success ) {
				/**
				 * Show success message if the feedback was already submitted.
				 */
				await success( __( 'Feedback already submitted', 'image-optimization' ) );
			} else {
				await success( __( 'Thank you for your feedback!', 'image-optimization' ) );
			}

			if ( ! avoidClosing ) {
				await close();
			}

			return true;
		} catch ( e ) {
			error( __( 'Failed to submit!', 'image-optimization' ) );
			console.log( e );
			return false;
		}
	};

	return (
		isOpened && (
			<Popover
				id={ id }
				onClose={ handleClose }
				placement="bottom-start"
				onFocusOutside={ ( e ) => handleClose( e, 'backdropClick' ) }
			>
				<StyledBox>
					<Header>
						<Typography
							variant="subtitle1"
							color="text.primary"
							style={ { fontSize: '16px' } }
						>
							{ headerMessage?.[ currentPage ] }
						</Typography>
						<DismissButton close={ close } />
					</Header>
					{ 'ratings' === currentPage && <RatingForm close={ handleClose } handleSubmitForm={ handleSubmit } /> }
					{ 'feedback' === currentPage && <FeedbackForm close={ handleClose } handleSubmitForm={ handleSubmit } /> }
					{ 'review' === currentPage && <ReviewForm close={ handleClose } /> }
				</StyledBox>
			</Popover>
		)
	);
};

export default UserFeedbackForm;
const StyledBox = styled( Flex )`
	width: 350px;
	padding: ${ ( { theme } ) => theme.spacing[ 1.5 ] };
	flex-direction: column;
`;

const Header = styled( Flex )`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	margin-bottom: ${ ( { theme } ) => theme.spacing[ 1.5 ] };
`;
