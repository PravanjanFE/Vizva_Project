import { Menu } from "@headlessui/react";
import styled from "@emotion/styled";
import { breakpoint } from "public/breakpoint";
import React, { Fragment } from "react";
/**
 * @param {Object} props
 * @param {string} [props.className]
 * @param {JSX.Element} props.children
 * @param {string} props.text
 * @param {boolean} [props.active=false]
 *  */

interface DropdownProps {
  children: JSX.Element;
  text: string;
  className?: string;
  active: boolean;
}
export default function DropDown({
  children,
  text,
  className,
  active = false,
}: DropdownProps) {
  return (
    <Menu as={Fragment}>
      <StyledMenu
        className={`${active ? active : ""} ${className}`}
        // $active={active}
      >
        <Menu.Button>{text}</Menu.Button>
        {/* @ts-ignore */}
        <Menu.Items as={Fragment}>
          <StyledList className="dropdown-container">{children}</StyledList>
        </Menu.Items>
      </StyledMenu>
    </Menu>
  );
}

/**
 * @param {Object} props
 * @param {string} [props.className]
 * @param {JSX.Element} props.children
 * @param {boolean} [props.active=false]
 *  */
interface DropdownItem {
  children: JSX.Element;
  className?: string;
  active: boolean;
}
export const DropdownItem = ({
  children,
  className,
  active: isActive,
}: DropdownItem) => {
  return (
    <Menu.Item as={React.Fragment}>
      {({ active }: { active: boolean }) => {
        return (
          <StyledListItem className={className} $active={active || isActive}>
            {children}
          </StyledListItem>
        );
      }}
    </Menu.Item>
  );
};

interface DropdownHeader {
  className?: string;
  text: string;
}

export const DropdownHeader = ({ text, className }: DropdownHeader) => {
  return (
    <Menu.Item as={Fragment}>
      <StyledHeading
        className={`dropdown-header ${className ? className : ""}`}
      >
        {text}
      </StyledHeading>
    </Menu.Item>
  );
};

const StyledListItem = styled.li<{ $active: boolean }>`
  a {
    text-align: start !important;
    display: inline-block;
    width: 100%;
    padding: var(--padding-4);
    color: ${(props) =>
      props.$active ? props.theme.green : props.theme.primary} !important;
    /* font-size: var(--fontsizes-5); */
  }

  &:hover,
  &:focus {
    a {
      color: ${(props) => props.theme.green} !important;
      svg {
        stroke: ${(props) =>
          props.theme.mode == "dark" ? props.theme.gray4 : props.theme.gray900};
      }
    }
  }
`;

const StyledList = styled.ul`
  list-style: none;
  width: max-content;
  min-width: 100%;
  background-color: ${(props) => props.theme.onBackground};
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 150%;
  right: -50%;
  padding: 1rem;
  border-radius: 5px;
  border: none;
  outline: none;
  align-items: stretch;
  justify-content: cener;
  z-index: 11;
  border: 0.1px solid ${(props) => props.theme.gray4};
  /* transform: translateX(50%); */
  /* box-shadow: ${(props) => props.theme.onBackground}; */
`;

const StyledHeading = styled.div`
  text-transform: capitalize;
  color: ${(props) => props.theme.gray2};
  padding: 0 1rem 5px 1rem;
  font-size: var(--fontsizes-2);
`;

const StyledMenu = styled.div`
  position: relative;

  /* profile header */
  button {
    cursor: pointer;
    background: none;
    border: none;
    outline: none;
    text-transform: capitalize;
    margin: 0 !important;
    text-align: center;
    color: ${(props) => props.theme.primary};
    font-size: var(--fontsizes-2);
    font-weight: 500;

    &.active {
      color: ${(props) => props.theme.gray2};
    }

    &:hover,
    &:focus {
      color: ${(props) => props.theme.green} !important;
      border-radius: 5px;
    }
  }
  ${breakpoint("3xl")} {
  }
`;
