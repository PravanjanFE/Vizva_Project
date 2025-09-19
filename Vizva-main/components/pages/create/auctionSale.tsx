import styled from "@emotion/styled";
import { useContext } from "react";
import { CreateNftContext } from "context/createContext";
import Input from "components/input";

export default function AuctionSale() {
  const { updateData } = useContext(CreateNftContext);
  const time = ["1day", "2days", "3days"];
  return (
    <StyledDiv className="pricing-details-container">
      <Input
        type="number"
        label="minimum bid"
        id="bid"
        placeholder="minimum bid amount"
        infoText="bids below this amount won't be accepted"
      />

      <div className="select">
        <label htmlFor="time">auction ends in</label>
        <select
          name="time"
          id="time"
          onChange={(e) => updateData(e.target.value, "time")}
        >
          {time.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>

      <p>
        Any bid placed in the last 10 minutes extends the auction by 10 minutes.
      </p>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  width: 100%;
  .select {
    & > label {
      display: block;
      padding-top: 1rem;
      padding-bottom: 5px;
    }
    & > select {
      height: 50px;
      background: ${(props) => props.theme.formBackground};
      outline: none;
      border: none;
      padding: 0 20px;
      border-radius: 0.2rem;

      &:focus {
        outline: 2px solid ${(props) => props.theme.green};
      }
    }
  }
  .auction-ends-in {
    margin-top: 1rem;
    width: 100%;
  }

  .buttons-row {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    place-items: center;
  }
`;
