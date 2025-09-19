import styled from "@emotion/styled";
import EthIcon from "components/icons/eth";
import Modal from "components/modal";
import {
  useGetMaticBalance,
  useGetWETH,
  useWithdrawWETH,
} from "hooks/useServices";
import { usefetchPairPrice, useGetWETHBalance } from "hooks/useServices";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import * as Fi from "react-icons/fi";
import Swal from "sweetalert2";
import { Menu } from "@headlessui/react";

interface ConvertWETHProps {
  close: () => void;
  isOpen: boolean;
}

const CURRENCIES = ["MATIC", "WMATIC"];

export default function ConvertWETH({ close, isOpen }: ConvertWETHProps) {
  const [amountInETH, setAmountInEth] = useState(0);
  const [biddingBalance, setBiddingBalance] = useState(0);
  const [nativeBalance, setNativeBalance] = useState(0);

  const [currencyFrom, setCurrencyFrom] = useState(CURRENCIES[0]); // the currency you are converting from
  const [currencyTo, setCurrencyTo] = useState(CURRENCIES[1]); // the currency you are converting to
  const [amountFrom, setAmountFrom] = useState(0); // the amount you are converting from
  //const [amountTo, setAmountTo] = useState(0); //it is not required for now since we only support Wrapping and un wrapping

  const [fiatValue, setFiatValue] = useState(0);
  const { Moralis } = useMoralis();
  const { data: wrapedBalance } = useGetWETHBalance();
  const {
    loading: getWETHLoading,
    error: getWETHError,
    execute: getWETHExecute,
  } = useGetWETH();

  function updateCurrencyFrom(currency: string) {
    setCurrencyFrom(currency);
  }

  function updateCurrencyTo(currency: string) {
    setCurrencyTo(currency);
  }

  const {
    loading: withdrawETHLoading,
    error: withdrawETHError,
    execute: withrdrawETHExecute,
  } = useWithdrawWETH();

  const { data: priceData } = usefetchPairPrice();

  const { data: nativeBalanceInWEI } = useGetMaticBalance();

  useEffect(() => {
    if (wrapedBalance) {
      setBiddingBalance(parseFloat(parseFloat(wrapedBalance).toFixed(3)));
    }
    if (priceData) {
      setFiatValue(priceData?.["matic-network"]?.usd);
    }
    if (nativeBalanceInWEI) {
      const balance = nativeBalanceInWEI as string;
      // moralis return type is defained as number, actually it's a string.
      // @ts-ignore
      setNativeBalance(parseFloat(parseFloat(balance).toFixed(2)));
    }
  }, [nativeBalanceInWEI, wrapedBalance, priceData]);

  function updateEth(value: number) {
    setAmountInEth(value);
  }

  // if the currencyTo is same as currencyFrom, change it

  useEffect(() => {
    if (currencyTo === currencyFrom) {
      setCurrencyFrom(
        CURRENCIES.filter((currency) => currency !== currencyTo)[0]
      );
    }
  }, [currencyTo]);

  // if the currencyFrom is same as currencyTo, change it
  useEffect(() => {
    if (currencyFrom === currencyTo) {
      setCurrencyTo(
        CURRENCIES.filter((currency) => currency !== currencyFrom)[0]
      );
    }
  }, [currencyFrom]);

  // for error handling
  useEffect(() => {
    if (withdrawETHError || getWETHError) {
      console.error(withdrawETHError || getWETHError);
      Swal.fire("Oops!", withdrawETHError || getWETHError, "error");
    }
  });

  // function updateWEth(value: number) {
  //   setAmountInWEth(value);
  // }

  async function handleClick() {
    if (currencyFrom === "WMATIC" && currencyTo === "MATIC") {
      try {
        await withrdrawETHExecute(Moralis.Units.ETH(amountFrom));
        close();
        Swal.fire("Success", "un-wrapping successfull ", "success");
      } catch (error) {
        close();
        Swal.fire("oops!", "un-wrapping failed ", "error");
        console.error("getting MATIC failed", error);
      }
    } else if (currencyFrom === "MATIC" && currencyTo === "WMATIC") {
      try {
        await getWETHExecute(Moralis.Units.ETH(amountFrom));
        close();
        Swal.fire("Success", "wrapping successfull ", "success");
      } catch (error) {
        close();
        Swal.fire("oops!", "wrapping failed ", "error");
        console.error("getting WMATIC failed", error);
      }
    } else {
      Swal.fire("oops!", "Unknown Conversion", "error");
      console.error("Unknown from and to");
    }
  }

  const youPay = (
    <StyledContainer>
      <div className="input-container">
        <div className="dropdown">
          <Menu>
            {({ open }: { open: boolean }) => (
              <>
                <Menu.Button as={React.Fragment}>
                  <button
                    className={`dropdown__button dropdown__toggle ${
                      open ? "open" : ""
                    }`}
                  >
                    <EthIcon
                      currency={currencyFrom === "MATIC" ? "MATIC" : "WMATIC"}
                    />
                    <div>
                      <span className="dropdown__currency--active">
                        {currencyFrom}
                      </span>
                      <Fi.FiChevronDown />
                    </div>
                  </button>
                </Menu.Button>
                <Menu.Items as={React.Fragment}>
                  <StyledDropdown>
                    {/* <div> */}
                    {CURRENCIES.map((currency) => (
                      <Menu.Item as="li" key={currency}>
                        {({ active }: { active: boolean }) => (
                          <button
                            className={`dropdown__button menu__button ${
                              active ? "active" : undefined
                            }`}
                            onClick={() => updateCurrencyFrom(currency)}
                          >
                            {currencyFrom === currency ? (
                              <Fi.FiCheck />
                            ) : (
                              <svg></svg>
                            )}
                            {currency}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                    {/* </div> */}
                  </StyledDropdown>
                </Menu.Items>
              </>
            )}
          </Menu>
        </div>
        <input
          type="number"
          min={0}
          // max={nativeBalance}
          // value={amountInETH}
          placeholder=""
          value={amountFrom}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setAmountFrom(parseFloat(e.target.value));
          }}
        />
        <span>
          ($
          {(fiatValue * amountFrom).toFixed(6) || 0})
        </span>
      </div>
      <div className="info-bar">
        {amountFrom >
          (currencyFrom === "MATIC"
            ? nativeBalance
            : biddingBalance.toFixed(3)) && (
          <p className="error">invalid input</p>
        )}

        <span>
          <b>{currencyFrom === "MATIC" ? nativeBalance : biddingBalance}</b>{" "}
          {currencyFrom} is available to swap
        </span>
      </div>
    </StyledContainer>
  );
  const youRecieve = (
    <StyledContainer>
      <div className="input-container">
        <div className="dropdown">
          <Menu>
            {({ open }: { open: boolean }) => (
              <>
                <Menu.Button as={React.Fragment}>
                  <button
                    className={`dropdown__button dropdown__toggle ${
                      open ? "open" : ""
                    }`}
                  >
                    <EthIcon
                      currency={currencyTo === "WMATIC" ? "WMATIC" : "MATIC"}
                    />
                    <div>
                      <span className="dropdown__currency--active">
                        {currencyTo}
                      </span>
                      <Fi.FiChevronDown />
                    </div>
                  </button>
                </Menu.Button>
                <Menu.Items as={React.Fragment}>
                  <StyledDropdown>
                    {/* <div> */}
                    {CURRENCIES.map((currency) => (
                      <Menu.Item as="li" key={currency}>
                        {({ active }: { active: boolean }) => (
                          <button
                            className={`dropdown__button menu__button ${
                              active ? "active" : undefined
                            }`}
                            onClick={() => updateCurrencyTo(currency)}
                          >
                            {currencyTo === currency ? (
                              <Fi.FiCheck />
                            ) : (
                              <svg></svg>
                            )}
                            {currency}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                    {/* </div> */}
                  </StyledDropdown>
                </Menu.Items>
              </>
            )}
          </Menu>
        </div>
        <input
          type="number"
          // min={0}
          value={amountFrom}
          placeholder=""
          disabled
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            updateEth(parseFloat(e.target.value));
          }}
        />
        <span>
          ($
          {(fiatValue * amountFrom).toFixed(6) || 0})
        </span>
      </div>
      <div className="info-bar">
        {amountFrom >
          (currencyFrom === "MATIC" ? nativeBalance : biddingBalance) && (
          <p className="error">invalid input</p>
        )}
        {/* <span>
          <b>{currencyTo === "MATIC" ? nativeBalance : biddingBalance}</b>{" "}
          {currencyTo} is available to swap
        </span> */}
      </div>
    </StyledContainer>
  );

  return (
    <Modal
      style={{
        maxHeight: "100vh",
      }}
      header="Convert"
      closeModal={close}
      isOpen={isOpen}
      primaryBtnText="Convert"
      primaryBtnLoading={getWETHLoading || withdrawETHLoading}
      primaryBtnAction={handleClick}
      primaryBtnDisabled={
        amountFrom > (currencyFrom === "MATIC" ? nativeBalance : biddingBalance)
      }
    >
      <StyledDiv $isOpen={isOpen}>
        <div>
          <label htmlFor="eth">
            <span>You Pay</span>
          </label>
          {youPay}
        </div>

        {/* <button> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="19"
          height="26"
          fill="#C4C4C4"
          viewBox="0 0 19 26"
        >
          <g fill="inherit" clipPath="url(#clip0_2467_7872)">
            <path d="M14.021 17.223h4.19a.746.746 0 01.649 1.119l-2.095 3.644-2.095 3.645a.74.74 0 01-1.291 0l-2.095-3.645-2.095-3.644a.75.75 0 01.65-1.12h4.182zM4.944 8.786H.754a.746.746 0 01-.747-.745.75.75 0 01.098-.374L2.2 4.022 4.295.378a.748.748 0 011.291 0l2.095 3.644 2.095 3.645a.75.75 0 01-.65 1.119H4.945z"></path>
            <path d="M4.078 8.43v16.633a.875.875 0 00.873.874.872.872 0 00.873-.874V8.429a.875.875 0 00-.873-.874.872.872 0 00-.873.874zM13.177.945v16.62a.875.875 0 00.873.874.872.872 0 00.872-.875V.944A.875.875 0 0014.05.07a.872.872 0 00-.873.875z"></path>
          </g>
          <defs>
            <clipPath id="clip0_2467_7872">
              <path fill="inherit" d="M0 0H19V26H0z"></path>
            </clipPath>
          </defs>
        </svg>
        {/* </button> */}

        <div>
          <label htmlFor="eth">
            <span>You Receive</span>
          </label>
          {youRecieve}
        </div>
      </StyledDiv>
    </Modal>
  );
}

const StyledContainer = styled.div`
  position: relative;
  .input-container {
    position: relative;
    /* min-width: 100px; */
    width: 100%;
    /* height: 60px; */
    display: grid;
    grid-template-columns: max-content 1fr max-content;
    align-items: flex-start;
    /* gap: 2px; */
    /* outline: 2px solid ${(props) => props.theme.gray4} !important; */
    border-radius: 0.2rem;
    isolation: isolate;

    & > span {
      font-size: 0.85em;
      display: block;
      position: sticky;
      line-height: 56px;
      color: ${(props) => props.theme.gray3};
      border: 2px solid ${(props) => props.theme.gray4};
      border-radius: 0 0.4rem 0.4rem 0;
      border-left: none;
      padding-right: 20px;
    }
  }
  input {
    z-index: 0;
    /* min-width: 100px; */
    height: 60px;
    width: 100%;
    color: ${(props) => props.theme.primary};
    background: transparent;
    padding-left: var(--padding-2);
    border: 2px solid ${(props) => props.theme.gray4};
    border-radius: 0;
    border-left: none;
    border-right: none;
    outline: none;
    overflow: hidden;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &[disabled] {
      cursor: not-allowed;
    }

    /* Firefox */
    & {
      -moz-appearance: textfield;
    }
  }
  & > .info-bar {
    position: absolute;
    top: 60px;
    right: 0;
    display: flex;
    margin-top: 0.5rem;
    max-width: calc(100% - 180px - 20px);
    .error {
      color: red;
    }
    span {
      color: ${(props) => props.theme.gray3};
      display: block;
      width: max-content;
      margin-left: auto;
    }
  }

  .dropdown {
    position: relative;
    height: 100%;
  }
  .dropdown__button {
    outline: none;
    border: none;
    cursor: pointer;
    background: transparent;
  }
  .dropdown__toggle {
    height: 60px;
    width: 200px;
    display: flex;
    flex-direction: row;
    align-items: center;
    border: 2px solid ${(props) => props.theme.gray4};
    border-radius: 0.4rem 0 0 0.4rem;
    /* background:red; */
    padding: 0 20px;
    &.open > :last-child > svg {
      transform: rotate(180deg);
      transition: transform 150ms ease;
    }
    & > :not(:last-child) {
      margin-right: 10px;
    }
    & > :last-child {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    &:focus,
    &:hover {
      & > div {
        border-color: ${(props) => props.theme.green};
      }
    }
  }
  .dropdown__currency--active {
    font-weight: 450;
    margin-right: 10px;
    color: ${(props) => props.theme.primary};
  }
`;

const StyledDiv = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? "flex" : "hidden")};
  flex-direction: column;
  min-width: 450px;
  & > div {
    label {
      color: ${(props) => props.theme.primary};
      display: block;
      margin-bottom: 0.5rem;
      span {
        font-weight: 500;
      }
    }
  }
  & > svg {
    height: 20px;
    width: auto;
    fill: ${(props) => props.theme.gray2};
    margin-right: auto;
    margin: var(--padding-5) auto var(--padding-5) var(--padding-6);
  }
`;

const StyledDropdown = styled.ul`
  /* position: absolute; */
  width: 100%;
  border-radius: 0.2rem;
  overflow: hidden;
  background-color: ${(props) => props.theme.onBackground};
  /* top: 120%; */
  margin-top: var(--padding-3);
  outline: 2px solid ${(props) => props.theme.gray4};

  li {
    list-style: none;
  }
  .menu__button {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    width: 100%;
    text-align: start;
    color: ${(props) => props.theme.primary};
    font-size: var(--fontsizes-1);
    svg {
      margin-right: var(--padding-2);
      stroke: ${(props) => props.theme.green};
      width: 16px;
      height: 16px;
    }
    &.active {
      color: ${(props) => props.theme.green};
    }
    &:hover {
      color: ${(props) => props.theme.green};
    }
  }
`;
