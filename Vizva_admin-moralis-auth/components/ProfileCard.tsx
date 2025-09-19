import React from 'react';
import Image from 'next/image';

export default function ProfileCard({ showAbout = false, showSocialLinks = false, showNotifyButton = false, walletAddress = "", imageUrl = "", status="", username = "", created = 0, collected = 0, sold = 0, followers = 0 }) {
    return (
        <div className='card' style={{ boxShadow: 'unset' }}>
            <div className='m-auto px-4 pb-2 pt-4'>
                <Image className="img-circle" src={imageUrl != '' ? imageUrl : 'https://source.unsplash.com/random/300x300/?nature'} alt="User Avatar" width={80} height={80}/>
            </div>
            <div className='m-auto text-center'>
                <h5 className="text-truncate" style={{maxWidth: '12rem'}}><strong>{walletAddress}</strong></h5>
                <h5 className='pb-1'>@{username}</h5>
                <div className={`${status == 'approved' ? "bg-success" : "bg-warning"} text-capitalize text-white m-auto`} style={{ borderRadius: '25px', width: 'fit-content', padding: '0 25px' }}>{status}</div>
            </div>
            <div className="card-footer mt-4">
                <div className="row">
                    <div className="col-sm-6 border-right">
                        <div className="description-block">
                            <h5 className="description-header">{created ?? 0}</h5>
                            <span className="description-text">CREATED</span>
                        </div>
                    </div>
                    <div className="col-sm-6 ">
                        <div className="description-block">
                            <h5 className="description-header">{collected ?? 0}</h5>
                            <span className="description-text">COLLECTED</span>
                        </div>
                    </div>
                </div>
                <div className='border-bottom pt-2 ml-auto mr-auto mb-2'></div>
                <div className='row'>
                    <div className="col-sm-6 border-right">
                        <div className="description-block">
                            <h5 className="description-header">{sold ?? 0}</h5>
                            <span className="description-text">SOLD</span>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="description-block">
                            <h5 className="description-header">{followers ?? 0}</h5>
                            <span className="description-text">FOLLOWERS</span>
                        </div>
                    </div>
                </div>
            </div>
            {showNotifyButton &&
                <button type="button" className="btn btn-primary col-md-3 m-auto">Notify</button>}
            {showAbout && <div className='p-4 mt-3 border-top border-bottom'>
                <h5>
                    <i className="fas fa-address-card mr-1" />
                    <strong>About</strong>
                </h5>
                <p>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer.
                </p>
            </div>}

            {showSocialLinks && <div className='p-4 mt-3 mb-3 border-bottom'>
                <h5>
                    <i className="fas fa-hashtag mr-1 mb-4" />
                    <strong>Social Links</strong>
                </h5>

                <h6>
                    <i className='fas fa-envelope bg-primary rounded-circle p-2 mr-2 text-center'
                        style={{ height: '32px', width: '32px' }} />
                    randomname@gmail.com
                </h6>
                <h6>
                    <i className='fas fa-globe bg-primary rounded-circle p-2 mr-2 text-center'
                        style={{ height: '32px', width: '32px' }} />
                    randomname.com
                </h6>
                <h6>
                    <i className='fas fa-twitter bg-primary rounded-circle p-2 mr-2 text-center'
                        style={{ height: '32px', width: '32px' }} />
                    /randomname
                </h6>
                <h6>
                    <i className='fas fa-instagram bg-primary rounded-circle p-2 mr-2 text-center'
                        style={{ height: '32px', width: '32px' }} />
                    @randomname123
                </h6>
                <h6>
                    <i className='fas fa-facebook-f bg-primary rounded-circle p-2 mr-2 text-center'
                        style={{ height: '32px', width: '32px' }} />
                    /random123
                </h6>

            </div>}


        </div>

    )
}
