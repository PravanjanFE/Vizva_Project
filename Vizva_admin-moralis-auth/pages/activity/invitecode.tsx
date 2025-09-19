import { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { useMoralis, useMoralisQuery } from "react-moralis";
import Swal from "sweetalert2";
import { ethers } from "ethers";

export default function InviteCode() {
  const [showModal, setShowModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState("Pending");
  const [pendingTableData, setPendingTableData] = useState<any[]>([]);
  const [approvedTableData, setApprovedTableData] = useState<any[]>([]);
  const [waitlistTableData, setWaitlistTableData] = useState<any[]>([]);
  const [newWalletAddress, setNewWalletAddress] = useState<string>("");
  const [resendingData, setResendingData] = useState<any>({});
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const { fetch, data, error, isLoading } = useMoralisQuery(
    "InviteCodeData",
    (query) => query.descending("createdAt").limit(1000)
  );
  const { Moralis } = useMoralis();

  useEffect(() => {
    if (data) {
      setPendingTableData([]);
      setApprovedTableData([]);
      setWaitlistTableData([]);
      for (let i = 0; i < data.length; i++) {
        const inviteData = data[i];
        const status = inviteData.get("status");
        if (status === "pending") {
          const rowData = {
            id: inviteData.id,
            email: inviteData.get("email"),
            address: inviteData.get("walletAddress"),
            sentOn: inviteData.get("createdAt").toDateString(),
          };
          setPendingTableData((data) => [...data, rowData]);
        }
        if (status === "approved") {
          const rowData = {
            id: inviteData.id,
            email: inviteData.get("email"),
            address: inviteData.get("walletAddress"),
            sentOn: inviteData.get("createdAt").toDateString(),
            inviteCode: inviteData.get("inviteCode"),
            approvedOn: inviteData.get("approvedOn").toDateString(),
            loggedOn: inviteData.get("loggedIn")?.toDateString() || "",
            resend: inviteData.get("renewed"),
          };
          setApprovedTableData((data) => [...data, rowData]);
        }
        if (status === "waitlist") {
          const rowData = {
            id: inviteData.id,
            email: inviteData.get("email"),
            address: inviteData.get("walletAddress"),
            sentOn: inviteData.get("createdAt").toDateString(),
            resend: inviteData.get("renewed"),
          };
          setWaitlistTableData((data) => [...data, rowData]);
        }
      }
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      Swal.fire(
        "Oops!",
        `fetching data failed, Reason: ${error.message}`,
        "error"
      );
    }
  }, [error]);

  async function approveInvite(id: string) {
    try {
      await Moralis.Cloud.run("approveJoin", {
        id,
      });
      fetch();
    } catch (error: any) {
      console.error(error);
      Swal.fire("Oops!", error.message, "error");
    }
  }

  async function moveToWaitlist(id: string) {
    try {
      await Moralis.Cloud.run("moveToWaitlist", {
        id,
      });
      fetch();
    } catch (error: any) {
      console.error(error);
      Swal.fire("Oops!", error.message, "error");
    }
  }

  async function resendInvite(id: string, walletAddress: string) {
    try {
      const valid = ethers.utils.isAddress(walletAddress);
      if (!valid) {
        throw new Error("wallet address is not valid, Please check");
      }
      await Moralis.Cloud.run("resendInvite", {
        id,
        walletAddress,
      });
      fetch();
      handleClose();
    } catch (error: any) {
      console.error(error);
      Swal.fire("Oops!", error.message, "error");
    }
  }

  const pendingTable = () => {
    return (
      <>
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 10 }}></th>
              <th>Email Address</th>
              <th>Wallet Address</th>
              <th>Sent On</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pendingTableData.length > 0 &&
              pendingTableData.map((item, index) => (
                <tr key={index}>
                  <td></td>
                  <td className="">{item.email}</td>
                  <td>{item.address}</td>
                  <td>{item.sentOn}</td>
                  <td>
                    <div className="row">
                      <button
                        type="button"
                        className="col-md-3 outline-none border-0 rounded-sm fs-6 bg-primary mr-2"
                        onClick={() => approveInvite(item.id)}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="col-md-6 outline-none border-0 rounded-sm fs-6 bg-danger"
                        onClick={() => moveToWaitlist(item.id)}
                      >
                        Move to waitlist
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {pendingTableData.length === 0 && (
          <div className="text-center">No Pending Invites</div>
        )}
      </>
    );
  };

  const waitlistTable = () => {
    return (
      <>
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 10 }}></th>
              <th>Email Address</th>
              <th>Wallet Address</th>
              <th>Sent On</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {waitlistTableData.length > 0 &&
              waitlistTableData.map((item, index) => (
                <tr key={index}>
                  <td></td>
                  <td className="">{item.email}</td>
                  <td>{item.address}</td>
                  <td>{item.sentOn}</td>
                  <td>
                    <button
                      type="button"
                      className="outline-none border-0 rounded-sm fs-6 bg-primary mr-2"
                      onClick={() => approveInvite(item.id)}
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {waitlistTableData.length === 0 && (
          <div className="text-center">No Waitlisted Invites</div>
        )}
      </>
    );
  };

  const approvedTable = () => {
    return (
      <>
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 10 }}></th>
              <th>Email Address</th>
              <th>Wallet Address</th>
              <th>Sent On</th>
              <th>Invite Code</th>
              <th>Approved On</th>
              <th>Logged On</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {approvedTableData.length > 0 &&
              approvedTableData.map((item, index) => (
                <tr
                  key={index}
                  style={{ color: `${item.resend && "lightgrey"}` }}
                >
                  <td></td>
                  <td className="">{item.email}</td>
                  <td>{item.address}</td>
                  <td>{item.sentOn || "-"}</td>
                  <td>{item.inviteCode}</td>
                  <td>{item.approvedOn}</td>
                  <td>{item.loggedOn}</td>
                  <td>
                    <button
                      type="button"
                      className={`outline-none border-0 rounded-sm fs-6 btn pt-0 pb-0 ${
                        item.resend ? "btn-secondary" : "btn-primary"
                      } mr-2`}
                      disabled={item.resend}
                      onClick={() => {
                        setShowModal(true);
                        setResendingData(item);
                      }}
                    >
                      Resend Invite Code
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {approvedTableData.length === 0 && (
          <div className="text-center">No Approved Invites</div>
        )}
      </>
    );
  };

  return (
    <div>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Acivity/Invite Code</h1>
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
          <div className="container-fluid p-4 bg-white" style={{minHeight: '520px'}}>
            <div className="row mb-4">
              <button
                type="button"
                className={`col-md-2 mr-2 rounded-sm fs-6 btn p-2 mb-4 ${
                  selectedAction === "Pending"
                    ? "btn-outline-primary bg-info"
                    : "btn-outline-secondary bg-light"
                }`}
                onClick={() => setSelectedAction("Pending")}
              >
                Pending({pendingTableData.length})
              </button>
              <button
                type="button"
                className={`col-md-2 mr-2 rounded-sm fs-6 btn p-2 mb-4 ${
                  selectedAction === "Waitlist"
                    ? "btn-outline-primary bg-info"
                    : "btn-outline-secondary bg-light"
                }`}
                onClick={() => setSelectedAction("Waitlist")}
              >
                Waitlist({waitlistTableData.length})
              </button>
              <button
                type="button"
                className={`col-md-2 rounded-sm fs-6 btn p-2 mb-4 ${
                  selectedAction === "Approved"
                    ? "btn-outline-primary bg-info"
                    : "btn-outline-secondary bg-light"
                }`}
                onClick={() => setSelectedAction("Approved")}
              >
                Approved({approvedTableData.length})
              </button>
            </div>

            <Modal show={showModal} onHide={handleShow}>
              <Modal.Header closeButton onClick={handleClose}>
                <Modal.Title>Resend Invite Code</Modal.Title>
              </Modal.Header>
              <Modal.Body className="bg-light">
                <label>Email Address</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  value={resendingData.email}
                  readOnly
                />
                <label>Wallet Address</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  value={resendingData.address}
                  readOnly
                />
                <label>New Wallet Address</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Type New Wallet Address"
                  value={newWalletAddress}
                  onChange={(e) => setNewWalletAddress(e.target.value)}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() =>
                    resendInvite(resendingData.id, newWalletAddress)
                  }
                >
                  Send
                </Button>
              </Modal.Footer>
            </Modal>

            {selectedAction === "Pending" && pendingTable()}
            {selectedAction === "Waitlist" && waitlistTable()}
            {selectedAction === "Approved" && approvedTable()}

            {/* <ul className="pagination pagination-sm">
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
            </ul> */}
          </div>
        </section>
      </div>
    </div>
  );
}
