import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import { persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage";
import { authSlice } from "@/lib/features/auth/authSlice";
import { userSlice } from "@/lib/features/user/userSlice";

// const persistConfig = {
//   key: "root",
//   version: 1,
//   storage,
// };

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  user: userSlice.reducer,
});
// const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;
type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;

export type { RootState, AppDispatch, AppThunk };
export { store };
