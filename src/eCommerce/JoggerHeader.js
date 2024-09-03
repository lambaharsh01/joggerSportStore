import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

import "./JoggerHeader.css";
import { Link, useNavigate } from "react-router-dom";

import { IoListOutline, IoBagHandleOutline } from "react-icons/io5";
import { AiOutlineUser } from "react-icons/ai";
import { IoIosSearch } from "react-icons/io";
import { MdArrowOutward } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import { ImCross } from "react-icons/im";

// REDUX STORE
import store from "../ReduxStore";

import reduxHeader from "./ReduxHeaders";
import { sub } from "date-fns";

function JoggerHeader() {
  const navigate = useNavigate();

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [logingOut, setLogingOut] = useState(false);

  const catagoryNewRelease_Link = `/view_catagory/New Release/`;
  const catagoryMen_Link = `/view_catagory/Men/`;
  const catagoryWomen_Link = `/view_catagory/Women/`;
  const catagoryKids_Link = `/view_catagory/Kids/`;

  const [showSideOffcanvas, setShowSideOffcanvas] = useState(false);
  const handleToggleSideOffcanvas = () => {
    setShowSideOffcanvas(!showSideOffcanvas);
  };

  const [showSearchOffcanvas, setShowSearchOffcanvas] = useState(false);

  const [newRelease1, setNewRelease1] = useState(false);
  const [newRelease2, setNewRelease2] = useState(false);

  const [men1, setMen1] = useState(false);
  const [men2, setMen2] = useState(false);

  const [women1, setWomen1] = useState(false);
  const [women2, setWomen2] = useState(false);

  const [kids1, setKids1] = useState(false);
  const [kids2, setKids2] = useState(false);

  // For Sidebar
  // For Sidebar
  const [sideShowNewRelease, setSideShowNewRelease] = useState(false);
  const [sideShowMen, setSideShowMen] = useState(false);
  const [sideShowWomen, setSideShowWomen] = useState(false);
  const [sideShowKids, setSideShowKids] = useState(false);

  const [newReleaseCatagory, setNewReleaseCatagory] = useState([]);
  const [menCatagory, setMenCatagory] = useState([]);
  const [womenCatagory, setWomenCatagory] = useState([]);
  const [kidCatagory, setKidCatagory] = useState([]);

  const [newReleaseSub, setNewReleaseSub] = useState([]);
  const [menSub, setMenSub] = useState([]);
  const [womenSub, setWomenSub] = useState([]);
  const [kidSub, setKidSub] = useState([]);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    document.body.style.background = "white";

    var prevScrollpos = window.pageYOffset;
    function handleScroll() {
      var currentScrollPos = window.pageYOffset;

      if (prevScrollpos > currentScrollPos || currentScrollPos < 50) {
        if (document.getElementById("JoggerHeaderDiv"))
          document.getElementById("JoggerHeaderDiv").style.top = "0";
      } else {
        if (document.getElementById("JoggerHeaderDiv"))
          document.getElementById("JoggerHeaderDiv").style.top = "-90px";

        setNewRelease1(false);
        setNewRelease2(false);
        setMen1(false);
        setMen2(false);
        setWomen1(false);
        setWomen2(false);
        setKids1(false);
        setKids2(false);
      }
      prevScrollpos = currentScrollPos;
    }

    window.addEventListener("scroll", handleScroll);

    let previosStatus = store.getState().auth;

    axios
      .get("/get_auth")
      .then((res) => {
        if (res.data.authenticate) {
          store.dispatch({
            type: "insertData",
            payload: res.data.authenticate,
          });
          setLoggedIn(store.getState().auth);
          setAdmin(store.getState().user_type === "admin");

          let thisStatus = store.getState().auth;

          if (
            res.data.authenticate.loginTime &&
            res.data.authenticate.logOutTime &&
            !previosStatus &&
            thisStatus
          ) {
            let now = moment().format();
            let timeDifferenceInSec = moment(
              res.data.authenticate.logOutTime
            ).diff(now, "milliseconds");

            setTimeout(() => {
              store.dispatch({ type: "clearData" });
              alert("your session has been expired Please login again.");
              setLoggedIn(false);
              setAdmin(false);
              setLogingOut(false);
              navigate("/");
            }, Number(timeDifferenceInSec));
          }
        }
      })
      .catch((err) => {
        alert("something went wrong");
      });

    // get headers
    if (reduxHeader.getState().header) {
      let headers = reduxHeader.getState();

      setNewReleaseCatagory(headers.newReleaseMain);
      setNewReleaseSub(headers.newReleaseSub);

      setMenCatagory(headers.menMain);
      setMenSub(headers.menSub);

      setWomenCatagory(headers.womenMain);
      setWomenSub(headers.womenSub);

      setKidCatagory(headers.kidsMain);
      setKidSub(headers.kidsSub);

      setProducts(headers.products);
    } else {
      axios
        .get("/get_headers")
        .then((res) => {
          let header = res.data.headers;

          let headerData = {
            header: true,
            newReleaseMain: [],
            newReleaseSub: [],
            menMain: [],
            menSub: [],
            womenMain: [],
            womenSub: [],
            kidsMain: [],
            kidsSub: [],
            products: [],
          };

          if (header[0]) {
            setNewReleaseCatagory(header[0].catagory);
            setNewReleaseSub(header[0].sub_catagory);

            headerData.newReleaseMain = header[0].catagory;
            headerData.newReleaseSub = header[0].sub_catagory;
          }
          if (header[1]) {
            setMenCatagory(header[1].catagory);
            setMenSub(header[1].sub_catagory);

            headerData.menMain = header[1].catagory;
            headerData.menSub = header[1].sub_catagory;
          }
          if (header[2]) {
            setWomenCatagory(header[2].catagory);
            setWomenSub(header[2].sub_catagory);
            headerData.womenMain = header[2].catagory;
            headerData.womenSub = header[2].sub_catagory;
          }
          if (header[3]) {
            setKidCatagory(header[3].catagory);
            setKidSub(header[3].sub_catagory);
            headerData.kidsMain = header[3].catagory;
            headerData.kidsSub = header[3].sub_catagory;
          }

          setProducts(res.data.products);
          headerData.products = res.data.products;

          reduxHeader.dispatch({ type: "insertData", payload: headerData });
        })
        .catch((err) => {
          alert("something went wrong");
        });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [searchValue, setSearchValue] = useState("");

  const filterCondition = (item) =>
    item.produt_name.toLowerCase().includes(searchValue.toLowerCase());

  const filteredItems = products.filter(filterCondition);

  function closeAll() {
    setShowSideOffcanvas(false);
    setNewRelease1(false);
    setNewRelease2(false);
    setMen1(false);
    setMen2(false);
    setWomen1(false);
    setWomen2(false);
    setKids1(false);
    setKids2(false);
  }

  function destroySession() {
    axios
      .post("/destroy_session")
      .then((res) => {
        if (res.data === 200) {
          localStorage.removeItem("token");
          store.dispatch({ type: "clearData" });
          setLoggedIn(false);
          setAdmin(false);
          setLogingOut(false);
          navigate("/");
        }
      })
      .catch((err) => {
        alert("something went wrong");
      });
  }

  const [isOnline, setOnline] = useState(false);
  const [isOffline, setOffline] = useState(false);

  function handleOnline() {
    setOnline(true);
    setTimeout(() => {
      setOnline(false);
    }, 1500);
    setOffline(false);
  }

  function handleOffline() {
    setOffline(true);
  }

  // Add event listeners for online and offline events
  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  return (
    <div>
      {isOffline && <div className="w-100 offlineAlert">You Are Offline</div>}

      {isOnline && <div className="w-100 backOnlineAlert">Back Online</div>}

      <div id="JoggerHeaderDiv">
        <div className="top_header d-flex justify-content-between align-items-center px-2">
          <div className="p-2"></div>

          <div className="top_header_content">
            <span>
              <Link style={{ textDecoration: "none", color: "black" }} to={"/"}>
                Home
              </Link>
            </span>

            {isLoggedIn && (
              <>
                <span className="top_mid_span">
                  <Link
                    style={{ textDecoration: "none", color: "black" }}
                    to={"/"}
                  >
                    About Us
                  </Link>
                </span>
                <span
                  className="cursorPointer"
                  onClick={() => {
                    setLogingOut(true);
                  }}
                >
                  Log Out
                </span>
              </>
            )}

            {!isLoggedIn && (
              <>
                <span className="top_mid_span">
                  <Link
                    style={{ textDecoration: "none", color: "black" }}
                    to={"/"}
                  >
                    About Us
                  </Link>
                </span>

                <span>
                  <Link
                    style={{ textDecoration: "none", color: "black" }}
                    to={"/login"}
                  >
                    Sign In
                  </Link>
                </span>
              </>
            )}
          </div>
        </div>

        <div className="row bottom_header ">
          <div
            className="col-4 col-sm-3 d-flex align-items-center ps-4 bg-white"
            onClick={() => {
              navigate("/");
            }}
          >
            <img
              className="verySMallImg cursorPointer"
              src="/portfolio_images/jogger_main.png"
            />
          </div>
          <div className="bot_nav_section2  d-none d-sm-block col-sm-6 bg-white">
            <div className="w-100 h-100 d-flex justify-content-around">
              <div
                className="h-100 d-flex align-items-center big_screen_opyion cursorPointer"
                onMouseOver={() => setNewRelease1(true)}
                onMouseLeave={() => setNewRelease1(false)}
                onClick={() => {
                  navigate("/view_catagory/New Release");
                }}
              >
                New Release
              </div>

              <div
                className="h-100 d-flex align-items-center big_screen_opyion cursorPointer"
                onMouseOver={() => setMen1(true)}
                onMouseLeave={() => setMen1(false)}
                onClick={() => {
                  navigate("/view_catagory/Men");
                }}
              >
                Men
              </div>

              <div
                className="h-100 d-flex align-items-center big_screen_opyion cursorPointer"
                onMouseOver={() => setWomen1(true)}
                onMouseLeave={() => setWomen1(false)}
                onClick={() => {
                  navigate("/view_catagory/Women");
                }}
              >
                Women
              </div>

              <div
                className="h-100 d-flex align-items-center big_screen_opyion cursorPointer"
                onMouseOver={() => setKids1(true)}
                onMouseLeave={() => setKids1(false)}
                onClick={() => {
                  navigate("/view_catagory/Kids");
                }}
              >
                Kids
              </div>
            </div>
          </div>

          <div className="bot_nav_section3 col-8 col-sm-3 d-flex justify-content-end align-items-center pe-3">
            <IoIosSearch
              className="nav_bar_icon fw-bold cursorPointer"
              onClick={() => {
                setShowSearchOffcanvas(true);
              }}
            />

            {isAdmin && (
              <>
                <CiSettings
                  className="nav_bar_icon cursorPointer"
                  onClick={() => {
                    setDropdownOpen(!dropdownOpen);
                  }}
                />
                <Link
                  style={{ textDecoration: "none", color: "black" }}
                  to={"/profile"}
                >
                  <AiOutlineUser className="nav_bar_icon cursorPointer" />
                </Link>
              </>
            )}

            {!isAdmin && (
              <>
                {isLoggedIn && (
                  <>
                    <Link
                      style={{ textDecoration: "none", color: "black" }}
                      to={"/cart"}
                    >
                      <IoBagHandleOutline className="nav_bar_icon cursorPointer" />
                    </Link>
                    <Link
                      style={{ textDecoration: "none", color: "black" }}
                      to={"/profile"}
                    >
                      <AiOutlineUser className="nav_bar_icon cursorPointer" />
                    </Link>
                  </>
                )}
                {!isLoggedIn && (
                  <>
                    <Link
                      style={{ textDecoration: "none", color: "black" }}
                      to={"/login"}
                    >
                      <IoBagHandleOutline className="nav_bar_icon cursorPointer" />
                    </Link>
                    <Link
                      style={{ textDecoration: "none", color: "black" }}
                      to={"/login"}
                    >
                      <AiOutlineUser className="nav_bar_icon cursorPointer" />
                    </Link>
                  </>
                )}
              </>
            )}

            <IoListOutline
              className="nav_bar_icon d-sm-none d-block cursorPointer"
              onClick={handleToggleSideOffcanvas}
            />
          </div>
        </div>
      </div>

      <div className="divForSpace w-100"></div>

      {/* SIDE OFFCANVAS */}
      {/* SIDE OFFCANVAS */}

      <div
        className={`offcanvas offcanvas-end w-75 side_bar_offcanvas ${
          showSideOffcanvas ? " show" : ""
        }`}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Chose Your Look</h5>
          <button
            type="button"
            className="btn-close text-reset"
            onClick={handleToggleSideOffcanvas}
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <div className="mt-2 mb-3">
            <h5
              className="main_headers_heading cursorPointer"
              onClick={() => {
                setSideShowNewRelease(!sideShowNewRelease);
              }}
            >
              New Release
            </h5>
            {sideShowNewRelease && (
              <div className="ps-3 mb-5">
                {newReleaseCatagory.map((data, index) => (
                  <div className="mt-2" key={"newRelease" + index}>
                    <h6 className="sidebar_heading">
                      <Link
                        style={{ textDecoration: "none", color: "black" }}
                        to={catagoryNewRelease_Link + data}
                        onClick={() => {
                          closeAll();
                        }}
                      >
                        {data}
                      </Link>
                    </h6>

                    {newReleaseSub[index]
                      ? newReleaseSub[index].map((subData, subIndex) => (
                          <div
                            className="headers_subheading ms-3"
                            key={"newReleaseSub" + subIndex}
                          >
                            <Link
                              style={{
                                textDecoration: "none",
                                color: "rgb(76, 76, 76)",
                              }}
                              to={
                                catagoryNewRelease_Link + data + "/" + subData
                              }
                              onClick={() => {
                                closeAll();
                              }}
                            >
                              <span>{subData}</span>
                            </Link>
                          </div>
                        ))
                      : null}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-2 mb-3 cursorPointer">
            <h5
              className="main_headers_heading"
              onClick={() => {
                setSideShowMen(!sideShowMen);
              }}
            >
              Men
            </h5>
            {sideShowMen && (
              <div className="ps-3 mb-5">
                {menCatagory.map((data, index) => (
                  <div className="mt-2" key={"mainCatagory" + index}>
                    <h6 className="sidebar_heading">
                      <Link
                        style={{ textDecoration: "none", color: "black" }}
                        to={catagoryMen_Link + data}
                        onClick={() => {
                          closeAll();
                        }}
                      >
                        {data}
                      </Link>
                    </h6>

                    {menSub[index]
                      ? menSub[index].map((subData, subIndex) => (
                          <div
                            className="headers_subheading ms-3"
                            key={"menCatagorySub" + subIndex}
                          >
                            <Link
                              style={{
                                textDecoration: "none",
                                color: "rgb(76, 76, 76)",
                              }}
                              to={catagoryMen_Link + data + "/" + subData}
                              onClick={() => {
                                closeAll();
                              }}
                            >
                              <span>{subData}</span>
                            </Link>
                          </div>
                        ))
                      : null}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-2 mb-3 cursorPointer">
            <h5
              className="main_headers_heading"
              onClick={() => {
                setSideShowWomen(!sideShowWomen);
              }}
            >
              Women
            </h5>
            {sideShowWomen && (
              <div className="ps-3 mb-5">
                {womenCatagory.map((data, index) => (
                  <div className="mt-2" key={"womenCat" + index}>
                    <h6 className="sidebar_heading">
                      <Link
                        style={{ textDecoration: "none", color: "black" }}
                        to={catagoryWomen_Link + data}
                        onClick={() => {
                          closeAll();
                        }}
                      >
                        {data}
                      </Link>
                    </h6>

                    {womenSub[index]
                      ? womenSub[index].map((subData, subIndex) => (
                          <div
                            className="headers_subheading ms-3"
                            key={"womenSubIndex" + subIndex}
                          >
                            <Link
                              style={{
                                textDecoration: "none",
                                color: "rgb(76, 76, 76)",
                              }}
                              to={catagoryWomen_Link + data + "/" + subData}
                              onClick={() => {
                                closeAll();
                              }}
                            >
                              <span>{subData}</span>
                            </Link>
                          </div>
                        ))
                      : null}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-3">
            <h5
              className="main_headers_heading cursorPointer"
              onClick={() => {
                setSideShowKids(!sideShowKids);
              }}
            >
              Kids
            </h5>
            {sideShowKids && (
              <div className="ps-3 mb-5">
                {kidCatagory.map((data, index) => (
                  <div className="mt-2" key={"kidsMain" + index}>
                    <h6 className="sidebar_heading">
                      <Link
                        style={{ textDecoration: "none", color: "black" }}
                        to={catagoryKids_Link + data}
                        onClick={() => {
                          closeAll();
                        }}
                      >
                        {data}
                      </Link>
                    </h6>

                    {kidSub[index]
                      ? kidSub[index].map((subData, subIndex) => (
                          <div
                            className="headers_subheading ms-3"
                            key={"kidsSub" + subIndex}
                          >
                            <Link
                              style={{
                                textDecoration: "none",
                                color: "rgb(76, 76, 76)",
                              }}
                              to={catagoryKids_Link + data + "/" + subData}
                              onClick={() => {
                                closeAll();
                              }}
                            >
                              <span>{subData}</span>
                            </Link>
                          </div>
                        ))
                      : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* SIDE OFFCANVAS END*/}
      {/* SIDE OFFCANVAS END*/}

      {/* SIDE OFFCANVAS */}
      {/* SIDE OFFCANVAS */}

      {isAdmin && (
        <div
          className={`offcanvas offcanvas-end side_bar_offcanvas ${
            dropdownOpen ? " show" : ""
          }`}
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">Admin Access</h5>
            <button
              type="button"
              className="btn-close text-reset"
              onClick={() => {
                setDropdownOpen(!dropdownOpen);
              }}
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <h5 className="mb-3">
              <Link
                style={{ textDecoration: "none", color: "black" }}
                to={"/catagories"}
              >
                Headers
              </Link>
            </h5>

            <h5 className="mb-3">
              <Link
                style={{ textDecoration: "none", color: "black" }}
                to={"/admin_dashboard"}
              >
                Dashboard
              </Link>
            </h5>

            <h5 className="mb-3">
              <Link
                style={{ textDecoration: "none", color: "black" }}
                to={"/add_product"}
              >
                Add Product
              </Link>
            </h5>

            {/* { adminAccess && (
    <div className='logoIfAdmin'>
        <MdAdminPanelSettings onClick={()=>{navigate('/admin_dashboard')}}/>
    </div>
)} */}
          </div>
        </div>
      )}
      {/* SIDE OFFCANVAS END*/}
      {/* SIDE OFFCANVAS END*/}

      {/* SEARCH OFFCANVAS */}
      {/* SEARCH OFFCANVAS */}

      <div
        className={`offcanvas offcanvas-end w-75 side_bar_offcanvas ${
          showSearchOffcanvas ? " show" : ""
        }`}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Search</h5>
          <button
            type="button"
            className="btn-close text-reset"
            onClick={() => {
              setShowSearchOffcanvas(false);
            }}
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body overflow-hidden p-3">
          <div className="posrel">
            <IoIosSearch className="search_input_icon fw-bold" />
            <input
              className="search_input rounded-pill"
              value={searchValue}
              onChange={(element) => {
                setSearchValue(element.currentTarget.value);
              }}
            />
          </div>
          <div className="mt-3 ps-2">
            {filteredItems.map((element, index) => (
              <div className="ps-1" key={"filtered" + index}>
                <Link
                  style={{ textDecoration: "none", color: "black" }}
                  to={`/view_product/${element._id}`}
                >
                  <MdArrowOutward />
                  <span className="text-capitalize">{element.produt_name}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* SEARCH OFFCANVAS END*/}
      {/* SEARCH OFFCANVAS END*/}

      {(newRelease1 || newRelease2) && (
        <div
          className="w-100 dataShowOne"
          onMouseOver={() => setNewRelease2(true)}
          onMouseLeave={() => setNewRelease2(false)}
        >
          <div className="row px-5">
            {newReleaseCatagory.map((data, index) => (
              <div className="col-3 p-2" key={"newReleaseMain" + index}>
                <h6 className="headers_heading">
                  <Link
                    style={{ textDecoration: "none", color: "black" }}
                    to={catagoryNewRelease_Link + data}
                    onClick={() => {
                      closeAll();
                    }}
                  >
                    {data}
                  </Link>
                </h6>

                {newReleaseSub[index]
                  ? newReleaseSub[index].map((subData, subIndex) => (
                      <div
                        className="headers_subheading mb-1"
                        key={"newReleaseSub" + subIndex}
                      >
                        <Link
                          style={{
                            textDecoration: "none",
                            color: "rgb(76, 76, 76)",
                          }}
                          to={catagoryNewRelease_Link + data + "/" + subData}
                          onClick={() => {
                            closeAll();
                          }}
                        >
                          <span>{subData}</span>
                        </Link>
                      </div>
                    ))
                  : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {(men1 || men2) && (
        <div
          className="w-100 dataShowOne"
          onMouseOver={() => setMen2(true)}
          onMouseLeave={() => setMen2(false)}
        >
          <div className="row px-5">
            {menCatagory.map((data, index) => (
              <div className="col-3 p-2" key={"menMain2" + index}>
                <h6 className="headers_heading">
                  <Link
                    style={{ textDecoration: "none", color: "black" }}
                    to={catagoryMen_Link + data}
                    onClick={() => {
                      closeAll();
                    }}
                  >
                    {data}
                  </Link>
                </h6>

                {menSub[index]
                  ? menSub[index].map((subData, subIndex) => (
                      <div
                        className="headers_subheading mb-1"
                        key={"menSub2" + subIndex}
                      >
                        <Link
                          style={{
                            textDecoration: "none",
                            color: "rgb(76, 76, 76)",
                          }}
                          to={catagoryMen_Link + data + "/" + subData}
                          onClick={() => {
                            closeAll();
                          }}
                        >
                          <span>{subData}</span>
                        </Link>
                      </div>
                    ))
                  : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {(women1 || women2) && (
        <div
          className="w-100 dataShowOne"
          onMouseOver={() => setWomen2(true)}
          onMouseLeave={() => setWomen2(false)}
        >
          <div className="row px-5">
            {womenCatagory.map((data, index) => (
              <div className="col-3 p-2" key={"womenMain2" + index}>
                <h6 className="headers_heading">
                  <Link
                    style={{ textDecoration: "none", color: "black" }}
                    to={catagoryWomen_Link + data}
                    onClick={() => {
                      closeAll();
                    }}
                  >
                    {data}
                  </Link>
                </h6>

                {womenSub[index]
                  ? womenSub[index].map((subData, subIndex) => (
                      <div
                        className="headers_subheading mb-1"
                        key={"womenSub2" + subIndex}
                      >
                        <Link
                          style={{
                            textDecoration: "none",
                            color: "rgb(76, 76, 76)",
                          }}
                          to={catagoryWomen_Link + data + "/" + subData}
                          onClick={() => {
                            closeAll();
                          }}
                        >
                          <span>{subData}</span>
                        </Link>
                      </div>
                    ))
                  : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {(kids1 || kids2) && (
        <div
          className="w-100 dataShowOne"
          onMouseOver={() => setKids2(true)}
          onMouseLeave={() => setKids2(false)}
        >
          <div className="row px-5">
            {kidCatagory.map((data, index) => (
              <div className="col-3 p-2" key={"kidsMain2" + index}>
                <h6 className="headers_heading">
                  <Link
                    style={{ textDecoration: "none", color: "black" }}
                    to={catagoryKids_Link + data}
                    onClick={() => {
                      closeAll();
                    }}
                  >
                    {data}
                  </Link>
                </h6>

                {kidSub[index]
                  ? kidSub[index].map((subData, subIndex) => (
                      <div
                        className="headers_subheading mb-1"
                        key={"kidsSub2" + subIndex}
                      >
                        <Link
                          style={{
                            textDecoration: "none",
                            color: "rgb(76, 76, 76)",
                          }}
                          to={catagoryKids_Link + data + "/" + subData}
                          onClick={() => {
                            closeAll();
                          }}
                        >
                          <span>{subData}</span>
                        </Link>
                      </div>
                    ))
                  : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {/*CREAT MODAL START */}

      <div
        className={`modal modal-xl ${
          logingOut ? "show d-block modal-open" : "d-none"
        }`}
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-body p-0 ">
              <ImCross
                className="modal_cut_font_float text-dark me-3 mt-3  fs-4 "
                onClick={() => setLogingOut(false)}
              />

              <h5 className="text-center mt-3 fw-bold">Confirm Logout</h5>

              <div className="container-fluid">
                <div className="row p-3">
                  <div className="col-12 text-center">
                    <p>Are you sure you want to Log Out?</p>
                  </div>
                  <div className="col-12 d-flex justify-content-around">
                    <button
                      className="btn btn-light"
                      onClick={() => {
                        setLogingOut(false);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-dark"
                      onClick={() => {
                        destroySession();
                      }}
                    >
                      Log Out
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
  );
}

export default JoggerHeader;
