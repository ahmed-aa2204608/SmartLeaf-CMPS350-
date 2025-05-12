'use client'

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import "@/public/phase1/index.css";

export default function LoginPage() {
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const res = await signIn("credentials", {
      redirect: false,
      username: formData.get("username"),
      password: formData.get("password"),
      callbackUrl,
    });

    if (res.error) {
      setError("Invalid username or password");
    } else {
      window.location.href = "/";
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-image">
        <img src="/images/image2.jpg" alt="Login Image" />
      </div>
      <div className="login-container">
        <img src="/images/image.png" alt="Logo" className="logo" />
        <h2>Login</h2>
        <form onSubmit={handleSubmit} id="loginForm">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" required />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit">Login</button>
          {error && <p className="error">{error}</p>}
        </form>

        <hr />
        <button onClick={() => signIn("google")}>Login with Google</button>
      </div>
    </div>
  );
}
