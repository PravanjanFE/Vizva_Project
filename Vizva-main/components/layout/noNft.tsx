import styled from "@emotion/styled";
import Button from "components/button";

interface NoDataProps {
  heading?: string;
  message: string;
  href?: string;
  onClick?: () => void;
  text: string;
  image?: string;
}

export default function NoData(props: NoDataProps) {
  const { message, href, onClick, text, heading } = props;
  return (
    <StyledNoData>
      {/* <Image src={oops} width="80" height="80" /> */}
      <h3>{heading ?? "Oops"}</h3>
      <p>{message}</p>
      {(href || onClick) && (
        <Button variant="outline" text={text} href={href} onClick={onClick} size="sm" />
      )}
    </StyledNoData>
  );
}

const StyledNoData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${(props) => props.theme.onBackground};
  padding: 20px;
  border-radius: 30px;
  max-width: 400px;
  margin: 0 auto;
  /* border: 1px solid ${(props) => props.theme.gray4}; */
  h3 {
    text-transform: capitalize;
    text-align: center;
    margin: 10px 0;
    color: ${(props) => props.theme.primary};
    font-size: var(--fontsizes-6);
  }
  p {
    text-align: center;
    color: ${(props) => props.theme.gray2};
    margin-bottom: 20px;
  }
`;
