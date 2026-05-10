const {createSlice} = require('@reduxjs/toolkit');

const studentSlice = createSlice({
    name: 'students',
    initialState: {
        students: [],
        loading: false,
        error: null,
    },
    reducers: {
        
    },
});

export const { } = studentSlice.actions;

export default studentSlice.reducer;