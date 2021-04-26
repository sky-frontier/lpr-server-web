import {Modal} from 'react-bootstrap';

export function ImageModal (props){
    let {toggleModal, src} = props;
    return(
    <Modal size="lg" centered show={src===null?false:true} onHide={toggleModal}>
        <img src={src}/>
    </Modal>
    );
}

export default {ImageModal};