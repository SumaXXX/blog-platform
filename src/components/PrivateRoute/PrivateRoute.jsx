import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function PrivateRoute({children}) {
  const { user } = useSelector(state => state.BlogPlatformApp)
  console.log(user)
  if (!user || !user.token) {
    return <Navigate to="/sign-in" replace />
  }
  return children
}

export default PrivateRoute
