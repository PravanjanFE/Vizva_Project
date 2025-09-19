import { useEffect, useState } from 'react'
import ProfileCard from '../../../components/ProfileCard'
import { useRouter } from 'next/router';
import { useMoralis } from "react-moralis";
import index from 'pages/content';
import Image from 'next/image';

type VerificationData = { // different type from users/verification/index.tsx
    verificationId: string;
    artistName: string;
    ethAddress: string;
    profilePic: string;
    type: string;
    email: string;
    onboardingDate: string;
    requestDate: string;
    status: string;
    notified: boolean;
    nftCreated: number;
    nftSold: number;
    followers: number;
    bio: string;
    portfolio: string;
    previousWork: string; // url of previous work
    instagram: string;
    twitter: string;
    rarible: string;
}

export default function Profile() {
    const { Moralis, isInitialized } = useMoralis();
    var [verifData, setVerifData] = useState({} as VerificationData);
    var [verifStatus, setVerifStatus] = useState('pending');
    
    const router = useRouter();
    const getVerificationData = async () => {
        if (router.query['verificationId']) {
            const verificationId = router.query['verificationId'];
            // call moralis cloud function
            const result = await Moralis.Cloud.run('getVerificationDataById', { verificationId: verificationId });
            console.log(result[0]);
            if (result) {
                setVerifData(result[0]);
                if (result[0]) {
                    setVerifStatus(result[0].status);
                }
            }
        }
    }
    const changeVerificationStatus = async (status: string) => {
        if (router.query['verificationId']) {
            const verificationId = router.query['verificationId'];
            // call moralis cloud function
            const result = await Moralis.Cloud.run('changeVerificationStatus', { verificationId: verificationId, status: status });
            if (result.success) {
                setVerifStatus(status);
                alert(result.message);
                // router.back();
            } else {
                alert('An error occurred while changing the status of the verification');
            }
        }
    }

    const notifyUser = async () => {
        if (router.query['verificationId']) {
            const verificationId = router.query['verificationId'];
            // call moralis cloud function
            const result = await Moralis.Cloud.run('notifyUserVerification', { verificationId: verificationId });
            if (result.message) {
                alert(result.message);
            } else {
                alert('An error occurred while notifying the user');
            }
        }
    }

    useEffect(() => {
        if (isInitialized) {
            getVerificationData();
        }
    }, [isInitialized]);
    return (
        <div>
            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Users/Verification/Profile</h1>
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
                        <div className='row'>
                            <div className='col-md-5 rounded mb-3'>
                                <ProfileCard showAbout={false} imageUrl={verifData.profilePic} walletAddress={verifData.ethAddress} username={verifData.artistName} created={verifData.nftCreated} status={verifStatus} sold={verifData.nftSold} followers={verifData.followers} />
                            </div>
                            <div className='col-md-7 rounded mb-3'>
                                <div className="card card-primary p-2" style={{ boxShadow: 'unset' }}>
                                    <div className="card-header bg-white">
                                        <h3 className="card-title">Verification Details</h3>
                                    </div>
                                    <div className="card-body">
                                        <div className="form-group">
                                            <label>1. Share a link to your profile {verifData.portfolio ?<a href={verifData.portfolio} rel="noreferrer" target="_blank"><i className="ml-1 fas fa-external-link-alt text-dark" /></a> : ''}</label>
                                            <input type="text" className="form-control" placeholder="" value={verifData.portfolio || ""} disabled></input>
                                        </div>
                                        <div className="form-group">
                                            <label>2. Your Ethereum Wallet Address</label>
                                            <input type="text" className="form-control" placeholder="" value={verifData.ethAddress || ""} disabled></input>
                                        </div>
                                        <div className="form-group">
                                            <label>3. You are a</label>
                                            <input type="text" className="form-control" placeholder="" value={verifData.type || ""} disabled></input>
                                        </div>
                                        <div className="form-group">
                                            <label>4. Tell us about yourself. What is the concept behind your creation/collection/sales ?</label>
                                            <textarea className="form-control" placeholder="" disabled value={verifData.bio || ""} cols={12} rows={4}></textarea>
                                        </div>
                                        <div className="form-group">
                                            <label>5. Attach a screenshot of your work in progress on one of your minted items in the editor of your choice</label>
                                            <Image className="rounded" src={verifData.previousWork || 'https://source.unsplash.com/random/400x160/?nature'} alt="User Avatar" width={400} height={160} />
                                        </div>
                                        <div className="form-group">
                                            <label>6. Email Address</label>
                                            <input type="email" className="form-control" placeholder="" value={verifData.email || ""} disabled></input>
                                        </div>
                                        <div className="form-group">
                                            <label>7. Twitter Username {verifData.twitter ?<a href={verifData.twitter} target="_blank" rel="noreferrer"><i className="ml-1 fas fa-external-link-alt text-dark" /></a> : ''}</label>
                                            <input type="text" className="form-control" placeholder="" value={verifData.twitter || ""} disabled></input>
                                        </div>
                                        <div className="form-group">
                                            <label>8. Instagram Username {verifData.instagram ?<a href={verifData.instagram} target="_blank" rel="noreferrer"><i className="ml-1 fas fa-external-link-alt text-dark" /></a> : ''}</label>
                                            <input type="text" className="form-control" placeholder="" value={verifData.instagram || ""} disabled></input>
                                        </div>
                                        <div className="form-group">
                                            <label>9. Rarible Profile {verifData.rarible ?<a href={verifData.rarible} target="_blank" rel="noreferrer"><i className="ml-1 fas fa-external-link-alt mr-1 text-dark" /></a> : ''}</label>
                                            <input type="text" className="form-control" placeholder="" value={verifData.rarible || ""} disabled></input>
                                        </div>
                                    </div>

                                    <div className="card-footer bg-white justify-content-end d-flex">
                                        <button className="btn btn-outline-primary btn-lg mr-2 py-1 px-4" onClick={() => router.back()}>{verifStatus == 'approved' ? "Back" : "Cancel"}</button>
                                        {verifStatus == 'approved' &&  <button className="btn btn-outline-danger btn-lg mr-2 py-1 px-4" onClick={() => changeVerificationStatus('pending')}>Unverify</button>}
                                        {verifStatus == 'approved' && <button className="btn btn-primary btn-lg mr-2 py-1 px-4" onClick={() => notifyUser()}>Notify</button>}
                                        {verifStatus != 'approved' && <button className="btn btn-primary btn-lg mr-2 py-1 px-4" onClick={() => changeVerificationStatus('approved')}>Verify</button>}
                                        {verifStatus == 'pending' && <button className="btn btn-danger btn-lg mr-2 py-1 px-4" onClick={() => changeVerificationStatus('rejected')}>Reject</button>}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>

    )
}
