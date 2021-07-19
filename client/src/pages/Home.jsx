import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Button, Nav, InputGroup } from 'react-bootstrap';
import { Formik, Form, Field } from "formik";
import ButtonSubmit from "../components/form/ButtonSubmit";
import socket from '../app/socket-io';
import { fetchMessagesByChannelId, fetchChannels, setCurrentChannelId } from "../features/chat/chatSlice";

const HomePage = ({ username }) => {
    const channels = useSelector((state) => state.chat.channels)
    const currentChannelId = useSelector((state) => state.chat.currentChannelId)
    const messages = useSelector((state) => state.chat.messages);

    const dispatch = useDispatch()

    const getCurrentChannelMessages = (channelId) => {
        dispatch(fetchMessagesByChannelId(channelId));
    }

    const renderChannels = () => (
        channels.map(({ name, id }) => {
            const buttonVariant = id === currentChannelId ? 'secondary' : null

            return (
                <Nav.Item key={id}>
                    <Button
                        variant={buttonVariant}
                        onClick={() => dispatch(setCurrentChannelId(id))}
                        className="w-100 px-4 rounded-0 text-start"
                    >
                        <span className="me-3">#</span>{name}
                    </Button>
                </Nav.Item>
            );
        })
    );

    const renderMessages = () => messages.map(({ id, username, text }) => (
        <div key={id} className="text-break mb-2"><b>{username}</b>: {text}</div>
    ));

    useEffect(() => {
        dispatch(fetchChannels())
    }, [dispatch])

    useEffect(() => {
        if (currentChannelId) {
            getCurrentChannelMessages(currentChannelId);
        }

        socket.on('newMessage', (message) => {
            if (message.channel === currentChannelId) {
                getCurrentChannelMessages(message.channel)
            }
            window.scrollTo(0, document.body.scrollHeight);
        });
    }, [currentChannelId])

    return (
        <Container className="flex-grow-1 my-4 overflow-hidden rounded shadow">
            <Row className="h-100 bg-white">
                <Col xs={2} className="px-0 pt-5 border-end bg-light">
                   <div className="d-flex justify-content-between mb-2 px-4">
                      <span>Каналы</span>
                      <button type="button" className="p-0 text-primary btn btn-group-vertical">
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                            <path
                                d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"
                            />
                            <path
                                d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
                            />
                         </svg>
                        <span className="visually-hidden">+</span>
                      </button>
                   </div>
                   <Nav variant="pills" className="flex-column">
                     {renderChannels()}
                   </Nav>
                </Col>
                <Col className="p-0 h-100">
                    <div className="d-flex flex-column h-100">
                        <div className="bg-light mb-4 p-3 shadow-sm small">
                            <p className="m-0"><b># general</b></p>
                            <span className="text-muted">{messages.length} сообщений</span>
                        </div>
                        <div id="messages-box" className="chat-messages overflow-auto px-5 ">
                            {renderMessages()}
                        </div>
                        <div className="border-top mt-auto py-3 px-5">
                            <Formik
                                initialValues={{
                                    message: '',
                                }}
                                onSubmit={async ({ message }, actions) => {
                                    socket.emit('newMessage', {
                                        username,
                                        text: message,
                                        channel: currentChannelId,
                                    }, ({ status }) => {
                                        if (status === 'ok') {
                                            console.log('message ok')
                                        }
                                    });

                                    actions.resetForm();
                                }}
                            >
                                <Form>
                                    <InputGroup>
                                        <Field
                                            name="message"
                                            placeholder="Введите сообщение..."
                                            className="form-control border-0"
                                        />
                                      <ButtonSubmit/>
                                    </InputGroup>
                                </Form>
                            </Formik>
                        </div>
                   </div>
                </Col>
            </Row>
        </Container>
    );
};

export default HomePage;
