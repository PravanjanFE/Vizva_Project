import styled from "@emotion/styled";
import { breakpoint } from "public/breakpoint";
import { CATEGORIES, CategoryProps } from "./profile.type";

export default function CategoryFilter(props: CategoryProps) {
  const {
    updateCategory,
    createdNFTs,
    collectedNFTs,
    wishlistNFTs,
    active,
    isMyProfile,
  } = props;

  // remove the wishlist category from categories if not isMyProfile
  const categories = isMyProfile
    ? CATEGORIES
    : CATEGORIES.filter((category) => category !== "wishlist");

  return (
    <StyledFilter>
      {categories.map((category) => (
        <button
          key={category}
          className={category === active ? "active" : undefined}
          onClick={() => updateCategory(category)}
        >
          {category.charAt(0).toUpperCase()}
          {category.slice(1)} (
          {category === "created"
            ? createdNFTs
            : category === "collected"
            ? collectedNFTs
            : category === "wishlist"
            ? wishlistNFTs
            : 0}
          )
        </button>
      ))}
    </StyledFilter>
  );
}

const StyledFilter = styled.div`
  display: flex;
  width: 100%;
  overflow: auto;
  & > :not(:last-of-type) {
    margin-right: 20px;
  }
  button {
    outline: none;
    border: none;
    background: transparent;
    color: ${(props) => props.theme.gray2};
    border-bottom: 2px solid transparent;
    padding-bottom: 0.5rem;
    white-space: nowrap;
    min-width: 150px;
    text-align: center;

    &.active {
      color: ${(props) => props.theme.primary};
      border-color: ${(props) => props.theme.primary};
    }

    &:hover {
      color: ${(props) => props.theme.primary};
      cursor: pointer;
    }
  }

  ${breakpoint("lg")} {
    button {
      /* font-size: var(--fontsizes-2); */
    }
  }
`;
