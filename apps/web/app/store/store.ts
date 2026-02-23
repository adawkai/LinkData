import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import meReducer from "../features/me/meSlice";
import profilesReducer from "../features/profiles/profilesSlice";
import feedReducer from "../features/feed/feedSlice";
import relationsReducer from "../features/relations/relationsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    me: meReducer,
    profiles: profilesReducer,
    feed: feedReducer,
    relations: relationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

