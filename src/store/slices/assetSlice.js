import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    publicAssets: [],
    myAssets: [],
    loading: true
}

const assetSlice = createSlice({
    name: "asset",
    initialState,
    reducers:{
        setPublicAssets: (state,action) => {
            state.publicAssets = action.payload;
            state.loading = false;
        },
        setMyAssets: (state,action) =>{
            state.myAssets = action.payload;
            state.loading = false;
        },
        setLoading: (state,action)=>{
            state.loading = action.payload
        },
        addAsset: (state,action) =>{
            state.myAssets.unshift(action.payload)
        }
    }
})

export const {

    setPublicAssets,
    setMyAssets,
    setLoading,
    addAsset

} = assetSlice.actions;

export default assetSlice.reducer;