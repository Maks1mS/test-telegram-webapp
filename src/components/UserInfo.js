import React from 'react';
import { Box } from '@quarkly/widgets';
import { useUser } from './App';

const UserInfo = props => {
	const [user, loading, error] = useUser();
	return <Box {...props}>
		    
		{loading}
		    
		{error}
		    
		{JSON.stringify(user)}
		  
	</Box>;
};

export default Object.assign(UserInfo, {
	title: 'UserInfo',
	propInfo: {}
});