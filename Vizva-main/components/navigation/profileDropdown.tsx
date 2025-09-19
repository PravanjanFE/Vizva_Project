import Link from "next/link";
import React, {
  AnchorHTMLAttributes,
  Fragment,
  useContext,
  useState,
} from "react";
import { ThemeContext } from "context/themeContext";
import styled from "@emotion/styled";
import UserIcon from "components/icons/user";
import CollaborateIcon from "components/icons/collaborate";
import HandIcon from "components/icons/hand";
import ActivityIcon from "components/icons/activity";
import SignoutIcon from "components/icons/signout";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/dist/client/router";
import { Menu, Switch } from "@headlessui/react";
import { useEffect } from "react";
import Button from "components/button";
import { ethers } from "ethers";
import {
  useGetWETHBalance,
  usefetchPairPrice,
  useGetMaticBalance,
} from "hooks/useServices";
import MaticIcon from "components/icons/matic";
import MoonOutlineIcon from "components/icons/moonOutline";
import { breakpoint } from "public/breakpoint";
import Image from "next/image";
import Logo from "./logo";
import CloseIcon from "components/icons/close";

interface UserData {
  username?: string;
  profilePic?: { url: string };
  ethAddress?: ethers.BigNumber;
}

interface ProfileDropdown {
  openBuyWETHModal: () => void;
}

export default function ProfileDropdown({ openBuyWETHModal }: ProfileDropdown) {
  const { logout, isAuthenticated, user, Moralis, web3 } = useMoralis();
  const router = useRouter();
  const [biddingBalance, setBiddingBalance] = useState(0);
  const [nativeBalance, setNativeBalance] = useState(0);
  const [fiatValue, setFiatValue] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer>();
  const [userData, setUserData] = useState<UserData>({});
  const [isOpen, setIsOpen] = useState(false);
  const [width, setWidth] = useState(0);

  const { data: wrapedBalance, execute: getWETHBalance } = useGetWETHBalance();
  const { data: priceData } = usefetchPairPrice();
  const { data: MATICBalance, execute: getMaticBalance } = useGetMaticBalance();

  function openDropdown() {
    setIsOpen(true);
  }

  const handleSignout = async () => {
    if (isAuthenticated) {
      router.replace("/");
      const userAddress = user?.get("ethAddress");
      logout().then(() => {
        // console.log(`userLoggedOut:${userAddress}`);
        clearInterval(intervalId as NodeJS.Timer);
        localStorage.removeItem("provider");
        localStorage.setItem("logout-event", "logout");
      });
    }
  };

  useEffect(() => {
    setWidth(document.body.clientWidth);
  }, [document.body.clientHeight]);

  useEffect(() => {
    let interval: NodeJS.Timer;
    if (isAuthenticated) {
      getMaticBalance();
      setUserData(JSON.parse(JSON.stringify(user)));
      if (intervalId) return;
      // this effect is calling two times.
      // hence two intervals are created. find a solution
      interval = setInterval(() => {
        if (isAuthenticated) {
          getWETHBalance();
          getMaticBalance();
        }
      }, 40000);
      setIntervalId(interval);
    } else {
      setUserData({});
    }
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (wrapedBalance) {
      setBiddingBalance(wrapedBalance);
    }
    if (MATICBalance) {
      setNativeBalance(parseFloat(parseFloat(MATICBalance).toFixed(2)));
    }
  }, [wrapedBalance, MATICBalance]);
  
  useEffect(() => {
    if (priceData) {
      setFiatValue(priceData?.["matic-network"]?.usd);
    }
  }, [priceData]);

  const { username, profilePic, ethAddress: walletId } = userData;
  return (
    <Menu as={Fragment}>
      <StyledMenu>
        {/* BUG: having two menu buttons causes a bug */}
        <Menu.Button>
          <span>{username}</span>
          <div className="profile-image">
            {profilePic && (
              <Image
                alt="profile picture"
                src={profilePic.url}
                objectFit="cover"
                width="100"
                height="100"
              />
            )}
          </div>
        </Menu.Button>

        {/* @ts-ignore */}
        <Menu.Items as={React.Fragment}>
          <StyledWrapper>
            <StyledMobileHeader>
              <Logo />

              {width <= 640 && (
                <Menu.Button>
                  <CloseIcon />
                </Menu.Button>
              )}
            </StyledMobileHeader>

            <CustomLink href={`/${username}`}>
              <>
                <div>
                  <UserIcon />
                </div>
                <div>my profile</div>
              </>
            </CustomLink>

            {/* <CustomLink href="/collaborations">
          <>
            <div>
              <CollaborateIcon />
            </div>
            <div>my collaborations</div>
          </>
        </CustomLink> */}
            <CustomLink href="/activity">
              <>
                <div>
                  <ActivityIcon />
                </div>
                <div>activity</div>
              </>
            </CustomLink>
            <CustomLink href="/bids">
              <>
                <div>
                  <HandIcon />
                </div>
                <div>bids</div>
              </>
            </CustomLink>

            {/* changetheme */}

            <div className="change-theme">
              <div>
                <MoonOutlineIcon />
              </div>
              <div>
                <p>dark mode</p>
              </div>
              <Toggle />
            </div>

            {/* disconnect */}
            <Menu.Item>
              {({ active }: { active: boolean }) => (
                <div className={`${active ? "active " : ""} disconnect`}>
                  <button onClick={() => handleSignout()}>
                    <div>
                      <SignoutIcon />
                    </div>
                    <div>
                      <p>signout</p>
                    </div>
                  </button>
                </div>
              )}
            </Menu.Item>

            <div className="hr"></div>
            <p>Total Balance</p>
            {walletId ? (
              <>
                <div className="balance">
                  <MaticIcon currency="MATIC" className="icon" />
                  <p>{nativeBalance ?? "0"} MATIC</p>
                  <p>(${(fiatValue * nativeBalance).toFixed(3)})</p>
                </div>
                <div className="hr"></div>

                <div className="balance">
                  <MaticIcon currency="WMATIC" className="icon" />
                  <p>
                    {biddingBalance
                      ? parseFloat(biddingBalance.toString()).toFixed(3)
                      : "0"}{" "}
                    WMATIC
                  </p>
                  <p>(${(fiatValue * biddingBalance).toFixed(3)})</p>
                </div>
                <div className="hr"></div>
                <Menu.Item>
                  {({ active }: { active: boolean }) => (
                    <Button
                      className={`${active ? "active " : ""} convert`}
                      text="Convert"
                      onClick={() => openBuyWETHModal()}
                      size="sm"
                      block
                    />
                  )}
                </Menu.Item>
              </>
            ) : (
              <>
                <p id="connect-wallet-text">
                  to continue your NFT buying and selling
                </p>
                <Menu.Item>
                  {({ active }: { active: boolean }) => (
                    <Button
                      className={`${active ? "active " : ""} `}
                      text="Join"
                      // text="connect wallet"
                      href="/connectwallet"
                    />
                  )}
                </Menu.Item>
              </>
            )}
          </StyledWrapper>
        </Menu.Items>
      </StyledMenu>
    </Menu>
  );
}

// export default ProfileDropdown;

function Toggle({ className }: { className?: string }) {
  const { changeTheme, mode } = useContext(ThemeContext);
  const [theme, setTheme] = useState(() => (mode === "dark" ? true : false));

  function clickHandler() {
    setTheme(!theme);
    changeTheme();
  }
  return (
    <Menu.Item>
      {({ active }: { active: boolean }) => (
        <Switch as={Fragment} checked={theme} onChange={() => clickHandler()}>
          <StyledToggle className={`${active ? "active " : ""} ${className}`}>
            <div className={`${!theme ? "right" : "left"}`}></div>
          </StyledToggle>
        </Switch>
      )}
    </Menu.Item>
  );
}

function CustomLink(
  props: AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    children: JSX.Element;
  }
) {
  let { href, children, ...rest } = props;
  return (
    <Menu.Item>
      {({ active }: { active: boolean }) => (
        <Link href={href}>
          <a
            {...rest}
            className={
              active ? `${rest.className} active` : `${rest.className}`
            }
          >
            {children}
          </a>
        </Link>
      )}
    </Menu.Item>
  );
}

const StyledMenu = styled.div`
  & > button {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 2px solid transparent;
    border-radius: 50%; //change if we are displaying the username

    & > span {
      margin-right: 1rem;
      text-transform: capitalize;
      display: none;
    }
    .profile-image {
      height: 36px;
      width: 36px;
      border-radius: 50%;
      position: relative;
      overflow: hidden;
      background-image: ${(props) => props.theme.gradient};
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
    }
    &:hover,
    &:focus {
      border-color: ${(props) => props.theme.green};
    }

    ${breakpoint("sm")} {
      .profile-image {
        width: 50px;
        height: 50px;
      }
    }
  }
`;

const StyledWrapper = styled.ul`
  width: calc(100% + var(--padding-6) + var(--padding-6));
  height: 100vh;
  min-width: 300px;
  flex-direction: column;
  display: flex;
  top: 0px;

  position: absolute;
  right: calc(var(--padding-6) * -1);
  padding: 0 var(--padding-6);

  background-color: ${(props) => props.theme.onBackground};
  border: 1px solid ${(props) => props.theme.gray4};
  outline: none;
  /* z-index: 10; */
  & > p {
    color: ${(props) => props.theme.gray2};
    text-align: center;
    margin-bottom: 10px;
  }

  & > a {
    &:hover,
    &:focus,
    &.active {
      div {
        color: ${(props) => props.theme.green};
      }
    }
    margin-bottom: var(--padding-4);
  }

  & > a,
  .disconnect > button {
    display: inline-flex;
    align-items: center;
    text-transform: capitalize;
    outline: none;
    color: ${(props) => props.theme.primary};
    width: 100%;

    div:first-of-type {
      width: 20px;
      display: grid;
      place-items: center;
      svg {
        stroke: ${(props) => props.theme.gray2};
      }
    }
    div:last-of-type {
      margin-left: 1rem;
    }

    &:hover,
    &:focus {
      color: ${(props) => props.theme.green};
    }
  }

  .disconnect {
    & > button {
      background-color: transparent;
      border: none;
      outline: none;
      font-size: 1rem;
      cursor: pointer;
    }

    cursor: pointer;
    &:hover,
    &:focus,
    &.active {
      p {
        color: ${(props) => props.theme.green};
      }
    }
  }

  .change-theme {
    display: grid;
    /* icon - text - toggle */
    grid-template-columns: max-content 1fr max-content;
    align-items: center;
    margin-bottom: var(--padding-4);
    /* the theme icon */
    & > div:nth-of-type(1) {
      width: 20px;
      display: grid;
      place-items: center;
      svg {
        stroke: ${(props) => props.theme.gray2};
      }
    }
    /* the text */
    & > div:nth-of-type(2) {
      margin-left: 1rem;
      text-transform: capitalize;
    }
    &:hover,
    &:focus,
    &.active {
      p {
        color: ${(props) => props.theme.green};
      }
    }
  }

  .hr {
    background: ${(props) => props.theme.gray2};
    margin: var(--padding-4) auto;
    width: 100%;
    height: 1px;
  }

  .balance {
    display: grid;
    /* icon, text, text */
    grid-template-columns: max-content max-content max-content;
    align-items: center;
    gap: 0.7rem;
    .icon {
      /* width: 20px;
      height: 20px; */
    }
    p:first-of-type {
      font-size: 0.95em;
    }
    p:last-of-type {
      color: ${(props) => props.theme.gray3};
      font-weight: 200;
      font-size: 0.95em;
    }
  }

  .convert.active {
    &::after {
      opacity: 1;
    }
  }
  ${breakpoint("sm")} {
    right: 0;
    width: max-content;
    height: fit-content;
    z-index: 10;
    border-radius: 2rem;
    right: 0;
    padding: 2rem;
    top: calc(100px - var(--padding-6) + 10px);

    & > a,
    .change-theme {
      margin-bottom: var(--padding-3);
    }
    .hr {
      margin: var(--padding-3) auto;
    }
  }
`;
const StyledToggle = styled.div`
  width: 40px;
  max-width: 40px;
  height: 25px;
  border: 1px solid ${(props) => props.theme.gray2};
  background-color: transparent;
  outline: none;
  border-radius: 20px;
  cursor: pointer;
  position: relative;
  div {
    position: absolute;
    top: 50%;
    border-radius: 100%;
    width: 12px;
    height: 12px;
    background-color: ${(props) =>
      props.theme.mode != "dark" ? props.theme.gray2 : "#fff"};
    transition: 150ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .right {
    transform: translate(calc(-50% + 12px), -50%);
  }
  .left {
    transform: translate(calc(50% + 12px), -50%);
  }

  &:focus,
  &:hover,
  &.active {
    div {
      background-color: ${(props) => props.theme.green};
    }
  }
`;
const StyledMobileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100px;
  /* padding: 0 var(--padding-6); */

  & > button {
    display: flex;
    align-items: center;
    justify-content: center;
    outline: none;
    width: 35px;
    height: 35px;
    padding: 6px;
    /* outline: none; */
    border: none;
    border-radius: 50%;
  }

  ${breakpoint("sm")} {
    display: none;
  }
`;
