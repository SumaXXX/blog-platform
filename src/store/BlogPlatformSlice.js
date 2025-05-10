import { createSlice } from '@reduxjs/toolkit'

const BlogPlatform = createSlice({
  name: 'blogPlatform',
  initialState: {
    user: null,
  },
  reducers: {
    registerNewUser(state, action) {
      state.user = action.payload
    },
    loginUser(state, action) {
      state.user = action.payload
    },
    updateUser(state, action) {
      state.user = action.payload
    },
    deleteUser(state) {
      state.user = null;
    }
  },
})

export const { togglePage, registerNewUser, loginUser, updateUser, deleteUser } = BlogPlatform.actions
export default BlogPlatform.reducer
