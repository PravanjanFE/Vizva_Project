import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useMoralisCloudFunction } from "react-moralis";
import { getUsersCreatedMonth } from "../../../utils/users";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "right" as const,
    },
    // title: {
    //   display: true,
    //   text: 'Chart.js Line Chart',
    // },
  },
};
export const data = {
  labels,
  datasets: [
    {
      label: "Users",
      data: [84, 102, 63, 146, 178, 245, 185],
      borderColor: "#4F8CB899",
      backgroundColor: "#4F8CB8",
    },
    {
      label: "Verified",
      data: [7, 14, 23, 17, 33, 19, 27],
      borderColor: "#6CC8EE99",
      backgroundColor: "#6CC8EE",
    },
    {
      label: "Non-verified",
      data: [45, 83, 53, 62, 154, 109, 175],
      borderColor: "rgba(53, 162, 235, 0.5)",
      backgroundColor: "rgba(53, 162, 235)",
    },
    {
      label: "Verification Pending",
      data: [20, 24, 35, 55, 39, 46, 41],
      borderColor: "#C7E3FF99",
      backgroundColor: "#C7E3FF",
    },
  ],
};

export default function Onboarding() {
  const [users, setUsers] = useState<any[]>([]);
  const {
    data: allUserData,
    error: fetchAllUserError,
    isLoading: fetchAllUserLoading,
  } = useMoralisCloudFunction("getAllUsers");
  useEffect(() => {
    allUserData && setUsers(JSON.parse(JSON.stringify(allUserData)));
  }, [allUserData]);

  const data = {
    labels,
    datasets: [
      {
        label: "Users",
        data: getUsersCreatedMonth(users),
        borderColor: "#4F8CB899",
        backgroundColor: "#4F8CB8",
      },
      {
        label: "Verified",
        data: [7, 14, 23, 17, 33, 19, 27],
        borderColor: "#6CC8EE99",
        backgroundColor: "#6CC8EE",
      },
      {
        label: "Non-verified",
        data: [45, 83, 53, 62, 154, 109, 175],
        borderColor: "rgba(53, 162, 235, 0.5)",
        backgroundColor: "rgba(53, 162, 235)",
      },
      {
        label: "Verification Pending",
        data: [20, 24, 35, 55, 39, 46, 41],
        borderColor: "#C7E3FF99",
        backgroundColor: "#C7E3FF",
      },
    ],
  };

  return (
    <div>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0 fw-bold">Users/Onboarded</h1>
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
          <div className="container-fluid bg-white">
            <div className="mx-3">
              <p className="m-0">Onboarding Date</p>
              <button
                type="button"
                className="btn btn-light d-flex justify-content-center align-items-center"
              >
                <i className="fa fa-calendar" />
                <span className="fs-6 px-2">
                  Last 7 days: Dec 8, 2021 - Dec 14, 2021
                </span>
                <i className="fa fa-caret-down" />
              </button>
            </div>

            <div className="row">
              <div className="row col-md-10 m-3">
                <div className="col-md-2">
                  <h1 className="mb-0">{users.length}</h1>
                  <h6>Users</h6>
                </div>
                <div className="col-md-2">
                  <h1 className="mb-0">
                    {users.filter((user) => user.verified).length}
                  </h1>
                  <h6>Verified</h6>
                </div>
                <div className="col-md-2">
                  <h1 className="mb-0">
                    {users.filter((user) => !user.verified).length}
                  </h1>
                  <h6>Non-verified</h6>
                </div>
                <div className="col-md-2">
                  <h1 className="mb-0">720</h1>
                  <h6>Verificiation Pending</h6>
                </div>
              </div>

              <div className="col-md-10">
                <div className="card-info">
                  <div className="card-body">
                    <div className="chart">
                      {/* <canvas id="lineChart" style={{ minHeight: 250, height: 250, maxHeight: 250, maxWidth: '100%' }} /> */}
                      <Line options={options} data={data}></Line>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="content mt-4">
          <div className="container-fluid bg-white">
            <h3>Users</h3>

            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 10 }}></th>
                  <th>Name</th>
                  <th>Onboarded on</th>
                  <th>Created</th>
                  <th>Sold</th>
                  <th>Collected</th>
                  <th>Followers</th>
                  <th>
                    Status <i className="fa fa-caret-down"></i>
                  </th>

                  {/* <th style={{ width: 40 }}>Label</th> */}
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td></td>
                    <td className="">
                    <Link href="/users/onboarding/profile">
                      <div className="d-flex flex-row" style={{cursor:'pointer'}}>
                        {/* profile image */}
                        <div
                          className="g-col position-relative overflow-hidden rounded-circle"
                          style={{ width: "50px", height: "50px" }}
                        >
                          {user?.profilePic?.url ? (
                            <Image
                              src={user.profilePic.url}
                              objectFit="cover"
                              layout="fill"
                            />
                          ) : (
                            <div
                              className="bg-success position-absolute"
                              style={{ left: 0, top: 0, right: 0, bottom: 0 }}
                            ></div>
                          )}
                        </div>
                        <div className="d.flex flex-row ml-2">
                          <p className="m-0">
                            {user.ethAddress && user.ethAddress.slice(30)}...
                            {user.ethAddress && user.ethAddress.slice(-4)}
                          </p>
                          <p
                            className="m-0 text-truncate"
                            style={{ width: "150px" }}
                          >
                            @{user.username}
                          </p>
                        </div>
                      </div>
                      </Link>
                    </td>
                    <td>
                      {(function () {
                        const d = new Date(user.createdAt);
                        return `${d.getDay()}/${
                          d.getMonth() + 1
                        }/${d.getFullYear()}`;
                      })()}
                    </td>
                    <td>{user.nftCreated}</td>
                    <td>0</td>
                    <td className="align-items-center">0</td>
                    <td>
                      <div className="d-flex align-items-center">0</div>
                    </td>
                    <td>
                      <div className="d-flex flex-row align-items-center">
                        {user.verified ? (
                          <span className="badge bg-success fw-light ">
                            Verified
                          </span>
                        ) : (
                          <span className="badge bg-gray fw-light ">
                            Non-verified
                          </span>
                        )}
                        <button
                          type="button"
                          className="col outline-none border-0 rounded-sm fs-6 bg-primary ml-4"
                        >
                          Notify
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ul className="pagination pagination-sm">
              <li className="page-item">
                <a className="page-link" href="#">
                  «
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  1
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  2
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  3
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  »
                </a>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
