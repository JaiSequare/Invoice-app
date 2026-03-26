import { createSlice } from '@reduxjs/toolkit'

const initialState  = {
    loginDetails: {},
};

export const loginSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginInfo: (state, action) => {
            state.loginDetails = action.payload
        },
        logout: (state) => {
            state.loginDetails = {}
        },
    }
});

export const { loginInfo, logout } = loginSlice.actions;
export default loginSlice.reducer;