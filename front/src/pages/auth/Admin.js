import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

import { Alert } from '../../components/Alert'
import { BlockButton } from '../../components/Button'
import { NonLabelInputForm, DisableInput } from '../../components/Form'

export default class Admin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            voteId: this.props.match.params.voteId,
            name: '',
            // name_ex: '',
            limit: ''
        }
    }

    componentDidMount() {
        this.sessionApi()
            .then(res => {
                !res.result && confirmAlert({
                    customUI: () => {
                        return (
                            <Alert content='잘못된 접근입니다.' label='확인' href='/' />
                        )
                    },
                    closeOnClickOutside: false
                })
            })
            .catch(err => console.log(err))
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleElectorateSubmit = async e => {
        e.preventDefault()

        let electorateInfo = {
            'vote_id': this.state.voteId,
            'name': this.state.name,
            // 'name_ex': this.state.name_ex,
            'limit': this.state.limit
        }

        console.log(electorateInfo)

        try {
            await fetch('/admin/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(electorateInfo),
            })
                .then(result => result.json())
                .then(json => {
                    !json.result
                    ? confirmAlert({
                        customUI: () => {
                            return (
                                <Alert content='회원 정보를 확인해주세요.' label='확인' href={`/admin/${this.state.voteId}`} />
                            )
                        },
                        closeOnClickOutside: false
                    })
                    : this.setState({ limit: json.data })
                    console.log(json.data)
                })
                .catch(err => {
                    console.log(err)
                })
        } catch (err) {
            console.log(err)
        }
    }

    // 로그인 여부
    sessionApi = async () => {
        try {
            const response = await fetch('/session')
            if (response.status !== 200) throw Error(response.msg)
            return response.json()
        } catch (err) {
            console.log(err)
        }
    }

    render() {
        return (
            <div style={{ marginTop: 25, padding: 15 }}>
                <h3 style={{ marginTop: 30, marginBottom: 50, textAlign: 'center' }}>회원 인증번호 생성</h3>
                <Form onSubmit={this.handleElectorateSubmit}>
                    <NonLabelInputForm type='text' name='name' placeholder='이름을 입력해주세요.' change={this.handleChange} style={{ marginBottom: 8 }} />
                    {/* <NonLabelInputForm type='text' name='name_ex' placeholder='이름 구분자를 입력해주세요.' change={this.handleChange} style={{ marginBottom: 8 }} /> */}
                    <BlockButton type='submit' label='인증번호 받기' />
                    <DisableInput type='text' name='limit' placeholder={this.state.limit} change={this.handleChange} style={{ marginTop: 30 }} />
                </Form>
            </div>
        )
    }
}