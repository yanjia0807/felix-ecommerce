import styled from '@emotion/styled';
import { Button } from '@wordpress/components';
import { date } from '@wordpress/date';
import { useSettings } from '../hooks/use-settings';
import useStorage from '../hooks/use-storage';

const DismissButton = () => {
	const { save, get } = useStorage();
	const { setIsOpened } = useSettings();

	const handleDismiss = async () => {
		if ( get.hasFinishedResolution ) {
			await save( {
				image_optimizer_review_data: {
					...get?.data?.image_optimizer_review_data || {
						rating: null,
						feedback: null,
						submitted: false,
						repo_review_clicked: false,
					},
					dismissals: ( get?.data?.image_optimizer_review_data?.dismissals || 0 ) + 1,
					hide_for_days: ( get?.data?.image_optimizer_review_data?.hide_for_days || 0 ) + 30,
					last_dismiss: date( 'Y-m-d H:i:s' ),
				},
			} );
		}

		setIsOpened( false );
	};

	return (
		<StyledButton
			onClick={ handleDismiss }
			variant="tertiary"
			aria-label="Dismiss"
		>
			×
		</StyledButton>
	);
};

export default DismissButton;

const StyledButton = styled( Button )`
	color: #515962 !important;
	align-items: center;
	justify-content: center;
	padding: 10px !important;
	font-size: 24px !important;
`;
