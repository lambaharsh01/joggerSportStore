import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.background = "white";
    return () => {
      document.body.style.background =
        "linear-gradient(274deg, rgb(224, 235, 213) 0.00%, rgb(37, 148, 141) 100.00%)";
    };
  }, []);

  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const emailInput = useRef(null);
  const passwordInput = useRef(null);

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const [emailValidation, setEmailValidation] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState(false);

  const [backendRes, setBackendRes] = useState(false);
  const [backendResMessage, setBackendResMessage] = useState("nvh");

  const removeInputStyle = (element) => {
    if (element.currentTarget.value === "") {
      element.currentTarget.classList.remove("input_style");
    }
  };

  const addInputStyle = (element) => {
    element.currentTarget.classList.add("input_style");
  };

  const requestConfirmation = () => {
    axios
      .post("/auth_user_login", { email: emailId, password: password })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        window.location.href = "/";
      })
      .catch((err) => {
        if (err.response.status === 404 || err.response.status === "404") {
          setBackendResMessage("User Not Found");
          setBackendRes(true);
          setTimeout(() => {
            setBackendRes(false);
          }, 3200);
          // alert('not found');
        } else if (
          err.response.status === 401 ||
          err.response.status === "401"
        ) {
          setBackendResMessage("Incorrect Password");
          setBackendRes(true);
          setTimeout(() => {
            setBackendRes(false);
          }, 3200);
        } else {
          // alert('Something Went Wrong');
          console.log(err);
        }
      });
  };

  return (
    <div className="container-fluid light">
      <div className="main_div col-md-6 offset-md-3 col-sm-10 offset-sm-1 bg-white">
        <div className="row row_sections m-2 p-2 mb-0 pb-0 bg-white">
          {backendRes && (
            <div class="alert alert-danger py-2 text-center" role="alert">
              {backendResMessage}
            </div>
          )}

          {!backendRes && (
            <div className="col-12 text-center mt-3">
              <h3 className="sec_heading ">LOG IN</h3>
            </div>
          )}

          <div className="col-sm-8 offset-sm-2  py-4 mt-4">
            <div className="form-row">
              <input
                type="text"
                className="text_input"
                value={emailId}
                ref={emailInput}
                onChange={(elem) => {
                  setEmailId(elem.currentTarget.value);
                  if (emailRegex.test(elem.currentTarget.value)) {
                    setEmailValidation(false);
                  }
                }}
                onFocus={(element) => addInputStyle(element)}
                onBlur={(element) => {
                  removeInputStyle(element);
                }}
              />
              <label className="form-row-field">Email*</label>
            </div>
          </div>
          {emailValidation && (
            <div className="col-sm-8 offset-sm-2 text-end pt-2 pe-4">
              <p className="me-2 text-danger">Please enter a valid email</p>
            </div>
          )}

          <div className="col-sm-8 offset-sm-2  py-4 mt-4">
            <div className="form-row">
              <input
                type="password"
                className="text_input"
                value={password}
                ref={passwordInput}
                onChange={(elem) => {
                  setPassword(elem.currentTarget.value);
                  if (elem.currentTarget.value.trim()) {
                    setPasswordValidation(false);
                  }
                }}
                onFocus={(element) => addInputStyle(element)}
                onBlur={(element) => {
                  removeInputStyle(element);
                }}
              />
              <label className="form-row-field">Password*</label>
            </div>
          </div>
          {passwordValidation && (
            <div className="col-sm-8 offset-sm-2 text-end pt-2 pe-4">
              <p className="me-2 text-danger">Please enter password</p>
            </div>
          )}

          <div className="col-sm-8 offset-sm-2 px-4 mt-5 pt-3 mb-2 text-center">
            <button
              className="signUpButton rounded-pill w-100 py-1 text-white"
              onClick={() => {
                let validation = 0;

                if (!emailRegex.test(emailId)) {
                  setEmailValidation(true);

                  validation++;
                }
                if (!password.trim()) {
                  setPasswordValidation(true);
                  validation++;
                }
                if (validation < 1) {
                  requestConfirmation();
                }
              }}
            >
              LOG IN
            </button>
          </div>

          <div className="col-sm-8 offset-sm-2  py-4 mt-1 mb-4">
            <li className="li_light">
              Forgot{" "}
              <span
                className="li_links"
                onClick={() => {
                  navigate("/forgot_pass");
                }}
              >
                Username / Password?
              </span>
            </li>

            <li className="li_light">
              Don’t have an account?{" "}
              <span
                className="li_links"
                onClick={() => {
                  navigate("/signup");
                }}
              >
                Sign up
              </span>
            </li>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
