import styled from "@emotion/styled";
import Button from "components/button";
import InstagramIcon from "components/icons/instagram";
import VizvaTwitterIcon from "components/icons/twitter";
import { breakpoint } from "public/breakpoint";
import InfoBar from "./infoBar";
import { useMoralis } from "react-moralis";
import { PROFILE_DETAILS_PROPS } from "./profile.type";
import { Dialog, Menu } from "@headlessui/react";
import * as Fi from "react-icons/fi";
import {
  FacebookShareButton,
  TelegramShareButton,
  TwitterShareButton,
} from "react-share";
import React, { ChangeEvent, Fragment, useEffect, useState } from "react";
import SendIcon from "components/icons/send";
import DisabledIcon from "components/icons/disabled";
import FacebookIcon from "components/icons/facebook";
import TwitterIcon from "components/icons/twitter";
import TelegramIcon from "components/icons/telegram";
import CopyToClipboard from "react-copy-to-clipboard";
import LinkIcon from "components/icons/link";
import Link from "next/link";
import LeftArrow from "components/icons/left arrow";
import Input from "components/input";
import { useAppDispatch } from "redux/hook";
import { addNotification } from "redux/slice/notificationSlice";

export default function ProfileDetails(props: PROFILE_DETAILS_PROPS) {
  const {
    isFollowing,
    isMyProfile,
    profile,
    openSocialModal,
    updateActiveSocial,
    followUnfollowUser,
    loading,
  } = props;
  const reports = [
    "Violent or Graphic Content",
    "Hateful or Abusive Content",
    "Nudity or Sexual Content",
    "Other Suspicious Activity",
    "Counterfeit Artwork",
    "User Misrepresentation",
    "Intellectual Property",
  ];
  const [report, setReport] = useState<string>();
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isReportOpen, setIsReportOpen] = useState(false);
  const { user, isAuthenticated, Moralis, isInitialized } = useMoralis();
  const dispatch = useAppDispatch();

  function updateReport(report?: string) {
    setReport(report);
    console.log(report);
  }
  function toggleIsReportOpen() {
    if (isAuthenticated) {
      setIsReportOpen((s) => !s);
    } else {
      dispatch(
        addNotification({
          type: "error",
          message: "You must be logged in to report.",
        })
      );
    }
  }
  useEffect(() => {
    if (!isReportOpen) {
      setReport(undefined);
      setUrl("");
      setMessage("");
    }
  }, [isReportOpen]);

  async function reportHandler() {
    if (isAuthenticated && report && url && message) {
      const result = await Moralis.Cloud.run("reportThis", {
        type: "user",
        reported: profile.objectId,
        subject: report,
        url: url,
        details: message
      });
      toggleIsReportOpen();
      dispatch(
        addNotification({
          type: result.success == true ? "success" : "error",
          message: result.message,
        })
      );
    }
  }

  const profileLink =
    process.env.APP_ENV === "testnet"
      ? `https://www.testnet.vizva.io/${profile.username}`
      : `https://www.vizva.io/${profile.username}`;
  return (
    <StyledDiv>
      <div className="meta-information">
        <InfoBar
          className="hide-lg"
          myProfile={isMyProfile}
          address={profile.ethAddress}
          profile={profile}
        />
        <div className="profile__name">
          <h1 className="name">{profile.name ?? "Vizva User"}</h1>

          {/* share dropdown */}
          <Menu>
            <div className="menu">
              <Menu.Button as={React.Fragment}>
                <button className="menu__button icon-bg" title="share">
                  <SendIcon />
                </button>
              </Menu.Button>
              <Menu.Items as={React.Fragment}>
                <ul className="menu__list">
                  <Menu.Item>
                    {({ active }: { active: boolean }) => (
                      <li className="menu__item">
                        <TwitterShareButton
                          className={active ? "active" : undefined}
                          url={profileLink}
                          title={profile.name}
                          via={profile.twitter}
                          hashtags={[profile.username]}
                        >
                          <div className="menu__svg--wrapper">
                            <TwitterIcon />
                          </div>
                          <p>Twitter</p>
                        </TwitterShareButton>
                      </li>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }: { active: boolean }) => (
                      <li className="menu__item">
                        <FacebookShareButton
                          className={active ? "active" : undefined}
                          url={profileLink}
                          quote={profile.bio}
                          hashtag={`#${profile.username}`}
                        >
                          <div className="menu__svg--wrapper">
                            <FacebookIcon />
                          </div>
                          <p>Facebook</p>
                        </FacebookShareButton>
                      </li>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }: { active: boolean }) => (
                      <li className="menu__item">
                        <TelegramShareButton
                          className={active ? "active" : undefined}
                          url={profileLink}
                        >
                          <div className="menu__svg--wrapper">
                            <TelegramIcon />
                          </div>
                          <p>Telegram</p>
                        </TelegramShareButton>
                      </li>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }: { active: boolean }) => (
                      <li className="menu__item">
                        <CopyToClipboard text={profileLink}>
                          <button className={active ? "active" : undefined}>
                            <div className="menu__svg--wrapper">
                              <LinkIcon />
                            </div>
                            <p>Copy Link</p>
                          </button>
                        </CopyToClipboard>
                      </li>
                    )}
                  </Menu.Item>
                </ul>
              </Menu.Items>
            </div>
          </Menu>

          {/* more dropdown */}
          {!isMyProfile && (
            <Menu>
              <div className="menu">
                <Menu.Button as={React.Fragment}>
                  <button className="menu__button icon-bg" title="more">
                    <Fi.FiMoreHorizontal size="16" />
                  </button>
                </Menu.Button>
                <Menu.Items as={React.Fragment}>
                  <ul className="menu__list">
                    <Menu.Item>
                      {({ active }: { active: boolean }) => (
                        <li className="menu__item">
                          <button
                            className={active ? "active" : undefined}
                            onClick={toggleIsReportOpen}
                          >
                            <DisabledIcon />
                            <p>Report</p>
                          </button>
                        </li>
                      )}
                    </Menu.Item>
                  </ul>
                </Menu.Items>
              </div>
            </Menu>
          )}
        </div>

        <p className="username">@{profile.username ?? "vizvauser"}</p>
        <p className="description">{profile.bio ?? ""}</p>

        {/* following and followers on laptop */}
        <StyledStats className="hide-lg">
          <button
            className="following"
            onClick={() => {
              updateActiveSocial("following");
              openSocialModal();
            }}
          >
            {profile.following ?? 0}
            <span> Following</span>
          </button>
          <button
            className="followers"
            onClick={() => {
              updateActiveSocial("followers");
              openSocialModal();
            }}
          >
            {profile.followers ?? 0}
            <span> Followers</span>
          </button>
        </StyledStats>

        <Dialog open={isReportOpen} onClose={toggleIsReportOpen} as={Fragment}>
          <StyledModal>
            <Dialog.Overlay className="dialog__overlay" />
            <div className="dialog__content scrollbar">
              {!!report && (
                <button
                  onClick={() => updateReport()}
                  className="dialog__icon__button"
                >
                  <LeftArrow />
                </button>
              )}
              <h3 className="dialog__heading">
                {!report ? "Why are you reporting?" : report}
              </h3>
              <p className="dialog__description">
                {!report
                  ? "Please state your reason for reporting. Your report would be anonymous, except if you’re reporting an intellectual property infringement"
                  : "Please help us understand more about the problem by providing some more information that you are trying to report."}
              </p>
              {!report ? (
                <>
                  {" "}
                  {reports.map((r) => (
                    <button
                      key={r}
                      className="report__button"
                      onClick={() => updateReport(r)}
                    >
                      <div
                        className={`report__indicator ${
                          report === r ? "report__indicator--selected" : ""
                        }`}
                      ></div>
                      <p>{r}</p>
                    </button>
                  ))}
                </>
              ) : (
                <>
                  <div className="dialog__input">
                    <Input
                      label="URL to report"
                      placeholder="https://"
                      type="text"
                      value={url}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setUrl(e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="dialog__input">
                    <Input
                      label="Your Message"
                      placeholder="Tell us some more details why you are reporting."
                      type="textarea"
                      value={message}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        setMessage(e.target.value)
                      }
                    />
                  </div>
                </>
              )}

              <div className="dialog__buttons">
                <Button
                  text="Cancel"
                  size="sm"
                  variant="outline"
                  onClick={toggleIsReportOpen}
                />
                <Button
                  text="Report"
                  size="sm"
                  disabled={!report && !url}
                  onClick={reportHandler}
                />
              </div>
            </div>
          </StyledModal>
        </Dialog>

        {profile.twitter && (
          <Link href={"https://twitter.com/" + profile.twitter}>
            <a className="social-handle" target="_blank">
              <VizvaTwitterIcon />
              <span>@{profile.twitter}</span>
            </a>
          </Link>
        )}
        {profile.instagram && (
          <Link href={"https://instagram.com/" + profile.instagram}>
            <a className="social-handle" target="_blank">
              <InstagramIcon />
              <span>@{profile.instagram}</span>
            </a>
          </Link>
        )}
      </div>

      {/* following and followers on mobile */}
      <StyledStats className="hide-sm hide-md show-lg">
        <button
          className="following"
          onClick={() => {
            updateActiveSocial("following");
            openSocialModal();
          }}
        >
          {profile.following ?? 0}
          <span> Following</span>
        </button>
        <button
          className="followers"
          onClick={() => {
            updateActiveSocial("followers");
            openSocialModal();
          }}
        >
          {profile.followers ?? 0} Followers
        </button>
      </StyledStats>

      {/* edit or follow button on mobile */}
      {isMyProfile ? (
        <Button
          text="Edit"
          href="/profile/edit"
          className="action-button hide-lg"
        />
      ) : (
        <Button
          loading={loading}
          text={isFollowing ? "Following" : "Follow"}
          onClick={() => followUnfollowUser(profile.objectId)}
          className="action-button hide-lg"
        />
      )}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 100px;
  align-items: center;
  text-align: center;
  width: auto;
  .name {
    word-break: break-all; //TODO remove after name is retrieved from db
    text-transform: capitalize;
    font-size: var(--fontsizes-6);
    font-weight: 500;
  }
  .profile__name {
    width: max-content;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0 auto var(--padding-4) auto;
  }
  .icon-bg {
    background-color: transparent;
    border: none;
    outline: 1px solid ${(props) => props.theme.gray3};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 1rem;
    padding: 5px;
    height: 30px;
    width: 30px;
    cursor: pointer;

    svg {
      color: ${(props) => props.theme.primary} !important;
      &.stroke-icon {
        stroke: ${(props) => props.theme.primary} !important;
      }
    }

    &:hover,
    &:focus {
      svg {
        color: ${(props) =>
          props.theme.mode === "light"
            ? "black"
            : props.theme.gray2} !important;
      }
    }
  }
  .menu {
    position: relative;
    white-space: nowrap;
    outline: none;
    border: none;
  }
  .menu__list {
    background: ${(props) => props.theme.onBackground};
    border-radius: 12px;
    list-style: none;
    position: absolute;
    top: 130%;
    transform: translateX(-25%);
    z-index: 1;
    overflow: hidden;
    outline: none;
    border: none;
  }
  .menu__item {
    button {
      width: 100%;
      background: transparent;
      border: 0;
      outline: 0;
      display: grid;
      grid-template-columns: max-content 1fr;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      padding: var(--padding-2) var(--padding-4) !important;

      svg.stroke-icon {
        stroke: ${(props) => props.theme.primary};
      }
      svg.fill-icon {
        fill: ${(props) => props.theme.primary};
      }

      &:hover,
      &:focus,
      &.active {
        background: ${(props) =>
          props.theme.mode === "dark"
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.04)"} !important;
      }
    }
    p {
      letter-spacing: 0.5px;
      font-weight: 300;
      font-size: var(--fontsizes-1);
      text-align: start;
    }
    .menu__svg--wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px !important;
      height: 28px !important;
      border-radius: 100%;
      border: 1px solid ${(props) => props.theme.gray3};

      svg {
        width: 14px;
        height: 14px;
      }
    }
  }

  p.username {
    background-image: ${(props) => props.theme.gradient};
    background-clip: text;
    color: transparent;
  }
  p.description {
    /* color: ${(props) => props.theme.gray3}; */
    padding-top: var(--padding-6);
    line-height: 1.5em;
    max-width: 50ch;
  }
  .social-handle {
    margin-top: var(--padding-6);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    &:not(:last-of-type) {
      margin-right: 1rem;
    }
    svg {
      /* width: 32px !important;
      height: 32px !important;
      max-width: 32px;
      max-height: 32px; */
    }
    span {
      /* font-size: var(--fontsizes-3) !important; */
      margin-left: var(--padding-1);
      font-weight: 200;
      letter-spacing: 0.5px;
    }

    &:hover > span,
    &:hover > .fill-icon {
      fill: ${(props) => props.theme.green} !important;
      color: ${(props) => props.theme.green} !important;
    }
  }

  .action-button {
    margin-top: 2rem;
    background-color: ${(props) => props.theme.onBackground} !important;
    color: ${(props) => props.theme.primary} !important;
    font-weight: 300;
    letter-spacing: 1px;
  }

  .hide-sm {
    display: none;
  }
  ${breakpoint("md")} {
    .hide-sm {
      display: flex;
    }
    .hide-md {
      display: none;
    }
  }
  ${breakpoint("lg")} {
    justify-items: start;
    text-align: start;
    flex-direction: row;
    flex-grow: 100%;
    justify-self: end;
    justify-content: space-between;
    margin: 2rem var(--padding-10) 0 calc(10% + 7rem);
    .profile__name {
      margin: 0 0 var(--padding-4) 0;
    }
    .name {
      font-size: var(--fontsizes-7);
    }
    p.username {
      max-width: 50ch;
    }
    .hide-lg {
      display: none;
    }
    .show-lg {
      display: flex;
    }
  }
  ${breakpoint("3xl")} {
    .name {
      font-size: var(--fontsizes-8);
    }
    p.description {
      padding-top: var(--padding-6);
      /* line-height: 1.3em; */
    }
  }
`;

const StyledStats = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-self: start;
  margin: 1.5rem auto;

  button {
    outline: none;
    border: none;
    background: transparent;
    word-break: keep-all;
    cursor: pointer;
    color: ${(props) => props.theme.primary};

    /* span {
      color: ${(props) => props.theme.gray2};
      margin-left: 10px;
    } */

    &:hover,
    &:focus {
      /* color: ${(props) => props.theme.green}; */
    }
  }
  & > :not(:first-of-type) {
    margin-left: 3rem;
  }

  ${breakpoint("lg")} {
    /* width: 70%; */
    margin: 0;
    margin-left: var(--padding-8);
    /* width: max-content; */
  }
`;

const StyledModal = styled.div`
  position: fixed;
  inset: 0;
  z-index: 11;
  isolation: isolate;
  display: grid;
  place-items: center;

  .dialog__overlay {
    /* background-color: ${(props) => props.theme.gray4}; */
    background-color: rgba(0, 0, 0, 0.2);
    /* opacity: 0.5; */
    backdrop-filter: blur(13px);
    inset: 0;
    position: absolute;
    z-index: -1;
  }
  .dialog__content {
    width: 90vw;
    max-width: 576px;
    background-color: ${(props) => props.theme.background};
    border-radius: 20px;
    max-height: calc(100vh - 40px);
    overflow: auto;
    padding: 40px;
    box-sizing: border-box;
    color: ${(props) => props.theme.primary};
  }
  .dialog__input {
    margin-top: var(--padding-5);

    &:first-of-type {
      margin-top: var(--padding-7);
    }
  }
  .dialog__icon__button {
    background: transparent;
    border: none;
    outline: none;
    color: inherit;
    cursor: pointer;
    svg {
      width: 30px;
      height: 30px;
      max-width: 30px;
      max-height: 30px;
    }
    .stroke-icon {
      stroke: ${(props) => props.theme.green};
    }

    &:hover {
      svg {
        transform: scale(0.9);
      }
    }
  }
  .dialog__heading {
    font-size: var(--fontsizes-6);
    margin-bottom: var(--padding-4);
  }
  .dialog__description {
    color: ${(props) => props.theme.gray3};
    margin-bottom: var(--padding-4);
  }
  .dialog__buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 40px;

    & > :last-of-type {
      margin-left: var(--padding-9);
    }
  }
  .report__button {
    display: flex;
    align-items: center;
    padding: var(--padding-5);
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    color: inherit;
    cursor: pointer;

    &:not(:first-of-type) {
      border-top: 1px solid ${(props) => props.theme.gray4};
    }

    &:hover > .report__indicator::after {
      opacity: 1;
    }
  }
  .report__indicator {
    width: 20px;
    height: 20px;
    border-radius: 100%;
    background: transparent;
    border: 1px solid ${(props) => props.theme.primary};
    margin-right: var(--padding-5);
    cursor: pointer;
    position: relative;
    transition: opacity 150ms ease-in-out;

    &::after {
      content: "";
      position: absolute;
      width: 70%;
      height: 70%;
      border-radius: 100%;
      background: ${(props) => props.theme.gray4};
      opacity: 0;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .report__indicator--selected {
    border: 1px solid ${(props) => props.theme.green};

    ::after {
      opacity: 1;
      background: ${(props) => props.theme.green};
    }
  }
`;
