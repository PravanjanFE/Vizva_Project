import { Global } from "@emotion/react";
import styled from "@emotion/styled";
import { Dialog } from "@headlessui/react";
import Button from "components/button";
import CloseIcon from "components/icons/close";
import { StyledBackground } from "components/modal";
import { useCancelSale } from "hooks/useServices";
import { useRouter } from "next/router";
import { breakpoint } from "public/breakpoint";
import { useState } from "react";
import { FiX } from "react-icons/fi";
import { useMoralisCloudFunction } from "react-moralis";
import { useAppDispatch } from "redux/hook";
import { addNotification } from "redux/slice/notificationSlice";

interface RemoveFromSaleProps {
  isOpen: boolean;
  onClose(): void;
  nft: {
    title: string;
    type: string;
    marketId: string;
    saleId: string;
  };
}

export default function RemoveFromSale(props: RemoveFromSaleProps) {
  const { isOpen, onClose, nft } = props;

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
  const router = useRouter();

  const {
    loading: cancelSaleLoading,
    error: cancelSaleError,
    execute: cancelSale,
  } = useCancelSale();

  const {
    fetch: processCancelSale,
    isLoading: processCancelSaleLoading,
    error: processCancelSaleError,
  } = useMoralisCloudFunction("cancelSale", {}, { autoFetch: false });

  // function to remove from sale
  async function removeFromSale() {
    try {
      togglePrimaryLoading();
      togglePrimaryDisabled();
      toggleSecondaryDisabled();
      if (nft.type == "details") throw new Error("NFT not on sale");
      if (!nft.marketId) throw new Error("No marketId found");
      if (nft.marketId === "NA")
        throw new Error("Lazy minted NFT sale can't be cancelled");
      await cancelSale(nft.marketId);

      await processCancelSale({
        params: {
          saleType: nft.type == "auction" ? "onAuction" : "onSale",
          Id: nft.saleId,
        },
        onSuccess: () => {
          dispatch(
            addNotification({
              type: "success",
              message: `Sucessfully removed ${nft.title} from sale`,
            })
          );
          onClose();
          router.back();
        },
        onError: (error: any) => {
          dispatch(
            addNotification({
              type: "error",
              message: error.message
                ? error.message
                : "Sale cancellation failed",
            })
          );
          togglePrimaryLoading();
          onClose();
        },
      });
    } catch (error: any) {
      console.error(error);
      togglePrimaryLoading();
      toggleSecondaryDisabled();
      togglePrimaryLoading();
      dispatch(
        addNotification({
          type: "error",
          message: error.message ? error.message : "failed to remove from sale",
        })
      );
      onClose();
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
              {/* <CloseIcon /> */}
              <FiX />
            </button>
          </header>
          <main>
            <h2>Remove from sale</h2>
            <p>
              Do you really want to remove your item from sale? If this item is
              listed on other platforms, you must manually cancel it there as
              well. You can put it on sale anytime.
            </p>
          </main>
          <div className="btn">
            <Button
              variant="outline"
              text="Cancel"
              block
              onClick={onClose}
              disabled={secondaryDisabled}
            />
            <Button
              text="Remove from sale"
              onClick={removeFromSale}
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

export const StyledModal = styled.div`
  width: 90vw;
  max-width: 700px;
  z-index: 100;
  padding: 20px 0 40px 0;
  border-radius: 20px;
  background-color: ${(props) => props.theme.onBackground};
  color: ${(props) => props.theme.primary};
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  /* max-height: 100vh; */
  display: grid;
  grid-template-rows: max-content 1fr max-content;
  overflow: auto;

  main {
    overflow-y: auto;
    padding: 0 20px;
  }

  header {
    padding: 0 20px;
    display: flex;
    flex-direction: row-reverse;

    button {
      border: none;
      outline: none;
      background: transparent;
      display: grid;
      place-items: center;
      border-radius: 20px;
      padding: 10px;
      cursor: pointer;

      svg {
        transition: transform 150ms ease;
      }

      &:hover,
      &:focus {
        outline: 2px solid ${(props) => props.theme.green};

        svg {
          transform: rotate(90deg);
        }
      }
    }
  }

  h2 {
    margin-bottom: 1rem;
    font-size: var(--fontsizes-7);
    font-weight: 500;
  }

  p {
    font-weight: 400;
    line-height: 1.5em;
    /* max-width: 500px; */
    width: 100%;
  }

  .btn {
    padding: 0 20px;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;
    margin-top: 20px;
    width: 100%;
    /* min-width: 600px; */
  }

  ${breakpoint("sm")} {
    padding: 35px 0 80px 0;
    header {
      padding: 0 80px;
    }
    main {
      padding: 0 80px;
    }
    .btn {
      padding: 0 80px;
      grid-template-columns: 1fr 1fr;
    }
    p {
      line-height: 1.2em;
    }
  }
`;
