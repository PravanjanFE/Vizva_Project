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
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useMoralisCloudFunction } from "react-moralis";
import { getUsersCreatedMonth } from "../../utils/users";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const labels = ["Dec 8", "Dec 9", "Dec 10", "Dec 11", "Dec 12", "Dec 13", "Dec 14"];

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
      label: "NFT created",
      data: [84, 102, 63, 146, 178, 245, 185],
      borderColor: "#4F8CB899",
      backgroundColor: "#4F8CB8",
    },
    {
      label: "NFT sold",
      data: [7, 14, 23, 17, 33, 19, 27],
      borderColor: "#6CC8EE99",
      backgroundColor: "#6CC8EE",
    }
  ],
};
export default function index() {
  const tableData = [
    { artistName: 'artistname', artName: 'NFT art name', createdDate: '29/11/2021', soldDate: '12/12/2021', price: 20, royalities: 2, transfers: 5, views: 257, status: 'Sold' },
    { artistName: 'artistname', artName: 'NFT art name', createdDate: '22/11/2021', soldDate: '22/11/2021', price: 20, royalities: 2, transfers: 5, views: 257, status: 'On Auction' },
    { artistName: 'artistname', artName: 'NFT art name', createdDate: '15/11/2021', soldDate: '16/11/2021', price: 20, royalities: 2, transfers: 5, views: 257, status: 'Payment Pending' },
    { artistName: 'artistname', artName: 'NFT art name', createdDate: '08/11/2021', soldDate: '12/11/2021', price: 20, royalities: 2, transfers: 5, views: 257, status: 'Sold' },
    { artistName: 'artistname', artName: 'NFT art name', createdDate: '05/10/2021', soldDate: '06/10/2021', price: 20, royalities: 2, transfers: 5, views: 257, status: 'On Auction' },
    { artistName: 'artistname', artName: 'NFT art name', createdDate: '22/09/2021', soldDate: '22/09/2021', price: 20, royalities: 2, transfers: 5, views: 257, status: 'Payment Pending' },
    { artistName: 'artistname', artName: 'NFT art name', createdDate: '21/09/2021', soldDate: '22/09/2021', price: 20, royalities: 2, transfers: 5, views: 257, status: 'On Auction' },
    { artistName: 'artistname', artName: 'NFT art name', createdDate: '17/09/2021', soldDate: '18/09/2021', price: 20, royalities: 2, transfers: 5, views: 257, status: 'On Auction' },
    { artistName: 'artistname', artName: 'NFT art name', createdDate: '17/09/2021', soldDate: '17/09/2021', price: 20, royalities: 2, transfers: 5, views: 257, status: 'Sold' }
  ];
  return (
    <div>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Content</h1>
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
              <p className="m-0">Posted Date</p>
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
                  <h1 className="mb-0">1200</h1>
                  <h6>Total NFT created</h6>
                </div>
                <div className="col-md-2">
                  <h1 className="mb-0">
                    469
                  </h1>
                  <h6>NFT sold</h6>
                </div>
                <div className="col-md-2">
                  <h1 className="mb-0">
                    210
                  </h1>
                  <h6>NFT Transfers</h6>
                </div>
                <div className="col-md-4">
                  <h1 className="mb-0">1,26,34,532 Rs</h1>
                  <h6>Total Commission</h6>
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
            <h3>NFT created</h3>

            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Created on</th>
                  <th>Sold on</th>
                  <th>Price</th>
                  <th>Royalities</th>
                  <th>Transfers</th>
                  <th>Views</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item, index) => {
                  return (<tr key={index}>
                    <td>
                      <div className="d-flex">
                        <div className="mr-1 mt-n2">
                          <Image
                            src="/static/dist/img/user2-160x160.jpg"
                            className="img-circle border"
                            alt="avatar"
                            height= {70}
                            width= {70}
                          />
                        </div>
                        <div>
                          <p className="mb-0">{item.artName}</p>
                          <p className="mb-0">@{item.artistName}</p>
                        </div>
                      </div>

                    </td>
                    <td>{item.createdDate}</td>
                    <td>{item.soldDate}</td>
                    <td>{item.price}</td>
                    <td>{item.royalities}</td>
                    <td>{item.transfers}</td>
                    <td>{item.views}</td>
                    <td>
                      <div className={`${item.status === 'Sold' ? "bg-secondary" : (item.status === 'On Auction' ? "bg-success" : "bg-warning")} "text-white"`} style={{ width: 'max-content', padding: '5px 30px', borderRadius: '25px' }}>{item.status}</div>
                    </td>
                  </tr>)

                })}

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
    </div >
  )
}
