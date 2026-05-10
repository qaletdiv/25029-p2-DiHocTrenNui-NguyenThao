const {createSlice} = require('@reduxjs/toolkit');

const accountSlice = createSlice({
    name: 'accounts',
    initialState: {
        accounts: [],
        loading: false,
        error: null,
    },
    reducers: {
        
    },
});

export const { } = accountSlice.actions;

export default accountSlice.reducer;