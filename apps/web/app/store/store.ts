import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import meReducer from "../features/me/meSlice";
import profilesReducer from "../features/profiles/profilesSlice";
import feedReducer from "../features/feed/feedSlice";
import relationsReducer from "../features/relations/relationsSlice";
import usersReducer from "../features/users/usersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    me: meReducer,
    profiles: profilesReducer,
    feed: feedReducer,
    relations: relationsReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

