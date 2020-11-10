import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
 
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    Row
} from 'reactstrap';
import axios from 'axios';

class Userlogin extends Component {

    constructor(props) {
        super(props);

        const token = localStorage.getItem('token');
        let loggedIn = true
        if (token == null) {
            loggedIn = false
        }

        this.state = {
            email: '',
            password: '',
            loggedIn
        };

        this.onChange_watch = this.onChange_watch.bind(this);
        this.submitForm = this.submitForm.bind(this);

    }

    async onChange_watch(e) {
        await this.setState({
            [e.target.name]: e.target.value
        });
    }


    submitForm(e) {
        e.preventDefault();
        axios.post('http://localhost:3010/' + 'login', { 'email': this.state.email, 'password': this.state.password }, {
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
        })
            .then((response) => {
                if (response.status === 200) {
                    localStorage.setItem("token", response.data.data.access_token);
                    localStorage.setItem("login_user_id", response.data.data.id);
                    localStorage.setItem("login_user_type", response.data.data.user_type);
                    this.setState({
                        loggedIn: true
                    });
                }
                else {
                    //  let username_and_password = response.data.message.message;//'Email And Password is Wrong. Please Try Again.';
                    //  this.setState({username_and_password});
                }
            })



    }

    render() {

        if(this.state.loggedIn)
        {
           return <Redirect to="/dashboard" />
        }

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" md="12">
                        <Card>
                            <CardHeader>
                                <strong>Login</strong>
                            </CardHeader>
                            <CardBody>
                                <Form onSubmit={this.submitForm} method="post" encType="multipart/form-data" className="form-horizontal">
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="email">Email</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="text" id="email" name="email" placeholder="Email" autoComplete="email" value={this.state.email} onChange={this.onChange_watch} />
                                            <div className="validation-error">{this.state.emailid_error}</div>
                                        </Col>
                                    </FormGroup>

                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="password">Password</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="password" id="password" name="password" placeholder="Password" value={this.state.password} onChange={this.onChange_watch} />
                                            <div className="validation-error">{this.state.error_password}</div>
                                        </Col>
                                    </FormGroup>
                                    <div>
                                        <Button color="primary" type="submit" className="mr-2 px-4" disabled={this.state.disabled}>{this.state.disabled ? 'Submit...' : 'Submit'}</Button>
                                        <Button type="reset" onClick={this.cancel_page} color="danger"><i className="mr-1 fa fa-ban"></i> Cancel</Button>
                                    </div>

                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Userlogin;