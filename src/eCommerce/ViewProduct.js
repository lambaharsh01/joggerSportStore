import { useState, useEffect, useRef } from "react";
// import {useNavigate} from 'react-router-dom';
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";

import "./ViewProduct.css";

import JoggerHeader from "./JoggerHeader";
import Footer from "./Footer";
import { Carousel } from "react-bootstrap";

import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { MdAdminPanelSettings } from "react-icons/md";

import Loader from "../Loader";
// REDUX STORE
import store from "../ReduxStore";

function ViewProduct() {
  const navigate = useNavigate();

  const [login, setLogin] = useState(false);
  const [ifAddedToCart, setAddToCart] = useState(false);
  const [adminAccess, setAdminAccess] = useState(false);

  const [isLoading, setLoading] = useState(true);
  const [hasLoaded, setLoaded] = useState(false);

  const [similarProducs, setSimilarProducts] = useState([]);

  const [mainCatagory, setMainCatagory] = useState(null);
  const [catagory, setCatagory] = useState(null);

  function handleReachingBottom() {
    const isAtBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
    if (isAtBottom) {
      removeThisOnScrollFunction();
    }
  }

  function deBounce(func, delay) {
    let timeOutID;
    return function () {
      let context = this;
      let args = arguments;
      clearTimeout(timeOutID);

      timeOutID = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
  }

  const callingDebounce = deBounce(handleReachingBottom, 300);

  window.addEventListener("scroll", callingDebounce);

  function removeThisOnScrollFunction() {
    if (mainCatagory && catagory && similarProducs.length < 1) {
      axios
        .get(`/getRelatedProducts/${mainCatagory}/${catagory}/${productName}`)
        .then((res) => {
          setSimilarProducts(res.data.products);
          window.removeEventListener("scroll", callingDebounce);
        })
        .catch((err) => {
          alert("something went wrong");
        });
    }
  }

  let params = useParams();
  // const navigate=useNavigate();

  // CRAUSEL
  const carouselRef = useRef(null);

  const [crouselImg1, setCrouselImg1] = useState(null);
  const [crouselImg2, setCrouselImg2] = useState(null);
  const [crouselImg3, setCrouselImg3] = useState(null);

  const [crouselImg4, setCrouselImg4] = useState("");
  const [extraAttributeHeading, setextraAttributeHeading] = useState("");
  const [extraAttributeDiscription, setExtraAttributeDiscription] =
    useState("");

  const [productName, setProductName] = useState(null);
  const [productShortDiscrition, setProductShortDiscrition] = useState(null);
  const [price, setPrice] = useState(null);
  const [discount, setDiscount] = useState(null);
  const [discountPrice, setDiscountPrice] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [briefDiscription, setBriefDiscription] = useState(null);

  const product_id = params.productId;

  useEffect(() => {
    axios
      .get(`/get_product_info/${product_id}`)
      .then((res) => {
        if (!res.data.product) {
          alert("Product not Found");
          navigate("/");
        } else {
          let productInfo = res.data.product;
          setCrouselImg1("/product_pictures/" + productInfo.product_picture1);
          setCrouselImg2("/product_pictures/" + productInfo.product_picture2);
          if (productInfo.product_picture3) {
            setCrouselImg3("/product_pictures/" + productInfo.product_picture3);
          }

          setProductName(productInfo.produt_name);
          setProductShortDiscrition(productInfo.product_short_discription);
          setPrice(productInfo.product_price);
          setSizes(JSON.parse(productInfo.size_availablity));
          setBriefDiscription(productInfo.product_long_discription);
          setDiscount(productInfo.product_discount);
          setDiscountPrice(productInfo.product_discount_price);

          setextraAttributeHeading(productInfo.product_speciality1);
          setExtraAttributeDiscription(
            productInfo.product_speciality1_discription
          );
          setCrouselImg4(
            "/product_pictures/" + productInfo.product_speciality1_picture
          );

          setMainCatagory(productInfo.product_main_catagory);
          setCatagory(productInfo.product_catagory);

          setLoading(false);
          setLoaded(true);
        }

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      })
      .catch((err) => {
        alert("something went wrong");
        // navigate('/');
      });

    return () => {
      setCrouselImg1(null);
      setCrouselImg2(null);
      setCrouselImg3(null);

      setProductName(null);
      setProductShortDiscrition(null);
      setPrice(null);
      setSizes([]);
      setBriefDiscription(null);
      setDiscount(null);
      setDiscountPrice(null);

      setextraAttributeHeading("");
      setExtraAttributeDiscription("");
      setCrouselImg4("");

      setSimilarProducts([]);
      setLogin(false);
      setAddToCart(false);
      setLoading(true);
      setLoaded(false);
    };
  }, [product_id]);

  useEffect(() => {
    if (store.getState().user_type === "admin") {
      setAdminAccess(true);
    }
    if (store.getState().auth) {
      setLogin(true);

      axios
        .get(`/isInCart/${product_id}`)
        .then((res) => {
          if (res.data.inCart) {
            setAddToCart(true);
          }
        })
        .catch((err) => alert("something wnet wrong"));
    }
  }, [product_id]);

  function setSecondDivsHeight() {
    const div1Height =
      document.getElementById("desktop_side_view1").offsetHeight;
    document.getElementById("desktop_side_view2").style.maxHeight =
      div1Height + "px";
    document.getElementById("desktop_side_view2").style.overflowY = "scroll";
  }

  async function addThisProductToCart() {
    await axios
      .post("/add_to_cart", { productId: product_id })
      .then((res) => {
        setAddToCart(true);
      })
      .catch((err) => {
        alert("something went wrong");
      });
    return false;
  }

  async function removeThisProductToCart() {
    await axios
      .post("/remove_from_cart", { productId: product_id })
      .then((res) => {
        setAddToCart(false);
      })
      .catch((err) => alert("something went wrong"));

    return false;
  }

  return (
    <div>
      <JoggerHeader />

      {isLoading && (
        <div>
          <Loader />
        </div>
      )}

      {hasLoaded && (
        <div className="container-fluid bg-white pt-3">
          {adminAccess && (
            <div className="logoIfAdmin">
              <MdAdminPanelSettings
                onClick={() => {
                  navigate(`/edit_product/${product_id}`);
                }}
              />
            </div>
          )}

          <div className="row py-4 bg-white">
            <div className="col-sm-6 demo d-flex flex-column align-items-stretch">
              <div id="desktop_side_view1">
                <Carousel ref={carouselRef} interval={null}>
                  {crouselImg1 && (
                    <Carousel.Item className="custom-carousel-item">
                      <img
                        src={crouselImg1}
                        className="image"
                        alt="productImg1"
                        onLoad={() => setSecondDivsHeight()}
                      />
                      <div className="in_the_bottom_right d-flex">
                        <div
                          className="crousal_bottom_direction text-center me-2"
                          onClick={() => {
                            carouselRef.current.prev();
                          }}
                        >
                          <GrFormPrevious />
                        </div>
                        <div
                          className="crousal_bottom_direction text-center"
                          onClick={() => {
                            carouselRef.current.next();
                          }}
                        >
                          <GrFormNext />
                        </div>
                      </div>
                    </Carousel.Item>
                  )}

                  {crouselImg2 && (
                    <Carousel.Item>
                      <img
                        src={crouselImg2}
                        alt="productImg2"
                        className="image"
                      />
                      <div className="in_the_bottom_right d-flex">
                        <div
                          className="crousal_bottom_direction text-center me-2"
                          onClick={() => {
                            carouselRef.current.prev();
                          }}
                        >
                          <GrFormPrevious />
                        </div>
                        <div
                          className="crousal_bottom_direction text-center"
                          onClick={() => {
                            carouselRef.current.next();
                          }}
                        >
                          <GrFormNext />
                        </div>
                      </div>
                    </Carousel.Item>
                  )}

                  {crouselImg3 && (
                    <Carousel.Item>
                      <img
                        src={crouselImg3}
                        alt="productImg3"
                        className="image"
                      />
                      <div className="in_the_bottom_right d-flex">
                        <div
                          className="crousal_bottom_direction text-center me-2"
                          onClick={() => {
                            carouselRef.current.prev();
                          }}
                        >
                          <GrFormPrevious />
                        </div>
                        <div
                          className="crousal_bottom_direction text-center"
                          onClick={() => {
                            carouselRef.current.next();
                          }}
                        >
                          <GrFormNext />
                        </div>
                      </div>
                    </Carousel.Item>
                  )}
                </Carousel>
              </div>
            </div>

            <div className="col-sm-6 demo d-flex flex-column align-items-stretch px-5">
              <div className="w-100 d-sm-block d-none" id="desktop_side_view2">
                <h3 className="product_name_sec">{productName}</h3>

                <span className="product_short_discription_sec">
                  {productShortDiscrition}
                </span>

                <br />
                <br />

                {discount && (
                  <div>
                    <span className="product_price_sec me-3">
                      MRP: {discountPrice}
                    </span>
                    <del>
                      <span className="product_price_not discounted">
                        {price}
                      </span>
                    </del>
                  </div>
                )}

                {discount === false && (
                  <div>
                    <span className="product_price_sec">MRP: {price}</span>
                  </div>
                )}

                <br />

                <h5 className="product_priceHeader_sec">Sizes Available</h5>
                {sizes.map((element, index) => (
                  <button
                    key={"elementProduct" + index}
                    className="sizeButtonProducts me-2 mb-2"
                  >
                    {element}
                  </button>
                ))}

                <br />

                {login && (
                  <>
                    <br />
                    <button
                      className="sign_in_button btn btn-dark rounded-pill"
                      onClick={() => {
                        navigate(`/purchase/${product_id}`);
                      }}
                    >
                      Buy Now
                    </button>
                    <br />

                    {ifAddedToCart && (
                      <>
                        <br />
                        <button
                          className="add_to_cart_button btn btn-light rounded-pill"
                          onClick={async (element) => {
                            element.currentTarget.disabled = true;
                            element.currentTarget.disabled =
                              await removeThisProductToCart();
                          }}
                        >
                          Remove From Cart
                        </button>
                        <br />
                      </>
                    )}

                    {!ifAddedToCart && (
                      <>
                        <br />
                        <button
                          className="add_to_cart_button btn btn-light rounded-pill"
                          onClick={async (element) => {
                            element.currentTarget.disabled = true;
                            element.currentTarget.disabled =
                              await addThisProductToCart();
                          }}
                        >
                          Add To Cart
                        </button>
                        <br />
                      </>
                    )}
                  </>
                )}

                {!login && (
                  <>
                    <br />
                    <button
                      className="sign_in_button btn btn-dark rounded-pill"
                      onClick={() => {
                        navigate("/login");
                      }}
                    >
                      Sign In To Buy
                    </button>
                    <br />

                    <br />
                    <button
                      className="add_to_cart_button btn btn-light rounded-pill"
                      onClick={() => {
                        navigate("/login");
                      }}
                    >
                      Add To Cart
                    </button>
                    <br />

                    <br />
                    <br />

                    <div className="text-center gray_out">
                      Sign In to get access to the membership
                      <br />
                      and other benifits
                    </div>
                  </>
                )}

                <br />
                <br />

                <div className="briefDiscription">{briefDiscription}</div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="w-100 d-sm-none d-block bg-white">
              <h3 className="product_name_sec">{productName}</h3>

              <span className="product_short_discription_sec">
                {productShortDiscrition}
              </span>

              <br />
              <br />

              {discount && (
                <div>
                  <span className="product_price_sec me-3">
                    MRP: {discountPrice}
                  </span>
                  <del>
                    <span className="product_price_not discounted">
                      {price}
                    </span>
                  </del>
                </div>
              )}

              {discount === false && (
                <div>
                  <span className="product_price_sec">MRP: {price}</span>
                </div>
              )}

              <br />

              <h5 className="product_priceHeader_sec">Sizes Available</h5>
              {sizes.map((element, index) => (
                <button
                  key={"sizeButton" + index}
                  className="sizeButtonProducts me-2 mb-2"
                >
                  {element}
                </button>
              ))}

              <br />

              {login && (
                <>
                  <br />{" "}
                  <button
                    className="sign_in_button btn btn-dark rounded-pill"
                    onClick={() => {
                      navigate(`/purchase/${product_id}`);
                    }}
                  >
                    Buy Now
                  </button>
                  <br />
                  {ifAddedToCart && (
                    <>
                      <br />
                      <button
                        className="add_to_cart_button btn btn-light rounded-pill"
                        onClick={async (element) => {
                          element.currentTarget.disabled = true;
                          element.currentTarget.disabled =
                            await removeThisProductToCart();
                        }}
                      >
                        Remove From Cart
                      </button>
                      <br />
                    </>
                  )}
                  {!ifAddedToCart && (
                    <>
                      <br />
                      <button
                        className="add_to_cart_button btn btn-light rounded-pill"
                        onClick={async (element) => {
                          element.currentTarget.disabled = true;
                          element.currentTarget.disabled =
                            await addThisProductToCart();
                        }}
                      >
                        Add To Cart
                      </button>
                      <br />
                    </>
                  )}
                </>
              )}

              {!login && (
                <>
                  <br />
                  <button
                    className="sign_in_button btn btn-dark rounded-pill"
                    onClick={() => {
                      navigate("/login");
                    }}
                  >
                    Sign In To Buy
                  </button>
                  <br />

                  <br />
                  <button
                    className="add_to_cart_button btn btn-light rounded-pill"
                    onClick={() => {
                      navigate("/login");
                    }}
                  >
                    Add To Cart
                  </button>
                  <br />

                  <br />
                  <br />

                  <div className="text-center gray_out">
                    Sign In to get access to the membership
                    <br />
                    and other benifits
                  </div>
                </>
              )}

              <br />

              <div className="briefDiscription mb-2 mb-sm-5">
                {briefDiscription}
              </div>
            </div>
          </div>

          {crouselImg4.length > 0 &&
            extraAttributeHeading.length > 0 &&
            extraAttributeDiscription.length > 0 && (
              <div className="row bg-white py-3">
                <div className="col-12 col-sm-10 offset-sm-1 mt-4">
                  <div className="text-center">
                    <h4 className="text-center extra_attr_sec_heading mb-3">
                      {extraAttributeHeading}
                    </h4>
                  </div>

                  <div className="custom-carousel-item">
                    <img
                      src={crouselImg4}
                      alt="productImg4"
                      className="speciality_image"
                    />
                    <br />
                    <br />
                    <div className="briefDiscription">
                      {extraAttributeDiscription}
                    </div>
                  </div>
                </div>
              </div>
            )}

          <div className="row mt-3 mt-sm-5 pt-3">
            <h3 className="ps-4">You Might Also Like</h3>
            <div className="col-12 productSlider mb-5">
              {similarProducs.map((element, index) => (
                <Link
                  to={`/view_product/${element._id}`}
                  key={"ProductSlider" + index}
                >
                  <div className="scrolerImgDisplayDiv">
                    <img
                      alt={"scrolOneimg" + index}
                      className="w-100"
                      src={"/product_pictures/" + element.product_picture1}
                    />
                    <br />
                    <span className="small_font">{element.produt_name}</span>
                    <br />
                    <span className="smaller_gray_font">
                      {element.product_short_discription}
                    </span>
                    <br />

                    <span className="smaller_black_font">
                      MRP:
                      {element.product_discount ? (
                        <span>
                          {element.product_discount_price}{" "}
                          <del> {element.product_price}</del>
                        </span>
                      ) : (
                        <span>{element.product_price}</span>
                      )}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default ViewProduct;
