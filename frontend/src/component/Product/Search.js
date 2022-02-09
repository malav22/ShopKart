import React, { useState, Fragment } from "react";
import MetaData from "../layout/Header/MetaData";
import "./Search.css";

import { useNavigate } from 'react-router-dom';


const Search = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
        navigate(`/products/${keyword}`);
    } else {
        navigate("/products");
    }
  };

  return (
    <Fragment>
      <MetaData title="Search A Product -- ECOMMERCE" />
      <form className="searchBox" onSubmit={searchSubmitHandler}>
        <input
          type="text"
          placeholder="Enter Product Name"
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input type="submit" value="Search" />
      </form>
      
    </Fragment>
  );
};

export default Search;
