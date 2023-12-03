/* eslint-disable react/prop-types */
import { useRef, useState } from "react";

const Modal = ({
  setModalOpen,
  setSelectedImage,
  selectedImage,
  generateVariations,
}) => {
  const [error, setError] = useState(null);
  const ref = useRef(null);

  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  const checkSize = () => {
    if (ref.current.width == 256 && ref.current.height == 256) {
      generateVariations();
    } else {
      setError("Error; Choose 256x256 size image!!");
    }
  };

  return (
    <div className="modal">
      <div className="modal__close-button" onClick={closeModal}>
        X
      </div>
      <div className="modal__img-container">
        {selectedImage && (
          <img
            ref={ref}
            src={URL.createObjectURL(selectedImage)}
            alt="uploaded image"
          />
        )}
      </div>
      <p>{error || "* Image must be of 256x256."}</p>
      {!error && <button onClick={checkSize}>Generate</button>}
      {error && <button onClick={closeModal}>Upload another Image</button>}
    </div>
  );
};

export default Modal;
