import React from 'react';
import requiresAuth from './HOC/requiresAuth'


const Dashboard = React.lazy(() => import('./components/Dashboard'));
const Adduserform = React.lazy(() => import('./components/Adduserform'));
const Adduserlisting = React.lazy(()=> import('./components/Adduserlisting'));


const routes = [
    { path: '/', exact: true, name: 'Home'},
    { path: '/dashboard', exact: true, name: 'Dashboard', component: requiresAuth(Dashboard)},
    { path: '/add_user_form', name: 'Add User Form', component:  requiresAuth(Adduserform)},
    { path: '/add_user_listing', name: 'Add User Listing', component:  requiresAuth(Adduserlisting)},
]  

export default routes;