import "./ViewCatagory.css";
import JoggerHeader from "./JoggerHeader";
import Footer from "./Footer";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";

import Loader from "../Loader";

function ViewCatagory() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [hadLoaded, setLoaded] = useState(false);

  let params = useParams();

  let mainCataogry = params.main_catagory || null;
  let Cataogry = params.catagory || null;
  let subCataogry = params.sub_catagory || null;

  console.log(mainCataogry);
  console.log(Cataogry);
  console.log(subCataogry);

  // const [mainCataogry, setMainCataogry]=useState(null);
  // const [Cataogry, setCataogry]=useState(null);
  // const [subCataogry, setSubCataogry]=useState(null);

  // setMainCataogry(params.main_catagory || null);
  // setCataogry(params.catagory || null);
  // setSubCataogry(params.sub_catagory || null);

  let extraHeading = "product_catagory";
  if (!subCataogry && subCataogry) {
    extraHeading = "product_sub_catagory";
  }

  useEffect(() => {
    setProducts([]);
    axios
      .get(`/getProductsLazily/0/${mainCataogry}/${Cataogry}/${subCataogry}`)
      .then((res) => {
        setLoading(false);
        setLoaded(true);
        if (res.data.products) {
          setProducts((previousElements) => {
            previousCount = previousElements.length;
            const updatedElements = [...previousElements, ...res.data.products];
            currentCount = updatedElements.length;
            return updatedElements;
          });
        }

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong");
      });

    window.addEventListener("scroll", scrollHandler);

    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [mainCataogry, Cataogry, subCataogry]);

  let previousCount = 0;
  let currentCount = 0;
  let lastCount = 0;

  async function scrollHandler() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      if (currentCount + previousCount > lastCount) {
        lastCount = currentCount + previousCount;

        setLoading(true);

        window.removeEventListener("scroll", scrollHandler);

        await axios
          .get(
            `/getProductsLazily/${currentCount}/${mainCataogry}/${Cataogry}/${subCataogry}`
          )
          .then((res) => {
            setLoading(false);
            if (res.data.products) {
              setProducts((previousElements) => {
                previousCount = previousElements.length;
                const updatedElements = [
                  ...previousElements,
                  ...res.data.products,
                ];
                currentCount = updatedElements.length;
                return updatedElements;
              });
            }
          })
          .catch((err) => {
            console.log(err);
            alert("Something went wrong");
          });
      }
    }
  }

  function updateProductList() {
    axios
      .get(
        `/getProductsLazily/${products.length}/${mainCataogry}/${Cataogry}/${subCataogry}`
      )
      .then((res) => {
        if (res.data.products) {
          // console.log(res.data.products)
          // console.log(products, 'lool')

          setProducts((previousElements) => {
            previousCount = previousElements.length;
            const updatedElements = [...previousElements, ...res.data.ary];
            currentCount = updatedElements.length;
            return updatedElements;
          });

          // setProducts(...products, ...res.data.products);
          // console.log(products, 'lol2')
          // window.addEventListener('scroll', callingDebounce2);
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong");
      });
  }

  return (
    <div className="bg-white">
      <JoggerHeader />

      {isLoading && <Loader />}

      {hadLoaded && (
        <div className="container-fluid bg-white">
          <div className="row mt-3">
            {products.map((element, index) => (
              <div
                key={"productDivMain" + index}
                className="col-6 col-sm-4 col-md-3 productDivMain"
                onClick={() => {
                  navigate(`/view_product/${element._id}`);
                }}
              >
                <img
                  className="w-100"
                  src={"/product_pictures/" + element.product_picture1}
                />

                <div className="product_info1">
                  <span className="small_font_list">{element.produt_name}</span>{" "}
                  /{" "}
                  <span className="small_font_list_side">
                    {element[extraHeading]}
                  </span>
                </div>

                <div className="product_info2">
                  <span className="smaller_gray_font_list">
                    {element.product_short_discription}
                  </span>
                </div>

                <div>
                  <span className="smaller_black_font_list">
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
              </div>
            ))}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default ViewCatagory;
