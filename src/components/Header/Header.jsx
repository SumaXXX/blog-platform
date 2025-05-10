import { Avatar, Button } from 'antd'
import classes from './Header.module.scss'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { deleteUser, togglePage } from '../../store/BlogPlatformSlice'

function Header() {
  const navigate = useNavigate()

  const { user } = useSelector(state => state.BlogPlatformApp)

  const dispatch = useDispatch()
  return (
    <header className={classes['blog-header']}>
      <Link
        className={classes['header-title']}
        to={'/articles/1'}
        onClick={() => {
          dispatch(togglePage(1))
        }}
      >
        Realworld Blog
      </Link>
      {user ? (
        <div className={classes['header-buttons']}>
          <Link style={{ marginRight: 10 }} to={'/new-article'}>
            <Button style={{ marginRight: 10 }} color="cyan" variant="outlined" size="small">
              Create Article
            </Button>
          </Link>

          <span style={{ marginRight: 10 }}>{user.username}</span>
          <Link style={{ marginRight: 10 }} to={'/profile'}>
            <Avatar
              src={
                user.image
                  ? user.image
                  : 'https://static.productionready.io/images/smiley-cyrus.jpg'
              }
            />
          </Link>
          <Button
            onClick={() => {
              sessionStorage.removeItem('user')
              dispatch(deleteUser())
              navigate('/articles/1')
            }}
            color="default"
            variant="outlined"
            size="large"
          >
            Log out
          </Button>
        </div>
      ) : (
        <div className={classes['']}>
          <Link to={'/sign-in'}>
            <Button color="default" variant="text" size="large">
              Sign in
            </Button>
          </Link>

          <Link to={'/sign-up'}>
            <Button color="cyan" variant="text" size="large">
              Sign up
            </Button>
          </Link>
        </div>
      )}
    </header>
  )
}

export default Header
