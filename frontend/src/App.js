import './App.css'
import { BrowserRouter } from 'react-router-dom'
import IndexRoutes from './routes'
import PopUpContext from './context/PopUpContext'
import { useState, useEffect } from 'react'
import PopUp from './components/Navbar/PopUp'
import { googleLogout, useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'

function App() {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [user, setUser] = useState([])
  const [profile, setProfile] = useState(null)

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log('Login Failed:', error),
  })

  // ------------------------------------fetching Google profile after authenticated-------------------------------------
  useEffect(() => {
    if (user?.access_token) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: 'application/json',
            },
          }
        )
        .then((res) => setProfile(res.data))
        .catch((err) => console.log(err))
    }
  }, [user])

  const logOut = () => {
    googleLogout()
    setProfile(null)
  }

  return (
    <div className="App">
      <PopUpContext.Provider value={{ showConfirmation, setShowConfirmation }}>
        <BrowserRouter>
          <IndexRoutes />
          {showConfirmation && <PopUp />}
        </BrowserRouter>
      </PopUpContext.Provider>

      {/*------------------------------- Google login and logout section ---------------------------------------*/}
      {/* <div>
        {profile ? (
          <div>
            <img src={profile.picture} alt="User Profile" />
            <h3>Welcome, {profile.name}</h3>
            <p>Email: {profile.email}</p>
            <button onClick={logOut}>Log out</button>
          </div>
        ) : (
          <button onClick={login}>Sign in with Google</button>
        )}
      </div> */}
    </div>
  )
}

export default App
