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
        
        this.count()
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

    sessionApi = async () => {
        try {
            const response = await fetch('/session')
            if (response.status !== 200) throw Error(response.json().msg)
            return response.json()
        } catch (err) {
            console.log(err)
        }
    }

    render() {
        let listItem = this.state.electorateList.map(c => {
            if (c.status === 0) {
                return (
                    <li key={c._id} style={{ margin: '1rem', textAlign: 'center', fontSize: '1.4rem', listStyle: 'none' }}>{c.name}</li>
                )
            } else {
                return (
                    <li key={c._id} style={{ margin: '1rem', color: 'steelblue', textAlign: 'center', fontSize: '1.4rem', listStyle: 'none' }}>{c.name} (투표 용지 수령)</li>
                )
            }
        })

        return (
            <div style={{ marginTop: 25, padding: 15, flex: 1 }}>
                <h3 style={{ marginTop: 30, marginBottom: 50, textAlign: 'center' }}>선거권자 인증</h3>
                <div style={{ marginTop: 40 }}>
                    <h5 style={{ marginTop: 30, marginBottom: 50, textAlign: 'center' }}>전체 투표 현황 : {this.state.count}명 / {this.state.totalCount}명</h5>
                </div>
                {listItem}
            </div>
        )
    }
}