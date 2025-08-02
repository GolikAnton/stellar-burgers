import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { Navigate } from 'react-router-dom';
import { getIsAuthenticated, userLogIn } from '@slices';
import { TLoginData } from '@api';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(getIsAuthenticated);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError(''); // Сбрасываем ошибку перед новым запросом

    const userData: TLoginData = { email, password };
    dispatch(userLogIn(userData))
      .unwrap()
      .then(() => {
        // Успешный вход - редирект произойдет автоматически  перерендер компонента
      })
      .catch((err) => {
        setError(err.message || 'Ошибка авторизации');
      });
  };

  // Если уже авторизован - редирект в профиль
  if (isAuthenticated) {
    return <Navigate to='/profile' replace />;
  }

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
