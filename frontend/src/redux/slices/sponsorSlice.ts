const {createSlice} = require('@reduxjs/toolkit');

const sponsorSlice = createSlice({
    name: 'sponsors',
    initialState: {
        sponsors: [],
        loading: false,
        error: null,
    },
    reducers: {
        
    },
});

export const { } = sponsorSlice.actions;

export default sponsorSlice.reducer;