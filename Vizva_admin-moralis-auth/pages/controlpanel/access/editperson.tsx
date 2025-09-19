import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useMoralis } from "react-moralis"
import { useRouter } from 'next/router'

export default function EditPerson(props: any) {
    const router = useRouter();
    const currentUser = router.query;
    const { Moralis, user, isInitialized, logout } = useMoralis();
    const pages = ['Dashboard', 'Activity', 'Users', 'Content', 'Performance', 'Control Panel'];
    const [selRole, setSelRole] = React.useState('subadmin');


    // form submit handler, take form data and call cloud function to add admin
    const createAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = currentUser.email;
        const role = formData.get('role') as string;
        // if pass or email is empty, show error
        if (!email || !role) {
            alert('Please fill in all required fields');
            return;
        }
        let pagesAllowed = currentUser.pages as string[];
        if (role === 'admin') {
            pagesAllowed = pages;
        } else if (role === 'subadmin') {
            pagesAllowed = formData.getAll('page') as string[];
        }
        if (role == "subadmin" && pagesAllowed.length === 0) {
            alert('Please select at least one page for subadmin');
            return;
        }
        // run moralis cloud function createNewAdminUser
        const result = await Moralis.Cloud.run('editSubAdminUser', { email: email, role: role, pages: pagesAllowed });
        alert(result.msg);
        router.push('/controlpanel/access');
    }
    return (
        <div>
            <div className="content-wrapper" style={{ minHeight: "80vh" }}>
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Control Panel/Access/Edit Person</h1>
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
                        <form onSubmit={createAdmin}>
                            <div className="row">
                                <div className="card col-md-5 mr-3">
                                    <div className="card-header">
                                        Profile
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">Enter an email address for the admin.</p>
                                        <div className="form-group">
                                            <label>Email address</label>
                                            <input type="email" name="email" className="form-control" placeholder="name@example.com" value={currentUser.email} disabled />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 d-flex flex-column">
                                    <div className="card">
                                        <div className="card-header">
                                            Permission
                                        </div>
                                        <div className="card-body">
                                            <div className="form-group">
                                                <label>Role:</label>
                                                <select name="role" className="form-select" value={selRole} onChange={e => setSelRole(e.target.value)}>
                                                    <option value="admin">Admin</option>
                                                    <option value="subadmin">Sub-admin</option>
                                                </select>
                                            </div>
                                            {selRole == "admin" &&
                                                <p className="card-text">{"Admins are superusers and will have access to all the pages and can create, delete and modify other users."}</p>
                                            }
                                            {selRole == "subadmin" &&
                                                <>
                                                    <p className="card-text">{"Subadmins will only have access to the pages you select below, and wont be able to modify other admins."}</p>
                                                    <label>Pages Allowed:</label>
                                                    <div className='d-flex flex-wrap'>
                                                        {pages.map((page, index) => {
                                                            return <div className="form-check col-md-4" key={index}>
                                                                <input name="page" className="form-check-input" type="checkbox" value={page} defaultChecked={currentUser.pages?.includes(page)} />
                                                                <label className="form-check-label" htmlFor="defaultCheck1">
                                                                    {page}
                                                                </label>
                                                            </div>
                                                        })}
                                                    </div>
                                                </>
                                            }
                                        </div>
                                    </div>
                                    <div className='ml-auto'>
                                        <Link href="/controlpanel/access">
                                            <button type="button" className="btn btn-secondary pr-4 pl-4 pt-1 pb-1 mr-1">
                                                Cancel
                                            </button>
                                        </Link>

                                        <button type="submit" className="btn btn-primary pr-4 pl-4 pt-1 pb-1 pt-0">
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    )
}
