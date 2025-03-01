import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import {useAuth0} from "@auth0/auth0-react";

interface LoginProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void
}


const Login = ({setIsAuthenticated}: LoginProps) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const {loginWithRedirect} = useAuth0();
  
  const navigate = useNavigate()
  
  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(!email.trim()) return setError('please provide an email')
    try{
      const response = await fetch(import.meta.env.VITE_SIGNIN_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, password}),
      });
      const data = await response.json()
      if (!response.ok) {
        setError(data.message)
        throw new Error(data.message)
      }
      setIsAuthenticated(true)
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('token', data.token)
      window.location.href = "/";
    } catch(error :any){
      setError(error.message)  
      console.error(error)
    }
  }
  
  const handleSocialLogin = async (provider: string) => {
    try{
      await loginWithRedirect({connection: provider,} as any);
      alert('success login in');
    }
    catch(error: any){
      console.error(error + provider + 'login error')
    }
  };
  return(
      <section className="p-4 text-center">
      <img src="https://cdn.oaistatic.com/assets/favicon-o20kmmos.svg" className="block w-10 mt-7 mx-auto mb-10"/>
      <strong className="block text-3xl mb-5 text-center">Welcome back</strong>
      
      <form onSubmit={submitForm}>
       <label htmlFor="email" className="text-left block text-[#44BBA4]">Email address*</label>
        <input
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email" 
        className="block w-full rounded p-3 border-2 border-[#44BBA4] mb-5" />
        
       <label htmlFor="password" className="text-left block text-[#44BBA4]">Password*</label>
        <input
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password" 
        className="block w-full rounded p-3 border-2 border-[#44BBA4] mb-5" />
    
        <input type="submit" value="Continue" className="block rounded text-white w-full p-3 bg-[#44BBA8]" />
       </form>
       {error && <p className="text-red-500">{error}</p>}
       <div className="mt-7">
       <p>Dont have an account? <Link to="/signup" className="text-[#44BBA4]">Sign Up</Link></p>
      </div>
      
      <div className="flex items-center my-6">
        <span className="flex-grow h-px bg-gray-200"></span>
        <span className="px-4">or</span>
        <span className="flex-grow h-px bg-gray-200"></span>
      </div>
      
      {/* SignIn with a auth provider*/}  
          <div
            onClick={() => handleSocialLogin('google-oauth2')}
            className="border-2 mb-4 flex items-center rounded bg-white pl-2 pr-4 px-5 text-black"
            >
           <img src="/google.png" alt="Google logo" className="w-14" />
            Continue with Google
          </div>
          
          <div
            onClick={() => handleSocialLogin('windowslive')}
            className="mb-4 border-2 flex items-center rounded bg-white pl-2 pr-4 px-5 text-black"
            >
           <img src="/microsoft.png"  alt="Microsoft logo" className="w-12" />
            Continue with Microsoft 
          </div>
          
          <div
            onClick={() => handleSocialLogin('apple')}
            className="mb-4 border-2 flex items-center rounded bg-white pl-2 pr-4 px-5 text-black"
            >
           <img src="/apple.png"  alt="Appl logo" className="w-12" />
            Continue with Apple
          </div>
    </section>
    )
}

export default Login