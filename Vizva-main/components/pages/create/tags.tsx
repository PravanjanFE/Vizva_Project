import styled from "@emotion/styled";
import Input from "components/input";
import { CreateNftContext } from "context/createContext";
import { useContext, useState } from "react";
import * as Fi from "react-icons/fi";

export default function Tags() {
  const { data, updateData } = useContext(CreateNftContext);
  const [tag, setTag] = useState("");

  return (
    <StyledTags>
      {data.tags.length > 0 && (
        <div className="tag-container">
          {data.tags.map((tag) => (
            <div key={tag}>
              <p>#{tag}</p>
              <div
                className="close-btn"
                onClick={() => {
                  const t = data.tags.filter((d) => tag != d);
                  updateData(t, "tags");
                }}
              >
                <Fi.FiX />
              </div>
            </div>
          ))}
        </div>
      )}

      <label htmlFor="tag">tag</label>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // prevents entering duplicate tags
          updateData([...data.tags.filter((t) => t !== tag), tag], "tags");
          setTag("");
        }}
      >
        <Input
          maxLength={20}
          type="text"
          name="tag"
          id="tag"
          value={tag}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTag(e.target.value)
          }
          placeholder="tag"
        />
      </form>
    </StyledTags>
  );
}

const StyledTags = styled.div`
  margin-top: 1rem;
  .tag-container {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    & > div {
      display: flex;
      align-items: center;
      font-weight: light;
      border: 1px solid ${(props) => props.theme.secondary};
      border-radius: 3px;
      transition: 100ms ease;
      margin: 0 1rem 1rem 0;
      p {
        padding: 10px;
      }
      .close-btn {
        border-left: 1px solid gray;
        height: 100%;
        cursor: pointer;
        display: grid;
        place-items: center;
        padding: 10px;
        display: none;
        visibility: hidden;
        transition: visibility 0.25s ease-in;
        &:hover > svg {
          transition: transform 0.25s ease;
          transform: scale(1.2);
          cursor: pointer;
        }
      }

      &:hover > .close-btn {
        display: flex;
        visibility: visible;
      }
    }
  }
  label {
    display: block;
    text-transform: capitalize;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
`;
