import { createContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

export const TIME = [
  "1 day",
  "3 days",
  "5 days",
  "1 week",
  "1 month",
  "1 year",
];

// initial data i.e no creation step has been done
const initial = {
  // stage: 0,
  description: "",
  title: "",
  size: "",
  royalties: 10, //minimum
  format: "",
  time: TIME[0],
  key: "",
  bid: 0, // minimum bid
  tags: [],
  image: null,
  type: null, //video, image, audio, file
  previewImage: null,
  unlocked: false,
  properties: [
    {
      trait_type: "",
      value: "",
    },
  ],
  levels: [
    {
      key: "",
      value: "",
      total: "",
    },
  ],
  stats: [
    {
      key: "",
      value: "",
      total: "",
    },
  ],
};

type CreateType = "create" | "free minting" | "";
type CollectionType = "single" | "multiple" | "";

export const CreateNftContext = createContext({
  data: initial,
  type: "create",
  stage: 0,
  creationType: "multiple",
  updateType: (value: "create" | "free minting") => {},
  updateData: (value: any, header: string) => {},
  clearStorage: () => {},
  incrementStage: () => {},
  decreaseStage: () => {},
  setStageWithValue: (stage: number) => {},
  updateCreationType: (value: "single" | "multiple") => {},
});

export default function CreateNftProvider({
  children,
}: {
  children: JSX.Element;
}) {
  // the process type to take in creating your NFT create or free minting
  const [type, setType] = useState<CreateType>(() => {
    // if (typeof window !== "undefined") {
    //   const type = sessionStorage.getItem("create-type");
    //   return (type as CreateType) ?? "";
    // }
    return "";
  });

  // the type of collection to make
  const [creationType, setCreationType] = useState<CollectionType>(() => {
    // if (typeof window !== "undefined") {
    //   const type = sessionStorage.getItem("creation-type");
    //   return type ? (type as CollectionType) : "";
    // }
    return "";
  });

  // the current stage in creation
  const [stage, setStage] = useState<number>(() => {
    // if (typeof window !== "undefined") {
    //   const stage = sessionStorage.getItem("create-stage");
    //   return stage ? parseInt(stage) : 0;
    // }
    return 0;
  });

  // the data used in creating the NFT
  const [data, setData] = useState(() => {
    // if (typeof window !== "undefined") {
    //   const oldData = sessionStorage.getItem("create-data");
    //   return oldData ? JSON.parse(oldData) : initial;
    // }
    return initial;
  });

  useEffect(() => {
    // if (typeof window !== "undefined") {
    //   sessionStorage.setItem("create-type", type ?? "");
    // }
    if (stage === 1 && type) {
      incrementStage();
    }
  }, [type]);

  useEffect(() => {
    // if (typeof window !== "undefined") {
    //   sessionStorage.setItem("creation-type", creationType);
    // }
    if (stage === 2 && creationType) {
      incrementStage();
    }
  }, [creationType]);

  useEffect(() => {
    // if (typeof window !== "undefined") {
    //   sessionStorage.setItem("create-stage", stage as unknown as string);
    // }
  }, [stage]);

  useEffect(() => {
    // if (typeof window !== "undefined") {
    //   try {
    //     sessionStorage.setItem("create-data", JSON.stringify(data));
    //   } catch (error: any) {
    //     Swal.fire(error.message ?? "failed to save NFT data");
    //   }
    // }
  }, [data]);

  const updateType = (value: "create" | "free minting") => {
    if (type === value) {
      incrementStage();
    } else {
      setType(value);
    }
  };

  const incrementStage = () => {
    // checks for errors
    switch (stage) {
      case 1:
        if (!type) {
          Swal.fire("no type is specified");
          return;
        }
        break;
      case 2:
        // if (!creationType) {
        //   Swal.fire("no creation type provided");
        //   return;
        // }
        break;
      case 3:
        if (!data.image) {
          Swal.fire("no image provided");
          return;
        }
        break;
      case 4:
        if (!data.title || !data.description || !data.royalties) {
          if (!data.title) Swal.fire("no title provided");
          else if (!data.description) Swal.fire("no description provided");
          else if (!data.royalties) Swal.fire("no royalty defined");
          return;
        }
        break;
    }
    // if (stage + 1 < 6)
    // updates the stage value
    // if (stage + 1 === 2) {
    //   // skip choose type step
    //   setStage(3);
    // } else {
    // }
    setStage((stage) => stage + 1);
  };

  const decreaseStage = () => {
    // if (stage - 1 === 2) {
    //   setStage(1);
    // } else {
    //   if (stage - 1 >= 1) setStage(stage - 1);
    // }
    if (stage - 1 >= 1) setStage(stage - 1);
  };

  const setStageWithValue = (stage: number) => {
    setStage(stage);
  };
  const updateData = (value: any, header: string) => {
    setData((d: typeof initial) => ({ ...d, [header]: value }));
  };
  const updateCreationType = (value: "single" | "multiple") => {
    if (creationType === value) {
      incrementStage();
    } else {
      setCreationType(value);
    }
  };
  const clearStorage = () => {
    // sessionStorage.removeItem("create-type");
    // sessionStorage.removeItem("creation-type");
    // sessionStorage.removeItem("create-data");
    // sessionStorage.removeItem("create-stage");
    setStage(0);
    setType("");
    setCreationType("");
    setData(initial);
  };

  return (
    <CreateNftContext.Provider
      value={{
        data,
        type,
        stage,
        creationType,
        updateType,
        updateData,
        clearStorage,
        incrementStage,
        decreaseStage,
        setStageWithValue,
        updateCreationType,
      }}
    >
      {children}
    </CreateNftContext.Provider>
  );
}
