import Input from "components/input";
import { VerifyProfileContext } from "context/verificationContext";
import { ChangeEvent, useContext } from "react";

export default function VerifyProfileStepSix() {
  const { data, updateData } = useContext(VerifyProfileContext);

  return (
    <div className="container">
      <Input
        type="email"
        label="email address"
        id="email"
        placeholder="johndoe@mail.com"
        className="input"
        value={data.email}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          updateData(e.target.value, "email")
        }
      />
    </div>
  );
}
