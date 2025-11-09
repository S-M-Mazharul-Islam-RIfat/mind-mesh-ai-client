import { configureStore } from "@reduxjs/toolkit";
import authReducer from './features/auth/authSlice';
import notificationReducer from './features/notification/notificationSlice';
import { baseApi } from "./api/baseApi";
import { persistStore, persistReducer } from 'redux-persist';
import {
   FLUSH,
   REHYDRATE,
   PAUSE,
   PERSIST,
   PURGE,
   REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage';

const persistConfig = {
   key: 'auth',
   storage,
}

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistNotificationReducer = persistReducer(persistConfig, notificationReducer)

export const store = configureStore({
   reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      auth: persistedAuthReducer,
      notifications: persistNotificationReducer
   },
   middleware: getDefaultMiddlewares => getDefaultMiddlewares({
      serializableCheck: {
         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
   }).concat(baseApi.middleware)
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const persistor = persistStore(store);