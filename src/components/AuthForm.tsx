import { useState, useRef } from 'react'
import { trpc } from 'utils/trpc'
import { signIn, SignInResponse } from 'next-auth/react'
import { getErrorMessage } from 'utils/error'
import { CreateUserModel, LoginUserModel } from 'models/user'
import classes from 'styles/sass/AuthForm.module.scss'

const AuthForm = () => {
  const emailInputRef = useRef<HTMLInputElement | null>(null)
  const passwordInputRef = useRef<HTMLInputElement | null>(null)

  const [isLogin, setIsLogin] = useState(true)

  const { mutate: signup } = trpc.auth.signup.useMutation({
    onError(error) {
      alert(error.message)
    },
  })

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState)
  }

  async function loginUser(input: LoginUserModel) {
    const result = (await signIn('credentials', {
      redirect: false,
      email: input.email,
      password: input.password,
    })) as SignInResponse

    if (result.ok === false) {
      alert(`${result.error}`)
    }
  }

  async function submitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const enteredEmail = emailInputRef.current?.value as string
    const enteredPassword = passwordInputRef.current?.value as string

    if (isLogin) {
      await loginUser({
        email: enteredEmail,
        password: enteredPassword,
      })
    } else {
      try {
        const input: CreateUserModel = {
          email: enteredEmail,
          password: enteredPassword,
        }

        const result = signup(input, {
          onSuccess: (data) => {
            if (data.data.email === input.email) {
              loginUser(input)
            }
          },
        })
      } catch (e) {
        const message = getErrorMessage(e)
        console.log({ message })
      }
    }
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            pattern="^.{6,}$"
            title="Password must at least contain 6 characters!"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create a new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default AuthForm
