import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../slices/cartSlice';
import useLanguageSwitcher from '../components/useLanguageSwitcher';

const ShippingScreen = () => {

const { t } = useLanguageSwitcher();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
      navigate('/payment');
      
      setAddress('');
    };
    
    const clearInputs = () => {
        setAddress('');
        setCity('');
        setPostalCode('');
        setCountry('');
      };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1 class="text-info">{t('ship')}</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='address'>
          <Form.Label>{t('address')}</Form.Label>
          <Form.Control
            type='text'
            placeholder={t('enteraddr')}
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
            
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='city'>
          <Form.Label>{t('city')}</Form.Label>
          <Form.Control
            type='text'
            placeholder={t('entercity')}
            value={city}
            required
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='postalCode'>
          <Form.Label>{t('postindex')}</Form.Label>
          <Form.Control
            type='text'
            placeholder={t('postindex')}
            value={postalCode}
            required
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='country'>
          <Form.Label>{t('ctr')}</Form.Label>
          <Form.Control
            type='text'
            placeholder={t('enterctr')}
            value={country}
            required
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary'>
        {t('contin')}
        </Button>
        <Button variant='secondary' onClick={clearInputs} style={{ marginLeft: '10px' }}>
        {t('clear')}
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;