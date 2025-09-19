import styled from "@emotion/styled";
import ClockIcon from "components/icons/clock";
import EyeIcon from "components/icons/eye";
import HeartIcon from "components/icons/heart";
import HorizontalMenuIcon from "components/icons/horizontalMenu";
import TagIcon from "components/icons/tag";
import TransferIcon from "components/icons/transfer";
import ArtistInformation from "components/layout/artist";
import CountDown from "components/layout/countdown";
import Loading from "components/loading";
import Image from "next/image";
import { breakpoint } from "public/breakpoint";
import React, { useEffect, useRef, useState } from "react";
import ActionButton from "./actionBtn";
import BurnToken from "./burnToken";
import ChangePrice from "./changePrice";
import Property from "./proprety";
import RemoveFromSale from "./removeFromSale";
import Tags from "./tags";
import { useAppDispatch } from "redux/hook";
import { addNotification } from "redux/slice/notificationSlice";
import { useMoralis } from "react-moralis";
import Transfer from "./transfer";
import { FiMaximize2, FiMinimize2 } from "react-icons/fi";
import { Dialog } from "@headlessui/react";
import { Global } from "@emotion/react";
import History from "components/history";
import { NFTDetailsLayoutProps } from "vizva";
import moment from "moment";
import Link from "next/link";
import { FaPause, FaPlay } from "react-icons/fa";
import { BsFillVolumeMuteFill, BsFillVolumeUpFill } from "react-icons/bs";
import {
  FacebookShareButton,
  TelegramShareButton,
  TwitterShareButton,
} from "react-share";
import CopyToClipboard from "react-copy-to-clipboard";
import LinkIcon from "components/icons/link";
import TelegramIcon from "components/icons/telegram";
import TwitterIcon from "components/icons/twitter";
import FacebookIcon from "components/icons/facebook";

export default function ArtworkDetailsLayout(props: NFTDetailsLayoutProps) {
  const { nft, myNFT, isAuthenticated, bottomButtons } = props;

  const [buyDisabled, setBuyDisabled] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isLiked, setIsLiked] = useState(props.isLiked);
  const [isWishlisted, setIsWishlisted] = useState(props.isWishlisted);
  const [readMore, setReadMore] = useState(false);

  const homepage =
    process.env.APP_ENV === "testnet"
      ? "https://www.testnet.vizva.io"
      : "https://www.vizva.io";

  // modal controllers state
  const [changePriceOpen, setChangePriceOpen] = useState(false);
  const [removeFromSaleOpen, setRemoveFromSaleOpen] = useState(false);
  const [burnTokenOpen, setBurnTokenOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const descriptionRef = useRef<HTMLDivElement>(null);

  // hooks
  const dispatch = useAppDispatch();
  const { Moralis } = useMoralis();

  function toggelReadMore() {
    setReadMore(!readMore);
  }

  // modal controllers
  function openChangePropsModal() {
    setChangePriceOpen(true);
  }
  function closeChangePropsModal() {
    setChangePriceOpen(false);
  }
  function openRemoveFromSaleModal() {
    setRemoveFromSaleOpen(true);
  }
  function closeRemoveFromSaleModal() {
    setRemoveFromSaleOpen(false);
  }
  function openBurnTokenModal() {
    if (nft.onSale) {
      dispatch(
        addNotification({
          type: "error",
          message: "Please cancel sale before burning token",
        })
      );
    } else setBurnTokenOpen(true);
  }
  function closeBurnTokenModal() {
    setBurnTokenOpen(false);
  }
  function toggleTransferModal() {
    if (nft.onSale) {
      dispatch(
        addNotification({
          type: "error",
          message: "Please cancel sale before transfering",
        })
      );
    } else setTransferOpen(!transferOpen);
  }
  function toggleIsShareOpen() {
    setIsShareOpen((isShareOpen) => !isShareOpen);
  }

  function toggleMenu() {
    setMenuOpen(!menuOpen);
  }
  function toggleHistory() {
    setShowHistory(!showHistory);
  }

  // the purpose of this state is to stop the likeUnLikeNFT function from being called multiple times
  const [isLiking, setIsLiking] = useState(false);
  // Function to like unlike an NFT
  const likeUnlikeNFT = async (likeObjectId: string) => {
    if (!isLiking) {
      setIsLiking(true);
      if (isAuthenticated) {
        try {
          if (isLiked) {
            const result = await Moralis.Cloud.run("userUnlike", {
              likeClass: "NFTData",
              likeObjectId: likeObjectId,
            });
            nft.likes--;
            setIsLiked(result);
          } else {
            const result = await Moralis.Cloud.run("userLike", {
              likeClass: "NFTData",
              likeObjectId: likeObjectId,
            });
            nft.likes++;
            setIsLiked(result);
          }
        } catch (error) {
          dispatch(
            addNotification({
              type: "error",
              message: "Something went wrong",
            })
          );
          // console.error(error);
        }
      } else {
        dispatch(
          addNotification({
            type: "error",
            message: "You must be logged in to like an NFT.",
          })
        );
      }
      setIsLiking(false);
    }
  };

  // function to add remove NFT from user's wishlist
  const addRemoveFromWishlist = async (nftId: string) => {
    if (isAuthenticated) {
      if (isWishlisted) {
        const result = await Moralis.Cloud.run("removeFromWishlist", {
          nftId: nftId,
        });
        result.removed == true ? setIsWishlisted(false) : setIsWishlisted(true);
        if (result.removed) {
          // dispatch(
          //   addNotification({
          //     type: "success",
          //     message: `You successfully removed ${nft.title} from your wishlist`,
          //   })
          // );
        }
      } else {
        const result = await Moralis.Cloud.run("addToWishlist", {
          nftId: nftId,
        });
        result.saved == true ? setIsWishlisted(true) : setIsWishlisted(false);
        if (result.saved) {
          // dispatch(
          //   addNotification({
          //     type: "success",
          //     message: `You successfully added ${nft.title} to your wishlist`,
          //   })
          // );
        }
      }
    } else {
      dispatch(
        addNotification({
          type: "error",
          message: "You must be logged in to add an NFT to wishlist.",
        })
      );
    }
  };

  const [maximized, setMaximized] = useState(false);
  function toggleMaximized() {
    setMaximized(!maximized);
  }

  // video controls
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLProgressElement>(null);
  const playpauseRef = useRef<HTMLButtonElement>(null);
  const muteRef = useRef<HTMLButtonElement>(null);
  const fullscreenRef = useRef<HTMLButtonElement>(null);
  const [PlayPauseIcon, setPlayPauseIcon] = useState(<FaPlay size={16} />);
  const [volumeIcon, setVolumeIcon] = useState(
    <BsFillVolumeUpFill size={20} />
  );

  useEffect(() => {
    if (typeof window === undefined) return;
    const video = videoRef.current;
    const progress = progressRef.current;
    const playpause = playpauseRef.current;
    const mute = muteRef.current;
    const fullscreen = fullscreenRef.current;
    if (!video || !progress || !playpause || !mute || !fullscreen) return;
    var supportsProgress = document.createElement("progress").max !== undefined;
    if (!supportsProgress) progress.setAttribute("data-state", "fake");

    var changeButtonState = function (type: string) {
      // Play/Pause button
      if (type == "playpause") {
        if (video.paused || video.ended) {
          playpause.setAttribute("data-state", "play");
        } else {
          playpause.setAttribute("data-state", "pause");
        }
      }

      // Mute button
      else if (type == "mute") {
        mute.setAttribute("data-state", video.muted ? "unmute" : "mute");
      }
    };

    // video.autoplay = true;
    // video.loop = true;

    video.addEventListener(
      "play",
      function () {
        changeButtonState("playpause");
        setPlayPauseIcon(<FaPause size={16} />);
      },
      false
    );

    video.addEventListener(
      "pause",
      function () {
        changeButtonState("playpause");
        setPlayPauseIcon(<FaPlay size={16} />);
      },
      false
    );

    // video.addEventListener("load", function () {
    //   video.autoplay = true;
    //   video.loop = true;
    // });

    video.addEventListener("timeupdate", function () {
      progress.value = Math.floor((video.currentTime / video.duration) * 100);
    });

    mute.addEventListener("click", function (e) {
      video.muted = !video.muted;
      if (video.muted) {
        setVolumeIcon(<BsFillVolumeMuteFill size={20} />);
      } else {
        setVolumeIcon(<BsFillVolumeUpFill size={20} />);
      }
      changeButtonState("mute");
    });

    fullscreen.addEventListener("click", async function (e) {
      if (video.requestFullscreen) {
        await video.requestFullscreen();
      }
      // else if (video.mozRequestFullScreen) {
      //   video.mozRequestFullScreen();
      // } else if (video.webkitRequestFullscreen) {
      //   video.webkitRequestFullscreen();
      // }
    });

    playpause.addEventListener("click", function (e) {
      if (video.paused || video.ended) video.play();
      else video.pause();
    });

    progress.addEventListener("click", function (e) {
      var rect = this.getBoundingClientRect();
      var pos = (e.pageX - rect.left) / this.offsetWidth;
      video.currentTime = pos * video.duration;
    });
  }, []);

  useEffect(() => {
    if (descriptionRef?.current) {
      descriptionRef.current.innerHTML = (
        readMore ? nft.description : nft.description.slice(0, 200)
      ).replaceAll(/\n/g, "<br />");
    }
  }, [nft.description, readMore]);

  return (
    <StyledDiv>
      <Loading isOpen={buyDisabled} />
      {maximized && (
        <>
          <Global
            styles={{
              body: {
                overflow: "hidden",
              },
            }}
          />
          <div className="maximize__container" onClick={toggleMaximized}>
            <div className="maximize__image-container">
              <div className="maximize__media-container">
                {nft.mediaFormat === "image" && (
                  <Image
                    alt={nft.title + " image"}
                    src={nft.file}
                    layout="fill"
                    objectFit="contain"
                    objectPosition="center center"
                    quality={75}
                    sizes="600px"
                  />
                )}
                {nft.mediaFormat === "video" && (
                  <video src={nft.file} controls autoPlay loop></video>
                )}
              </div>
              <button className="maximize__button" onClick={toggleMaximized}>
                {<FiMinimize2 />}
              </button>
            </div>
          </div>
        </>
      )}
      <div className="image-container">
        <div className="seen">
          <EyeIcon />
          <span>{nft?.views || 0}</span>
        </div>
        {nft.mediaFormat === "image" && (
          <button className="maximize__button" onClick={toggleMaximized}>
            {<FiMaximize2 />}
          </button>
        )}
        {/* <div className="media-wrapper"> */}
        <div className="media-container">
          {nft.mediaFormat === "image" && (
            <Image
              alt={nft.title + " image"}
              src={nft.file}
              layout="fill"
              objectFit="contain"
              objectPosition="center center"
              quality={75}
              sizes="600px"
            />
          )}
          {nft.mediaFormat === "video" && (
            <div className="video-container">
              <video ref={videoRef} src={nft.file} autoPlay loop></video>
              <div id="video-controls" className="controls" data-state="hidden">
                <button
                  ref={playpauseRef}
                  className="video-controls__button"
                  id="playpause"
                  type="button"
                  data-state="play"
                >
                  {PlayPauseIcon}
                </button>
                <div className="video-controls__progress">
                  <progress ref={progressRef} id="progress" value="0" max="100">
                    <span id="progress-bar"></span>
                  </progress>
                </div>
                <button
                  ref={muteRef}
                  className="video-controls__button"
                  id="mute"
                  type="button"
                  data-state="mute"
                >
                  {volumeIcon}
                </button>
                <button
                  ref={fullscreenRef}
                  className="video-controls__button"
                  id="fs"
                  type="button"
                  data-state="go-fullscreen"
                >
                  <FiMaximize2 size={16} />
                </button>
              </div>
            </div>
          )}
          {nft.mediaFormat === "audio" && (
            <audio src={nft.file} controls autoPlay={false}></audio>
          )}
        </div>
        {/* </div> */}
      </div>

      <div className="content-section">
        {/* these are the buttons floating to the right */}
        <StyledActionButtons>
          <ActionButton
            icon={<HeartIcon />}
            text={nft.likes ? nft.likes.toString() : "0"}
            tooltip="Like"
            className={isLiked ? "filled-icon" : ""}
            onClick={() => likeUnlikeNFT(nft.id)}
          />
          {!myNFT && (
            <ActionButton
              icon={<TagIcon />}
              tooltip="Wishlist"
              className={isWishlisted ? "filled-icon" : ""}
              onClick={() => addRemoveFromWishlist(nft.id)}
            />
          )}
          {myNFT && (
            <ActionButton
              icon={<TransferIcon />}
              tooltip="Transfer"
              onClick={() => toggleTransferModal()}
            />
          )}
          <ActionButton
            icon={<ClockIcon />}
            tooltip="History"
            onClick={() => toggleHistory()}
          />
          {myNFT && (
            <>
              <ActionButton
                icon={<HorizontalMenuIcon />}
                // tooltip="History"
                onClick={() => toggleMenu()}
              />
              {menuOpen && (
                <>
                  <StyledMenu>
                    <div className="background" onClick={toggleMenu}></div>
                    {/* if the NFT type is auction, you cant change the price */}
                    {nft.type != "auction" && nft.onSale && (
                      <li>
                        <button onClick={openChangePropsModal}>
                          Change price
                        </button>
                      </li>
                    )}
                    {nft.onSale && nft.minted && (
                      <li>
                        <button onClick={openRemoveFromSaleModal}>
                          Remove from sale
                        </button>
                      </li>
                    )}

                    <li>
                      <button onClick={toggleIsShareOpen}>Share</button>
                    </li>
                    <li>
                      <button onClick={openBurnTokenModal}>Burn token</button>
                    </li>
                  </StyledMenu>
                </>
              )}
            </>
          )}
        </StyledActionButtons>

        {/* share modal */}
        <Dialog open={isShareOpen} onClose={toggleIsShareOpen}>
          <StyledSocialModal className="share-dialog">
            <Dialog.Overlay className="share-dialog__background" />
            <ul className="menu__list">
              <li className="menu__item">
                <TwitterShareButton
                  url={`${homepage}/artwork/${nft.id}?type=${nft.type}`}
                  title={nft.title.charAt(0).toUpperCase() + nft.title.slice(1)}
                  hashtags={nft.tags}
                >
                  <div className="menu__svg--wrapper">
                    <TwitterIcon />
                  </div>
                  <p>Twitter</p>
                </TwitterShareButton>
              </li>
              <li className="menu__item">
                <FacebookShareButton
                  url={`${homepage}/artwork/${nft.id}?type=${nft.type}`}
                  title={nft.title.charAt(0).toUpperCase() + nft.title.slice(1)}
                  hashtag={nft.tags[0]}
                  quote={nft.description}
                >
                  <div className="menu__svg--wrapper">
                    <FacebookIcon />
                  </div>
                  <p>Facebook</p>
                </FacebookShareButton>
              </li>
              <li className="menu__item">
                <TelegramShareButton
                  url={`${homepage}/artwork/${nft.id}?type=${nft.type}`}
                >
                  <div className="menu__svg--wrapper">
                    <TelegramIcon />
                  </div>
                  <p>Telegram</p>
                </TelegramShareButton>
              </li>
              <li className="menu__item">
                <CopyToClipboard
                  text={`${homepage}/artwork/${nft.id}?type=${nft.type}`}
                >
                  <button>
                    <div className="menu__svg--wrapper">
                      <LinkIcon />
                    </div>
                    <p>Copy Link</p>
                  </button>
                </CopyToClipboard>
              </li>
            </ul>
          </StyledSocialModal>
        </Dialog>

        <div className="scroll-container">
          {/* <div className="spacer-padding"></div> */}
          {/* <div className="page1"> */}
          <div className="scroll-container__users">
            {/* IF THE OWNER ISN'T THE CREATOR */}
            {nft.owner && nft.owner.user.username != nft.createdBy.username && (
              <ArtistInformation
                heading="Owner"
                data={{
                  username: nft.owner.user.username,
                  name: nft.owner.user.name,
                  profilePic: nft.owner.user.profilePic,
                }}
                size="52"
                className="artist-information"
              />
            )}

            <ArtistInformation
              data={{
                username: nft.createdBy.username,
                name: nft.createdBy.name,
                profilePic: nft.createdBy.profilePic,
              }}
              size="52"
              className="artist-information"
            />
          </div>
          {/* title */}
          <h1 className="title">{nft.title}</h1>
          {/* countdown */}
          {nft.endTime && (
            <CountDown time={nft.endTime} position="relative" page="artwork" />
          )}

          {/* sold for */}
          {nft.owner && (
            <div className="description">
              <p className="heading">Sold for</p>
              <p className="description-text">
                {Moralis.Units.FromWei(nft.owner.amount)} MATIC
              </p>
            </div>
          )}

          {/* sold for */}
          {nft.owner && (
            <StyledMetaInformation className="sold">
              <div className="description">
                <p className="heading">Sold on</p>
                <p className="description-text description-text--time">
                  {moment(nft.owner.time).format("MMMM Do YYYY, h:mm:ss a")}
                </p>
              </div>

              <div className="description">
                <p className="heading">Bought by</p>
                <p className="description-text description-text--user">
                  <Link href={`/${nft.owner.user.username}`}>
                    <a>{nft.owner.user.username}</a>
                  </Link>
                </p>
              </div>
            </StyledMetaInformation>
          )}

          {/* description */}
          <div className="description">
            <p className="heading">description</p>
            <p className="description-text" ref={descriptionRef}></p>
            {nft.description.length > 200 && (
              <button onClick={toggelReadMore}>
                {readMore ? "show less" : "read more"}
              </button>
            )}
          </div>

          {/* no of copies */}
          <div className="description">
            <p className="heading">no of copies</p>
            <p className="description-text">1 of 1</p>
          </div>

          <StyledMetaInformation>
            <div>
              <p className="heading">format</p>
              <span>.{nft.format}</span>
            </div>

            <div>
              <p className="heading">original size</p>
              <span>
                {nft.size.width} x {nft.size.height}
              </span>
            </div>
          </StyledMetaInformation>

          {/* tags */}
          {nft.tags.length > 0 && (
            <div>
              <p className="heading">Tags</p>
              <Tags tags={nft.tags} />
            </div>
          )}
          {/* </div> */}
          {nft.attributes.length > 0 && (
            <StyledAttributes>
              {nft.attributes.filter(
                (attribute) => attribute.type === "properties"
              ).length > 0 && (
                <div className="properties">
                  <p className="heading">Properties</p>
                  <div>
                    {nft.attributes
                      .filter((attribute) => attribute.type === "properties")
                      .map((attribute, index) => (
                        <Property key={`property ${index}`} {...attribute} />
                      ))}
                  </div>
                </div>
              )}
            </StyledAttributes>
          )}
        </div>

        {/* if the artwork belongs to the user this should display another set of buttons */}
        {bottomButtons}

        {/* modal for transfering an NFT */}
        <Transfer
          isOpen={transferOpen}
          onClose={toggleTransferModal}
          nft={{
            title: nft.title,
            onSale: nft.onSale,
            nft_owner: nft.nft_owner,
            tokenId: nft.tokenId,
            tokenAddress: nft.tokenAddress,
          }}
        />

        {/* modal for changing the price of an NFT */}
        <ChangePrice
          nft={{
            title: nft.title,
            amountInEth: nft.amountInETH,
            marketId: nft.marketId,
            saleId: nft.saleId,
          }}
          isOpen={changePriceOpen}
          onClose={closeChangePropsModal}
        />

        {/* modal for removing an NFT from sale */}
        <RemoveFromSale
          nft={{
            title: nft.title,
            type: nft.type,
            saleId: nft.saleId,
            marketId: nft.marketId,
          }}
          isOpen={removeFromSaleOpen}
          onClose={closeRemoveFromSaleModal}
        />

        {/* modal for burning a token */}
        <BurnToken
          nft={{
            title: nft.title,
            tokenId: nft.tokenId,
            tokenAddress: nft.tokenAddress,
          }}
          isOpen={burnTokenOpen}
          onClose={closeBurnTokenModal}
        />
      </div>

      {showHistory && (
        <>
          <div className="overlay" onClick={() => toggleHistory()}></div>
          {/* <div className="history"> */}
          {/* // TODO: this needs to change be nft.history */}
          <History
            data={nft.history}
            close={toggleHistory}
            className="history"
          />
          {/* </div> */}
        </>
      )}
    </StyledDiv>
  );
}

const StyledSocialModal = styled.div`
  position: fixed;
  height: 100vh;
  width: 100vw;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 11;
  background: transparent;

  .menu {
    position: relative;
    white-space: nowrap;
    outline: none;
    border: none;
  }
  .menu__list {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: ${(props) => props.theme.onBackground};
    list-style: none;
    border-radius: 12px;
    overflow: hidden;

    /* 
    position: absolute;
    top: 130%;
    transform: translateX(-25%);
    z-index: 1;
    outline: none;
    border: none; */
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

  .share-dialog__wrapper {
    color: ${(props) => props.theme.primary};
    background-color: ${(props) => props.theme.onBackground};
    border: 1px solid ${(props) => props.theme.gray4};
    width: max-content;
    height: max-content;
    padding: var(--padding-6);
    border-radius: var(--padding-1);

    display: flex;
  }
  .share-dialog__button-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    &:not(:last-of-type) {
      margin-right: var(--padding-6);
    }
  }
  .share-dialog__background {
    position: absolute;
    z-index: -1;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(5px);
  }
`;
export const StyledMenu = styled.ul`
  position: absolute;
  right: 120%;
  top: 100%;
  list-style: none;
  border-radius: 10px;
  overflow: hidden;
  background-color: ${(props) => props.theme.onBackground};
  box-shadow: ${(props) =>
    props.theme.mode === "light" ??
    "0px 0px 10px 2px rgba(189, 189, 189, 0.3)"};
  z-index: -1;
  isolation: isolate;
  .background {
    background-color: transparent;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
  }
  li {
    button {
      display: flex;
      font-size: 1rem;
      padding: 10px 20px;
      min-width: max-content;
      width: 100%;
      cursor: pointer;
      background: transparent;
      outline: none;
      border: none;
      color: ${(props) => props.theme.primary};

      &:hover,
      &:focus {
        color: ${(props) => props.theme.green};
      }
    }
  }
`;
export const StyledAttributes = styled.div`
  /* margin-top: 3rem; */
  .properties > div {
    margin-top: 0.5rem;
    display: flex;
    flex-wrap: wrap;
    & > :not(:last-of-type) {
      margin-right: 1rem;
    }
  }
`;
export const StyledMetaInformation = styled.div`
  display: grid;
  grid-template-columns: max-content max-content;
  /* justify-content: space-between; */
  /* align-items: space-between; */
  gap: 4rem;
  &.sold {
    grid-template-columns: 2fr 1fr;
  }
  & > div {
    display: flex;
    flex-direction: column;

    span {
      letter-spacing: 1px;
    }
  }
`;
export const StyledActionButtons = styled.div`
  position: absolute;
  right: var(--padding-6);
  top: 0;
  display: flex;
  flex-direction: column;
  z-index: 1;

  & > :not(:last-child) {
    margin-bottom: 0.5rem;
  }

  .filled-icon {
    svg {
      fill: red;
      stroke: red;
    }
  }

  ${breakpoint("md")} {
    /* right: var(--padding-5); */
  }
  ${breakpoint("lg")} {
    right: var(--padding-6);
  }
`;
export const StyledBottomButtons = styled.div`
  border-top: 1px solid ${(props) => props.theme.secondary};
  display: flex;
  margin-top: var(--padding-1);
  padding: var(--padding-3);
  flex-direction: column;
  align-items: center;
  background-color: ${(props) => props.theme.background};
  & > :first-of-type {
    margin-bottom: 0.5rem;
  }
  .current-bid {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 1.4rem;
    .bidder {
      color: ${(props) => props.theme.secondary};
      .bidder-username {
        display: inline-block;
        text-transform: capitalize;
        color: ${(props) => props.theme.primary};
      }
    }
    span {
      font-size: var(--fontsizes-6);
      line-height: 1.2em;
      width: auto;
    }
  }

  ${breakpoint("sm")} {
    & > :not(:first-of-type) {
      margin-bottom: 0;
    }
    flex-direction: row;
    padding-left: 30px;
    padding-right: 30px;
    .current-bid {
      margin-right: 3rem;
      align-items: start;
      padding-bottom: 0;
    }
  }
`;
export const StyledDiv = styled.div`
  line-height: calc(1.5 * 1rem);
  min-height: calc(100vh - 100px);

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  grid-gap: 1rem;
  position: relative;
  .maximize__container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100vh;
    width: 100vw;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.9);
  }
  .maximize__image-container {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    height: 90vh;
  }
  .maximize__media-container {
    position: relative;
    height: 100%;
    max-width: 90vw;
    margin: 0 auto;
    width: auto;
    display: flex;
    align-items: center;
    justify-content: center;

    video,
    audio {
      width: auto;
      height: 100%;
      object-fit: cover;
    }
  }
  h1.title {
    text-transform: capitalize;
    font-size: var(--padding-8);
    line-height: 1.3em;
    padding-right: 2.5rem;
    word-break: break-all;
  }

  p.heading {
    font-size: 1rem;
    color: ${(props) => props.theme.secondary};
    text-transform: capitalize;
    letter-spacing: 1px;
    font-weight: 500;
  }
  .description-text--user {
    text-transform: capitalize;

    a:hover,
    a:focus {
      color: ${(props) => props.theme.green};
    }
  }

  .image-container {
    min-height: 15rem;
    position: relative;
    background-color: ${(props) => props.theme.onBackground};
    padding: 20px;
    max-height: calc(100vh - 100px);
    .media-container {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .video-container {
      position: relative;
      width: 100%;
      height: 100%;
    }
    video {
      width: 100%;
      height: 100%;
      object-fit: center;
    }

    audio {
      width: 100%;
      object-fit: cover;
    }

    & > .seen {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      position: absolute;
      right: 1rem;
      top: 1rem;
      border-radius: 20px;
      padding: 8px;
      z-index: 1;
      background-color: ${(props) =>
        props.theme.mode === "light"
          ? "rgba(0, 0, 0, 0.7)"
          : "rgba(255, 255, 255, 0.7)"};
      svg {
        height: 1.5rem;
        width: 1.5rem;
        max-height: 1.5rem;
        max-width: 1.5rem;
        stroke: ${(props) =>
          props.theme.mode === "dark" ? props.theme.black : props.theme.white};
      }
      span {
        mix-blend-mode: initial;
        color: ${(props) =>
          props.theme.mode === "dark" ? props.theme.black : props.theme.white};
      }
    }
  }

  .controls {
    position: absolute;
    bottom: 20px;
    background-color: white;
    /* min-height: 60px; */
    border-radius: 30px;
    width: 90%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    padding: var(--padding-3);
  }
  .video-controls__progress {
    width: 100%;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    progress {
      display: block;
      width: 100%;
      height: 5px;
      outline: none;
      border: none;

      &::-webkit-progress-value {
        border-radius: 2.5px;
        background-color: ${(props) => props.theme.black} !important;
      }

      &::-moz-progress-bar {
        background-color: ${(props) => props.theme.black} !important;
      }
    }
  }
  .video-controls__button {
    background: transparent;
    width: 50px;
    /* height: 50px; */
    outline: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      fill: black;
    }

    /* style the last button svg */
    &:last-of-type {
      svg {
        fill: none;
        stroke: black;
      }
    }

    &:focus,
    &:hover {
      opacity: 0.5;
    }
  }

  .maximize__button {
    outline: none;
    border: none;
    background: transparent;
    position: absolute;
    cursor: pointer;
    z-index: 1;
    bottom: var(--padding-6);
    right: var(--padding-6);

    svg {
      stroke: ${(props) => props.theme.primary};
    }
    &:hover,
    &:focus {
      opacity: 0.5;
    }
  }

  .content-section {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr max-content;
    position: relative;

    .scroll-container {
      /* height: 100%; */
      padding: 0 60px var(--padding-1) 0;
      padding: 0 var(--padding-6);
      & > :nth-of-type(n + 1) {
        margin-bottom: 3rem;
      }
    }
  }
  .scroll-container__users {
    display: flex;
    flex-wrap: wrap;
  }
  .spacer-padding {
    height: 30px;
  }

  .artist-information {
    padding-right: 50px;
    margin-top: var(--padding-4);
  }

  .description {
    display: flex;
    flex-direction: column;
    max-width: 50ch;
    .description-text {
      overflow: hidden;
      letter-spacing: 1px;
    }
    button {
      width: max-content;
      margin-left: auto;
      outline: none;
      border: none;
      background: transparent;
      cursor: pointer;
      margin-top: var(--padding-4);

      font-size: 1rem;
      color: ${(props) => props.theme.secondary};
      text-transform: capitalize;
      letter-spacing: 1px;
      font-weight: 500;

      &:focus,
      &:hover {
        color: ${(props) => props.theme.primary};
      }
    }
  }

  .page1 {
    width: calc(100% - 50px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .overlay {
    position: fixed;
    background-color: ${(props) => props.theme.gray900};
    inset: 0;
    opacity: 0.8;
    display: block;
    z-index: 1000;
  }

  .history {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1001;
  }

  ${breakpoint("sm")} {
    .controls {
      padding: var(--padding-3) var(--padding-8);
    }
  }

  ${breakpoint("lg")} {
    grid-template-columns: 1fr 1fr;
    .image-container {
      max-height: calc(100vh - 100px);
      position: sticky;
      top: 100px;
    }
    .content-section {
      height: 100%;

      .scroll-container {
        padding: calc(30px - var(--padding-4)) 50px 0 30px;
      }
    }
  }

  ${breakpoint("3xl")} {
    max-height: calc(100vh - 100px);
    overflow: hidden;
    padding-top: var(--padding-8);
    .image-container {
      position: sticky;
      top: 0;
    }
    .content-section {
      max-height: calc(100vh - 100px - 48px);
      grid-template-rows: 1fr max-content;
      .scroll-container {
        overflow: auto;
      }
    }
  }
`;
