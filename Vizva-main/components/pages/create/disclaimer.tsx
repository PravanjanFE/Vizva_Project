import styled from "@emotion/styled";
import Toggle from "components/form elements/toggle";
import Link from "next/link";
import { useContext, useState } from "react";
import { useMoralis } from "react-moralis";
import Button from "components/button";
import { CreateNftContext } from "context/createContext";
import { breakpoint } from "public/breakpoint";
import { useAppDispatch } from "redux/hook";
import { addNotification } from "redux/slice/notificationSlice";

export default function Disclaimer() {
  const dispatch = useAppDispatch();
  const [agreedToTerms, setAgreedToTerm] = useState(false);
  const { user } = useMoralis();
  const { incrementStage } = useContext(CreateNftContext);
  const [buttonLoading, setButtonLoading] = useState(false);

  const handleClick = async () => {
    try {
      setButtonLoading(true);
      if (user) {
        user.set("agreedToTerms", agreedToTerms);
        await user.save().then((r: any) => {
          setButtonLoading(false);
          incrementStage();
        });
        // window.location.reload();
      } else throw new Error("user data not available");
    } catch (error: any) {
      dispatch(
        addNotification({
          message: "Something went wrong. Please retry",
          type: "error",
        })
      );
    }
  };
  return (
    <div className="container">
      <StyledDiv>
        <h1>Disclaimer for NFT Minting</h1>
        <div className="terms-container">
          <h3 style={{ textAlign: "center" }}>
            <strong>TERMS AND CONDITIONS.</strong>
          </h3>
          <br />

          <p>
            Boolien Network Technologies LLP (<strong>“Boolien”</strong>,{" "}
            <strong>“We”</strong>, <strong>“Us”</strong>, <strong>“Our”</strong>
            ) provides this Platform for creating entertainment and media on
            blockchain. Boolien has created this marketplace for as a platform
            to enable you (<strong>“you”</strong> or <strong>“the User"</strong>
            ) to access and use{" "}
            <Link href="/">
              <a>www.vizva.io</a>
            </Link>{" "}
            (<strong>“Boolien Website”</strong>) for the providing services
            related to purchase, sale, trade, farming, exchange of Non- fungible
            Tokens (<strong>“NFT”</strong>) subject to the following Terms of
            Service (as amended from time to time, the <strong>“Terms”</strong>
            ).
          </p>

          <p>
            By signing up for an account on this Platform or otherwise using or
            accessing this Platform, you acknowledge that you have read and
            agreed to these Terms.
          </p>
          <br />
          <h3>Terminology:</h3>
          <br />
          <div>
            <ol>
              <li>
                <p>
                  <strong>“Applicable Law”</strong> means any law, rule,
                  statute, regulation, by-law, order, ordinance, protocol, code,
                  guideline, treaty, policy, notice, directive, or other
                  requirement published or in force at any time which applies to
                  or is otherwise intended to govern or regulate any person
                  (including all parties to this Terms), property, transaction,
                  activity, event or other matter, including any rule, order,
                  judgment, directive or other requirement or guideline issued
                  by any governmental or regulatory authority.
                </p>
              </li>
              <li>
                <p>
                  <strong>“Account”</strong> means the User’s account created on
                  the basis of personal data provided by the User and
                  constituting a collection of data stored in the Boolien’s
                  Website and IT system concerning a given User, for the purpose
                  of provided to the User.
                </p>
              </li>
              <li>
                <p>
                  <strong>“Creator”</strong> means the artist who creates the
                  NFT/ digital artwork for the Marketplace.
                </p>
              </li>
              <li>
                <p>
                  <strong>“Crypto Assets”</strong> means a transferable property
                  right which is neither legal tender, electronic money nor a
                  financial instrument. For the purpose of these Terms Crypto
                  Assets shall mean unique non-fungible tokens, implemented on
                  the Polygon bockchain using smart contracts.
                </p>
              </li>
              <li>
                <p>
                  <strong>“Marketplace”</strong> means a platform created by
                  Boolien for Users to showcase their items (e.g. an artwork/ a
                  game / a movie and more as the network evolve) and find
                  potential buyers for their items. It is a place for users to
                  initiate a project or ask developers/ artists/ designers etc.
                  to initiate a project and help them create a user base for
                  their items. Users can be either creators or promoters of the
                  project.
                </p>
              </li>
              <li>
                <p>
                  <strong>“Non- Fungible Tokens / NFT”</strong> means tokens
                  representing a unique digit art or collectible, having a
                  unique identifying code stored on blockchain.
                </p>
              </li>
              <li>
                <p>
                  <strong>“Service”</strong> means the services provided by
                  Boolien to the User through the Marketplace
                </p>
              </li>
            </ol>
          </div>
          <br />
          <h3>THE CREATOR.</h3>
          <br />

          <h4>Creator Rights</h4>
          <br />
          <div>
            <ol>
              <li>
                <p>
                  The Creator owns all legal right, title, and interest in all
                  intellectual property rights underlying the NFT created by
                  him/ her on the Marketplace. As the copyright owner, the
                  Creator has the right to reproduce, prepare derivative Digital
                  Artwork, distribute, and display the NFT.
                </p>
              </li>

              <li>
                <p>
                  The Creators acknowledges, understands, and agrees that
                  selling NFT on the Marketplace constitutes an express
                  representation, warranty, and covenant that the Creator has
                  not and shall not cause any other person to sell, tokenize, or
                  create another cryptographic token representing a digital
                  collectible for the same NFT/ digital artwork, excepting,
                  without limitation, the Creator’s ability to sell, tokenize,
                  or create a cryptographic token or other digital asset
                  representing a legal, economic, or other interest relating to
                  any of the exclusive rights belonging to the Creator under
                  copyright law.
                </p>
              </li>

              <li>
                <p>
                  The Creator acknowledges, understands, and agrees that
                  launching a NFT on the Marketplace constitutes an express and
                  affirmative grant to Boolien, its affiliates and successors, a
                  non-exclusive, world-wide, assignable, sublicensable,
                  perpetual, and royalty-free license to make copies of,
                  display, perform, reproduce, and distribute the NFT on any
                  media whether now known or later discovered for the broad
                  purpose of operating, promoting, sharing, developing,
                  marketing, and advertising the Marketplace, or any other
                  purpose related to Boolien including without limitation, the
                  express right to:
                </p>

                <ol style={{ listStyleType: "lower-alpha" }}>
                  <li>
                    <p>
                      display or perform the NFT/ digital artwork on the
                      marketplace, a third- party platform, social media posts,
                      blogs, editorials, advertising, market reports, virtual
                      galleries, museums, virtual environments, editorials, or
                      to the public;
                    </p>
                  </li>
                  <li>
                    <p>
                      create and distribute digital or physical derivative based
                      on the NFT;
                    </p>
                  </li>
                  <li>
                    <p>
                      indexing the NFT in electronic databases, indexes,
                      catalogues; and
                    </p>
                  </li>
                  <li>
                    <p>
                      hosting, storing, distributing, and reproducing one or
                      more copies of the NFT within a distributed file keeping
                      system, node cluster, or other database (e.g., IPFS) or
                      causing, directing, or soliciting others to do so.
                    </p>
                  </li>
                </ol>
              </li>
              <li>
                <p>
                  The Creator expressly represent and warrant that his/ her NFT/
                  digital artwork listed on the Marketplace contains only
                  original content otherwise authorized for use by the Creator,
                  and does not contain unlicensed or unauthorized copyrighted
                  content, including any imagery, design, audio, video, human
                  likeness, or other unoriginal content not created by the
                  Creator, not authorized for use by the Creator, not in the
                  public domain, or otherwise without a valid claim of fair use,
                  the Creator further represents and warrants that it has
                  permission to incorporate the unoriginal content.
                </p>
              </li>
              <li>
                <p>
                  The Creator acknowledges that Boolien shall have ownership and
                  intellectual property rights over the logo and all designs,
                  text, graphics, pictures, information, data, software, sound
                  files, other files and the selection and arrangement relating
                  to the Marketplace which is the proprietary property of
                  Boolien and its affiliates.
                </p>
              </li>
              <li>
                <p>
                  The Creator grants Boolien the right to use his/ her name and
                  image for marketing or promotional purposes and agree that we
                  may use or modify images from the NFTs that the Creators
                  create for marketing or promotional purposes. The Creator
                  agrees to Boolien using his/ her biography and other public
                  information about to promote the NFTs created by the Creator.
                </p>
              </li>
            </ol>
          </div>
          <br />
          <h4>Creator Conduct</h4>
          <br />
          <div>
            <p>The Creator shall not -</p>
            <ol style={{ listStyleType: "lower-alpha" }}>
              <li>
                <p>
                  Use the Marketplace to carry out any illegal activities,
                  including but not limited to money laundering, terrorist
                  financing or deliberately engaging in activities designed to
                  adversely affect the performance of the marketplace;
                </p>
              </li>
              <li>
                <p>
                  Engage in wash trading or other deceptive or manipulative
                  trading activities;
                </p>
              </li>
              <li>
                <p>Place misleading bids or offers;</p>
              </li>
              <li>
                <p>
                  Spam listings for the purpose of causing a listing to appear
                  at the top of the search results;
                </p>
              </li>
              <li>
                <p>
                  Engage in behaviour with the intention or the effect of
                  artificially increasing view counts, favourites, volume, or
                  other metrics that Boolien might use to sort search results;
                </p>
              </li>
              <li>
                <p>
                  Use the Marketplace to carry out any financial activities
                  subject to registration or licensing, including but not
                  limited to creating, listing, or buying securities,
                  commodities, options, real estate, or debt instruments;
                </p>
              </li>
              <li>
                <p>
                  Use the Marketplace to participate in fundraising for a
                  business, protocol, or platform, including but not limited to
                  creating, listing, or buying assets that are redeemable for
                  financial instruments, assets that give owners rights to
                  participate in an ICO or any securities offering, or assets
                  that entitle owners to financial rewards.
                </p>
              </li>
            </ol>
          </div>
          <br />

          <h4>Registration</h4>
          <br />
          <div>
            <ol>
              <li>
                <p>
                  If you wish to access the Marketplace for buying, selling,
                  exchanging or minting an NFT, you will need to register by
                  opening an User Account. By creating a User Account, you agree
                  to the following -
                </p>
                <ol style={{ listStyleType: "lower-alpha" }}>
                  <li>
                    <p>
                      provide accurate, current and complete Account information
                      about yourself,
                    </p>
                  </li>
                  <li>
                    <p>
                      maintain and promptly update from time to time as
                      necessary your Account information,
                    </p>
                  </li>
                  <li>
                    <p>
                      maintain the security of your password and accept all
                      risks of unauthorized access to your Account and the
                      information you provide to us, and
                    </p>
                  </li>
                  <li>
                    <p>
                      immediately notify us if you discover or otherwise suspect
                      any security breaches related to the Service, or your
                      Account.
                    </p>
                  </li>
                </ol>
              </li>
              <li>
                <p>Each User will be permitted to open only one account.</p>
              </li>
              <li>
                <p>You further agree that you will not -</p>
                <ol style={{ listStyleType: "lower-alpha" }}>
                  <li>
                    <p>
                      create another account if we’ve disabled one you had
                      unless you have our written permission first;
                    </p>
                  </li>
                  <li>
                    <p>
                      buy, sell, rent or lease access to your Account or
                      username unless you have our written permission first;
                    </p>
                  </li>
                  <li>
                    <p>share your Account password with anyone; or</p>
                  </li>
                  <li>
                    <p>
                      log in or try to log in to access the Service through
                      unauthorized third- party applications or clients.
                    </p>
                  </li>
                </ol>
              </li>
              <li>
                <p>
                  Boolien may also require you to provide additional information
                  and documents in the following cases -
                  <ol style={{ listStyleType: "lower-alpha" }}>
                    <li>
                      Your Account is being used for money laundering or for any
                      other illegal activity;
                    </li>
                    <li>
                      You have concealed or reported false identification
                      information and other details; or
                    </li>
                    <li>
                      Transactions effected via your Account were affected in
                      breach of these Terms.
                    </li>
                  </ol>
                </p>
              </li>
              <li>
                <p>
                  Boolien may require you to provide additional information and
                  documents at the request of any competent authority or in case
                  of application of any applicable law or regulation, including
                  laws related to anti-laundering (legalization) of incomes
                  obtained by criminal means, or for counteracting financing of
                  terrorism.
                </p>
              </li>
            </ol>
          </div>

          <br />
          <h4>License to access:</h4>
          <br />
          <div>
            <p>
              You are hereby granted a limited, non- exclusive, non-
              transferable, non- licensable, and personal license to access and
              use the Marketplace.
            </p>
            <br />
            <p>The license does not include any right to –</p>
            <ol style={{ listStyleType: "lower-alpha" }}>
              <li>
                <p>sell, resell or use commercially the Service or Content,</p>
              </li>
              <li>
                <p>
                  distribute, publicly perform or publicly display any Content,
                </p>
              </li>
              <li>
                <p>
                  modify or otherwise make any derivative uses of the Service or
                  Content, or any portion thereof,
                </p>
              </li>
              <li>
                <p>
                  use any data mining, robots or similar data gathering or
                  extraction methods, (e) download (other than page caching) any
                  portion of the Service or Content, except as expressly
                  permitted by us, and
                </p>
              </li>
              <li>
                <p>
                  use the Service or Content other than for their intended
                  purposes.
                </p>
              </li>
            </ol>
          </div>

          <br />
          <h4>KYC Requirements:</h4>
          <br />
          <div>
            <p>
              You are required to submit copies of documents required for KYC as
              provided under the relevant anti - money laundering laws as more
              particularly covered under the Privacy Policy.
            </p>
          </div>

          <br />
          <h4>User Conduct</h4>
          <br />
          <div>
            <p>
              You agree that you will not violate any law, contract,
              intellectual property or other third party right, and that you are
              solely responsible for your conduct, while accessing or using the
              Service or participating in the Auction. You agree that you will
              abide by these Terms and will not:
            </p>
            <ol style={{ listStyleType: "lower-alpha" }}>
              <li>
                <p>Provide false or misleading information to Boolien;</p>
              </li>
              <li>
                <p>
                  Use or attempt to use another User’s Account without
                  authorization from such user and Boolien;
                </p>
              </li>
              <li>
                <p>Create or list counterfeit items;</p>
              </li>
              <li>
                <p>Pose as another person or create a misleading username;</p>
              </li>
              <li>
                <p>
                  Make such use of the Marketplace that would interfere with,
                  disrupt, negatively affect or inhibit other users from making
                  full use of the Marketplace, or that could damage, disable,
                  overburden or impair the functioning of the Marketplace in any
                  manner;
                </p>
              </li>
              <li>
                <p>
                  Develop, utilize, or disseminate any software, or interact
                  with any API in any manner, that could damage, harm, or impair
                  the Marketplace;
                </p>
              </li>
              <li>
                <p>
                  Reverse engineer any aspect of the Marketplace, or do anything
                  that might discover source code or bypass or circumvent
                  measures employed to prevent or limit access to the
                  Marketplace, area or code thereof;
                </p>
              </li>
              <li>
                <p>
                  Attempt to circumvent any content-filtering techniques we
                  employ, or attempt to access any feature or area of the
                  Service that you are not authorized to access;
                </p>
              </li>
              <li>
                <p>
                  Use any robot, spider, crawler, scraper, script, browser
                  extension, offline reader or other automated means or
                  interface not authorized by us to access the Marketplace,
                  extract data or otherwise interfere with or modify the pages
                  or functionality of the Marketplace;
                </p>
              </li>
              <li>
                <p>
                  Use data collected from the Marketplace for any direct
                  marketing activity (including without limitation, email
                  marketing, SMS marketing, telemarketing, and direct
                  marketing);
                </p>
              </li>
              <li>
                <p>
                  Bypass or ignore instructions that control all automated
                  access to the Marketplace;
                </p>
              </li>
              <li>
                <p>
                  Use the Service for any illegal or unauthorized purpose, or
                  engage in, encourage or promote any activity that violates
                  these Terms.
                </p>
              </li>
            </ol>
          </div>

          <br />
          <h4>Termination</h4>
          <br />
          <ol>
            <li>
              <p>
                The User agrees that Boolien has sole discretion, may suspend or
                terminate your Account (or any part thereof) for any reason,
                including, without limitation, if Boolien believes that you have
                violated or acted inconsistently with these Terms. Any suspected
                fraudulent, abusive or illegal activity that may be grounds for
                termination of your Account may be referred to appropriate law
                enforcement authorities.
              </p>
            </li>
            <li>
              <p>
                Boolien may in its sole discretion and at any time discontinue
                providing the Marketplace, or any part thereof, with or without
                notice.
              </p>
            </li>
            <li>
              <p>
                You agree that any termination of your access to the Marketplace
                under any provision of these Terms may be effected without prior
                notice, and acknowledge and agree that Boolien may immediately
                deactivate or delete your Account and all related information
                and files in your Account and/or bar any further access to such
                files or the marketplace.
              </p>
            </li>
            <li>
              <p>
                Further, you agree that Boolien will not be liable to you or any
                third party for any termination of your access to the
                Marketplace.
              </p>
            </li>
          </ol>

          <br />
          <h3>Fees</h3>
          <br />
          <div>
            <p>A fees of 2.5% on each transaction is what vizva takes.</p>
          </div>

          <br />
          <h3>General Terms</h3>
          <br />
          <h4>Grievance</h4>
          <br />
          <div>
            <p>
              In the event the Creator or the User has any grievance he / she
              should make a formal complaint at{" "}
              <a href="mailto:info@vizva.io">info@vizva.io</a>
            </p>
          </div>

          <br />
          <h4>Indemnity and Release:</h4>
          <br />

          <div>
            <ol style={{ listStyleType: "lower-alpha" }}>
              <li>
                <p>
                  The Creator and the User agree to release, indemnify and hold
                  Boolien and its affiliates and their officers, employees,
                  directors and agents (collectively, “Indemnitees”) harmless
                  from any from any and all losses, damages, expenses, including
                  reasonable attorneys’ fees, rights, claims, actions of any
                  kind and injury (including death) arising out of or relating
                  to your use of the marketplace, any User Content, your
                  connection to the Marketplace, your violation of these Terms
                  or your violation of any rights of another.
                </p>
              </li>
              <li>
                <p>
                  Notwithstanding the foregoing, the Creator and the User will
                  have no obligation to indemnify or hold harmless any
                  Indemnitee from or against any liability, losses, damages or
                  expenses incurred as a result of any action or inaction of
                  such Indemnitee.
                </p>
              </li>
            </ol>
          </div>

          <br />
          <h4>Disclaimer of Warranties:</h4>
          <br />

          <div>
            <ol>
              <li>
                <p>
                  Marketplace transactions, including but not limited to primary
                  sales, secondary market sales, listings, offers, bids,
                  acceptances, and other operations utilize experimental smart
                  contract and blockchain technology, including non-fungible
                  tokens, cryptocurrencies, consensus algorithms, and
                  decentralized or peer-to- peer networks and systems.
                </p>
              </li>
              <li>
                <p>
                  Users acknowledge and agree that such technologies are
                  experimental, speculative, and inherently risky and may be
                  subject to bugs, malfunctions, timing errors, hacking and
                  theft, or changes to the protocol rules of the Polygon
                  blockchain (i.e., "forks"), which can adversely affect the
                  smart contracts and may expose you to a risk of total loss,
                  forfeiture of your digital currency or digital artwork, or
                  lost opportunities to buy or sell digital artwork.
                </p>
              </li>
            </ol>
            <br />

            <p>
              THE CREATOR’S AND USER’S USE OF THE MARKETPLACE IS AT HIS/HER SOLE
              RISK. THE PLATFORM IS PROVIDED ON AN “AS IS” AND “AS AVAILABLE”
              BASIS. BOOLIEN EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND,
              WHETHER EXPRESS, IMPLIED OR STATUTORY, INCLUDING, BUT NOT LIMITED
              TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
              PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT.
            </p>
            <br />
            <p>
              BOOLIEN WILL NOT BE RESPONSIBLE OR LIABLE TO YOU FOR ANY LOSS AND
              TAKE NO RESPONSIBILITY FOR, AND WILL NOT BE LIABLE TO YOU FOR, ANY
              USE OF CRYPTO ASSETS, INCLUDING BUT NOT LIMITED TO ANY LOSSES,
              DAMAGES OR CLAIMS ARISING FROM: (A) USER ERROR SUCH AS FORGOTTEN
              PASSWORDS, INCORRECTLY CONSTRUCTED TRANSACTIONS, OR MISTYPED
              ADDRESSES; (B) SERVER FAILURE OR DATA LOSS; (C) CORRUPTED WALLET
              FILES; (D) UNAUTHORIZED ACCESS TO APPLICATIONS; (E) ANY
              UNAUTHORIZED THIRD PARTY ACTIVITIES, INCLUDING WITHOUT LIMITATION
              THE USE OF VIRUSES, PHISHING, BRUTEFORCING OR OTHER MEANS OF
              ATTACK AGAINST THE SERVICE OR CRYPTO ASSETS.
            </p>
            <br />
            <p>
              CRYPTO ASSETS ARE INTANGIBLE DIGITAL ASSETS. THEY EXIST ONLY BY
              VIRTUE OF THE OWNERSHIP RECORD MAINTAINED IN THE ETHEREUM NETWORK.
              ANY TRANSFER OF TITLE THAT MIGHT OCCUR IN ANY UNIQUE DIGITAL ASSET
              OCCURS ON THE DECENTRALIZED LEDGER WITHIN THE ETHEREUM PLATFORM.
              WE DO NOT GUARANTEE THAT OPENSEA OR ANY OPENSEA PARTY CAN EFFECT
              THE TRANSFER OF TITLE OR RIGHT IN ANY CRYPTO ASSETS.
            </p>
            <br />
            <p>Boolien makes no warranty that -</p>
            <ol style={{ listStyleType: "lower-alpha" }}>
              <li>
                <p>the platform will meet your requirements,</p>
              </li>
              <li>
                <p>
                  the platform will be uninterrupted, timely, secure, or
                  error-free,
                </p>
              </li>
              <li>
                <p>
                  the results that may be obtained from the use of the platform
                  will be accurate or reliable, or
                </p>
              </li>
              <li>
                <p>
                  the quality of any products, platforms, information, or other
                  material purchased or obtained by you through the platform
                  will meet your expectations.
                </p>
              </li>
            </ol>
          </div>
          <br />

          <h3>Limitation of Liability:</h3>
          <br />
          <div>
            <p>
              The Creator and the User expressly understand and agree that
              Boolien will not be liable for any indirect, incidental, special,
              consequential, exemplary damages, or damages for loss of profits
              including but not limited to, loss in value of any digital
              artwork, damages for loss of goodwill, use, data or other
              intangible losses (even if foundation has been advised of the
              possibility of such damages), whether based on contract, tort,
              negligence, strict liability or otherwise, resulting from:
            </p>
            <ol style={{ listStyleType: "lower-alpha" }}>
              <li>
                <p>the use or the inability to use the platform;</p>
              </li>
              <li>
                <p>
                  the cost of procurement of substitute goods and platforms
                  resulting from any digital artwork, goods, data, information
                  or platforms purchased or obtained or messages received or
                  transactions entered into through or from the platform;
                </p>
              </li>
              <li>
                <p>
                  unauthorized access to or alteration of your transmissions or
                  data;
                </p>
              </li>
              <li>
                <p>
                  statements or conduct of any third party on the platform; or
                  (v) any other matter relating to the platform. In no event
                  will foundation’s total liability to you for all damages,
                  losses or causes of action exceed the amount you have paid
                  Boolien.
                </p>
              </li>
            </ol>
            <p>
              SOME JURISDICTIONS DO NOT ALLOW THE DISCLAIMER OR EXCLUSION OF
              CERTAIN WARRANTIES OR THE LIMITATION OR EXCLUSION OF LIABILITY FOR
              INCIDENTAL OR CONSEQUENTIAL DAMAGES. ACCORDINGLY, SOME OF THE
              ABOVE LIMITATIONS SET FORTH ABOVE MAY NOT APPLY TO YOU OR BE
              ENFORCEABLE WITH RESPECT TO YOU. IF YOU ARE DISSATISFIED WITH ANY
              PORTION OF THE PLATFORM OR WITH THESE TERMS OF PLATFORM, YOUR SOLE
              AND EXCLUSIVE REMEDY IS TO DISCONTINUE USE OF THE PLATFORM.
            </p>
          </div>
          <br />
          <p>
            In the event any part of these Terms is held invalid or
            unenforceable, then that part will be severable from these Terms and
            will not affect the validity or enforceability of any remaining part
            of that term, clause or provision, or any other term, clause or
            provision of these Terms.
          </p>

          <p>
            These Terms constitute the entire understanding between you and
            Boolien relating to your access to and use of the Marketplace. These
            Terms, and any rights and licenses granted hereunder, may not be
            transferred or assigned by you without the prior written consent of
            Boolien’s prior, concurrent or subsequent circumstance, and
            Boolien’s failure to assert any right or provision under these Terms
            shall not constitute a waiver of such right or provision. Except as
            otherwise provided herein, these Terms is intended solely for the
            benefit of the Creator and the User and are not intended to confer
            third party beneficiary rights upon any other person or entity.
          </p>
        </div>
        <p>
          To get set up minting for the first time, you must one-time agree to
          the terms.
        </p>
        <StyledRow>
          <Toggle state={agreedToTerms} setState={setAgreedToTerm} />
          <span>
            I have read and agreed to the{" "}
            <Link href="https://drive.google.com/file/d/1Vq0dZZreX5hFd8Q982PpEW7UJJE-8RO4/view?usp=sharing">
              <a>terms and conditions</a>
            </Link>
          </span>
        </StyledRow>
        <div className="button-row">
          <Button variant="outline" text="Cancel" href="/" block />
          <Button
            text="Agree"
            loading={buttonLoading}
            disabled={!agreedToTerms}
            onClick={() => handleClick()}
            block
          />
        </div>
      </StyledDiv>
    </div>
  );
}

const StyledRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: var(--padding-1);

  span {
    padding-left: var(--padding-5);
  }

  a {
    color: ${(props) => props.theme.green};
  }
`;
const StyledDiv = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: var(--padding-7) 0;
  position: relative;
  h1 {
    /* font-size: var(--fontsizes-7); */
    text-align: center;
    padding-bottom: var(--padding-6);
  }

  div.terms-container {
    height: calc(90vh - 100px);
    overflow-y: auto;
    border: 1px solid ${(props) => props.theme.gray3};
    border-radius: 5px;
    padding: var(--padding-5) var(--padding-8) var(--padding-5) var(--padding-8);

    & > :not(:last-of-type) {
      /* margin-bottom: 20px; */
    }

    h3,
    h4 {
      font-weight: 600;
    }

    h4 {
      font-size: inherit !important;
      font-style: italic;
    }

    p {
      color: ${(props) => props.theme.primary};
      line-height: 1.6rem;
      font-size: 16px !important;
    }

    ol {
      /* padding: var(--padding-5) 0 0 0; */

      ol {
        padding-left: var(--padding-9);
      }
    }

    li {
      &:not(:last-of-type) {
        padding-bottom: var(--padding-5);
      }
      font-size: inherit !important;
    }
  }

  & > p {
    margin: 30px 0 20px 0;
    color: ${(props) => props.theme.gray2};
  }

  .button-row {
    margin: 20px auto 0 auto;
    display: grid;
    align-items: center;
    justify-content: center;
    grid-gap: 20px;
    max-width: 400px;
    grid-template-columns: 1fr 1fr;
  }
  ${breakpoint("3xl")} {
    div.terms-container {
      padding: var(--padding-8) 0 var(--padding-8) var(--padding-8);
      /* p {
        font-size: var(--fontsizes-3);
        line-height: 1.9rem;
      } */
    }
  }
`;
