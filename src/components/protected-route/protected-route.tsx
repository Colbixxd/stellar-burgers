import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { FC } from 'react';
import { Preloader } from '@ui';
import { ReactElement } from 'react';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactElement;
};

export const ProtectedRoute: FC<TProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const { isAuthChecked, data: user } = useSelector((state) => state.user);
  const location = useLocation();
  if (!isAuthChecked) {
    return <Preloader />;
  }
  if (onlyUnAuth && user.email && user.name) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  if (!onlyUnAuth && (!user.email || !user.name)) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return children;
};
