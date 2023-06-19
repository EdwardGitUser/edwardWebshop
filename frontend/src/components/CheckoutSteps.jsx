import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import useLanguageSwitcher from '../components/useLanguageSwitcher';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {

    const { t } = useLanguageSwitcher();

  return (
    <Nav className='justify-content-center mb-4'>
      <Nav.Item>
        {step1 ? (
          <LinkContainer to='/cart'>
            <Nav.Link>{t('home')}</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Sign In</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step2 ? (
          <LinkContainer to='/shipping'>
            <Nav.Link>{t('ship')}</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>{t('ship')}</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step3 ? (
          <LinkContainer to='/payment'>
            <Nav.Link>{t('pay')}</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>{t('pay')}</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step4 ? (
          <LinkContainer to='/placeorder'>
            <Nav.Link>{t('order')}</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>{t('order')}</Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default CheckoutSteps;