import React, { Component } from 'react'
import { Button, Card, InputGroup } from 'react-bootstrap'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

import { Alert } from '../../components/Alert'
import { NonLabelInputForm } from '../../components/Form'

const FormStyle = {
    marginBottom: 8
}

export default class Live extends Component {
    constructor(props) {
        super(props)
        this.state = {
            voteId: this.props.match.params.voteId,
            authStatus: false,

            name: '',
            name_ex: '',
            auth: ''
        }
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    // 선거권자 인증
    authSubmit = async e => {
        e.preventDefault()

        const { voteId, name, name_ex, auth } = this.state

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
                    'auth': auth
                })
            })
                .then(result => result.json())
                .then(json => {
                    this.setState({ authStatus: json.status })
                    this.state.authStatus
                        ? window.location.assign(`/voting/${this.state.voteId}/1`)
                        : confirmAlert({
                            customUI: () => {
                                return (
                                    <Alert content='일치하는 회원이 없습니다.' label='확인' href='' />
                                )
                            },
                            closeOnClickOutside: false
                        })
                    
                    window.sessionStorage.setItem('name', name)
                    window.sessionStorage.setItem('status', status)
                })
                .catch(err => {
                    console.log(err)
                })
        } catch (err) {
            console.log(err)
        }
    }

    render() {
        return (
            <div style={{ marginTop: 25, padding: 15, flex: 1 }}>
                <h3 style={{ marginTop: 30, marginBottom: 50, textAlign: 'center' }}>현장 인증</h3>
                <Card>
                    <Card.Header style={{ backgroundColor: '#fff', border: 2, marginBottom: -20 }}>
                        <NonLabelInputForm type='text' name='name' placeholder='이름을 입력해주세요.' change={this.handleChange} style={FormStyle} />
                        <NonLabelInputForm type='text' name='name_ex' placeholder='이름 구분자를 입력해주세요.' change={this.handleChange} style={FormStyle} />
                    </Card.Header>
                    <hr />
                    <Card.Body>
                        <InputGroup size='lg' style={{ marginTop: -15 }}>
                            <NonLabelInputForm type='number' name='auth' placeholder='인증번호를 입력해주세요.' change={this.handleChange} />
                            <InputGroup.Append>
                                <Button variant="outline-secondary" onClick={this.authSubmit}>확인</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}