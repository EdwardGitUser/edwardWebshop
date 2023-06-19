import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import ProductCarousel from '../components/ProductCarousel';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Paginate from '../components/Paginate';
import { useTranslation } from 'react-i18next';
import useLanguageSwitcher from '../components/useLanguageSwitcher';

const HomeScreen = () => {
    const { t, changeLanguage } = useLanguageSwitcher();
      
    const { pageNumber, keyword } = useParams();

    const { data, isLoading, error } = useGetProductsQuery({keyword, pageNumber});


    return (
        <>
            
            {isLoading ? (
                <Loader />
            ) : error ? (
                    <Message variant='danger'>{error?.data?.message || error.error}</Message>
                ) : (
                <>
                <h1 class="text-info">{t('mainitems')}</h1>
                <Row>
                    {data.products.map((product) => (
                        <Col key={ product._id } sm={12} md={6} lg={4} xl={3}>
                            <Product product={product} />
                        </Col>
                    ))}
                    </Row>
                            <Paginate pages={data.pages} page={data.page} keyword={keyword ? keyword : ''}></Paginate>
                </>
            )}
            
        </>
    );
};

export default HomeScreen