import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import "./Profile.css";
import JoggerHeader from "./JoggerHeader";
import Footer from "./Footer";
import axios from "axios";

import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { ImCross } from "react-icons/im";

import Loader from "../Loader";
import store from "../ReduxStore";

function Profile() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!store.getState().auth) {
      navigate("/");
    }
  }, []);

  const [isLoading, setLoading] = useState(false);

  const [ordersIsOpen, setOrdersOpen] = useState(false);
  const [orderData, setOrderData] = useState(false);

  const [orders, setOrders] = useState([]);

  const [show_modal, setshow_modal] = useState(false);

  const [accoridianLoader, setAccoridanLoader] = useState(false);

  function getOrderDetails() {
    if (!orderData) {
      setAccoridanLoader(true);
      axios
        .get("/get_user_order_info")
        .then((res) => {
          setOrders(res.data.orders);
          setAccoridanLoader(false);
        })
        .catch((err) => {
          alert("something went wrong");
        });
      setOrderData(true);
    }
  }

  function dileveryDate(date) {
    let orderDate = new Date(date);
    let increasedDate =
      orderDate.getDate() + 3 < 10
        ? "0" + (orderDate.getDate() + 2)
        : orderDate.getDate() + 2;
    let increasedMonth =
      orderDate.getMonth() < 10
        ? "0" + orderDate.getMonth()
        : orderDate.getMonth();
    let increasedYear = orderDate.getFullYear();
    return `${increasedDate}-${increasedMonth}-${increasedYear}`;
  }

  function orderDate(date) {
    let orderDate = new Date(date);
    let increasedDate =
      orderDate.getDate() < 10
        ? "0" + (orderDate.getDate() + 2)
        : orderDate.getDate() + 2;
    let increasedMonth =
      orderDate.getMonth() < 10
        ? "0" + orderDate.getMonth()
        : orderDate.getMonth();
    let increasedYear = orderDate.getFullYear();
    return `${increasedDate}-${increasedMonth}-${increasedYear}`;
  }

  const [deleteElementId, setDeleteElementId] = useState(null);
  const [deleteElementIndex, setDeleteElementIndex] = useState(null);

  function confirmDelete(element) {
    element.target.disabled = true;
    if (deleteElementId !== null && deleteElementIndex !== null) {
      axios
        .delete(`/cancelOrder/${deleteElementId}`)
        .then((res) => {
          //using delete method provides clearity for understadning as it is an imp part of CURD
          // moresafer as there are more safety features for delte than get like csrf protection for http requests
          if (res.data === 200) {
            // console.log(deleteElementIndex)
            //         let newElem=orders.splice(deleteElementIndex, 1);
            setOrders((prevOrders) => {
              let firstHalf = prevOrders.slice(0, deleteElementIndex);
              let secondHalf = prevOrders.slice(deleteElementIndex + 1);
              return [...firstHalf, ...secondHalf];
            });
          }
        })
        .catch((err) => alert("something went wrong"));

      setDeleteElementId(null);
      setDeleteElementIndex(null);
      setshow_modal(false);
      element.target.disabled = false;
    }
  }

  return (
    <div className="bg-white">
      <JoggerHeader />
      {isLoading && <Loader />}

      {accoridianLoader && <Loader />}

      {!isLoading && (
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 py-3">
              <div id="accordion" className="w-100">
                <div className="accordion-item w-100">
                  <div
                    className={`accordion-header col-12 ps-3 d-flex justify-content-between align-items-center ${
                      ordersIsOpen ? "radiousAll" : "radiousTop"
                    }`}
                    id="headingOne"
                  >
                    <button
                      className="accordion-button ordersButton h-100"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                      onClick={() => {
                        setOrdersOpen(!ordersIsOpen);
                        getOrderDetails();
                      }}
                    >
                      My Orders
                    </button>

                    {ordersIsOpen ? (
                      <IoIosArrowUp className=" arrowIcon me-3" />
                    ) : (
                      <IoIosArrowDown className=" arrowIcon me-3" />
                    )}
                  </div>
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordion"
                  >
                    <div className="accordion-body w-100 bg-white p-2 mt-5">
                      {!accoridianLoader && orders.length === 0 && (
                        <div className="text-center mb-5">No Orders</div>
                      )}

                      {orders.map((element, index) => (
                        <div
                          className="row cartProductDiv"
                          key={"cartProductDiv" + index}
                        >
                          <div
                            className="col-5 col-sm-4 col-md-3 p-2 d-flex align-items-center"
                            onClick={() => {
                              navigate("/view_product/" + element.product_id);
                            }}
                          >
                            <img
                              alt={"cartProduct" + index}
                              src={"/product_pictures/" + element.product_img}
                              className="w-100"
                            />
                          </div>

                          <div className="col-7 col-sm-8 col-md-5 pb-2 pt-4 pe-2">
                            <h5 className="cartProductName">
                              {element.product_name}
                            </h5>
                            <h6 className="">
                              Price: {element.currency + element.product_price}
                            </h6>
                            <h6 className="">Qty: {element.quantity}</h6>
                            <h6 className="">Size: {element.product_size}</h6>
                            <h6 className="cartProductDiscription">
                              Total:{" "}
                              <b>{element.currency + element.totalBill}</b>
                            </h6>
                            <h6 className="">
                              Status: <b>{element.delivery_status}</b>
                            </h6>
                            <h6 className="smallText">
                              Delivery By: {dileveryDate(element.order_time)}
                            </h6>
                            <h6 className="smallText">
                              Order Date: {orderDate(element.order_time)}
                            </h6>

                            <div className="d-flex justify-content-around d-md-none ">
                              <button
                                className="btn btn-dark w-100 rounded-pill mb-2"
                                onClick={() => {
                                  setDeleteElementId(element._id);
                                  setDeleteElementIndex(index);
                                  setshow_modal(true);
                                }}
                              >
                                Cancel Order
                              </button>
                            </div>
                          </div>

                          <div className="col-0 col-md-4 d-none d-md-block">
                            <div className="h-100 d-flex align-items-center">
                              <button
                                className="btn btn-dark unorderButton rounded-pill"
                                onClick={() => {
                                  setDeleteElementId(element._id);
                                  setDeleteElementIndex(index);
                                  setshow_modal(true);
                                }}
                              >
                                Cancel Order
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

                  <h5 className="text-center mt-3 fw-bold">
                    Confirm Cancilation
                  </h5>

                  <div className="container-fluid">
                    <div className="row p-3">
                      <div className="col-12 text-center">
                        <p>Are you sure you want to cancle this order?</p>
                      </div>
                      <div className="col-12 d-flex justify-content-around">
                        <button
                          className="btn btn-dark"
                          onClick={() => {
                            setDeleteElementId(null);
                            setDeleteElementIndex(null);
                            setshow_modal(false);
                          }}
                        >
                          Go Back
                        </button>
                        <button
                          className="btn btn-light"
                          onClick={confirmDelete}
                        >
                          Cancel Order
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

export default Profile;
