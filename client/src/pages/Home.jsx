import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import { BsPlusSquare } from 'react-icons/bs';
import {
	Container,
	Row,
	Col,
	Button,
	Nav,
	InputGroup,
	ButtonGroup,
	Dropdown,
} from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';
import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';
import ButtonSubmit from '../components/form/ButtonSubmit.jsx';
import socket from '../app/socket-io';
import {
	fetchChannels,
	getChannel,
	addChannel,
	removeChannel,
	renameChannel,
} from '../features/channels/channelsSlice';
import { addMessage } from '../features/messages/messagesSlice';
import getModal from '../components/modals';
import store from '../app/store';

const selectCurrentChannel = createSelector(
	(state) => state.channels,
	({ entities, currentChannelId }) => (currentChannelId ? entities[currentChannelId] : {}),
);

const renderMessages = (messages) => messages.map(({ id, username, text }) => (
	<div key={id} className="text-break mb-2">
		<b>{username}</b>
		:
		{' '}
		{text}
	</div>
));

function HomePage({ username }) {
	const channels = useSelector((state) => Object.values(state.channels.entities));
	const currentChannelId = useSelector((state) => state.channels.currentChannelId);
	const currentChannel = useSelector(selectCurrentChannel);
	const messages = useSelector((state) => Object.values(state.messages.entities));
	const messageBox = useRef(null);
	const messageBoxContainer = useRef(null);

	const { t } = useTranslation();
	const dispatch = useDispatch();

	const handleAddChannel = (item) => new Promise((resolve, reject) => {
		if (!socket.connected) {
			reject();
		}

		socket.emit('newChannel', item, (response) => {
			if (response.status === 'ok') {
				dispatch(getChannel({ id: response.id }));
			}

			resolve(response);
		});
	});

	const handleRemoveChannel = (id) => {
		if (!socket.connected) { return; }
		socket.emit('removeChannel', { id });
	};

	const handleRenameChannel = (item) => new Promise((resolve, reject) => {
		if (!socket.connected) {
			reject();
		}

		socket.emit('renameChannel', item, (response) => {
			resolve(response);
		});
	});

	const renderModal = ({ modalInfo, hideModal, showModal }) => {
		const mapping = {
			adding: handleAddChannel,
			removing: handleRemoveChannel,
			renaming: handleRenameChannel,
		};

		const { type } = modalInfo;

		if (!type || !Object.keys(mapping).includes(type)) {
			return null;
		}

		const action = mapping[type];

		const Component = getModal(type);
		return <Component modalInfo={modalInfo} show={showModal} onHide={hideModal} action={action} />;
	};

	const renderChannels = (showModal) => (
		channels.map(({ name, id, removable }) => {
			const buttonVariant = id === currentChannelId ? 'secondary' : null;

			const buttonTitle = () => (
				<>
					<span className="me-2">#</span>
					{name}
				</>
			);

			return removable
				? (
					<Nav.Item key={id}>
						<Dropdown as={ButtonGroup} className="w-100">
							<Button
								onClick={() => dispatch(getChannel({ id }))}
								variant={buttonVariant}
								className="ps-4 pe-1 rounded-0 text-start w-0"
							>
								<span className="d-block text-truncate">{buttonTitle()}</span>
							</Button>
							<Dropdown.Toggle split variant={buttonVariant} className="rounded-0 flex-grow-0 px-2" />
							<Dropdown.Menu>
								<Dropdown.Item onClick={() => showModal('removing', { id, name })}>
									{t('actions.delete')}
								</Dropdown.Item>
								<Dropdown.Item onClick={() => showModal('renaming', { id, name })}>
									{t('actions.rename')}
								</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					</Nav.Item>
				)
				: (
					<Nav.Item key={id}>
						<Button
							variant={buttonVariant}
							onClick={() => dispatch(getChannel({ id }))}
							className="w-100 px-4 rounded-0 text-start"
						>
							{buttonTitle()}
						</Button>
					</Nav.Item>
				);
		})
	);

	useEffect(() => {
		dispatch(fetchChannels());
	}, [dispatch]);

	useEffect(() => {
		socket.on('newMessage', (message) => {
			console.log('newMessage on');
			if (message.channel === currentChannel.id) {
				console.log('currentChannel.id', currentChannel.id);
				console.log('===================================');
				dispatch(addMessage(message));
			} else {
				console.log('not current channel', currentChannel.id);
				console.log('===================================');
			}
		});

		socket.on('newChannel', (data) => dispatch(addChannel(data)));
		socket.on('removeChannel', async (id) => {
			const _currentChannelId = store.getState().channels.currentChannelId;
			const _channels = Object.values(store.getState().channels.entities);

			if (id === _currentChannelId) {
				const { id } = _channels.find((channel) => channel.default);
				await dispatch(getChannel({ id }));
			}

			dispatch(removeChannel(id));
		});
		socket.on('renameChannel', (data) => dispatch(renameChannel(data)));
	}, [currentChannel, dispatch]);

	const [modalInfo, setModalInfo] = useState({ type: null, item: null });
	const hideModal = () => setModalInfo({ type: null, item: null });
	const showModal = (type, item = null) => setModalInfo({ type, item });
	const sendNewMessage = async (message, actions) => {
		if (!message.trim()) return;

		filter.loadDictionary('ru');
		const text = filter.clean(message);

		const payload = { username, text, channel: currentChannelId };

		socket.connected && socket.emit('newMessage', payload, ({ status }) => {
			if (status === 'ok') {
				actions.resetForm();
			}
		});
	};

	return (
		<>
			<Container className="flex-grow-1 my-4 overflow-hidden rounded shadow">
				<Row className="h-100 bg-white">
					<Col xs={2} className="px-0 pt-5 border-end bg-light">
						<div className="d-flex justify-content-between align-items-center mb-2 ps-4 pe-2">
							<span>{t('pages.home.title')}</span>
							<button
								type="button"
								onClick={() => showModal('adding')}
								className="p-0 text-primary btn btn-group-vertical"
							>
								<BsPlusSquare />
							</button>
						</div>
						<Nav variant="pills" className="flex-column">
							{renderChannels(showModal)}
						</Nav>
					</Col>
					<Col className="p-0 h-100">
						<div className="d-flex flex-column h-100">
							<div className="bg-light mb-4 p-3 shadow-sm small">
								<p className="m-0">
									<b>
										#
										{currentChannel.name}
									</b>
								</p>
								<span className="text-muted">
									{t('pages.home.messages', { count: messages.length })}
								</span>
							</div>
							<div id="messages-box" ref={messageBox} className="chat-messages overflow-auto px-5">
								<div ref={messageBoxContainer}>{renderMessages(messages)}</div>
							</div>
							<div className="border-top mt-auto py-3 px-5">
								<Formik
									initialValues={{ message: '' }}
									onSubmit={({ message }, actions) => sendNewMessage(message, actions)}
								>
									<Form>
										<InputGroup>
											<Field name="message">
												{({ field, form: { isSubmitting } }) => (
													<input
														{...field}
														disabled={isSubmitting}
														type="text"
														placeholder={t('form.placeholder.message')}
														className="form-control border-0"
													/>
												)}
											</Field>
											<ButtonSubmit />
										</InputGroup>
									</Form>
								</Formik>
							</div>
						</div>
					</Col>
				</Row>
			</Container>
			{renderModal({ modalInfo, hideModal, showModal })}
		</>
	);
}

HomePage.propTypes = {
	username: PropTypes.string,
};

HomePage.defaultProps = {
	username: null,
};

export default HomePage;
