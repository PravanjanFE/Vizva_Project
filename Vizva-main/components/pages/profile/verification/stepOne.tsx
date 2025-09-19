import Input from "components/input";
import { VerifyProfileContext } from "context/verificationContext";
import { ChangeEvent, useContext } from "react";

export default function VerifyProfileStepOne() {
  const { updateData, data } = useContext(VerifyProfileContext);
  return (
    <div className="container">
      <Input
        label="share a link to your Vizva profile"
        id="profileUrl"
        placeholder="http://"
        className="input"
        value={data.profileUrl}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          updateData(e.target.value, "profileUrl")
        }
      />
    </div>
  );
}
