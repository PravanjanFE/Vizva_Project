import styled from "@emotion/styled";
import Button from "components/button";
import Input from "components/input";
import { CreateNftContext } from "context/createContext";
import { CreateBottomButtons } from "pages/create";
import { breakpoint } from "public/breakpoint";
import React, { useContext, useEffect, useRef, useState } from "react";
import * as Fi from "react-icons/fi";
import Levels from "./levels";
import Properties from "./properties";
import Stats from "./stats";
import Tags from "./tags";

export default function NftDetails() {
  const { data, updateData, clearStorage, incrementStage, creationType } =
    useContext(CreateNftContext);
  const [setting, setSetting] = useState(false);

  const [properties, setProperties] = useState(data.properties);
  const [levels, setLevels] = useState(data.levels);
  const [stats, setStats] = useState(data.stats);

  const descriptionRef = useRef<HTMLDivElement>(null);

  // toggles the advanced settings section
  function toggleSettings() {
    setSetting(!setting);
  }

  // when properties change, update the context vvalue
  useEffect(() => {
    updateData(properties, "properties");
  }, [properties]);
  // update the context value of levels
  useEffect(() => {
    updateData(levels, "levels");
  }, [levels]);
  // update the context value of stats
  useEffect(() => {
    updateData(stats, "stats");
  }, [stats]);

  useEffect(() => {
    if (descriptionRef.current) {
      descriptionRef.current.innerHTML = data.description.replace(
        /\n/g,
        "<br/>"
      );
    }
  }, []);

  // paste text as plain texts
  useEffect(() => {
    descriptionRef?.current?.addEventListener(
      "paste",
      function (e: ClipboardEvent) {
        // cancel paste
        e.preventDefault();

        // get text representation of clipboard
        var text = e?.clipboardData?.getData("text/plain") ?? "";

        // insert text manually
        if (descriptionRef?.current)
          descriptionRef.current.innerHTML = (
            descriptionRef.current.innerHTML + text
          ).slice(0, 2000);

        updateData(descriptionRef.current?.innerText, "description");
      }
    );
    () => descriptionRef?.current?.removeEventListener("paste", () => {});
  }, []);

  return (
    <div className="container">
      <StyledDiv>
        <h1>your NFT details</h1>

        <Input
          type="text"
          label="title"
          id="title"
          placeholder="artwork title"
          value={data.title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateData(e.target.value, "title")
          }
          required
        />

        <StyledDescription>
          <label htmlFor="description">
            Description<span className="required">*</span>
          </label>
          <div
            id="description"
            className="description"
            contentEditable="true"
            suppressContentEditableWarning={true}
            onInput={(e: React.ChangeEvent<HTMLDivElement>) => {
              e.preventDefault();
              updateData(e.target.innerHTML.slice(0, 2000), "description");
            }}
            placeholder="write a short description about your artwork"
            ref={descriptionRef}
          ></div>
          <div className="counter">{data.description.length}/2000</div>
        </StyledDescription>

        <div className="step2-row">
          <Input
            type="number"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              let isValid = /^[0-9]$|^[1-4][0-9]$|^[5][0]$/gm.test(
                e.target.value
              );
              if (!e.target.value || isValid) {
                updateData(e.target.value, "royalties");
              }
            }}
            value={data.royalties}
            label="royalties"
            id="royalties"
            step="5"
            icon={<Fi.FiPercent />}
            min={10}
            infoText="Suggested: 10%, 20%. Maximum is 50%"
          />
          {creationType === "multiple" && (
            <Input
              label="Number of Copies"
              placeholder="10"
              type="number"
              id="no-of-copies"
              infoText="Amount of Tokens"
              min={1}
            />
          )}
        </div>

        <div className="btn">
          <Button
            text={`${setting ? "Hide" : "Show"} Advanced Settings`}
            variant="text"
            size="sm"
            onClick={() => toggleSettings()}
            // block
          />
        </div>

        {/* advanced settings */}
        {setting && (
          <StyledAdvancedSettings>
            <Properties properties={properties} setProperties={setProperties} />
            <Levels levels={levels} setLevels={setLevels} />
            <Stats stats={stats} setStats={setStats} />
            <Tags />
          </StyledAdvancedSettings>
        )}
      </StyledDiv>
      <CreateBottomButtons />
    </div>
  );
}

const StyledDescription = styled.div`
  label {
    text-transform: capitalize;
    display: block;
    margin-bottom: 0.5rem;
    line-height: 1.2em;
    /* font-weight: 500; */
  }

  .required {
    color: ${(props) => props.theme.green};
  }

  .description {
    background: ${(props) => props.theme.formBackground};
    border-radius: 0.2rem;
    min-height: 6rem;
    /* max-height: 8rem;
    overflow: auto; */
    color: ${(props) =>
      props.theme.mode == "dark" ? props.theme.gray400 : "black"};
    padding: 10px 20px;

    &::-webkit-scrollbar-thumb {
      background-color: ${(props) => props.theme.gray3};
      border-radius: 16px;
      border: 5px solid ${(props) => props.theme.formBackground};
      transition: border 150ms ease;

      &:hover {
        border: 3px solid ${(props) => props.theme.formBackground};
      }
    }
  }

  .counter {
    direction: rtl;
  }
`;

const StyledAdvancedSettings = styled.div`
  display: flex;
  flex-direction: column;

  label {
    text-transform: capitalize;
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  /* & > :not(:last-of-type) {
    margin-bottom: 1rem;
  } */

  & > :not(:last-child) {
    margin: 0 0 var(--padding-7) 0;
  }
`;

const StyledDiv = styled.div`
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  /* height: 100%; */
  display: flex;
  flex-direction: column;
  /* overflow: scroll; */
  & > :not(:last-child) {
    margin: 0 0 var(--padding-7) 0;
  }
  h1 {
    text-transform: capitalize;
    font-size: var(--fontsizes-7);
    margin-bottom: 0.85rem;
    text-align: center;
  }
  .btn {
    margin: 1rem 0;
    display: flex;
    justify-content: center;
  }
  .step2-row {
    display: flex;

    & > :not(:last-child) {
      margin: 0 0 1rem 0;
    }
  }

  ${breakpoint("md")} {
    .step2-row {
      & > :not(:last-child) {
        margin: 0 1rem 0 0;
      }
    }
  }
`;
