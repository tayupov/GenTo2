import React from 'react';

import { Modal } from 'semantic-ui-react';

const withModal = (Component) => (props) => (
    <Modal
        open={props.active}
        size='big'
        closeIcon
        onClose={props.handleHide}
    >
        <Modal.Content style={{ textAlign: 'center' }}>
            <Component {...props} />
        </Modal.Content>
    </Modal>
)

export default withModal