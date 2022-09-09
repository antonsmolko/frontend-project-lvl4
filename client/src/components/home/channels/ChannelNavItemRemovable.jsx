import { Button, ButtonGroup, Dropdown, Nav } from 'react-bootstrap';
import ChannelNavItemTitle from './ChannelNavItemTitle';
import React from 'react';
import { useTranslation } from 'react-i18next';

const ChannelNavItemRemovable = ({
	name,
	remove,
	rename,
	changeRoom,
	variant = null
}) => {
	const { t } = useTranslation();

	return (
		<Nav.Item>
			<Dropdown as={ButtonGroup} className="w-100">
				<Button
					onClick={changeRoom}
					variant={variant}
					className="ps-4 pe-1 rounded-0 text-start w-0"
				>
					<span className="d-block text-truncate">
						<ChannelNavItemTitle name={name} />
					</span>
				</Button>
				<Dropdown.Toggle
					split
					variant={variant}
					className="rounded-0 flex-grow-0 px-2"
				/>
				<Dropdown.Menu>
					<Dropdown.Item onClick={remove}>
						{t('actions.delete')}
					</Dropdown.Item>
					<Dropdown.Item onClick={rename}>
						{t('actions.rename')}
					</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>
		</Nav.Item>
	);
};

export default ChannelNavItemRemovable;
