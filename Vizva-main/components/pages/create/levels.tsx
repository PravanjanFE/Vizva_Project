import styled from "@emotion/styled";
import Input from "components/input";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { StyledModal } from "./properties";
import * as Fi from "react-icons/fi";
import { LEVEL } from "hooks/useCreateNFT";

export default function Levels({
  levels,
  setLevels,
}: {
  /**
   * @description all levels
   */
  levels: LEVEL[];
  setLevels: Dispatch<SetStateAction<LEVEL[]>>;
}) {
  function addNewLevel() {
    const level = levels[levels.length - 1];
    if (level.key && level.total && level.value && level.value <= level.total) {
      setLevels([
        ...levels,
        {
          key: "",
          value: "",
          total: "",
        },
      ]);
    }
  }

  // each level is removed by its index position
  function removeLevel(index: number) {
    let allowed = levels.filter((level, i) => index !== i);
    setLevels([...allowed]);
  }

  function updateName(name: string, index: number) {
    let info = levels;
    info[index].key = name;
    setLevels([...info]);
  }

  function updateValue(key: "value" | "total", value: string, index: number) {
    let info = levels;
    info[index][key] = value;
    setLevels([...info]);
  }

  useEffect(() => {
    addNewLevel();
  }, [levels]);

  return (
    <StyledModal>
      <label htmlFor="">Level</label>
      {levels.map((level, index) => (
        <Level
          key={index}
          index={index}
          level={level}
          noOfLevels={levels.length}
          updateName={updateName}
          updateValue={updateValue}
          removeLevel={removeLevel}
        />
      ))}
    </StyledModal>
  );
}

interface LevelProps {
  level: LEVEL;
  index: number;
  noOfLevels: number;
  updateName(name: string, index: number): void;
  updateValue(key: "value" | "total", value: string, index: number): void;
  removeLevel(index: number): void;
}

function Level(props: LevelProps) {
  const { level, index, noOfLevels, updateName, updateValue, removeLevel } =
    props;
  const value = parseInt(level.value);
  const total = parseInt(level.total);

  const [edited, setEdited] = useState(false);
  const [valueError, setValueError] = useState(false);
  const [totalError, setTotalError] = useState(false);

  // check if current entry is empty
  function isEmpty() {
    if (!level.key && !level.total && !level.value) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    // after updating, check if its fields are empty and delete it if they are empty
    let checkEmpty = isEmpty();
    if (checkEmpty && edited && noOfLevels > 1) {
      removeLevel(index);
    }
    if (checkEmpty && edited && noOfLevels > 1) {
      removeLevel(index);
    }
    if (
      value > total ||
      value === 0 ||
      (value && !/^[0-9]+$/gm.test(level.value))
    ) {
      setValueError(true);
    } else {
      setValueError(false);
    }
    if (
      total < value ||
      total === 0 ||
      (!!total && !/^[0-9]+$/gm.test(level.total))
    ) {
      setTotalError(true);
    } else {
      setTotalError(false);
    }
    if (!edited) setEdited(true);
  }, [level.key, level.value, level.total]);

  return (
    <StyledLevel key={index}>
      <Input
        type="text"
        placeholder="Ex:Male-level"
        id="levels"
        value={level.key}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          updateName(e.target.value, index)
        }
      />
      <div className="key-value">
        <Input
          type="text"
          placeholder="1"
          value={level.value}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            updateValue(
              "value",
              // if a value exists greater than 1, set it else set 0
              e.target.value,
              index
            );
          }}
          error={valueError}
          errorText={
            value && value > total
              ? "this cannot be greater"
              : value === 0
              ? "cannot be 0"
              : value && !/^[0-9]+$/gm.test(level.value)
              ? "invalid input"
              : "e"
          }
        />

        <div>of</div>

        <Input
          type="text"
          placeholder="2"
          value={level.total}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            updateValue(
              "total",
              // if a value exists greater than 1, set it else set 0
              e.target.value,
              index
            )
          }
          error={totalError}
          errorText={
            total < value
              ? "this cannot be lesser"
              : total === 0
              ? "cannot be 0"
              : total && !/^[0-9]+$/gm.test(level.total)
              ? "invalid input"
              : ""
          }
        />
      </div>
      {(level.key || total || value) && noOfLevels - 1 != index ? (
        <button onClick={() => removeLevel(index)}>
          <Fi.FiTrash2 />
        </button>
      ) : (
        <button style={{ visibility: "hidden" }}></button>
      )}
    </StyledLevel>
  );
}

export const StyledLevel = styled.div`
  gap: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr max-content;
  min-width: 200px;
  /* background: red; */

  &:not(:first-of-type) {
    margin-top: 10px;
  }

  & > .key-value {
    display: grid;
    grid-template-columns: 1fr max-content 1fr;

    & > :nth-of-type(2) {
      width: 50px;
      display: grid;
      place-items: center;
      height: 50px;
      font-weight: bold;
    }
  }
`;
