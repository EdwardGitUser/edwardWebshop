import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {
    useGetOrderDetailsQuery,
    useGetPayPalClientIdQuery,
    usePayOrderMutation,
    useDeliverOrderMutation,
} from '../slices/ordersApiSlice';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import useLanguageSwitcher from '../components/useLanguageSwitcher';

const OrderScreen = () => {

    const { t } = useLanguageSwitcher();

    const { id: orderId } = useParams();

    const {
        data: order,
        refetch,
        isLoading,
        error,
    } = useGetOrderDetailsQuery(orderId);

    const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
    const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
    const { userInfo } = useSelector((state) => state.auth);

    const {
        data: paypal,
        isLoading: loadingPayPal,
        error: errorPayPal,
    } = useGetPayPalClientIdQuery();
    

    useEffect(() => {
        if (!errorPayPal && !loadingPayPal && paypal.clientId) {
          const loadPayPalScript = async () => {
            paypalDispatch({
              type: 'resetOptions',
              value: {
                'client-id': paypal.clientId,
                currency: 'USD',
              },
            });
            paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
          };
          if (order && !order.isPaid) {
            if (!window.paypal) {
              loadPayPalScript();
            }
          }
        }
      }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

      function onApprove(data, actions) {
        return actions.order.capture().then(async function (details) {
          try {
            await payOrder({ orderId, details });
            refetch();
            toast.success('Order is paid');
          } catch (err) {
            toast.error(err?.data?.message || err.error);
          }
        });
    };

     // тестування перед продакшеном закоментувати
    async function onApproveTest() {
    await payOrder({ orderId, details: { payer: {} } });
    refetch();

    toast.success('Order is paid');
    };

    function onError(err) {
        toast.error(err.message);
    };

    function createOrder(data, actions) {
        return actions.order
          .create({
            purchase_units: [
              {
                amount: { value: order.totalPrice },
              },
            ],
          })
          .then((orderId) => {
            return orderId;
          });
      }
    
    const deliverOrderHandler = async () => {
        
        try {
            await deliverOrder(orderId);
            refetch();
            toast.success('Order delivered');
        } catch (err) {
            toast.error(err?.data?.message || err.message);
            
        }
      };


    return isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
        <h1 >{t('orderorder')} {order._id}</h1>
        <Row>
        <Col md={8}>
                            
            <ListGroup variant='flush'>
              <ListGroup.Item>
              <h2 class="text-info">{t('ship')}</h2>
              <p>
                <strong>{t('name')}: </strong> {order.user.name}
              </p>
              <p>
                <strong>{t('email')}: </strong>{order.user.email}
              </p>
              <p>
                <strong>{t('address')}: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              
                </ListGroup.Item>
                            

                <ListGroup.Item>
              <h2 class="text-info">{t('paymethod')}</h2>
              <p>
                <strong>{t('method')} </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
              <Message variant='success'>{t('paid')} {order.paidAt}</Message>
              ) : (
              <Message >{t('not_paid')}</Message>
              )}
            </ListGroup.Item>
                            

            <ListGroup.Item>
              <h2 class="text-info">{t('orderitems')}</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={2}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
            </Col>
                        


            <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                                    
                        <ListGroup.Item>
                        <h2 class="text-info">{t('ordersum')}</h2>        
                        </ListGroup.Item>

                <ListGroup.Item>
    
                <Row>
                  <Col>{t('itemsorder')}</Col>
                  <Col>${order.itemsPrice}</Col>
                                        </Row>
                                        
                                        <Row>
                  <Col>{t('ship')}</Col>
                  <Col>${order.shippingPrice}</Col>
                                        </Row> 
                                        <Row>
                  <Col>{t('tax')}</Col>
                                            <Col>${order.taxPrice}</Col>
                                            </Row>
                                            <Row>
                  <Col>{t('totalorder')}</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
                                    </ListGroup.Item>
                                    {/* PAY ORDER PLACEHOLDER */}

                                    {!order.isPaid && (
                                        <ListGroup.Item>
                                            {loadingPay && <Loader />}
                                            {isPending ? <Loader /> : (
                                                <div>
                                                    <Button
                                                        onClick={onApproveTest}
                                                        style={{ marginBottom: '10px' }}
                                                    >
                                                        Pay later
                                                    </Button>
                                                    <div>
                                                        <PayPalButtons
                                                            createOrder={createOrder}
                                                            onApprove={onApprove}
                                                            onError={onError}
                                                        ></PayPalButtons>
                                                    </div>
                                                </div>
                                            )}
                                        </ListGroup.Item>
                                    )}
                                    {loadingDeliver && <Loader />}

                                    {userInfo &&
                                    userInfo.isAdmin &&
                                    order.isPaid &&
                                    !order.isDelivered && (
                                        <ListGroup.Item>
                                        <Button
                                            type='button'
                                            className='btn btn-block'
                                            onClick={deliverOrderHandler}
                                        >
                                            Mark As Delivered
                                        </Button>
                                        </ListGroup.Item>
                                    )}

                        </ListGroup>
                    </Card>
            </Col>
            </Row>
        </>
      );
}

export default OrderScreen;