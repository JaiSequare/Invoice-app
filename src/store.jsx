// import { configureStore } from '@reduxjs/toolkit'
// import { loginSlice } from './redux/slices/loginSLice'

// export const store = configureStore({
//   reducer: {
//     auth: loginSlice.reducer,
//   },
// });

// ----------------------------------------------------------

import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from '@reduxjs/toolkit'
import { loginSlice } from './redux/slices/loginSLice'
import { persistStore, persistReducer } from 'redux-persist'

const storage = {
  getItem: (key) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
  removeItem: (key) => Promise.resolve(localStorage.removeItem(key)),
};

const rootReducer = combineReducers({
  auth: loginSlice.reducer,
  // ← Add more reducers here — super easy to maintain
})


const persistConfig = {
  key: 'root',
  storage,
  // whitelist: ['auth'], // ← uncomment if you only want to persist specific slices
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export const persistor = persistStore(store)