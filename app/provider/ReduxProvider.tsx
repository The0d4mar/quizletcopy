'use client'

import { Provider } from 'react-redux';
import { store } from '../../store/store';
import { ChildrenProps } from '@/types/types.type';

const ReduxProvider = ({
  children,
}: ChildrenProps) => {
  return <Provider store={store}>{children}</Provider>;
};

export { ReduxProvider };
