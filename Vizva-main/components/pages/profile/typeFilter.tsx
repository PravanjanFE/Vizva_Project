import { Menu } from "@headlessui/react";
import { StyledMenu } from "components/pages/discover/style";
import { Fragment } from "react";
import * as Fi from "react-icons/fi";
import { FILTERS, TYPE_FILTER_PROPS } from "./profile.type";

export default function TypeFilter(props: TYPE_FILTER_PROPS) {
  const { active: activeFilter, updateFilter } = props;
  return (
    <Menu as={Fragment}>
      <StyledMenu>
        <Menu.Button className="menu__button">
          <span>
            <span className="fade">Filter by </span>
            {activeFilter}
          </span>
          <Fi.FiChevronDown size="20" />
        </Menu.Button>
        <Menu.Items as="ul" className="menu__items">
          {FILTERS.map((filter) => (
            <Menu.Item as={Fragment} key={filter}>
              {({ active }: { active: boolean }) => (
                <li
                  className={`menu__item ${active ? "menu__item--active" : ""}`}
                  onClick={() => updateFilter(filter)}
                >
                  {filter == activeFilter ? (
                    <Fi.FiCheck size="20" />
                  ) : (
                    <svg></svg>
                  )}
                  {filter}
                </li>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </StyledMenu>
    </Menu>
  );
}
