import styled from "@emotion/styled";
import Input from "components/input";
import { PROPERTY } from "hooks/useCreateNFT";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import * as Fi from "react-icons/fi";

export default function Properties({
  properties,
  setProperties,
}: {
  properties: PROPERTY[];
  setProperties: Dispatch<SetStateAction<PROPERTY[]>>;
}) {
  // adds a new property
  function addNewProperty() {
    // if the key and value pair of the previous entry isn't empty, add a new property
    if (
      properties[properties.length - 1].trait_type &&
      properties[properties.length - 1].value
    ) {
      // console.log("here");
      setProperties((properties) => [
        ...properties,
        {
          trait_type: "",
          value: "",
        },
      ]);
    }
  }
  // removes a property
  function removeProperty(index: number) {
    let allowed = properties.filter((property, i) => index !== i);
    setProperties([...allowed]);
  }

  // updates a property
  function updateProperty(
    key: "value" | "trait_type",
    value: string,
    index: number
  ) {
    let i = properties;
    i[index][key] = value;
    setProperties([...i]);
    addNewProperty();
  }

  return (
    <StyledModal>
      <label htmlFor="">Property</label>
      {properties.map((property, index) => (
        <Property
          key={index}
          index={index}
          property={property}
          noOfProperties={properties.length}
          updateProperty={updateProperty}
          removeProperty={removeProperty}
        />
      ))}
    </StyledModal>
  );
}
interface PropertyProps {
  index: number;
  noOfProperties: number;
  property: PROPERTY;
  updateProperty(
    type: "trait_type" | "value",
    value: string,
    index: number
  ): void;
  removeProperty(index: number): void;
}

function Property(props: PropertyProps) {
  const { index, property, updateProperty, removeProperty, noOfProperties } =
    props;

  // if the property has been edited before
  const [edited, setEdited] = useState(false);

  // checks if the key value pair of an entry is empty
  function isEmpty() {
    if (!property.trait_type && !property.value) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    // after updating, check if its fields are empty and delete it if they are empty
    let checkEmpty = isEmpty();
    if (checkEmpty && edited && noOfProperties > 1) {
      removeProperty(index);
    }
    if (!edited) setEdited(true);
  }, [property.trait_type, property.value]);

  return (
    <StyledProperty key={index}>
      <Input
        type="text"
        placeholder="Ex:Character"
        value={property.trait_type}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          updateProperty("trait_type", e.target.value, index)
        }
      />
      <Input
        type="text"
        placeholder="Ex:Male"
        value={property.value}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          updateProperty("value", e.target.value, index)
        }
      />

      {/* if either one of the values is the entry is provided and the entry isn't the last, show the delete button */}
      {property.value ||
      (property.trait_type && noOfProperties - 1 != index) ? (
        <button onClick={() => removeProperty(index)}>
          <Fi.FiTrash2 />
        </button>
      ) : (
        <button style={{ visibility: "hidden" }}></button>
      )}
    </StyledProperty>
  );
}

const StyledProperty = styled.div`
  gap: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr max-content;
  &:not(:last-child) {
    margin-bottom: 10px;
  }
`;

export const StyledModal = styled.div`
  label {
    display: block;
    margin-bottom: var(--padding-3);
  }

  button {
    height: 50px;
    width: 50px;
    background: transparent;
    outline: none;
    border: none;
    cursor: pointer;
    &:focus,
    &:hover {
      outline: 2px solid ${(props) => props.theme.green};
      border-radius: 5px;
    }
    svg {
      font-size: 1.3rem;
    }
  }
`;
