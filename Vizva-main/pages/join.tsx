import styled from "@emotion/styled";
import Button from "components/button";
import Input from "components/input";
import MaxWidth from "components/layout/maxWidth";
import Logo from "components/navigation/logo";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { createRef, useCallback, useContext, useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { errorMsg } from "public/error";
import Swal from "sweetalert2";
import { ethers } from "ethers";
import { validateAddress, validateEmail } from "services/helpers";
import { ThemeContext } from "context/themeContext";
import ReCAPTCHA from "react-google-recaptcha";
import { string } from "zod";

export default function Join() {
  const [email, setEmail] = useState("");
  const [wallet, setWallet] = useState("");
  const [success, setSuccess] = useState(false);
  const { isAuthenticated, user, Moralis } = useMoralis();
  const router = useRouter();
  const { mode, theme } = useContext(ThemeContext);
  const recaptchaRef = createRef<ReCAPTCHA>();
  const [captcha, setCaptcha] = useState<string | undefined>();

  // Create an event handler so you can call the verification on button click event or form submit
  const handleReCaptchaVerify = useCallback(async (action?: string) => {
    // if (!executeRecaptcha) {
    //   console.log("Execute recaptcha not yet available");
    //   return;
    // }
    // const token = await executeRecaptcha(action);
    // return token;
    // Do whatever you want with the token
  }, []);

  function updateEmail(email: string) {
    setEmail(email);
  }

  function updateWallet(wallet: string) {
    setWallet(wallet);
  }

  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace("/");
    }
  }, [user, isAuthenticated]);

  const join = useCallback(async () => {
    try {
      if (!validateEmail(email)) {
        throw new Error("invalid email address");
      }
      const validateWallet = ethers.utils.isAddress(wallet);
      if (!validateWallet) {
        throw new Error("invalid wallet address");
      }

      if (!recaptchaRef.current) throw new Error("recaptcha not available");

      if (!captcha) {
        throw new Error("recaptcha not verified");
      }

      const result = await Moralis.Cloud.run("joinWaitlist", {
        email,
        walletAddress: wallet,
        token: captcha,
      });

      // api response result will be a boolean
      if (result) {
        setSuccess(true);
      }
    } catch (error: any) {
      const message =
        errorMsg[error.message] ||
        "something went wrong, try it after sometime.";
      Swal.fire("Oops!", message, "error");
    }
  }, [recaptchaRef.current, captcha, email, wallet]);

  function onChange(e: any) {
    if (typeof e === "string") setCaptcha(e);
  }

  return (
    <>
      <Head>
        <title>Join</title>
        <meta name="description" content="Join our whitelist" />
      </Head>
      <MaxWidth>
        <StyledNav>
          <Logo />
        </StyledNav>
      </MaxWidth>

      <StyledContainer>
        <MaxWidth>
          {mode === "light" && (
            <div className="bg">
              <Image src="/images/gradient-bg.png" layout="fill" alt="join" />
            </div>
          )}
        </MaxWidth>

        <div className="wrapper">
          <svg
            className="heading"
            width="977"
            height="161"
            viewBox="0 0 977 161"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="3"
              y="3"
              width="971"
              height="155"
              rx="75"
              stroke="#7950DC"
              strokeWidth="5"
            />
            <path
              d="M99.1477 105.7C112.658 106.54 114.128 97.16 114.128 82.95V59.15C114.128 56.49 112.588 54.81 109.858 54.95L95.4377 55.65V60.55L108.318 59.85V82.32C108.318 96.18 107.338 101.29 99.1477 100.8L87.7377 100.1V105L99.1477 105.7ZM122.087 87.57C122.087 97.79 129.367 105.7 140.497 105.7C151.557 105.7 158.837 97.79 158.837 87.57C158.837 77.49 151.557 69.51 140.497 69.51C129.367 69.51 122.087 77.49 122.087 87.57ZM127.827 87.57C127.827 80.36 132.237 74.48 140.497 74.48C148.617 74.48 153.027 80.36 153.027 87.57C153.027 94.85 148.617 100.8 140.497 100.8C132.237 100.8 127.827 94.85 127.827 87.57ZM165.358 87.57C165.358 97.79 172.638 105.7 183.768 105.7C194.828 105.7 202.108 97.79 202.108 87.57C202.108 77.49 194.828 69.51 183.768 69.51C172.638 69.51 165.358 77.49 165.358 87.57ZM171.098 87.57C171.098 80.36 175.508 74.48 183.768 74.48C191.888 74.48 196.298 80.36 196.298 87.57C196.298 94.85 191.888 100.8 183.768 100.8C175.508 100.8 171.098 94.85 171.098 87.57ZM208.63 87.57C208.63 97.79 215.91 105.7 227.04 105.7C238.1 105.7 245.38 97.79 245.38 87.57C245.38 77.49 238.1 69.51 227.04 69.51C215.91 69.51 208.63 77.49 208.63 87.57ZM214.37 87.57C214.37 80.36 218.78 74.48 227.04 74.48C235.16 74.48 239.57 80.36 239.57 87.57C239.57 94.85 235.16 100.8 227.04 100.8C218.78 100.8 214.37 94.85 214.37 87.57ZM251.901 87.57C251.901 97.79 259.181 105.7 270.311 105.7C281.371 105.7 288.651 97.79 288.651 87.57C288.651 77.49 281.371 69.51 270.311 69.51C259.181 69.51 251.901 77.49 251.901 87.57ZM257.641 87.57C257.641 80.36 262.051 74.48 270.311 74.48C278.431 74.48 282.841 80.36 282.841 87.57C282.841 94.85 278.431 100.8 270.311 100.8C262.051 100.8 257.641 94.85 257.641 87.57ZM295.173 87.57C295.173 97.79 302.453 105.7 313.583 105.7C324.643 105.7 331.923 97.79 331.923 87.57C331.923 77.49 324.643 69.51 313.583 69.51C302.453 69.51 295.173 77.49 295.173 87.57ZM300.913 87.57C300.913 80.36 305.323 74.48 313.583 74.48C321.703 74.48 326.113 80.36 326.113 87.57C326.113 94.85 321.703 100.8 313.583 100.8C305.323 100.8 300.913 94.85 300.913 87.57ZM338.444 87.57C338.444 97.79 345.724 105.7 356.854 105.7C367.914 105.7 375.194 97.79 375.194 87.57C375.194 77.49 367.914 69.51 356.854 69.51C345.724 69.51 338.444 77.49 338.444 87.57ZM344.184 87.57C344.184 80.36 348.594 74.48 356.854 74.48C364.974 74.48 369.384 80.36 369.384 87.57C369.384 94.85 364.974 100.8 356.854 100.8C348.594 100.8 344.184 94.85 344.184 87.57ZM391.422 64.68C394.292 64.68 396.532 62.58 396.532 59.78C396.532 57.12 394.292 54.95 391.422 54.95C388.552 54.95 386.382 57.12 386.382 59.78C386.382 62.58 388.552 64.68 391.422 64.68ZM404.792 105V100.1H395.062V73.71C395.062 71.05 393.732 69.23 390.442 69.51L382.392 70.21V75.18L389.602 74.48V100.1H379.802V105H404.792ZM430.37 74.48C436.32 74.48 439.19 77.28 439.19 84.49V105H444.93V83.72C444.93 74.13 439.82 69.51 431.91 69.51C424.35 69.51 419.94 73.92 418.54 80.22H416.93L417.84 76.23V70.21H412.1V105H417.84V89.6C417.84 80.22 423.02 74.48 430.37 74.48ZM487.597 75.18H498.447V70.21H487.597V59.5L481.787 61.25V70.21H474.157V75.18H481.787V100.94C481.787 104.16 483.327 105.91 486.617 105.7L499.847 105V100.1L487.597 100.8V75.18ZM527.613 69.51C520.053 69.51 515.643 73.92 514.243 80.22H512.633L513.543 76.23V53.55H507.803V105H513.543V89.6C513.543 80.22 518.723 74.48 526.073 74.48C532.023 74.48 534.893 77.28 534.893 84.49V105H540.633V83.72C540.633 74.13 535.523 69.51 527.613 69.51ZM548.444 87.15C548.444 97.16 553.694 105.7 566.154 105.7C577.214 105.7 581.484 98.21 582.744 92.82H577.004C575.744 98.07 571.894 100.87 566.154 100.87C557.544 100.87 554.464 95.27 554.114 88.69H581.554V86.45C581.554 75.74 575.114 69.51 565.314 69.51C555.444 69.51 548.444 75.95 548.444 87.15ZM554.114 84.35C554.114 78.82 558.454 74.34 565.314 74.34C572.244 74.34 575.884 78.82 575.884 84.35H554.114ZM620.037 105H631.797L638.867 71.89H640.547L647.617 105H659.377L668.197 70.21H662.737L654.337 103.39H652.657L645.657 70.21H633.757L626.757 103.39H625.077L616.747 70.21H611.217L620.037 105ZM672.653 95.34C672.653 98.98 674.123 105.7 684.273 105.7C692.673 105.7 696.383 100.73 697.713 95.41H699.393L698.483 99.05V100.94C698.483 103.53 700.023 105 702.613 105H708.773V100.1H703.663V85.26C703.663 75.95 697.853 69.51 688.123 69.51C678.253 69.51 672.793 75.95 672.793 83.16H678.393C678.393 76.65 683.083 74.34 688.123 74.34C694.143 74.34 697.573 77.49 697.923 83.86L684.063 85.19C675.943 86.03 672.653 89.81 672.653 95.34ZM678.393 94.64C678.393 91.21 680.633 89.88 685.043 89.46L697.923 88.13C697.923 95.34 692.883 100.8 684.973 100.8C680.983 100.8 678.393 98.63 678.393 94.64ZM725.768 64.68C728.638 64.68 730.878 62.58 730.878 59.78C730.878 57.12 728.638 54.95 725.768 54.95C722.898 54.95 720.727 57.12 720.727 59.78C720.727 62.58 722.898 64.68 725.768 64.68ZM739.138 105V100.1H729.408V73.71C729.408 71.05 728.078 69.23 724.788 69.51L716.738 70.21V75.18L723.948 74.48V100.1H714.148V105H739.138ZM752.9 75.18H763.75V70.21H752.9V59.5L747.09 61.25V70.21H739.46V75.18H747.09V100.94C747.09 104.16 748.63 105.91 751.92 105.7L765.15 105V100.1L752.9 100.8V75.18ZM796.413 105V100.1H786.683V57.68C786.683 54.39 785.143 52.57 781.853 52.92L773.733 53.55V58.45L780.873 57.82V100.1H771.143V105H796.413ZM813.883 64.68C816.753 64.68 818.993 62.58 818.993 59.78C818.993 57.12 816.753 54.95 813.883 54.95C811.013 54.95 808.843 57.12 808.843 59.78C808.843 62.58 811.013 64.68 813.883 64.68ZM827.253 105V100.1H817.523V73.71C817.523 71.05 816.193 69.23 812.903 69.51L804.853 70.21V75.18L812.063 74.48V100.1H802.263V105H827.253ZM861.046 95.97C861.046 88.48 853.696 86.94 846.836 84.7C841.236 82.88 838.786 81.83 838.786 78.54C838.786 75.39 841.866 74.2 845.716 74.2C851.246 74.2 854.116 76.51 854.116 81.2H859.856C859.856 75.46 856.566 69.51 845.716 69.51C837.736 69.51 833.046 73.15 833.046 78.68C833.046 84.98 838.366 87.01 844.946 89.11C850.616 90.86 855.306 91.63 855.306 96.18C855.306 99.75 852.786 101.01 847.396 101.01C840.676 101.01 837.176 98.21 837.176 92.19H831.436C831.436 100.45 836.056 105.7 847.326 105.7C857.756 105.7 861.046 101.22 861.046 95.97ZM878.339 75.18H889.189V70.21H878.339V59.5L872.529 61.25V70.21H864.899V75.18H872.529V100.94C872.529 104.16 874.069 105.91 877.359 105.7L890.589 105V100.1L878.339 100.8V75.18Z"
              fill={theme.primary}
            />
          </svg>
          <p className="subheading">
            Vizva is invitation-only, signup with your email to save your
            position in line and get invite code soon to start you journey on
            vizva
          </p>
          {!success ? (
            <>
              <form>
                <Input
                  type="email"
                  placeholder="bruce@wayne.com"
                  label="email address"
                  className="input"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateEmail(e.target.value)
                  }
                  error={!!email && !validateEmail(email)}
                  errorText={
                    !validateEmail(email)
                      ? "Invalid email address"
                      : "This email is already on our waitlist"
                  }
                />
                <Input
                  type="text"
                  placeholder="your wallet address"
                  label="wallet address"
                  className="input"
                  value={wallet}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateWallet(e.target.value)
                  }
                  error={!!wallet && !validateAddress(wallet)}
                  errorText={
                    !validateAddress(wallet)
                      ? "Invalid address"
                      : "This address is already linked with different email"
                  }
                  moreInfo={<MoreWalletInfo />}
                />
              </form>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.RECAPTCHA as string}
                onChange={onChange}
                theme={mode === "light" ? "light" : "dark"}
              />
              <Button
                className="submit__button"
                type="button"
                text="Join"
                onClick={join}
                disabled={
                  !captcha || !validateEmail(email) || !validateAddress(wallet)
                }
              />
            </>
          ) : (
            <div className="wrapper--success">
              <Image
                alt="spark"
                src="https://firebasestorage.googleapis.com/v0/b/vizva-boolien.appspot.com/o/sparkles_2728.png?alt=media&token=f02df457-4449-4696-b0ca-8cbd439529d4"
                width={100}
                height={100}
              />
              <p className="success-text">
                Thank you for joining, keep a track on your email for the invite
                code
              </p>
            </div>
          )}
        </div>
      </StyledContainer>
    </>
  );
}

function MoreWalletInfo() {
  return (
    <StyledMoreWalletInfo>
      <p>
        Hey there, having issues in understanding what a wallet is? We got you!
      </p>
      <br />
      <p>
        Check out this cool{" "}
        <a href="https://www.youtube.com/watch?v=VueTqocR-Vo" target="_blank">
          video tutorial
        </a>{" "}
        on how to create a wallet
      </p>
      <br />
      <p>Or</p>
      <br />
      <p>
        Create your{" "}
        <a href="https://metamask.io/" target="_blank">
          wallet
        </a>{" "}
        here!
      </p>
    </StyledMoreWalletInfo>
  );
}

const StyledMoreWalletInfo = styled.div`
  text-align: center;
  max-width: 30ch;
  font-size: var(--fontsizes-1);

  p,
  a {
    font-size: inherit;
  }
  a {
    color: ${(props) => props.theme.green};
    font-weight: 700;
  }
`;

const StyledNav = styled.nav`
  height: 100px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
`;

const StyledContainer = styled.div`
  position: relative;
  padding: 0 0 var(--padding-8) 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .bg {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -10;
    pointer-events: none;
    user-select: none;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .heading {
    max-width: 600px;
    width: 90vw;
  }

  .subheading {
    max-width: 40ch;
    width: 80vw;
    text-align: center;
    margin: 0 auto;
    line-height: 1.5em;
  }

  form {
    background-color: ${(props) => props.theme.onBackground};
    padding: var(--padding-8);
    border-radius: var(--padding-5);
    margin: var(--padding-8) 0;
    width: 100%;

    .input {
      max-width: 500px;
    }

    & > :not(:first-child) {
      margin-top: var(--padding-8);
    }
  }

  .submit__button {
    margin-top: var(--padding-8);
  }
  .wrapper--success {
    margin: var(--padding-9) 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .success-text {
    text-align: center;
    max-width: 19ch;
    font-weight: 600;

    font-size: var(--fontsizes-4);
    background-image: ${(props) => props.theme.gradient};
    background-clip: text;
    color: transparent;
  }
`;
