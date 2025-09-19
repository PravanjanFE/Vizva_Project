import React, { useState } from 'react'
import Link from 'next/link'
import Dropzone from "react-dropzone";
import Image from 'next/image';

export default function SignUp() {
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);

    const handleImagesUpload = (file: File[]) => {
        let images = [];
        for (var i = 0; i < file.length; i++) {
          const ImageUrl = URL.createObjectURL(file[i]);
          images.push(ImageUrl)
        }
        setUploadedImages(images)
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
                            <div className="card col-md-7 mr-3 ml-2">
                                <div className="card-header">
                                    Profile
                                </div>
                                <div className="card-body">
                                    <div className='row'>
                                        <div className="form-group col-md-5 mr-2">
                                            <label>First Name</label>
                                            <input type="text" className="form-control" placeholder="First Name" />
                                        </div>
                                        <div className="form-group col-md-5">
                                            <label>Last Name</label>
                                            <input type="text" className="form-control" placeholder="Last Name" />
                                        </div>
                                    </div>
                                    <div className="form-group col-md-5 mb-4">
                                        <label>Username</label>
                                        <input type="text" className="form-control" placeholder="Username" />
                                    </div>

                                    <div className="form-group border-top border-bottom pt-3 pb-3">
                                        <label>Email Address</label>
                                        <p>Your email address is <strong>Email</strong></p>
                                    </div>

                                    <div className="form-group col-md-5">
                                        <label>New Password</label>
                                        <input type="password" className="form-control" placeholder="New Password" />
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-4 mb-3 d-flex flex-column'>
                                <div className="card">
                                    <div className="card-header">
                                        Your Avatar
                                    </div>
                                    <div className="card-body">
                                        <div
                                            className='rounded-circle border m-auto d-flex justify-content-center align-items-center cover-image-container bg-white'
                                            style={{ height: '200px', width: '200px' }}>
                                            <Dropzone onDrop={acceptedFiles => handleImagesUpload(acceptedFiles)} maxFiles={1} multiple={false}>
                                                {({ getRootProps, getInputProps }) => (
                                                    <section>
                                                        <div {...getRootProps()}>
                                                            <input {...getInputProps()} />
                                                            {uploadedImages.length === 0 && <Image src="/UploadIcon.png" className="d-flex m-auto" alt="upload" layout="fill"/>}
                                                            {uploadedImages.length === 0 && <p className="text-center">Upload Avatar</p>}
                                                            {uploadedImages?.length !== 0 && <Image className="cover-image rounded-circle border" src={uploadedImages[0]} alt="cover" style={{ height: '200px', width: '200px' }} />}
                                                            {uploadedImages?.length !== 0 && <div className="cover-image-overlay">
                                                                <Image src="/UploadIcon.png" className="d-flex m-auto" alt="upload" layout="fill"/>
                                                                <div className="overlay-text">Change Avatar</div>
                                                            </div>}
                                                        </div>
                                                    </section>
                                                )}
                                            </Dropzone>
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-auto'>
                                    <Link href="/">
                                        <button type="button" className="btn btn-secondary pr-4 pl-4 pt-1 pb-1 mr-1">
                                            Cancel
                                        </button>
                                    </Link>

                                    <button type="button" className="btn btn-primary pr-4 pl-4 pt-1 pb-1 pt-0">
                                        Update Info
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
