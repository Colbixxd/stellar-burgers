import { ProfileOrdersUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { FC, useEffect } from 'react';
import { fetchOrders } from '@slices';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { data: orders } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
