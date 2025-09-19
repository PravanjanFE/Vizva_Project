import styled from "@emotion/styled";
import SearchIcon from "components/icons/search";
import Link from "next/link";
import { useRouter } from "next/router";
import React, {
  InputHTMLAttributes,
  KeyboardEvent,
  useEffect,
  useState,
} from "react";
import { useMoralis } from "react-moralis";
import Image from "next/image";
import { isUrl } from "services/helpers";
import { breakpoint } from "public/breakpoint";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: boolean;
  position?: string;
  rounded?: boolean;
}

interface searchSuggestions {
  createdBy?: string;
  id?: string;
  image?: string;
  name?: string;
  username?: string;
  type?: string; // "artist" or "artwork"
  format?: string; // "png" or "jpeg" TODO: add support for video & audio in search suggestions. Need to modify cloud function titled "getSearchSuggestions" for this.
}

export default function Search(props: InputProps) {
  const { icon = false, position, rounded = false } = props;
  const [value, setValue] = useState("");
  const router = useRouter();
  const [focused, setFocused] = useState(false);
  const { Moralis } = useMoralis();
  const [suggestions, setSuggestions] = useState<searchSuggestions[]>([]);

  // create a function to get suggestions from the moralis cloud function
  const getSuggestions = async (value: string) => {
    if (value === "") return;
    const result = await Moralis.Cloud.run("getSearchSuggestions", {
      keyword: value,
    });
    return result;
  };

  useEffect(() => {
    if (value.length > 0) {
      setFocused(false);
      // run after a timeout of 1000 ms, to prevent the cloud function from being called too often
      // cancels the previous timeout if value is changed before the timeout is finished
      const timeout = setTimeout(async () => {
        const result = await getSuggestions(value);
        if (result) {
          setSuggestions(result);
          setFocused(true);
        }
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [value]);

  return (
    <>
      <StyledDiv className="search__wrapper">
        <StyledSearch className={props.className} $rounded={rounded}>
          <label htmlFor="search">search</label>
          <StyledInput
            {...props}
            $position={position}
            id="search"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={undefined}
            autoComplete="off"
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
              if (e.code === "Enter") {
                setFocused(false);
                router.push(`/search?q=${value}`);
              }
            }}
          />
          {icon && (
            <span className={`icon ${position ? position : "left"}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="27"
                fill="none"
                viewBox="0 0 24 27"
              >
                <path
                  stroke="gray"
                  strokeMiterlimit="10"
                  strokeWidth="2"
                  d="M11.02 21.891c5.535 0 10.021-4.486 10.021-10.02 0-5.535-4.486-10.021-10.02-10.021C5.486 1.85 1 6.336 1 11.87c0 5.535 4.486 10.021 10.02 10.021zM17.227 19.634L23 25.407"
                ></path>
              </svg>
            </span>
          )}
        </StyledSearch>
        {focused && value && (
          <Result
            query={value}
            suggestions={suggestions}
            close={() => setFocused(false)}
          />
        )}
      </StyledDiv>
      {focused && value && (
        <div
          onClick={() => setFocused(false)}
          style={{
            left: "0",
            top: "0",
            right: "0",
            bottom: "0",
            position: "fixed",
            height: "100vh",
            width: "100vw",
            zIndex: "-2",
          }}
          className="background"
        ></div>
      )}
    </>
  );
}

function Result({
  query,
  close,
  suggestions,
}: {
  query?: string;
  close: () => void;
  suggestions: searchSuggestions[];
}) {
  return (
    <StyledContainer onBlur={close}>
      {suggestions.length > 0 && (
        <>
          <div className="scrollbar">
            {suggestions
              .filter((suggestion) => suggestion.type === "artwork")
              .slice(0, 3).length > 0 && <p className="heading">artwork</p>}
            {suggestions
              .filter((suggestion) => suggestion.type === "artwork")
              .slice(0, 3)
              .map((suggestion) => (
                <Link href={`/artwork/${suggestion.id}`}>
                  <a className="search-suggestion">
                    <SearchIcon />
                    <p>
                      {suggestion?.name
                        ? suggestion.name.charAt(0).toUpperCase() +
                          suggestion.name.slice(1)
                        : "Untitled"}
                    </p>
                    <p></p>
                    <div className="image-container">
                      {isUrl(suggestion?.image ?? "") && (
                        <Image
                          src={suggestion?.image ?? ""}
                          alt="search result image"
                          layout="fill"
                          quality={75}
                          sizes="200px"
                        />
                      )}
                    </div>
                  </a>
                </Link>
              ))}
            {suggestions
              .filter((suggestion) => suggestion.type === "artist")
              .slice(0, 3).length > 0 && <p className="heading">people</p>}
            {suggestions
              .filter(
                (suggestion) => suggestion.type === "artist" && suggestion.name
              )
              .slice(0, 3)
              .map((suggestion) => (
                <Link href={`/${suggestion.username}`}>
                  <a className="search-suggestion">
                    <SearchIcon />
                    <p>
                      {suggestion?.name &&
                        suggestion.name.charAt(0).toUpperCase() +
                          suggestion.name.slice(1)}
                    </p>
                    <p>@{suggestion?.username}</p>

                    <div className="image-container">
                      {isUrl(suggestion?.image ?? "") && (
                        <Image
                          alt="search result image"
                          src={suggestion?.image ?? ""}
                          layout="fill"
                          quality={75}
                          sizes="200px"
                        />
                      )}
                    </div>
                  </a>
                </Link>
              ))}
          </div>
        </>
      )}
      <div>
        {/* <hr /> */}
        <Link href={`/search?q=${query}`}>
          <a>See All Results</a>
        </Link>
      </div>
    </StyledContainer>
  );
}

const StyledDiv = styled.div`
  height: 50px;
  width: 100%;
  position: relative;

  .background {
    position: absolute;
    inset: 0;
    width: 100vw;
    height: 100vh;
    background-color: ${(props) => props.theme.black};
    /* background-color: red; */
  }
  ${breakpoint("lg")} {
    max-width: 637px;
  }
`;
const StyledContainer = styled.div`
  background-color: ${(props) => props.theme.onBackground};
  border-radius: 20px;
  width: 100%;
  max-height: 70vh;
  position: absolute;
  top: 120%;
  display: grid;
  grid-template-rows: 1fr max-content;
  overflow: hidden;
  & > div {
    padding: 1rem;
  }

  & > div:nth-of-type(1) {
    overflow-y: auto;
  }

  .search-suggestion {
    display: grid;
    grid-template-columns: max-content 1fr 1fr max-content;
    gap: 1rem;
    align-items: center;
    width: 100%;
    padding: 5px 10px;
    &:hover {
      background-color: ${(props) => props.theme.background};
    }
    p {
      text-align: start;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .image-container {
      position: relative;
      margin-left: 1rem;
      width: 30px;
      height: 30px;
      background-color: ${(props) => props.theme.secondary};
      border-radius: 50%;
      img {
        object-fit: cover;
        border-radius: 50%;
      }
    }
    /* &:not(:last-of-type) {
    } */
  }

  hr {
    margin: 0.5rem 0;
  }

  p.heading {
    letter-spacing: 0.7px;
    margin: 0.5rem 0;
    color: ${(props) => props.theme.gray2};
    text-transform: capitalize;
  }

  a {
    display: block;
    margin: 0 auto;
    text-align: center;
    width: max-content;
    color: ${(props) => props.theme.green};
    letter-spacing: 1px;
  }
`;

const StyledInput = styled.input<{ $position?: string }>`
  appearance: none;
  z-index: 1000;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
  line-height: 1em;

  outline: none;
  color: ${(props) => props.theme.primary};
  font-size: 1rem;
  letter-spacing: 0.7px;
  border: 1px solid ${(props) => props.theme.gray3};

  padding: ${(props) =>
    props.$position == "left"
      ? "0 4rem"
      : props.$position == "right"
      ? "0 2rem"
      : "0 4rem"};
  &:focus + .placeholder {
    display: none;
  }
  &:focus {
    border-color: ${(props) => props.theme.green};
  }
`;

const StyledSearch = styled.div<{ $rounded: boolean }>`
  position: relative;
  background-color: ${(props) => props.theme.formBackground};
  width: 100%;
  min-height: 1rem;
  max-height: 50px;
  height: 100%;
  cursor: pointer;
  border-color: ${(props) => props.theme.gray2};
  border-radius: ${(props) => (props.$rounded ? "40px" : "")};
  input {
    border-radius: ${(props) => (props.$rounded ? "40px" : "")};
  }

  label {
    display: none;
  }

  .icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    line-height: 100%;
    z-index: 1000;
    svg {
      width: 24px;
      height: auto;
    }
  }

  .left {
    left: 2rem;
  }

  .right {
    right: 2rem;
  }
`;
