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
import { StyledLevel } from "./levels";

export default function Stats({
  stats,
  setStats,
}: {
  /**
   * @description all stats
   */
  stats: LEVEL[];
  setStats: Dispatch<SetStateAction<LEVEL[]>>;
}) {
  function addNewLevel() {
    const level = stats[stats.length - 1];
    if (level.key && level.total && level.value && level.value <= level.total) {
      setStats([
        ...stats,
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
    let allowed = stats.filter((stat, i) => index !== i);
    setStats([...allowed]);
  }

  function updateName(name: string, index: number) {
    let info = stats;
    info[index].key = name;
    setStats([...info]);
  }

  function updateValue(key: "value" | "total", value: string, index: number) {
    let info = stats;
    info[index][key] = value;
    setStats([...info]);
  }

  useEffect(() => {
    addNewLevel();
  }, [stats]);

  return (
    <StyledModal>
      <label htmlFor="">Stats</label>
      {stats.map((stat, index) => (
        <Level
          key={index}
          index={index}
          level={stat}
          noOfStats={stats.length}
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
  noOfStats: number;
  updateName(name: string, index: number): void;
  updateValue(key: "value" | "total", value: string, index: number): void;
  removeLevel(index: number): void;
}

function Level(props: LevelProps) {
  const { level, index, noOfStats, updateName, updateValue, removeLevel } =
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
    if (checkEmpty && edited && noOfStats > 1) {
      removeLevel(index);
    }
    if (checkEmpty && edited && noOfStats > 1) {
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
      {(level.key || total || value) && noOfStats - 1 != index ? (
        <button onClick={() => removeLevel(index)}>
          <Fi.FiTrash2 />
        </button>
      ) : (
        <button style={{ visibility: "hidden" }}></button>
      )}
    </StyledLevel>
  );
}
