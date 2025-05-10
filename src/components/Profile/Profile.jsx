import classes from './Profile.module.scss'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../../store/BlogPlatformSlice'

const schema = yup.object().shape({
  username: yup.string().min(3).max(20).required(),
  email: yup.string().email().lowercase().required(),
  password: yup.string().min(6).max(40).required(),
  avatar: yup.string().url(),
})

function Profile() {
  const navigate = useNavigate()
  const [alreadyExist, setAlreadyExist] = useState(false)
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.BlogPlatformApp)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const update = async user => {
    const url = 'https://blog-platform.kata.academy/api/user'
    const token = user.token
    const data = {
      user: {
        username: user.username,
        email: user.email,
        password: user.password,
        image: user.avatar,
      },
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (response.status === 422) {
      setAlreadyExist(true)

      throw new Error(`User is already created! status: ${response.status}`)
    }
    return await response.json()
  }

  const submitForm = async data => {
    setAlreadyExist(false)
    data.token = user.token
    const updatedUser = await update(data)
    sessionStorage.setItem('user', JSON.stringify(updatedUser.user))
    dispatch(updateUser(updatedUser.user))
  }

  if (!user)
    return (
      <div style={{height: '10rem'}} className={classes['login-page']}>
        <h3 className={classes['login-page-title']}>You re not allowed to be here, try <Link to={'/sign-in'}>login</Link></h3>
      </div>
    )

  return (
    <div className={classes['login-page']}>
      <h3 className={classes['login-page-title']}>Edit Profile</h3>
      {alreadyExist && (
        <h3 style={{ color: 'rgba(245, 34, 45, 1)', margin: 0, marginTop: 16 }}>
          Username or email is already taken!
        </h3>
      )}
      <form onSubmit={handleSubmit(submitForm)} className={classes['login-page-form']}>
        <p className={classes['label']}>Username</p>
        <input
          className={errors.username?.message ? classes['input--error'] : classes['input']}
          type="text"
          name="username"
          placeholder={`Username`}
          {...register('username')}
        />
        <span style={{ color: 'rgba(245, 34, 45, 1)' }}>{errors.username?.message}</span>

        <p className={classes['label']}>Email address</p>
        <input
          className={errors.email?.message ? classes['input--error'] : classes['input']}
          type="text"
          name="email"
          placeholder={`Email address`}
          {...register('email')}
        />
        <span style={{ color: 'rgba(245, 34, 45, 1)' }}>{errors.email?.message}</span>

        <p className={classes['label']}>New password</p>
        <input
          className={errors.password?.message ? classes['input--error'] : classes['input']}
          type="text"
          name="password"
          placeholder={`New password`}
          {...register('password')}
        />
        <span style={{ color: 'rgba(245, 34, 45, 1)' }}>{errors.password?.message}</span>

        <p className={classes['label']}>Avatar image (url)</p>
        <input
          className={errors.avatar?.message ? classes['input--error'] : classes['input']}
          type="text"
          name="avatar"
          placeholder={`Avatar image`}
          {...register('avatar')}
        />
        <span style={{ color: 'rgba(245, 34, 45, 1)' }}>{errors.avatar?.message}</span>
        <button type="submit" className={classes['submit']}>
          <span style={{ fontSize: 16, color: '#fff' }}>Save</span>
        </button>
      </form>
    </div>
  )
}

export default Profile
