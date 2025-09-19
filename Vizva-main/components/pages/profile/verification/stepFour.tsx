import Input from "components/input";
import { VerifyProfileContext } from "context/verificationContext";
import { ChangeEvent, useContext } from "react";

export default function VerifyProfileStepFour() {
  const { data, updateData } = useContext(VerifyProfileContext);
  return (
    <div className="container">
      <Input
        type="textarea"
        label="tell us about yourself, what is the concept behind your creation/collection/sales?"
        id="description"
        placeholder="your short description"
        className="input"
        value={data.bio}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          updateData(e.target.value, "bio")
        }
        maxLength={1000}
      />
    </div>
  );
}
