import React, { Component } from 'react';
import { Container } from 'react-bootstrap';

// class Layout extends Component {
//     render() {
//         return (
//             <div>

//             </div>
//         );
//     }
// }

// export default Layout;


export const Layout = (props) => (
    <Container>
        {props.children}
    </Container>
)