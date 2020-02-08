import React, { Component } from 'react'
import { ListGroup } from 'react-bootstrap'
import moment from 'moment'

import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

import { Alert } from '../../components/Alert'
import { VoteListItem } from '../../components/List'

export default class Result extends Component {
    constructor(props) {
        super(props)
        this.state = {
            voteList: [] // 선거 목록 저장
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

        this.voteListApi()
            .then(res => this.setState({ voteList: res.data }))
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

    // 완료된 선거 목록 조회
    voteListApi = async () => {
        try {
            const response = await fetch('/list/2')
            if (response.status !== 200) throw Error(response.msg)
            return response.json()
        } catch (err) {
            console.log(err)
        }
    }

    render() {
        return (
            <div style={{ margin: 25 }}>
                <h3>완료된 선거 목록</h3>
                <div style={{ marginLeft: 10, marginRight: 10 }}>
                    <ListGroup variant='flush'>
                        <hr />
                        {this.state.voteList.map(voteList => {
                            return (
                                <VoteListItem
                                    href={`/resultCheck/${voteList._id}`}
                                    key={`voteList-${voteList._id}`}
                                    title={voteList.title}
                                    begin_date={moment(voteList.begin).format('YYYY-MM-DD')}
                                    end_date={moment(voteList.end).format('YYYY-MM-DD')}
                                />
                            )
                        })}
                        <hr />
                    </ListGroup>
                </div>
            </div>
        )
    }
}