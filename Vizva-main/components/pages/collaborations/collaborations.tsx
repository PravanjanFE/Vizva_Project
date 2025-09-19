import styled from "@emotion/styled";
import GridHelper from "components/layout/gridHelper";

export default function Collaborations() {
  return (
    <StyledDiv className="scrollbar">
      <GridHelper className="grid-content">
        {/* user profiles gi here */}
      </GridHelper>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  height: 100%;
  max-height: calc(100vh - 74px - 4rem - 41px - 20px);
  grid-column: 1 / span 4;
  overflow-y: scroll;
  padding-bottom: 3rem;
`;
