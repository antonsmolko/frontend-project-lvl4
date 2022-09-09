import React from 'react';
import { Button, Nav } from 'react-bootstrap';
import ChannelNavItemTitle from './ChannelNavItemTitle';

const ChannelNavItem = ({ name, changeRoom, variant = null }) => (
	<Nav.Item>
		<Button
			variant={variant}
			onClick={changeRoom}
			className="w-100 px-4 rounded-0 text-start"
		>
			<ChannelNavItemTitle name={name} />
		</Button>
	</Nav.Item>
);

export default ChannelNavItem;
