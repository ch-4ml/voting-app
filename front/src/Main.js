import React, { Component } from 'react'
import { ListGroup } from 'react-bootstrap'
import moment from 'moment'

import { VoteListItem } from './components/List'

export default class Main extends Component {
    constructor(props) {
        super(props)
        this.state = {
            voteList: [] // 선거 목록 저장
        }
    }

    componentDidMount() {
        this.voteListApi()
            .then(res => this.setState({ voteList: res.data }))
            .catch(err => console.log(err))
    }

    // 진행 중인 선거 목록 조회
    voteListApi = async () => {
        try {
            const response = await fetch('/list/1')
            if (response.status !== 200) throw Error(response.json().msg)
            return response.json()
        } catch (err) {
            console.log(err)
        }
    }

    render() {
        return (
            <div style={{ margin: 25 }}>
                <h3>진행중인 선거 목록</h3>
                <div style={{ marginLeft: 10, marginRight: 10 }}>
                    <ListGroup variant='flush'>
                        <hr />
                        {this.state.voteList.map(voteList => {
                            return (
                                <VoteListItem
                                    href={`/liveCheck/${voteList._id}`}
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