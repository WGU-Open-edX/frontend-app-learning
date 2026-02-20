import React from 'react';
import { AppProvider } from '@openedx/frontend-base';
import { Provider as ReduxProvider } from 'react-redux';
import { UserMessagesProvider } from './generic/user-messages';
import NoticesProvider from './generic/notices';
import PathFixesProvider from './generic/path-fixes';
import initializeStore from './store';

const store = initializeStore();

const ReduxStoreProvider: AppProvider = ({ children }) => (
  <ReduxProvider store={store}>{children}</ReduxProvider>
);

// Wrap providers to match AppProvider interface
const PathFixesProviderWrapper: AppProvider = ({ children }) => (
  <PathFixesProvider>{children as any}</PathFixesProvider>
);

const NoticesProviderWrapper: AppProvider = ({ children }) => (
  <NoticesProvider>{children as any}</NoticesProvider>  
);

const UserMessagesProviderWrapper: AppProvider = ({ children }) => (
  <UserMessagesProvider>{children as any}</UserMessagesProvider>
);

const providers: AppProvider[] = [
  ReduxStoreProvider,
  PathFixesProviderWrapper,
  NoticesProviderWrapper,
  UserMessagesProviderWrapper,
];

export default providers;
export { store };
