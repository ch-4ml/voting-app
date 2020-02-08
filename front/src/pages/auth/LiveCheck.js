import React, { Component } from 'react'
import { Button, Card, InputGroup } from 'react-bootstrap'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

import { Alert, AlertClose } from '../../components/Alert'
import { NonLabelInputForm } from '../../components/Form'

export default class LiveCheck extends Component {
    constructor(props) {
        super(props)
        this.state = {
            voteId: this.props.match.params.voteId,
            name: '',
            isAdmin: false, // 사용자 구분
            electorateList: [], // 검색된 선거권자 가져오기
            totalCount: '',
            count: '',
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

    componentDidMount() {
        // this.count()
        this.totalCount()
    }

    async totalCount() {
        try {
            await fetch('/electorate/all', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'vote_id': this.state.vote_id,
                })
            })
                .then(result => result.json())
                .then(json => {
                    console.log(json.data)
                    // this.setState( { totalCount: json.data.length })
                })
                .catch(err => {
                    console.log(err)
                })
        } catch (err) {
            console.log(err)
        }
    }

    async count() {
        try {
            await fetch('/count', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'vote_id': this.state.vote_id,
                })
            })
                .then(result => result.json())
                .then(json => {
                    console.log(json.data)
                })
                .catch(err => {
                    console.log(err)
                })
        } catch (err) {
            console.log(err)
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
                })
            })
                .then(result => result.json())
                .then(json => {
                    console.log(json.data)
                    if (json.status) {
                        this.setState({ electorateList: json.data })
                    } else {
                        confirmAlert({
                            customUI: ({ onClose }) => {
                                return (
                                    <AlertClose content='일치하는 선거권자가 없습니다.' label='확인' close={() => onClose()} />
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

    submitBtn = () => {
        window.location.assign(`/liveCheck/${this.state.voteId}`)
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

    async selectList(id, status) {
        if (status === 1) {
            confirmAlert({
                customUI: ({ onClose }) => {
                    return (
                        <AlertClose content='이미 투표용지를 수령하셨습니다.' label='확인' close={() => onClose()} />
                    )
                },
                closeOnClickOutside: false
            })
        } else {
            try {
                await fetch('/check', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        'electorate_id': id,
                    })
                })
                    .then(result => result.json())
                    .then(json => {
                        if (json.status) {
                            confirmAlert({
                                customUI: () => {
                                    return (
                                        <Alert content='인증되었습니다. 투표 용지를 수령하세요.' label='확인' href={`/liveCheck/${this.state.voteId}`} />
                                    )
                                },
                                closeOnClickOutside: false
                            })
                        } else {
                            confirmAlert({
                                customUI: ({ onClose }) => {
                                    return (
                                        <AlertClose content='이미 투표 용지를 수령하셨습니다.' label='확인' close={() => onClose()} />
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
    }

    render() {
        let listItem = this.state.electorateList.map(c => {
            if (c.status === 0) {
                return (
                    <li key={c._id} onClick={() => { this.selectList(c._id, c.status) }}>{c.name}</li>
                )
            } else {
                return (
                    <li key={c._id} onClick={() => { this.selectList(c._id, c.status) }}  style={{ background: 'chocolate' }}>{c.name}</li>
                )
            }
        })

        return (
            <div style={{ marginTop: 25, padding: 15, flex: 1 }}>
                <h3 style={{ marginTop: 30, marginBottom: 50, textAlign: 'center' }}>선거권자 인증</h3>
                <div style={{ marginTop: 40 }}>
                    <h5 style={{ marginTop: 30, marginBottom: 50, textAlign: 'center' }}>현재 투표 현황 : /{this.state.totalCount}명</h5>
                </div>
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
            </div>
        )
    }
}