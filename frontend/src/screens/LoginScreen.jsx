import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import useLanguageSwitcher from '../components/useLanguageSwitcher';

const LoginScreen = () => {
  const { t, changeLanguage } = useLanguageSwitcher();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
    
  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);
    
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';
    
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);
    
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
        const res = await login({ email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
  };

  return (
    <FormContainer>
      <h1 class="text-info">{t('signin')}</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group className='my-3' controlId='email'>
          <Form.Label>{t('em')}</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-3' controlId='password'>
          <Form.Label>{t('pas')}</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button  type='submit' variant='primary' className='mt-2' disabled={isLoading}>
        {t('signin')}
        </Button>
            {isLoading && <Loader />}
      </Form>

      <Row className='py-3'>
        <Col>
        {t('new')}{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
          {t('reg')}
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;