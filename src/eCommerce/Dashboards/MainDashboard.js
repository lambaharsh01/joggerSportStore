import "./MainDashboard.css";
import JoggerHeader from "../JoggerHeader";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

import Loader from "../../Loader";
import Footer from "../Footer";

import store from "../../ReduxStore";

function MainDashboard() {
  const navigate = useNavigate();

  const [isLoading, setLoading] = useState(true);
  const [mainContentLoaded, setMainContentLoaded] = useState(false);

  const [mainBackgroundImg, setMainBackgroundImage] = useState(null);
  const [mainBackgroundText, setMainBackgroundText] = useState(null);
  const [mainBackgroundSubText, setMainBackgroundSubText] = useState(null);
  const mainBackgroundFontColor = null;
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

  const [adminAccess, setAdminAccess] = useState(false);

  const [mainBackgroundSubTextColor, setMainBackgroundSubTextColor] =
    useState(null);

  useEffect(() => {
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

        if (store.getState().user_type === "admin") {
          setAdminAccess(true);
        }
      })
      .catch((err) => {
        console.log(err);
        alert("something went wrong");
      });

    return () => {
      setMainBackgroundImage(null);
      setMainBackgroundText(null);
      setMainBackgroundSubText(null);
      setMainBackgroundLink(null);
      setFirstSliderSource(null);
      setFirstSlider([]);
      setFeaturedProduct1Id(null);
      setFeaturedProduct1Img(null);
      setFeaturedProduct1Heading(null);
      setFeaturedProduct1FontColor(null);
      setFeaturedProduct1ButtonColor(null);
      setFeaturedProduct1ButtonFontColor(null);
      setFeaturedProduct2Id(null);
      setFeaturedProduct2Img(null);
      setFeaturedProduct2Heading(null);
      setFeaturedProduct2FontColor(null);
      setFeaturedProduct2ButtonColor(null);
      setFeaturedProduct2ButtonFontColor(null);
      setSmallHeadingText(null);
      setLargeHeadingText(null);
      setNormalHeadingText(null);
      setHeadingLink(null);
      setSecondSliderSource(null);
      setSecondSlider([]);
    };
  }, []);

  const mainBackgroundClick = () => {
    if (mainBackgroundLink) {
      navigate(mainBackgroundLink);
    }
  };
  return (
    <div className="bg-white">
      <JoggerHeader key={"joggerHeader"} />

      {isLoading && (
        <>
          <div className="alert alert-info py-2 text-center" role="alert">
            Please wait while we establish a connection.
          </div>
          <Loader key={"loader"} />
        </>
      )}

      {mainContentLoaded && (
        <div className="contetnMainDiv">
          <div
            className="col-12 col-md-10 offset-md-1 "
            style={{ color: mainBackgroundFontColor }}
          >
            <div
              className="outerDiv"
              onClick={() => {
                mainBackgroundClick();
              }}
            >
              <img className="w-100" src={mainBackgroundImg} />
              <div
                className="textInside ps-3 pb-3 pb-md-5"
                style={{ color: mainBackgroundSubTextColor }}
              >
                <h1 className="preLine">{mainBackgroundText}</h1>
                <span>{mainBackgroundSubText}</span>
              </div>
            </div>
          </div>

          <div className="container-fluid">
            <div className="row mt-3 mt-sm-5 pt-3">
              <h3 className="ps-4">
                <b>{firstSliderSource}</b>
              </h3>
              <div className="col-12 productSlider">
                {firstSlider.map((element, index) => (
                  <Link
                    to={`/view_product/${element._id}`}
                    key={"firstSlider" + index}
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

            {featuredProduct1Img && featuredProduct2Img && (
              <div className="row mt-3 mt-sm-5 pt-3">
                <h3 className="ps-4">
                  <b>Featured</b>
                </h3>
                <div className="col-sm-6 d-flex justify-content-center px-2 mb-4">
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

                <div className="col-sm-6 d-flex justify-content-center px-2 mb-4">
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
            )}

            <div className="row mt-0 mt-sm-5 mb-2">
              <div className="col-12 ">
                <div className="preLine">
                  <p className="text-center smaller_gray_font mb-4">
                    {smallHeadingText}
                  </p>
                  <h1 className="text-center mb-3">
                    <b>
                      <b>{largeHeadingText}</b>
                    </b>
                  </h1>
                  <h4 className="text-center small_font">
                    {normalHeadingText}
                  </h4>
                  <div className="text-center">
                    <Link to={`${headingLink}`}>
                      <button className="btn btn-dark px-4 rounded-pill my-3">
                        Check Out
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt-3 mt-sm-5 pt-3">
              <h3 className="ps-4">
                <b>{secondSliderSource}</b>
              </h3>
              <div className="col-12 productSlider">
                {secondSlider.map((element, index) => (
                  <Link
                    to={`/view_product/${element._id}`}
                    key={"secondSlider" + index}
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

export default MainDashboard;
