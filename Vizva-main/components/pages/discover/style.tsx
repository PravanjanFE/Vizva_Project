import styled from "@emotion/styled";
import { breakpoint } from "public/breakpoint";

export const StyledBackground = styled.div`
  background-color: transparent;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 9;
`;

export const StyledDiv = styled.div`
  min-height: calc(100vh - 100px - 330px);
  .panels {
    max-width: 1750px;
    margin: 0 auto;
  }
  .loadmore {
    width: 300px;
    height: 300px;
    margin: 0 auto;
  }
  padding-top: var(--padding-4);
  ${breakpoint("lg")} {
    padding-top: var(--padding-7);
  }
  ${breakpoint("3xl")} {
    .panels {
      /* padding-top: var(--fontsizes-8); */
    }
    padding-top: var(--fontsizes-8);
  }
`;

export const StyledMenu = styled.menu`
  .menu__button {
    background: none;
    outline: none;
    border: none;
    display: flex;
    gap: 1rem;
    align-items: center;
    text-align: end;
    margin-top: 1rem;
    span {
      line-height: 1.3em;
      font-size: var(--fontsizes-1);
      color: ${(props) => props.theme.primary};
      .fade {
        color: ${(props) => props.theme.gray2};
      }
    }

    svg {
      transform: rotate(0deg);
      transition: transform 250ms ease;
      color: ${(props) => props.theme.primary};
    }

    &:hover,
    &:focus {
      svg {
        transform: rotate(180deg);
      }
      cursor: pointer;
    }

    ${breakpoint("sm")} {
      flex-direction: row;
      margin-top: 0;
    }
    ${breakpoint("lg")} {
      span {
        font-size: var(--fontsizes-2);
      }
    }
  }
  .menu__item {
    svg {
      width: 20px;
      height: 20px;
    }

    &:not(:last-of-type) {
      padding: 0 0 var(--padding-4) 0;
    }

    text-transform: capitalize;
    height: max-content;
    display: grid;
    align-items: center;
    grid-column-gap: 10px;
    grid-template-columns: 20px max-content;
    grid-template-rows: max-content;
    font-weight: 300;

    &:hover,
    &:focus,
    &.menu__item--active {
      cursor: pointer;
      color: ${(props) => props.theme.green};
      svg {
        stroke: ${(props) => props.theme.green};
      }
    }
  }
  .menu__items {
    position: absolute;
    background-color: ${(props) => props.theme.onBackground};
    z-index: 10;
    border-radius: 1.5625rem;
    padding: 2rem;
    right: 0;
    top: calc(100% + 1rem);
    outline: 0;
    border: 0.1px solid ${(props) => props.theme.gray4};
    list-style: none;
    width: fit-content;
  }
  .menu__divider {
    background-color: ${(props) => props.theme.gray2};
    height: 1px;
    margin: 10px 0;
    width: 100%;
  }
  .menu__label {
    color: ${(props) => props.theme.gray2};
    text-transform: uppercase;
    padding-bottom: var(--padding-2);
  }
`;

export const StyledHeader = styled.header`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  margin: 0 0 2rem 0;
  .header__heading {
    font-weight: 500;
    align-self: start;
    text-transform: capitalize;
    line-height: 1em;
    font-size: var(--fontsizes-5);
  }

  @media (min-width: 620px) {
    flex-direction: row;
  }

  ${breakpoint("lg")} {
    .header__heading {
      font-size: var(--fontsizes-7);
    }
  }
`;
