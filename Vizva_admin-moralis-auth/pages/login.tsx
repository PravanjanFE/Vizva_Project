import { useEffect } from 'react'
import Link from 'next/link'
import { useMoralis } from "react-moralis"
import { useRouter } from 'next/router';

export default function Login() {

  const { Moralis, user, isInitialized, logout } = useMoralis();
  const router = useRouter();
  // if user already logged in redirect to dashboard page
  useEffect(() => {
    if (isInitialized && Moralis.User.current() && router.pathname !== '/') {
      router.push('/');
    }
  }, [isInitialized, user, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const pass = formData.get('password') as string;
    // if pass or email is empty, show error
    if (!pass || !username) {
      alert('Please fill in all required fields');
      return;
    }
    // run moralis cloud function isUserAdmin with username
    const isUserAdminResult = await Moralis.Cloud.run('isUserAdmin', { username: username });
    let isUserSubAdminResult = false;
    if (isUserAdminResult === false) {
      isUserSubAdminResult = await Moralis.Cloud.run('isUserSubAdmin', { username: username });
    }
    // if user is admin or subadmin, redirect to dashboard
    if (isUserAdminResult === true || isUserSubAdminResult === true) {
      try {
        const user = await Moralis.User.logIn(username, pass);
        if (user) {
          // successful login.
          console.log('Login successful');
          // redirecting via js for full reload instead of router.push
          window.location.href = '/';
        } else {
          alert('Login failed');
          router.push('/');
        }
      } catch (err) {
        alert(err);
      }
    } else {
      alert('You are not an admin. Please request an admin to give you access.');
      // redirect to https://vizva.io/
      // window.location.href = 'https://vizva.io/';
    }
  }

  return (
    <div className="d-flex" style={{ minHeight: "100vh", minWidth: "100vw", backgroundColor:'E5E5E5' }}>
      <div className='m-auto d-flex flex-column'>
        <img src='/static/img/logo.svg' alt='Vizva' className='m-auto pb-3' style={{ height: '50px', width: '150px'}}/>
        <section className="content">
          <form onSubmit={handleSubmit}>
            <div className="container-fluid">
              <div className="row">
                <div className="card col-md-12">
                  <div className="card-header">
                    Login
                  </div>
                  <div className="card-body">
                    <div className="form-group">
                      <label>Username <small>(Email address is username if you never changed your username)</small></label>
                      <input name="username" type="text" className="form-control" placeholder="Username" />
                    </div>
                    <div className="form-group">
                      <label>Password</label>
                      <input name="password" type="password" className="form-control" placeholder="Password" />
                    </div>
                    <div className="form-group d-flex">
                      <button type="submit" className="btn btn-primary px-4 py-1 m-auto">
                        Login
                      </button>
                    </div>
                    <div className="form-group d-flex text-center justify-content-center">
                      <Link href="password-reset" className='mx-auto'>Password Reset</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}