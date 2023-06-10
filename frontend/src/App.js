import React from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Headere from './components/Headere';
import Footer from './components/Footer';

const App = () => {
    return (
        <>
            <Headere />
            <main className='py-3'>
                <Container>
                    <Outlet />
                </Container>
            </main>
            <Footer />
        </>
    );
};

export default App;