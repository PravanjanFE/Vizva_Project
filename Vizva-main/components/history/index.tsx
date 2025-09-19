import styled from "@emotion/styled";
import CloseIcon from "components/icons/close";
import { FiX } from "react-icons/fi";
import { HistoryProps } from "./history.type";
import HistoryItem from "./historyItem";

export default function History(props: HistoryProps) {
  const { data, className, close } = props;

  return (
    <StyledHistory
      className={`history-container ${className ? className : ""}`}
    >
      {close && (
        <div className="history__header">
          <p>History</p>
          <button onClick={close} title="Close history">
            <FiX size={24} />
          </button>
        </div>
      )}
      <div className="history__container">
        <table>
          <tbody>
            {/* reverse so it shows the latest to oldest activities */}
            {data.map((data, index) => (
              <HistoryItem data={data} key={`history-${index}`} />
            ))}
          </tbody>
        </table>
      </div>
    </StyledHistory>
  );
}

const StyledHistory = styled.div`
  /* padding: 1rem; */
  border-radius: 1rem;
  background-color: ${(props) => props.theme.onBackground};
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  &,
  .history__header {
    width: 90vw;
    max-width: 700px;
  }
  .history__container {
    overflow: auto;
    padding: 0 20px 5px 20px;
  }
  .history__header {
    display: flex;
    align-items: center;
    /* justify-content: flex-end; */
    justify-content: space-between;
    background-color: ${(props) => props.theme.onBackground};
    /* width: 100%; */
    z-index: 1;
    padding: var(--padding-7) 20px 10px 20px; // 10px should be 0 for evenly distributed space

    p {
      font-size: var(--fontsizes-5);
    }
  }

  button {
    display: grid;
    place-items: center;
    height: 30px;
    width: 30px;
    background: transparent;
    outline: none;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover,
    &:focus {
      svg {
        stroke: ${(props) => props.theme.green};
        transform: rotate(90deg);
        transition: 250ms;
      }
      /* outline: 2px solid ${(props) => props.theme.green}; */
    }

    svg {
      transition: 250ms transform;
      transform-origin: center;
      stroke: ${(props) => props.theme.gray1};
    }
  }

  table {
    width: 100%;
  }
`;
