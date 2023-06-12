import React from 'react';
import { Badge, Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import logo from "../assets/logo.png";
import SearchBox from './SearchBox';
import '../assets/styles/header.css';
const Headere = () => {

    const { cartItems } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [logoutApiCall] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
          await logoutApiCall().unwrap();
          dispatch(logout());
          navigate('/login');
        } catch (err) {
          console.error(err);
        }
      };

    return (
        <header>
            <Navbar className="navbar-gradient" variant="dark" expand="md"  collapseOnSelect>
                <Container>
                    <LinkContainer to='/'>
                    <Navbar.Brand>
                        <img src={logo} alt="123" />
                        Webshop
                    </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <SearchBox />
                            <LinkContainer to='/cart'>
                                <Nav.Link >
                                    <FaShoppingCart />Cart
                                    {
                                        cartItems.length > 0 && (
                                            <Badge pill bd='success' style={{marginLeft: '5px'}}>
                                                { cartItems.reduce((a, c) => a + c.qty, 0)}
                                            </Badge>
                                        )
                                    }
                                </Nav.Link>
                            </LinkContainer>
                            {userInfo ? (
                                <NavDropdown title={userInfo.name} id='username'>
                                    <LinkContainer to='/profile'>
                                        <NavDropdown.Item>Profile</NavDropdown.Item>
                                    </LinkContainer>

                                    <NavDropdown.Item onClick={logoutHandler}>
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ): (
                                <LinkContainer to='/login'>
                                <Nav.Link href = "/login"><FaUser />Sign in</Nav.Link>
                                </LinkContainer>
                            ) }
                                {/* Admin Links */}
                                {userInfo && userInfo.isAdmin && (
                                    <NavDropdown title='Admin' id='adminmenu'>
                                    
                                    <LinkContainer to='/admin/productlist'>
                                        <NavDropdown.Item>Products</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to='/admin/userlist'>
                                        <NavDropdown.Item>Users</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to='/admin/orderlist'>
                                        <NavDropdown.Item>Orders</NavDropdown.Item>
                                    </LinkContainer>
                  
                                    </NavDropdown>
                                )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Headere;