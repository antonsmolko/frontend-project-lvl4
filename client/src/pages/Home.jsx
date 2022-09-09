import React, { useState, useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import {
	Container,
	Row,
	Col,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import AddChannelButton from '../components/home/channels/AddChannelButton';
import { fetchChannels } from '../features/channels/channelsSlice';
import { useAuth, useChatRoom } from '../hooks';
import ChannelsNav from '../components/home/channels/ChannelsNav';
import Modal from '../components/modals/Modal';
import Messages from '../components/home/messages/Messages';
import SubmitForm from '../components/home/submit-form/SubmitForm';
import ChatProvider from '../providers/ChatProvider';

const selectCurrentChannel = (id) => createSelector(
	(state) => state.channels,
	({ entities }) => (id ? entities[id] : {}),
);

function HomePage() {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { user: { username } } = useAuth();

	const channels = useSelector((state) => Object.values(state.channels.entities));
	const messages = useSelector((state) => Object.values(state.messages.entities));

	const { id: defaultChannelId } = channels.find((channel) => channel.default) || {};
	const [room, setRoom] = useState(defaultChannelId);

	const currentChannel = useSelector(selectCurrentChannel(room));

	const messageBox = useRef(null);
	const messageBoxContainer = useRef(null);

	const setDefaultRoom = () => {
		setRoom(defaultChannelId);
	};

	useLayoutEffect(() => {
		if (!defaultChannelId) { return; }
		setDefaultRoom();
	}, [defaultChannelId]);

	useLayoutEffect( () => {
		dispatch(fetchChannels());
	}, [dispatch]);

	const {
		onAddChannel,
		onRemoveChannel,
		onRenameChannel,
		onSendMessage
	} = useChatRoom(room, setDefaultRoom);

	const addChannel = async (name) => {
		const response = await onAddChannel(name);
		setRoom(response.channel.id);
		return response;
	};

	return (
		<ChatProvider>
			<Container className="flex-grow-1 my-4 overflow-hidden rounded shadow">
				<Row className="h-100 bg-white">
					<Col xs={2} className="px-0 pt-5 border-end bg-light">
						<div className="d-flex justify-content-between align-items-center mb-2 ps-4 pe-2">
							<span>{t('pages.home.title')}</span>
							<AddChannelButton />
						</div>
						<ChannelsNav channels={channels} room={room} setRoom={setRoom} />
					</Col>
					<Col className="p-0 h-100">
						<div className="d-flex flex-column h-100">
							<div className="bg-light mb-4 p-3 shadow-sm small">
								<p className="m-0">
									<b>
										#&nbsp;{currentChannel?.name}
									</b>
								</p>
								<span className="text-muted">
									{t('pages.home.messages', { count: messages.length })}
								</span>
							</div>

							<div id="messages-box" ref={messageBox} className="chat-messages overflow-auto px-5">
								<div ref={messageBoxContainer}>
									<Messages messages={messages} />
								</div>
							</div>

							<SubmitForm username={username} room={room} submit={onSendMessage} />
						</div>
					</Col>
				</Row>
			</Container>

			<Modal
				addAction={addChannel}
				renameAction={onRenameChannel}
				removeAction={onRemoveChannel}
			/>
		</ChatProvider>
	);
}

HomePage.propTypes = {
	username: PropTypes.string,
};

HomePage.defaultProps = {
	username: null,
};

export default HomePage;
