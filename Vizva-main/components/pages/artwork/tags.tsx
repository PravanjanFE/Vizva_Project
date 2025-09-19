import styled from "@emotion/styled";
import Link from "next/link";

interface TagsProps {
  tags: string[];
}
export default function Tags(props: TagsProps) {
  const { tags } = props;
  return (
    <StyledTags>
      {tags.map((tag) => (
        <Link href={`/search?q=${tag}`} key={tag}>
          <a>#{tag}</a>
        </Link>
      ))}
    </StyledTags>
  );
}

const StyledTags = styled.div`
  padding: 0 0 0 1px;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  & > :not(:last-child) {
    margin-right: 10px;
  }
  & > a {
    margin-top: 10px;
    font-weight: light;
    padding: 0.7em 1.2em;
    font-size: 0.8em;
    color: ${(props) => props.theme.primary};
    letter-spacing: 1px;
    border: 1px solid ${(props) => props.theme.secondary};
    border-radius: 10px;
    transition: 50ms ease;
    &:hover {
      border-color: ${(props) => props.theme.primary};
      cursor: pointer;
    }
  }
`;
