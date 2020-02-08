import React, { Component } from 'react'
import { Button, Card, InputGroup } from 'react-bootstrap'
import { AlertClose } from '../../components/Alert'
import update from 'react-addons-update'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

import { Alert } from '../../components/Alert'
import { BlockButton } from '../../components/Button'
import { NonLabelInputForm } from '../../components/Form'

export default class LiveCheck extends Component {
    constructor(props) {
        super(props)
        this.state = {
            voteId: this.props.match.params.voteId,
            name: '',
            isAdmin: false, // 사용자 구분
            electorateList: [], // 선거권자 가져오기
            eleList: [], // 선거권자 리스트
        }
    }

    componentWillMount() {
        this.sessionApi()
            .then(res => {
                res.result
                    ? this.setState({ isAdmin: true })
                    : confirmAlert({
                        customUI: () => {
                            return (
                                <Alert content='관리자로 로그인 후 이용해주세요.' label='확인' href='/' />
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
                })
            })
                .then(result => result.json())
                .then(json => {
                    console.log(json.data)
                    if (json.status) {
                        this.setState({ electorateList: json.data })

                        this.state.electorateList.forEach((c) => {
                            this.setState({
                                eleList: update(this.state.eleList, { $push: [c.name] }),
                            })
                        })

                        console.log(this.state.eleList)

                        // confirmAlert({
                        //     customUI: () => {
                        //         return (
                        //             <Alert content='선거권자 인증에 성공했습니다.' label='확인' href={`/liveCheck/${voteId}`} />
                        //         )
                        //     },
                        //     closeOnClickOutside: false
                        // })
                    } else {
                        // confirmAlert({
                        //     customUI: () => {
                        //         return (
                        //             <Alert content='일치하는 회원이 없거나 이미 투표한 회원입니다.' label='확인' href={`/liveCheck/${voteId}`} />
                        //         )
                        //     },
                        //     closeOnClickOutside: false
                        // })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        } catch (err) {
            console.log(err)
        }
    }

    submitBtn = () => {
        window.location.assign(`/admin/${this.state.voteId}`)
    }

    sessionApi = async () => {
        try {
            const response = await fetch('/session')
            if (response.status !== 200) throw Error(response.json().msg)
            return response.json()
        } catch (err) {
            console.log(err)
        }
    }

    selectList(id) {
        console.log(id)
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <AlertClose content='선택' label='확인' close={() => onClose()} />
                )
            },
            closeOnClickOutside: false
        })
    }

    render() {
        let listItem = this.state.electorateList.map(c => {
            return (
                <li key={c._id} onClick={this.selectList(c._id)}>{c.name}</li>
            )
        })

        return (
            <div style={{ marginTop: 25, padding: 15, flex: 1 }}>
                <h3 style={{ marginTop: 30, marginBottom: 50, textAlign: 'center' }}>현장 인증</h3>
                <Card>
                    <Card.Body>
                        <InputGroup size='lg'>
                            <NonLabelInputForm type='text' name='name' placeholder='이름을 입력해주세요.' change={this.handleChange} />
                            <InputGroup.Append>
                                <Button variant="outline-secondary" onClick={this.authSubmit}>확인</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Card.Body>
                </Card>
                {listItem}
                {this.state.isAdmin
                    && <>
                        <div style={{ marginTop: 40 }}>
                            <BlockButton click={this.submitBtn} label='현재 투표 현황' />
                        </div>
                    </>
                }
            </div>
        )
    }
}