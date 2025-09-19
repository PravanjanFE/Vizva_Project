import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Loader from './Loader'
import LoginForm from './LoginForm'
import React from 'react';
import { useMoralis } from "react-moralis"

interface Props {
    children: React.ReactNode;
}

// This is a custom HOC that wraps the component in a <ProtectedRoutes>
// component. It is used to protect routes that require authentication.
// The <ProtectedRoutes> component will check if the user is authenticated
// to view the route. If not, it will redirect to the login/dashboard page.

export default function ProtectedRoutes(props: Props) {
    const { Moralis, isAuthenticated, user, isInitialized, isInitializing, logout } = useMoralis();
    const [role, setRole] = React.useState<string | null>(null);
    const [pagesAllowed, setPagesAllowed] = React.useState<string[]>([]);
    const router = useRouter();

    // if user not logged in redirect to login page
    useEffect(() => {
        if (isInitialized && !Moralis.User.current() && router.pathname !== '/login' && router.pathname !== '/password-reset') {
            router.push('/login');
        }
    }, [isInitializing, isInitialized, isAuthenticated, router])

    // useffect on user change, call moralis cloud function getAdminPagesAllowed
    useEffect(() => {
        if (isInitialized && Moralis.User.current() && !role && !pagesAllowed.length) {
            // FIX: if front end user is logged in and tries to access admin page, logout
            // WHY: if base domain is same and the user is logged in on frontend, they automatically get logged in on backend via moralis sdk, although they can't see the pages.
            Moralis.Cloud.run('isBackendAccessAllowed').then(res => {
                if (res !== true) {
                    // logout user
                    logout();
                    router.push('/login');
                }
            });
            Moralis.Cloud.run('getAdminPagesAllowed').then(result => {
                if (result.length === 0) {
                    // logout user
                    logout();
                    router.push('/login');
                }
                if (result.length > 0) {
                    const response = JSON.parse(result)[0];
                    setRole(response.role);
                    setPagesAllowed(response.pages);
                    // console.log(response);
                }
            });
        }
    }, [isInitialized, user])

    useEffect(() => {
        // url routes protection logic and hiding sidebar menus that are not allowed
        if (isInitialized && Moralis.User.current() && pagesAllowed.length && role !== 'admin') {
            // convert all pagesAllowed to lowercase and remove spaces
            const pagesAllowedLower = pagesAllowed.map(page => page.toLowerCase().replace(/\s/g, ''));
            // hide all .nav-item under .sidebar where .nav-title is not in pagesAllowed
            const navItems = document.querySelectorAll('.sidebar .nav-item');
            navItems.forEach(navItem => {
                const navTitle = navItem.querySelector('.nav-title');
                if (navTitle && !pagesAllowedLower.includes((navTitle as HTMLElement).innerText.toLowerCase().replace(/\s/g, ''))) {
                    (navItem as HTMLElement).style.display = 'none';
                }
            });
            // get first part of router pathname without trailing slash
            const pathname = router.pathname.split('/')[1];
            if (router.pathname !== '/' && router.pathname !== '/login' && !pagesAllowedLower.includes(pathname)) {
                router.push('/');
            }
        }
    }, [isInitialized, user, router, pagesAllowed, role])

    return (
        <>
            {isInitializing ? <Loader /> : <>{props.children}</>}
        </>
    );
}

// TODO: Server Side Rendering for additional security