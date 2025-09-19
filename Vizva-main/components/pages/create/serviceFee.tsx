import styled from "@emotion/styled";
import useFiat from "hooks/useFiatValue";

export default function ServiceFee({ fee }: { fee: number }) {
  const amountReceived = fee - 0.025 * fee;
  const { fiat } = useFiat(amountReceived);
  return (
    <StyledMetaInformation>
      <p>
        Service fee: <b>2.5%</b>
      </p>
      <p>
        You Receive: <b>{parseFloat(amountReceived.toPrecision(3))} MATIC</b> $
        {fiat}
      </p>
    </StyledMetaInformation>
  );
}

const StyledMetaInformation = styled.div`
  background-color: ${(props) =>
    props.theme.mode === "dark"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)"};
  width: max-content;
  padding: var(--padding-4);
  border-radius: 5px;
  margin-top: var(--padding-5);

  p {
    line-height: 1.4em;
  }
`;
