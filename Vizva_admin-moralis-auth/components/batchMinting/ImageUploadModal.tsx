import { Button, Modal } from "react-bootstrap";
import Dropzone from "react-dropzone";
import { default as NextImage } from "next/image";

interface Props {
    showSecondModal: boolean
    handleSecondModalShow: any
    handleSecondModalClose: any
    uploadToIpfs: any
    handleImagesUpload: any
    uploadedImages: any
    handleJSONUpload: any
    allUploadedImages: any
    uploadedFile: any
    allUploadedFile: any
    validateSecondForm: any
}

export default function ImageUploadModal({
    showSecondModal = false,
    handleSecondModalShow,
    handleSecondModalClose,
    uploadToIpfs,
    handleImagesUpload,
    uploadedImages,
    handleJSONUpload,
    allUploadedImages,
    uploadedFile,
    allUploadedFile,
    validateSecondForm,
}: Props) {

    return <Modal show={showSecondModal} onHide={handleSecondModalShow}>
        <Modal.Header closeButton onClick={handleSecondModalClose}>
            <Modal.Title>Upload Images</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light">
            <div className="row pl-5 pr-5">
                <div className="col-md-5 p-3 ml-auto rounded border bg-white">
                    <Dropzone
                        onDrop={(acceptedFiles) =>
                            handleImagesUpload(acceptedFiles)
                        }
                    >
                        {({ getRootProps, getInputProps }) => (
                            <section>
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    {uploadedImages.length === 0 && (
                                        <img
                                            src="/UploadIcon.png"
                                            className="d-flex m-auto"
                                            alt="upload"
                                        />
                                    )}
                                    {uploadedImages.length === 0 && (
                                        <p className="text-center">Upload Images</p>
                                    )}
                                    {uploadedImages.length > 0 && (
                                        <img
                                            src="/SuccessIcon.png"
                                            className="d-flex m-auto"
                                            alt="success"
                                        />
                                    )}
                                    {uploadedImages.length > 0 && (
                                        <p className="text-center">
                                            <strong>{uploadedImages.length}</strong> Images
                                            Uploaded
                                        </p>
                                    )}
                                </div>
                            </section>
                        )}
                    </Dropzone>
                </div>
                <div className="col-md-5 p-3 ml-2 mr-auto rounded border bg-white">
                    <Dropzone
                        onDrop={(acceptedFiles) =>
                            handleJSONUpload(acceptedFiles[0])
                        }
                        maxFiles={1}
                        multiple={false}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <section>
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    {!uploadedFile && (
                                        <img
                                            src="/UploadIcon.png"
                                            className="d-flex m-auto"
                                            alt="upload"
                                        />
                                    )}
                                    {!uploadedFile && (
                                        <p className="text-center">Upload JSON File</p>
                                    )}
                                    {uploadedFile && (
                                        <img
                                            src="/SuccessIcon.png"
                                            className="d-flex m-auto"
                                            alt="success"
                                        />
                                    )}
                                    {uploadedFile && (
                                        <p className="text-center">JSON file Uploaded</p>
                                    )}
                                </div>
                            </section>
                        )}
                    </Dropzone>
                </div>
            </div>

            <p>
                Note: Uploaded images should have same name as in JSON file
            </p>

            <div className="mt-2 p-4 rounded col-md-12 bg-white">
                {uploadedFile && <h5>Uploaded JSON file</h5>}
                {uploadedFile && (
                    <ul className="overflow-auto">{allUploadedFile}</ul>
                )}
                {!uploadedFile && (
                    <p className="text-danger">
                        {"! JSON file is mandatory for metadata"}
                    </p>
                )}

                {uploadedImages.length > 0 && <h5>Uploaded Images</h5>}
                {uploadedImages.length > 0 && (
                    <ul className="overflow-auto" style={{ height: "80px" }}>
                        {allUploadedImages}
                    </ul>
                )}
                {uploadedImages.length === 0 && (
                    <p className="text-danger">{"! No image uploaded"}</p>
                )}
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleSecondModalClose}>
                Close
            </Button>
            <Button
                variant="primary"
                disabled={validateSecondForm()}
                onClick={uploadToIpfs}
            >
                Upload
            </Button>
        </Modal.Footer>
    </Modal>
}