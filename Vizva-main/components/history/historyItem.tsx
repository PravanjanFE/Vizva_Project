import Image from "next/image";
import moment from "moment";
import styled from "@emotion/styled";
import Link from "next/link";
import { useMoralis } from "react-moralis";
import { HistoryItemProps } from "./history.type";
import useFiat from "hooks/useFiatValue";

export default function HistoryItem(props: HistoryItemProps) {
  const { user, isAuthenticated, Moralis } = useMoralis();

  // converts from MATIC to WMATIC. recieves MATIC value as input
  function getETH(WETHValue: string) {
    return WETHValue ? Moralis.Units.FromWei(WETHValue) : "";
  }

  if (!user && isAuthenticated) {
    return <p>loading...</p>;
  }

  function renderer(data: any, myName: string) {
    const { createdAt, time, type, amount, user, remark } = data;
    const { name, profilePic, username } = user;
    const pic = profilePic ? JSON.parse(JSON.stringify(profilePic)) : null;
    let isMyName = myName === name;

    const { fiat } = useFiat(parseFloat(getETH(amount)));

    // TODO after checking for the different remarks, the default returned should be generic

    switch (type) {
      case "bid":
        return (
          <td>
            <div className="history-information">
              <HistoryItemImage
                format={data.NFTData?.metadata?.format}
                image={data.NFTData?.metadata?.image}
              />
              <div className="history__content">
                {remark === "bidPlaced" ? (
                  <p>
                    <Link href={`/${username}`}>
                      <a>{isMyName ? "You" : name}</a>
                    </Link>{" "}
                    <span className="action">placed a bid on </span>
                    <LinkText
                      href={`/artwork/${data?.NFTData?.objectId}`}
                      label={data.NFTData?.metadata?.name}
                    />
                    <span className="action"> for </span>
                    <span>
                      {getETH(amount)} MATIC ($
                      {fiat})
                    </span>
                  </p>
                ) : remark === "outbidded" ? (
                  <p>
                    <Link href={`/${username}`}>
                      <a>{isMyName ? "Your" : name}</a>
                    </Link>{" "}
                    <span className="action">bid on </span>
                    <LinkText
                      href={`/artwork/${data?.NFTData?.objectId}`}
                      label={data.NFTData?.metadata?.name}
                    />
                    <span className="action"> was outbid by </span>
                    <span>
                      {getETH(amount)} MATIC ($
                      {fiat})
                    </span>
                  </p>
                ) : remark === "cancelled" ? (
                  <p>
                    The auction for{" "}
                    <LinkText
                      href={`/artwork/${data?.NFTData?.objectId}`}
                      label={data.NFTData?.metadata?.name}
                    />{" "}
                    was <span className="action">cancelled</span>
                  </p>
                ) : remark === "bidAccepted" ? (
                  <p>
                    The highest bid on{" "}
                    <LinkText
                      href={`/artwork/${data?.NFTData?.objectId}`}
                      label={data.NFTData?.metadata?.name}
                    />{" "}
                    has been <span className="action">accepted</span>
                  </p>
                ) : remark === "bidCancelled" ? (
                  <p>
                    You <span className="action">cancelled</span> the bid on{" "}
                    <LinkText
                      href={`/artwork/${data?.NFTData?.objectId}`}
                      label={data.NFTData?.metadata?.name}
                    />
                  </p>
                ) : remark === "bidWon" ? (
                  <p>
                    You <span className="action">won</span> the auction for{" "}
                    <LinkText
                      href={`/artwork/${data?.NFTData?.objectId}`}
                      label={data.NFTData?.metadata?.name}
                    />
                  </p>
                ) : remark === "newBid" ? (
                  <p>
                    A new bid <span className="action">has been placed</span> on{" "}
                    <LinkText
                      href={`/artwork/${data?.NFTData?.objectId}`}
                      label={data.NFTData?.metadata?.name}
                    />{" "}
                    by{" "}
                    <Link href={`/${data?.miscUserinfo?.username ?? ""}`}>
                      <a>{data?.miscUserinfo?.username ?? ""}</a>
                    </Link>
                  </p>
                ) : (
                  <p></p>
                )}
              </div>
            </div>
            <span className="time-ago">
              {moment(createdAt ?? time).fromNow()}
            </span>
          </td>
        );

      case "minted":
        return (
          <td>
            <div className="history-information">
              <HistoryItemImage
                format={data.NFTData?.metadata?.format}
                image={data.NFTData?.metadata?.image}
              />
              <div className="history__content">
                <p>
                  <Link href={`/${username}`}>
                    <a>{isMyName ? "You" : name}</a>
                  </Link>{" "}
                  <span className="action">minted</span>{" "}
                  <LinkText
                    href={`/artwork/${data?.NFTData?.objectId}`}
                    label={data.NFTData?.metadata?.name}
                  />{" "}
                </p>
              </div>
            </div>
            <span className="time-ago">
              {moment(createdAt ?? time).fromNow()}
            </span>
          </td>
        );

      case "listed":
        return (
          <td>
            <div className="history-information">
              <HistoryItemImage
                format={data.NFTData?.metadata?.format}
                image={data.NFTData?.metadata?.image}
              />
              <div className="history-content">
                <p>
                  <Link href={`/${username}`}>
                    <a>{isMyName ? "You" : name}</a>
                  </Link>{" "}
                  <span className="action">listed</span>{" "}
                  <LinkText
                    href={`/artwork/${data?.NFTData?.objectId}`}
                    label={data.NFTData?.metadata?.name}
                  />{" "}
                  for{" "}
                  <span>
                    {getETH(amount)} MATIC ($
                    {fiat})
                  </span>
                </p>
              </div>
            </div>
            <span className="time-ago">
              {moment(createdAt ?? time).fromNow()}
            </span>
          </td>
        );

      case "transfer":
        return (
          <td>
            <div className="history-information">
              <HistoryItemImage
                format={data.NFTData?.metadata?.format}
                image={data.NFTData?.metadata?.image}
              />
              <div className="history-content">
                <p>
                  {/* <Link href={`/${username}`}>
                <a>{isMyName ? "You" : name}</a>
              </Link>{" "} */}
                  <span className="action">{data.description}</span>{" "}
                  <LinkText
                    href={`/artwork/${data?.NFTData?.objectId}`}
                    label={data.NFTData?.metadata?.name}
                  />{" "}
                  has been successfully transfered
                  {/* <span>{getETH(amount)}MATIC ($)</span> */}
                </p>
              </div>
            </div>
            <span className="time-ago">
              {moment(createdAt ?? time).fromNow()}
            </span>
          </td>
        );

      case "wishlist":
        return (
          <td>
            <div className="history-information">
              <HistoryItemImage
                format={data.NFTData?.metadata?.format}
                image={data.NFTData?.metadata?.image}
              />
              <div className="history__content">
                {remark === "addedNFTOwner" || remark === "addedNFTCreator" ? (
                  <p>
                    <Link href={`/${data?.miscUserinfo?.username ?? ""}`}>
                      <a>{data?.miscUserinfo?.username ?? ""}</a>
                    </Link>{" "}
                    added
                    <LinkText
                      href={`/artwork/${data?.NFTData?.objectId}`}
                      label={data.NFTData?.metadata?.name}
                    />{" "}
                    to their <span className="action">wishlist</span>
                  </p>
                ) : (
                  <p>
                    <Link href={`/${username}`}>
                      <a>{isMyName ? "You" : name}</a>
                    </Link>{" "}
                    {remark}{" "}
                    <LinkText
                      href={`/artwork/${data?.NFTData?.objectId}`}
                      label={data.NFTData?.metadata?.name}
                    />{" "}
                    {remark === "added" ? "to" : "from"} your{" "}
                    <span className="action">wishlist</span>
                  </p>
                )}
              </div>
            </div>
            <span className="time-ago">
              {moment(createdAt ?? time).fromNow()}
            </span>
          </td>
        );

      case "cancel":
        return (
          <td>
            <div className="history-information">
              <HistoryItemImage
                format={data.NFTData?.metadata?.format}
                image={data.NFTData?.metadata?.image}
              />
              <div className="history__content">
                <p>
                  <LinkText
                    href={`/artwork/${data?.NFTData?.objectId}`}
                    label={data.NFTData?.metadata?.name}
                  />{" "}
                  was
                  <span className="action"> removed </span>
                  from sale
                </p>
              </div>
            </div>
            <span className="time-ago">
              {moment(createdAt ?? time).fromNow()}
            </span>
          </td>
        );

      case "salePriceUpdate":
        return (
          <td>
            <div className="history-information">
              <HistoryItemImage
                format={data.NFTData?.metadata?.format}
                image={data.NFTData?.metadata?.image}
              />
              <div className="history__content">
                <p>
                  <LinkText
                    href={`/artwork/${data?.NFTData?.objectId}`}
                    label={data.NFTData?.metadata?.name}
                  />{" "}
                  sale <span className="action"> price was changed </span> to{" "}
                  <span>
                    {getETH(amount)} MATIC ($
                    {fiat})
                  </span>
                </p>
              </div>
            </div>
            <span className="time-ago">
              {moment(createdAt ?? time).fromNow()}
            </span>
          </td>
        );

      case "NFTPurchase":
        return (
          <td>
            <div className="history-information">
              <HistoryItemImage
                format={data.NFTData?.metadata?.format}
                image={data.NFTData?.metadata?.image}
              />
              <div className="history__content">
                <p>
                  <Link href={`/${username}`}>
                    <a>{isMyName ? "You" : name}</a>
                  </Link>
                  <span className="action"> bought </span>
                  <LinkText
                    href={`/artwork/${data?.NFTData?.objectId}`}
                    label={data.NFTData?.metadata?.name}
                  />{" "}
                  for{" "}
                  <span>
                    {getETH(amount)} MATIC ($
                    {fiat})
                  </span>
                </p>
              </div>
            </div>
            <span className="time-ago">
              {moment(createdAt ?? time).fromNow()}
            </span>
          </td>
        );

      case "auction won":
        return (
          <td>
            <div className="history-information">
              <HistoryItemImage
                format={data.NFTData?.metadata?.format}
                image={data.NFTData?.metadata?.image}
              />
              <div className="history__content">
                <p>
                  <Link href={`/${username}`}>
                    <a>{isMyName ? "You" : name}</a>
                  </Link>{" "}
                  bid of{" "}
                  <span>
                    {getETH(amount)} MATIC ($
                    {fiat})
                  </span>
                  <span className="action"> won the auction </span> for{" "}
                  <LinkText
                    href={`/artwork/${data?.NFTData?.objectId}`}
                    label={data.NFTData?.metadata?.name}
                  />{" "}
                </p>
              </div>
            </div>
            <span className="time-ago">
              {moment(createdAt ?? time).fromNow()}
            </span>
          </td>
        );

      case "follow":
        return (
          <td>
            <div className="history-information">
              <HistoryItemImage
                format="image"
                image={data?.miscUserinfo?.profilePic?.url}
              />
              {remark === "newFollow" ? (
                <div className="history__content">
                  <Link href={`/${username}`}>
                    <a>you</a>
                  </Link>{" "}
                  <span className="action">followed</span>{" "}
                  <Link href={`/${data?.miscUserinfo?.username ?? ""}`}>
                    <a>{data?.miscUserinfo?.username ?? ""}</a>
                  </Link>
                </div>
              ) : remark === "newFollower" ? (
                <div className="history__content">
                  <Link href={`/${data?.miscUserinfo?.username ?? ""}`}>
                    <a>{data?.miscUserinfo?.username ?? ""}</a>
                  </Link>{" "}
                  <span className="action">followed</span>{" "}
                  <Link href={`/${username}`}>
                    <a>you</a>
                  </Link>{" "}
                </div>
              ) : (
                <div className="history__content">
                  <Link href={`/${username}`}>
                    <a>you</a>
                  </Link>{" "}
                  <span className="action">unfollowed</span>{" "}
                  <Link href={`/${data?.miscUserinfo?.username ?? ""}`}>
                    <a>{data?.miscUserinfo?.username ?? ""}</a>
                  </Link>
                </div>
              )}
            </div>
            <span className="time-ago">
              {moment(createdAt ?? time).fromNow()}
            </span>
          </td>
        );

      case "like":
        return (
          <td>
            <div className="history-information">
              {remark === "likedNFTLiker" ? (
                <HistoryItemImage
                  format={data.NFTData?.metadata?.format}
                  image={data.NFTData?.metadata?.image}
                />
              ) : (
                <HistoryItemImage
                  format="image"
                  image={data?.miscUserinfo?.profilePic?.url}
                />
              )}

              <div className="history__content">
                {remark === "likedNFTLiker" ? (
                  // nft liker
                  <p>
                    <Link href={`/${username}`}>
                      <a>{isMyName ? "You" : name}</a>
                    </Link>
                    <span className="action"> liked </span>
                    <LinkText
                      href={`/artwork/${data?.NFTData?.objectId}`}
                      label={data.NFTData?.metadata?.name}
                    />
                  </p>
                ) : remark === "unlikedNFT" ? (
                  <p>
                    <Link href={`/${username}`}>
                      <a>{isMyName ? "You" : name}</a>
                    </Link>
                    <span className="action"> unliked </span>
                    <LinkText
                      href={`/artwork/${data?.NFTData?.objectId}`}
                      label={data.NFTData?.metadata?.name}
                    />
                  </p>
                ) : (
                  // remark === "likedNFTCreator" ||
                  // remark === "likedNFTOwner" ?
                  // nft creator or owner
                  <p>
                    <Link href={`/${data?.miscUserinfo?.username ?? ""}`}>
                      <a>{data?.miscUserinfo?.username ?? ""}</a>
                    </Link>{" "}
                    <span className="action"> liked </span>
                    <LinkText
                      href={`/artwork/${data?.NFTData?.objectId}`}
                      label={data.NFTData?.metadata?.name}
                    />
                  </p>
                )}
              </div>
            </div>
            <span className="time-ago">
              {moment(createdAt ?? time).fromNow()}
            </span>
          </td>
        );

      case "burn":
        return (
          <td>
            <div className="history-information">
              <HistoryItemImage
                format="image"
                image={data?.miscUserinfo?.profilePic?.url}
              />

              <div className="history__content">
                {remark === "owner" ? (
                  <p>
                    <Link href={`/${username}`}>
                      <a>{isMyName ? "You" : name}</a>
                    </Link>
                    <span className="action"> burned </span>{" "}
                    <span className="capitalize">
                      {data.NFTData?.metadata?.name}
                    </span>
                  </p>
                ) : (
                  // remark === "creator"
                  // nft creator
                  <p>
                    <span className="capitalize">
                      {data.NFTData?.metadata?.name}
                    </span>{" "}
                    has been <span className="action">burned</span> by
                    <Link href={`/${data?.miscUserinfo?.username ?? ""}`}>
                      <a>{data?.miscUserinfo?.username ?? ""}</a>
                    </Link>{" "}
                  </p>
                )}
              </div>
            </div>
            <span className="time-ago">
              {moment(createdAt ?? time).fromNow()}
            </span>
          </td>
        );

      case "lazyminted":
        return (
          <td>
            <div className="history-information">
              <HistoryItemImage
                format={data.NFTData?.metadata?.format}
                image={data.NFTData?.metadata?.image}
              />

              <div className="history__content">
                <p>
                  <Link href={`/${username}`}>
                    <a>{isMyName ? "You" : name}</a>
                  </Link>{" "}
                  <span className="action"> lazy minted </span>
                  <LinkText
                    href={`/artwork/${data?.NFTData?.objectId}`}
                    label={data.NFTData?.metadata?.name}
                  />{" "}
                </p>
              </div>
            </div>
            <span className="time-ago">
              {moment(createdAt ?? time).fromNow()}
            </span>
          </td>
        );

      default:
        return <></>;
    }
  }
  return (
    <StyledTableRow>
      {renderer(props.data, user?.attributes.name)}
    </StyledTableRow>
  );
}

function LinkText({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href}>
      <a>{label}</a>
    </Link>
  );
}

function HistoryItemImage({
  image,
  format,
}: {
  image?: string;
  format: string;
}) {
  return (
    <div className="history__image-container">
      {format === "mp4" ? (
        <video src={image} autoPlay loop muted></video>
      ) : (
        <>
          {image && (
            <Image
              alt="history item image"
              src={image}
              width={50}
              height={50}
              // layout="fill"
              objectFit="cover"
              quality={75}
              sizes="200px"
            />
          )}
        </>
      )}
    </div>
  );
}

const StyledTableRow = styled.tr`
  display: flex;
  min-width: 400px;
  width: 100%;
  line-height: 1.6em;

  &:not(:last-of-type) {
    border-bottom: 0.5px solid ${(props) => props.theme.gray4};
  }

  td {
    padding: var(--padding-3) 0;
    width: 100%;
    font-size: 16px;
    display: grid;
    grid-template-columns: 1fr max-content;
    grid-column-gap: 1rem;
    height: 100%;

    .capitalize {
      text-transform: capitalize;
    }

    .history-information {
      display: grid;
      grid-template-columns: max-content 1fr;
      align-items: center;
      grid-gap: 1rem;

      .history__content {
        display: block;
      }

      .history__image-container {
        min-height: unset;
        position: relative;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow: hidden;
        background-image: ${(props) => props.theme.gradient};

        video {
          position: absolute;
          width: 50px;
          height: 50px;
          object-fit: cover;
        }
      }

      a {
        text-transform: capitalize;
        /* color: initial; */

        &:hover,
        &:focus {
          color: ${(props) => props.theme.green};
        }
      }

      .action {
        color: ${(props) => props.theme.secondary};
      }
    }

    .time-ago {
      display: inline-block;
      font-size: 0.85rem;
      align-self: center;
      color: ${(props) => props.theme.gray2};
      justify-self: end;
    }
  }
`;
