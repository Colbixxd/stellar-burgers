import { FC } from 'react';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const { data } = useSelector((state) => state.feed);

  const readyOrders = getOrders(data.orders, 'done');

  const pendingOrders = getOrders(data.orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{
        total: data.total,
        totalToday: data.totalToday
      }}
    />
  );
};
