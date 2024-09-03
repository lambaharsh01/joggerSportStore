import JoggerHeader from "./JoggerHeader";
import Footer from "./Footer";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Catagories.css";

import { IoMdAdd } from "react-icons/io";
import { CiTrash } from "react-icons/ci";

import store from "../ReduxStore";
import reduxHeader from "./ReduxHeaders";

function Catagories() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    if (store.getState().user_type !== "admin") {
      navigate("/");
    } else {
      axios
        .get("/adminAuthentication")
        .then((res) => {
          setAdmin(true);
          getHeaderData();
        })
        .catch((err) => {
          navigate("/");
        });
    }
  }, [navigate]);

  function getHeaderData() {
    axios
      .get("/get_headers")
      .then((res) => {
        let header = res.data.headers;
        if (header[0]) {
          setNewReleasePara(header[0].catagory);
          setNewReleaseSubPara(header[0].sub_catagory);
        }
        if (header[1]) {
          setMenPara(header[1].catagory);
          setMenSubPara(header[1].sub_catagory);
        }
        if (header[2]) {
          setWomenPara(header[2].catagory);
          setWomenSubPara(header[2].sub_catagory);
        }
        if (header[3]) {
          setKidsPara(header[3].catagory);
          setKidsSubPara(header[3].sub_catagory);
        }
      })
      .catch((err) => {
        alert("something went wrong");
      });
  }

  const [newReleaseOffcanvas, setNewReleaseOffcanvas] = useState(false);
  const [newReleasePara, setNewReleasePara] = useState([]);
  const [newReleaseSubPara, setNewReleaseSubPara] = useState([]);
  const saveNewReleaseHeaders = () => {
    axios
      .post("/saveHeaders", {
        header: "New Release",
        mainHeading: newReleasePara,
        subHeading: newReleaseSubPara,
      })
      .then((res) => {
        setNewReleaseOffcanvas(false);
        refreshHeader();
      })
      .catch((err) => {
        alert("Something Went Wrong");
        navigate("/");
      });
  };

  const [menOffcanvas, setMenOffcanvas] = useState(false);
  const [menPara, setMenPara] = useState([]);
  const [menSubPara, setMenSubPara] = useState([]);
  const saveMenHeaders = () => {
    axios
      .post("/saveHeaders", {
        header: "Men",
        mainHeading: menPara,
        subHeading: menSubPara,
      })
      .then((res) => {
        setMenOffcanvas(false);
        refreshHeader();
      })
      .catch((err) => {
        alert("Something Went Wrong");
        navigate("/");
      });
  };

  const [womenOffcanvas, setWomenOffcanvas] = useState(false);
  const [womenPara, setWomenPara] = useState([]);
  const [womenSubPara, setWomenSubPara] = useState([]);
  const saveWomenHeaders = () => {
    axios
      .post("/saveHeaders", {
        header: "Women",
        mainHeading: womenPara,
        subHeading: womenSubPara,
      })
      .then((res) => {
        setWomenOffcanvas(false);
        refreshHeader();
      })
      .catch((err) => {
        alert("Something Went Wrong");
        navigate("/");
      });
  };

  const [kidsOffcanvas, setKidsOffcanvas] = useState(false);
  const [kidsPara, setKidsPara] = useState([]);
  const [kidsSubPara, setKidsSubPara] = useState([]);
  const saveKidsHeaders = () => {
    axios
      .post("/saveHeaders", {
        header: "Kids",
        mainHeading: kidsPara,
        subHeading: kidsSubPara,
      })
      .then((res) => {
        setKidsOffcanvas(false);
        refreshHeader();
      })
      .catch((err) => {
        alert("Something Went Wrong");
        navigate("/");
      });
  };

  const [headerKey, setHeaderKey] = useState(0);
  function refreshHeader() {
    reduxHeader.dispatch({ type: "clearData" });
    setHeaderKey((prev) => prev + 1);
  }
  return (
    <div>
      <JoggerHeader key={headerKey} />

      {admin && (
        <div>
          <div className="container-fluid">
            <div className="row">
              <div className="w-100 text-center bg-secondary main_container_div">
                <h5 className="text-white mt-2">Catagories</h5>
              </div>

              <div className="d-flex justify-content-center mb-2">
                <h3
                  className="main_catagories"
                  onClick={() => {
                    setNewReleaseOffcanvas(true);
                  }}
                >
                  New Release
                </h3>

                {/* SIDE NEW RELEASE OFFCANVAS */}

                <div
                  className={`offcanvas offcanvas-end w-75 side_bar_offcanvas ${
                    newReleaseOffcanvas ? " show" : ""
                  }`}
                >
                  <div className="offcanvas-header">
                    <h5 className="offcanvas-title">New Release</h5>
                    <button
                      type="button"
                      className="btn-close text-reset"
                      onClick={() => {
                        setNewReleaseOffcanvas(false);
                      }}
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="offcanvas-body">
                    <IoMdAdd
                      className="fs-3"
                      onClick={() => {
                        setNewReleasePara([...newReleasePara, ""]);
                        setNewReleaseSubPara([...newReleaseSubPara, []]);
                      }}
                    />
                    <div className="row">
                      {newReleasePara.map((mainElement, mainIndex) => (
                        <div className="col-md-6 py-3">
                          <input
                            placeholder="Enter Main Heading"
                            value={mainElement}
                            onChange={(mainElem) => {
                              newReleasePara[mainIndex] =
                                mainElem.currentTarget.value;
                              setNewReleasePara([...newReleasePara]);
                            }}
                          />

                          <IoMdAdd
                            onClick={() => {
                              let firstHalf = newReleaseSubPara.slice(
                                0,
                                mainIndex
                              );
                              let secondHalf = newReleaseSubPara.slice(
                                mainIndex + 1
                              );
                              let currentIndex = [
                                ...newReleaseSubPara[mainIndex],
                                "",
                              ];
                              setNewReleaseSubPara([
                                ...firstHalf,
                                currentIndex,
                                ...secondHalf,
                              ]);
                            }}
                          />
                          <CiTrash
                            onClick={() => {
                              let firstHalf = newReleaseSubPara.slice(
                                0,
                                mainIndex
                              );
                              let secondHalf = newReleaseSubPara.slice(
                                mainIndex + 1
                              );
                              setNewReleaseSubPara([
                                ...firstHalf,
                                ...secondHalf,
                              ]);

                              let mainFirstHalf = newReleasePara.slice(
                                0,
                                mainIndex
                              );
                              let mainSecondHalf = newReleasePara.slice(
                                mainIndex + 1
                              );
                              setNewReleasePara([
                                ...mainFirstHalf,
                                ...mainSecondHalf,
                              ]);
                            }}
                          />

                          {newReleaseSubPara[mainIndex]
                            ? newReleaseSubPara[mainIndex].map(
                                (subElement, subIndex) => (
                                  <div className="ps-3 pt-2">
                                    <input
                                      placeholder="Enter Sub Heading"
                                      value={subElement}
                                      onChange={(subElem) => {
                                        newReleaseSubPara[mainIndex][subIndex] =
                                          subElem.currentTarget.value;
                                        setNewReleaseSubPara([
                                          ...newReleaseSubPara,
                                        ]);
                                      }}
                                    />

                                    <CiTrash
                                      onClick={() => {
                                        let firstHalf = newReleaseSubPara.slice(
                                          0,
                                          mainIndex
                                        );
                                        let secondHalf =
                                          newReleaseSubPara.slice(
                                            mainIndex + 1
                                          );
                                        let currentIndexFirstHalf =
                                          newReleaseSubPara[mainIndex].slice(
                                            0,
                                            subIndex
                                          );
                                        let currentIndexSecondHalf =
                                          newReleaseSubPara[mainIndex].slice(
                                            subIndex + 1
                                          );
                                        setNewReleaseSubPara([
                                          ...firstHalf,
                                          [
                                            ...currentIndexFirstHalf,
                                            ...currentIndexSecondHalf,
                                          ],
                                          ...secondHalf,
                                        ]);
                                      }}
                                    />
                                  </div>
                                )
                              )
                            : null}
                        </div>
                      ))}
                    </div>

                    <div className="d-flex justify-content-around mt-2">
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          getHeaderData();
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-success"
                        onClick={saveNewReleaseHeaders}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
                {/* SIDE NEW RELEASE OFFCANVAS END*/}
              </div>

              <div className="d-flex justify-content-center mb-2">
                <h3
                  className="main_catagories"
                  onClick={() => {
                    setMenOffcanvas(true);
                  }}
                >
                  Men
                </h3>

                {/* SIDE MEN OFFCANVAS */}

                <div
                  className={`offcanvas offcanvas-end w-75 side_bar_offcanvas ${
                    menOffcanvas ? " show" : ""
                  }`}
                >
                  <div className="offcanvas-header">
                    <h5 className="offcanvas-title">Men</h5>
                    <button
                      type="button"
                      className="btn-close text-reset"
                      onClick={() => {
                        setMenOffcanvas(false);
                      }}
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="offcanvas-body">
                    <IoMdAdd
                      className="fs-3"
                      onClick={() => {
                        setMenPara([...menPara, ""]);
                        setMenSubPara([...menSubPara, []]);
                      }}
                    />
                    <div className="row">
                      {menPara.map((mainElement, mainIndex) => (
                        <div className="col-md-6 py-3">
                          <input
                            placeholder="Enter Main Heading"
                            value={mainElement}
                            onChange={(mainElem) => {
                              menPara[mainIndex] = mainElem.currentTarget.value;
                              setMenPara([...menPara]);
                            }}
                          />

                          <IoMdAdd
                            onClick={() => {
                              let firstHalf = menSubPara.slice(0, mainIndex);
                              let secondHalf = menSubPara.slice(mainIndex + 1);
                              let currentIndex = [...menSubPara[mainIndex], ""];
                              setMenSubPara([
                                ...firstHalf,
                                currentIndex,
                                ...secondHalf,
                              ]);
                            }}
                          />
                          <CiTrash
                            onClick={() => {
                              let firstHalf = menSubPara.slice(0, mainIndex);
                              let secondHalf = menSubPara.slice(mainIndex + 1);
                              setMenSubPara([...firstHalf, ...secondHalf]);

                              let mainFirstHalf = menPara.slice(0, mainIndex);
                              let mainSecondHalf = menPara.slice(mainIndex + 1);
                              setMenPara([...mainFirstHalf, ...mainSecondHalf]);
                            }}
                          />

                          {menSubPara[mainIndex]
                            ? menSubPara[mainIndex].map(
                                (subElement, subIndex) => (
                                  <div className="ps-3 pt-2">
                                    <input
                                      placeholder="Enter Sub Heading"
                                      value={subElement}
                                      onChange={(subElem) => {
                                        menSubPara[mainIndex][subIndex] =
                                          subElem.currentTarget.value;
                                        setMenSubPara([...menSubPara]);
                                      }}
                                    />

                                    <CiTrash
                                      onClick={() => {
                                        let firstHalf = menSubPara.slice(
                                          0,
                                          mainIndex
                                        );
                                        let secondHalf = menSubPara.slice(
                                          mainIndex + 1
                                        );
                                        let currentIndexFirstHalf = menSubPara[
                                          mainIndex
                                        ].slice(0, subIndex);
                                        let currentIndexSecondHalf = menSubPara[
                                          mainIndex
                                        ].slice(subIndex + 1);
                                        setMenSubPara([
                                          ...firstHalf,
                                          [
                                            ...currentIndexFirstHalf,
                                            ...currentIndexSecondHalf,
                                          ],
                                          ...secondHalf,
                                        ]);
                                      }}
                                    />
                                  </div>
                                )
                              )
                            : null}
                        </div>
                      ))}
                    </div>

                    <div className="d-flex justify-content-around mt-2">
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          getHeaderData();
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-success"
                        onClick={saveMenHeaders}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
                {/* SIDE MEN OFFCANVAS END*/}
              </div>

              <div className="d-flex justify-content-center mb-2">
                <h3
                  className="main_catagories"
                  onClick={() => {
                    setWomenOffcanvas(true);
                  }}
                >
                  Women
                </h3>

                {/* SIDE WOMEN OFFCANVAS */}

                <div
                  className={`offcanvas offcanvas-end w-75 side_bar_offcanvas ${
                    womenOffcanvas ? " show" : ""
                  }`}
                >
                  <div className="offcanvas-header">
                    <h5 className="offcanvas-title">Women</h5>
                    <button
                      type="button"
                      className="btn-close text-reset"
                      onClick={() => {
                        setWomenOffcanvas(false);
                      }}
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="offcanvas-body">
                    <IoMdAdd
                      className="fs-3"
                      onClick={() => {
                        setWomenPara([...womenPara, ""]);
                        setWomenSubPara([...womenSubPara, []]);
                      }}
                    />
                    <div className="row">
                      {womenPara.map((mainElement, mainIndex) => (
                        <div className="col-md-6 py-3">
                          <input
                            placeholder="Enter Main Heading"
                            value={mainElement}
                            onChange={(mainElem) => {
                              womenPara[mainIndex] =
                                mainElem.currentTarget.value;
                              setWomenPara([...womenPara]);
                            }}
                          />

                          <IoMdAdd
                            onClick={() => {
                              let firstHalf = womenSubPara.slice(0, mainIndex);
                              let secondHalf = womenSubPara.slice(
                                mainIndex + 1
                              );
                              let currentIndex = [
                                ...womenSubPara[mainIndex],
                                "",
                              ];
                              setWomenSubPara([
                                ...firstHalf,
                                currentIndex,
                                ...secondHalf,
                              ]);
                            }}
                          />
                          <CiTrash
                            onClick={() => {
                              let firstHalf = womenSubPara.slice(0, mainIndex);
                              let secondHalf = womenSubPara.slice(
                                mainIndex + 1
                              );
                              setWomenSubPara([...firstHalf, ...secondHalf]);

                              let mainFirstHalf = womenPara.slice(0, mainIndex);
                              let mainSecondHalf = womenPara.slice(
                                mainIndex + 1
                              );
                              setWomenPara([
                                ...mainFirstHalf,
                                ...mainSecondHalf,
                              ]);
                            }}
                          />

                          {womenSubPara[mainIndex]
                            ? womenSubPara[mainIndex].map(
                                (subElement, subIndex) => (
                                  <div className="ps-3 pt-2">
                                    <input
                                      placeholder="Enter Sub Heading"
                                      value={subElement}
                                      onChange={(subElem) => {
                                        womenSubPara[mainIndex][subIndex] =
                                          subElem.currentTarget.value;
                                        setWomenSubPara([...womenSubPara]);
                                      }}
                                    />

                                    <CiTrash
                                      onClick={() => {
                                        let firstHalf = womenSubPara.slice(
                                          0,
                                          mainIndex
                                        );
                                        let secondHalf = womenSubPara.slice(
                                          mainIndex + 1
                                        );
                                        let currentIndexFirstHalf =
                                          womenSubPara[mainIndex].slice(
                                            0,
                                            subIndex
                                          );
                                        let currentIndexSecondHalf =
                                          womenSubPara[mainIndex].slice(
                                            subIndex + 1
                                          );
                                        setWomenSubPara([
                                          ...firstHalf,
                                          [
                                            ...currentIndexFirstHalf,
                                            ...currentIndexSecondHalf,
                                          ],
                                          ...secondHalf,
                                        ]);
                                      }}
                                    />
                                  </div>
                                )
                              )
                            : null}
                        </div>
                      ))}
                    </div>

                    <div className="d-flex justify-content-around mt-2">
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          getHeaderData();
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-success"
                        onClick={saveWomenHeaders}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
                {/* SIDE WOMEN OFFCANVAS END*/}
              </div>

              <div className="d-flex justify-content-center mb-2">
                <h3
                  className="main_catagories"
                  onClick={() => {
                    setKidsOffcanvas(true);
                  }}
                >
                  Kids
                </h3>

                {/* SIDE KIDS OFFCANVAS */}

                <div
                  className={`offcanvas offcanvas-end w-75 side_bar_offcanvas ${
                    kidsOffcanvas ? " show" : ""
                  }`}
                >
                  <div className="offcanvas-header">
                    <h5 className="offcanvas-title">Kids</h5>
                    <button
                      type="button"
                      className="btn-close text-reset"
                      onClick={() => {
                        setKidsOffcanvas(false);
                      }}
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="offcanvas-body">
                    <IoMdAdd
                      className="fs-3"
                      onClick={() => {
                        setKidsPara([...kidsPara, ""]);
                        setKidsSubPara([...kidsSubPara, []]);
                      }}
                    />
                    <div className="row">
                      {kidsPara.map((mainElement, mainIndex) => (
                        <div className="col-md-6 py-3">
                          <input
                            placeholder="Enter Main Heading"
                            value={mainElement}
                            onChange={(mainElem) => {
                              kidsPara[mainIndex] =
                                mainElem.currentTarget.value;
                              setKidsPara([...kidsPara]);
                            }}
                          />

                          <IoMdAdd
                            onClick={() => {
                              let firstHalf = kidsSubPara.slice(0, mainIndex);
                              let secondHalf = kidsSubPara.slice(mainIndex + 1);
                              let currentIndex = [
                                ...kidsSubPara[mainIndex],
                                "",
                              ];
                              setKidsSubPara([
                                ...firstHalf,
                                currentIndex,
                                ...secondHalf,
                              ]);
                            }}
                          />
                          <CiTrash
                            onClick={() => {
                              let firstHalf = kidsSubPara.slice(0, mainIndex);
                              let secondHalf = kidsSubPara.slice(mainIndex + 1);
                              setKidsSubPara([...firstHalf, ...secondHalf]);

                              let mainFirstHalf = kidsPara.slice(0, mainIndex);
                              let mainSecondHalf = kidsPara.slice(
                                mainIndex + 1
                              );
                              setKidsPara([
                                ...mainFirstHalf,
                                ...mainSecondHalf,
                              ]);
                            }}
                          />

                          {kidsSubPara[mainIndex]
                            ? kidsSubPara[mainIndex].map(
                                (subElement, subIndex) => (
                                  <div className="ps-3 pt-2">
                                    <input
                                      placeholder="Enter Sub Heading"
                                      value={subElement}
                                      onChange={(subElem) => {
                                        kidsSubPara[mainIndex][subIndex] =
                                          subElem.currentTarget.value;
                                        setKidsSubPara([...kidsSubPara]);
                                      }}
                                    />

                                    <CiTrash
                                      onClick={() => {
                                        let firstHalf = kidsSubPara.slice(
                                          0,
                                          mainIndex
                                        );
                                        let secondHalf = kidsSubPara.slice(
                                          mainIndex + 1
                                        );
                                        let currentIndexFirstHalf = kidsSubPara[
                                          mainIndex
                                        ].slice(0, subIndex);
                                        let currentIndexSecondHalf =
                                          kidsSubPara[mainIndex].slice(
                                            subIndex + 1
                                          );
                                        setKidsSubPara([
                                          ...firstHalf,
                                          [
                                            ...currentIndexFirstHalf,
                                            ...currentIndexSecondHalf,
                                          ],
                                          ...secondHalf,
                                        ]);
                                      }}
                                    />
                                  </div>
                                )
                              )
                            : null}
                        </div>
                      ))}
                    </div>

                    <div className="d-flex justify-content-around mt-2">
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          getHeaderData();
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-success"
                        onClick={saveKidsHeaders}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
                {/* SIDE KIDS OFFCANVAS END*/}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Catagories;
