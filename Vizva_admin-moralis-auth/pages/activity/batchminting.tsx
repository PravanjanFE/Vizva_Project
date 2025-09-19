import { ethers } from "ethers";
import LazyMinter from "services/LazyMinter";
import { vizvaLazyCollectionOption, vizvaMarketOption } from "config";
import { default as NextImage } from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { customAlphabet } from "nanoid";
import {
  useMoralisWeb3Api,
  useMoralis,
  useMoralisCloudFunction,
} from "react-moralis";
import CollectionDetailsModal from "../../components/batchMinting/CollectionDetailsModal";
import ImageUploadModal from "../../components/batchMinting/ImageUploadModal";
import Loader from "../../components/CustomLoader";
import { useSaveNFTData, useSaveMarketData } from "hook/useCreateCollection";
import Swal from "sweetalert2";

interface JSONData {
  [key: number]: {
    attributes: [];
    description: string;
    format: string;
    name: string;
    royalties: number;
    tags: [string];
  };
}
export default function BatchMinting() {
  const nanoid = customAlphabet("1234567890", 64);
  const {
    data: setNFTData,
    loading: setNFTDataLoading,
    error: setNFTDataError,
    execute: setNFTDataExecute,
  } = useSaveNFTData();

  const {
    loading: saveMarketLoading,
    error: saveMarketDataError,
    execute: saveMarketData,
  } = useSaveMarketData();

  const { Moralis } = useMoralis();
  const [isLoading, setIsLoading] = useState(false);
  const [showFirstModal, setShowFirstModal] = useState(false);
  const [showSecondModal, setShowSecondModal] = useState(false);
  const [showThirdModal, setShowThirdModal] = useState(false);
  const Web3Api = useMoralisWeb3Api();
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [base64Images, setBase64Images] = useState<any[]>([]);
  const [jsonData, setJsonData] = useState<JSONData | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<File | string | null>(null);
  const [dispPhoto, setDispPhoto] = useState<File | string | null>(null);
  const [collectionName, setCollectionName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [price, setPrice] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [ownerAddress, setOwnerAddress] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [collectionData, setCollectionData] = useState<any>();
  const [wallet, setWallet] = useState<ethers.Wallet>();
  const [walletError, setWalletError] = useState<string | null>(null);
  const [loaderText, setLoaderText] = useState("");
  const handleModalClose = () => {
    setShowFirstModal(false);
    clearForm();
  };
  const handleSecondModalClose = () => {
    setShowSecondModal(false);
    setUploadedImages([]);
    setUploadedFile(null);
    setBase64Images([]);
  };

  const handleThirdModalClose = () => {
    setShowThirdModal(false);
  };
  const {
    data: isCollectionTakenData,
    isFetching: isCollectionTakenFetching,
    error: collectionFetchingError,
  } = useMoralisCloudFunction("isCollectionTaken", {
    name: collectionName,
  });

  const {
    data: isUserAddressExist,
    isFetching: isUserAddressExistFetching,
    error: userAddressFetchingError,
  } = useMoralisCloudFunction("isUserAddressExist", {
    address: ownerAddress,
  });

  const handleFirstModalShow = () => setShowFirstModal(true);
  const handleFirstModalNext = async () => {
    setIsLoading(true);
    try {
      setLoaderText("Creating New Collection");
      const moralisCoverFile = new Moralis.File(
        `${collectionName}coverPhoto`,
        coverPhoto as File
      );
      const moralisDPFile = new Moralis.File(
        `${collectionName}displayPhoto`,
        dispPhoto as File
      );
      const wallet = ethers.Wallet.fromMnemonic(mnemonic);
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.SPEEDY_NODE
      );
      const connectedWallet = wallet.connect(provider);
      const collectionContract = new ethers.Contract(
        vizvaLazyCollectionOption.contractAddress,
        vizvaLazyCollectionOption.abi,
        connectedWallet
      );
      setLoaderText("Submiting Transaction");
      const tx = await collectionContract.createCollection(
        collectionName,
        collectionName,
        {
          gasPrice: ethers.utils.parseUnits("100", "gwei"),
        }
      );
      console.log("tx", tx);
      setLoaderText(`Transaction submitted ${tx.hash}`);
      const receipt = await tx.wait();
      setLoaderText(`Created New Collection`);
      const { clone, owner, name, symbol } = receipt.events[2].args;
      const coverIPFS = await moralisCoverFile.saveIPFS();
      const dpIPFS = await moralisDPFile.saveIPFS();
      setLoaderText("Saving Data");
      const _collectionData = await Moralis.Cloud.run("createNewCollection", {
        name: collectionName,
        description,
        coverPic: coverIPFS,
        dp: dpIPFS,
        owner,
        address: clone,
        symbol,
      });
      setCollectionData(_collectionData);
      //clearFirstForm();
      setShowFirstModal(false);
      setShowSecondModal(true);
    } catch (error: any) {
      Swal.fire("Oops!", error.message, "error");
      console.error("first model failed: ", error);
    } finally {
      setIsLoading(false);
      setLoaderText("");
    }
  };
  const handleSecondModalShow = () => setShowSecondModal(true);
  const handleSecondModalNext = () => {
    setShowSecondModal(false);
    setShowThirdModal(true);
  };
  const handleThirdModalShow = () => setShowThirdModal(true);

  const clearForm = () => {
    setCoverPhoto(null);
    setDispPhoto(null);
    setCollectionName("");
    setSymbol("");
    setPrice("0");
    setDescription("");
    setOwnerAddress("");
    setBase64Images([]);
    setUploadedImages([]);
    setUploadedFile(null);
    setJsonData(null);
  };

  const validateFirstForm = () => {
    if (
      !collectionFetchingError &&
      !userAddressFetchingError &&
      !isCollectionTakenData &&
      isUserAddressExist &&
      !isCollectionTakenFetching &&
      collectionName &&
      description &&
      parseFloat(price as string) > 0 &&
      mnemonic.split(" ").length == 12
    )
      return false;
    else return true;
  };
  const uploadToIpfs = async () => {
    setIsLoading(true);
    try {
      const options = {
        abi: base64Images,
      };
      setLoaderText("Uploading Images");
      // @ts-ignore
      const data = await Web3Api.storage.uploadFolder(options);
      let metadataArray = [];
      for (let i = 0; i < data.length; i++) {
        const metadata = {
          image: data[i].path,
          ...(jsonData as JSONData)[i],
        };
        const uploadData = {
          path: `metadata/${base64Images[i].id}.json`,
          content: metadata,
        };
        metadataArray.push(uploadData);
      }
      setLoaderText("Uploading metadata");
      // @ts-ignore
      const metadataPath = await Web3Api.storage.uploadFolder({
        abi: metadataArray,
      });
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.SPEEDY_NODE
      );
      const VizvaMarketInstance = new ethers.Contract(
        vizvaMarketOption.contractAddress,
        vizvaMarketOption.abi,
        provider
      );
      setLoaderText("Creating lazy vouchers");
      const chainId = await VizvaMarketInstance.getChainID();
      const lazyMinter = new LazyMinter({
        contract: VizvaMarketInstance,
        signer: wallet as ethers.Wallet,
        chainId,
      });
      for (let i = 0; i < metadataPath.length; i++) {
        const uri = metadataPath[i];
        const voucher = await lazyMinter.createVoucher(
          collectionData?.get("address"),
          base64Images[i].id,
          uri.path,
          Moralis.Units.ETH(price as string),
          metadataArray[i].content.royalties
        );
        if (voucher) {
          const t = await setNFTDataExecute({
            size: base64Images[i].size,
            tokenAddress: collectionData?.get("address"),
            tokenId: voucher?.tokenId,
            tokenURI: uri.path,
            metadata: metadataArray[i]?.content,
            minted: false,
            voucher,
            tags: metadataArray[i].content.tags,
            digitalKey: "",
            txHash: "NA",
            collectionName: collectionData?.get("name"),
            ethAddress: ownerAddress.toLowerCase(),
          });
          const market = await saveMarketData({
            nftId: t.id,
            saleType: "onSale",
            bidInWei: Moralis.Units.ETH(price as string),
            marketId: "NA",
            txHash: "NA",
          });
        }
      }
      handleSecondModalNext();
    } catch (error: any) {
      Swal.fire("Oops!", error.message, "error");
      console.error("Second modal failed", error);
    } finally {
      setIsLoading(false);
    }
  };
  const validateSecondForm = () => {
    if (
      jsonData &&
      Object.keys(jsonData as JSONData).length == base64Images.length
    ) {
      return false;
    } else return true;
  };
  // const validateThirdForm = () => {
  //   if (uploadedFile.length > 0 && uploadedImages.length > 0) return false;
  //   else return true;
  // };

  let collections = [
    {
      name: "Folder Name1",
      address: "0x38e7ac9338cb00d....75b3",
      link: "www.fb.com",
      size: "32.3Kb",
      imageUrl: "/static/dist/img/user2-160x160.jpg",
      createdDate: "29/11/2021",
      createdBy: "Created User",
    },
    {
      name: "Folder Name2",
      address: "0x38e7ac9338cb00d....ac34",
      link: "www.fb.com",
      size: "10Kb",
      imageUrl: "/static/dist/img/user2-160x160.jpg",
      createdDate: "23/11/2021",
      createdBy: "Created User",
    },
    {
      name: "Folder Name3",
      address: "0x38e7ac9338cb00d....32da",
      link: "www.fb.com",
      size: "12.1Kb",
      imageUrl: "/static/dist/img/user2-160x160.jpg",
      createdDate: "12/11/2021",
      createdBy: "Created User",
    },
    {
      name: "Folder Name4",
      address: "0x38e7ac9338cb00d....72b2",
      link: "www.fb.com",
      size: "24.4Kb",
      imageUrl: "/static/dist/img/user2-160x160.jpg",
      createdDate: "22/10/2021",
      createdBy: "Created User",
    },
    {
      name: "Folder Name5",
      address: "0x38e7ac9338cb00d....45ea",
      link: "www.fb.com",
      size: "13.5Kb",
      imageUrl: "/static/dist/img/user2-160x160.jpg",
      createdDate: "09/11/2021",
      createdBy: "Created User",
    },
    {
      name: "Folder Name6",
      address: "0x38e7ac9338cb00d....75b3",
      link: "www.fb.com",
      size: "20Kb",
      imageUrl: "/static/dist/img/user2-160x160.jpg",
      createdDate: "29/11/2021",
      createdBy: "Created User",
    },
  ];
  const handleCoverUpload = (file: File) => {
    setCoverPhoto(file);
  };

  const handleDispPhoto = (file: File) => {
    setDispPhoto(file);
  };

  const createBase64 = (file: File, index: number) => {
    const { type } = file;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      let size: string;
      let id: string;
      switch (type.slice(0, 5)) {
        case "image":
          const img = new Image();
          img.src = reader.result as string;
          img.onload = function () {
            size = `${img.width} x ${img.height}`;
            id = nanoid();
            setBase64Images((prevState) => [
              ...prevState,
              {
                path: `images/${id}.png`,
                content: reader.result,
                size,
                id,
              },
            ]);
          };
          break;
        case "audio":
          const audioElem = document.createElement("audio");
          audioElem.src = reader.result as string;
          size = `0 x 0`;
          id = nanoid();
          setBase64Images((prevState) => [
            ...prevState,
            { path: `images/${id}.mp3`, content: reader.result, size, id },
          ]);
          break;
        case "video":
          const videoElem = document.createElement("video");
          videoElem.src = reader.result as string;
          videoElem.onloadedmetadata = function () {
            size = `${videoElem.videoWidth} x ${videoElem.videoHeight}`;
            id = nanoid();
            setBase64Images((prevState) => [
              ...prevState,
              { path: `images/${id}.mp4`, content: reader.result, size, id },
            ]);
          };
          break;
      }
    };
  };

  useEffect(() => {
    const isValid = ethers.utils.isValidMnemonic(mnemonic);
    isValid ? setWalletError(null) : setWalletError("invalid nemonics");
    if (mnemonic.split(" ").length == 12 && isValid) {
      const etherWallet = ethers.Wallet.fromMnemonic(mnemonic);
      const errMsg =
        etherWallet.address.toLowerCase() != ownerAddress.toLowerCase()
          ? "Mnemonic doesn't match with the address you have given"
          : null;
      setWalletError(errMsg);
      if (!errMsg) {
        setWallet(etherWallet);
      }
    } else {
      setWallet(undefined);
    }
  }, [mnemonic]);

  const handleImagesUpload = async (file: File[]) => {
    [].forEach.call(file, createBase64);
    setUploadedImages(file);
  };
  const handleJSONUpload = (file: File) => {
    setUploadedFile(file);
    file.text().then((data) => setJsonData(JSON.parse(data)));
  };

  const handleImageDelete = (imageName: string) => {
    let currentImages = uploadedImages;
    let updatedImages: File[] = [];
    currentImages.forEach((image: File, i: number) => {
      if (image.name !== imageName) updatedImages.push(image);
    });
    setUploadedImages(updatedImages);
  };
  const allUploadedImages = uploadedImages.map((file: File, index: number) => (
    <li key={index}>
      {file.name}
      <button
        type="button"
        className=" btn btn-danger pr-2 pl-2 pt-0 pb-0 ml-2"
        onClick={() => handleImageDelete(file.name)}
      >
        X
      </button>
    </li>
  ));

  const handleFileDelete = () => {
    setUploadedFile(null);
  };
  const allUploadedFile = uploadedFile && (
    <li>
      {(uploadedFile as File).name}
      <button
        type="button"
        className=" btn btn-danger pr-2 pl-2 pt-0 pb-0 ml-2"
        onClick={() => handleFileDelete()}
      >
        X
      </button>
    </li>
  );
  const handlePriceChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target;
    if (value.match(/\./g)) {
      const [, decimal] = value.split(".");
      if (decimal?.length > 8) {
        return;
      }
    }
    setPrice(value);
  };
  return (
    <div>
      {isLoading && <Loader loaderText="" />}
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Acivity/Batch Minting</h1>
              </div>
              {/* <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><a href="#">Home</a></li>
                                    <li className="breadcrumb-item active">Dashboard v1</li>
                                </ol>
                            </div> */}
            </div>
          </div>
        </div>
        <section className="content pb-4">
          <div className="container-fluid p-4 bg-white">
            <button
              type="button"
              className="col-md-3 outline-none border-0 rounded-sm fs-6 bg-primary p-2 mb-4"
              onClick={() => setShowFirstModal(true)}
            >
              Create New Collection +
            </button>

            <CollectionDetailsModal
              showFirstModal={showFirstModal}
              handleFirstModalShow={handleFirstModalShow}
              handleModalClose={handleModalClose}
              handleFirstModalNext={handleFirstModalNext}
              coverPhoto={coverPhoto}
              dispPhoto={dispPhoto}
              collectionName={collectionName}
              symbol={symbol}
              price={price}
              description={description}
              ownerAddress={ownerAddress}
              setCollectionName={(e: any) => setCollectionName(e)}
              setSymbol={(e: any) => setSymbol(e)}
              setDescription={(e: any) => setDescription(e)}
              setOwnerAddress={(e: any) => setOwnerAddress(e)}
              handleCoverUpload={(e: any) => handleCoverUpload(e)}
              handleDispPhoto={(e: any) => handleDispPhoto(e)}
              handlePriceChange={(e: any) => handlePriceChange(e)}
              validateFirstForm={() => validateFirstForm()}
              isCollectionTakenData={isCollectionTakenData}
              isCollectionTakenFetching={isCollectionTakenFetching}
              mnemonic={mnemonic}
              setMnemonic={(e: any) => setMnemonic(e)}
            />

            <ImageUploadModal
              showSecondModal={showSecondModal}
              handleSecondModalShow={handleSecondModalShow}
              handleSecondModalClose={handleSecondModalClose}
              uploadToIpfs={uploadToIpfs}
              handleImagesUpload={(e: any) => handleImagesUpload(e)}
              uploadedImages={uploadedImages}
              handleJSONUpload={(e: any) => handleJSONUpload(e)}
              allUploadedImages={allUploadedImages}
              uploadedFile={uploadedFile}
              allUploadedFile={allUploadedFile}
              validateSecondForm={() => validateSecondForm()}
            />

            <Modal show={showThirdModal} onHide={handleThirdModalShow}>
              <Modal.Header closeButton onClick={handleThirdModalClose}>
                <Modal.Title>Done</Modal.Title>
              </Modal.Header>
              <Modal.Body className="bg-light">
                <div>Done</div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={handleThirdModalClose}>
                  Done
                </Button>
              </Modal.Footer>
            </Modal>

            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 10 }}></th>
                  <th>Title</th>
                  <th>Link</th>
                  <th>Created by</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {collections.map((item, index) => (
                  <tr key={index}>
                    <td></td>
                    <td className="">
                      <div className="d-flex flex-row">
                        {/* profile image */}
                        <div
                          className="g-col position-relative overflow-hidden rounded-circle"
                          style={{ width: "50px", height: "50px" }}
                        >
                          {item?.imageUrl ? (
                            <NextImage
                              src={item.imageUrl}
                              objectFit="cover"
                              layout="fill"
                            />
                          ) : (
                            <div
                              className="bg-success position-absolute"
                              style={{ left: 0, top: 0, right: 0, bottom: 0 }}
                            ></div>
                          )}
                        </div>
                        <div className="d.flex flex-row ml-2">
                          <p className="m-0">{item.name}</p>
                          <p
                            className="m-0 text-truncate"
                            style={{ width: "150px" }}
                          >
                            {item.createdDate}&nbsp;{item.size}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Link href={item.link}>{item.address}</Link>
                    </td>
                    <td>{item.createdBy}</td>

                    <td>
                      <button
                        type="button"
                        className="col outline-none border-0 rounded-sm fs-6 bg-primary ml-4"
                      >
                        <i className="fas fa-pen"></i>
                        &nbsp; Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ul className="pagination pagination-sm">
              <li className="page-item">
                <a className="page-link" href="#">
                  «
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  1
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  2
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  3
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  »
                </a>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
