import "./AddProduct.css";
import JoggerHeader from "./JoggerHeader";
import Footer from "./Footer";
import axios from "axios";

import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cropper from "react-easy-crop";
import Swal from "sweetalert2";

import { Carousel } from "react-bootstrap";

import { FaCloudUploadAlt } from "react-icons/fa";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { ImCross } from "react-icons/im";
import { FaCheck } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";

import { MdLooksOne, MdLooksTwo, MdLooks3 } from "react-icons/md";

import Loader from "../Loader";

import store from "../ReduxStore";

// hey chat gpt can i use multiple useEffect(()=>{},[]) in a single react page function?  as it will make my code more readable , else i wanted to know that will it make it slow or can using multiple useeffects in the given manner affect my application's performace?
function EditProduct() {
  const navigate = useNavigate();

  useEffect(() => {
    if (store.getState().user_type !== "admin") {
      navigate("/");
    }
  }, []);

  const [loading, setLoading] = useState(true);
  const [mainContent, setMainContent] = useState(false);

  function setSecondDivsHeight() {
    const div1Height =
      document.getElementById("desktop_side_view1").offsetHeight;
    document.getElementById("desktop_side_view2").style.maxHeight =
      div1Height + "px";
    document.getElementById("desktop_side_view2").style.overflowY = "scroll";
  }

  // CRAUSEL
  const carouselRef = useRef(null);

  // CROUSEL IMAGE SRC
  const [crouselImg1, setCrouselImg1] = useState(
    "/portfolio_images/upload_photos.jpg"
  );
  const [crouselImg2, setCrouselImg2] = useState(
    "/portfolio_images/upload_photos.jpg"
  );
  const [crouselImg3, setCrouselImg3] = useState(
    "/portfolio_images/upload_photos.jpg"
  );
  // CROUSEL IMAGE SRC

  // PRODUCT SPECIALITY
  const [crouselImg4, setCrouselImg4] = useState(
    "/portfolio_images/upload_wide_photos.jpeg"
  );
  // const [crouselImg5, setCrouselImg5]=useState('/portfolio_images/upload_wide_photos.jpg');
  // PRODUCT SPECIALITY

  // CROUSEL IMAGE REFS
  const imageInput1 = useRef(null);
  const imageInput2 = useRef(null);
  const imageInput3 = useRef(null);
  // CROUSEL IMAGE REFS

  // PRODUCT SPECIALITY IMAGE REFS
  const imageInput4 = useRef(null);
  // const imageInput5=useRef(null);
  // PRODUCT SPECIALITY IMAGE REFS

  const [imgActiveCrop, setImgActiveCrop] = useState("");

  // CRAUSEL

  // CROP MODAL
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  // CROPING
  const [image, setImage] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [croppedArea, setCroppedArea] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(1 / 1);

  function handleInput(element) {
    if (element.currentTarget.files.length > 0) {
      let proceed = true;

      if (imageInput1.current === element.currentTarget) {
        setImgActiveCrop("crouselImg1");
        setAspectRatio(1 / 1);
      } else if (imageInput2.current === element.currentTarget) {
        setImgActiveCrop("crouselImg2");
        setAspectRatio(1 / 1);
      } else if (imageInput3.current === element.currentTarget) {
        setImgActiveCrop("crouselImg3");
        setAspectRatio(1 / 1);
      } else if (imageInput4.current === element.currentTarget) {
        setImgActiveCrop("crouselImg4");
        setAspectRatio(8 / 2);
      }
      // else if(imageInput5.current===element.currentTarget){
      //     setImgActiveCrop('crouselImg5');
      //     setAspectRatio(6/2);
      // }
      else {
        proceed = false;
      }

      if (proceed) {
        const reader = new FileReader();
        reader.onload = function (e) {
          setImage(reader.result);
        };
        reader.readAsDataURL(element.currentTarget.files[0]);

        setShowModal(true);
      } else {
        alert("Can't proceed ahead please refresh the page and try again");
      }
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

      if (imgActiveCrop === "crouselImg1") {
        setCrouselImg1(dataURL);
      } else if (imgActiveCrop === "crouselImg2") {
        setCrouselImg2(dataURL);
      } else if (imgActiveCrop === "crouselImg3") {
        setCrouselImg3(dataURL);
      } else if (imgActiveCrop === "crouselImg4") {
        setCrouselImg4(dataURL);
      }
      // else if(imgActiveCrop==='crouselImg5'){
      //     setCrouselImg5(dataURL);
      // }

      setShowModal(false);
    };
  };

  // product info

  const [productName, setProductName] = useState("");
  const [productShortDiscription, setProductShortDiscription] = useState("");

  const [productPrice, setProductPrice] = useState("");
  const [discount, setDiscout] = useState(false);
  const [productDiscountedPrice, setProductDiscountedPrice] = useState("");
  const [sizes, setSizes] = useState([""]);

  const [productBriefDiscription, setProductBriefDiscription] = useState("");

  const mainCatagory = ["New Release", "Men", "Women", "Kids"];
  const [selectedMainCatagory, setSelectedMainCatagory] = useState(
    "Select Product's Main Catagory"
  );

  const [catagory, setcatagory] = useState([]);
  const [selectedCatagory, setSelectedCatagory] = useState(
    "Select Product's Catagory"
  );

  const [subCatagory, setSubCatagory] = useState([]);
  const [selectedSubCatagory, setSelectedSubCatagory] = useState(
    "Select Product's Sub Catagory"
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

  const [extraAttriuteHeading, setExtraAttriuteHeading] = useState("");
  const [extraAttriuteDetails, setExtraAttriuteDetails] = useState("");

  const [validationDiv, setValidationDiv] = useState(false);
  const [validation, setValidation] = useState([]);

  async function convertToFile(base64img) {
    if (
      base64img.includes("portfolio_images/") ||
      base64img.includes("product_pictures/")
    ) {
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

      let nameOFproduct = productName.replaceAll(".", "").replaceAll(" ", "");

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

  const param = useParams();
  const [productId, setProductId] = useState(param.productId);

  useEffect(() => {
    axios
      .get(`/get_product_info/${productId}`)
      .then((res) => {
        if (!res.data.product) {
          alert("Product not Found");
        } else {
          let productInfo = res.data.product;

          setProductId(productInfo._id);
          setCrouselImg1("/product_pictures/" + productInfo.product_picture1);
          setCrouselImg2("/product_pictures/" + productInfo.product_picture2);
          if (productInfo.product_picture3) {
            setCrouselImg3("/product_pictures/" + productInfo.product_picture3);
          }

          setProductName(productInfo.produt_name);
          setProductShortDiscription(productInfo.product_short_discription);
          setProductPrice(productInfo.product_price);
          setSizes(JSON.parse(productInfo.size_availablity));
          setProductBriefDiscription(productInfo.product_long_discription);
          setDiscout(JSON.parse(productInfo.product_discount));
          setProductDiscountedPrice(productInfo.product_discount_price);

          setSelectedMainCatagory(productInfo.product_main_catagory);
          setSelectedCatagory(productInfo.product_catagory);
          setSelectedSubCatagory(productInfo.product_sub_catagory);

          setExtraAttriuteHeading(productInfo.product_speciality1);
          setExtraAttriuteDetails(productInfo.product_speciality1_discription);
          setCrouselImg4(
            "/product_pictures/" + productInfo.product_speciality1_picture
          );
        }

        setLoading(false);
        setMainContent(true);
      })
      .catch((err) => {
        console.log(err);
        alert("something went wrong");
      });

    return () => {
      setCrouselImg1("/portfolio_images/upload_photos.jpg");
      setCrouselImg2("/portfolio_images/upload_photos.jpg");
      setCrouselImg3("/portfolio_images/upload_photos.jpg");

      setProductName("");
      setProductShortDiscription("");
      setProductPrice("");
      setSizes([]);
      setProductBriefDiscription("");
      setDiscout(false);
      setProductDiscountedPrice("");

      setSelectedMainCatagory("Select Product's Main Catagory");
      setSelectedCatagory("Select Product's Catagory");
      setSelectedSubCatagory("Select Product's Sub Catagory");

      setExtraAttriuteHeading("");
      setExtraAttriuteDetails("");
      setCrouselImg4("/portfolio_images/upload_wide_photos.jpeg");
    };
  }, [productId]);

  async function editProductList() {
    let crousalImage1 = await convertToFile(crouselImg1);
    let crousalImage2 = await convertToFile(crouselImg2);
    let crousalImage3 = await convertToFile(crouselImg3);
    let attributeImage = await convertToFile(crouselImg4);

    let formData = new FormData();
    formData.append("productId", productId);
    formData.append("crousalImage1", crousalImage1);
    formData.append("crousalImage2", crousalImage2);
    formData.append("crousalImage3", crousalImage3);
    formData.append("attributeImage", attributeImage);

    formData.append("productName", productName);
    formData.append("productShortDiscription", productShortDiscription);
    formData.append("selectedMainCatagory", selectedMainCatagory);
    formData.append("selectedCatagory", selectedCatagory);
    formData.append("selectedSubCatagory", selectedSubCatagory);
    formData.append("productPrice", productPrice);
    formData.append("discount", discount);
    formData.append("productDiscountedPrice", productDiscountedPrice);
    formData.append("sizes", JSON.stringify(sizes));
    formData.append("productBriefDiscription", productBriefDiscription);
    formData.append("extraAttriuteHeading", extraAttriuteHeading);
    formData.append("extraAttriuteDetails", extraAttriuteDetails);

    if (productId) {
      axios
        .post("/update_list_data", formData)
        .then((res) => {
          Swal.fire({
            title: "Product Edited",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
            willClose: () => {
              navigate(`/view_product/${productId}`);
            },
          });
        })
        .catch((err) => alert("somethig went Wrong"));
    } else {
      alert("somethig went Wrong");
    }
  }

  function deleteTheProduct() {
    axios
      .delete(`/deleteThisProduct/${productId}`)
      .then((res) => {
        if (res.status === 200) {
          Swal.fire({
            title: "Product Deleted",
            text: "Please make sure you check visiable pages thoroughly for any side effects of the product's removal",
            icon: "success",
            showConfirmButton: false,
            timer: 6000,
            willClose: () => {
              navigate(
                `/view_catagory/${res.data.mainCatagory}/${res.data.catagory}`
              );
            },
          });
        }
      })
      .catch((err) => {
        alert("something went wrong");
      });
  }

  return (
    <div>
      <JoggerHeader />

      {loading && (
        <div>
          <Loader />
        </div>
      )}

      {mainContent && (
        <div>
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
                    {aspectRatio === 1 ? "1:1" : "8:2"} to keep the website's
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

          <div
            className={`modal modal-lg ${
              showModal2 ? "show d-block modal-open" : "d-none"
            }`}
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-body p-2 moda_height_for_delete_confirmation">
                  <h4 className="text-center">Confirmation</h4>
                  <p className="ps-4">
                    Please read the given guideline to avoide any errors
                  </p>
                  <ul className="delete_guidelines">
                    <li>
                      Please make sure sure the product you are deleteing is not
                      featured or displayed on the dashboard
                    </li>
                    <li>
                      If the product is visible you will have reset the section
                      of the dashboard which have this product on display in
                      order to avoide errors
                    </li>
                  </ul>
                  <p className="text-center">
                    Are You Sure You Want To Delete This Product?
                  </p>

                  <div className="w-100 d-flex justify-content-around">
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        setShowModal2(false);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        deleteTheProduct();
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container-fluid">
            <div className="row py-4 bg-white">
              <div className="col-sm-6 demo d-flex flex-column align-items-stretch">
                <div id="desktop_side_view1">
                  <Carousel ref={carouselRef} interval={null}>
                    <Carousel.Item className="custom-carousel-item">
                      <img
                        src={crouselImg1}
                        alt="productImg1"
                        className="image"
                        onLoad={() => setSecondDivsHeight()}
                      />

                      <div className="icon-container">
                        <input
                          ref={imageInput1}
                          type="file"
                          accept="image/*"
                          className="d-none"
                          onChange={handleInput}
                        />
                        <FaCloudUploadAlt
                          onClick={() => {
                            imageInput1.current.click();
                          }}
                        />
                      </div>

                      <div className="num_holder">
                        <MdLooksOne />
                      </div>

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

                    <Carousel.Item>
                      <img
                        src={crouselImg2}
                        alt="productImg2"
                        className="image"
                      />

                      <div className="icon-container">
                        <input
                          ref={imageInput2}
                          type="file"
                          accept="image/*"
                          className="d-none"
                          onChange={handleInput}
                        />
                        <FaCloudUploadAlt
                          onClick={() => {
                            imageInput2.current.click();
                          }}
                        />
                      </div>

                      <div className="num_holder">
                        <MdLooksTwo />
                      </div>

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

                    <Carousel.Item>
                      <img
                        src={crouselImg3}
                        alt="productImg3"
                        className="image"
                      />

                      <div className="icon-container">
                        <input
                          ref={imageInput3}
                          type="file"
                          accept="image/*"
                          className="d-none"
                          onChange={handleInput}
                        />
                        <FaCloudUploadAlt
                          onClick={() => {
                            imageInput3.current.click();
                          }}
                        />
                      </div>

                      <div className="num_holder">
                        <MdLooks3 />
                      </div>

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
                  </Carousel>
                </div>
              </div>

              <div className="col-sm-6 demo d-flex flex-column align-items-stretch">
                <div
                  className="w-100 d-sm-block d-none"
                  id="desktop_side_view2"
                >
                  <span className="input_lable">Product Name</span>
                  <input
                    className="w-100 product_info_input"
                    type="text"
                    placeholder="Enter Product Name (Limit 50)"
                    value={productName}
                    onChange={(element) => {
                      setProductName(element.currentTarget.value);
                    }}
                  />

                  <br />
                  <br />
                  <span className="input_lable">Short Discription</span>
                  <textarea
                    className="w-100 product_info_input"
                    type="text"
                    placeholder="Enter Products Short Discription"
                    value={productShortDiscription}
                    onChange={(element) => {
                      setProductShortDiscription(element.currentTarget.value);
                    }}
                  ></textarea>

                  <br />
                  <br />

                  <span className="input_lable">Main Catagory</span>
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
                    <option value={selectedMainCatagory} disabled>
                      {selectedMainCatagory}
                    </option>
                    {mainCatagory.map((element) => (
                      <option value={element}>{element}</option>
                    ))}
                  </select>

                  <br />
                  <br />

                  <span className="input_lable">Catagory</span>
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
                    <option value={selectedCatagory} disabled>
                      {selectedCatagory}
                    </option>
                    {catagory.map((element) => (
                      <option value={element}>{element}</option>
                    ))}
                  </select>

                  <br />
                  <br />

                  <span className="input_lable">Sub Catagory</span>
                  <select
                    className="w-100 product_info_input py-1"
                    value={selectedSubCatagory}
                    onChange={(element) => {
                      setSelectedSubCatagory(element.currentTarget.value);
                    }}
                  >
                    <option value={selectedSubCatagory} disabled>
                      {selectedSubCatagory}
                    </option>
                    {subCatagory.map((element) => (
                      <option value={element}>{element}</option>
                    ))}
                  </select>

                  <br />
                  <br />

                  <div className=" d-flex justify-content-between">
                    <input
                      className="w-50 product_info_input"
                      type="text"
                      placeholder="Enter Price"
                      value={productPrice}
                      onChange={(elem) => {
                        setProductPrice(elem.currentTarget.value);
                      }}
                    />

                    <span>
                      Discount?{" "}
                      <input
                        className="ms-2"
                        type="checkbox"
                        checked={discount}
                        onChange={(elem) => {
                          if (elem.currentTarget.checked) {
                            setDiscout(true);
                          } else {
                            setDiscout(false);
                          }
                        }}
                      />
                    </span>
                  </div>

                  <br />
                  {discount && (
                    <div>
                      <input
                        className="w-50 product_info_input"
                        placeholder="Enter Discounted Price"
                        value={productDiscountedPrice}
                        onChange={(elem) => {
                          setProductDiscountedPrice(elem.currentTarget.value);
                        }}
                      />
                      <br />
                      <br />
                    </div>
                  )}

                  <div>
                    <span className="input_lable">Sizes</span>
                    <br />

                    <IoMdAdd
                      className="fs-4 me-3"
                      onClick={() => {
                        setSizes([...sizes, ""]);
                      }}
                    />

                    {sizes.length > 1 &&
                      sizes.map((element, index) => (
                        <span className="me-2">
                          <input
                            className="size_inputs product_info_input mb-2"
                            value={element}
                            onChange={(elem) => {
                              sizes[index] = elem.currentTarget.value;
                              setSizes([...sizes]);
                            }}
                          />

                          <ImCross
                            className="small_cross"
                            onClick={() => {
                              if (sizes.length > 1) {
                                let firstHalf = sizes.slice(0, index);
                                let secondHalf = sizes.slice(index + 1);
                                setSizes([...firstHalf, ...secondHalf]);
                              }
                            }}
                          />
                        </span>
                      ))}

                    {sizes.length === 1 &&
                      sizes.map((element, index) => (
                        <span className="me-2">
                          <input
                            className="size_inputs product_info_input"
                            value={element}
                            onChange={(elem) => {
                              sizes[index] = elem.currentTarget.value;
                              setSizes([...sizes]);
                            }}
                          />
                        </span>
                      ))}

                    <br />
                    <br />
                  </div>

                  <span className="input_lable">Brief Discription</span>
                  <br />
                  <textarea
                    className="w-100 product_info_input"
                    rows={8}
                    placeholder="Briefly describe the Product"
                    value={productBriefDiscription}
                    onChange={(element) => {
                      setProductBriefDiscription(element.currentTarget.value);
                    }}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="w-100 d-sm-none d-block bg-white">
                <span className="input_lable">Product Name</span>
                <input
                  className="w-100 product_info_input"
                  type="text"
                  placeholder="Enter Product Name (Limit 50)"
                  value={productName}
                  onChange={(element) => {
                    setProductName(element.currentTarget.value);
                  }}
                />

                <br />
                <br />
                <span className="input_lable">Short Discription</span>
                <textarea
                  className="w-100 product_info_input"
                  type="text"
                  placeholder="Enter Products Short Discription"
                  value={productShortDiscription}
                  onChange={(element) => {
                    setProductShortDiscription(element.currentTarget.value);
                  }}
                ></textarea>

                <br />
                <br />

                <span className="input_lable">Main Catagory</span>
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
                  <option value="Select Product's Main Catagory" disabled>
                    Select Main Catagory
                  </option>
                  {mainCatagory.map((element) => (
                    <option value={element}>{element}</option>
                  ))}
                </select>

                <br />
                <br />

                <span className="input_lable">Catagory</span>
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
                  <option value="Select Product's Catagory" disabled>
                    Select Catagory
                  </option>
                  {catagory.map((element) => (
                    <option value={element}>{element}</option>
                  ))}
                </select>

                <br />
                <br />

                <span className="input_lable">Sub Catagory</span>
                <select
                  className="w-100 product_info_input py-1"
                  value={selectedSubCatagory}
                  onChange={(element) => {
                    setSelectedSubCatagory(element.currentTarget.value);
                  }}
                >
                  <option value="Select Product's Sub Catagory" disabled>
                    Select Sub Catagory
                  </option>
                  {subCatagory.map((element) => (
                    <option value={element}>{element}</option>
                  ))}
                </select>

                <br />
                <br />

                <div className=" d-flex justify-content-between">
                  <input
                    className="w-50 product_info_input"
                    type="text"
                    placeholder="Enter Price"
                    value={productPrice}
                    onChange={(elem) => {
                      setProductPrice(elem.currentTarget.value);
                    }}
                  />

                  <span>
                    Discount?{" "}
                    <input
                      className="ms-2"
                      type="checkbox"
                      onChange={(elem) => {
                        if (elem.currentTarget.checked) {
                          setDiscout(true);
                        } else {
                          setDiscout(false);
                        }
                      }}
                    />
                  </span>
                </div>

                <br />
                {discount && (
                  <div>
                    <input
                      className="w-50 product_info_input"
                      placeholder="Enter Discounted Price"
                      value={productDiscountedPrice}
                      onChange={(elem) => {
                        setProductDiscountedPrice(elem.currentTarget.value);
                      }}
                    />
                    <br />
                    <br />
                  </div>
                )}

                <div>
                  <span className="input_lable">Sizes</span>
                  <br />

                  <IoMdAdd
                    className="fs-4 me-3"
                    onClick={() => {
                      setSizes([...sizes, ""]);
                    }}
                  />

                  {sizes.length > 1 &&
                    sizes.map((element, index) => (
                      <span className="me-2">
                        <input
                          className="size_inputs product_info_input mb-2"
                          value={element}
                          onChange={(elem) => {
                            sizes[index] = elem.currentTarget.value;
                            setSizes([...sizes]);
                          }}
                        />

                        <ImCross
                          className="small_cross"
                          onClick={() => {
                            if (sizes.length > 1) {
                              let firstHalf = sizes.slice(0, index);
                              let secondHalf = sizes.slice(index + 1);
                              setSizes([...firstHalf, ...secondHalf]);
                            }
                          }}
                        />
                      </span>
                    ))}

                  {sizes.length === 1 &&
                    sizes.map((element, index) => (
                      <span className="me-2">
                        <input
                          className="size_inputs product_info_input"
                          value={element}
                          onChange={(elem) => {
                            sizes[index] = elem.currentTarget.value;
                            setSizes([...sizes]);
                          }}
                        />
                      </span>
                    ))}

                  <br />
                  <br />
                </div>

                <span className="input_lable">Brief Discription</span>
                <br />
                <textarea
                  className="w-100 product_info_input"
                  rows={8}
                  placeholder="Briefly describe the Product"
                  value={productBriefDiscription}
                  onChange={(element) => {
                    setProductBriefDiscription(element.currentTarget.value);
                  }}
                ></textarea>
              </div>
            </div>

            <div className="row bg-white py-3">
              <div className="col-12 col-sm-10 offset-sm-1">
                <div className="text-center">
                  <h3 className="text-center">Extra Attribute</h3>
                  <input
                    className="w-100 my-2 product_info_input"
                    placeholder="Attribute Heading"
                    value={extraAttriuteHeading}
                    onChange={(elem) => {
                      setExtraAttriuteHeading(elem.currentTarget.value);
                    }}
                  />
                </div>

                <div className="custom-carousel-item">
                  <img
                    src={crouselImg4}
                    alt="productImg4"
                    className="speciality_image"
                  />

                  <div className="icon-container">
                    <input
                      ref={imageInput4}
                      type="file"
                      accept="image/*"
                      className="d-none"
                      onChange={handleInput}
                    />
                    <FaCloudUploadAlt
                      onClick={() => {
                        imageInput4.current.click();
                      }}
                    />
                  </div>
                </div>

                <textarea
                  className="w-100 mt-2 product_info_input"
                  placeholder="Attribute Content"
                  rows={5}
                  value={extraAttriuteDetails}
                  onChange={(element) => {
                    setExtraAttriuteDetails(element.currentTarget.value);
                  }}
                ></textarea>
              </div>
            </div>

            <div className="row bg-white pt-3 pb-5">
              <div className="col-12 col-sm-10 offset-sm-1 d-flex justify-content-around">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    navigate(`/view_product/${productId}`);
                  }}
                >
                  Go Back
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() => {
                    setShowModal2(true);
                  }}
                >
                  Delete
                </button>

                <button
                  className="btn btn-success"
                  onClick={() => {
                    setValidation([]);

                    if (crouselImg1.includes("portfolio_images/")) {
                      setValidation((prevValidation) => [
                        ...prevValidation,
                        "Please upload first picture on the crousal",
                      ]);
                    }
                    if (crouselImg2.includes("portfolio_images/")) {
                      setValidation((prevValidation) => [
                        ...prevValidation,
                        "Please upload second picture on the crousal",
                      ]);
                    }

                    if (productName === "" || productName === " ") {
                      setValidation((prevValidation) => [
                        ...prevValidation,
                        "Please add the product name",
                      ]);
                    }

                    if (
                      productShortDiscription === "" ||
                      productShortDiscription === " "
                    ) {
                      setValidation((prevValidation) => [
                        ...prevValidation,
                        "Please add the product discription",
                      ]);
                    }

                    if (productPrice === "" || productPrice === " ") {
                      setValidation((prevValidation) => [
                        ...prevValidation,
                        "Please add the product Price",
                      ]);
                    }
                    if (discount) {
                      if (
                        productDiscountedPrice === "" ||
                        productDiscountedPrice === " "
                      ) {
                        setValidation((prevValidation) => [
                          ...prevValidation,
                          "You have mentioned a discount on the product please mention the discounted price",
                        ]);
                      }
                    }

                    if (selectedMainCatagory.includes("Select")) {
                      setValidation((prevValidation) => [
                        ...prevValidation,
                        "Please select main catagory",
                      ]);
                    }
                    if (selectedCatagory.includes("Select")) {
                      setValidation((prevValidation) => [
                        ...prevValidation,
                        "Please select catagory",
                      ]);
                    }
                    if (selectedSubCatagory.includes("Select")) {
                      setValidation((prevValidation) => [
                        ...prevValidation,
                        "Please select sub catagory",
                      ]);
                    }

                    let sizeValidation = 0;

                    sizes.forEach((element) => {
                      if (element === "" || element === " ") {
                        sizeValidation++;
                      }
                    });

                    if (sizeValidation) {
                      setValidation((prevValidation) => [
                        ...prevValidation,
                        "Please fill all the sizes added",
                      ]);
                    }

                    if (
                      productBriefDiscription === "" ||
                      productBriefDiscription === " "
                    ) {
                      setValidation((prevValidation) => [
                        ...prevValidation,
                        "Please mention brief discription of the product",
                      ]);
                    }

                    if (
                      extraAttriuteHeading === "" ||
                      extraAttriuteHeading === " " ||
                      crouselImg4.includes("portfolio_images/") ||
                      extraAttriuteDetails === "" ||
                      extraAttriuteDetails === " "
                    ) {
                      if (
                        !extraAttriuteHeading === "" &&
                        !crouselImg4.includes("portfolio_images/") &&
                        !extraAttriuteDetails === ""
                      ) {
                        setValidation((prevValidation) => [
                          ...prevValidation,
                          "Please add heading, picture and detail of extra product attribute in order to properly add it",
                        ]);
                      }
                    }

                    setValidationDiv(true);

                    setTimeout(() => {
                      window.scrollBy(0, 200);
                    }, 200);
                  }}
                >
                  Validate
                </button>
              </div>
            </div>

            {validationDiv && (
              <div className="row px-3 bg-white">
                {validation.length > 0 && (
                  <ul>
                    {validation.map((element) => (
                      <li className="text-danger">{element}</li>
                    ))}
                  </ul>
                )}

                {validation.length < 1 && (
                  <div className="w-100 text-center bg-white pb-5">
                    <button
                      className="btn btn-success w-100 mb-4"
                      onClick={() => {
                        editProductList();
                      }}
                    >
                      Update Product
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default EditProduct;
