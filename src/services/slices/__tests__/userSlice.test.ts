import {
  userGet,
  userRegister,
  userLogIn,
  userLogOut,
  userUpdate,
  userReducer,
  authChecked,
  userInfoSlice,
  TStateUser
} from '@slices';
import { initialState } from '../user/userSlice';

// Моковые данные
const mockUser = {
  success: true,
  user: {
    email: 'test@mail.ru',
    name: 'TestUser'
  },
  accessToken: 'mock-token',
  refreshToken: 'mock-refresh-token'
};

const mockRegisterData = {
  email: 'test@mail.ru',
  name: 'TestUser',
  password: 'password123'
};

const mockUpdatedUser = {
  success: true,
  user: {
    email: 'test@mail.ru',
    name: 'UpdatedName'
  }
};

// const initialState: TStateUser = {
//   isAuthChecked: false,
//   isAuthenticated: false,
//   user: null,
//   loginUserError: null,
//   loginUserRequest: false
// };

describe('userSlice reducers', () => {
  it('should return initial state', () => {
    expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle authChecked', () => {
    const state = userReducer(initialState, authChecked());
    expect(state.isAuthChecked).toBe(true);
  });

  describe('userGet', () => {
    it('pending: sets loading state', () => {
      const state = userReducer(initialState, userGet.pending(''));
      expect(state).toEqual({
        ...initialState,
        loginUserRequest: true,
        isAuthenticated: false,
        user: null
      });
    });

    it('fulfilled: sets user data', () => {
      const action = {
        type: userGet.fulfilled.type,
        payload: { user: mockUser.user }
      };
      const state = userReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isAuthChecked: true,
        isAuthenticated: true,
        user: mockUser.user,
        loginUserRequest: false
      });
    });

    it('rejected: sets error', () => {
      const action = {
        type: userGet.rejected.type,
        error: { message: 'Failed to fetch user' }
      };
      const state = userReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isAuthChecked: true,
        loginUserError: 'Failed to fetch user',
        loginUserRequest: false
      });
    });
  });

  describe('userRegister', () => {
    it('pending: sets loading state', () => {
      const state = userReducer(
        initialState,
        userRegister.pending('', mockRegisterData)
      );
      expect(state.loginUserRequest).toBe(true);
    });

    it('fulfilled: registers user', () => {
      const action = {
        type: userRegister.fulfilled.type,
        payload: mockUser.user
      };
      const state = userReducer(initialState, action);

      expect(state.user).toEqual(mockUser.user);
      expect(state.isAuthenticated).toBe(true);
    });
  });

  describe('userLogIn', () => {
    it('rejected: handles login error', () => {
      const action = {
        type: userLogIn.rejected.type,
        error: { message: 'Invalid credentials' }
      };
      const state = userReducer(initialState, action);

      expect(state.loginUserError).toBe('Invalid credentials');
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('userLogOut', () => {
    const loggedInState = {
      ...initialState,
      isAuthenticated: true,
      user: mockUser.user,
      isAuthChecked: true
    };

    it('pending: sets loading state', () => {
      const state = userReducer(loggedInState, userLogOut.pending(''));
      expect(state).toEqual({
        ...loggedInState,
        loginUserRequest: true
      });
    });

    it('fulfilled: clears user data', () => {
      const state = userReducer(
        loggedInState,
        userLogOut.fulfilled({ success: true }, '')
      );

      expect(state).toEqual({
        ...initialState,
        isAuthChecked: true,
        loginUserRequest: false
      });
    });

    it('rejected: keeps user data on error', () => {
      const error = new Error('Logout failed');
      const state = userReducer(loggedInState, userLogOut.rejected(error, ''));

      expect(state).toEqual({
        ...loggedInState,
        isAuthenticated: false,
        loginUserError: 'Logout failed',
        loginUserRequest: false
      });
    });
  });

  describe('userUpdate', () => {
    const loggedInState = {
      ...initialState,
      isAuthenticated: true,
      user: mockUser.user
    };

    it('fulfilled: updates user data', () => {
      const action = {
        type: userUpdate.fulfilled.type,
        payload: { user: mockUpdatedUser.user }
      };
      const state = userReducer(loggedInState, action);

      expect(state.user).toEqual(mockUpdatedUser.user);
    });
  });
});

describe('userSlice selectors', () => {
  const state = {
    userInfo: {
      ...initialState,
      isAuthChecked: true,
      isAuthenticated: true,
      user: mockUser.user
    }
  };

  it('getUserInfo returns user data', () => {
    expect(userInfoSlice.selectors.getUserInfo(state)).toEqual(mockUser.user);
  });

  it('getIsAuthenticated returns auth status', () => {
    expect(userInfoSlice.selectors.getIsAuthenticated(state)).toBe(true);
  });
});
