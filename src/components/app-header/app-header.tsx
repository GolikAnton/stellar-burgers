import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { getUserInfo } from '../../services/slices/user/userSlice';

export const AppHeader: FC = () => {
  const userName = useSelector(getUserInfo);

  return (
    <>
      <AppHeaderUI userName={userName?.name} />
    </>
  );
};
