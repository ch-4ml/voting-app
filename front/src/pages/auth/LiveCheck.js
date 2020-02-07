import React, { Component } from 'react'
import { Button, Card, InputGroup } from 'react-bootstrap'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

import { Alert } from '../../components/Alert'
import { NonLabelInputForm } from '../../components/Form'

// const FormStyle = {
//     marginBottom: 8
// }

export default class LiveCheck extends Component {
    constructor(props) {
        super(props)
        this.state = {
            voteId: this.props.match.params.voteId,

            name: '',
            // name_ex: '',
            // auth: ''
        }
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    // 선거권자 인증
    authSubmit = async e => {
        e.preventDefault()

        const { voteId, name } = this.state

        try {
            await fetch('/electorate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'vote_id': voteId,
                    'name': name,
                    // 'name_ex': name_ex,
                    // 'auth': auth
                })
            })
                .then(result => result.json())
                .then(json => {
                    console.log(json);
                    if(json.status) {
                        confirmAlert({
                            customUI: () => {
                                return (
                                    <Alert content='선거권자 인증에 성공했습니다.' label='확인' href={`/liveCheck/${voteId}`} />
                                )
                            },
                            closeOnClickOutside: false
                        })
                    } else {
                        confirmAlert({
                            customUI: () => {
                                return (
                                    <Alert content='일치하는 회원이 없거나 이미 투표한 회원입니다.' label='확인' href={`/liveCheck/${voteId}`} />
                                )
                            },
                            closeOnClickOutside: false
                        })
                    }
                    /* if (json.status) {
                        window.sessionStorage.setItem('name', json.session.name)
                        window.sessionStorage.setItem('status', json.session.status)
                        switch(json.session.status) {
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
                                    <Alert content='일치하는 회원이 없거나 이미 투표한 회원입니다.' label='확인' href='' />
                                )
                            },
                            closeOnClickOutside: false
                        })
                    } */
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
                    {/* <Card.Header style={{ backgroundColor: '#fff', border: 2, marginBottom: -20 }}>
                        <NonLabelInputForm type='text' name='name' placeholder='이름을 입력해주세요.' change={this.handleChange} style={FormStyle} />
                        <NonLabelInputForm type='text' name='name_ex' placeholder='이름 구분자를 입력해주세요.' change={this.handleChange} style={FormStyle} />
                    </Card.Header>
                    <hr />  */}
                    <Card.Body>
                        <InputGroup size='lg'>
                            <NonLabelInputForm type='text' name='name' placeholder='이름을 입력해주세요.' change={this.handleChange} />
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