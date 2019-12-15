import React, { Component } from 'react'
import { Form } from 'react-bootstrap'

import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

import { Alert } from '../../components/Alert'
import { InputForm } from '../../components/Form'
import { BlockButton } from '../../components/Button'

export default class SignUp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            phone: '',
            password: '',
            name: ''
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

    // 관리자 등록
    signSubmit = async e => {
        e.preventDefault()

        const { phone, password, name } = this.state

        let signInfo = {
            'phone': phone,
            'password': password,
            'name': name
        }

        if (phone === '' || password === '' || name === '') {
            confirmAlert({
                customUI: () => {
                    return (
                        <Alert content='모든 항목에 값을 입력해주세요.' label='확인' href='' />
                    )
                },
                closeOnClickOutside: false
            })
        } else {
            try {
                const response = await fetch('/admin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(signInfo),
                })
                const res = await response.json()

                res.result
                    ? window.location.assign('/')
                    : confirmAlert({
                        customUI: () => {
                            return (
                                <Alert content='회원가입에 실패하였습니다.' label='확인' href='/signin' />
                            )
                        },
                        closeOnClickOutside: false
                    })
            } catch (err) {
                console.log(err)
            }
        }
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    render() {
        return (
            <div style={{ marginTop: 25, padding: 25 }}>
                <h3 style={{ marginTop: 30, textAlign: 'center' }}>관리자 회원가입</h3>
                <Form style={{ padding: 25, marginTop: 10 }} onSubmit={this.signSubmit}>
                    <InputForm label='핸드폰 번호' type='number' name='phone' placeholder='핸드폰 번호를 입력하세요.' change={this.handleChange} />
                    <InputForm label='비밀번호' type='password' name='password' placeholder='비밀번호를 입력하세요.' change={this.handleChange} />
                    <InputForm label='이름' type='text' name='name' placeholder='이름을 입력하세요.' change={this.handleChange} />
                    <BlockButton label='관리자 가입' type='submit' />
                </Form>
            </div>
        )
    }
}