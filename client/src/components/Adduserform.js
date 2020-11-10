import React, { Component } from 'react';
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

//import DatePicker from "react-datepicker";
import CKEditor from "react-ckeditor-component";
// import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
//import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';


import { api_service } from '../Helper/APIServicehelper';
const ADMIN_API_URL = process.env.REACT_APP_ADMIN_API_URL;

class Adduserform extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: '',
            address: '',
            companystatus: '',
            email: '',
            companylocation: '',
            companywarehouse: '',
            image: '',
            uuid_company: uuidv4(),
        };

        this.onChange_watch = this.onChange_watch.bind(this);
        this.onChange_radio_button = this.onChange_radio_button.bind(this);
        this.onChange_single_select = this.onChange_single_select.bind(this);
        this.onChange_pic = this.onChange_pic.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.cancel_page = this.cancel_page.bind(this);
        // this.onChange_multiple_select = this.onChange_multiple_select.bind(this);
        this.onChange_content = this.onChange_content.bind(this);
    }

    async onChange_pic(e) {
        await this.setState({
            image: e.target.files[0],
        });
    }

    async onChange_radio_button(e) {
        await this.setState({
            [e.target.name]: e.target.value
        });
    }

    async onChange_watch(e) {
        await this.setState({
            [e.target.name]: e.target.value
        });
    }

    async onChange_content(evt) {
        var newContent = evt.editor.getData();
        this.setState({
            address: newContent
        })
    }

    async onChange_single_select(e) {
        await this.setState({ [e.target.name]: e.target.value });
    }

    is_exit_email = async (email) => {

        return await axios.post(ADMIN_API_URL + 'is_exit_email', { 'email': email }, {
        }).then((response) => {
            if (response.data.data.length !== 0) {

                return true;
            }
            else {
                return false;
            }
        })
            .catch((error) => {
                console.log('check add user catch error');
                console.log(error);
            })

    }

    data_validation = async () => {

        let user_nameerror = "";
        let emailid_error = "";
        let single_image_error = "";
        let gender_error = "";
        let error_password = "";
        let error_confirmpassword = "";
        let error_role = "";

        const pattern = /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z]{3,9}[\.][a-z]{2,5}/g;

        if (!this.state.name) {
            user_nameerror = 'Name is Required.';
        }

        if (!this.state.email) {
            emailid_error = "Email-ID is Required .";
        }
        else if (!pattern.test(this.state.email)) {
            emailid_error = "should be Email-ID is valid format .";
        }
        else if (await this.is_exit_email(this.state.email)) {
            emailid_error = "email is alread exits ..email should be unique";
        }


        if (this.state.image !== '') {
            if (!this.state.image.name.match(/\.(jpg|jpeg|png)$/)) {
                single_image_error = 'Please select valid image.  *.jpg , *.png';
            }
        }

        if (!this.state.gender) {
            gender_error = 'Gender is Required. ';
        }

        if (!this.state.password) {
            error_password = "password is Required .";
        }
        else if (this.state.password.length < 8) {
            error_password = "Password must have at least 8 characters .";
        }


        if (!this.state.confirm_password) {
            error_confirmpassword = "confirm password is Required .";
        } else if (this.state.confirm_password.length < 8) {
            error_confirmpassword = "Password must have at least 8 characters .";
        }
        else if (this.state.password !== this.state.confirm_password) {
            error_confirmpassword = 'password and confirm password should be match !';
        }

        if (this.state.role === 0) {
            error_role = 'Role is Required .';
        }

        if (user_nameerror || emailid_error || single_image_error || gender_error || error_password
            || error_confirmpassword || error_role) {
            this.setState({
                user_nameerror, emailid_error, single_image_error,
                gender_error, error_password, error_confirmpassword, error_role
            });
            return false;
        }
        else {
            this.setState({
                user_nameerror: '', emailid_error: '', single_image_error: '',
                gender_error: '', error_password: '', error_confirmpassword: '', error_role: ''
            });
            return true;
        }
    }

    cancel_page() {
        this.props.history.push('/admin/user_record_listing');
    }

    submitForm(e) {
        e.preventDefault();
        //const isVaild = this.data_validation();

        if (true) {

            this.setState({ disabled: true });

            var formData = new FormData();
            formData.append('name', this.state.name);
            formData.append('address', this.state.address);
            formData.append('companystatus', this.state.companystatus);
            formData.append('email', this.state.email);
            formData.append('companylocation', this.state.companylocation);
            formData.append('companywarehouse', this.state.companywarehouse);
            formData.append('uuid_company', this.state.uuid_company);
            formData.append("single_file", this.state.image);

            // Display the values
            // for (var value of formData.values()) {
            //     console.log(">>>>>>>>", value);
            // }

            const response_check = api_service('add_user_record', formData);
            response_check.then(response => {
                if (response.status === 200) {
                    console.log("response is true")
                    this.setState({ disabled: false });
                    this.props.history.push('/admin/user_record_listing');
                }
                else {
                    console.log("response is false")
                    this.setState({ disabled: false });
                }
            })
                .catch((error) => {
                    this.setState({ disabled: false });
                })
        }

    }



    render() {

        const lookup = {
            "USA": [
                { id: '0', text: 'Please select' },
                { id: 'california', text: 'California' },
                { id: 'chicago', text: 'Chicago' }
            ],
            "India": [
                { id: '0', text: 'Please select' },
                { id: 'delhi', text: 'Delhi' },
                { id: 'gujarat', text: 'Gujarat' },
                { id: 'haryana', text: 'Haryana' },
            ],
            "": [
                { id: 'Please select', text: 'Please select' },
            ]

        }

        const dataValue = this.state.companylocation;
        const options = lookup[dataValue];

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" md="12">
                        <Card>
                            <CardHeader>
                                <strong>Company Information</strong>
                            </CardHeader>
                            <CardBody>
                                <Form onSubmit={this.submitForm} method="post" encType="multipart/form-data" className="form-horizontal">

                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="name">Company Name</Label>
                                        </Col>

                                        <Col xs="12" md="9">
                                            <Input type="text" id="name" name="name" placeholder="Name" value={this.state.name} onChange={this.onChange_watch} />
                                            <div className="validation-error">{this.state.user_nameerror}</div>
                                        </Col>
                                    </FormGroup>

                                    <FormGroup row>
                                        <Col md="3">
                                            <Label>Company Status</Label>
                                        </Col>
                                        <Col md="9">
                                            <FormGroup check className="radio">
                                                <Input className="form-check-input" type="radio" id="active" name="companystatus" value="active" onChange={this.onChange_radio_button} />
                                                <Label check className="form-check-label" htmlFor="radio1">Active</Label>
                                            </FormGroup>

                                            <FormGroup check className="radio">
                                                <Input className="form-check-input" type="radio" id="inactive" name="companystatus" value="inactive" onChange={this.onChange_radio_button} />
                                                <Label check className="form-check-label" htmlFor="radio2">INActive</Label>
                                            </FormGroup>
                                            {/* <div className="validation-error">{this.state.gender_error}</div> */}
                                        </Col>
                                    </FormGroup>

                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="email">Company Email</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="text" id="email" name="email" placeholder="Email" autoComplete="email" value={this.state.email} onChange={this.onChange_watch} />
                                            <div className="validation-error">{this.state.emailid_error}</div>
                                        </Col>
                                    </FormGroup>

                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="uuid_company">Company Unique ID</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="text" id="email" name="uuid_company" defaultValue={this.state.uuid_company} />
                                            {/* <div className="validation-error">{this.state.emailid_error}</div> */}
                                        </Col>
                                    </FormGroup>


                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="companylocation">Company location</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="select" name="companylocation" id="companylocation" onChange={this.onChange_single_select}>
                                                <option value="">Please select</option>
                                                <option value="USA">USA</option>
                                                <option value="India">India</option>
                                            </Input>
                                            {/* <div className="validation-error">{this.state.error_role}</div> */}
                                        </Col>
                                    </FormGroup>

                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="companywarehouse">Company Warehouse</Label>
                                        </Col>
                                        <Col md="9">
                                            <Input type="select" name="companywarehouse" id="companywarehouse" onChange={this.onChange_single_select}>
                                                {options.map((o) =>
                                                    <option
                                                        key={o.id} value={o.id}>
                                                        {o.text}</option>)}
                                            </Input>
                                        </Col>
                                    </FormGroup>

                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="pic_uploading">Pic Uploading</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="file" id="pic_uploading" name="pic_uploading" onChange={this.onChange_pic} />
                                            <div className="validation-error">{this.state.single_image_error}</div>
                                        </Col>
                                    </FormGroup>

                                    <FormGroup row>
                                        <Col md="2">
                                            <Label htmlFor="address">Company Address</Label>
                                        </Col>

                                        <Col xs="12" md="10">
                                            <CKEditor id="textarea_id" name="address" activeClass="p10"
                                                content={this.state.address}
                                                config={{ allowedContent: true, contentsCss: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' }}
                                                removeButto='Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,SelectAll,Scayt,Flash,Smiley,About'
                                                events={{ "change": this.onChange_content }} />
                                        </Col>
                                    </FormGroup>


                                    <div>
                                        <Button color="primary" type="submit" className="mr-2 px-4" disabled={this.state.disabled}>{this.state.disabled ? 'Add...' : 'Add'}</Button>
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

export default Adduserform;