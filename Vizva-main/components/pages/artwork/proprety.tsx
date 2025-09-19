import styled from "@emotion/styled";

interface PropertyProps {
  trait_type: string;
  type: string;
  value: string;
}


export default function Property(props: PropertyProps) {
  const { trait_type, type, value } = props;
  return (
    <StyledProperty>
      <h6>{trait_type}</h6>
      <p>{value}</p>
      <span>new trait</span>
    </StyledProperty>
  );
}

const StyledProperty = styled.div`
  width: 150px;
  border: 0.5px solid ${(props) => props.theme.gray3};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  padding: 1rem;
  /* background-color: white; */
  z-index: 1;
  margin-bottom: 1rem;
  background-color: ${(props) => props.theme.onBackground};

  h6,
  p,
  span {
    color: ${(props) => props.theme.primary};
    letter-spacing: 0.5px;
  }

  h6 {
    font-weight: 500;
  }

  p {
    font-weight: 700;
  }

  span {
    color: ${(props) => props.theme.gray3};
    font-weight: 400;
    font-size: 0.85rem;
  }
`;
