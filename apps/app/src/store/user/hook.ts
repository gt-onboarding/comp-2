import { useContext } from 'react';
import { useStore } from 'zustand';
import { UserContext, type UserState } from './store';
import { useGT } from 'gt-next';

export function useUserContext<T>(selector: (state: UserState) => T): T {
  const t = useGT();
  const store = useContext(UserContext);

  if (!store) {
    throw new Error(t('Missing UserContext.Provider in the tree'));
  }

  return useStore(store, selector);
}
