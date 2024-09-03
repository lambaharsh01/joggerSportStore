import { useState, useEffect } from "react";

import "./Cart.css";
import JoggerHeader from "./JoggerHeader";
import Footer from "./Footer";
import axios from "axios";

import Loader from "../Loader";
import store from "../ReduxStore";
import { useNavigate } from "react-router-dom";
import { IoIosCart } from "react-icons/io";

function Cart() {
  const [isLoading, setLoading] = useState(true);
  const [hasLoaded, setLoaded] = useState(false);
  const [cartProducts, setCartProducts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!store.getState().auth) {
      navigate("/");
    }

    axios
      .get("/get_cart_details_per_user")
      .then((res) => {
        let parsedData = res.data.products.map((element) => {
          return {
            ...element,
            size_availablity: JSON.parse(element.size_availablity),
          };
        });
        setCartProducts(parsedData);
      })
      .catch((err) => alert("Something went wrong"));
    setLoading(false);
    setLoaded(true);
  }, [navigate]);

  async function removeFromCart(index, productId) {
    // console.log(index)
    // console.log(productId)
    await axios
      .post("/remove_from_cart", { productId: productId })
      .then((res) => {
        setCartProducts((previousElem) => {
          const newArray = [...previousElem];
          newArray.splice(index, 1);
          return newArray;
        });
      })
      .catch((err) => alert("something went wrong"));

    return false;
  }

  return (
    <div className="bg-white">
      <JoggerHeader />

      {isLoading && <Loader />}

      {hasLoaded && (
        <div>
          <div className="container-fluid">
            {cartProducts.length === 0 && (
              <div className="text-center py-4">
                No Products Found In The Cart
              </div>
            )}

            {cartProducts.map((element, index) => (
              <div className="row cartProductDiv">
                <div
                  className="col-5 col-sm-4 col-md-3 p-2"
                  onClick={() => {
                    navigate("/view_product/" + element._id);
                  }}
                >
                  <img
                    alt={"cartProduct" + index}
                    src={"/product_pictures/" + element.product_picture1}
                    className="w-100"
                  />
                </div>

                <div className="col-7 col-sm-8 col-md-5 pb-2 pt-4 pe-2">
                  <h5 className="cartProductName">{element.produt_name}</h5>
                  <h6 className="cartProductDiscription mb-2 mb-md-3">
                    {element.product_short_discription}
                  </h6>
                  {element.product_discount ? (
                    <div className="d-flex">
                      <h4 className="cartProductPrice">
                        {element.product_discount_price}
                      </h4>
                      <del className="priceCut">
                        <h6>{element.product_price}</h6>
                      </del>
                    </div>
                  ) : (
                    <h4 className="cartProductPrice">
                      {element.product_price}
                    </h4>
                  )}

                  <div className="d-flex justify-content-around d-md-none ">
                    <button
                      className="btn btn-dark cart_btn1_sm rounded-pill"
                      onClick={() => {
                        navigate(`/purchase/${element._id}`);
                      }}
                    >
                      Buy
                    </button>
                    <button
                      className="btn btn-light cart_btn2_sm rounded-pill"
                      onClick={async (elem) => {
                        elem.currentTarget.disabled = true;
                        elem.currentTarget.disabled = await removeFromCart(
                          index,
                          element._id
                        );
                      }}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="overflow-hidden d-none d-md-block">
                    {element.size_availablity.map((size) => (
                      <button className="btn btn-light me-1 mb-1 border">
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="col-0 col-md-4 d-none d-md-block d-flex align-items-around">
                  <div className="row pe-2">
                    <div className="col-12">
                      <button
                        className="btn btn-dark cart_btn2 rounded-pill"
                        onClick={() => {
                          navigate(`/purchase/${element._id}`);
                        }}
                      >
                        Buy Now
                      </button>
                    </div>
                    <div className="col-12">
                      <button
                        className="btn btn-light cart_btn1 rounded-pill"
                        onClick={async (elem) => {
                          elem.currentTarget.disabled = true;
                          elem.currentTarget.disabled = await removeFromCart(
                            index,
                            element._id
                          );
                        }}
                      >
                        Remove From Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {cartProducts.length > 0 && (
        <button
          className="buyCartButton p-2"
          id="buyCartBtn"
          onClick={() => {
            navigate("/buy_cart");
          }}
        >
          <IoIosCart /> Buy Cart
        </button>
      )}

      <Footer />
    </div>
  );
}

export default Cart;
