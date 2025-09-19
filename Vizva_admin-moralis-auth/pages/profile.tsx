import React from 'react'
import Link from 'next/link'
import { useMoralis } from 'react-moralis';
import { useRouter } from 'next/router';

export default function Profile() {
    const { Moralis, user, logout, isAuthenticated } = useMoralis();
    const router = useRouter();
    // reset password on click
    const resetPassword = async () => {
        try {
            // show a popup confirming the reset
            if (window.confirm('Are you sure you want to reset your password?')) {
                // run moralis cloud function requestPasswordReset with user's email
                const email = user?.getEmail();
                if (email) {
                    await Moralis.User.requestPasswordReset(email)
                        .then(() => {
                            alert('Password reset email sent. Please check your inbox/spam folder.');
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
        catch (err) {
            alert(err);
        }
    }

    const changePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const currentPswd = formData.get('currentPswd') as string;
        const newPswd = formData.get('newPswd') as string;

        if (!currentPswd || !newPswd) {
            alert('Please fill in all required fields');
            return;
        }
        // run moralis cloud function changeAdminUserPassword
        //const result = await Moralis.Cloud.run('changeAdminUserPassword', { currentPassword: currentPswd, newPassword: newPswd});
        //alert(result.msg);
        //router.push('/');
    }
    return (
        <div>
            <div className="content-wrapper" style={{ minHeight: "80vh" }}>
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Account</h1>
                            </div>
                            {/* <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><a href="#">Home</a></li>
                                    <li className="breadcrumb-item active">Dashboard v1</li>
                                </ol>
                            </div> */}
                        </div>
                    </div>
                </div>
                <section className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <form onSubmit={changePassword}>
                                <div className="card col-md-8 mr-3 ml-2">
                                    <div className="card-header">
                                        Profile
                                    </div>
                                    <div className="card-body">
                                        <div className="form-group">
                                            <label>Email address</label>
                                            <input type="email" className="form-control" placeholder={user?.getEmail()} disabled />
                                        </div>
                                        {/* <div className="form-group">
                                            <label>Current Password</label>
                                            <input type="password" name="currentPswd" className="form-control" placeholder="Current Password" />
                                        </div>
                                        <div className="form-group">
                                            <label>New Password</label>
                                            <input type="password" name="newPswd" className="form-control" placeholder="New Password" />
                                        </div> */}
                                    </div>
                                </div>
                                <div className='mt-auto col-md-3 mb-3'>
                                    <Link href="/">
                                        <button type="button" className="btn btn-secondary pr-4 pl-4 pt-1 pb-1 mr-1">
                                            Cancel
                                        </button>
                                    </Link>

                                    {/* <button type="submit" className="btn btn-primary pr-4 pl-4 pt-1 pb-1 pt-0">
                                        Confirm
                                    </button> */}
                                    <button type="button" className="btn btn-primary pr-4 pl-4 pt-1 pb-1 pt-0" onClick={resetPassword}>
                                        Reset Password
                                    </button>
                                </div>
                                <small className="px-2">Clicking on reset password will send an email link to your registered email address. Please follow the instructions in email to reset your password.</small>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
