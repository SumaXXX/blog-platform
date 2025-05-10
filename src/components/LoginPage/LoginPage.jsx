import classes from './LoginPage.module.scss'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginUser } from '../../store/BlogPlatformSlice'

const schema = yup.object().shape({
  email: yup.string().email().lowercase().required(),
  password: yup.string().min(6).max(40).required(),
})

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [tryAgain, setTryAgain] = useState(false)

  const login = async user => {
    const url = 'https://blog-platform.kata.academy/api/users/login'

    const data = {
      user: {
        email: user.email,
        password: user.password,
      },
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (response.status === 422) {
      setTryAgain(true)
      throw new Error(`Try again! status: ${response.status}`)
    }
    return await response.json()
  }

  const submitForm = async data => {
    console.log(data)

    setTryAgain(false)
    const user = await login(data)
    sessionStorage.setItem('user', JSON.stringify(user.user))
    dispatch(loginUser(user.user))
    navigate('/articles/1')
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })
  return (
    <div className={classes['login-page']}>
      <h3 className={classes['login-page-title']}>Sign In</h3>
      {tryAgain && <h3 style={{ color: 'rgba(245, 34, 45, 1)' }}>Try Again!</h3>}
      <form onSubmit={handleSubmit(submitForm)} className={classes['login-page-form']}>
        <p className={classes['label']}>Email address</p>
        <input
          className={errors.username?.message ? classes['input--error'] : classes['input']}
          type="text"
          name="email"
          placeholder={`Email address`}
          {...register('email')}
        />
        <span style={{ color: 'rgba(245, 34, 45, 1)' }}>{errors.email?.message}</span>

        <p className={classes['label']}>Password</p>
        <input
          className={errors.username?.message ? classes['input--error'] : classes['input']}
          type="text"
          name="password"
          placeholder={`Password`}
          {...register('password')}
        />
        <span style={{ color: 'rgba(245, 34, 45, 1)' }}>{errors.password?.message}</span>

        <button type="submit" className={classes['submit']}>
          <span style={{ fontSize: 16, color: '#fff' }}>Sign In</span>
        </button>
        <p style={{ fontSize: 12 }}>
          Don’t have an account?{' '}
          <Link style={{ textDecoration: 'none', color: 'rgba(24, 144, 255, 1)' }} to={'/sign-up'}>
            Sign Up
          </Link>
          .
        </p>
      </form>
    </div>
  )
}

export default LoginPage
