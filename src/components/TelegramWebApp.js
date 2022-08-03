import React, { useEffect, useCallback } from 'react';
import { Box } from '@quarkly/widgets';
import { useLogin } from './App';

const TelegramWebApp = props => {
	const login = useLogin();
	const onLoad = useCallback(() => {
		const tg = window?.Telegram?.WebApp;

		if (tg?.initDataUnsafe?.user) {
			login({
				hash: tg?.initDataUnsafe?.hash,
				...tg?.initDataUnsafe?.user
			});
		} else {
			const params = new URLSearchParams(window.parent.location.search);
			const data = {};
			whitelistParams.forEach(k => {
				const v = params.get(k);

				if (v) {
					data[k] = v;
				}
			});

			if (data.hash) {
				login(data);
			}
		}
	}, []);
	useEffect(() => {
		const tgWebAppScript = document.createElement("script");
		tgWebAppScript.src = "https://telegram.org/js/telegram-web-app.js";
		tgWebAppScript.onload = onLoad;
		document.head.appendChild(tgWebAppScript);
		window.__TELEGRAM_WEB_APP_SCRIPT_INJECTED__ = true;
		return () => {
			document.head.removeChild(tgWebAppScript);
			window.__TELEGRAM_WEB_APP_SCRIPT_INJECTED__ = false;
		};
	}, []);
	return <Box {...props}></Box>;
};

export default Object.assign(TelegramWebApp, {
	title: 'TelegramWebApp',
	propInfo: {}
});