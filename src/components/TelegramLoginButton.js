import React, { useCallback } from 'react';
import TelegramLoginButton from 'react-telegram-login';
import { Box } from '@quarkly/widgets';
import { useLogin } from './App';

const QuarklyTelegramLoginButton = ({
	buttonSize,
	userPic,
	...props
}) => {
	const login = useLogin();
	const dataOnauth = useCallback(data => {
		const params = new URLSearchParams(data);
		params.set('type', 'login_widget');
		login(params);
	}, []);
	const key = `${buttonSize}${userPic}`;
	return <Box {...props}>
		    
		<TelegramLoginButton
			key={key}
			buttonSize={buttonSize}
			dataOnauth={dataOnauth}
			usePic={userPic}
			botName="maks1ms_test_1_bot"
		/>
		  
	</Box>;
};

export default Object.assign(QuarklyTelegramLoginButton, {
	title: "TelegramLoginButton",
	propInfo: {
		buttonSize: {
			control: "select",
			variants: [{
				title: "Small",
				value: "small"
			}, {
				title: "Medium",
				value: "medium"
			}, {
				title: "Large",
				value: "Large"
			}]
		},
		userPic: {
			title: {
				en: "Show user photo"
			},
			control: "checkbox"
		}
	},
	defaultProps: {
		display: "inline-block",
		userPic: true,
		buttonSize: "large"
	}
});