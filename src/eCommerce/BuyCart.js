import { useState, useEffect, useRef } from "react";

import "./Cart.css";
import JoggerHeader from "./JoggerHeader";
import Footer from "./Footer";
import axios from "axios";

import { FaPlus, FaMinus } from "react-icons/fa";
import Swal from "sweetalert2";

import Loader from "../Loader";
import store from "../ReduxStore";
import { useNavigate } from "react-router-dom";
import { IoIosCart } from "react-icons/io";
import { ImCross } from "react-icons/im";

function Cart() {
  const [dataRendering, setDataRendering] = useState(1);

  const [isLoading, setLoading] = useState(true);
  const [hasLoaded, setLoaded] = useState(false);
  const [cartProducts, setCartProducts] = useState([]);

  const [productIds, setProductIds] = useState([]);
  const [productNames, setProductNames] = useState([]);
  const [productPrices, setProductPrices] = useState([]);
  const [productTotalPrices, setProductTotalPrices] = useState([]);
  const [productCurrency, setProductCurrency] = useState([]);
  const [productQuantity, setProductQuantity] = useState([]);
  const [productSizes, setProductSizes] = useState([]);

  const [productSumarry, setProductSumarry] = useState([]);

  const [sumPrice, setSumPrice] = useState(0);
  const [address, setAddress] = useState("");

  const [show_modal, setshow_modal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    function getPriceAndSymbol(value) {
      let product = { symbol: "", price: 0 };
      if (value) {
        for (let i = 0; i < value.length; i++) {
          if (value[i] !== " ") {
            if (isNaN(value[i])) {
              product.symbol = value[i];
            } else {
              product.price = `${product.price}${value[i]}`;
            }
          }
        }
        product.price = Number(product.price);
      }
      return product;
    }

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

        setProductPrices(
          res.data.products.map((element) => {
            if (element.product_discount) {
              return getPriceAndSymbol(element.product_discount_price).price;
            } else {
              return getPriceAndSymbol(element.product_price).price;
            }
          })
        );

        setProductTotalPrices(
          res.data.products.map((element) => {
            if (element.product_discount) {
              return getPriceAndSymbol(element.product_discount_price).price;
            } else {
              return getPriceAndSymbol(element.product_price).price;
            }
          })
        );

        let currency = res.data.products.map((element) => {
          if (element.product_discount) {
            return getPriceAndSymbol(element.product_discount_price).symbol;
          } else {
            return getPriceAndSymbol(element.product_price).symbol;
          }
        });

        setProductCurrency(currency);

        setProductQuantity(res.data.products.map((element) => 1));

        setProductSizes(res.data.products.map((element) => null));

        setSumPrice(
          res.data.products.reduce((total, current) => {
            if (current.product_discount) {
              return (
                total + getPriceAndSymbol(current.product_discount_price).price
              );
            } else {
              return total + getPriceAndSymbol(current.product_price).price;
            }
          }, 0)
        );

        setProductIds(res.data.products.map((element) => element._id));
        setProductNames(
          res.data.products.map((element) => element.produt_name)
        );
        // setProductNames()
      })
      .catch((err) => alert("Something went wrong"));
    setLoading(false);
    setLoaded(true);
  }, []);

  useEffect(() => {
    setSumPrice(
      productTotalPrices.reduce((total, current) => {
        return total + current;
      }, 0)
    );
  }, [dataRendering]);

  function validate() {
    let unSelectedSizes = 0;
    productSizes.forEach((element) => {
      if (!element) {
        unSelectedSizes++;
      }
    });

    if (unSelectedSizes) {
      alert(
        unSelectedSizes +
          " products need sizes selection please select to proceed"
      );
    } else {
      let productSummmaryReport = [];

      for (let i = 0; i < productIds.length; i++) {
        productSummmaryReport.push({
          product_id: productIds[i],
          quantity: productQuantity[i],
          product_size: productSizes[i],
          currency: productCurrency[i],
          product_price: productPrices[i],
          totalBill: productTotalPrices[i],
          productNames: productNames[i],
        });
      }
      setProductSumarry(productSummmaryReport);
      setshow_modal(true);
    }
  }

  function finalvalidation() {
    if (address === "") {
      alert("please fill the address");
    } else if (address.length < 10) {
      alert("please fill a valid address");
    } else {
      axios
        .post("/buy_whole_cart", {
          productDetails: productSumarry,
          address: address,
        })
        .then((res) => {
          if (res.data === 200) {
            Swal.fire({
              title: "Order Placed",
              text: "Your order has been placed successfully the reciept has been emailed to the registered email id",
              icon: "success",
              showConfirmButton: false,
              timer: 4000,
              willClose: () => {
                navigate(`/cart`);
              },
            });
          }
        })
        .catch((err) => {
          Swal.fire({
            title: "Something Went Wrong",
            icon: "warning",
            showConfirmButton: false,
            timer: 2000,
            willClose: () => {
              navigate(`/cart`);
            },
          });
        });
    }
  }

  return (
    <div className="bg-white">
      <JoggerHeader />

      {isLoading && <Loader />}

      {hasLoaded && (
        <div>
          <div className="container-fluid mb-5" key={dataRendering}>
            {cartProducts.map((element, index) => (
              <div className="row cartProductDiv">
                <div className="col-5 col-sm-4 col-md-3 p-2">
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

                  <div className="d-flex justify-content-around d-md-none pb-2">
                    <button
                      className="btn btn-sm btn-dark removeButtonSm rounded-pill"
                      onClick={() => {
                        if (productQuantity[index] > 1) {
                          productQuantity[index] -= 1;
                          productTotalPrices[index] =
                            productPrices[index] * productQuantity[index];
                          setDataRendering((prev) => prev + 1);
                        }
                      }}
                    >
                      <FaMinus />
                    </button>
                    <h5 className="pt-2">{productQuantity[index]}</h5>
                    <button
                      className="btn btn-sm btn-dark addButtonSm rounded-pill"
                      onClick={() => {
                        productQuantity[index] += 1;
                        productTotalPrices[index] =
                          productPrices[index] * productQuantity[index];
                        setDataRendering((prev) => prev + 1);
                      }}
                    >
                      <FaPlus />
                    </button>

                    <select
                      className="w-50 py-2 cart_selectSm rounded-pill"
                      value={productSizes[index]}
                      onChange={(element) => {
                        productSizes[index] = element.currentTarget.value;
                        setDataRendering((prev) => prev + 1);
                      }}
                    >
                      <option value="Select Product's Main Catagory">
                        Select Size
                      </option>
                      {element.size_availablity.map((size) => (
                        <option value={size}>{size}</option>
                      ))}
                    </select>
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
                    <div className="col-12 d-flex justify-content-around">
                      <button
                        className="btn btn-dark removeButton rounded-pill"
                        onClick={() => {
                          if (productQuantity[index] > 1) {
                            productQuantity[index] -= 1;
                            productTotalPrices[index] =
                              productPrices[index] * productQuantity[index];
                            setDataRendering((prev) => prev + 1);
                          }
                        }}
                      >
                        <FaMinus />
                      </button>
                      <h4 className="quantityText pt-2">
                        {productQuantity[index]}
                      </h4>
                      <button
                        className="btn btn-dark addButton rounded-pill"
                        onClick={() => {
                          productQuantity[index] += 1;
                          productTotalPrices[index] =
                            productPrices[index] * productQuantity[index];
                          setDataRendering((prev) => prev + 1);
                        }}
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <div className="col-12 px-5">
                      <select
                        className="w-100 py-2 cart_select1 rounded-pill"
                        value={productSizes[index]}
                        onChange={(element) => {
                          productSizes[index] = element.currentTarget.value;
                          setDataRendering((prev) => prev + 1);
                        }}
                      >
                        <option value="Select Product's Main Catagory">
                          Select Size
                        </option>
                        {element.size_availablity.map((size) => (
                          <option value={size}>{size}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="GrandTotal d-flex align-items-center justify-content-around">
            <h2 className="mt-2">
              Total: {productCurrency.length > 0 ? productCurrency[0] : ""}
              {sumPrice}
            </h2>
            <button
              className="btn btn-dark buyNowButton"
              onClick={() => {
                validate();
              }}
            >
              Buy Now
            </button>
          </div>

          {/*CREAT MODAL START */}

          <div
            className={`modal modal-xl ${
              show_modal ? "show d-block modal-open" : "d-none"
            }`}
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-body p-0 ">
                  <ImCross
                    className="modal_cut_font_float text-dark me-3 mt-3  fs-4 "
                    onClick={() => setshow_modal(false)}
                  />

                  <h5 className="text-center mt-3 fw-bold">Order Sumarry</h5>

                  <div className="container-fluid">
                    <div className="row">
                      <div className="pb-1">
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <td>S.no</td>
                              <td>Product</td>
                              <td>Size</td>
                              <td>Quanity</td>
                              <td>Price</td>
                            </tr>
                          </thead>
                          <tbody>
                            {productSumarry.map((element, index) => (
                              <tr>
                                <td>{index + 1}</td>
                                <td>{element.productNames}</td>
                                <td>{element.product_size}</td>
                                <td className="text-center">
                                  {element.quantity}
                                </td>
                                <td className="text-center">
                                  {element.currency + element.totalBill}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <div className="w-100">
                          Address:
                          <textarea
                            className="w-100 border rounded"
                            placeholder="Shipping Address"
                            value={address}
                            onChange={(element) => {
                              setAddress(element.currentTarget.value);
                            }}
                          ></textarea>
                        </div>
                        <br />
                        <button
                          className="btn btn-dark w-100 mb-2 rounded-pill"
                          onClick={() => {
                            finalvalidation();
                          }}
                        >
                          Confirm Order
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*CREAT MODAL END */}
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Cart;
