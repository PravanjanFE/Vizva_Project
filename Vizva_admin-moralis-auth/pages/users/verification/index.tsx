import React from 'react';
import Link from "next/link";
import Image from 'next/image';
import { useMoralis } from "react-moralis";

type VerificationData = { // different type from users/verification/profile.tsx
  verificationId: string;
  artistName: string;
  ethAddress: string;
  profilePic: string;
  type: string;
  onboardingDate: string;
  requestDate: string;
  status: string;
  notified: boolean;
  verifiedBy: string;
}

export default function Verification() {
  const { Moralis, isInitialized } = useMoralis();
  var [pendingVerifData, setPendingVerifData] = React.useState([] as VerificationData[]);
  var [approvedVerifData, setApprovedVerifData] = React.useState([] as VerificationData[]);
  var [verificationData, setverificationData] = React.useState([] as VerificationData[]);
  var [activeDataBtn, setActiveDataBtn] = React.useState(0);

  const getVerificationData = async () => {
    const result = await Moralis.Cloud.run('getVerificationData');
    // for each data if status is pending, add to pendingVerifData, if status is approved, add to approvedVerifData
    // console.log(result);
    const pendingVerifData = result.filter((data: { status: string; }) => data.status === 'pending');
    const approvedVerifData = result.filter((data: { status: string; }) => data.status === 'approved');
    setPendingVerifData(pendingVerifData);
    setApprovedVerifData(approvedVerifData);
    setverificationData(pendingVerifData || []); // by default show pending verif data
    // TODO: Pagination for users. Preferred infinite scroll like frontend discover pages
  }

  const switchVerificationData = async (verifDataToShow: string) => {
    if (verifDataToShow === 'pending') {
      setActiveDataBtn(0);
      setverificationData(pendingVerifData);
    } else if (verifDataToShow === 'approved') {
      setActiveDataBtn(1);
      setverificationData(approvedVerifData);
    }
  }

  const notifyUser = async (verificationId: string) => {
    if (verificationId) {
        // call moralis cloud function
        const result = await Moralis.Cloud.run('notifyUserVerification', { verificationId: verificationId });
        if (result.message) {
            alert(result.message);
        } else {
            alert('An error occurred while notifying the user');
        }
    }
}

  React.useEffect(() => {
    if (isInitialized && verificationData.length === 0) {
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
                <h1 className="m-0">Users/Verification</h1>
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
        <section className="content pb-4">
          <div className="container-fluid bg-white" style={{minHeight: '520px'}}>
            <div className="row">
              <div className="col-md-11 m-4">
                <div className="">
                  <div className="col-md-6">
                    <button type="button" className={`btn ${activeDataBtn == 0 ? "btn-primary" : ""}`} onClick={() => switchVerificationData('pending')}>Pending({ pendingVerifData.length})</button>
                    <button type="button" className={`btn ${activeDataBtn == 1 ? "btn-primary" : ""}`} onClick={() => switchVerificationData('approved')}>Approved({ approvedVerifData.length })</button>
                  </div>
                  <div className="card-body p-0">
                    <table className="table">
                      <thead>
                        <tr>
                          <th style={{ width: '26%' }}>Name</th>
                          <th style={{ width: '12%' }}>Onboarded On</th>
                          <th style={{ width: '12%' }}>Requested On</th>
                          <th style={{ width: '20%' }}></th>
                          <th style={{ width: '10%' }}></th>
                          <th style={{ width: '20%' }}>Verified By</th>
                        </tr>
                      </thead>
                      <tbody>
                        {verificationData.map((item, index) => {
                          return (<tr key={index}>
                            <td>
                              <Link href={{pathname:'/users/verification/profile', query: {verificationId : item.verificationId}}}>
                                <div className="d-flex" style={{cursor:'pointer'}}>
                                  <div className="mr-1 mt-n2">
                                    <Image
                                      src={item.profilePic ?? 'https://source.unsplash.com/random/300x300/?nature'}
                                      className="img-circle border"
                                      alt="avatar"
                                      height={70}
                                      width={70}
                                    />
                                  </div>
                                  <div>
                                    <p className="mb-0 text-truncate" style={{maxWidth: '9rem'}}>{item.ethAddress}</p>
                                    <p className="mb-0">@{item.artistName}</p>
                                  </div>
                                </div>
                              </Link>
                            </td>
                            <td>{item.onboardingDate}</td>
                            <td>{item.requestDate}</td>
                            <td>
                              {item.status === 'approved'
                                ? <h6 className="text-primary pt-1 pb-1 text-center border rounded">Verification Done</h6>
                                : <h6 className="text-secondary pt-1 pb-1 text-center border rounded">Verification Pending</h6>}
                            </td>
                            <td>
                              {!item.notified
                                ? <button type="button" className="btn btn-primary pb-0 pt-0" onClick={() => notifyUser(item.verificationId)}>Notify</button>
                                : <button type="button" className="btn btn-dark pb-0 pt-0" onClick={() => alert('User already Notified')}>Notified</button>}
                            </td>
                            <td>{item.verifiedBy}</td>
                          </tr>)

                        })}

                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section >
      </div >
    </div >
  )
}
