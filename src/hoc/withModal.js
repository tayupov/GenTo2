import React from 'react';

import { Modal } from 'semantic-ui-react';

const withModal = (Component) => (props) => (
    <Modal
        open={true}
        size='small'
        closeOnDimmerClick={false}
        closeOnEscape={false}
    >
        <Modal.Content style={{ textAlign: 'center' }}>
            <Component {...props} />
        </Modal.Content>
    </Modal>
)

export default withModal