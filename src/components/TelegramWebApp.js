import React, { useEffect, useCallback } from 'react';
import { Box } from '@quarkly/widgets';
import { useLogin } from './App';
const whitelistParams = ['id', 'hash', 'first_name', 'last_name', 'username', 'photo_url', 'auth_date'];

const TelegramWebApp = props => {
	const login = useLogin();
	const onLoad = useCallback(() => {
		const tgWebApp = window?.Telegram?.WebApp;
		const data = {};
		let params = new URLSearchParams();

		if (tgWebApp?.initData) {
			params = new URLSearchParams(tgWebApp.initData);
			params.set('type', 'webapp');
			login(params);
		} else {
			params = new URLSearchParams(window.parent.location.search);
			whitelistParams.forEach(k => {
				const v = params.get(k);

				if (v) {
					data[k] = v;
				}
			});

			if (data.hash) {
				params = new URLSearchParams(data);
				params.set('type', 'login_widget');
				login(params);
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