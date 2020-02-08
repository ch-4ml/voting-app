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

            electorateList: '',

            isOpen: false,
            eleDataLoaded: false,
            isFormInvalidEle: false,
            uploadedEleFileName: '',
            eleRows: null,
            eleCols: null,

            isVoteSubmit: false,
        }
        this.fileEleInput = React.createRef()
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

   // 새로운 선거권자 등록 api fetch
   handleCreateVoteElectorateSubmit = async e => {
    e.preventDefault()

    const { vote_id, electorateList } = this.state

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

    else if (electorateList === '') {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <AlertClose content='선거권자 파일을 등록해주세요.' label='확인' close={() => onClose()} />
                )
            },
            closeOnClickOutside: false
        })

        return false;
    }

    else {

        console.log(`vote_id: ${vote_id}`)
        const eList = electorateList
        const count = 500
        let list = []
        for (let i = 0; i <= (eList.length - 1) / count; i++) {
            // header 빼야 해서 + 1 한거
            let finish = i === parseInt((eList.length - 1) / count) ? eList.length : (i + 1) * count + 1
            for (let j = i * count + 1; j < finish; j++) {
                list.push(eList[j])
                console.log(eList[j])
            }
            try {
                await fetch('/admin/electorate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        'vote_id': vote_id,
                        'electorates': list
                    })
                })
            } catch (err) {
                console.log(err)
            }
            list = []
        }

        // JSON으로 parsing하면?
        // console.log(`JSON Parsing: ${JSON.parse(JSON.stringify({electorates: electorateList})).electorates}`); // 잘 나옴
        // parse 했으니까 추출 될까??
        // console.log(`JSON Parsing: ${JSON.parse(JSON.stringify({electorates: electorateList})).electorates[1]}`); // 응 안돼 [ 나와 
        // console.log(`object type electorateList length: ${Object.keys(electorateList).length}`)

        // 대체 POST할때 어떤 일이 발생하길래 저 밑에건 되는지 모르겠네
        // try {
        //     await fetch('/admin/electorate', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             'vote_id': vote_id,
        //             'electorates': electorateList
        //         })
        //     })
        // } catch (err) {
        //     console.log(err)
        // }
    }
}

    handleScrollToStats = () => {
        window.scrollTo({
            top: this.statsRef.current.offsetTop
        })
    }

    renderElectorateFile = (fileObj) => {
        ExcelRenderer(fileObj, (err, resp) => {
            if (err) {
                console.log(err)
            }
            else {
                this.setState({
                    eleDataLoaded: true,
                    eleCols: resp.cols,
                    eleRows: resp.rows.slice(1, resp.rows.length)
                })
            }
            console.log(resp.rows.slice(1, resp.rows.length))
            console.log(JSON.stringify(resp.rows))
            // console.log(JSON.parse(resp.rows))
            console.log(typeof (resp.rows))
            console.log(resp.rows[0])
            console.log(Object.keys(resp.rows).length)
            this.setState({ electorateList: resp.rows })
        })
    }

    fileElectorateHandler = (event) => {
        if (event.target.files.length) {
            let fileObj = event.target.files[0]
            let fileName = fileObj.name

            if (fileName.slice(fileName.lastIndexOf('.') + 1) === "xlsx") {
                this.setState({
                    uploadedEleFileName: fileName,
                    isFormInvalidEle: false
                })
                this.renderElectorateFile(fileObj)
            }
            else {
                this.setState({
                    isFormInvalidEle: true,
                    uploadedEleFileName: ""
                })
            }
        }
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    openEleFileBrowser = () => {
        this.fileEleInput.current.click()
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
                <h3 style={{ marginTop: 30, marginBottom: 20, textAlign: 'center' }}>선거권자 등록</h3>
                <VoteForm
                    onSubmit={this.handleCreateVoteElectorateSubmit}
                    title='선거권자 파일 등록'
                    onClick={this.openEleFileBrowser}
                    label='선거권자 파일 등록'
                    onChange={this.fileElectorateHandler}
                    refs={this.fileEleInput}
                    value={this.state.uploadedEleFileName}
                    dataLoaded={this.state.eleDataLoaded}
                    data={this.state.eleRows}
                    columns={this.state.eleCols} />
                <BlockButton label='선거 등록' click={this.submitBtn} />
            </div>
        )
    }
}