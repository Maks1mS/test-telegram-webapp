import React, { useCallback, createContext } from 'react';
import Cookies from 'js-cookie';
import { Box } from '@quarkly/widgets';
import atomize from "@quarkly/atomize";
import { useCookies } from 'react-cookie';
import useSWR, { useSWRConfig } from 'swr';
export const AppContext = createContext();

class API {
	static get API_URL() {
		return 'https://isleepbot.slipenko.com/api';
	}

}

const fetchWithToken = async endpoint => {
	const token = loadUserData();
	const res = await fetch(`${API.API_URL}${endpoint}`, {
		headers: {
			'Authorization': `Bearer ${token.toString()}`
		}
	});

	if (!res.ok) {
		const error = new Error('An error occurred while fetching the data.');
		error.info = await res.json();
		error.status = res.status;
		throw error;
	}

	return res.json();
};

const fetchUser = async endpoint => {
	return fetchWithToken(endpoint).catch(err => {
		if (err.status === 400) {
			return 'unauthorized';
		}

		throw err;
	});
};

const TG_USER_DATA_KEY = "isleepbot_tg_user_data";
export const loadUserData = () => {
	return new URLSearchParams(Cookies.get(TG_USER_DATA_KEY));
};
export const saveUserData = data => {
	console.log('SAVE USER DATA', data.toString());

	if (data == null) {
		Cookies.remove(TG_USER_DATA_KEY);
	} else {
		Cookies.set(TG_USER_DATA_KEY, data.toString());
	}
};

const useToken = () => {
	const [cookies, setCookie, removeCookie] = useCookies([TG_USER_DATA_KEY]);
	return new URLSearchParams(cookies[TG_USER_DATA_KEY]);
};

export const useUser = () => {
	// const isReady = useIsReady()
	const token = useToken();
	const {
		data,
		error
	} = useSWR('/v1/users/me', fetchUser);
	console.log('useUser');

	if (data && data !== 'unauthorized') {
		const type = token.get('type');

		if (type === 'login_widget') {
			Object.assign(data, {
				tg: Object.fromEntries(token)
			});
		} else if (type === 'webapp') {
			const tgUser = token.get('user');
			console.log('TGUSER');
			console.log(tgUser);
			Object.assign(data, {
				tg: JSON.parse(tgUser)
			});
		}
	}

	return [data === 'unauthorized' ? null : data, !error && !data, error];
};
export const useLogin = () => {
	const {
		mutate
	} = useSWRConfig();
	return useCallback(async data => {
		saveUserData(data);
		mutate('/v1/users/me');
	}, []);
};
export const useLogout = () => {
	const {
		mutate
	} = useSWRConfig();
	return useCallback(async data => {
		saveUserData(undefined);
		mutate('/v1/users/me');
	}, []);
};
export const useArticles = () => {
	const token = useToken();
	const {
		data,
		error
	} = useSWR(['/v1/articles', token], fetchWithToken);
	return [data, !error && !data, error];
};
export const useArticle = id => {
	const token = useToken();
	const {
		data,
		error
	} = useSWR([`/v1/articles/${id}`, token], fetchWithToken);
	return [data, !error && !data, error];
};
export const useMarkArticleAsRead = () => {
	const {
		mutate
	} = useSWRConfig();
	return useCallback(async id => {
		const token = loadUserData();
		mutate(['/v1/articles', token], async articles => {
			const article = await fetch(`${API.API_URL}/v1/articles/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({
					isRead: true
				})
			});
			const filteredArticles = articles.filter(article => article.id !== id);
			mutate([`/v1/article/${article.id}`, token], article);
			return [...filteredArticles, article];
		});
	}, []);
};

const App = ({
	children,
	...props
}) => {
	return <Box min-height="64px" min-width="10px" {...props}>
		    
		<AppContext.Provider>
			      
			{children}
			    
		</AppContext.Provider>
		  
	</Box>;
};

export default atomize(App)({
	name: "App",
	effects: {
		hover: ":hover"
	},
	normalize: true,
	mixins: true,
	description: {
		// paste here description for your component
		en: "App — my awesome component"
	},
	propInfo: {}
});