import React, { Component } from 'react'
import { Accordion, Button, Card, InputGroup } from 'react-bootstrap'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

import { Alert, AlertClose } from '../../components/Alert'
import { NonLabelInputForm } from '../../components/Form'

const FormStyle = {
    marginBottom: 8
}

export default class Phone extends Component {
    constructor(props) {
        super(props)
        this.state = {
            voteId: this.props.match.params.voteId,
            name: '',
            name_ex: '',
            phone: '',
            auth: '',

            authMsg: '',
            getAuth: '',
        }
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    // 휴대폰 번호로 인증번호 조회
    sendAuthSubmit = async e => {
        e.preventDefault()

        const { voteId, name, name_ex, phone } = this.state

        try {
            await fetch('/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'vote_id': voteId,
                    'name': name,
                    'name_ex': name_ex,
                    'phone': phone,
                })
            })
                .then(result => result.json())
                .then(json => {
                    console.log(json)
                    this.setState({ getAuth: json.auth })

                    if (json.status) {
                        window.sessionStorage.setItem('name', json.session.name)
                        window.sessionStorage.setItem('status', json.session.status)
                        switch (json.session.status) {
                            case 0:
                                window.location.assign(`/voting/${this.state.voteId}/1`)
                                break;
                            case 1:
                                window.location.assign(`/voting/${this.state.voteId}/2`)
                                break;
                            case 2:
                                window.location.assign(`/voting/${this.state.voteId}/3`)
                                break;
                            default:
                                confirmAlert({
                                    customUI: () => {
                                        return (
                                            <Alert content='이미 투표하셨습니다.' label='확인' href='' />
                                        )
                                    },
                                    closeOnClickOutside: false
                                })
                        }
                    } else {
                        confirmAlert({
                            customUI: () => {
                                return (
                                    <Alert content='일치하는 회원이 없습니다.' label='확인' href='' />
                                )
                            },
                            closeOnClickOutside: false
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        } catch (err) {
            console.log(err)
        }
    }

    // 선거권자 인증
    authSubmit = async e => {
        e.preventDefault()

        const { voteId, name, name_ex, phone, auth, getAuth } = this.state

        try {
            await fetch('/electorate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'vote_id': voteId,
                    'name': name,
                    'name_ex': name_ex,
                    'phone': phone
                })
            })
                .then(result => result.json())
                .then(json => {
                    this.setState({ authMsg: json.msg })
                })
                .catch(err => {
                    console.log(err)
                })
        } catch (err) {
            console.log(err)
        }

        auth === getAuth
            ? window.location.assign(`/voting/${this.state.voteId}/1`)
            : confirmAlert({
                customUI: ({ onClose }) => {
                    return (
                        <AlertClose content='인증번호를 다시 입력해주세요.' label='확인' close={() => onClose()} />
                    )
                },
                closeOnClickOutside: false
            })
    }

    render() {
        return (
            <div style={{ marginTop: 25, padding: 15, flex: 1 }}>
                <h3 style={{ marginTop: 30, marginBottom: 50, textAlign: 'center' }}>모바일 인증</h3>
                <Accordion defaultActiveKey='0'>
                    <Card style={{ margin: 10 }}>
                        <Card.Header style={{ backgroundColor: '#fff' }}>
                            <NonLabelInputForm type='text' name='name' placeholder='이름을 입력해주세요.' change={this.handleChange} style={FormStyle} />
                            <NonLabelInputForm type='text' name='name_ex' placeholder='이름 구분자를 입력해주세요.' change={this.handleChange} style={FormStyle} />
                            <InputGroup className='mb-3' size='lg'>
                                <NonLabelInputForm type='number' name='phone' placeholder='휴대폰 번호를 입력해주세요.' change={this.handleChange} style={FormStyle} />
                                <InputGroup.Append>
                                    <Accordion.Toggle as={Button} variant='outline-secendary' eventKey='1' onClick={this.sendAuthSubmit} disabled={this.state.getAuth}>
                                        인증번호 받기
                                    </Accordion.Toggle>
                                </InputGroup.Append>
                            </InputGroup>
                        </Card.Header>
                        <Accordion.Collapse eventKey='1'>
                            <Card.Body style={{ margin: 0 }}>
                                <InputGroup className='mb-3' size='lg'>
                                    <NonLabelInputForm type='text' name='auth' placeholder='인증번호를 입력해주세요.' change={this.handleChange} />
                                    <InputGroup.Append>
                                        <Button variant="outline-secondary" onClick={this.authSubmit}>확인</Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            </div>
        )
    }
}