import React, { Component, createRef } from 'react'
import { ExcelRenderer } from 'react-excel-renderer'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import 'react-daterange-picker/dist/css/react-calendar.css'

import { Alert, AlertClose } from '../../components/Alert'
import { VoteForm } from '../../components/Form'
import { BlockButton } from '../../components/Button'

export default class Create extends Component {
    constructor(props) {
        super(props)
        this.statsRef = createRef()
        this.state = {
            vote_id: this.props.match.params.voteId,

            candidateList1: '',
            candidateList2: '',
            candidateList3: '',

            isOpen: false,
            can1DataLoaded: false,
            can2DataLoaded: false,
            can3DataLoaded: false,
            isFormInvalidCan1: false,
            isFormInvalidCan2: false,
            isFormInvalidCan3: false,
            uploadedCan1FileName: '',
            uploadedCan2FileName: '',
            uploadedCan3FileName: '',
            can1Rows: null,
            can1Cols: null,
            can2Rows: null,
            can2Cols: null,
            can3Rows: null,
            can3Cols: null,

            isCandidate1Submit: false,
            isCandidate2Submit: false,
            isCandidate3Submit: false,
        }

        this.fileCan1Input = React.createRef()
        this.fileCan2Input = React.createRef()
        this.fileCan3Input = React.createRef()
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

    // 새로운 후보자1 등록 api fetch
    handleCreateVoteCandidate1Submit = async e => {
        e.preventDefault()

        const { vote_id, candidateList1 } = this.state

        if (vote_id === '') {
            confirmAlert({
                customUI: ({ onClose }) => {
                    return (
                        <AlertClose content='먼저 선거를 생성해주세요.' label='확인' close={() => onClose()} />
                    )
                },
                closeOnClickOutside: false
            })

            return false;
        }

        else if (candidateList1 === '') {
            confirmAlert({
                customUI: ({ onClose }) => {
                    return (
                        <AlertClose content='장로 피선거권자 파일을 등록해주세요.' label='확인' close={() => onClose()} />
                    )
                },
                closeOnClickOutside: false
            })

            return false;
        }

        else {
            await fetch('/admin/candidate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'vote_id': vote_id,
                    'candidates': candidateList1,
                    'type': 1
                })
            }).then(result => result.json())
                .then(json => {
                    console.log(json.msg)
                    this.setState({ isCandidate1Submit: true })
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    // 새로운 후보자2 등록 api fetch
    handleCreateVoteCandidate2Submit = async e => {
        e.preventDefault()

        const { vote_id, candidateList2 } = this.state

        if (vote_id === '') {
            confirmAlert({
                customUI: ({ onClose }) => {
                    return (
                        <AlertClose content='먼저 선거를 생성해주세요.' label='확인' close={() => onClose()} />
                    )
                },
                closeOnClickOutside: false
            })

            return false;
        }

        else if (candidateList2 === '') {
            confirmAlert({
                customUI: ({ onClose }) => {
                    return (
                        <AlertClose content='안수집사 피선거권자 파일을 등록해주세요.' label='확인' close={() => onClose()} />
                    )
                },
                closeOnClickOutside: false
            })

            return false;
        }

        else {

            await fetch('/admin/candidate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'vote_id': vote_id,
                    'candidates': candidateList2,
                    'type': 2
                })
            }).then(result => result.json())
                .then(json => {
                    console.log(json.msg)
                    this.setState({ isCandidate2Submit: true })
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    // 새로운 후보자3 등록 api fetch
    handleCreateVoteCandidate3Submit = async e => {
        e.preventDefault()

        const { vote_id, candidateList3 } = this.state

        if (vote_id === '') {
            confirmAlert({
                customUI: ({ onClose }) => {
                    return (
                        <AlertClose content='먼저 선거를 생성해주세요.' label='확인' close={() => onClose()} />
                    )
                },
                closeOnClickOutside: false
            })

            return false;
        }

        else if (candidateList3 === '') {
            confirmAlert({
                customUI: ({ onClose }) => {
                    return (
                        <AlertClose content='권사 피선거권자 파일을 등록해주세요.' label='확인' close={() => onClose()} />
                    )
                },
                closeOnClickOutside: false
            })

            return false;
        }

        else {

            await fetch('/admin/candidate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'vote_id': vote_id,
                    'candidates': candidateList3,
                    'type': 3
                })
            }).then(result => result.json())
                .then(json => {
                    console.log(json.msg)
                    this.setState({ isCandidate3Submit: true })
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

    renderCandidate1File = (fileObj) => {
        ExcelRenderer(fileObj, (err, resp) => {
            if (err) {
                console.log(err)
            }
            else {
                this.setState({
                    can1DataLoaded: true,
                    can1Cols: resp.cols,
                    can1Rows: resp.rows
                })
            }
            this.setState({ candidateList1: JSON.stringify(resp.rows) })
        })
    }

    renderCandidate2File = (fileObj) => {
        ExcelRenderer(fileObj, (err, resp) => {
            if (err) {
                console.log(err)
            }
            else {
                this.setState({
                    can2DataLoaded: true,
                    can2Cols: resp.cols,
                    can2Rows: resp.rows
                })
            }
            this.setState({ candidateList2: JSON.stringify(resp.rows) })
        })
    }

    renderCandidate3File = (fileObj) => {
        ExcelRenderer(fileObj, (err, resp) => {
            if (err) {
                console.log(err)
            }
            else {
                this.setState({
                    can3DataLoaded: true,
                    can3Cols: resp.cols,
                    can3Rows: resp.rows
                })
            }
            this.setState({ candidateList3: JSON.stringify(resp.rows) })
        })
    }

    fileCandidate1Handler = (event) => {
        if (event.target.files.length) {
            let fileObj = event.target.files[0]
            let fileName = fileObj.name

            if (fileName.slice(fileName.lastIndexOf('.') + 1) === "xlsx") {
                this.setState({
                    uploadedCan1FileName: fileName,
                    isFormInvalidCan1: false
                })
                this.renderCandidate1File(fileObj)
            }
            else {
                this.setState({
                    isFormInvalidCan1: true,
                    uploadedCan1FileName: ""
                })
            }
        }
    }

    fileCandidate2Handler = (event) => {
        if (event.target.files.length) {
            let fileObj = event.target.files[0]
            let fileName = fileObj.name

            if (fileName.slice(fileName.lastIndexOf('.') + 1) === "xlsx") {
                this.setState({
                    uploadedCan2FileName: fileName,
                    isFormInvalidCan2: false
                })
                this.renderCandidate2File(fileObj)
            }
            else {
                this.setState({
                    isFormInvalidCan2: true,
                    uploadedCan2FileName: ""
                })
            }
        }
    }

    fileCandidate3Handler = (event) => {
        if (event.target.files.length) {
            let fileObj = event.target.files[0]
            let fileName = fileObj.name

            if (fileName.slice(fileName.lastIndexOf('.') + 1) === "xlsx") {
                this.setState({
                    uploadedCan3FileName: fileName,
                    isFormInvalidCan3: false
                })
                this.renderCandidate3File(fileObj)
            }
            else {
                this.setState({
                    isFormInvalidCan3: true,
                    uploadedCan3FileName: ""
                })
            }
        }
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    openCan1FileBrowser = () => {
        this.fileCan1Input.current.click()
    }

    openCan2FileBrowser = () => {
        this.fileCan2Input.current.click()
    }

    openCan3FileBrowser = () => {
        this.fileCan3Input.current.click()
    }

    callApi = async () => {
        const response = await fetch('/session')
        if (response.status !== 200) throw Error(response.msg)
        return response.json()
    }

    submitBtn = () => {
        window.location.assign('/')
    }

    render() {
        return (
            <div style={{ marginTop: 25, padding: 15 }}>
                <h3 style={{ marginTop: 30, marginBottom: 20, textAlign: 'center' }}>후보자 등록</h3>
                <VoteForm
                    onSubmit={this.handleCreateVoteCandidate1Submit}
                    title='장로 피선거권자 파일 등록'
                    onClick={this.openCan1FileBrowser}
                    disabled={this.candidateList1}
                    label='장로 파일 등록'
                    onChange={this.fileCandidate1Handler}
                    refs={this.fileCan1Input}
                    value={this.state.uploadedCan1FileName}
                    dataLoaded={this.state.can1DataLoaded}
                    data={this.state.can1Rows}
                    columns={this.state.can1Cols}
                    subBtn={this.state.isCandidate1Submit} />
                <VoteForm
                    onSubmit={this.handleCreateVoteCandidate2Submit}
                    title='안수집사 피선거권자 파일 등록'
                    onClick={this.openCan2FileBrowser}
                    disabled={this.candidateList2}
                    label='안수집사 파일 등록'
                    onChange={this.fileCandidate2Handler}
                    refs={this.fileCan2Input}
                    value={this.state.uploadedCan2FileName}
                    dataLoaded={this.state.can2DataLoaded}
                    data={this.state.can2Rows}
                    columns={this.state.can2Cols}
                    subBtn={this.state.isCandidate2Submit} />
                <VoteForm
                    onSubmit={this.handleCreateVoteCandidate3Submit}
                    title='권사 피선거권자 파일 등록'
                    onClick={this.openCan3FileBrowser}
                    disabled={this.candidateList3}
                    label='권사 파일 등록'
                    onChange={this.fileCandidate3Handler}
                    refs={this.fileCan3Input}
                    value={this.state.uploadedCan3FileName}
                    dataLoaded={this.state.can3DataLoaded}
                    data={this.state.can3Rows}
                    columns={this.state.can3Cols}
                    subBtn={this.state.isCandidate3Submit} />
                <BlockButton label='선거 등록' click={this.submitBtn} />
            </div>
        )
    }
}