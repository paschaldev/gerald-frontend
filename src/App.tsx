import React, { useState } from 'react'
import { GeraldAPI } from './helpers'

const Login: React.FC = () => {
  const [stage, setStage] = useState<String>('login')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [phone, setPhone] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [hash, setHash] = useState<string>('')
  const [code, setCode] = useState<string>('')
  const [codeResent, setCodeResent] = useState<boolean>(false)

  const authUser = () => {
    // reset error
    setError(null)
    setIsSubmitting(true)
    GeraldAPI('POST', '/auth', {
      phone
    }).then(response => {
      setStage('verify')
      setHash(response.data.hash)
    }).catch(err => {
      // Set the error message
      const response = err.response
      if (response.data) {
        setError(response.data.phone)
      }
    }).finally(() => {
      setIsSubmitting(false)
    })
  }

  const submitForm = (e: any) => {
    e.preventDefault()
    authUser()
  }

  const verifyAuth = (e: any) => {
    e.preventDefault()
    // reset error
    setError(null)
    setIsSubmitting(true)

    GeraldAPI('POST', '/auth/verify', {
      hash,
      code,
    }).then(response => {
      setStage('dashboard')
    }).catch(err => {
      // Set the error message
      const response = err.response
      if (response.data) {
        setError(response.data.code)
      }
    }).finally(() => {
      setIsSubmitting(false)
    })
  }

  const reAuth = (e: any) => {
    e.preventDefault()
    setCodeResent(true)
    authUser()
  }

  return (
    <>
      {
        stage === 'login' &&
        <form onSubmit={submitForm} className="login-form" >
          <label>Phone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} type="text" name="phone" />
          {
            error && (
              <p>{error}</p>
            )
          }
          <button disabled={isSubmitting} type="submit">Submit</button>
        </form >
      }
      {
        stage === 'verify' &&
        <form onSubmit={verifyAuth} className="login-form" >
          <label>Authentication Code</label>
          <input value={code} onChange={(e) => setCode(e.target.value)} type="text" name="code" />
          {
            error && (
              <p>{error}</p>
            )
          }
          <button disabled={isSubmitting} type="submit">Submit</button>
          {
            !codeResent &&
            <p>
              Didn't receive a verification code? <a onClick={reAuth} href="#">Resend</a>
            </p>
          }
          {
            codeResent &&
            <p>Verification code resent</p>
          }
        </form>
      }
      {
        stage === 'dashboard' &&
        <h1>Welcome Mr, Gerald</h1>
      }
    </>
  )
}

const App: React.FC<{}> = () => {
  return (
    <Login />
  )
}

export default App;