import React,{Fragment,useEffect,useState} from 'react';
import './Products.css';
import { useSelector,useDispatch } from 'react-redux';
import { clearErrors,getProduct } from '../../actions/productAction';
import Loader from '../layout/Loader/Loader';
import ProductCard from '../Home/ProductCard';
import MetaData from "../layout/Header/MetaData";
import { useLocation } from "react-router-dom";
import Pagination from 'react-js-pagination';
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import {useAlert} from 'react-alert';

const categories = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "SmartPhones",
  "Camera",
  "Attire",
  "Others",
];


const Products = () => {
    const alert = useAlert();
    const dispatch = useDispatch();
    let keyword = useLocation().pathname.split('/')[2];
    // console.log(keyword);

    const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 25000]);
  const [category, setCategory] = useState("");

  const [ratings, setRatings] = useState(0);

    const {
        products,
        loading,
        error,
        productsCount,
        resultPerPage,
        filteredProductsCount,
      } = useSelector((state) => state.products);;

      const setCurrentPageNo = (e) => {
        setCurrentPage(e);
      };
    
      const priceHandler = (event, newPrice) => {
        setPrice(newPrice);
      };
      let count = filteredProductsCount;
      useEffect(() => {
        if (error) {
          alert.error(error);
          dispatch(clearErrors());
        }
    
        dispatch(getProduct(keyword, currentPage, price, category, ratings));
      }, [dispatch, keyword, currentPage, price, category, ratings, alert, error]);
    if (error) {
      alert.error(error);
      clearErrors();
  }

  return <Fragment>
      {loading?
      <Loader/>
      :(<Fragment>
            <MetaData title="All Products" />
            <h2 className="productsHeading">Products</h2>
            <div className="products">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
          {resultPerPage < count && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                totalItemsCount={productsCount}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
           )}
          <div className="filterBox" style={{border: '2px solid',padding: '25px'}}>
            <h3 style={ {marginBottom:"5px"}}>Search Filter : </h3>
            <fieldset style={{padding: '0 20px 0 20px',border:'2px solid',borderRadius: '10px'}}>
            <Typography component="legend">Price</Typography>
            <Slider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={0}
              max={25000}
              step={100}
            />
            </fieldset>
            
            {/* <button type="submit" onClick={priceHandler}> Search</button> */}
            <fieldset style={{padding: '0 20px 0 20px',margin:"20px 0 20px 0",border:'2px solid',borderRadius: '10px'}}>
            <Typography component="legend">Categories</Typography>
            <ul className="categoryBox">
              {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>
            </fieldset>
            
            

            <fieldset style={{padding: '0 20px 0 20px',border:'2px solid',borderRadius: '10px'}}>
              <Typography component="legend">Ratings Above</Typography>
              <Slider
                value={ratings}
                onChange={(e, newRating) => {
                  setRatings(newRating);
                }}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
            </fieldset>
            </div>
          
    </Fragment>)}
  </Fragment>;
};

export default Products;
