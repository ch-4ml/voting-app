import React, { Component } from 'react'
import List from 'react-list-select'
import update from 'react-addons-update'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

import { Alert, AlertClose } from '../../components/Alert'
import { BlockButton } from '../../components/Button'

export default class Voting extends Component {
    constructor(props) {
        super(props)
        this.state = {
            voteId: this.props.match.params.voteId,
            type: this.props.match.params.type,
            vote: [], // 선거 정보 가져옴
            candidate: [], // 후보자 정보 가져옴
            ingLimit: 0, // 선택한 후보자 수
            canList: [], // 리스트 띄우기용 후보자의 이름 저장
            canIdArray: [], // 리스트 번호랑 후보자 번호 매칭용
            canArray: [], // 선택한 리스트의 번호
            canNewArray: [], // 선택한 후보자의 번호
            status: false, // 후보자를 더 선택할 수 있으면 false, 아니면 true
        }
        this.handleChecked = this.handleChecked.bind(this)
    }

    componentDidMount() {
        this._isMounted = true

        if (this.state.type === 1) {
            switch (window.sessionStorage.getItem('status')) {
                case 0:
                    break;
                case 1:
                    window.location.assign(`/voting/${this.state.voteId}/2`)
                    break;
                case 2:
                    window.location.assign(`/voting/${this.state.voteId}/3`)
                    break;
                default:
                    window.location.assign('/')
                    break;
            }
        }

        try {
            this.voteApi()
        } catch (err) {
            console.log(err)
        }
    }

    voteApi = async () => {
        try {
            await fetch('/vote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'vote_id': this.state.voteId,
                    'type': this.state.type
                })
            })
                .then(result => result.json())
                .then(json => {
                    this.setState({ vote: json.voteData, candidate: json.candidateData })
                    // 원래 this.state.candidate.map 이었음
                    this.state.candidate.foreach((c) => {
                        this.setState({
                            // canList: update(this.state.canList, { $push: [c.name + c.name_ex] }),
                            canList: update(this.state.canList, { $push: [c.name] }),
                            canIdArray: update(this.state.canIdArray, { $push: [c.id] })
                        })
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        } catch (err) {
            console.log(err)
        }
    }

    voteSubmit = async e => {
        // 원래 this.state.canArray.map 이었음
        this.state.canArray.foreach((c) => {
            if (c !== null) {
                let ca = this.state.canIdArray[c]
                this.state.canNewArray.push(ca)
            }
            console.log(this.state.canNewArray)
        })

        if (this.state.canNewArray[0] != null) {
            e.preventDefault()
            try {
                await fetch('/vote', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        'vote_id': this.state.voteId,
                        'type': this.state.type,
                        'candidates': this.state.canNewArray
                    })
                })
                    .then(result => result.json())
                    .then(json => {
                        !json.result && confirmAlert({
                            customUI: () => {
                                return (
                                    <Alert content='투표가 정상적으로 진행되지 않았습니다.' label='확인' href='/' />
                                )
                            },
                            closeOnClickOutside: false
                        })
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } catch (err) {
                console.log(err)
            }

            this.setState({
                canNewArray: update(this.state.canNewArray, { $splice: [[0, this.state.canNewArray.length]] })
            })

            this.state.type === 3
                ? (
                    window.sessionStorage.setItem('status', 3),
                    window.location.assign('/')
                )
                : (
                    window.sessionStorage.setItem('status', this.state.type),
                    this.setState({ type: type + 1 }),
                    window.location.assign(`/voting/${this.state.voteId}/${this.state.type}`)
                )
        } else {
            confirmAlert({
                customUI: ({ onClose }) => {
                    return (
                        <AlertClose content='최소 한 명 이상의 후보자를 선택해주세요.' label='확인' close={() => onClose()} />
                    )
                },
                closeOnClickOutside: false
            })
        }
    }

    handleChecked = async (selected) => {
        let indexId
        if (selected.length > 1) {
            indexId = selected[selected.length - 1]
        } else {
            indexId = selected[0]
        }
        try {
            // 원래 this.state.canArray.map 이었음
            this.state.canArray.foreach((elem, index) => {
                if (elem === indexId) {
                    this.state.ingLimit -= 1
                    this.state.status = true
                    this.setState({
                        canArray: update(this.state.canArray, { $splice: [[index, 1]] })
                    })
                }
            })
            if (!this.state.status) {
                if (this.state.ingLimit < this.state.vote.limit) {
                    this.state.ingLimit += 1
                    this.setState({
                        canArray: update(this.state.canArray, { $push: [indexId] }),
                    })
                } else {
                    confirmAlert({
                        customUI: ({ onClose }) => {
                            return (
                                <AlertClose content='더 이상 선택하실 수 없습니다.' label='확인' close={() => onClose()} />
                            )
                        },
                        closeOnClickOutside: false
                    })
                }
            }
            this.state.status = false
        } catch (err) {
            console.log(err)
        }
    }

    render() {
        let canNameList = this.state.canArray.map(c => {
            return (
                <h5 style={{ margin: 10 }}>{this.state.canList[c]}</h5>
            )
        })

        return (
            <div style={{ margin: 25 }}>
                <h3>{this.state.vote.title}</h3>
                <h4 style={{ margin: 10 }}>선택한 후보자 : {this.state.ingLimit}명 / {this.state.vote.limit}명</h4>
                <h4 style={{ margin: 10 }}>현재 선택하신 후보자는 {this.state.canNewArray} 입니다.</h4>
                {canNameList}
                <div className='card' style={{ padding: '5px', backgroundColor: '#fafafa' }}>
                    <List
                        items={this.state.canList}
                        multiple={true}
                        onChange={(selected: number) => { this.handleChecked(selected) }}
                    />
                </div>
                <BlockButton type='button' click={this.voteSubmit} label='확인' />
            </div>
        )
    }
}