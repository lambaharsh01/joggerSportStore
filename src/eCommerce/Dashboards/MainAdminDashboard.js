import "./MainDashboard.css";
import JoggerHeader from "../JoggerHeader";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";

import Loader from "../../Loader";
import Footer from "../Footer";

import Cropper from "react-easy-crop";
import { FaCloudUploadAlt } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { FaCheck } from "react-icons/fa";

import Swal from "sweetalert2";

import store from "../../ReduxStore";

function MainAdminDashboard() {
  const navigate = useNavigate();

  const [isLoading, setLoading] = useState(true);
  const [mainContentLoaded, setMainContentLoaded] = useState(false);

  const [mainBackgroundImg, setMainBackgroundImage] = useState(null);
  const [mainBackgroundText, setMainBackgroundText] = useState(null);
  const [mainBackgroundSubText, setMainBackgroundSubText] = useState(null);
  const [mainBackgroundSubTextColor, setMainBackgroundSubTextColor] =
    useState(null);
  const [mainBackgroundLink, setMainBackgroundLink] = useState(null);

  const [firstSliderSource, setFirstSliderSource] = useState(null);
  const [firstSlider, setFirstSlider] = useState([]);

  const [featuredProduct1Id, setFeaturedProduct1Id] = useState(null);
  const [featuredProduct1Img, setFeaturedProduct1Img] = useState(null);
  const [featuredProduct1Heading, setFeaturedProduct1Heading] = useState(null);
  const [featuredProduct1FontColor, setFeaturedProduct1FontColor] =
    useState(null);
  const [featuredProduct1ButtonColor, setFeaturedProduct1ButtonColor] =
    useState(null);
  const [featuredProduct1ButtonFontColor, setFeaturedProduct1ButtonFontColor] =
    useState(null);

  const [featuredProduct2Id, setFeaturedProduct2Id] = useState(null);
  const [featuredProduct2Img, setFeaturedProduct2Img] = useState(null);
  const [featuredProduct2Heading, setFeaturedProduct2Heading] = useState(null);
  const [featuredProduct2FontColor, setFeaturedProduct2FontColor] =
    useState(null);
  const [featuredProduct2ButtonColor, setFeaturedProduct2ButtonColor] =
    useState(null);
  const [featuredProduct2ButtonFontColor, setFeaturedProduct2ButtonFontColor] =
    useState(null);

  const [smallHeadingText, setSmallHeadingText] = useState(null);
  const [largeHeadingText, setLargeHeadingText] = useState(null);
  const [normalHeadingText, setNormalHeadingText] = useState(null);
  const [headingLink, setHeadingLink] = useState(null);

  const [secondSliderSource, setSecondSliderSource] = useState(null);
  const [secondSlider, setSecondSlider] = useState([]);

  useEffect(() => {
    if (store.getState().user_type !== "admin") {
      navigate("/");
    } else {
      refreshData();
    }
  }, []);

  function refreshData() {
    if (!true) {
      setLoading(true);
    }

    axios
      .get("/get_dashboard_data")
      .then((res) => {
        let dashboard_info = res.data.dashboard_info;

        setMainBackgroundImage(
          "/dashboard_pictures/" + dashboard_info.main_background_image
        );
        setMainBackgroundText(dashboard_info.main_background_text);
        setMainBackgroundSubText(dashboard_info.main_background_sub_text);
        setMainBackgroundSubTextColor(
          dashboard_info.main_background_font_color
        );
        setMainBackgroundLink(dashboard_info.main_background_link);

        setFirstSliderSource(dashboard_info.first_slider_heading);
        setFirstSlider(JSON.parse(dashboard_info.first_slider));

        setFeaturedProduct1Id(dashboard_info.fetured_product_1_id);
        setFeaturedProduct1Img(
          "/product_pictures/" + dashboard_info.fetured_product_1_img
        );
        setFeaturedOne(dashboard_info.fetured_product_1_name);
        setFeaturedProduct1Heading(dashboard_info.fetured_product_1_heading);
        setFeaturedProduct1FontColor(
          dashboard_info.fetured_product_1_font_color
        );
        setFeaturedProduct1ButtonColor(
          dashboard_info.fetured_product_1_button_color
        );
        setFeaturedProduct1ButtonFontColor(
          dashboard_info.fetured_product_1_button_font_color
        );

        setFeaturedProduct2Id(dashboard_info.fetured_product_2_id);
        setFeaturedProduct2Img(
          "/product_pictures/" + dashboard_info.fetured_product_2_img
        );
        setFeaturedTwo(dashboard_info.fetured_product_2_name);
        setFeaturedProduct2Heading(dashboard_info.fetured_product_2_heading);
        setFeaturedProduct2FontColor(
          dashboard_info.fetured_product_2_font_color
        );
        setFeaturedProduct2ButtonColor(
          dashboard_info.fetured_product_2_button_color
        );
        setFeaturedProduct2ButtonFontColor(
          dashboard_info.fetured_product_2_button_font_color
        );

        setSmallHeadingText(dashboard_info.small_heading_text);
        setLargeHeadingText(dashboard_info.large_heading_text);
        setNormalHeadingText(dashboard_info.normal_heading_text);

        setHeadingLink(dashboard_info.heading_link);

        setSecondSliderSource(dashboard_info.second_slider_heading);
        setSecondSlider(JSON.parse(dashboard_info.second_slider));

        setLoading(false); //hiding the loaded after the request is completed
        setMainContentLoaded(true); //showing up the page's content when it is totally loaded
      })
      .catch((err) => {
        console.log(err);
        alert("something went wrong");
      });
  }

  const mainBackgroundClick = () => {
    if (mainBackgroundLink) {
      // navigate(mainBackgroundLink);
    }
  };

  const mainImage = useRef(null);
  const [showModal, setShowModal] = useState(false);

  const [image, setImage] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [croppedArea, setCroppedArea] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(4 / 2);

  function handleInput(element) {
    if (element.currentTarget.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setImage(reader.result);
      };
      reader.readAsDataURL(element.currentTarget.files[0]);

      setShowModal(true);
    }
  }

  //CROP CONFIRMATION
  const onCropDone = () => {
    let imgCroppedArea = croppedArea;
    const canvasEle = document.createElement("canvas");
    canvasEle.width = imgCroppedArea.width;
    canvasEle.height = imgCroppedArea.height;

    const context = canvasEle.getContext("2d");
    let imageObj1 = new Image();
    imageObj1.src = image;
    imageObj1.onload = function () {
      context.drawImage(
        imageObj1,
        imgCroppedArea.x,
        imgCroppedArea.y,
        imgCroppedArea.width,
        imgCroppedArea.height,
        0,
        0,
        imgCroppedArea.width,
        imgCroppedArea.height
      );

      // Convert the canvas content to a data URL (JPEG format)
      const dataURL = canvasEle.toDataURL("image/jpeg");

      setMainBackgroundImage(dataURL);

      setShowModal(false);
    };
  };

  //FIRST SCROLER SECTION
  const mainCatagory = ["New Release", "Men", "Women", "Kids"];
  const [selectedMainCatagory, setSelectedMainCatagory] = useState(
    "Select Main Catagory"
  );

  const [catagory, setcatagory] = useState([]);
  const [selectedCatagory, setSelectedCatagory] = useState("Select Catagory");

  const [subCatagory, setSubCatagory] = useState([]);
  const [selectedSubCatagory, setSelectedSubCatagory] = useState(
    "Select Sub Catagory"
  );

  function getCatagoryAndSubCatagory(main, cata) {
    axios
      .post("/get_per_catagory", { mainCatagory: main, catagory: cata })
      .then((res) => {
        setcatagory(res.data.allCategories);
        setSubCatagory(res.data.allSubCategories);
      })
      .catch((err) => {
        console.log(err);
        alert("something went wrong");
      });
  }

  //SECOND SCROLER SECTION
  const mainCatagory2 = ["New Release", "Men", "Women", "Kids"];
  const [selectedMainCatagory2, setSelectedMainCatagory2] = useState(
    "Select Main Catagory"
  );

  const [catagory2, setcatagory2] = useState([]);
  const [selectedCatagory2, setSelectedCatagory2] = useState("Select Catagory");

  const [subCatagory2, setSubCatagory2] = useState([]);
  const [selectedSubCatagory2, setSelectedSubCatagory2] = useState(
    "Select Sub Catagory"
  );

  function getCatagoryAndSubCatagory2(main, cata) {
    axios
      .post("/get_per_catagory", { mainCatagory: main, catagory: cata })
      .then((res) => {
        setcatagory2(res.data.allCategories);
        setSubCatagory2(res.data.allSubCategories);
      })
      .catch((err) => {
        console.log(err);
        alert("something went wrong");
      });
  }

  const [featuredOne, setFeaturedOne] = useState(null);
  const [featuredTwo, setFeaturedTwo] = useState(null);

  const [searchInputOne, setSearchInputOne] = useState(false);
  const [searchInputTwo, setSearchInputTwo] = useState(false);

  const [products, setProducts] = useState([]);
  const [productFilter, setProductFilter] = useState([]);

  useEffect(() => {
    axios
      .get("/get_all_products")
      .then((res) => {
        if (res.data.products) {
          setProducts(res.data.products);
        }
      })
      .catch((err) => {
        alert("something went wrong");
      });
  }, []);

  async function convertToFile(base64img) {
    if (base64img.includes("dashboard_pictures/")) {
      return null;
    } else {
      let date = new Date();
      let dateOptions = {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      };
      let unwantedDate = date.toLocaleString("en-US", dateOptions).split("/");
      let wantedDate =
        unwantedDate[2] + "-" + unwantedDate[0] + "-" + unwantedDate[1];
      let nameOFproduct = "dashboard_main_banner";

      if (base64img) {
        const blob = await fetch(base64img)
          .then((res) => res.blob())
          .catch((err) => {
            return null;
          });
        let file = new File([blob], `${nameOFproduct}${wantedDate}.jpeg`, {
          type: "image/jpeg",
        });
        return file;
      } else {
        return null;
      }
    }
  }

  // SAVING INFORMATION SECTION
  async function saveMainBannerInfo() {
    let mainBackgroundPicture = await convertToFile(mainBackgroundImg);
    let mainHeading = mainBackgroundText;
    let mainSubText = mainBackgroundSubText;
    let mainTextFontColor = mainBackgroundSubTextColor;

    let formData1 = new FormData();
    formData1.append("backgroundImg", mainBackgroundPicture);
    formData1.append("mainHeading", mainHeading);
    formData1.append("mainSubText", mainSubText);
    formData1.append("mainTextFontColor", mainTextFontColor);

    axios
      .post("/add_dashboard_main_banner_details", formData1)
      .then((res) => {
        Swal.fire({
          title: "Changes Made",
          text: "Go to dashboard to checkout the changes",
          icon: "success",
          showCloseButton: true,
          showCancelButton: true,
          confirmButtonColor: "coral",
          confirmButtonText: "Go To Dashboard",
          cancelButtonColor: "lightgray",
          cancelButtonText: "Stay Here",
          preConfirm: (result) => {
            navigate("/");
          },
        });

        refreshData();
      })
      .catch((err) => {
        alert("something went wrong");
      });
  }

  function saveMainFirstSlider() {
    if (
      firstSliderSource === "" ||
      selectedMainCatagory === "Select Main Catagory" ||
      selectedSubCatagory === "Select Catagory"
    ) {
      alert(
        "Please fill the slider's header, main catagory and catagory for the slider"
      );
    } else {
      setLoading(true);
      axios
        .post("/add_dashboard_first_slider_details", {
          firstSliderSource: firstSliderSource,
          selectedMainCatagory: selectedMainCatagory,
          selectedCatagory: selectedCatagory,
          selectedSubCatagory: selectedSubCatagory,
        })
        .then((res) => {
          Swal.fire({
            title: "Changes Made",
            text: "Go to dashboard to checkout the changes",
            icon: "success",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: "coral",
            confirmButtonText: "Go To Dashboard",
            cancelButtonColor: "lightgray",
            cancelButtonText: "Stay Here",
            preConfirm: (result) => {
              navigate("/");
            },
          });
          // alert('done');
          refreshData();
        })
        .catch((err) => {
          alert("something went wrong");
        });
    }
  }

  function saveMainSecondSlider() {
    if (
      secondSliderSource === "" ||
      selectedMainCatagory2 === "Select Main Catagory" ||
      selectedCatagory2 === "Select Catagory"
    ) {
      alert(
        "Please fill the slider's header, main catagory and catagory for the slider"
      );
    } else {
      setLoading(true);
      axios
        .post("/add_dashboard_second_slider_details", {
          secondSliderSource: secondSliderSource,
          selectedMainCatagory: selectedMainCatagory2,
          selectedCatagory: selectedCatagory2,
          selectedSubCatagory: selectedSubCatagory2,
        })
        .then((res) => {
          Swal.fire({
            title: "Changes Made",
            text: "Go to dashboard to checkout the changes",
            icon: "success",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: "coral",
            confirmButtonText: "Go To Dashboard",
            cancelButtonColor: "lightgray",
            cancelButtonText: "Stay Here",
            preConfirm: (result) => {
              navigate("/");
            },
          });
          // alert('Done');
          refreshData();
        })
        .catch((err) => {
          alert("something went wrong");
        });
    }
  }

  function saveFeaturedOneData() {
    setLoading(true);

    axios
      .post("/setFeaturedProduct1", {
        featuredProduct1Id: featuredProduct1Id,
        featuredOne: featuredOne,
        featuredProduct1Heading: featuredProduct1Heading,
        featuredProduct1FontColor: featuredProduct1FontColor,
        featuredProduct1ButtonColor: featuredProduct1ButtonColor,
        featuredProduct1ButtonFontColor: featuredProduct1ButtonFontColor,
      })
      .then((res) => {
        Swal.fire({
          title: "Changes Made",
          text: "Go to dashboard to checkout the changes",
          icon: "success",
          showCloseButton: true,
          showCancelButton: true,
          confirmButtonColor: "coral",
          confirmButtonText: "Go To Dashboard",
          cancelButtonColor: "lightgray",
          cancelButtonText: "Stay Here",
          preConfirm: (result) => {
            navigate("/");
          },
        });
        // alert('Done');
        refreshData();
      })
      .catch((err) => {
        alert("something went wrong");
      });
  }

  function saveFeaturedTwoData() {
    setLoading(true);
    axios
      .post("/setFeaturedProduct2", {
        featuredProduct2Id: featuredProduct2Id,
        featuredTwo: featuredTwo,
        featuredProduct2Heading: featuredProduct2Heading,
        featuredProduct2FontColor: featuredProduct2FontColor,
        featuredProduct2ButtonColor: featuredProduct2ButtonColor,
        featuredProduct2ButtonFontColor: featuredProduct2ButtonFontColor,
      })
      .then((res) => {
        Swal.fire({
          title: "Changes Made",
          text: "Go to dashboard to checkout the changes",
          icon: "success",
          showCloseButton: true,
          showCancelButton: true,
          confirmButtonColor: "coral",
          confirmButtonText: "Go To Dashboard",
          cancelButtonColor: "lightgray",
          cancelButtonText: "Stay Here",
          preConfirm: (result) => {
            navigate("/");
          },
        });
        // alert('Done');
        refreshData();
      })
      .catch((err) => {
        alert("something went wrong");
      });
  }

  function saveTextBanner() {
    setLoading(true);
    axios
      .post("/setTextBanner", {
        smallHeadingText: smallHeadingText,
        largeHeadingText: largeHeadingText,
        normalHeadingText: normalHeadingText,
        headingLink: headingLink,
      })
      .then((res) => {
        Swal.fire({
          title: "Changes Made",
          text: "Go to dashboard to checkout the changes",
          icon: "success",
          showCloseButton: true,
          showCancelButton: true,
          confirmButtonColor: "coral",
          confirmButtonText: "Go To Dashboard",
          cancelButtonColor: "lightgray",
          cancelButtonText: "Stay Here",
          preConfirm: (result) => {
            navigate("/");
          },
        });
        refreshData();
        // alert('Done');
      })
      .catch((err) => {
        alert("something went wrong");
      });
  }

  return (
    <div className="bg-white">
      <JoggerHeader />

      {isLoading && <Loader />}

      {mainContentLoaded && (
        <div>
          {/* MODAL */}
          {/* MODAL */}
          <div
            className={`modal modal-lg ${
              showModal ? "show d-block modal-open" : "d-none"
            }`}
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-body p-2 moda_height_for_the_crop">
                  <h4 className="text-center">CROP</h4>
                  <p className="text-center small_text_when_needed">
                    It is necessary to keep the image ratios{" "}
                    {aspectRatio === 1 ? "1:1" : "4:2"} to keep the website's
                    symmetry intact
                  </p>

                  <div className="w-100 d-flex justify-content-around">
                    <ImCross
                      className="modal_icons text-danger"
                      onClick={() => setShowModal(false)}
                    />
                    <FaCheck
                      className="modal_icons text-success"
                      onClick={() => {
                        onCropDone();
                      }}
                    />
                  </div>
                  <div>
                    <Cropper
                      image={image}
                      aspect={aspectRatio}
                      crop={crop}
                      zoom={zoom}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={(
                        croppedAreaPercentage,
                        croppedAreaPixels
                      ) => {
                        setCroppedArea(croppedAreaPixels);
                      }}
                      style={{
                        containerStyle: {
                          width: "96%",
                          height: "auto",
                          backgroundColor: "darkgray",
                          marginTop: "150px",
                          marginLeft: "2%",
                          marginRight: "2%",
                          marginBottom: "10px",
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* MODAL END */}
          {/* MODAL END*/}

          <div className="col-12 col-md-10 offset-md-1 ">
            <div
              className="outerDiv"
              onClick={() => {
                mainBackgroundClick();
              }}
            >
              <img className="w-100" src={mainBackgroundImg} />

              <div className="icon_container_dashboard pe-5 pt-2">
                <input
                  ref={mainImage}
                  type="file"
                  accept="image/*"
                  className="d-none"
                  onChange={handleInput}
                />
                <FaCloudUploadAlt
                  className="uploadicon"
                  onClick={() => {
                    mainImage.current.click();
                  }}
                />
              </div>

              <div className="textInside ps-3 pb-md-5 d-none d-sm-block">
                <textarea
                  rows={2}
                  className="mainContentHeader adminInputs w-100"
                  placeholder="Enter banner text"
                  value={mainBackgroundText}
                  onChange={(elem) => {
                    setMainBackgroundText(elem.currentTarget.value);
                  }}
                  style={{ color: mainBackgroundSubTextColor }}
                >
                  {mainBackgroundText}
                </textarea>
                <br />
                <input
                  className="mainSubCatagory w-100 adminInputs"
                  value={mainBackgroundSubText}
                  style={{ color: mainBackgroundSubTextColor }}
                  onChange={(elem) => {
                    setMainBackgroundSubText(elem.currentTarget.value);
                  }}
                  placeholder="Enter banner sub text"
                />

                <input
                  className="w-100 mainSubCatagory mb-2 adminInputs mt-2"
                  value={mainBackgroundSubTextColor}
                  style={{ color: mainBackgroundSubTextColor }}
                  onChange={(elem) => {
                    setMainBackgroundSubTextColor(elem.currentTarget.value);
                  }}
                  placeholder="Enter banner font color"
                />
              </div>
            </div>
            <div className="mt-2 d-block d-sm-none px-4">
              <textarea
                rows={2}
                className="adminInputs w-100"
                placeholder="Enter Banner Text"
                value={mainBackgroundText}
                onChange={(elem) => {
                  setMainBackgroundText(elem.currentTarget.value);
                }}
              >
                {mainBackgroundText}
              </textarea>
              <br />
              <input
                className="w-100 adminInputs"
                value={mainBackgroundSubText}
                onChange={(elem) => {
                  setMainBackgroundSubText(elem.currentTarget.value);
                }}
                placeholder="Enter banner sub text"
              />

              <input
                className="w-100 adminInputs mt-2"
                value={mainBackgroundSubTextColor}
                onChange={(elem) => {
                  setMainBackgroundSubTextColor(elem.currentTarget.value);
                }}
                placeholder="Enter banner font color"
              />
            </div>
            <div className="text-end px-3 pt-2">
              <button
                className="btn btn-success px-4 rounded-pill"
                onClick={() => {
                  saveMainBannerInfo();
                }}
              >
                Save Banner Section
              </button>
            </div>
          </div>

          <div className="container-fluid">
            <div className="alert alert-warning mt-4">
              Next is first scrollbar
            </div>

            <div className="row mt-5 mt-sm-5 pt-3">
              <h3 className="ps-4">
                <b>
                  <input
                    value={firstSliderSource}
                    className="adminInputs"
                    onChange={(elem) => {
                      setFirstSliderSource(elem.currentTarget.value);
                    }}
                    placeholder="Enter First Scroler's Title"
                  />
                </b>
              </h3>

              <span className="ps-4 smaller_gray_font">
                You will be able to show all the items of a Sub Catagory and
                give it your desirable heading in order to save it. you will
                have to get to the subh
              </span>

              <div className="col-sm-6 px-4 mb-2">
                <select
                  className="w-100 product_info_input py-1"
                  value={selectedMainCatagory}
                  onChange={(element) => {
                    setSelectedMainCatagory(element.currentTarget.value);
                    getCatagoryAndSubCatagory(
                      element.currentTarget.value,
                      null
                    );
                  }}
                >
                  <option value="Select Main Catagory" disabled>
                    Select Main Catagory
                  </option>
                  {mainCatagory.map((element) => (
                    <option value={element}>{element}</option>
                  ))}
                </select>
              </div>

              <div className="col-sm-6  px-4  mb-2">
                <select
                  className="w-100 product_info_input py-1"
                  value={selectedCatagory}
                  onChange={(element) => {
                    setSelectedCatagory(element.currentTarget.value);
                    getCatagoryAndSubCatagory(
                      selectedMainCatagory,
                      element.currentTarget.value
                    );
                  }}
                >
                  <option value="Select Catagory" disabled>
                    Select Catagory
                  </option>
                  {catagory.map((element) => (
                    <option value={element}>{element}</option>
                  ))}
                </select>
              </div>
              <div className="col-sm-6  px-4 mb-2">
                <select
                  className="w-100 product_info_input py-1"
                  value={selectedSubCatagory}
                  onChange={(element) => {
                    setSelectedSubCatagory(element.currentTarget.value);
                  }}
                >
                  <option value="Select Sub Catagory" disabled>
                    Select Sub Catagory
                  </option>
                  {subCatagory.map((element) => (
                    <option value={element}>{element}</option>
                  ))}
                </select>
              </div>

              <div className="col-sm-6 px-4  mb-2 text-end">
                <button
                  className="btn btn-success w-100 rounded-pill"
                  onClick={() => {
                    saveMainFirstSlider();
                  }}
                >
                  Save First Scroler Section
                </button>
              </div>

              <div className="col-12 productSlider">
                {firstSlider.map((element, index) => (
                  <Link to={`/view_product/${element._id}`}>
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
                        {element.product_sub_catagory}
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

            <div className="alert alert-warning mt-3">
              Next is featured section
            </div>

            <div className="row mt-3 mt-sm-5 pt-3">
              <div className="col-12">
                <h3 className="ps-4">
                  <b>Featured</b>
                </h3>
              </div>

              <div className="col-sm-6 px-2 mb-5">
                <div className="searchInputDiv">
                  <span className="smaller_gray_font">
                    First product to be featured
                  </span>
                  <input
                    className="adminInputs w-100  mb-2"
                    placeholder="Please select the first product to be featured"
                    onFocus={() => {
                      setSearchInputOne(true);
                    }}
                    onBlur={() => {
                      setTimeout(() => {
                        setSearchInputOne(false);
                      }, 250);
                    }}
                    value={featuredOne}
                    onChange={(elem) => {
                      setFeaturedOne(elem.currentTarget.value);
                      setProductFilter(
                        products.filter((element) => {
                          return element.produt_name
                            .toLocaleLowerCase()
                            .includes(
                              elem.currentTarget.value.toLocaleLowerCase()
                            );
                        })
                      );
                    }}
                  />

                  {searchInputOne && (
                    <div className="searchedValues w-100">
                      {productFilter.map((element) => (
                        <li
                          onClick={() => {
                            setFeaturedOne(element.produt_name);
                            setFeaturedProduct1Id(element._id);
                          }}
                        >
                          {element.produt_name}
                        </li>
                      ))}
                    </div>
                  )}

                  <span className="smaller_gray_font mt-2">
                    Featured product's content
                  </span>
                  <input
                    className="adminInputs w-100  mb-2"
                    placeholder="Please enter the heading to be shown"
                    value={featuredProduct1Heading}
                    onChange={(elem) => {
                      setFeaturedProduct1Heading(elem.currentTarget.value);
                    }}
                  />

                  <span className="smaller_gray_font mt-2">
                    Content's color
                  </span>
                  <input
                    className="adminInputs w-100  mb-2"
                    placeholder="Please enter the font color"
                    value={featuredProduct1FontColor}
                    onChange={(elem) => {
                      setFeaturedProduct1FontColor(elem.currentTarget.value);
                    }}
                  />

                  <span className="smaller_gray_font mt-2">
                    Button's background color
                  </span>
                  <input
                    className="adminInputs w-100  mb-2"
                    placeholder="Please enter the button color"
                    value={featuredProduct1ButtonColor}
                    onChange={(elem) => {
                      setFeaturedProduct1ButtonColor(elem.currentTarget.value);
                    }}
                  />

                  <span className="smaller_gray_font mt-2">
                    Button's font color
                  </span>
                  <input
                    className=" mb-2 adminInputs w-100"
                    placeholder="Please enter the button's fount color"
                    value={featuredProduct1ButtonFontColor}
                    onChange={(elem) => {
                      setFeaturedProduct1ButtonFontColor(
                        elem.currentTarget.value
                      );
                    }}
                  />

                  <button
                    className="btn btn-success w-100 rounded-pill my-2"
                    onClick={() => {
                      saveFeaturedOneData();
                    }}
                  >
                    Save Changes In First Featured
                  </button>
                </div>

                <div className="featuredDiv">
                  <img
                    src={featuredProduct1Img}
                    className="w-100 featured_image"
                  />
                  <div
                    className="featuredContent ps-4 pb-3"
                    style={{ color: featuredProduct1FontColor }}
                  >
                    <h1 className="mb-2">{featuredProduct1Heading}</h1>
                    <Link to={`/view_product/${featuredProduct1Id}`}>
                      <button
                        className="btn rounded-pill px-4"
                        style={{
                          color: featuredProduct1ButtonFontColor,
                          background: featuredProduct1ButtonColor,
                        }}
                      >
                        Shop{" "}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-sm-6 px-2 mb-4">
                <div className="searchInputDiv">
                  <span className="smaller_gray_font">
                    Second Product to be featured
                  </span>
                  <input
                    className="adminInputs w-100  mb-2"
                    placeholder="Please select the second product to be featured"
                    onFocus={() => {
                      setSearchInputTwo(true);
                    }}
                    onBlur={() => {
                      setTimeout(() => {
                        setSearchInputTwo(false);
                      }, 250);
                    }}
                    value={featuredTwo}
                    onChange={(elem) => {
                      setFeaturedTwo(elem.currentTarget.value);
                      setProductFilter(
                        products.filter((element) => {
                          return element.produt_name
                            .toLocaleLowerCase()
                            .includes(
                              elem.currentTarget.value.toLocaleLowerCase()
                            );
                        })
                      );
                    }}
                  />
                  {searchInputTwo && (
                    <div className="searchedValues w-100">
                      {productFilter.map((element) => (
                        <li
                          onClick={() => {
                            setFeaturedTwo(element.produt_name);
                            setFeaturedProduct2Id(element._id);
                          }}
                        >
                          {element.produt_name}
                        </li>
                      ))}
                    </div>
                  )}

                  <span className="smaller_gray_font mt-2">
                    Featured product's content
                  </span>
                  <input
                    className="adminInputs w-100  mb-2"
                    placeholder="Please enter the heading to be shown"
                    value={featuredProduct2Heading}
                    onChange={(elem) => {
                      setFeaturedProduct2Heading(elem.currentTarget.value);
                    }}
                  />

                  <span className="smaller_gray_font mt-2">
                    Content's color
                  </span>
                  <input
                    className="adminInputs w-100  mb-2"
                    placeholder="Please enter the font color"
                    value={featuredProduct2FontColor}
                    onChange={(elem) => {
                      setFeaturedProduct2FontColor(elem.currentTarget.value);
                    }}
                  />

                  <span className="smaller_gray_font mt-2">
                    Button's background color
                  </span>
                  <input
                    className="adminInputs w-100 mb-2"
                    placeholder="Please enter the button color"
                    value={featuredProduct2ButtonColor}
                    onChange={(elem) => {
                      setFeaturedProduct2ButtonColor(elem.currentTarget.value);
                    }}
                  />

                  <span className="smaller_gray_font mt-2">
                    Button's font color
                  </span>
                  <input
                    className="mb-2 adminInputs w-100"
                    placeholder="Please enter the button's fount color"
                    value={featuredProduct2ButtonFontColor}
                    onChange={(elem) => {
                      setFeaturedProduct2ButtonFontColor(
                        elem.currentTarget.value
                      );
                    }}
                  />

                  <button
                    className="btn btn-success w-100 rounded-pill my-2"
                    onClick={() => {
                      saveFeaturedTwoData();
                    }}
                  >
                    Save Changes In Second Featured
                  </button>
                </div>

                <div className="featuredDiv">
                  <img
                    src={featuredProduct2Img}
                    className="w-100 featured_image"
                  />
                  <div
                    className="featuredContent ps-4 pb-3"
                    style={{ color: featuredProduct2FontColor }}
                  >
                    <h1 className="mb-2">{featuredProduct2Heading}</h1>
                    <Link to={`/view_product/${featuredProduct2Id}`}>
                      <button
                        className="btn rounded-pill px-4"
                        style={{
                          color: featuredProduct2ButtonFontColor,
                          background: featuredProduct2ButtonColor,
                        }}
                      >
                        Shop{" "}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="alert alert-warning">Next is text banner</div>

            <div className="row mt-0 py-2 mt-sm-5 mb-4">
              <div className="col-12 py-2">
                <div className="preLine mt-5">
                  <p className="text-center smaller_gray_font mb-4">
                    <input
                      className="adminInputs"
                      placeholder="Please enter small short value"
                      value={smallHeadingText}
                      onChange={(elem) => {
                        setSmallHeadingText(elem.currentTarget.value);
                      }}
                    />
                  </p>
                  <h1 className="text-center mb-3">
                    <b>
                      <b>
                        <textarea
                          placeholder="Please enter heading"
                          className="adminInputs"
                          rows={3}
                          value={largeHeadingText}
                          onChange={(elem) => {
                            setLargeHeadingText(elem.currentTarget.value);
                          }}
                        ></textarea>
                      </b>
                    </b>
                  </h1>
                  <h4 className="text-center small_font">
                    <textarea
                      value={normalHeadingText}
                      className="adminInputs"
                      placeholder="Please enter text heading"
                      onChange={(elem) => {
                        setNormalHeadingText(elem.currentTarget.value);
                      }}
                    ></textarea>
                  </h4>
                  <div className="text-center">
                    <input
                      placeholder="Paste the URL"
                      value={headingLink}
                      onChange={(element) => {
                        setHeadingLink(element.currentTarget.value);
                      }}
                    />
                  </div>

                  <div className="col-sm-6 offset-sm-3 mt-3">
                    <button
                      className="btn btn-success w-100 rounded-pill"
                      onClick={() => {
                        saveTextBanner();
                      }}
                    >
                      Save Text Banner
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="alert alert-warning">
              Next is second scrollbar last section for the dashboard
            </div>

            <div className="row mt-5 mt-sm-5 pt-3">
              <h3 className="ps-4">
                <b>
                  <input
                    value={secondSliderSource}
                    className="adminInputs"
                    onChange={(elem) => {
                      setSecondSliderSource(elem.currentTarget.value);
                    }}
                    placeholder="Enter Second Scroler's Title"
                  />
                </b>
              </h3>

              <span className="ps-4 smaller_gray_font">
                You will be able to show all the items of a Sub Catagory and
                give it your desirable heading in order to save it. you will
                have to get to the subh
              </span>

              <div className="col-sm-6 px-4 mb-2">
                <select
                  className="w-100 product_info_input py-1"
                  value={selectedMainCatagory2}
                  onChange={(element) => {
                    setSelectedMainCatagory2(element.currentTarget.value);
                    getCatagoryAndSubCatagory2(
                      element.currentTarget.value,
                      null
                    );
                  }}
                >
                  <option value="Select Main Catagory" disabled>
                    Select Main Catagory
                  </option>
                  {mainCatagory2.map((element) => (
                    <option value={element}>{element}</option>
                  ))}
                </select>
              </div>

              <div className="col-sm-6  px-4  mb-2">
                <select
                  className="w-100 product_info_input py-1"
                  value={selectedCatagory2}
                  onChange={(element) => {
                    setSelectedCatagory2(element.currentTarget.value);
                    getCatagoryAndSubCatagory2(
                      selectedMainCatagory2,
                      element.currentTarget.value
                    );
                  }}
                >
                  <option value="Select Catagory" disabled>
                    Select Catagory
                  </option>
                  {catagory2.map((element) => (
                    <option value={element}>{element}</option>
                  ))}
                </select>
              </div>
              <div className="col-sm-6  px-4 mb-2">
                <select
                  className="w-100 product_info_input py-1"
                  value={selectedSubCatagory2}
                  onChange={(element) => {
                    setSelectedSubCatagory2(element.currentTarget.value);
                  }}
                >
                  <option value="Select Sub Catagory" disabled>
                    Select Sub Catagory
                  </option>
                  {subCatagory2.map((element) => (
                    <option value={element}>{element}</option>
                  ))}
                </select>
              </div>

              <div className="col-sm-6 px-4  mb-2 text-end">
                <button
                  className="btn btn-success w-100 rounded-pill"
                  onClick={() => {
                    saveMainSecondSlider();
                  }}
                >
                  Save Second Scroler Section
                </button>
              </div>

              <div className="col-12 productSlider">
                {secondSlider.map((element, index) => (
                  <Link to={`/view_product/${element._id}`}>
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
                        {element.product_sub_catagory}
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
        </div>
      )}

      <Footer />
    </div>
  );
}

export default MainAdminDashboard;
