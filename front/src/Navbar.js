import React, { Component } from 'react'
import { Navbar, Nav } from 'react-bootstrap'

export default class NavbarClass extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: false,
      isRoot: false,
    }
  }

  componentDidMount() {
    this.sessionApi()
      .then(res => {
        res.result
          ? this.setState({ loggedIn: true })
          : this.setState({ loggedIn: false })
      })
      .catch(err => console.log(err))
  }

  sessionApi = async () => {
    try {
      const response = await fetch('/session')
      if (response.status !== 200) throw Error(response.msg)
      return response.json()
    } catch (err) {
      console.log(err)
    }
  }

  logout = async () => {
    try {
      const response = await fetch('/logout')
      this.setState({ loggedIn: false })
      if (response.status !== 200) throw Error(response.msg)
      return window.location.assign('/')
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    return (
      <React.Fragment>
        <Navbar bg='dark' variant='dark' expand='lg'>
          <Navbar.Brand href='/'>
            <img
              alt=''
              src={require('./images/jeongeui_logo.png')}
              className='d-inline-block align-top'
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='mr-auto'>
              <Nav.Link href='/'>진행중인 선거 목록</Nav.Link>
            </Nav>
            {this.state.loggedIn
            ? <Nav><Nav.Link href='/results'>완료된 선거 목록</Nav.Link><Nav.Link href='/create'>선거 만들기</Nav.Link><Nav.Link href='/' onClick={this.logout}>로그아웃</Nav.Link><Nav.Link href='/signup'>관리자 추가</Nav.Link></Nav>
              : <Nav><Nav.Link href='/signin'>관리자</Nav.Link></Nav>
            }
          </Navbar.Collapse>
        </Navbar>
      </React.Fragment>
    )
  }
}