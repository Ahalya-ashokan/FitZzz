import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/site-content`;

// Fetch site content
export const fetchSiteContent = createAsyncThunk(
  "siteContent/fetch",
  async () => {
    const { data } = await axios.get(API_URL);
    return data;
  },
);

//Update site content (Admin)
export const updateSiteContent = createAsyncThunk(
  "siteContent/update",
  async (contentData) => {
    const token = localStorage.getItem("userToken");

    const { data } = await axios.put(API_URL, contentData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  },
);

const siteContentSlice = createSlice({
  name: "siteContent",
  initialState: {
    content: null,
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchSiteContent.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSiteContent.fulfilled, (state, action) => {
        state.loading = false;
        state.content = action.payload;
      })
      .addCase(fetchSiteContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateSiteContent.fulfilled, (state, action) => {
        state.content = action.payload;
      });
  },
});

export default siteContentSlice.reducer;
