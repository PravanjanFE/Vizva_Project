import { Global } from "@emotion/react";
import styled from "@emotion/styled";
import { Dialog } from "@headlessui/react";
import Button from "components/button";
import CloseIcon from "components/icons/close";
import { StyledBackground } from "components/modal";
import { StyledModal } from "./removeFromSale";
import { useState } from "react";
import { useAppDispatch } from "redux/hook";
import { addNotification } from "redux/slice/notificationSlice";
import { ethers } from "ethers";
import { useTransferNFT } from "hooks/useServices";
import { errorMsg } from "public/error";

interface TransferProps {
  isOpen: boolean;
  onClose(): void;
  nft: {
    onSale: boolean;
    title: string;
    nft_owner: string;
    tokenId: string;
    tokenAddress: string;
  };
}
export default function Transfer(props: TransferProps) {
  const { isOpen, onClose, nft } = props;

  const [address, setAddress] = useState("");
  const [primaryLoading, setPrimaryLoading] = useState(false);
  const [primaryDisabled, setPrimaryDisabled] = useState(false);
  const [secondaryDisabled, setSecondaryDisabled] = useState(false);

  // toggles the loading state of the primary button
  function togglePrimaryLoading() {
    setPrimaryLoading((primaryLoading) => !primaryLoading);
  }
  // toggles the disabled state of the primary button
  function togglePrimaryDisabled() {
    setPrimaryDisabled((primaryDisabled) => !primaryDisabled);
  }
  // toggles the disabled state of the secondary button
  function toggleSecondaryDisabled() {
    setSecondaryDisabled((secondaryDisabled) => !secondaryDisabled);
  }
  // hooks
  const dispatch = useAppDispatch();

  const {
    execute: transferNFT,
    txPending: transferNFTPending,
    loading: transferNFTLoading,
    error: transferNFTError,
  } = useTransferNFT();

  // function for transfering NFT
  async function transfer() {
    try {
      togglePrimaryLoading();
      const valid = ethers.utils.isAddress(address);
      // console.log(address, nft.nft_owner);
      if (address.toLowerCase() == nft.nft_owner) {
        throw new Error("You are trying to transfer NFT to your own address");
      }
      if (nft.onSale)
        throw new Error(
          "You need to remove this NFT from sale before you can trnasfer it"
        );
      if (!valid) {
        throw new Error("Please enter a valid address");
      }
      await transferNFT(
        nft.nft_owner,
        address.toLowerCase(),
        nft.tokenId,
        nft.tokenAddress
      );
      dispatch(
        addNotification({
          type: "success",
          message: `Sucessfully Transfered ${nft.title}`,
        })
      );
      togglePrimaryLoading();
      onClose();
    } catch (error: any) {
      togglePrimaryLoading();
      var message = errorMsg[error.message] || error.message;
      dispatch(
        addNotification({
          type: "error",
          message: message || "Transfer failed",
        })
      );
    }
  }

  return (
    <>
      {isOpen && (
        <Global
          styles={{
            body: {
              overflow: "hidden",
            },
          }}
        />
      )}
      <Dialog open={isOpen} onClose={primaryLoading ? () => {} : onClose}>
        <StyledModal>
          <header>
            <button onClick={primaryLoading ? () => {} : onClose}>
              <CloseIcon />
            </button>
          </header>
          <main>
            <h2>Are you sure to transfer your token?</h2>
            <p>
              Please check the Wallet address before sending, Once you transfer
              a token to a address you might not be able to retreive it
              permanently.
            </p>
            <StyledInput
              type="text"
              placeholder="Wallet Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </main>
          <div className="btn">
            <Button
              variant="outline"
              text="Cancel"
              block
              disabled={secondaryDisabled}
              onClick={onClose}
            />
            <Button
              text="Transfer"
              loading={primaryLoading}
              disabled={primaryDisabled || nft.onSale}
              onClick={transfer}
              block
            />
          </div>
        </StyledModal>
        <StyledBackground
          onClick={primaryLoading ? () => {} : onClose}
        ></StyledBackground>
      </Dialog>
    </>
  );
}

const StyledInput = styled.input`
  border: none;
  outline: none;
  background: none;
  width: 100%;
  border-bottom: 2px solid ${(props) => props.theme.gray2};
  color: ${(props) => props.theme.primary};
  padding: var(--padding-2);
  margin: var(--padding-4) 0;
  &:focus {
    border-color: ${(props) => props.theme.green};
  }
`;
