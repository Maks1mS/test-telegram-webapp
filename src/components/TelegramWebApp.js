import React, { useEffect } from 'react';
import { Box } from '@quarkly/widgets';

const TelegramWebApp = props => {
	useEffect(() => {
		const tgWebAppScript = document.createElement("script");
		tgWebAppScript.src = "https://telegram.org/js/telegram-web-app.js"; // tgWebAppScript.onload = onLoad;

		document.head.appendChild(tgWebAppScript);
		window.__TELEGRAM_WEB_APP_SCRIPT_INJECTED__ = true;
		return () => {
			document.head.removeChild(tgWebAppScript);
			window.__TELEGRAM_WEB_APP_SCRIPT_INJECTED__ = false;
		};
	}, []);
	return <Box {...props}>
		{JSON.stringify(window?.Telegram?.WebApp?.initData?.user)}
	</Box>;
};

export default Object.assign(TelegramWebApp, {
	title: 'TelegramWebApp',
	propInfo: {}
});