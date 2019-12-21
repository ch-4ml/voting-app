import React, { Component } from 'react'
import { ProgressBar } from 'react-bootstrap'
import { confirmAlert } from 'react-confirm-alert'
import ReactExport from 'react-export-excel'
import 'react-confirm-alert/src/react-confirm-alert.css'

import { Alert } from '../../components/Alert'
import { BlockButton } from '../../components/Button'

const ExcelFile = ReactExport.ExcelFile
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet

export default class ResultDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            voteId: this.props.match.params.voteId,
            vote: [],
            candidate: [],
            exportVote: [],
            canVote: 0,
            totalVote: 0
        }
    }

    componentDidMount() {
        this._isMounted = true

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

        this.voteDetailApi()
    }

    // 로그인 여부
    sessionApi = async () => {
        try {
            const response = await fetch('/session')
            if (response.status !== 200) throw Error(response.json().msg)
            return response.json()
        } catch (err) {
            console.log(err)
        }
    }

    // 선거 상세 조회
    voteDetailApi = async () => {
        try {
            await fetch('/finvote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'vote_id': this.state.voteId
                })
            })
                .then(result => result.json())
                .then(json => {
                    console.log(json.voteData)
                    console.log(json.candidateData.candidates3[0])

                    this.setState({ vote: json.voteData, candidate: json.candidateData.candidates3[0].candidates3 })

                    // if (this.state.vote.status !== 2) {
                    //     confirmAlert({
                    //         customUI: () => {
                    //             return (
                    //                 <Alert content='완료된 선거의 결과만 볼 수 있습니다.' label='확인' href='/' />
                    //             )
                    //         },
                    //         closeOnClickOutside: false
                    //     })
                    // }
                })
                .catch(err => {
                    console.log(err)
                })
        } catch (err) {
            console.log(err)
        }
    }

    render() {
        let resultPg = this.state.candidate.map((c, index) => {
            let result = ((c.votes / this.state.vote.votes3) * 100).toFixed(1)
            this.state.exportVote.push([index + 1, c.name, c.birth, c.phone, c.votes])
            // result >= 50 && this.state.exportVote.push([c.name, c.votes, result, c.phone])
            return (
                <>
                    <h5 style={{ marginTop: 10 }}>{c.name}님 - {c.votes}표 득표</h5>
                    {result >= 50 ?
                        <ProgressBar striped variant="info" now={result} label={`${result}%`} />
                        : <ProgressBar striped variant="warning" now={result} label={`${result}%`} />
                    }
                </>
            )
        })

        let dataSet = [
            {
                columns: ["NO", "이름", "생년월일", "휴대폰", "투표 수"],
                data: this.state.exportVote,
            }
        ]

        return (
            <div style={{ margin: 25 }}>
                <h3 style={{ marginBottom: 15 }}>{this.state.vote.title}</h3>
                <div style={{ padding: '5px', backgroundColor: '#fafafa' }}>
                    <div style={{ padding: '10px' }}>
                        {resultPg}
                    </div>
                </div>
                <BlockButton type='button' click={() => window.location.assign('/results')} label='뒤로가기' />
                <ExcelFile
                    filename={`${this.state.vote.title} 결과`}
                    element={<BlockButton type='button' label='득표 수 50% 이상 후보자 엑셀로 내보내기' />}>
                    <ExcelSheet dataSet={dataSet} name='vote' />
                </ExcelFile>
            </div>
        )
    }
}