import styled from "@emotion/styled";
import { Disclosure } from "@headlessui/react";
import MaxWidth from "components/layout/maxWidth";
import Navbar from "components/navigation/navbar";
import Footer from "components/pages/home/footer";
import Head from "next/head";
import Link from "next/link";
import React, { Fragment } from "react";
import { FiChevronDown } from "react-icons/fi";

const GENERAL = [
  {
    heading: "What is an NFT?",
    description:
      "A Non Fungible Token (NFT) is very similar to cryptocurrency like Bitcoin, Ethereum having the underlying cryptographic properties with one distinct difference, not all tokens are of the same value. Each single NFT can hold different values, represent different properties of exchange and even can have unique properties like divisibility and ownership rights.",
  },
  {
    heading: "What is an NFT marketplace?",
    description:
      "An NFT marketplace is similar to an e-commerce marketplace, the only difference here is that you can trade various digital assets as NFTs.",
  },
];
const ABOUT_VIZVA = [
  {
    heading: "How to create my account in Vizva?",
    description:
      "You have to connect your wallet in order to make your account on Vizva.Your account automatically gets created and on the platform You can access your profile by clicking on top right corner of your screen",
  },
];

export default function FaQ() {
  return (
    <>
      <Head>
        <title>FAQ</title>
      </Head>
      <Navbar />
      <MaxWidth>
        <StyledContent>
          <StyledDiv>
            <h1>Frequently Asked Questions</h1>
            <GeneralVizva />
            <AboutVizva />
          </StyledDiv>
        </StyledContent>
      </MaxWidth>
      <Footer />
    </>
  );
}

function GeneralVizva() {
  return (
    <>
      <h2>General</h2>
      {GENERAL.map((faq) => (
        <AccordionItem data={faq} key={`general-${faq.heading}`} />
      ))}
      <Disclosure as={Fragment}>
        {({ open }) => (
          <>
            <StyledAccordion>
              <Disclosure.Button as={React.Fragment}>
                <StyledButton className={open ? "open" : undefined}>
                  <p>What is a wallet? Why do I need one?</p>
                  <FiChevronDown />
                </StyledButton>
              </Disclosure.Button>
              <Disclosure.Panel as={React.Fragment}>
                <StyledPanel className={open ? "open" : undefined}>
                  <p>
                    Your physical wallet probably contains your money, a form of
                    ID, and maybe pictures of your loved ones.
                  </p>
                  <p>
                    Your crypto wallet does that on a blockchain. It has an
                    Address - a long string of numbers and letters, where your
                    cryptocurrencies and any NFTs you bought with those
                    cryptocurrencies will be stored.
                  </p>
                  <p>
                    When you create a crypto wallet, you get a “seed phrase” — a
                    series of words which let you recover your currencies or
                    NFTs if you lose access.
                  </p>
                  <p>
                    <strong>NEVER GIVE THIS PHRASE TO ANYONE</strong>. Anyone
                    who knows your seed phrase has full access to your wallet
                    and can buy, sell or transfer any funds or assets. Neither
                    any organisation support nor any trustworthy individual will
                    ever ask for your seed phrase.
                  </p>
                  <p>
                    To transact with cryptocurrencies or NFTs on Vizva, you need
                    to connect your wallet to log in.
                  </p>
                  <Link href="connectwallet">
                    <a>connect wallet</a>
                  </Link>
                </StyledPanel>
              </Disclosure.Panel>
            </StyledAccordion>
          </>
        )}
      </Disclosure>
    </>
  );
}

function AboutVizva() {
  return (
    <>
      <h2>About Vizva</h2>
      {ABOUT_VIZVA.map((faq) => (
        <AccordionItem data={faq} key={faq.heading} />
      ))}
      <Disclosure as={Fragment}>
        {({ open }) => (
          <>
            <StyledAccordion>
              <Disclosure.Button as={React.Fragment}>
                <StyledButton className={open ? "open" : undefined}>
                  <p>How do I create my NFT?</p>
                  <FiChevronDown />
                </StyledButton>
              </Disclosure.Button>
              <Disclosure.Panel as={React.Fragment}>
                <StyledPanel className={open ? "open" : undefined}>
                  <p>You can create in two ways free minting and Create.</p>
                  <p>
                    In Free minting, the creators don't have to pay a gas fee
                    upfront for minting their NFTs. In contrast, the gas fee is
                    paid and minted after an NFT work is purchased and
                    transferred 'on-chain
                  </p>
                  <ul>
                    {[
                      "Go to create from the home page of Vizva",
                      "Select free minting",
                      "Upload NFT",
                      "Give information related to your NFT",
                      "Give Pricing Details",
                      "Create voucher of your NFT off chain",
                      "You UPLOADED  your NFT on Vizva for Sale",
                    ].map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p>
                    In the create option, you mint your NFT by yourself. Your
                    NFT will be minted on-chain automatically and gas fees will
                    be deducted from your wallet.
                  </p>
                  <ul>
                    {[
                      "Go to create from the home page of Vizva",
                      "Select Create",
                      "Upload NFT",
                      "Give information related to your NFT",
                      "Select auction or instant Sale- Pricing details",
                      "Pay gas fees",
                      "You UPLOADED your NFT on Vizva",
                    ].map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </StyledPanel>
              </Disclosure.Panel>
            </StyledAccordion>
          </>
        )}
      </Disclosure>
      <Disclosure as={Fragment}>
        {({ open }) => (
          <StyledAccordion>
            <>
              <Disclosure.Button as={React.Fragment}>
                <StyledButton className={open ? "open" : undefined}>
                  <p>What is free minting?</p>
                  <FiChevronDown />
                </StyledButton>
              </Disclosure.Button>
              <Disclosure.Panel as={React.Fragment}>
                <StyledPanel className={open ? "open" : undefined}>
                  <p>
                    <em>- Free minting is also called lazy minting </em>
                  </p>
                  <p>
                    It aims to improve the platform's sustainability by
                    eliminating the need for an Ethereum blockchain and
                    unnecessary transactions. Hence,{" "}
                    <strong>
                      there is no upfront cost required to monetize your
                      creation.
                    </strong>
                  </p>
                  <p>
                    Your NFT will be minted on chain after your nft get
                    purchased and gas fees will be deducted
                  </p>
                </StyledPanel>
              </Disclosure.Panel>
            </>
          </StyledAccordion>
        )}
      </Disclosure>
      <Disclosure as={Fragment}>
        {({ open }) => (
          <>
            <StyledAccordion>
              <Disclosure.Button as={React.Fragment}>
                <StyledButton className={open ? "open" : undefined}>
                  <p>What is Royalties and how does it work?</p>
                  <FiChevronDown />
                </StyledButton>
              </Disclosure.Button>
              <Disclosure.Panel as={React.Fragment}>
                <StyledPanel className={open ? "open" : undefined}>
                  <p>
                    Royalties are typically agreed upon as a percentage of gross
                    or net revenues derived from a fixed price sold of an NFT.
                    The royalty percentage fixed by a creator will always get
                    that percentage on every sale of an NFT from their sellers
                  </p>
                </StyledPanel>
              </Disclosure.Panel>
            </StyledAccordion>
          </>
        )}
      </Disclosure>
      <Disclosure as={Fragment}>
        {({ open }) => (
          <>
            <StyledAccordion>
              <Disclosure.Button as={React.Fragment}>
                <StyledButton className={open ? "open" : undefined}>
                  <p>What is Property, Level and Stats?</p>
                  <FiChevronDown />
                </StyledButton>
              </Disclosure.Button>
              <Disclosure.Panel as={React.Fragment}>
                <StyledPanel className={open ? "open" : undefined}>
                  <p>
                    If you plan to make five versions of the same piece of work
                    and want potential buyers to know the supply or If you’re
                    keen to make more than one copy of the same item (token ID)
                  </p>
                  <p>- add the edition number in the stats section</p>
                  <p>
                    - Properties and levels make it easier for buyers to filter
                    your work when exploring your collection, so add them where
                    relevant.
                  </p>
                  <p>
                    These fields are all case-sensitive, so be careful with
                    spelling if you’re trying to add the same attribute to
                    multiple NFTs.
                  </p>
                </StyledPanel>
              </Disclosure.Panel>
            </StyledAccordion>
          </>
        )}
      </Disclosure>
      <Disclosure as={Fragment}>
        {({ open }) => (
          <>
            <StyledAccordion>
              <Disclosure.Button as={React.Fragment}>
                <StyledButton className={open ? "open" : undefined}>
                  <p>What is put on auction and Instant sale?</p>
                  <FiChevronDown />
                </StyledButton>
              </Disclosure.Button>
              <Disclosure.Panel as={React.Fragment}>
                <StyledPanel className={open ? "open" : undefined}>
                  <p>
                    An auction sale is a public sale. Where Creator is allowing
                    others to bid price on their artwork. Sale of the auction
                    NFT happens with the highest bidder.
                  </p>
                  <p>
                    Instant sale is direct sale where creators are quoting a fix
                    price of that NFT and allowing others to buy NFT on that
                    Fixed price.
                  </p>
                </StyledPanel>
              </Disclosure.Panel>
            </StyledAccordion>
          </>
        )}
      </Disclosure>
      <Disclosure as={Fragment}>
        {({ open }) => (
          <>
            <StyledAccordion>
              <Disclosure.Button as={React.Fragment}>
                <StyledButton className={open ? "open" : undefined}>
                  <p>
                    What is verification and how does that help me on Vizva?
                  </p>
                  <FiChevronDown />
                </StyledButton>
              </Disclosure.Button>
              <Disclosure.Panel as={React.Fragment}>
                <StyledPanel className={open ? "open" : undefined}>
                  <p>
                    Verification helps you to get more visibility and gain trust
                    from vizva users.This will help you to become a verified
                    trustworthy users of Vizva platform.
                  </p>
                  <p>
                    After verification you will see verification tickmark on
                    your profile
                  </p>
                </StyledPanel>
              </Disclosure.Panel>
            </StyledAccordion>
          </>
        )}
      </Disclosure>
      <Disclosure as={Fragment}>
        {({ open }) => (
          <>
            <StyledAccordion>
              <Disclosure.Button as={React.Fragment}>
                <StyledButton className={open ? "open" : undefined}>
                  <p>What is burning a token/ NFT?</p>
                  <FiChevronDown />
                </StyledButton>
              </Disclosure.Button>
              <Disclosure.Panel as={React.Fragment}>
                <StyledPanel className={open ? "open" : undefined}>
                  <p>
                    Burning token is same as burning your NFT or removing your
                    NFT from the platform
                  </p>
                  <p>
                    Permanently removing an NFT from circulation. This is
                    typically done by transferring NFT containing the tokens to
                    a burn address, i.e. a wallet from which they cannot ever be
                    retrieved. This is often described as destroying the NFT.
                  </p>
                </StyledPanel>
              </Disclosure.Panel>
            </StyledAccordion>
          </>
        )}
      </Disclosure>
    </>
  );
}

interface AccordionItemProps {
  data: {
    heading: string;
    description: string;
  };
}
function AccordionItem(props: AccordionItemProps) {
  const { heading, description } = props.data;
  return (
    <Disclosure as={Fragment}>
      {({ open }) => (
        <>
          <StyledAccordion as="div">
            <Disclosure.Button as={React.Fragment}>
              <StyledButton className={open ? "open" : undefined}>
                <p>{heading}</p>
                <FiChevronDown />
              </StyledButton>
            </Disclosure.Button>
            <Disclosure.Panel as={React.Fragment}>
              <StyledPanel className={open ? "open" : undefined}>
                <p>{description}</p>
              </StyledPanel>
            </Disclosure.Panel>
          </StyledAccordion>
        </>
      )}
    </Disclosure>
  );
}
const StyledContent = styled.div`
  padding: var(--padding-1) var(--padding-sm);
`;
const StyledDiv = styled.div`
  h1 {
    text-align: center;
    font-size: var(--fontsizes-7);
    font-weight: 400;
    line-height: 1.5em;
    padding: var(--padding-6) 0;
  }
  h2 {
    font-size: var(--fontsizes-7);
    padding: 4rem 0 2rem;
    text-align: center;
    color: ${(props) => props.theme.gray1};
  }
`;

const StyledAccordion = styled.div`
  max-width: 700px;
  margin: 0 auto;
`;
const StyledButton = styled.button`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr max-content;
  justify-content: space-between;
  align-items: center;
  background: transparent;
  color: ${(props) => props.theme.primary};
  border: none;
  border-bottom: 1px solid ${(props) => props.theme.primary};
  padding: 1rem;
  cursor: pointer;
  p {
    font-size: var(--fontsizes-2);
    font-weight: 400;
    letter-spacing: 0.05em;
    line-height: 1.5em;
    text-align: start;
  }
  svg {
    margin-left: 1rem;
    width: 20px;
    height: 20px;
    transform: rotate(0);
    transition: 150ms linear;
  }

  &.open {
    border-bottom: none;
    svg {
      transform: rotate(180deg);
    }
  }
  &:hover {
    background-color: ${(props) => props.theme.gray4};
  }
`;
const StyledPanel = styled.div`
  padding: 0 0 2rem 1rem;
  border-bottom: 1px solid ${(props) => props.theme.primary};
  font-weight: ${(props) => (props.theme.mode === "light" ? "300" : "200")};
  line-height: 1.8em;

  p {
    color: ${(props) => props.theme.gray2};
    &:not(:last-child) {
      margin-bottom: 1.3rem;
    }
  }

  a {
    color: ${(props) => props.theme.green};
    border-bottom: 1px dotted ${(props) => props.theme.green};
  }

  ul {
    color: inherit;
    list-style-type: decimal;
    padding: 0 3rem;
    margin-bottom: 1.3rem;

    li {
      color: ${(props) => props.theme.gray2};
      /* line-height: 1.8em; */
    }
  }

  &.open {
    border-bottom: none;
  }
`;
