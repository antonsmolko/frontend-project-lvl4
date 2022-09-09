import { useContext } from 'react';
import { ChatContext } from '../contexts';

export const useChat = () => useContext(ChatContext);
