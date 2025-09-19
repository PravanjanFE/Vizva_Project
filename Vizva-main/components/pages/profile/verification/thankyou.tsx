import styled from "@emotion/styled";
import GridHelper from "components/layout/gridHelper";
import Thankyou from "public/thank you.png";
import Image from "next/image";
import Button from "components/button";

export default function ThankYou() {
  return (
    <StyledDiv>
      <GridHelper className="container-grid">
        <div className="image-container">
          <Image src={Thankyou} alt="thankyou" />
        </div>
        <h1>thank you</h1>
        <p>we'll get back to you via the email you provided</p>
        <Button text="explore" href="/discover/artwork" />
      </GridHelper>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  grid-column: 1 / span 4;
  .container-grid {
    height: 100%;
    grid-template-columns: repeat(6, 1fr);
    .image-container {
      display: grid;
      place-items: center;
      grid-column: 3 / span 2;
    }
    h1,
    p {
      grid-column: 3 / span 2;
      text-align: center;
    }
    h1 {
      font-size: 3rem;
      align-self: end;
    }
    p {
      align-self: start;
    }
  }
`;
