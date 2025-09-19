import Input from "components/input";
import { VerifyProfileContext } from "context/verificationContext";
import { ChangeEvent, useContext } from "react";
export default function VerifyProfileStepNine() {
  const { data, updateData } = useContext(VerifyProfileContext);
  return (
    <div className="container">
      <Input
        label="personal or project website"
        placeholder="https://"
        id="website"
        infoText="this increases your credibility and hence increases the probability of you selling your NFT"
        className="input"
        value={data.portfolio}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          updateData(e.target.value, "portfolio")
        }
      />
    </div>
  );
}
