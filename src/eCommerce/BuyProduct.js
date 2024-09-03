import "./BuyProduct.css";

import JoggerHeader from "./JoggerHeader";
import Footer from "./Footer";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";
import Swal from "sweetalert2";

import Loader from "../Loader";

import { FaPlus, FaMinus } from "react-icons/fa";

function BuyProduct() {
  const params = useParams();
  const navigate = useNavigate();

  const [isLoading, setLoading] = useState(true);
  const [hasLoaded, setLoaded] = useState(false);

  const [productId, setProductId] = useState(null);
  const [productName, setProductName] = useState(null);
  const [productSizes, setProductSizes] = useState([]);
  const [productSelectedSize, setProductSelectedSize] = useState(null);
  const [reRenderSize, setReRenderSize] = useState(1);
  const [productQuanitity, setProductQuantity] = useState(1);

  const [address, setAddress] = useState("");

  const [productNumericPrice, setProductNumericPrice] = useState(0);
  const [productDiscount, setProductDiscount] = useState(true);
  const [productNumericDiscountPrice, setProductNumericDiscountPrice] =
    useState(0);

  const [currency, setCurrency] = useState(null);
  const [grandTotal, setGrandTotal] = useState(null);
  const [grandSave, setGrandSave] = useState(null);

  let today = new Date();
  let increasedDate =
    today.getDate() + 3 < 10
      ? "0" + (today.getDate() + 2)
      : today.getDate() + 2;
  let increasedMonth =
    today.getMonth() < 10 ? "0" + today.getMonth() : today.getMonth();
  let increasedYear = today.getFullYear();

  let ddmmyyyyDate = `${increasedDate}-${increasedMonth}-${increasedYear}`;

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

  useEffect(() => {
    const productId = params.productId;

    axios
      .get(`/get_product_info/${productId}`)
      .then((res) => {
        if (!res.data.product) {
          alert("Product not Found");
          //    navigate("/")
        } else {
          let productInfo = res.data.product;

          setProductId(productId);
          setProductName(productInfo.produt_name);

          setProductSizes(JSON.parse(productInfo.size_availablity));

          setProductNumericPrice(
            getPriceAndSymbol(productInfo.product_price).price
          );
          setProductDiscount(productInfo.product_discount);

          if (productInfo.product_discount) {
            setGrandSave(
              getPriceAndSymbol(productInfo.product_price).price -
                getPriceAndSymbol(productInfo.product_discount_price).price
            );
            setGrandTotal(
              getPriceAndSymbol(productInfo.product_discount_price).price
            );
            setProductNumericDiscountPrice(
              getPriceAndSymbol(productInfo.product_discount_price).price
            );
            setCurrency(
              getPriceAndSymbol(productInfo.product_discount_price).symbol
            );
          } else {
            setGrandTotal(getPriceAndSymbol(productInfo.product_price).price);
            setProductNumericDiscountPrice(
              getPriceAndSymbol(productInfo.product_price).price
            );
            setCurrency(getPriceAndSymbol(productInfo.product_price).symbol);
          }

          setLoading(false);
          setLoaded(true);
        }
      })
      .catch((err) => {
        alert("something went wrong");
        // navigate('/');
      });

    return () => {
      setProductId(null);
      setProductName(null);

      setProductSizes([]);

      setProductNumericPrice(null);
      setProductDiscount(null);

      setGrandTotal(null);
      setProductNumericDiscountPrice(null);
      setCurrency(null);
    };
  }, [params.productId]);

  async function addressValidation() {
    if (address === "") {
      alert("please fill the address");
      return false;
    } else if (address.length < 10) {
      alert("please make sure you give a valid address");
      return false;
    } else if (!productSelectedSize) {
      alert("please select the size");
      return false;
    } else {
      await placeOrder();
      return true;
    }
  }

  async function placeOrder() {
    let dataObject = {
      address: address,
      productId: productId,
      productSelectedSize: productSelectedSize,
      productQuanitity: productQuanitity,
      productPrice: productNumericDiscountPrice,
      totalBill: grandTotal,
      currency: currency,
    };

    axios
      .post("/place_order", dataObject)
      .then((res) => {
        if (res.data === 200) {
          Swal.fire({
            title: "Order Placed",
            text: "Your order has been placed successfully the reciept has been emailed to the registered email id",
            icon: "success",
            showConfirmButton: false,
            timer: 4000,
            willClose: () => {
              navigate(`/view_product/${productId}`);
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
            navigate(`/view_product/${productId}`);
          },
        });
      });
  }

  return (
    <div className="bg-white">
      <JoggerHeader />
      {isLoading && <Loader />}

      {hasLoaded && (
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 text-center py-3">
              <h3>Order Details</h3>
            </div>

            <div className="col-sm-6">
              <table className="w-100 table table-striped">
                <tbody>
                  <tr>
                    <td>Product Id: {productId}</td>
                  </tr>

                  <tr>
                    <td>Product Name: {productName}</td>
                  </tr>
                  <tr>
                    <td>
                      Product Total Price: {currency + productNumericPrice}
                    </td>
                  </tr>

                  {productDiscount && (
                    <>
                      <tr>
                        <td>
                          Product Discounted Price:{" "}
                          {currency + productNumericDiscountPrice}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          You Save:{" "}
                          {currency +
                            (productNumericPrice - productNumericDiscountPrice)}
                        </td>
                      </tr>
                    </>
                  )}

                  <tr>
                    <td>
                      Quantity:
                      <button
                        className="btn btn-light btn-sm rounded-pill me-2"
                        onClick={() => {
                          setProductQuantity((previousCount) => {
                            if (previousCount < 2) {
                              return previousCount;
                            } else {
                              setGrandTotal(
                                productNumericDiscountPrice *
                                  (previousCount - 1)
                              );
                              setGrandSave(
                                productNumericPrice * (previousCount - 1) -
                                  productNumericDiscountPrice *
                                    (previousCount - 1)
                              );
                              return previousCount - 1;
                            }
                          });
                        }}
                      >
                        <FaMinus />
                      </button>
                      {productQuanitity}
                      <button
                        className="btn btn-light btn-sm rounded-pill ms-2"
                        onClick={() => {
                          setProductQuantity((previousCount) => {
                            setGrandTotal(
                              productNumericDiscountPrice * (previousCount + 1)
                            );
                            setGrandSave(
                              productNumericPrice * (previousCount + 1) -
                                productNumericDiscountPrice *
                                  (previousCount + 1)
                            );
                            return previousCount + 1;
                          });
                        }}
                      >
                        <FaPlus />
                      </button>
                    </td>
                  </tr>

                  <tr>
                    <td>Grand Total: {currency + grandTotal}</td>
                  </tr>

                  {productDiscount && (
                    <tr>
                      <td>Total Saving: {currency + grandSave}</td>
                    </tr>
                  )}

                  <tr>
                    <td key={reRenderSize}>
                      Size:
                      {productSizes.map((element) => (
                        <button
                          className={`${
                            element === productSelectedSize
                              ? "selectedButton"
                              : "unselectedButton"
                          } me-1 mb-1 `}
                          onClick={() => {
                            setProductSelectedSize(element);
                            setReRenderSize((prev) => prev + 1);
                          }}
                        >
                          {element}
                        </button>
                      ))}
                    </td>
                  </tr>

                  <tr>
                    <td>Expected Delevery: {ddmmyyyyDate}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="col-sm-6 pb-3 pt-1">
              <textarea
                placeholder="Shipping Address"
                value={address}
                className="w-100 h-100"
                onChange={(element) => {
                  setAddress(element.currentTarget.value);
                }}
                onFocus={() => {
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              ></textarea>
            </div>
          </div>

          <div className="row mt-2 pb-4">
            <div className="col-12 text-center">
              <button
                className="btn btn-dark rounded-pill"
                onClick={async (element) => {
                  element.currentTarget.disabled = true;
                  element.currentTarget.disabled = await addressValidation();
                }}
              >
                Place An Order
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default BuyProduct;
