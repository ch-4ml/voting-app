import React, { Component } from 'react'
import { Button, Card, InputGroup } from 'react-bootstrap'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import moment from 'moment'

import { Alert, AlertClose, Confirm } from '../../components/Alert'
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
            rank: 99, // 사용자 등급 (0: 최고관리자 / 1: 관리자)
        }
    }

    componentWillMount() {
        this.sessionApi()
            .then(res => {
                res.result
                    ? this.setState({ isAdmin: true }) || this.setState({ rank: res.data._doc.rank })
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
        
        this.count()
        this.totalCount()
    }

    componentDidMount() {
        this.trigger()
    }

    trigger() {
        setInterval(() => {
            this.count()
            //this.totalCount()
        }, 5000);
    }

    async totalCount() {
        try {
            await fetch('/electorate/all', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'vote_id': this.state.voteId,
                })
            })
                .then(result => result.json())
                .then(json => {
                    this.setState( { totalCount: Object.keys(json.data).length, electorateList: json.data })
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
                    'vote_id': this.state.voteId,
                })
            })
                .then(result => result.json())
                .then(json => {
                    this.setState( { count: json.data })
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

    handleKeyPress = e => {
        if(e.charCode === 13 || e.key === 'Enter') {
            this.authSubmit();
        }
    }

    // 선거권자 인증
    authSubmit = async () => {
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
        if (status === 1) { // 이미 투표용지 수령한 상태
            if (this.state.rank === 0) {
                confirmAlert({
                    customUI: ({ onClose }) => {
                        return (
                            <Confirm content={`해당 인증을 취소하시겠습니까?`} lblConfirm='확인' lblClose='닫기' confirm={ async () => this.uncheck(id) } close={ () => onClose() } />
                        )
                    },
                    closeOnClickOutside: false
                })
            } else {
                confirmAlert({
                    customUI: ({ onClose }) => {
                        return (
                            <AlertClose content='이미 투표용지를 수령한 선거권자입니다.' label='확인' close={() => onClose()} />
                        )
                    },
                    closeOnClickOutside: false
                })
            }
        } else {
            try {
                // 선거권자를 먼저 쿼리
                const electorate = await fetch('/electorate/id', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        'vote_id': this.state.voteId,
                        'electorate_id': id,
                    })
                })

                // 쿼리 결과를 json 객체로 변경
                const json = await electorate.json();
                if (json.status) {
                    if (!json.data.status) { // status가 0(인증하지 않은 상태)인 경우
                        // 이 사용자를 인증할 지 확인
                        confirmAlert({
                            customUI: ({ onClose }) => {
                                return (
                                    <Confirm content={`${json.data.name}님을 인증하시겠습니까?`} lblConfirm='확인' lblCancel='취소' confirm={ async () => this.check(id) } cancel={ () => onClose() } />
                                )
                            },
                            closeOnClickOutside: false
                        })
                    } else { // status가 1(인증한 상태)인 경우
                        // 이미 수령했다는 메시지 출력
                        confirmAlert({
                            customUI: ({ onClose }) => {
                                return (
                                    <AlertClose content='이미 투표 용지를 수령한 선거권자입니다.' label='확인' close={() => onClose()} />
                                )
                            },
                            closeOnClickOutside: false
                        })
                    }
                }
            } catch (err) {
                console.log(err)
            }
        }
    }

    async check(id) {
        try {
                const result = await fetch('/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'electorate_id': id
                })
            })

            // 쿼리 결과를 json 객체로 변경
            const json = await result.json();
            if(json.status) { // 상태 변경 성공한 경우
                confirmAlert({
                    customUI: () => {
                        return (
                            <Alert content='인증되었습니다. 투표 용지를 교부해주세요.' label='확인' href={`/liveCheck/${this.state.voteId}`} />
                        )
                    },
                    closeOnClickOutside: false
                })
            }
        } catch (err) {
            console.log(err);
        }
    }

    async uncheck(id) {
        try {
            const result = await fetch('/uncheck', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'electorate_id': id
                })
            })

            // 쿼리 결과를 json 객체로 변경
            const json = await result.json();
            if(json.status) { // 상태 변경 성공한 경우
                confirmAlert({
                    customUI: () => {
                        return (
                            <Alert content='인증이 취소되었습니다.' label='확인' href={`/liveCheck/${this.state.voteId}`} />
                        )
                    },
                    closeOnClickOutside: false
                })
            }
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        let listItem = this.state.electorateList.map(c => {
            if (c.status === 0) {
                return (
                    <li key={c._id} onClick={() => { this.selectList(c._id, c.status) }} style={{ margin: '1rem', textAlign: 'center', fontSize: '1.4rem', listStyle: 'none' }}>{c.name} ({moment(c.birth).format('YYYY-MM-DD')})</li>
                )
            } else {
                return (
                    <li key={c._id} onClick={() => { this.selectList(c._id, c.status) }} style={{ margin: '1rem', color: 'steelblue', textAlign: 'center', fontSize: '1.4rem', listStyle: 'none' }}>{c.name} - 투표 용지 수령</li>
                )
            }
        })

        return (
            <div style={{ marginTop: 25, padding: 15, flex: 1 }}>
                <h3 style={{ marginTop: 30, marginBottom: 50, textAlign: 'center' }}>선거권자 인증</h3>
                <div style={{ marginTop: 40 }}>
                    <h5 style={{ marginTop: 30, marginBottom: 50, textAlign: 'center' }}>현재 투표 현황 : {this.state.count}명</h5>
                </div>
                <Card>
                    <Card.Body>
                        <InputGroup size='lg'>
                            <NonLabelInputForm type='text' name='name' placeholder='이름을 입력해주세요.' change={this.handleChange} onKeyPress={this.handleKeyPress} />
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
