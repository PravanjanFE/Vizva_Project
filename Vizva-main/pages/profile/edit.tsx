import styled from "@emotion/styled";
import Navbar from "components/navigation/navbar";
import React, { useState, useEffect, ChangeEvent } from "react";
import {
  useMoralis,
  useMoralisFile,
  useMoralisCloudFunction,
} from "react-moralis";
import { useRouter } from "next/router";
import Image from "next/image";
import tick from "public/tick.png";
import Button from "components/button";
import Input from "components/input";
import FileInput from "components/form elements/file";
import { breakpoint } from "public/breakpoint";
import { isUrl } from "services/helpers";
import { useAppDispatch } from "redux/hook";
import { addNotification } from "redux/slice/notificationSlice";
import Prompt from "components/prompt";
import Head from "next/head";
export default function EditProfile() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isUserUpdated, setIsUserUpdated] = useState(false);
  const [activeTap, setActiveTab] = useState<"Personnal" | "Account">(
    "Personnal"
  );
  const { isAuthenticated, isUserUpdating, user } = useMoralis();
  const { error, isUploading, moralisFile, saveFile } = useMoralisFile();
  const [saving, setSaving] = useState(false);
  const [stateUser, setStateUser] = useState({
    dp: "",
    coverImage: "",
    name: "",
    bio: "",
    username: "",
    email: "",
    twitter: "",
    instagram: "",
  });
  const [dpPreview, setDpPreview] = useState("");
  const [coverImagePreview, setCoverImagePreview] = useState("");
  const [dpFileType, setDpFileType] = useState("");
  const [coverFileType, setCoverFileType] = useState("");
  const [initialized, setInitialized] = useState(false);
  const { data, isFetching } = useMoralisCloudFunction(
    "isUsernameTaken",
    { username: stateUser.username }
    // { autoFetch: false }
  );

  // other social media links
  const [otherSocialMediaLinks, setOtherSocialMediaLinks] = useState<
    { link: string }[]
  >([]);

  function addNewSocialMediaLink(link: string, index: number) {
    setOtherSocialMediaLinks((links) => {
      let newLinks = [...links];
      newLinks[index].link = link;
      return newLinks;
    });
  }

  // initialize the stateUser state and updatedUsername
  useEffect(() => {
    try {
      if (user) {
        setStateUser({
          dp: user.attributes.profilePic?._url
            ? user.attributes.profilePic._url
            : null,
          coverImage: user.attributes.coverPic?._url
            ? user.attributes.coverPic._url
            : null,
          name: user.attributes.name ? user.attributes.name : "",
          bio: user.attributes.bio ? user.attributes.bio : "",
          username: user.attributes.username ? user.attributes.username : "",
          email: user.attributes.email ? user.attributes.email : "",
          twitter: user.attributes.twitter ? user.attributes.twitter : "",
          instagram: user.attributes.instagram ? user.attributes.instagram : "",
          // instagramLink: user?.attributes.instagramLink ? user?.attributes.instagramLink : "",
        });
        setDpPreview(user.attributes.profilePic?._url);
        setCoverImagePreview(user.attributes.coverPic?._url);
        setOtherSocialMediaLinks(user.attributes.socialMediaLinks ?? []);
        setInitialized(true);
      }
    } catch (error: any) {
      dispatch(addNotification({ type: "error", message: error.message }));
      // console.log("Error: " + error.message);
    }
  }, [user]);

  // when the d state changes, i.e an image has been uploaded, update the stateUser dp value to the arrayBuffer
  function updateDp(d?: File) {
    if (!d) {
      update(null, "dp");
      return;
    }
    update(d, "dp");
    const preview = new FileReader();
    preview.readAsDataURL(d);
    preview.onloadend = function () {
      setDpPreview(preview.result as string);
    };
  }

  // when the c state changes, i.e an image has been uploaded, update the stateUser coverImage value to the arrayBuffer
  function updateCoverImage(c?: File) {
    if (!c) {
      update(null, "coverImage");
      return;
    }
    update(c, "coverImage");
    const preview = new FileReader();
    preview.readAsDataURL(c);
    preview.onloadend = function () {
      setCoverImagePreview(preview.result as string);
    };
  }

  // if the user was sucessfully updated, send an updated notification
  useEffect(() => {
    if (isUserUpdated) {
      dispatch(
        addNotification({
          type: "success",
          message: "Profile Updated!",
        })
      );
      setIsUserUpdated(false);
    }
  }, [isUserUpdated]);

  function toggleActiveTab(tab: "Personnal" | "Account") {
    setActiveTab(tab);
  }

  // helper function to delete a profile picture from state
  function removeDp() {
    update("", "dp");
    setDpPreview("");
    setDpFileType("");
  }

  // helper function to delete a cover picture from state
  function removeCoverImage() {
    update("", "coverImage");
    setCoverImagePreview("");
    setCoverFileType("");
  }

  // helper function to update the stateUser state
  // value is the new state to be set
  // toSet is the key of the value you are to set
  function update(value: any, toSet: string) {
    setStateUser({ ...stateUser, [toSet]: value });
  }

  const disabled =
    !stateUser.username ||
    !stateUser.name ||
    stateUser.username.length > 10 ||
    // !stateUser.email ||
    // !stateUser.dp ||
    !!data ||
    isFetching;
  // !stateUser.coverImage

  const cancelDisabled =
    !stateUser.name ||
    !stateUser.username ||
    !!data ||
    isFetching ||
    stateUser.name.length > 10;

  // function that saves the profile
  const updateProfile = async () => {
    setSaving(true);
    try {
      if (user && isAuthenticated) {
        for (const [key, value] of Object.entries(stateUser)) {
          if (key === "dp") {
            if (value && !isUrl(value)) {
              let fileIpfs = await saveFile(
                user.get("username"),
                value as unknown as File,
                {
                  type: dpFileType,
                  // base64: value,
                  saveIPFS: true,
                }
              );
              // console.log(typeof value, "profile pic", user.get("username"));
              user.set("profilePic", fileIpfs);
            } else if (!value) {
              user.set("profilePic", null);
            }
          } else if (key === "coverImage") {
            if (value && !isUrl(value)) {
              let fileIpfs = await saveFile(
                user.get("username") + "-cover-image",
                value as unknown as File,
                {
                  type: coverFileType,
                  // base64: value,
                  saveIPFS: true,
                }
              );
              user.set("coverPic", fileIpfs);
            } else if (!value) {
              user.set("coverPic", null);
            }
          } else if (key === "instagram" || key === "twitter") {
            if (value) {
              user.set(
                key,
                value.toLowerCase().replace(/ /g, "").replace(/@/g, "")
              );
            }
          } else if (key === "email") {
            if (value) {
              user.set(key, value.toLowerCase().replace(/ /g, ""));
            }
          } else if (key === "username") {
            if (value && value !== user.get("username")) {
              let username = value.replace(/[^a-zA-Z0-9_]/g, "");
              if (username.length <= 0) {
                throw new Error("enter a username");
              }
              user.set(key, username.toLowerCase());
            }
          } else {
            if (value) {
              user.set(key, value);
            }
          }
          user.set(
            "socialMediaLinks",
            otherSocialMediaLinks.filter((link) => link.link)
          );
        }
        await user.save().then(() => {
          setIsUserUpdated(true);
        });
      }
      setSaving(false);
      router.push(`/${user?.attributes.username}`);
    } catch (error: any) {
      setSaving(false);
      dispatch(addNotification({ type: "error", message: error.message }));
    }
  };

  const [hoveredVerifyButton, setHoverVerifyButton] = useState(false);

  function setHoverVerifyButtonState(value: boolean) {
    setHoverVerifyButton(value);
  }

  return (
    <>
      <Head>
        <title>Edit Profile</title>
      </Head>
      <Navbar />
      {user && isAuthenticated ? (
        <StyledContainer>
          <h1>Edit your profile</h1>
          <>
            {/* <div className="tab">
            <button
              className={`tab__button ${
                activeTap === "Personnal" ? "tab__button--active" : ""
              }`}
              onClick={() => toggleActiveTab("Personnal")}
            >
              Personnal
            </button>
            <button
              className={`tab__button ${
                activeTap === "Account" ? "tab__button--active" : ""
              }`}
              onClick={() => toggleActiveTab("Account")}
            >
              Account
            </button>
          </div> */}
          </>

          <StyledDiv>
            <div className="edit-container">
              <Input
                label="name"
                placeholder="your name"
                id="name"
                value={stateUser.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  update(e.target.value, "name")
                }
                outline={true}
                required
              />
              {/* <div className="username-input__divider"></div> */}
              <Input
                label="username"
                placeholder="@username"
                id="username"
                value={stateUser.username}
                maxLength={10}
                minLength={3}
                error={
                  (data as boolean) ||
                  !stateUser.username ||
                  stateUser.username.length > 10
                }
                errorText={
                  (data as boolean)
                    ? "this username is already taken"
                    : stateUser.username.length > 10
                    ? "Username is more than 10 characters"
                    : "invalid Input"
                }
                loading={isFetching}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  update(
                    e.target.value.toLowerCase().replace(/[^a-zA-Z0-9_]/g, ""),
                    "username"
                  );
                }}
                outline={true}
                required
              />

              <Input
                type="textarea"
                label="A short bio"
                maxLength={300}
                value={stateUser.bio}
                id="bio"
                placeholder="short bio about yourself"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  update(e.target.value, "bio")
                }
                outline={true}
              />

              <FileInput
                deleteImage={removeDp}
                label="Add your profile image"
                value={dpPreview}
                setFile={(img) => updateDp(img)}
                updateFileType={(type) => setDpFileType(type)}
                format={["image"]}
              />

              <FileInput
                deleteImage={removeCoverImage}
                label="Add cover image"
                value={coverImagePreview}
                setFile={(img) => updateCoverImage(img)}
                updateFileType={(type) => setCoverFileType(type)}
                format={["image"]}
              />

              <Input
                type="email"
                label="email address"
                placeholder="email"
                value={stateUser.email}
                id="email"
                subLabel="Your email for marketplace notifications"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  update(e.target.value, "email")
                }
                outline={true}
                required
              />

              <Input
                type="text"
                label="Twitter username"
                placeholder="@username"
                value={stateUser.twitter}
                id="twitter-username"
                subLabel="Link your account to gain more trust on marketplace"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  update(e.target.value, "twitter")
                }
                outline={true}
              />

              <Input
                type="text"
                label="Instagram username"
                placeholder="@username"
                value={stateUser.instagram}
                id="instagram-username"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  update(e.target.value, "instagram")
                }
                outline={true}
              />
              <>
                {/* add links to your social media profile */}
                {/*
                <div className="add-social">
                  <p>Add links to your social profiles</p>
                  <button
                    className="add-social__button"
                    onClick={() =>
                      setOtherSocialMediaLinks([
                        ...otherSocialMediaLinks,
                        { link: "" },
                      ])
                    }
                  >
                    <div className="line-1"></div>
                    <div className="line-2"></div>
                  </button>
                </div>

                <div className="social-links__wrapper">
                  <Input
                    type="text"
                    label="Instagram username"
                    placeholder="@username"
                    value={stateUser.instagram}
                    id="instagram-username"
                    infoText="Link your instagram account to gain more trust on the marketplace"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      update(e.target.value, "instagram")
                    }
                  />

                  {otherSocialMediaLinks.map((link, index) => (
                    <Input
                      key={index}
                      label="custom URL"
                      placeholder="@custom URL"
                      value={link.link}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        addNewSocialMediaLink(e.target.value, index)
                      }
                    />
                  ))}
                </div>
               */}
              </>
            </div>

            <StyledVerification>
              <div className="verification__header">
                <h3>
                  Verification{" "}
                  <span>
                    {<Image src={tick} width="16" height="16" alt="tick" />}
                  </span>
                </h3>
                <Button
                  variant="filled"
                  text={hoveredVerifyButton ? "Coming soon" : "Get verified"}
                  // text="Coming soon"
                  disabled={hoveredVerifyButton}
                  // href="/profile/verify"
                  size="xs"
                  onFocus={() => setHoverVerifyButtonState(true)}
                  onClick={() => setHoverVerifyButtonState(true)}
                  onFocusCapture={() => setHoverVerifyButtonState(false)}
                  onClickCapture={() => setHoverVerifyButtonState(false)}
                />
              </div>

              <p>
                Get verified. Upgrade your credibility. Boost your chances of
                getting picked by buyers.
              </p>
            </StyledVerification>

            <StyledBottomButtons>
              <Button
                variant="outline"
                text="Cancel"
                onClick={() => router.push(`/${user.attributes.username}`)}
                block
                disabled={cancelDisabled}
              />
              <Button
                text="Update"
                onClick={() => updateProfile()}
                disabled={disabled}
                loading={saving}
                block
              />
            </StyledBottomButtons>
          </StyledDiv>
        </StyledContainer>
      ) : (
        <Prompt
          closeable={false}
          title="Authentication failed"
          message="Connect your wallet to view this page"
          text="Connect wallet"
          href="/connectwallet"
        />
      )}
    </>
  );
}

const StyledVerification = styled.div`
  /* margin-top: 1rem; */
  display: flex;
  flex-direction: column;
  padding-top: var(--padding-8);
  .verification__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: var(--padding-2);
  }
  h3 {
    display: flex;
    align-items: center;
    span {
      line-height: 1.5em;
      margin-left: 0.5rem;
    }
    svg {
      width: 1rem;
      height: auto;
    }
  }
  p {
    color: ${(props) => props.theme.gray2};
    line-height: 1.5em;
  }
`;

const StyledTabList = styled.div`
  display: flex;
  justify-content: space-evenly;

  .active {
    color: ${(props) => props.theme.green};
    border-bottom: 2px solid gray;
    padding-bottom: 0.5rem;
    border-color: ${(props) => props.theme.green};
  }
  .inactive {
    color: ${(props) => props.theme.gray2};
  }
  button {
    outline: none;
    border: none;
    background: none;
    border-bottom: 2px solid transparent;
    padding-bottom: 0.5rem;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 200ms ease-in-out;
  }
`;

const StyledContainer = styled.div`
  max-height: calc(100vh - 100px);
  position: sticky;
  top: 100px;
  overflow: auto;
  padding: 0 var(--padding-5);

  /* header {
    max-width: 700px;
    margin: 0 auto;
    position: sticky;
    top: 0;
    padding-top: var(--padding-5);
    background-color: ${(props) => props.theme.background};
    z-index: 1;

  } */
  h1 {
    max-width: 700px;
    margin: 0 auto;
    padding-top: var(--padding-6);
    text-align: center;
    font-size: var(--fontsizes-7);
    padding-bottom: var(--padding-8);
  }

  .tab {
    max-width: 700px;
    margin: 0 auto;
    position: sticky;
    top: 0;
    padding-top: var(--padding-5);
    background-color: ${(props) => props.theme.background};
    z-index: 2;

    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-content: center;
    gap: var(--padding-1);
  }
  .tab__button {
    cursor: pointer;
    border: none;
    outline: none;
    border-bottom: 2px solid ${(props) => props.theme.background};
    background: transparent;
    color: ${(props) => props.theme.primary};
    width: 100%;
    padding-bottom: var(--padding-5);
  }

  .tab__button--active {
    border-color: ${(props) => props.theme.green};
  }
  ${breakpoint("sm")} {
    .tab {
      width: 100%;
      grid-template-columns: 200px 200px;
      gap: var(--padding-10);
    }
    .tab__button {
      width: 200px;
    }
  }
`;

const StyledDiv = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding-top: var(--padding-8);

  .edit-container {
    & > :not(:last-child) {
      margin: 0 0 var(--padding-9) 0;
    }
  }
  .username-input__divider {
    height: var(--padding-4);
  }

  .add-social {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .add-social__button {
    background: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    display: flex;
    width: 30px;
    height: 30px;
    position: relative;
    border-radius: 100%;
    border: 1px solid ${(props) => props.theme.green};
    svg {
      stroke: ${(props) => props.theme.green};
      width: 50px;
      height: 50px;
    }
    &:hover,
    &:focus {
    }
  }
  .line-1,
  .line-2 {
    background-color: ${(props) => props.theme.green};
    position: absolute;
    left: 50%;
    top: 50%;
  }
  .line-1 {
    transform: rotate(180deg) translate(50%, 50%);
    height: 15px;
    width: 1px;
  }
  .line-2 {
    transform: translate(-50%, -50%);
    width: 15px;
    height: 1px;
  }
  .social-links__wrapper {
    & > :not(:last-child) {
      margin-bottom: var(--padding-7);
    }
  }
  ${breakpoint("3xl")} {
    .edit-container {
      & > :not(:last-child) {
        margin: 0 0 var(--padding-8) 0;
      }
    }
  }
`;

const StyledBottomButtons = styled.div`
  margin: 2rem auto 0;
  display: grid;
  grid-gap: 1rem;
  width: 100%;
  padding-bottom: 1rem;

  ${breakpoint("sm")} {
    max-width: 400px;
    grid-template-columns: 1fr 1fr;
  }
`;
