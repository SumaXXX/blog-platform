import classes from './App.module.scss'
import Header from './components/Header/Header'
import { Outlet } from "react-router-dom";
import { loginUser } from './store/BlogPlatformSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user'); 
    if (storedUser) {
      try {
        const userObject = JSON.parse(storedUser);
        dispatch(loginUser(userObject));
      } 
      catch (error) {
        console.error("user error", error);
      }

    }
  }, []);
  return (
    <>
      <div className={classes['app']}>
        <Header />
        <Outlet />
      </div>
    </>
  )
}

export default App
