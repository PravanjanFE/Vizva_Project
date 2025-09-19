import Input from "components/input";
import { VerifyProfileContext } from "context/verificationContext";
import { ChangeEvent, useContext } from "react";

export default function VerifyProfileStepSeven() {
  const { data, updateData } = useContext(VerifyProfileContext);
  return (
    <div className="container">
      <Input
        label="twitter username"
        placeholder="@username"
        id="twitter-username"
        infoText="this increases your credibility and hence increases the probability of you selling your NFT"
        className="input"
        value={data.twitter}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          updateData(e.target.value, "twitter")
        }
      />
    </div>
  );
}
