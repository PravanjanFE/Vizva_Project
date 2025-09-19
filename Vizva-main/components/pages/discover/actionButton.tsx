import styled from "@emotion/styled";

interface ActionProps {
  className?: string;
  icon: JSX.Element;
  onClick?: () => void;
  text?: string;
  variant?: string;
}

export default function ActionIcon(props: ActionProps) {
  const { className, icon, onClick, text, variant } = props;
  const Icon = icon;
  return (
    <StyledIcon
      onClick={onClick}
      className={className}
      $text={text}
      $variant={variant}
    >
      {Icon}
      {text && <p>{text}</p>}
    </StyledIcon>
  );
}

const StyledIcon = styled.div<{ $text?: string; $variant?: string }>`
  border: 1px solid ${(props) => props.theme.gray2};
  border-radius: ${(props) => (props.$text ? "100px" : "100%")};
  padding: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.$text ? "space-evenly" : "center")};
  flex-direction: column;
  width: 3rem;
  height: ${(props) => (props.$text ? "4rem" : "3rem")};
  svg {
    width: 1rem;
    height: 1rem;
    max-width: 1rem;
    max-height: 1rem;
    stroke: ${(props) =>
      props.theme.mode == "dark" ? props.theme.gray4 : props.theme.gray1};
  }

  p {
    color: ${(props) => props.theme.gray2};
    font-size: 0.9rem;
    line-height: 1em;
    margin-top: 0.5rem;
  }

  &:hover {
    svg {
      fill: ${(props) =>
        props.$variant == "no-fill" ? "" : props.theme.green};
      stroke: ${(props) => props.theme.green};
    }
    span {
      color: ${(props) => props.theme.green};
    }
    cursor: pointer;
  }
`;
