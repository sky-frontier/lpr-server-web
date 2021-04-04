import { Button, Modal } from "react-bootstrap";

export function ProjectModal(props) {
  let toggleModel = props.toggleModal;
  let success = props.success;
  let hide = props.hide;
  let body = props.body;
  let title = props.title;
  return (
    <Modal show={hide} onHide={toggleModel}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={toggleModel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={success}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default { ProjectModal };
