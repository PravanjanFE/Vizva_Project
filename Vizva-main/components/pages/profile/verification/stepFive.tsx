import FileInput from "components/form elements/file";
import { VerifyProfileContext } from "context/verificationContext";
import { useContext, useEffect, useState } from "react";

export default function VerifyProfileStepFive() {
  const { data, updateData } = useContext(VerifyProfileContext);
  const [preview, setPreview] = useState<any>(null);
  useEffect(() => {
    if (!data.previousWork) {
      return;
    }
    const imgPreview = new FileReader();
    imgPreview.readAsDataURL(data.previousWork);
    imgPreview.onloadend = function () {
      setPreview(imgPreview.result);
    };
  }, [data.previousWork]);
  function deleteImage() {
    updateData("", "previousWork");
    setPreview("");
  }
  return (
    <div className="container">
      <FileInput
        format={["image"]}
        deleteImage={deleteImage}
        label="attach a screenshot of your work in progress on one of your minted items in the editor of your choice"
        value={preview}
        setFile={(e) => updateData(e, "previousWork")}
        infoText="e.g photoshop, illustrator etc. Or anyother backstage process"
        className="input"
      />
    </div>
  );
}
