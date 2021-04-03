import { Button, Modal } from "react-bootstrap";

export function ProjectDelModal(props) {
  let toggleModel = props.toggleModal;
  let success = props.success;
  let hide = props.hide;
  return (
    <Modal show={hide} onHide={toggleModel}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>Delete the selected project?</Modal.Body>
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

export function ProjectAddModal(props) {
  let toggleModel = props.toggleModal;
  let success = props.success;
  let hide = props.hide;
  return (
    <Modal show={hide} onHide={toggleModel}>
      <Modal.Header closeButton>
        <Modal.Title>Add Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>Add a new project?</Modal.Body>
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

export default { ProjectDelModal, ProjectAddModal };
