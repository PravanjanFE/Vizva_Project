import styled from "@emotion/styled";
import { InputHTMLAttributes, useRef, useState } from "react";
import Swal from "sweetalert2";
import FileType from "file-type/browser";
import { types } from "pages/artwork/[id]";

interface BaseProps {
  /**
   * @description this function is called with the file as the first parameter
   */
  setFile: (image: File) => void; // later on this function should also hold the types of files to accept
  label?: string;
  appearance?: string;
  infoText?: string;
  deleteImage: () => void;
  format: mimeType[];
}

interface InputProps extends BaseProps, InputHTMLAttributes<HTMLInputElement> {
  value?: any;
  updateFileType?: (fileType: string) => void;
}

const image = [
  "image/png",
  "image/gif",
  "image/webp",
  "image/jpg",
  "image/jpeg",
];
const video = ["video/mp4"];
const audio = ["audio/mp3", "audio/wav", "audio/ogg", "audio/mpeg"];

const mimeTypes = {
  image,
  video,
  audio,
};

type mimeType = keyof typeof mimeTypes;

export default function FileInput(props: InputProps) {
  const [inputFocused, setInputfocused] = useState(false); // used to tell css when input has focus
  const [name, setName] = useState("");
  const {
    infoText,
    appearance,
    label,
    placeholder,
    setFile,
    value,
    deleteImage,
    format,
    updateFileType,
    ...others
  } = props;
  const { className, id } = others;
  const input = useRef<HTMLInputElement>(null);

  async function handler() {
    if (!input.current) return;
    if (!input.current.files) return;
    const file = input.current.files.item(0);

    if (!file) {
      return;
    } else {
      let arr = Array.from(new Set(format));
      let types: string[] = [];

      arr.forEach((type) => {
        types = types.concat(mimeTypes[type]);
      });

      const maxSize = 10485760; //10 mb
      const size = file?.size;
      let mime: string | undefined;

      await FileType.fromBlob(file).then((res) => {
        mime = res?.mime;
      });

      if (!mime) {
        Swal.fire("Unsupported file type");
        return;
      }

      if (size > maxSize) {
        Swal.fire("this file is too large. The max size is 50mb");
        return;
      }

      const type = types.filter((type) => type === mime)[0];

      if (!type) {
        Swal.fire("this file type is not supported");
        return;
      }

      setName(file.name);
      updateFileType && updateFileType(type);
      setFile(file); //what is sent to the server
    }
  }

  return (
    <StyledInput className={className} $infoText={infoText}>
      {label && <label htmlFor={id}>{label}</label>}
      <StyledDiv $inputFocused={inputFocused}>
        <div className="input-container">
          {value && (
            <>
              <div className="image-container">
                <img src={value} alt="input image" />
              </div>
              <p>{name}</p>
              <button
                className="remove-image"
                onClick={() => {
                  deleteImage();
                }}
              >
                Delete
                {/* <Fi.FiX /> */}
              </button>
            </>
          )}

          {!value && (
            <>
              <div className="upload-container">
                {/* <Fi.FiUpload color="#ffffff" /> */}
                <p className="upload__label">
                  {placeholder
                    ? placeholder
                    : "Drag and drop an image here or click to browse"}
                </p>
              </div>
              <input
                onFocus={() => setInputfocused(true)}
                onBlur={() => setInputfocused(false)}
                {...others}
                ref={input}
                type="file"
                required={true}
                onChange={() => handler()}
                autoComplete="off"
                accept={Array.from(new Set(format))
                  .map((t) => `${t}/*`)
                  .join(",")}
              />
            </>
          )}
        </div>
      </StyledDiv>
      {/* {infoText && <p>{infoText}</p>} */}
    </StyledInput>
  );
}

const StyledInput = styled.div<{ $infoText?: string }>`
  width: 100%;
  min-width: 150px;

  label {
    text-transform: capitalize;
    display: block;
    margin-bottom: 0.5rem;
    line-height: 1.2em;
    letter-spacing: 1px;
  }
`;

const StyledDiv = styled.div<{ $inputFocused: boolean }>`
  /* width: 98%; */
  margin: 0 auto;
  padding-top: 0.5rem;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  .image-container {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 1rem;
    isolation: isolate;
    overflow: hidden;
    position: relative;
    height: 100%;
    width: 30%;
    background-color: ${(props) => props.theme.pink};
    img,
    video {
      /* min-height: 200px;
      max-height: 500px;
      min-width: 200px;
      max-width: 500px; */
      width: 100%;
      height: 100%; // remove this to show full image
      object-fit: cover;
      aspect-ratio: auto;
    }
  }

  .remove-image {
    display: flex;
    align-items: center;
    justify-content: center;
    /* position: absolute; */
    /* right: 1rem;
    top: 1rem; */
    z-index: 1;
    background: transparent;
    /* background: rgba(0, 0, 0, 0.3); */
    /* backdrop-filter: blur(50px); */
    outline: none;
    border: none;
    border-radius: 100%;
    padding: 5px;
    cursor: pointer;
    color: inherit;

    svg {
      transition: 250ms all;
      transform-origin: center;
      width: 24px;
      height: 24px;
      stroke: white !important;
    }

    &:hover,
    &:focus {
      color: ${(props) => props.theme.green};
      svg {
        transform: rotate(90deg);
      }
    }
  }

  .audio-container {
    position: relative;

    audio {
      margin-top: 1rem;
    }
  }

  .input-container {
    /* background-color: ${(props) => props.theme.formBackground}; */
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    background: transparent;
    border: 2.5px dotted ${(props) => props.theme.gray4};
    /* border-style: dotted; */
    border-radius: 1rem;
    position: relative;
    /* overflow: hidden; */
    /* max-width: 400px; */
    width: 100%;
    height: 170px;
    &:hover,
    &:focus {
      /* background-color: ${(props) => props.theme.onBackground}; */
      .upload__label {
        transform: scale(1.05);
      }
    }

    /* move the arrow */
    &:hover {
      svg > polyline,
      svg > line {
        transform: translateY(-3px);
        transition: 150ms linear;
      }
    }

    /* styled applied when input is focused */
    ${(props) => {
      if (props.$inputFocused) {
        return {
          // backgroundColor: `${props.theme.gray3}`,
          "svg>polyline": {
            transform: "translateY(-3px)",
            transition: "150ms linear",
          },
          "svg>line": {
            transform: "translateY(-3px)",
            transition: "150ms linear",
          },
        };
      }
    }}
  }

  .upload-container {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 1;
    transform: translate(-50%, -50%);
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 40px;
    pointer-events: none;
    svg {
      font-size: 3rem;
      margin-bottom: 1rem;
      overflow: visible;
      stroke: ${(props) => props.theme.primary};
    }

    p {
      text-align: center;
      color: ${(props) => props.theme.primary};
      font-weight: 200;
      line-height: 1.5em;
      font-size: 16px;
      &:last-of-type {
        margin-top: 0.5rem;
      }
    }
  }

  .upload__label {
    transition: transform 150ms ease;
  }

  input {
    display: block;
    height: 100%;
    width: 100%;
    user-select: unset;
    position: relative;
    border-radius: inherit;
    outline: none;
    cursor: pointer;
    /* background-color: ${(props) => props.theme.formBackground}; */

    &:hover,
    &:focus {
      /* background-color: ${(props) => props.theme.onBackground}; */
    }

    &::file-selector-button {
      cursor: pointer;
      outline: 0;
      margin: 0;
      padding: 0;
      border: 0;
      width: 100%;
      height: 100%;
      background: none;
      color: transparent;
    }
  }
`;
