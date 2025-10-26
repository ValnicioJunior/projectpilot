import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

const user = (() => {
  const storedUser = localStorage.getItem('user');
  if (!storedUser || storedUser === 'undefined') return null;
  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
})();

const token = localStorage.getItem('token') === 'undefined' ? null : localStorage.getItem('token');

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: {
    auth: {
      user: user,
      token: token,
      isAuthenticated: !!token,
    },
  },
});

export default store;
