import Input from "components/input";
import { VerifyProfileContext } from "context/verificationContext";
import { ChangeEvent, useContext } from "react";
export default function VerifyProfileStepEight() {
  const { data, updateData } = useContext(VerifyProfileContext);
  return (
    <div className="container">
      <Input
        label="instagram username"
        placeholder="@username"
        id="instagram-username"
        infoText="this increases your credibility and hence increases the probability of you selling your NFT"
        className="input"
        value={data.instagram}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          updateData(e.target.value, "instagram")
        }
      />
    </div>
  );
}
