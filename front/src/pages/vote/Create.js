import React, { Component, createRef } from 'react'
import { Button, Form } from 'react-bootstrap'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import DateRangePicker from 'react-daterange-picker'
import 'react-daterange-picker/dist/css/react-calendar.css'
import moment from 'moment'

import { Alert, AlertClose } from '../../components/Alert'
import { BlockButton } from '../../components/Button'

export default class Create extends Component {
    constructor(props) {
        super(props)
        this.statsRef = createRef()
        this.state = {
            title: '',
            dates: null,
            context: '',
            maxDate: moment().add(24, 'days').toDate(),
            limit: '',
            vote_id: '',

            isVoteSubmit: false,
        }
    }

    componentDidMount() {
        this.callApi()
            .then(res => {
                if (!res.result) {
                    confirmAlert({
                        customUI: ({ onClose }) => {
                            return (
                                <Alert content='관리자만 접근 가능합니다.' href='/' label='확인' />
                            )
                        },
                        closeOnClickOutside: false
                    })
                }
            })
            .catch(err => console.log(err))
    }

    onSelect = dates => this.setState({ dates })

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    // 새로운 선거 등록 api fetch
    handleCreateVoteSubmit = async e => {
        e.preventDefault()

        const { title, dates, limit, context } = this.state

        if (title === '' || dates === '' || limit === '' || context === '') {
            confirmAlert({
                customUI: ({ onClose }) => {
                    return (
                        <AlertClose content='모든 항목에 값을 입력해주세요.' label='확인' close={() => onClose()} />
                    )
                },
                closeOnClickOutside: false
            })

            return false;
        }
        else {

            let voteInfo = {
                'title': title,
                'context': context,
                'begin_date': moment(dates.start).format('YYYY-MM-DD HH:mm:ss'),
                'end_date': moment(dates.end).format('YYYY-MM-DD HH:mm:ss'),
                'limit': limit
            }
            console.log(JSON.stringify(voteInfo))

            const response = fetch('/admin/vote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(voteInfo),
            })
            response.then(result => result.json())
                .then(json => {
                    console.log(json.msg)
                    this.setState({ vote_id: json.data, isVoteSubmit: true })
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    handleScrollToStats = () => {
        window.scrollTo({
            top: this.statsRef.current.offsetTop
        })
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    callApi = async () => {
        const response = await fetch('/session')
        if (response.status !== 200) throw Error(response.msg)
        return response.json()
    }

    submitBtn = () => {
        window.location.assign(`/insert/${this.state.vote_id}`)
    }

    render() {
        return (
            <div style={{ marginTop: 25, padding: 15 }}>
                <h3 style={{ marginTop: 30, marginBottom: 20, textAlign: 'center' }}>선거 만들기</h3>
                <Form style={{ padding: 25, marginTop: 10 }} onSubmit={this.handleCreateVoteSubmit}>
                    <Form.Group controlId='title'>
                        <Form.Label>선거 명</Form.Label>
                        <Form.Control type='text' name='title' size='lg' placeholder='선거 명을 입력하세요.' onChange={this.handleChange} disabled={this.state.isVoteSubmit} />
                    </Form.Group>
                    <Form.Group controlId='context'>
                        <Form.Label>선거 내용</Form.Label>
                        <Form.Control type='text' name='context' size='lg' placeholder='선거 설명을 입력하세요.' onChange={this.handleChange} disabled={this.state.isVoteSubmit} />
                    </Form.Group>
                    <Form.Group controlId='begin_date'>
                        <Form.Label>선거 날짜 범위 선택</Form.Label><br />
                        <DateRangePicker
                            maximumDate={this.state.maxDate}
                            onSelect={this.onSelect}
                            value={this.state.dates}
                            disabled={this.state.isVoteSubmit}
                        />
                    </Form.Group>
                    <Form.Group controlId='limit'>
                        <Form.Label>투표 선출 인원</Form.Label>
                        <Form.Control type='number' name='limit' size='lg' placeholder='투표 선출 인원 수를 입력하세요.' onChange={this.handleChange} disabled={this.state.isVoteSubmit} />
                    </Form.Group>
                    <Button variant='primary' type='submit' size='lg' disabled={this.state.isVoteSubmit}
                        style={{ marginTop: 13, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        선거 생성
                            </Button>
                </Form>
                <BlockButton label='선거권자 등록하기' click={this.submitBtn} />
            </div>
        )
    }
}