import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { userLogOut } from '@slices';
import { useDispatch } from '../../services/store';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(userLogOut())
      .unwrap()
      .then(() => {
        navigate('/login'); // Перенаправляем на страницу входа после успешного выхода
      })
      .catch(() => {
        console.error('Ошибка при выходе');
        // Можно добавить уведомление об ошибке
      });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
