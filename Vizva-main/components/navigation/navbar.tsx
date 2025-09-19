import Link from "next/link";
import styled from "@emotion/styled";
import Logo from "components/navigation/logo";
import DropDown from "./dropdown";
import { DropdownItem } from "./dropdown";
import ProfileDropdown from "./profileDropdown";
import { breakpoint } from "public/breakpoint";
import { createRef, useContext, useEffect, useRef, useState } from "react";
import NavIcon from "./navIcons";
import Search from "components/form elements/search";
import BellIcon from "components/icons/bell";
import SearchIcon from "components/icons/search";
import MenuIcon from "components/icons/menu";
import CloseIcon from "components/icons/close";
import { useMoralis } from "react-moralis";
import SunIcon from "components/icons/sun";
import { ThemeContext } from "context/themeContext";
import Button from "components/button";
import MoonIcon from "components/icons/moon";
import MaxWidth from "components/layout/maxWidth";
import ConvertWETH from "components/layout/convertWETH";
import nProgress from "nprogress";
import { useGetUnreadNotificationCount } from "hooks/useServices";

export default function Navbar({
  active,
  showSearch = true,
}: {
  active?: string;
  showSearch?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isAuthenticated } = useMoralis();
  const { changeTheme, mode } = useContext(ThemeContext);
  const profileDropdown = createRef<HTMLAnchorElement>();
  const [buyWETHOpen, setBuyWETHOpen] = useState(false);
  const { count } = useGetUnreadNotificationCount();

  function closeBuyWETHModal() {
    setBuyWETHOpen(false);
  }
  function openBuyWETHModal() {
    setBuyWETHOpen(true);
  }

  useEffect(() => {
    if (isDropdownOpen) {
      profileDropdown?.current?.focus();
    }
  }, [isDropdownOpen]);
  return (
    <GlassBackground>
      <>
        <MaxWidth>
          <StyledNav>
            <Logo />

            <div className="show-lg">
              {showSearch && (
                <Search
                  className="navbar-search"
                  placeholder="Search by artists, artworks, bids"
                  icon
                  rounded
                />
              )}
            </div>

            <StyledNavigation>
              {/* discover */}
              <li className="show-md">
                <DropDown
                  text="discover"
                  active={
                    active?.toLowerCase() === "artist" ||
                    active?.toLowerCase() === "artwork"
                  }
                >
                  <>
                    <DropdownItem active={"artwork" === active}>
                      <Link href="/discover/artwork">
                        <a onClick={() => nProgress.start()}>artworks</a>
                      </Link>
                    </DropdownItem>
                    <DropdownItem active={"artist" === active}>
                      <Link href="/discover/artist">
                        <a onClick={() => nProgress.start()}>artists</a>
                      </Link>
                    </DropdownItem>
                  </>
                </DropDown>
              </li>
              {/* create */}
              <li className="show-md">
                <Link href="/create">
                  <a
                    className={`${active === "create" ? "active" : ""} create`}
                    onClick={() => nProgress.start()}
                  >
                    Create
                  </a>
                </Link>
              </li>
              {/* connect wallet */}
              {!isAuthenticated && (
                <li className="show-md">
                  <Button
                    variant="outline"
                    href="/connectwallet"
                    text="Join"
                    // text="Connect wallet"
                    size="sm"
                  />
                </li>
              )}
              {/* notification or theme icon */}
              <li className="hide-sm">
                {isAuthenticated ? (
                  // <Link href="">
                  //   <a>
                  <NavIcon
                    ariaLabel="Notifications"
                    onClick={() => nProgress.start()}
                    href="/activity?t=notification"
                    icon={<BellIcon />}
                    counter={count}
                  />
                ) : (
                  //   </a>
                  // </Link>
                  <NavIcon
                    ariaLabel="toggle theme"
                    icon={mode === "dark" ? <SunIcon /> : <MoonIcon />}
                    onClick={() => changeTheme()}
                  />
                )}
              </li>
              {/* mobile view */}

              {/* search icon */}
              {showSearch && (
                <li className="hide-lg">
                  <NavIcon
                    icon={<SearchIcon />}
                    onClick={() => {
                      setIsSearchOpen(true);
                    }}
                    ariaLabel="search"
                  />
                </li>
              )}
              {/* change theme mobile */}
              {!isAuthenticated && (
                <li className="hide-md">
                  <NavIcon
                    ariaLabel="toggle theme"
                    icon={mode === "dark" ? <SunIcon /> : <MoonIcon />}
                    onClick={() => changeTheme()}
                  />
                </li>
              )}
              {/* dropdown menu toggle */}
              <li className="hide-md">
                <NavIcon
                  ariaLabel="toggle dropdown"
                  className="menu"
                  icon={<MenuIcon />}
                  onClick={() => {
                    setIsOpen(true);
                  }}
                />
              </li>
              {/* profile dropdown */}
              {isAuthenticated && (
                <ProfileDropdown openBuyWETHModal={openBuyWETHModal} />
              )}
            </StyledNavigation>
          </StyledNav>
        </MaxWidth>

        {/* mobile search bar */}
        <StyledSearch $isSearchOpen={isSearchOpen}>
          <div className="header">
            <Search
              className="search"
              placeholder="Search by artists, artworks, bids"
              icon
              rounded
            />
            <button
              className="search__close-btn"
              onClick={() => {
                setIsSearchOpen(false);
              }}
            >
              <CloseIcon />
            </button>
          </div>
          <div
            className="search__background"
            onClick={() => setIsSearchOpen(false)}
          ></div>
        </StyledSearch>

        {/* mobile navigation */}
        <StyledMobileMenu $isNavOpen={isOpen}>
          <div className="header">
            <Logo />
            <NavIcon
              ariaLabel="toggle dropdown"
              className="close-nav"
              icon={<CloseIcon />}
              onClick={() => {
                setIsOpen(false);
              }}
            />
          </div>
          <div className="discover">Discover</div>
          <ul>
            {/* artist */}
            <li>
              <Link href="/discover/artist">
                <a className={"artist" === active ? "active" : undefined}>
                  artist
                </a>
              </Link>
            </li>
            {/* artwork */}
            <li>
              <Link href="/discover/artwork">
                <a className={"artwork" === active ? "active" : undefined}>
                  artwork
                </a>
              </Link>
            </li>

            <div className="hr"></div>

            {/* create */}
            <li>
              <Link href="/create">
                <a className={active === "create" ? "active" : undefined}>
                  Create
                </a>
              </Link>
            </li>
            <li></li>
            {/* connect wallet */}
            <li>
              {!isAuthenticated && (
                <Button
                  variant="outline"
                  href="/connectwallet"
                  text="Join"
                  // text="Connect wallet"
                  size="sm"
                />
              )}
            </li>
          </ul>
        </StyledMobileMenu>

        {buyWETHOpen && (
          <ConvertWETH close={closeBuyWETHModal} isOpen={buyWETHOpen} />
        )}
      </>
    </GlassBackground>
  );
}

export function GlassBackground({ children }: { children: JSX.Element }) {
  return (
    <StyledContainer>
      <StyledGlass></StyledGlass>
      <div className="backdrop"></div>
      {children}
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  position: sticky;
  top: 0px;
  width: 100%;
  z-index: 11;
  height: 100px;
  & > .backdrop {
    background: transparent;
    position: absolute;
    z-index: -1;
    inset: 0;
    backdrop-filter: blur(10px);
  }
`;

const StyledGlass = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
  z-index: -1;

  &:before {
    position: absolute;
    content: "";
    background: ${(props) => props.theme.background};
    left: -25px;
    right: 0;
    top: -25px;
    bottom: 0;
    filter: blur(50px);
  }
`;

const StyledMobileMenu = styled.nav<{ $isNavOpen: boolean }>`
  position: absolute;
  inset: 0;
  height: 100vh;
  width: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: ${(props) => props.theme.background} !important;
  z-index: 10;
  display: ${(props) => (props.$isNavOpen ? "block" : "none")};
  flex-direction: column;
  color: ${(props) => props.theme.gray2};
  padding: 0 var(--padding-6);

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--padding-6) 0;

    /* height: 74px; */
  }

  & > .discover {
    width: max-content;
    margin: var(--padding-5) auto;
    color: ${(props) => props.theme.gray2};
    font-size: var(--fontsizes-4);
  }

  ul {
    display: flex;
    flex-direction: column;
    list-style-type: none;
    align-items: center;

    li {
      margin-bottom: 2rem;
      width: 100%;
      text-align: center;
      a {
        cursor: pointer;
        text-transform: capitalize;
        text-align: center;
        /* font-size: var(--fontsizes-2); */

        &:focus,
        &:hover {
          color: ${(props) => props.theme.green};
        }
        &.create:hover {
          color: ${(props) => props.theme.green};
        }

        &.active {
          color: ${(props) => props.theme.gray2};
        }
      }
    }

    .hr {
      margin-bottom: 2rem;
      width: 100%;
      height: 1px;
      background-color: gray;
    }
  }
  .search-header {
    display: grid;
    grid-template-columns: 1fr max-content;
    grid-gap: 0.9375rem;
    align-items: center;

    .search-input {
      border-radius: 40px;
      height: 40px;
    }
  }

  ${breakpoint("md")} {
    display: none;
  }
`;

const StyledSearch = styled.div<{ $isSearchOpen: boolean }>`
  position: fixed;
  inset: 0;
  height: 100vh;
  width: 100vw;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 10;
  display: ${(props) => (props.$isSearchOpen ? "block" : "none")};
  flex-direction: column;
  color: ${(props) => props.theme.gray2};
  padding: var(--padding-6);
  .search__background {
    position: fixed;
    z-index: -1;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background-color: ${(props) => props.theme.background} !important;
  }
  .search {
    height: 50px;
    margin-right: 1rem;
  }
  .search__wrapper {
    max-width: unset;
    margin-right: var(--padding-8);
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100px;
  }
  .search__close-btn {
    min-width: 50px;
    min-height: 50px;
    background: transparent;
    outline: 1.5px solid ${(props) => props.theme.gray3};
    border: none;
    border-radius: 50%;
    cursor: pointer;
    fill:${(props) => props.theme.primary};

    &:hover {
      outline-color: ${(props) => props.theme.green};
      svg {
        transform: rotate(135deg);
        transition: 250ms ease;
      }
    }
  }
  ${breakpoint("lg")} {
    display: none;
  }
`;

const StyledNavigation = styled.ul`
  list-style-type: none;
  justify-self: end;
  width: max-content;
  display: grid;
  gap: 1rem;
  grid-auto-flow: column;
  align-items: center;

  & > li {
    a {
      cursor: pointer;
      text-transform: capitalize;
      text-align: center;
      color: ${(props) => props.theme.primary};
      font-weight: 500;

      /* font-size: var(--fontsizes-2); */
      &.create:hover {
        color: ${(props) => props.theme.green};
      }

      &.active {
        color: ${(props) => props.theme.gray2};
        &:hover {
          color: ${(props) => props.theme.gray2};
        }
      }
    }
  }

  ${breakpoint("lg")} {
    gap: var(--fontsizes-6);
  }
  ${breakpoint("3xl")} {
    /* gap: var(--fontsizes-8); */
  }
`;

const StyledNav = styled.nav`
  display: grid;
  grid-template-columns: max-content 1fr;
  align-content: center;
  /* padding: var(--padding-6) 0; */
  height: 100px;
  position: relative;

  .navbar-search {
    max-width: 637px;
  }

  .hide-sm {
    display: none;
  }

  .show-lg,
  .show-md {
    display: none;
  }

  ${breakpoint("sm")} {
    grid-gap: 3rem;
  }
  ${breakpoint("md")} {
    .show-md {
      display: block;
    }
    .hide-sm {
      display: block;
    }
    .hide-md {
      display: none;
      visibility: hidden;
    }
  }
  ${breakpoint("lg")} {
    grid-template-columns: max-content 1fr max-content;
    .show-lg {
      display: block;
    }
    .hide-lg {
      display: none;
    }
  }
`;

const StyledBackground = styled.div`
  background-color: transparent;
  pointer-events: none;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
`;
