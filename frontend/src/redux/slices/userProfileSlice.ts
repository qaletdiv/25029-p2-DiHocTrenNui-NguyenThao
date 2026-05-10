const {createSlice} = require('@reduxjs/toolkit');

const userProfileSlice = createSlice({
    name: 'userProfiles',
    initialState: {
        userProfiles: [],
        loading: false,
        error: null,
    },
    reducers: {
        
    },
});

export const { } = userProfileSlice.actions;

export default userProfileSlice.reducer;