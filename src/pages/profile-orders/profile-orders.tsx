import { getUserFeed, getUserFeedLoading, userFeed } from '@slices';
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(getUserFeed);
  const dispatch = useDispatch();
  const isLoading = useSelector(getUserFeedLoading);

  useEffect(() => {
    dispatch(userFeed());
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
