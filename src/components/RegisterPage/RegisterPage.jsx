import { Checkbox } from 'antd'
import classes from './RegisterPage.module.scss'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { registerNewUser } from '../../store/BlogPlatformSlice'

const schema = yup.object().shape({
  username: yup.string().min(3).max(20).required(),
  email: yup.string().email().lowercase().required(),
  password: yup.string().min(6).max(40).required(),
  repeatPassword: yup.string().oneOf([yup.ref('password'), null]),
})

function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [isUserCreated, setIsUserCreated] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const registerUser = async user => {
    const url = 'https://blog-platform.kata.academy/api/users'

    const data = {
      user: {
        username: user.username,
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
      setIsUserCreated(true)
      throw new Error(`User is already created! status: ${response.status}`)
    }
    return await response.json()
  }

  const submitForm = async data => {
    setIsUserCreated(false)
    console.log(data)
    const user = await registerUser(data)
    sessionStorage.setItem('user', JSON.stringify(user.user))
    dispatch(registerNewUser(user.user))
    navigate('/articles/1')
  }
  return (
    <div className={classes['login-page']}>
      <h3 className={classes['login-page-title']}>Create new account</h3>
      {isUserCreated ? (
        <h3 style={{ color: 'rgba(245, 34, 45, 1)' }}>This user is already created!</h3>
      ) : (
        ''
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

        <p className={classes['label']}>Password</p>
        <input
          className={errors.password?.message ? classes['input--error'] : classes['input']}
          type="text"
          name="password"
          placeholder={`Password`}
          {...register('password')}
        />
        <span style={{ color: 'rgba(245, 34, 45, 1)' }}>{errors.password?.message}</span>

        <p className={classes['label']}>Repeat Password</p>
        <input
          className={errors.repeatPassword ? classes['input--error'] : classes['input']}
          type="text"
          name="repeatPassword"
          placeholder={`Repeat Password`}
          {...register('repeatPassword')}
        />
        <span style={{ color: 'rgba(245, 34, 45, 1)' }}>
          {errors.repeatPassword && 'password doesn`t match'}
        </span>

        <Checkbox
          className={classes['checkbox']}
          onChange={e => {
            setIsChecked(e.target.checked)
          }}
        >
          <p style={{ marginTop: 34 }}>
            I agree to the processing of my personal <br />
            information
          </p>
        </Checkbox>
        <button
          disabled={!isChecked}
          type="submit"
          className={isChecked ? classes['submit'] : classes['submit--disabled']}
        >
          <span style={{ fontSize: 16, color: '#fff' }}>Create</span>
        </button>

        <p style={{ fontSize: 12 }}>
          Already have an account?
          <Link style={{ textDecoration: 'none', color: 'rgba(24, 144, 255, 1)' }} to={'/sign-in'}>
            Sign In
          </Link>
          .
        </p>
      </form>
    </div>
  )
}

export default RegisterPage
