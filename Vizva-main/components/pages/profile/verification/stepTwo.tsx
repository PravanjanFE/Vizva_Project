import Input from "components/input";
import { VerifyProfileContext } from "context/verificationContext";
import { ChangeEvent, useContext } from "react";

export default function VerifyProfileStepTwo() {
  const { updateData, data } = useContext(VerifyProfileContext);

  return (
    <div className="container">
      <Input
        type="text"
        label="your matic wallet address (please dont add ENS wallet name)*"
        id="ethereum-wallet"
        placeholder="matic wallet"
        className="input"
        value={data.ethAddress}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          updateData(e.target.value, "ethAddress")
        }
      />
    </div>
  );
}
