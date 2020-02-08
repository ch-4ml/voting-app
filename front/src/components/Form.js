import React from 'react'

import { OutTable } from 'react-excel-renderer'
import { Button, Card, Col, Form, FormGroup, InputGroup } from 'react-bootstrap'

export const InputForm = props => {
    return (
        <Form.Group>
            <Form.Label>{props.label}</Form.Label>
            <Form.Control type={props.type} name={props.name} placeholder={props.placeholder} size='lg' onChange={props.change} />
        </Form.Group>
    )
}

export const NonLabelInputForm = props => {
    return (
        <Form.Control type={props.type} name={props.name} placeholder={props.placeholder} size='lg' onChange={props.change} style={props.style} />
    )
}

export const DisableInput = props => {
    return (
        <Form.Control type={props.type} name={props.name} placeholder={props.placeholder} size='lg' onChange={props.change} style={props.style} readOnly />
    )
}

export const VoteForm = props => {
    return (
        <Form style={{ padding: 25, marginTop: 10 }} onSubmit={props.onSubmit}>
            <h6 style={{ marginBottom: 10 }}>{props.title}</h6>
            <FormGroup row='true'>
                <Col>
                    <InputGroup>
                        <Button color='primary' style={{ color: 'white', zIndex: 0 }} onClick={props.onClick} disabled={props.disabled}>{props.label}</Button>
                        <input type='file' hidden onChange={props.onChange} ref={props.refs} onClick={(event) => { event.target.value = null }} style={{ 'padding': '10px' }} />
                        <input type='text' className='form-control' value={props.value} readOnly invalid='false' />
                    </InputGroup>
                </Col>
            </FormGroup>
            {props.dataLoaded &&
                <div style={{ margin: 20 }}>
                    <Card body outline='true' className='restrict-card' style={{ height: '400px', overflow: 'auto'}}>
                        <OutTable data={props.data} columns={props.columns} tableClassName='ExcelTable2007' />
                    </Card>
                </div>}
            <Button variant='primary' type='submit' size='lg' disabled={props.subBtn}
                style={{ marginTop: 13, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                다음
            </Button>
        </Form>
    )
}