import { useEffect } from 'react'
import Link from 'next/link'
import { useMoralis } from "react-moralis"
import { useRouter } from 'next/router';

export default function PasswordReset() {

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
    const email = formData.get('email') as string;
    // if pass or email is empty, show error
    if (!email) {
      alert('Please fill in all required fields');
      return;
    }
    // show a popup confirming the reset
    if (window.confirm('Are you sure you want to reset your password?')) {
      // run moralis cloud function requestPasswordReset with user's email
      if (email) {
        await Moralis.User.requestPasswordReset(email)
          .then(() => {
            alert('Password reset email sent. Please check your inbox/spam folder.');
            router.push('/login');
          })
          .catch((error) => {
            // Show the error message somewhere
            alert("Error: " + error.code + " " + error.message);
          });
      } else {
        alert('No email is linked with your account');
      }
    }
  }

  return (
    <div className="d-flex" style={{ minHeight: "100vh", minWidth: "100vw", backgroundColor: 'E5E5E5' }}>
      <div className='m-auto d-flex flex-column'>
        <img src='/static/img/logo.svg' alt='Vizva' className='m-auto pb-3' style={{ height: '50px', width: '150px' }} />
        <section className="content">
          <form onSubmit={handleSubmit}>
            <div className="container-fluid">
              <div className="row">
                <div className="card col-md-12">
                  <div className="card-header">
                    Password Reset
                  </div>
                  <div className="card-body">
                    <div className="form-group">
                      <label>Email</label>
                      <input name="email" type="text" className="form-control" placeholder="Username" />
                    </div>
                    <div className="form-group d-flex">
                      <button type="submit" className="btn btn-primary px-4 py-1 m-auto">
                        Reset Password
                      </button>
                    </div>
                    <div className="form-group d-flex text-center justify-content-center">
                      <Link href="login" className='mx-auto'>Login</Link>
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