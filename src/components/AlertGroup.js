import React from 'react';

import { alertService, alertType } from '../services/index.js';
import { Alert } from 'react-bootstrap';

export class AlertGroup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            alerts: []
        };
    }

    componentDidMount() {
        // subscribe to new alert notifications
        this.subscription = alertService.onAlert(this.props.id)
            .subscribe(alert => {
                // add alert to array
                this.setState({ alerts: [...this.state.alerts, alert] });

                // auto close alert if required
                setTimeout(() => this.removeAlert(alert), 3000);
            });

        // clear alerts on location change
    }

    componentWillUnmount() {
        // unsubscribe & unlisten to avoid memory leaks
        this.subscription.unsubscribe();
    }

    removeAlert(alert) {
        this.setState({ alerts: this.state.alerts.filter(x => x !== alert) })
    }

    render() {
        const { alerts } = this.state;
        if (!alerts.length) return null;
        return (
            <div className="alertGrp">
                {console.log(alerts),
                alerts.map((alert,idx) =>
                    <Alert 
                    key = {idx} 
                    variant={alert.type}
                    dismissible = {true}
                    onClose={()=>{this.removeAlert(alert)}}>
                        {alert.message}
                    </Alert>
                )}
            </div>
        );
    }
}

export default {AlertGroup} ;