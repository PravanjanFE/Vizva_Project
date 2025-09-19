import { createContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

type header =
  | "bio"
  | "twitter"
  | "instagram"
  | "profileUrl"
  | "email"
  | "ethAddress"
  | "portfolio"
  | "type"
  | "previousWork";

interface VerifyContext {
  data: {
    bio: string;
    twitter: string;
    instagram: string;
    profileUrl: string;
    email: string;
    ethAddress: string;
    portfolio: string;
    type: "creator" | "collector" | string;
    previousWork?: any;
  };
  stage: number;
  updateData: (value: any, header: header) => void;
  clearStorage: () => void;
  incrementStage: () => void;
  decreaseStage: () => void;
}

// initial data i.e no creation step has been done
const initial = {
  bio: "",
  twitter: "",
  instagram: "",
  profileUrl: "",
  email: "",
  ethAddress: "",
  portfolio: "",
  type: "",
  previousWork: null,
};

export const VerifyProfileContext = createContext<VerifyContext>({
  data: initial,
  stage: 0,
  updateData: (value: any, header: header) => {},
  clearStorage: () => {},
  incrementStage: () => {},
  decreaseStage: () => {},
});

export default function VerifyProfileProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const noOfStages = 10;
  // the current stage in creation
  const [stage, setStage] = useState<number>(0);

  // the data used in creating the NFT
  const [data, setData] = useState(initial);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     sessionStorage.setItem("verify-stage", stage as unknown as string);
  //   }
  // }, [stage]);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     try {
  //       sessionStorage.setItem("verify-data", JSON.stringify(data));
  //     } catch (error: any) {
  //       Swal.fire(error.message ?? "failed to save NFT data");
  //     }
  //   }
  // }, [data]);

  const incrementStage = () => {
    if (stage + 1 < noOfStages) setStage((stage) => stage + 1);
  };

  const decreaseStage = () => {
    if (stage - 1 >= 1) setStage(stage - 1);
  };

  const updateData = (value: any, header: header) => {
    setData((d) => ({ ...d, [header]: value }));
  };

  const clearStorage = () => {
    sessionStorage.removeItem("verify-type");
    sessionStorage.removeItem("verify-data");
    sessionStorage.removeItem("verify-stage");
    setStage(0);
    setData(initial);
  };

  return (
    <VerifyProfileContext.Provider
      value={{
        data,
        stage,
        updateData,
        clearStorage,
        incrementStage,
        decreaseStage,
      }}
    >
      {children}
    </VerifyProfileContext.Provider>
  );
}
