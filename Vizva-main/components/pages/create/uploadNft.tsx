import styled from "@emotion/styled";
import { FiX } from "react-icons/fi";
import { useContext, useRef } from "react";
import { CreateNftContext } from "context/createContext";
import Swal from "sweetalert2";
import UploadIcon from "components/icons/upload";
import { CreateBottomButtons } from "pages/create";
import FileType from "file-type/browser";

export default function UploadNFT() {
  const { clearStorage, incrementStage, data } = useContext(CreateNftContext);
  return (
    <div className="container">
      <StyledDiv>
        <h1>upload your NFT</h1>
        <FileInput />
        <p>drag or choose your file to upload</p>
      </StyledDiv>
      <CreateBottomButtons />
    </div>
  );
}

function FileInput() {
  const { updateData, data } = useContext(CreateNftContext);
  const { previewImage, type } = data;
  const input = useRef<HTMLInputElement>(null);

  const image = [
    "image/png",
    "image/gif",
    "image/webp",
    "image/jpg",
    "image/jpeg",
  ];
  const video = ["video/mp4"];
  const audio = ["audio/mp3", "audio/wav", "audio/ogg", "audio/mpeg"];

  const types = [...image, ...video, ...audio];

  function genFormat(preview: FileReader) {
    let fileType = "";
    const fileTypes = [
      "png",
      "gif",
      "webp",
      "jpg",
      "jpeg",
      "mp3",
      "mp4",
      "mpeg",
      "ogg",
    ];
    for (let i = 11; i < 16; i++) {
      // @ts-ignore
      if (preview.result && preview.result[i] != ";") {
        // @ts-ignore
        fileType += preview.result[i];
      } else break;
    }
    return fileTypes.filter((filetypes) => filetypes === fileType)[0];
  }

  function handler() {
    if (!input.current) return;
    if (!input.current.files) return;
    const file = input.current.files.item(0);
    const preview = new FileReader();

    // if a file exists
    if (!file) {
      return;
    } else {
      preview.readAsDataURL(file);
    }

    preview.onloadend = async function () {
      const maxSize = 52428800; //50 mb
      const size = file?.size;
      let mime: string | undefined;

      await FileType.fromBlob(file).then((res) => {
        mime = res?.mime;
      });

      if (!mime) {
        Swal.fire("Unsupported file type");
        return;
      }

      if (!preview.result) return;

      if (size > maxSize) {
        return Swal.fire("this file is too large. The max size is 50mb");
      }

      const type = types.filter((type) => type === mime)[0];

      if (!type) {
        Swal.fire("this file type is not supported");
        return;
      }

      updateData(file, "image"); //what is sent to the server
      updateData(preview.result, "previewImage"); // used as preview
      updateData(type.slice(0, 5), "type"); // get the file type so it can be rendered accordingly with img or video tag

      // set the format and size of the image

      switch (type.slice(0, 5)) {
        case "image":
          const img = new Image();
          img.src = preview.result as string;
          img.onload = function () {
            updateData(`${img.width} x ${img.height}`, "size");
          };
          break;
        case "audio":
          const audioElem = document.createElement("audio");
          audioElem.src = preview.result as string;
          updateData(`0 x 0`, "size");
          // audioElem.onloadedmetadata = function () {
          //   updateData(`${this.videoWidth} x ${this.videoHeight}`, "size");
          // };
          break;
        case "video":
          const videoElem = document.createElement("video");
          videoElem.src = preview.result as string;
          videoElem.onloadedmetadata = function () {
            updateData(
              `${videoElem.videoWidth} x ${videoElem.videoHeight}`,
              "size"
            );
          };
          break;
      }

      const format = genFormat(preview);
      updateData(format, "format");
    };
  }

  return (
    <StyledFormInput $value={previewImage ? true : false}>
      {data.image && previewImage && type === "image" && (
        <>
          <div className="image-container">
            <button
              className="remove-image"
              onClick={() => {
                updateData(null, "previewImage");
                updateData(null, "image");
                updateData("", "format");
                updateData("", "size");
              }}
            >
              <FiX />
            </button>
            <img
              src={previewImage}
              alt="uploaded image"
              height="90%"
              width="auto"
            />
          </div>
        </>
      )}
      {data.image && previewImage && type === "video" && (
        <>
          <div className="image-container">
            <button
              className="remove-image"
              onClick={() => {
                updateData(null, "previewImage");
                updateData(null, "image");
                updateData("", "format");
                updateData("", "size");
              }}
            >
              <FiX />
            </button>

            <video
              src={previewImage}
              height="90%"
              width="auto"
              controls
              autoPlay={false}
            />
          </div>
        </>
      )}
      {data.image && previewImage && type === "audio" && (
        <>
          <div className="audio-container">
            <button
              className="remove-image"
              onClick={() => {
                updateData(null, "previewImage");
                updateData(null, "image");
                updateData("", "format");
                updateData("", "size");
              }}
            >
              <FiX />
            </button>
            <audio src={previewImage} controls autoPlay={false} />
          </div>
        </>
      )}
      {!data.image && !previewImage && (
        <div className="input-container">
          <div className="upload-container">
            <UploadIcon />
            <p>PNG, GIF, WEBP, MP4 or MP3, Max 50mb.</p>
          </div>
          <input
            ref={input}
            type="file"
            required={true}
            onChange={() => handler()}
            autoComplete="off"
            accept="image/*, video/*, audio/*"
          />
        </div>
      )}
    </StyledFormInput>
  );
}

const StyledDiv = styled.div`
  max-width: 700px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  h1 {
    text-transform: capitalize;
    font-size: var(--fontsizes-7);
    text-align: center;
    margin-bottom: 1.3rem;
  }
  p {
    text-transform: capitalize;
    text-align: center;
    margin-top: 1.3rem;
  }
`;

const StyledFormInput = styled.div<{ $value: boolean }>`
  width: auto;
  margin: 0 auto;
  height: auto;
  color: ${(props) => props.theme.gray3};
  .image-container {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 1rem;
    isolation: isolate;
    overflow: hidden;
    position: relative;

    img,
    video {
      min-height: 200px;
      max-height: 500px;
      min-width: 200px;
      max-width: 500px;
      width: 100%;
      object-fit: cover;
      aspect-ratio: auto;
    }
  }

  .remove-image {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 1rem;
    top: 1rem;
    z-index: 1;
    background: rgba(0, 0, 0, 0.3);
    outline: none;
    border: none;
    border-radius: 100%;
    padding: 5px;
    cursor: pointer;
    backdrop-filter: blur(50px);

    svg {
      transition: 250ms all;
      transform-origin: center;
      width: 24px;
      height: 24px;
      stroke: white !important;
    }

    &:hover,
    &:focus {
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
    margin: 0 auto;
    border-radius: 1rem;
    position: relative;
    /* overflow: hidden; */
    max-width: 400px;
    height: calc(400px * 0.885);
    position: relative;
    &:hover,
    &:focus {
      .upload-container {
        svg {
          stroke: ${(props) => props.theme.primary};
        }
      }
    }
  }

  .upload-container {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 1;
    transform: translate(-50%, -50%);
    width: 100%;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 40px;

    svg {
      width: var(--padding-8);
      height: var(--padding-8);
      max-width: var(--padding-8);
      max-height: var(--padding-8);
      stroke: ${(props) => props.theme.gray1};
    }

    p {
      color: ${(props) => props.theme.primary};
      font-size: 16px;
      font-weight: 200;
    }
  }

  input {
    display: block;
    height: 100%;
    width: 100%;
    user-select: unset;
    position: relative;
    /* outline: none; */
    background-color: ${(props) => props.theme.formBackground};
    outline: none;
    border-radius: inherit;
    cursor: pointer;

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

    &:hover,
    &:focus {
      background-color: ${(props) => props.theme.onBackground};
    }
  }
`;
