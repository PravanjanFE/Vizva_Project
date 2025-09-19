import styled from "@emotion/styled";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import { useMoralis } from "react-moralis";
import Loading from "components/loading";
import Logo from "components/navigation/logo";
import metamask from "public/images/metamask.png";
import walletconnect from "public/images/wallet connect.png";
import Image from "next/image";
import Button from "components/button";
import MaxWidth from "components/layout/maxWidth";
import { GlassBackground } from "components/navigation/navbar";
import { breakpoint } from "public/breakpoint";
import { useAppDispatch } from "redux/hook";
import { addNotification } from "redux/slice/notificationSlice";
import { useEffect, useState } from "react";
import Prompt from "components/prompt";
import Head from "next/head";
import { errorMsg } from "public/error";
import { validateInviteCode } from "services/helpers";
import Moralis from "moralis-v1/types";

var networkID =
  process.env.APP_ENV == "testnet"
    ? (process.env.TEST_NETWORK_ID as string)
    : (process.env.MAINNET_ID as string);

export default function ConnectWallet() {
  const dispatch = useAppDispatch();
  const [newUser, setNewUser] = useState(false);
  const [authRequestPending, setAuthRequestPending] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  // represents if the connect wallet section is open
  const [isConnectActive, setIsConnectActive] = useState<boolean>(false);
  // represents if the invalid modal is open
  const [isInvalidCode, setIsInvalidCode] = useState(false);
  // represents if the invite code form is open
  const [hasInviteCode, setHasInviteCode] = useState(false);

  const wallets = [
    {
      image: metamask,
      name: "MetaMask",
      tag: "",
      disabled: false,
    },
    // {
    //   image: trustwallet,
    //   name: "trust wallet",
    // tag: "mobile wallet",
    //   disabled: true,
    // },
    {
      image: walletconnect,
      name: "wallet connect",
      tag: "",
      disabled: false,
    },
  ];

  const { isAuthenticated, authenticate, user } = useMoralis();
  const router = useRouter();

  function onSubmit(user: Moralis.User<Moralis.Attributes>) {
    /**
     * IF THE USER HAS NO NAME, USERNAME OR USERNAME LENGTH IS GREATER THAN 20 REDIRECT TO CONNECTWALLET PAGE
     */
    if (
      !user?.attributes.username ||
      !user?.attributes.name ||
      user?.attributes.username.length > 10
    ) {
      // console.log("here", user?.attributes);
      setNewUser(true);
    } else {
      router.replace("/");
      // router.back();
    }
  }

  const handleWalletAuth = async (wallet: string) => {
    if (authRequestPending) {
      dispatch(
        addNotification({
          type: "error",
          message: `Authentication already in progress, Please check your wallet`,
        })
      );
      return;
    }
    setAuthRequestPending(true);
    if (wallet === "MetaMask") {
      localStorage.setItem("provider", "metamask");
      await authenticate({
        signingMessage: code
          ? `vizva Authentication with invite code:${code}`
          : "vizva Authentication",
        onSuccess: (user) => {
          setAuthRequestPending(false);
          // onSubmit(user);
          localStorage.removeItem("logout-event");
        },
        onError: (error: Error) => {
          localStorage.removeItem("provider");
          setAuthRequestPending(false);
          console.error(error);
          var message = errorMsg[error.message] || "Something went wrong";
          if (
            error.message === "no_invite_code" ||
            error.message === "invite_code_mismatch"
          ) {
            updateIsInvalidCode(true);
          }
          dispatch(
            addNotification({
              type: "error",
              message,
            })
          );
        },
      });
    }
    if (wallet == "wallet connect") {
      localStorage.setItem("provider", "walletconnect");
      await authenticate({
        provider: "walletconnect",
        chainId: parseInt(networkID),
        signingMessage: code
          ? `vizva Authentication with invite code:${code}`
          : "vizva Authentication",
        onSuccess: () => {
          setAuthRequestPending(false);
          // onSubmit(user);
          localStorage.removeItem("logout-event");
        },
        onError: (error: Error) => {
          localStorage.removeItem("provider");
          setAuthRequestPending(false);
          var message = errorMsg[error.message] || "Something went wrong";
          if (
            error.message === "no_invite_code" ||
            error.message === "invite_code_mismatch"
          ) {
            updateIsInvalidCode(true);
          }
          dispatch(
            addNotification({
              type: "error",
              message,
            })
          );
        },
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated && !!user) {
      onSubmit(user);
    }
  }, [isAuthenticated, user]);

  function updateCode(e: React.ChangeEvent<HTMLInputElement>) {
    setCode(e.target.value);
  }

  function updateIsConnectActive(status: boolean) {
    setIsConnectActive(status);
  }

  function updateIsInvalidCode(status: boolean) {
    setIsInvalidCode(status);
  }

  return (
    <>
      <Head>
        <title>Connect your wallet</title>
      </Head>
      <GlassBackground>
        <MaxWidth>
          <StyledNav>
            <Logo />
          </StyledNav>
        </MaxWidth>
      </GlassBackground>
      <MaxWidth>
        {isAuthenticated && !newUser ? (
          <Loading
            isOpen={isAuthenticated && !newUser}
            title="authentication completed"
            message="you will be redirected shortly"
          />
        ) : (
          <StyledDiv>
            {/* connnect wallet */}
            {isConnectActive && !isInvalidCode && (
              <div>
                <h1>connect your wallet</h1>

                <StyledWalletContainer>
                  {wallets.map((wallet) => {
                    return (
                      <button
                        key={wallet.name}
                        onClick={() => handleWalletAuth(wallet.name)}
                        disabled={isAuthenticated || wallet.disabled}
                      >
                        <div>
                          <Image src={wallet.image} width={50} />
                        </div>
                        <p>{wallet.name}</p>
                        <span>{wallet.tag}</span>
                      </button>
                    );
                  })}
                </StyledWalletContainer>
                <p>
                  We do not own your private keys and cannot access your funds
                  without your confirmation.
                </p>

                <Link href="#">
                  <a>know more about wallets</a>
                </Link>

                <div className="buttons-container">
                  <Button
                    variant="outline"
                    text="Close"
                    href="/"
                    className="button--close"
                    block
                  />
                </div>
              </div>
            )}

            {/* invite code */}
            {!isConnectActive && !isInvalidCode && (
              <StyledInviteCode>
                {/* {hasInviteCode && (
                  <button className="button__arrow">
                    <LeftArrow />
                  </button>
                )} */}
                <h1>{hasInviteCode ? "Enter Invite Code" : "Invite Code"}</h1>
                <p>
                  Vizva is currently allowing only a handful of people. Enter
                  your invite code to get started.
                </p>
                {hasInviteCode ? (
                  <>
                    <div className="input">
                      <label htmlFor="invite-code">Invite Code</label>
                      <input
                        type="text"
                        name="code"
                        id="invite-code"
                        placeholder="Enter invite code"
                        value={code ?? ""}
                        onChange={updateCode}
                        maxLength={8}
                      />
                    </div>
                    <div className="buttons">
                      <Button
                        text="Log in"
                        disabled={!code || code.length != 8}
                        size="sm"
                        onClick={
                          !code || code.length < 8 || !validateInviteCode(code)
                            ? () => {}
                            : () => updateIsConnectActive(true)
                        }
                        block
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ maxWidth: "250px" }}>
                      <Button
                        text="Have Invite Code?"
                        onClick={() => setHasInviteCode(true)}
                        style={{ marginTop: "var(--padding-6)" }}
                        block
                        size="sm"
                      />
                      <Button
                        text="Join Waitlist"
                        variant="outline"
                        size="sm"
                        style={{ marginTop: "var(--padding-6)" }}
                        href="/join"
                        block
                      />
                    </div>
                    <p style={{ paddingTop: "var(--padding-9)" }}>
                      Have an account?
                    </p>
                    <Button
                      text="Login"
                      size="sm"
                      style={{
                        maxWidth: "250px",
                        marginTop: "var(--padding-3)",
                      }}
                      block
                      onClick={() => updateIsConnectActive(true)}
                    />
                  </>
                )}
              </StyledInviteCode>
            )}

            {/* invalid code */}
            {isInvalidCode && (
              <StyledInvalidCode>
                <h2>Oops, its wrong</h2>
                <p className="description">
                  This wallet address or invite code is not matching with our
                  database, please check and connect with the same wallet
                  address that you have used to get your invite code. If you
                  don't have an invite code, please join the waitlist to get
                  invited.
                </p>

                <div className="btn__wrapper">
                  <Button text="Get invite code" size="sm" href="/join" block />

                  <Button
                    text="I have a code"
                    size="sm"
                    onClick={() => {
                      updateIsConnectActive(false);
                      updateIsInvalidCode(false);
                    }}
                    block
                  />
                </div>

                <p className="footer">
                  Need help? Ask at{" "}
                  <a href="mailto:info@vizva.io">info@vizva.io</a>
                </p>
              </StyledInvalidCode>
            )}

            {/* if this is a new user */}
            {newUser && (
              <Prompt
                closeable={false}
                text="Edit Profile"
                href="profile/edit"
                title="Just one step away"
                message="Before you go exploring, edit your profile to enjoy a better reach."
                image="https://firebasestorage.googleapis.com/v0/b/vizva-boolien.appspot.com/o/sparkles_2728.png?alt=media&token=f02df457-4449-4696-b0ca-8cbd439529d4"
              />
            )}

            <div className="shapes">
              <div className="circle"></div>
            </div>
          </StyledDiv>
        )}
      </MaxWidth>
    </>
  );
}

const StyledInvalidCode = styled.div`
  background-color: ${(props) => props.theme.onBackground};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--padding-8) var(--padding-6) var(--padding-6);
  max-width: 450px;
  width: 90vw;
  border-radius: 30px;
  text-align: center;

  h2 {
    font-weight: 400;
    font-size: var(--fontsizes-7);
  }

  p {
    font-weight: 300;
    font-size: var(--fontsizes-2);
  }

  p.description {
    margin: 1em auto 2em auto !important;
  }

  p.footer {
    margin: 2em auto 0 auto !important;

    a {
      color: ${(props) => props.theme.green};
    }
  }

  .btn__wrapper {
    & > :last-child {
      margin-top: var(--padding-4);
    }
  }

  ${breakpoint("md")} {
    padding: var(--padding-7) var(--padding-8) var(--padding-6);
  }
`;

const StyledInviteCode = styled.div`
  background-color: ${(props) => props.theme.onBackground};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--padding-6);
  max-width: 450px;
  width: 90vw;
  border-radius: 30px;

  /* position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%); */
  .button__arrow {
    background: transparent;
    align-self: start;
    cursor: pointer;
    svg {
      width: 24px;
      height: 24px;
      max-width: 24px;
      max-height: 24px;
    }

    &:hover,
    &:focus {
      .stroke-icon {
        stroke: ${(props) => props.theme.green};
      }
    }
  }
  h1 {
    font-size: var(--fontsizes-7);
    padding: 0;
    margin: 0 !important;
  }
  p {
    max-width: 25ch !important;
    margin: 0.5em auto 0 auto !important;
    font-weight: 300;
    font-size: var(--fontsizes-2);
  }
  .input {
    display: flex;
    flex-direction: column;
    max-width: 20ch;
    margin: 1em auto 2em auto;
  }
  label {
    font-weight: 800;
    text-align: center;
  }
  input {
    margin-top: 0.5em;
    padding: var(--padding-4);
    text-align: center;
    background: transparent;
    border: 0;
    outline: 1px solid ${(props) => props.theme.gray3};
    border-radius: 2px;
    color: ${(props) => props.theme.primary};
  }
  .link {
    color: ${(props) => props.theme.green};
    margin: var(--padding-8) auto 0 auto;
    &:hover,
    &:focus {
      color: ${(props) => props.theme.primary};
    }
  }
  .buttons {
    display: flex;
    flex-direction: column;
  }

  .buttons--created {
    margin-top: 16px;
    background-color: ${(props) => props.theme.gray4};
    color: ${(props) => props.theme.primary} !important;
    outline: none;
    border: none;
    /* background: transparent; */
    cursor: pointer;

    &:hover,
    &:focus {
      background-color: ${(props) => props.theme.green};
      color: ${(props) => props.theme.background} !important;
    }
  }
`;

const StyledWalletContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 500px;
  margin: 0 auto;
  justify-content: center;
  align-items: center;

  & > :not(:first-of-type) {
    margin-top: 1rem;
  }
  button {
    width: 100%;
    border: none;
    outline: none;
    background-color: ${(props) => props.theme.background};
    display: flex;
    align-items: center;
    flex-direction: row;
    border-radius: 5px;
    border: 1px solid ${(props) => props.theme.gray3};
    padding: var(--padding-7) var(--padding-5);
    /* height: 5.5rem; */

    p {
      font-size: var(--fontsizes-5);
      margin-left: 20px;
      width: 100%;
      text-align: start;
      text-transform: capitalize;
      letter-spacing: 1px;
    }

    span {
      line-height: 1.3em;
      margin-left: 1rem;
      text-align: start;
      color: ${(props) => props.theme.gray2};
      text-transform: capitalize;
    }

    & > div {
      position: relative;
      width: 100px;
      img {
        height: auto;
      }
    }

    &:hover,
    &:focus {
      border-color: ${(props) => props.theme.green};
      cursor: pointer;
    }
  }
  ${breakpoint("3xl")} {
    button > p {
      font-size: var(--fontsizes-6);
    }
  }
`;

const StyledNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--padding-6) 0;
`;

const StyledDiv = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  min-height: calc(100vh - 100px);
  display: flex;
  align-items: center;
  justify-content: center;

  h1 {
    color: ${(props) => props.theme.primary};
    text-align: center;
    line-height: 1.2em;
    letter-spacing: 2px;
    padding: 0 0 3rem 0;
    text-transform: capitalize;
    margin-top: 1rem;
    font-size: var(--fontsizes-7);
  }

  & > div {
    top: 50%;
  }

  & > div > p {
    font-weight: light;
    text-align: center;
    max-width: 40ch;
    margin: 3rem auto 0 auto;
    color: ${(props) => props.theme.gray2};
    line-height: 1.3em;
  }

  & > div > a {
    display: block;
    color: ${(props) => props.theme.primary};
    width: fit-content;
    margin: var(--padding-4) auto var(--padding-8) auto;
    text-align: center;

    &:hover,
    &:focus {
      color: ${(props) => props.theme.green};
    }
  }

  .buttons-container {
    display: flex;
    margin: 0 auto;
    max-width: 300px;
    width: 100%;
    padding: 1rem 0;

    & > :not(:last-child) {
      margin-right: 1rem;
    }
  }

  .button--close {
    background-color: ${(props) => props.theme.background};
  }

  .shapes {
    position: fixed;
    top: 0;
    left: 0;
    height: calc(100vh);
    width: 100vw;
    background-color: transparent;
    z-index: -1;

    .circle,
    &::after {
      position: absolute;
      background: transparent;
      outline: 1px solid ${(props) => props.theme.gray2};
      opacity: 0.6;
    }
    /* image on the top left of the screen */
    .circle {
      display: none;
      min-height: 500px;
      height: 40%;
      width: 300px;
      border-radius: 150px;
      top: 150px;
      right: 75%;

      &::before {
        content: "";
        position: absolute;
        width: 100px;
        height: 100px;
        background: transparent;
        border-radius: 50%;
        right: 0px;
        outline: 1px solid ${(props) => props.theme.green};
      }
    }
    /* circle at the bottom of the screen */
    &::after {
      content: "";
      height: 300px;
      width: 300px;
      border-radius: 50%;
      bottom: -200px;
      right: 16px;
    }
  }

  ${breakpoint("md")} {
    .shapes {
      /* circle at the bottom of the screen */
      .circle {
        display: block;
        min-height: 400px;
        width: 250px;
      }
      &::after {
        content: "";
        width: 400px;
        height: 300px;
        bottom: -200px;
        right: 16px;
      }
    }
    h1 {
      font-size: var(--fontsizes-8);
    }
  }

  ${breakpoint("3xl")} {
    & > p,
    & > a {
      font-size: var(--fontsizes-3);
    }
    .shapes {
      /* circle at the bottom of the screen */
      .circle {
        height: 600px;
        width: 300px;
      }
      &::after {
        content: "";
        height: 400px;
        width: 500px;
        bottom: -250px;
        right: 16px;
      }
    }
  }
`;
