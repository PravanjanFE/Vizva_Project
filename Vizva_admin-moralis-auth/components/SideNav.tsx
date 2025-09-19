import Link from "next/link";
import { useRouter } from "next/router";
import Image from 'next/image';
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";

export default function SideNav() {
    const router = useRouter();
    const { Moralis, user, logout, isAuthenticated } = useMoralis();
    const [userPermissions, setUserPermissions] = useState([] as string[])

    useEffect(() => {
        if (user?.get('backendPermissions')) {
            setUserPermissions(user?.get('backendPermissions')[0].pages)
        }
    }, [user])

    return (
        <>
            <div>
                <aside className="main-sidebar sidebar-dark-primary elevation-4">
                    <a href="index3.html" className="brand-link p-4" style={{ display: "flex", alignItems: "center" }}>
                        <Image
                            src="/static/dist/img/AdminLTELogo.png"
                            alt="AdminLTE Logo"
                            className="brand-image img-circle elevation-3"
                            style={{ opacity: ".8" }}
                            width={33}
                            height={33}
                        />
                        <span className="brand-text font-weight-light ml-2">Vizva Admin</span>
                    </a>
                    <div className="sidebar">
                        {isAuthenticated && (
                            <>
                                <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                                    <div className="image">
                                        <div className="img-circle border bg-light d-flex justify-content-center align-self-center"
                                            style={{ height: "35px", width: "35px", fontSize: "21px", textTransform: "capitalize" }}>
                                            {user?.getUsername()?.[0]}
                                        </div>
                                        {/* <Image
                                        src="/static/dist/img/user2-160x160.jpg"
                                        className="img-circle elevation-2"
                                        alt="User Image"
                                        height={34}
                                        width={34}
                                    /> */}
                                    </div>
                                    <div className="info">
                                        <Link href="/profile">
                                            <a className="d-block">
                                                Hi, {user?.getUsername()}
                                            </a>
                                        </Link>
                                    </div>
                                </div>
                                <div className="form-inline">
                                </div>
                                <nav className="mt-2">
                                    <ul
                                        className="nav nav-pills nav-sidebar flex-column"
                                        data-widget="treeview"
                                        role="menu"
                                        data-accordion="false"
                                    >
                                        {userPermissions.includes('Dashboard') && <li className="nav-item">
                                            <Link href="/">
                                                <a
                                                    className={`nav-link ${router.pathname == "/" ? "active" : ""
                                                        }`}
                                                >
                                                    <i className="nav-icon fas fa-th" />
                                                    <p className="nav-title">
                                                        Dashboard
                                                    </p>
                                                </a>
                                            </Link>
                                        </li>}
                                        {userPermissions.includes('Activity') && <li
                                            className={`nav-item ${router.pathname.split("/")[1] == "activity" ? "menu-open" : ""
                                                }`}
                                        >
                                            <Link href="/activity/invitecode">
                                                <a
                                                    className={`nav-link ${router.pathname.split("/")[1] == "activity"
                                                        ? "active"
                                                        : ""
                                                        }`}
                                                >
                                                    <i className="nav-icon fas fa-tree" />
                                                    <p className="nav-title">
                                                        Activity
                                                        <i className="fas fa-angle-down right" />
                                                    </p>
                                                </a>
                                            </Link>
                                            <ul className="nav nav-treeview">
                                                {/* <li className="nav-item">
                                                <Link href="/activity/post">
                                                    <a
                                                        className={`nav-link ${router.pathname == "/activity/post" ? "bg-dark" : ""
                                                            }`}
                                                    >
                                                        <i
                                                            className={`far nav-icon ml-3 ${router.pathname == "/activity/post"
                                                                ? "fa-check-circle"
                                                                : "fa-circle"
                                                                }`}
                                                        />
                                                        <p>Post</p>
                                                    </a>
                                                </Link>
                                            </li> */}
                                                <li className="nav-item">
                                                    <Link href="/activity/invitecode">
                                                        <a
                                                            className={`nav-link ${router.pathname == "/activity/invitecode"
                                                                ? "bg-dark"
                                                                : ""
                                                                }`}
                                                        >
                                                            <i
                                                                className={`far nav-icon ml-3 ${router.pathname == "/activity/invitecode"
                                                                    ? "fa-check-circle"
                                                                    : "fa-circle"
                                                                    }`}
                                                            />
                                                            <p>Invite Code</p>
                                                        </a>
                                                    </Link>
                                                </li>
                                                <li className="nav-item">
                                                    <Link href="/activity/batchminting">
                                                        <a
                                                            className={`nav-link ${router.pathname == "/activity/batchminting"
                                                                ? "bg-dark"
                                                                : ""
                                                                }`}
                                                        >
                                                            <i
                                                                className={`far nav-icon ml-3 ${router.pathname == "/activity/batchminting"
                                                                    ? "fa-check-circle"
                                                                    : "fa-circle"
                                                                    }`}
                                                            />
                                                            <p>Batch Minting</p>
                                                        </a>
                                                    </Link>
                                                </li>
                                                {/* <li className="nav-item">
                                                <Link href="/activity/mail">
                                                    <a
                                                        className={`nav-link ${router.pathname == "/activity/mail" ? "bg-dark" : ""
                                                            }`}
                                                    >
                                                        <i
                                                            className={`far nav-icon ml-3 ${router.pathname == "/activity/mail"
                                                                ? "fa-check-circle"
                                                                : "fa-circle"
                                                                }`}
                                                        />
                                                        <p>Mail</p>
                                                    </a>
                                                </Link>
                                            </li> */}
                                            </ul>
                                        </li>}
                                        {userPermissions.includes('Users') && <li
                                            className={`nav-item ${router.pathname.split("/")[1] == "users" ? "menu-open" : ""
                                                }`}
                                        >
                                            <Link href="/users/onboarding">
                                                <a
                                                    className={`nav-link ${router.pathname.split("/")[1] == "users" ? "active" : ""
                                                        }`}
                                                >
                                                    <i className="nav-icon far fa-user" />
                                                    <p className="nav-title">
                                                        Users
                                                        <i className="fas fa-angle-down right" />
                                                    </p>
                                                </a>
                                            </Link>
                                            <ul className="nav nav-treeview">
                                                <li className="nav-item">
                                                    <Link href="/users/onboarding">
                                                        <a
                                                            className={`nav-link ${router.pathname.split("/")[2] == "onboarding"
                                                                ? "bg-dark"
                                                                : ""
                                                                }`}
                                                        >
                                                            <i
                                                                className={`far nav-icon ml-3 ${router.pathname.split("/")[2] == "onboarding"
                                                                    ? "fa-check-circle"
                                                                    : "fa-circle"
                                                                    }`}
                                                            />
                                                            <p>Onboarding</p>
                                                        </a>
                                                    </Link>
                                                </li>
                                                <li className="nav-item">
                                                    <Link href="/users/verification">
                                                        <a
                                                            className={`nav-link ${router.pathname.split("/")[2] == "verification"
                                                                ? "bg-dark"
                                                                : ""
                                                                }`}
                                                        >
                                                            <i
                                                                className={`far nav-icon ml-3 ${router.pathname.split("/")[2] == "verification"
                                                                    ? "fa-check-circle"
                                                                    : "fa-circle"
                                                                    }`}
                                                            />
                                                            <p>Verification</p>
                                                        </a>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>}
                                        {/* {userPermissions.includes('Content') && <li className="nav-item">
                                        <Link href="/content">
                                            <a
                                                className={`nav-link ${router.pathname == "/content" ? "active" : ""
                                                    }`}
                                            >
                                                <i className="nav-icon far fa-edit" />
                                                <p className="nav-title">Content</p>
                                            </a>
                                        </Link>
                                    </li>} */}
                                        {/* {userPermissions.includes('Performance') && <li className="nav-item">
                                        <Link href="/performance">
                                            <a
                                                className={`nav-link ${router.pathname == "/performance" ? "active" : ""
                                                    }`}
                                            >
                                                <i className="nav-icon fas fa-tachometer-alt" />
                                                <p className="nav-title">Performance</p>
                                            </a>
                                        </Link>
                                    </li>} */}
                                        {userPermissions.includes('Control Panel') && <li
                                            className={`nav-item ${router.pathname.split("/")[1] == "controlpanel"
                                                ? "menu-open"
                                                : ""
                                                }`}
                                        >
                                            <Link href="/controlpanel/access">
                                                <a
                                                    className={`nav-link ${router.pathname.split("/")[1] == "controlpanel"
                                                        ? "active"
                                                        : ""
                                                        }`}
                                                >
                                                    <i className="nav-icon far fa-plus-square" />
                                                    <p className="nav-title">
                                                        Control Panel
                                                        <i className="fas fa-angle-down right" />
                                                    </p>
                                                </a>
                                            </Link>
                                            <ul className="nav nav-treeview">
                                                <li className="nav-item">
                                                    <Link href="/controlpanel/access">
                                                        <a
                                                            className={`nav-link ${router.pathname.split("/")[2] == "access"
                                                                ? "bg-dark"
                                                                : ""
                                                                }`}
                                                        >
                                                            <i
                                                                className={`far nav-icon ml-3 ${router.pathname.split("/")[2] == "access"
                                                                    ? "fa-check-circle"
                                                                    : "fa-circle"
                                                                    }`}
                                                            />
                                                            <p>Access</p>
                                                        </a>
                                                    </Link>
                                                </li>
                                                <li className="nav-item">
                                                    <Link href="/controlpanel/pages">
                                                        <a
                                                            className={`nav-link ${router.pathname == "/controlpanel/pages"
                                                                ? "bg-dark"
                                                                : ""
                                                                }`}
                                                        >
                                                            <i
                                                                className={`far nav-icon ml-3 ${router.pathname == "/controlpanel/pages"
                                                                    ? "fa-check-circle"
                                                                    : "fa-circle"
                                                                    }`}
                                                            />
                                                            <p>Pages</p>
                                                        </a>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>}
                                    </ul>
                                </nav>
                            </>
                        )}
                    </div>
                </aside>
            </div>
            <style jsx>{`
              .nav-sidebar .menu-is-opening>.nav-link i.right, .nav-sidebar .menu-is-opening>.nav-link svg.right, .nav-sidebar .menu-open>.nav-link i.right, .nav-sidebar .menu-open>.nav-link svg.right {
                -webkit-transform: rotate(-180deg);
                transform: rotate(-180deg);
              }
            `}</style>
        </>
    );
}
