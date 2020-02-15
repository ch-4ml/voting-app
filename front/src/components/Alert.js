import React from 'react'

export const Alert = props => {
    return (
        <div className='react-confirm-alert-overlay'>
            <div className='text-center'>
                <p style={{ marginBottom: 20 }}>{props.content}</p>
                <button className="btn btn-cn btn-secondary" autoFocus
                    onClick={() => { window.location.assign(`${props.href}`) }}>
                    {props.label}
                </button>
            </div>
        </div>
    )
}

export const Confirm = props => {
    return (
        <div className='react-confirm-alert-overlay'>
            <div className='text-center'>
                <p style={{ marginBottom: 20 }}>{props.content}</p>
                <button className="btn btn-cn btn-primary" autoFocus
                    onClick={props.confirm}>
                    {props.lblConfirm}
                </button>
                <span style={{ marginLeft: 10, marginRight: 10 }} />
                <button className="btn btn-cn btn-secondary"
                    onClick={props.close}>
                    {props.lblClose}
                </button>
            </div>
        </div>
    )
}

export const AlertClose = props => {
    return (
        <div className='react-confirm-alert-overlay'>
            <div className='text-center'>
                <p style={{ marginBottom: 20 }}>{props.content}</p>
                <button className="btn btn-cn btn-secondary" autoFocus
                    onClick={props.close}>
                    {props.label}
                </button>
            </div>
        </div>
    )
}