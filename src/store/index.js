import { configureStore } from '@reduxjs/toolkit'
import BlogPlatformReducer from './BlogPlatformSlice'

export default configureStore(
  {
    reducer: {
      BlogPlatformApp: BlogPlatformReducer,
    },
  },
)
