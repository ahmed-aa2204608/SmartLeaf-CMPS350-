'use client'

import { useActionState } from 'react'
import { login } from '../actions/server-actions'
import "@/public/phase1/index.css";
export default function LoginPage() {
  const [state, formAction] = useActionState(login, undefined)

  return (
    <div className="login-wrapper">
      <div className="login-image">
        <img src="/images/image2.jpg" alt="Login Image" />
      </div>
      <div className="login-container">
        <img src="/images/image.png" alt="Logo" className="logo" />
        <h2>Login</h2>
        <form action={formAction} id="loginForm">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" placeholder="Enter username" required />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Enter password" required />
          </div>
          <button type="submit">Login</button>
          {state instanceof Error && (
            <p className="error">{state.message}</p>
          )}
        </form>
      </div>
    </div>
  )
}
