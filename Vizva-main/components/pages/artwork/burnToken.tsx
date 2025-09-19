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
import { useBurnNFT } from "hooks/useServices";
import { useRouter } from "next/router";
interface BurnTokenProps {
  isOpen: boolean;
  onClose(): void;
  nft: {
    title: string;
    tokenId: string;
    tokenAddress: string;
  };
}
export default function BurnToken(props: BurnTokenProps) {
  const { isOpen, onClose, nft } = props;
  const router = useRouter();
  const [primaryLoading, setPrimaryLoading] = useState(false);
  const [primaryDisabled, setPrimaryDisabled] = useState(false);
  const [secondaryDisabled, setSecondaryDisabled] = useState(false);

  const {
    execute: burnNFT,
    txPending: burnNFTPending,
    loading: burnNFTLoading,
    error: burnNFTError,
  } = useBurnNFT();

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

  async function burnToken() {
    try {
      togglePrimaryLoading();
      togglePrimaryDisabled();
      toggleSecondaryDisabled();
      await burnNFT(nft.tokenId, nft.tokenAddress);
      dispatch(
        addNotification({
          type: "success",
          message: `Sucessfully Burned ${nft.title}`,
        })
      );
      togglePrimaryLoading();
      onClose();
      router.push("/");
    } catch (error: any) {
      togglePrimaryDisabled();
      togglePrimaryLoading();
      toggleSecondaryDisabled();
      dispatch(
        addNotification({
          type: "error",
          message: error.message ? error.message : "Burn NFT failed",
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
            <h2>Burn token</h2>
            <p>
              Are you sure to burn this token? This action cannot be undone.
              Token will be forever lost.
            </p>
          </main>
          <div className="btn">
            <Button
              variant="outline"
              text="Cancel"
              onClick={onClose}
              disabled={secondaryDisabled}
              block
            />
            <Button
              text="Burn token"
              onClick={burnToken}
              loading={primaryLoading}
              disabled={primaryDisabled}
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
