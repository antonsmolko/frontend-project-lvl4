import React from 'react';
import { Nav } from 'react-bootstrap';

import ChannelNavItemRemovable from './ChannelNavItemRemovable';
import ChannelNavItem from './ChannelNavItem';
import { useChat} from '../../../hooks';

const ChannelsNav = ({ channels, room, setRoom }) => {
	const { removeChannel, renameChannel } = useChat();

	return (
		<Nav variant="pills" className="flex-column">
			{
				channels.map(({ name, id, removable }) => {
					const variant = id === room ? 'secondary' : null;

					return removable
						? <ChannelNavItemRemovable
							key={id}
							name={name}
							changeRoom={() => setRoom(id)}
							remove={() => removeChannel({ id, name })}
							rename={() => renameChannel({ id, name })}
							variant={variant}
						/>
						: <ChannelNavItem
							key={id}
							name={name}
							changeRoom={() => setRoom(id)}
							variant={variant}
						/>;
				})
			}
		</Nav>
	);
};

export default ChannelsNav;
