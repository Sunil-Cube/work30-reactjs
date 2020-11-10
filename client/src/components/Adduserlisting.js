import React, { Component } from 'react';
import {
    Button,
    Card,
    CardHeader,
    Input,

} from 'reactstrap';

import axios from 'axios';
import memoize from 'memoize-one';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import Toggle from 'react-toggle';
import "react-toggle/style.css"

import { token_header } from '../Helper/Loginhelper';
const ADMIN_API_URL = process.env.REACT_APP_ADMIN_API_URL;


const CustomTitle = ({ row }) => (
    <div style={{ overflow: 'unset', whiteSpace: 'unset', textOverflow: 'ellipses' }}>
        {}
        {row}
    </div>

);

const columns = memoize(clickHandler => [
    
    {
        name: 'ID',
        selector: 'id',
        sortable: true,
        width: '10%'
    },
    {
        name: 'Company Name',
        selector: 'name',
        sortable: true,
        width: '10%'
    },
    {
        name: 'EmailID',
        selector: 'email',
        sortable: true,
        //right: true,
        width: '10%'

    },
    {
        name: 'Company Location',
        selector: 'companylocation',
        sortable: true,
        //right: true,
        width: '10%'

    },
    {
        name: 'Company Warehouse',
        selector: 'companywarehouse',
        sortable: true,
        //right: true,
        width: '10%'

    },
    {
        name: 'CompanyStatus',
        selector: 'companystatus',
        sortable: true,
        width: '10%',
        cell: (row) => <div>{(row.companystatus === "active") ? 'Active' : 'InActive'}</div>,
    },
    {
        name: 'CompanyStatus',
        selector: 'companystatus',
        sortable: true,
        width: '10%',
        cell: (row) => <Toggle onChange={clickHandler} checked={(row.companystatus === "active") ? true : false} id={row.id.toString()} />,
    },
]);



class Adduserlisting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_listing: [],
            perPage: 5,
            totalRows: 0,
            page_rows: [5, 20, 50, 100, 500],
            checked: false,
            selectedRows: []
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.reset_search_filter = this.reset_search_filter.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }

    handlePerRowsChange = async (perPage, page) => {

        this.setState({ perPage: perPage });
        var new_obj = {};
        new_obj.page = parseInt(page - 1);
        new_obj.perPage = perPage;
        this.my_company_serverside_pagination_logic(new_obj);
    }

    handlePageChange = async page => {

        const perPage = this.state.perPage;
        var new_obj = {};
        new_obj.page = parseInt(page - 1);
        new_obj.perPage = perPage;
        this.my_company_serverside_pagination_logic(new_obj);
    }

    async my_company_serverside_pagination_logic(new_obj) {
        axios.post(ADMIN_API_URL + 'all_list_company_record', new_obj).then(res => {
            if (res.status === 200) {
                this.setState({
                    data_listing: res.data.data.result,
                    totalRows: res.data.data.total_record,
                });
            }
        })
    }

    async componentDidMount() {
        const perPage = this.state.perPage;
        var new_obj = {};
        new_obj.perPage = perPage;
        await this.my_company_serverside_pagination_logic(new_obj);
    }

    async reset_search_filter() {
        await this.setState({ data_listing: [] });
        const perPage = this.state.perPage;
        var new_obj = {};
        new_obj.perPage = perPage;
        await this.my_company_serverside_pagination_logic(new_obj);
    }

    selectedhandleChange = state => {
        this.setState({ selectedRows: state.selectedRows });
    }

    deactiveCompanyByIds = async () => {
        let arrayids = [];
        this.state.selectedRows.forEach(d => {
            if (d.id) {
                arrayids.push(d.id);
            }
        });

        if (typeof arrayids !== 'undefined' && arrayids.length > 0) {
            axios.post(ADMIN_API_URL + 'deactiveCompanyByIds', { 'row_ids': arrayids }, {
            }).then((response) => {
                if (response.status === 200) {
                }
                else {
                }
            }).catch((error) => {
                    console.log('error raise');
                    console.log(error);
            })
        }
        this.reset_search_filter();
    };

    async handleChange(e) {
        if (e.target.value === 'on') {
            var idd = e.target.id;
            var company_status = e.target.checked;
            
            Swal.fire({
                title: 'Are you sure?',
                text: 'You want to change this company status? ',
                showCancelButton: true,
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonText: 'Yes',
                cancelButtonText: 'Cancel',
                showLoaderOnConfirm: true,
                preConfirm: (login) => {
                    return axios.post(ADMIN_API_URL + 'update_company_status', { 'row_ids': idd, 'status': company_status },
                        {
                            headers: token_header()
                        })
                        .then((response) => {
                            if (response.data.status === 200) {
                                return response;
                            }
                            else {
                                return response;
                            }

                        }).catch();
                },
            }).then((result) => {
                if (result.value) {
                    if (result.value.status === 200) {
                        Swal.fire('Update', result.value.data.message, 'success');
                    }
                    else {
                        Swal.fire('Update!', 'Something Went Wrong !', 'error');
                    }
                    this.reset_search_filter();
                }
            });
        }

        //this.setState({ checked });
    }


    handleButtonClick(state) {
        if (state.target.value === 'edit') {
            this.props.history.push('/admin/edit_user_record/' + state.target.id);
        }
        if (state.target.value === 'delete') {
            let current_state_id = state.target.id;
            axios.post(ADMIN_API_URL + 'delete_list_user_record', { 'id': current_state_id }, {
            }).then((response) => {
                this.reset_search_filter();
                if (response.status === 200) {
                }
                else {
                }
            })
                .catch((error) => {
                    console.log('error raise');
                    console.log(error);
                })
        }
    }

    add_user_form = () => {
        this.props.history.push('/add_user_form');
    }



    render() {
        const {
            data_listing,
            totalRows,
            page_rows,

        } = this.state;
        return (
            <div>
                <h1>Company Record listing</h1>
                <Card style={{ height: '100%' }}>
                    <CardHeader>
                        <strong>ADD Company</strong> <span className="float-right"><Button block color="primary" onClick={this.add_user_form} className="btn-pill">Add Company</Button></span>
                    </CardHeader>


                    <button
                        className="btn btn-danger btn-sm m-2"
                        onClick={() => {
                            this.deactiveCompanyByIds();
                        }}
                    > Deactive Company Status </button>

                    <DataTable
                        title="List"
                        data={data_listing}
                        columns={columns(this.handleChange)}
                        onSelectedRowsChange={this.selectedhandleChange}
                        //selectableRows // for checkbox functionality enabled               
                        //progressPending={loading}
                        pagination
                        paginationServer
                        paginationTotalRows={totalRows}
                        //paginationResetDefaultPage={false}
                        onChangeRowsPerPage={this.handlePerRowsChange}
                        onChangePage={this.handlePageChange}
                        //progressComponent={this.props.CustomLoader}
                        paginationRowsPerPageOptions={page_rows}
                        paginationComponentOptions={{ rowsPerPageText: 'Per page records:' }}
                        //paginationDefaultPage = {2}
                        paginationPerPage={5}
                        //Selected={this.handleChange}
                        selectableRows
                    />
                </Card>
            </div>
        )
    }
}

export default Adduserlisting;