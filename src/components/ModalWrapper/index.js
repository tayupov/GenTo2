import React from 'react';

import { Modal } from 'semantic-ui-react';

export default function wrapper(Component) {
    return class extends React.Component {
        render() {
            return (
                <Modal
                    trigger={this.props.trigger}
                    open={this.props.active}
                    size='big'
                    closeIcon
                    onClose={this.props.handleHide}
                >
                    <Modal.Content style={{ textAlign: 'center' }}>
                        <Component {...this.props} />
                    </Modal.Content>
                </Modal>
            )
        }
    }
}
