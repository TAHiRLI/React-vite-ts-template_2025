import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
//import slices

import storage from "redux-persist/lib/storage"; // Default localStorage for web


//Define persist configuration
const persistConfig = {
    key: "root",
    storage,
    whiteList: ['auth']
};

const rootReducer = combineReducers({

});

// Wrap rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);
// Configure store with middleware adjustment
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ["persist/PERSIST", "persist/REHYDRATE",
                    "persist/PURGE",

                ],
            },
        }),
});
export const persistor = persistStore(store);

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;