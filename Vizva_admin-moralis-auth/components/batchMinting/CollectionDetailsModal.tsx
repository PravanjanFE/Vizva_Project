import { Button, Modal } from "react-bootstrap";
import Dropzone from "react-dropzone";
import { default as NextImage } from "next/image";

interface Props {
  showFirstModal: boolean;
  handleFirstModalShow: any;
  handleModalClose: any;
  handleFirstModalNext: any;
  coverPhoto: any;
  dispPhoto: any;
  collectionName: any;
  symbol: any;
  price: any;
  description: any;
  ownerAddress: any;
  setCollectionName: any;
  setSymbol: any;
  setDescription: any;
  setOwnerAddress: any;
  handleCoverUpload: any;
  handleDispPhoto: any;
  handlePriceChange: any;
  validateFirstForm: any;
  isCollectionTakenData: any;
  isCollectionTakenFetching: boolean;
  mnemonic: any;
  setMnemonic: any;
}

export default function CollectionDetailsModal({
  showFirstModal = false,
  handleFirstModalShow,
  handleModalClose,
  handleFirstModalNext,
  coverPhoto,
  dispPhoto,
  collectionName,
  symbol,
  price,
  description,
  ownerAddress,
  setCollectionName,
  setSymbol,
  setDescription,
  setOwnerAddress,
  handleCoverUpload,
  handleDispPhoto,
  handlePriceChange,
  validateFirstForm,
  isCollectionTakenData,
  isCollectionTakenFetching = false,
  mnemonic,
  setMnemonic,
}: Props) {
  return (
    <Modal show={showFirstModal} onHide={handleFirstModalShow}>
      <Modal.Header closeButton onClick={handleModalClose}>
        <Modal.Title>Create New Collection</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-light">
        <div className="row">
          <div className="form-group">
            {/* <label>Email address</label> */}
            <div className="rounded border p-4 mb-2 cover-image-container bg-white">
              <Dropzone
                onDrop={(acceptedFiles) => handleCoverUpload(acceptedFiles[0])}
                maxFiles={1}
                multiple={false}
              >
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div {...getRootProps({ className: "dropzone" })}>
                      <input {...getInputProps()} />
                      {!coverPhoto && (
                        <img
                          src="/UploadIcon.png"
                          className="d-flex m-auto"
                          alt="upload"
                        />
                      )}
                      {!coverPhoto && (
                        <p className="text-center">
                          Add Cover For Your Collection
                        </p>
                      )}
                      {coverPhoto != null && (
                        <img
                          className="cover-image"
                          src={URL.createObjectURL(coverPhoto as File)}
                          alt="cover"
                        />
                      )}
                      {coverPhoto && (
                        <div className="cover-image-overlay">
                          <img
                            src="/UploadIcon.png"
                            className="d-flex m-auto"
                            alt="upload"
                          />
                          <div className="overlay-text">
                            Change Cover For Your Collection
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                )}
              </Dropzone>
            </div>
            <div className="row">
              <div
                className="rounded-circle col-md-3 p-1 border mb-2 cover-image-container bg-white d-flex align-items-center"
                style={{ height: "120px", width: "120px", overflow: "hidden" }}
              >
                <Dropzone
                  onDrop={(acceptedFiles) => handleDispPhoto(acceptedFiles[0])}
                  maxFiles={1}
                  multiple={false}
                >
                  {({ getRootProps, getInputProps }) => (
                    <section>
                      <div {...getRootProps({ className: "dropzone" })}>
                        <input {...getInputProps()} />
                        {!dispPhoto && (
                          <img
                            src="/UploadIcon.png"
                            className="d-flex m-auto"
                            alt="upload"
                          />
                        )}
                        {!dispPhoto && (
                          <p className="text-center">Add Display Photo</p>
                        )}
                        {dispPhoto != null && (
                          <img
                            className="cover-image"
                            src={URL.createObjectURL(dispPhoto as File)}
                            alt="cover"
                          />
                        )}
                        {dispPhoto && (
                          <div className="cover-image-overlay">
                            <img
                              src="/UploadIcon.png"
                              className="d-flex m-auto"
                              alt="upload"
                            />
                            <div
                              className="overlay-text p-1"
                              style={{ fontSize: "12px" }}
                            >
                              Change Display Photo
                            </div>
                          </div>
                        )}
                      </div>
                    </section>
                  )}
                </Dropzone>
              </div>
              <div className="ml-auto col-md-9 d-flex flex-column align-self-center">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Type Name For Your Collection"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                />
                {isCollectionTakenData && collectionName !== "" && (
                  <p className="text-danger mb-2 mt-n2">
                    Collection name already exist! Please try a new name.
                  </p>
                )}
                {!isCollectionTakenData && collectionName !== "" && (
                  <p className="text-success mb-2 mt-n2">
                    Valid collection name.
                  </p>
                )}

                {isCollectionTakenFetching && (
                  <div className="mb-2 mt-n2 d-flex">
                    <div className="spinner-border " role="status">
                      <span className="sr-only text-warning">Loading...</span>
                    </div>
                    <div className="text-warning">
                      Checking collection names...
                    </div>
                  </div>
                )}
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Type Symbol For Your Collection"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                />
              </div>
            </div>

            <textarea
              className="form-control mb-2"
              placeholder="Description For Your Collection"
              maxLength={300}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Enter Owner Address"
              value={ownerAddress}
              onChange={(e) => setOwnerAddress(e.target.value)}
            />
            <input
              type="number"
              className="form-control mb-2"
              placeholder="Enter Price"
              min="0"
              value={price as string}
              onChange={handlePriceChange}
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Enter 12 word Mnemonics"
              value={mnemonic}
              //maxLength={12}
              onChange={(e) => setMnemonic(e.target.value)}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleModalClose}>
          Close
        </Button>
        <Button
          variant="primary"
          disabled={validateFirstForm()}
          onClick={handleFirstModalNext}
        >
          Next
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
