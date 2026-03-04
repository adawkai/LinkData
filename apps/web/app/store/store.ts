import "reflect-metadata";
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/auth.slice";
import meReducer from "../features/me/me.slice";
import feedReducer from "../features/post/post.slice";
import relationsReducer from "../features/relation/relation.slice";
import usersReducer from "../features/user/user.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    me: meReducer,
    feed: feedReducer,
    relations: relationsReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
