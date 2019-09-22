import React, { Component } from 'react';
import { ListGroup } from 'react-bootstrap';

import Navbar from './Navbar';

export default class IngList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            response: '',
        }
    }

    componentDidMount() {
        this.callApi()
          .then(res => this.setState({ response: res.express }))
          .catch(err => console.log(err));
      }
      
      callApi = async () => {
        const response = await fetch('admin/vote');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
      };

    render() {
        return (
            <div>
                <Navbar />
                <div style={{ margin: 25 }}>
                    <p>{this.state.response}</p>
                    <h3>진행중인 선거 목록</h3>
                    <div style={{ marginLeft: 10, marginRight: 10 }}>
                        <ListGroup variant='flush'>
                            <hr />
                            {/* 세션 없으면 */}
                            <ListGroup.Item action href='/auth'>
                                {/* 세션 있으면 /voting */}
                                <div className='row'>
                                    <img
                                        alt=''
                                        src={require('./images/jeongeui_logo_icon.png')}
                                        width='30'
                                        height='30'
                                        style={{ marginRight: 10 }}
                                    />
                                    <h4>제 2회 교회 총 선거선거선거선</h4>
                                </div>
                                <h5 style={{ textAlign: 'right' }}>2019.09.16 ~ 2019.09.30</h5>
                            </ListGroup.Item>
                            <ListGroup.Item action href='/Voting'>
                                <div className='row'>
                                    <img
                                        alt=''
                                        src={require('./images/jeongeui_logo_icon.png')}
                                        width='30'
                                        height='30'
                                        style={{ marginRight: 10 }}
                                    />
                                    <h4>제 2회 교회 총 선거선거선거선</h4>
                                </div>
                                <h5 style={{ textAlign: 'right' }}>2019.09.16 ~ 2019.09.30</h5>
                            </ListGroup.Item>
                            <ListGroup.Item action href='#link3'>
                                <div className='row'>
                                    <img
                                        alt=''
                                        src={require('./images/jeongeui_logo_icon.png')}
                                        width='30'
                                        height='30'
                                        style={{ marginRight: 10 }}
                                    />
                                    <h4>제 2회 교회 총 선거선거선거선</h4>
                                </div>
                                <h5 style={{ textAlign: 'right' }}>2019.09.16 ~ 2019.09.30</h5>
                            </ListGroup.Item>
                            <hr />
                        </ListGroup>
                    </div>
                </div>
            </div>
        );
    }
}