import React from 'react';
import Link from "next/link";
import Image from 'next/image';
import { useMoralis } from "react-moralis";
import { useRouter } from 'next/router';

export default function Access() {

  const { Moralis, user, isInitialized, logout } = useMoralis();
  const [users, setUsers] = React.useState([] as any[]);
  const router = useRouter();

  const getUsers = async () => {
    const result = await Moralis.Cloud.run('getAllUsersViaAdmin');
    setUsers(result || []);
    // TODO: Pagination for users. Preferred infinite scroll like frontend discover pages
  }

  const deleteUser = async (userId: string) => {
    // show confirmation dialog, if confirmed, run moralis cloud function deleteUser
    if (confirm('Are you sure you want to delete this user?')) {
      const result = await Moralis.Cloud.run('deleteUserViaAdmin', { userId: userId });
      alert(result.msg);
    }
    getUsers();
  }

  React.useEffect(() => {
    if (isInitialized && users.length === 0) {
      getUsers();
    }
  }, [isInitialized]);

  return (
    <div>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Control Panel/Access</h1>
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
        <section className="content pb-3">
          <div className="container-fluid bg-white p-4">
            <div className="row">
              <h3 className='col-md-3'>User</h3>
              {user?.get('backendPermissions')[0].role === 'admin' && <Link href={'/controlpanel/access/addperson'}>
                <button type="button"
                  className="ml-auto col-md-3 outline-none border-0 rounded-sm fs-6 bg-primary p-2 mb-4">
                  Add Person +
                </button>
              </Link>}

            </div>
            <div className="card-body p-0">
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: '26%' }}>Name</th>
                    <th style={{ width: '12%' }}>Added On</th>
                    <th style={{ width: '12%' }}>Role</th>
                    {user?.get('backendPermissions')[0].role === 'admin' && <th style={{ width: '20%' }}></th>}
                  </tr>
                </thead>
                <tbody>
                  {users.map((eachUser, index) => {
                    if (!eachUser.backendPermissions) {
                      // skip listing user here if not admin or subadmin
                      return null;
                    }
                    return (<tr key={index}>
                      <td>
                        <div className="d-flex" style={{ cursor: 'pointer' }}>
                          <div className="mr-1 mt-n2">
                            <div className="img-circle border bg-dark d-flex justify-content-center align-self-center"
                              style={{ height: "70px", width: "70px", fontSize: "40px", textTransform: "capitalize" }}>
                              {eachUser.username[0]}
                            </div>
                            {/* <Image
                              src="/static/dist/img/user2-160x160.jpg"
                              className="img-circle border"
                              alt="avatar"
                              height={70}
                              width={70}
                            /> */}
                          </div>
                          <div>
                            <p className="mb-0 ml-2 mt-2">{eachUser.username}</p>
                          </div>
                        </div>
                      </td>
                      <td>{eachUser.createdAt}</td>
                      <td style={{ textTransform: 'capitalize' }}>
                        {eachUser.backendPermissions && eachUser.backendPermissions.length > 0 &&
                          <>
                            {eachUser.backendPermissions[0].role}
                            {eachUser.backendPermissions[0].role === 'subadmin' &&
                              <>
                                <br />
                                ({eachUser.backendPermissions[0].pages.map((page: string, index: React.Key) => {
                                  return <span key={index}>{page}
                                    {index !== eachUser.backendPermissions[0].pages.length - 1 && <span>, </span>}
                                  </span>
                                })
                                })
                              </>
                            }
                          </>
                        } {!eachUser.backendPermissions &&
                          <>User</>
                        }
                      </td>
                      {user?.get('backendPermissions')[0].role === 'admin' && <td>
                        <div>
                          {(eachUser?.backendPermissions?.[0]?.role === 'subadmin') &&
                            <>
                              <button type="button" className="btn btn-primary pb-0 pt-0 mr-1"
                                onClick={() => {
                                  router.push({
                                    pathname: '/controlpanel/access/editperson',
                                    query: { email: eachUser?.email, role: eachUser?.backendPermissions?.[0]?.role, pages: eachUser?.backendPermissions?.[0]?.pages }
                                  }, '/controlpanel/access/editperson');
                                }}>
                                <i className='fas fa-pen mr-1' />
                                Edit
                              </button>

                              <button type="button" className="btn btn-danger pb-0 pt-0" onClick={() => deleteUser(eachUser.objectId)}>
                                <i className='fas fa-trash mr-1' data-user-id={eachUser.objectId} />
                                Delete
                              </button>
                            </>
                          }
                        </div>
                      </td>}
                    </tr>)

                  })}

                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
