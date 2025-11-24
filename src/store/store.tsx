import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // 使用 localStorage

import globalReducer from "./globalSlice";
import demoReducer from "./demoSlice";
import testReducer from "./testSlice";

// 配置持久化
const persistConfig = {
	key: "root",
	storage,
  };
  

// 创建持久化 reducer
const rootReducer = combineReducers({
	test: testReducer,
	demo: demoReducer,
	global: globalReducer,
  });
const persistedReducer = persistReducer(persistConfig, rootReducer);

const globalStore = configureStore({
	reducer: persistedReducer,
  });
// 创建持久化存储
const persistor = persistStore(globalStore);
export type GlobalDispatch = typeof globalStore.dispatch;
export type GlobalState = ReturnType<typeof globalStore.getState>;

// export default globalStore
export { globalStore, persistor };

