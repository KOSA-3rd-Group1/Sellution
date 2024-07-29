import Modal from 'react-modal';

const AlertModal = ({ isOpen, onRequestClose, message }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Alert Modal"
      className="Modal"
      overlayClassName="Overlay"
    >
      <div className="modal-content">
        <h2>알림</h2>
        <p>{message}</p>
        <button onClick={onRequestClose}>닫기</button>
      </div>
    </Modal>
  );
};

export default AlertModal;
