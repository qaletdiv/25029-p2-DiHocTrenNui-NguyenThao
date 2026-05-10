const { configureStore } = require("@reduxjs/toolkit");

import studentReducer from "./slices/studentSlice";
import accountReducer from "./slices/accountSlice";
import userProfileReducer from "./slices/userProfileSlice";
import sponsorReducer from "./slices/sponsorSlice";

export const studentStore = () => {
    return configureStore({
        reducer: {
            students: studentReducer,
        },
    });
};

export const accountStore = () => {
    return configureStore({
        reducer: {
            accounts: accountReducer,
        },
    });
};

export const userProfileStore = () => {
    return configureStore({
        reducer: {
            userProfiles: userProfileReducer,
        },
    });
};

export const sponsorStore = () => {
    return configureStore({
        reducer: {
            sponsors: sponsorReducer,
        },
    });
};