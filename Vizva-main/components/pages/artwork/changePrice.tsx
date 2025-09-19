import { Global } from "@emotion/react";
import styled from "@emotion/styled";
import { Dialog } from "@headlessui/react";
import Button from "components/button";
import CloseIcon from "components/icons/close";
import { StyledBackground } from "components/modal";
import { useEffect, useState } from "react";
import ServiceFee from "../create/serviceFee";
import { StyledModal } from "./removeFromSale";
import { useAppDispatch } from "redux/hook";
import { addNotification } from "redux/slice/notificationSlice";
import { useChangePrice } from "hooks/useServices";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";
import { FiX } from "react-icons/fi";

interface ChangePriceProps {
  isOpen: boolean;
  onClose(): void;
  nft: {
    title: string;
    amountInEth: string;
    marketId: string;
    saleId: string;
  };
}

export default function ChangePrice(props: ChangePriceProps) {
  const { isOpen, onClose, nft } = props;
  const [newPrice, setNewPrice] = useState("");
  const [priceError, setPriceError] = useState(false);
  const [primaryLoading, setPrimaryLoading] = useState(false);
  const [primaryDisabled, setPrimaryDisabled] = useState(false);
  const [secondaryDisabled, setSecondaryDisabled] = useState(false);

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
  const { Moralis } = useMoralis();
  const { execute, loading, error, txPending } = useChangePrice();

  useEffect(() => {
    setPrimaryLoading(loading);
    if (error) {
      dispatch(
        addNotification({
          type: "error",
          message: error,
        })
      );
    }
  }, [loading, error]);

  async function changePrice() {
    try {
      togglePrimaryDisabled();
      toggleSecondaryDisabled();
      const price = Moralis.Units.ETH(newPrice);
      await execute(nft.marketId, price);
      await Moralis.Cloud.run("updateSalePrice", {
        id: nft.saleId,
        salePrice: price,
      });
      onClose();
      togglePrimaryDisabled();
      toggleSecondaryDisabled();
      dispatch(
        addNotification({
          type: "success",
          message: "suceessfully updated sale price",
        })
      );
      router.reload();
    } catch (error: any) {
      onClose();
      togglePrimaryDisabled();
      toggleSecondaryDisabled();
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
              <FiX size={24} />
            </button>
          </header>
          <main>
            <h2>Change Price</h2>
            <p>
              Change price for your existing item. Next price must be less than
              previous. If you want increase price, you should cancel then
              create sale with new price.
            </p>
            <StyledDiv>
              <StyledInput>
                {/* <span className="input__currentprice">{currentPrice}</span> */}
                <input
                  type="number"
                  value={newPrice}
                  placeholder={nft.amountInEth}
                  onChange={(e) => {
                    setPriceError(
                      parseFloat(nft.amountInEth) <
                        parseFloat(e.target.value) ||
                        parseFloat(e.target.value) < 0.005
                    );
                    setNewPrice(e.target.value);
                  }}
                />
                <span className="input__currency">MATIC</span>
              </StyledInput>
              <>{txPending && "Waiting for confirmation"}</>
              <>
                {priceError &&
                  "Price should be greater than 0.005 and less than previous price"}
              </>
              <ServiceFee
                fee={parseFloat(newPrice) ? parseFloat(newPrice) : 0}
              />
            </StyledDiv>
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
              text="Change price"
              onClick={changePrice}
              loading={primaryLoading}
              disabled={
                !newPrice ||
                parseFloat(newPrice) <= 0 ||
                primaryDisabled ||
                priceError
              }
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

const StyledInput = styled.div`
  position: relative;
  display: flex;
  justify-content: end;
  align-items: center;
  height: 50px;

  span.current__price {
    width: 50px;
    display: grid;
    place-items: center;
    font-size: 0.825rem;
  }
  span.input__currency {
    font-size: 0.825rem;
  }
  input {
    color: ${(props) => props.theme.primary};
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    /* padding-left: 80px; */
    background: transparent;
    border: none;
    outline: none;
    border-bottom: 2px solid ${(props) => props.theme.formBackground};

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    & {
      -moz-appearance: textfield;
    }

    &:focus {
      border-color: ${(props) => props.theme.green};
    }
  }
`;

const StyledDiv = styled.div`
  margin-top: 1rem;
`;
