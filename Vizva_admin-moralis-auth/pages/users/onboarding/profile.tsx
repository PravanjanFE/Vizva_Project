import React from 'react'
import ProfileCard from '../../../components/ProfileCard'

export default function Profile() {
    return (
        <div>
            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0 fw-bold">Users/Onboarded/Profile</h1>
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
                            <div className='col-md-5 mr-2 bg-white rounded mb-3'>
                                <ProfileCard showAbout={true} showNotifyButton={true} showSocialLinks={true} />
                            </div>
                            <div className='col-md-6 bg-white rounded mb-3 p-3'>
                               <h5><strong>Timeline</strong></h5>
                            </div>
                        </div>

                    </div>
                </section>
            </div>
        </div>

    )
}
