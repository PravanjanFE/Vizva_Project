import React, { useState } from 'react';
import Image from 'next/image';
import { useMoralis } from 'react-moralis';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export default function Pages() {
  // const tableData = [
  //   { page: 'Dashboard', members: [{avatar:'/static/dist/img/user1-128x128.jpg'},{avatar:'/static/dist/img/user2-160x160.jpg'},{avatar:'/static/dist/img/user3-128x128.jpg'},{avatar:'/static/dist/img/user8-128x128.jpg'},{avatar:'/static/dist/img/user4-128x128.jpg'}] },
  //   { page: 'Activity', members: [{avatar:'/static/dist/img/user1-128x128.jpg'}] },
  //   { page: 'User', members: [{avatar:'/static/dist/img/user2-160x160.jpg'},{avatar:'/static/dist/img/user1-128x128.jpg'}] },
  //   { page: 'Content', members: [{avatar:'/static/dist/img/user1-128x128.jpg'},{avatar:'/static/dist/img/user2-160x160.jpg'},{avatar:'/static/dist/img/user5-128x128.jpg'},{avatar:'/static/dist/img/user6-128x128.jpg'}]},
  //   { page: 'Performance', members: [{avatar:'/static/dist/img/user1-128x128.jpg'},{avatar:'/static/dist/img/user2-160x160.jpg'}]},
  //   { page: 'Control Panel', members: [{avatar:'/static/dist/img/user1-128x128.jpg'}] }
  // ];

  const tableData: any = [
    { page: 'Dashboard', members: [] },
    { page: 'Activity', members: [] },
    { page: 'User', members: [] },
    { page: 'Content', members: [] },
    { page: 'Performance', members: [] },
    { page: 'Control Panel', members: [] }
  ];
  const { Moralis, user, isInitialized, logout } = useMoralis();
  const [data, setData] = useState([])

  const getUsers = async () => {
    const result: [] = await Moralis.Cloud.run('getAllUsersViaAdmin');

    if (result.length > 0) {
      result.forEach((eachUser: { backendPermissions: { page: string, role: string }[] }) => {
        if (eachUser?.backendPermissions) {
          if (eachUser?.backendPermissions[0]?.role === 'admin') {
            tableData.forEach((item: { page: string, members: any }) => {
              item.members.push(eachUser)
            })
          }
          else if (eachUser.backendPermissions[0].role === 'admin') {
            if (eachUser.backendPermissions[0].page === 'Dashboard') {
              tableData[0].members.push(eachUser)
            }
            else if (eachUser.backendPermissions[0].page === 'Activity') {
              tableData[1].members.push(eachUser)
            }
            else if (eachUser.backendPermissions[0].page === 'User') {
              tableData[2].members.push(eachUser)
            }
            else if (eachUser.backendPermissions[0].page === 'Content') {
              tableData[3].members.push(eachUser)
            }
            else if (eachUser.backendPermissions[0].page === 'Performance') {
              tableData[4].members.push(eachUser)
            }
            else if (eachUser.backendPermissions[0].page === 'Control Panel') {
              tableData[5].members.push(eachUser)
            }
          }
        }
      })
    }
    setData(tableData)
  }

  React.useEffect(() => {
    if (isInitialized) {
      getUsers();
    }
  }, [isInitialized]);

  const renderTooltip = (name: string) => (
    <Tooltip id="button-tooltip">
      {name}
    </Tooltip>
  );

  return (
    <div>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Control Panel/Pages</h1>
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
        <section className="content p-3">
          <div className="container-fluid bg-white">
            <div className="row">
              <div className="card-body p-0">
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: '20%' }}>Page</th>
                      <th style={{ width: '60%' }}>Team Members</th>
                      <th style={{ width: '20%' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item: any, index: number) => {
                      return (<tr key={index}>
                        <td>{item.page}</td>
                        <td>
                          <div className='d-flex flex-wrap'>
                            {item.members.map((member: any, index: number) => {
                              console.log(member, 'member')
                              return (<div className="mr-1 mt-n2" key={index}>
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 100, hide: 100 }}
                                  overlay={renderTooltip(member?.username)}
                                >
                                  <div className="img-circle border bg-dark d-flex justify-content-center align-self-center"
                                    style={{ height: "70px", width: "70px", fontSize: "40px", textTransform: "capitalize" }}>
                                    {member?.username[0]}
                                  </div>
                                </OverlayTrigger>

                                {/* <Image
                                src={member.avatar}
                                className="img-circle border"
                                alt="avatar"
                                height={70}
                                width={70}
                              /> */}
                              </div>)
                            }
                            )}
                          </div>

                        </td>
                        <td>
                          {/* <div>
                              <button type="button" className="btn btn-primary pb-0 pt-0 mr-1">
                                <i className='fas fa-plus mr-1' />
                                Add
                              </button>
                              <button type="button" className="btn btn-danger pb-0 pt-0">
                                <i className='fas fa-xmark mr-1' />
                                Remove
                              </button>
                            </div> */}
                        </td>
                      </tr>)

                    })}

                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
