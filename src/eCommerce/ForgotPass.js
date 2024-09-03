import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./Signup.css";

function ForgotPass() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.background = "white";
    return () => {
      document.body.style.background =
        "linear-gradient(274deg, rgb(224, 235, 213) 0.00%, rgb(37, 148, 141) 100.00%)";
    };
  }, []);

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const [basicDetails, setBasicDetails] = useState(true);
  const [otpConfirmation, setOtpConfirmation] = useState(false);
  const [createPass, setCreatePass] = useState(false);

  const [basicDetailsBtn, setBasicDetailsBtn] = useState(false);
  const [otpBtn, setOtpBtn] = useState(false);
  const [finalSignUpBtn, setFinalSignUpBtn] = useState(false);

  // BASIC DETAILS

  const [emailId, setEmailId] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  const [recivedOtp, setRecivedOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("Weak");
  const [otpMisMatch, setOtpMisMatch] = useState(false);

  const passStrength = (value) => {
    let strength;
    let strong =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+{};:,<.>])[a-zA-Z0-9!@#$%^&*()-_=+{};:,<.>]+$/;
    if (strong.test(value)) {
      strength = "Strong";
    } else {
      strength = "Weak";
    }
    return strength;
  };

  const removeInputStyle = (element) => {
    if (element.currentTarget.value === "") {
      element.currentTarget.classList.remove("input_style");
    }
  };

  const addInputStyle = (element) => {
    element.currentTarget.classList.add("input_style");
  };

  const emptyAll = () => {
    setEmailId("");
    setRecivedOtp("");
    setPassword("");
    setConfirmPassword("");
    setOtpMisMatch(false);
    setBasicDetailsBtn(false);

    setOtpConfirmation(false);
    setCreatePass(false);
    setBasicDetails(true);
  };

  // BACKEND CONNECTIVITY START
  // BACKEND CONNECTIVITY START
  const sendOtpOnEmail = () => {
    setSendingEmail(true);

    axios
      .post("/send_email_for_pass_reset", { emailId: emailId })
      .then((res) => {
        Swal.fire({
          title: "OTP Sent Successfully",
          icon: "success",
          timer: 1700,
          showConfirmButton: false,
          text: `OTP has been sent to ${emailId}`,
        });

        setSendingEmail(false);
        setBasicDetails(false);
        setOtpConfirmation(true);
      })
      .catch((err) => {
        if (err.response.data === 404 || err.response.data === "404") {
          setSendingEmail(false);
          setBasicDetails(false);
          Swal.fire({
            title: "User Not Found",
            icon: "warning",
            timer: 2000,
            showConfirmButton: false,
            text: `User ${emailId} was not found`,
            willClose: () => {
              setEmailId("");
              setBasicDetails(true);
            },
          });
        } else {
          alert("Something Went Wrong");
          console.log(err);
        }
      });
  };

  const checkOtp = () => {
    axios
      .post("/confirm_otp", { emailId: emailId, otp: recivedOtp })
      .then((res) => {
        if (res.data === 200 || res.data === "200") {
          setOtpConfirmation(false);
          setCreatePass(true);
          setOtpMisMatch(false);
        } else if (res.data === 201 || res.data === "201") {
          setOtpMisMatch(true);
        }
      })
      .catch((err) => {
        if (err.response.data === 401 || err.response.data === "401") {
          emptyAll();
          Swal.fire({
            title: "Authentication Failed",
            icon: "error",
            timer: 1700,
            showConfirmButton: false,
            text: `Please try again Later`,
          });
        } else {
          alert("Something Went Wrong");
          console.log(err);
        }
      });
  };

  const finalChange = () => {
    axios
      .post("/final_password_reset", {
        emailId: emailId,
        password: password,
        confirmPassword: confirmPassword,
      })

      .then((res) => {
        if (res.data === 200 || res.data === "200") {
          Swal.fire({
            title: "Password Changed Successfully",
            icon: "success",
            timer: 1700,
            showConfirmButton: false,
            willClose: () => {
              navigate("/login");
            },
          });
        } else if (res.data === 100 || res.data === "100") {
          Swal.fire({
            title: "Server Authentication Failed",
            icon: "warning",
            text: "Please Type Another Strong Password",
          });
        }
      })
      .catch((err) => {
        alert("Something Went Wrong");
        console.log(err);
      });
  };

  return (
    <div className="container-fluid light">
      <div className="main_div col-md-8 offset-md-2 col-sm-10 offset-sm-1 bg-white">
        {/* DETAILS SECTION START*/}
        {/* DETAILS SECTION START*/}

        {basicDetails && (
          <div className="row row_sections m-2 p-2 mb-0 pb-0 bg-white">
            <div className="col-12 text-center mt-3">
              <h3 className="sec_heading">Reset Password</h3>
            </div>

            <div className="col-sm-8 offset-sm-2  py-4 mt-4">
              <div className="form-row">
                <input
                  type="text"
                  className="text_input"
                  value={emailId}
                  onFocus={(element) => addInputStyle(element)}
                  onChange={(element) => {
                    setEmailId(element.currentTarget.value);
                    if (element.currentTarget.value !== "") {
                      if (emailRegex.test(element.currentTarget.value)) {
                        element.currentTarget.classList.remove("border-danger");
                        setBasicDetailsBtn(true);
                      } else {
                        element.currentTarget.classList.add("border-danger");
                        setBasicDetailsBtn(false);
                      }
                    } else {
                      setBasicDetailsBtn(false);
                    }
                  }}
                  onBlur={(element) => {
                    removeInputStyle(element);
                  }}
                />
                <label className="form-row-field">Email*</label>
              </div>
            </div>

            {!basicDetailsBtn && (
              <div className="mt-5 pt-3 mb-4 text-center">
                <button className="disabledSignUpButton rounded-pill px-4 py-1 text-white">
                  Confirm Email
                </button>
              </div>
            )}

            {basicDetailsBtn && (
              <div className="mt-5 pt-3 mb-4 text-center">
                {sendingEmail && (
                  <button className="signUpButton rounded-pill px-4 py-1 text-white">
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Sending...
                  </button>
                )}

                {!sendingEmail && (
                  <button
                    className="signUpButton rounded-pill px-4 py-1 text-white"
                    onClick={sendOtpOnEmail}
                  >
                    Confirm Email
                  </button>
                )}
              </div>
            )}
          </div>
        )}
        {/* DETAILS SECTION END*/}
        {/* DETAILS SECTION END*/}

        {/* OTP CONFIRMATON START */}
        {/* OTP CONFIRMATON START */}
        {otpConfirmation && (
          <div className="row row_sections m-2 p-2 mb-0 pb-0 bg-white">
            <div className="col-12 text-center mt-3">
              <h3 className="sec_heading">User Authentication</h3>
            </div>

            <div className="col-sm-8 offset-sm-2 py-4 mt-0">
              <div className="form-row">
                <input
                  type="text"
                  className="text_input"
                  value={recivedOtp}
                  onFocus={(element) => addInputStyle(element)}
                  onChange={(element) => {
                    setRecivedOtp(element.currentTarget.value);
                    if (recivedOtp.length >= 4) {
                      setOtpBtn(true);
                    } else {
                      setOtpBtn(false);
                    }
                  }}
                  onBlur={(element) => removeInputStyle(element)}
                />
                <label className="form-row-field">Enter OTP*</label>
              </div>
            </div>
            <div className="col-sm-8 offset-sm-2 d-flex justify-content-end pt-2">
              <label
                className={`me-3 fw-bold ${
                  otpMisMatch ? "text-danger" : "text-white"
                }`}
              >
                Incorrect OTP
              </label>
            </div>

            <div className="mt-5 pt-3 mb-4 text-center">
              {!otpBtn && (
                <button className="disabledSignUpButton rounded-pill px-4 py-1 text-white">
                  Confirm OTP
                </button>
              )}
              {otpBtn && (
                <button
                  className="signUpButton rounded-pill px-4 py-1 text-white"
                  onClick={checkOtp}
                >
                  Confirm OTP
                </button>
              )}
            </div>
          </div>
        )}
        {/* OTP CONFIRMATON END */}
        {/* OTP CONFIRMATON END */}

        {/* CREATE PASSWORD START */}
        {/* CREATE PASSWORD START */}
        {createPass && (
          <div className="row row_sections m-2 p-2 mb-0 pb-0 bg-white">
            <div className="col-12 text-center mt-3">
              <h3 className="sec_heading">Create New Password</h3>
            </div>

            <div className="col-sm-6 py-4 mt-sm-0 mt-4 ">
              <div className="form-row">
                <input
                  type="text"
                  className="text_input"
                  autoComplete="new-password"
                  value={password}
                  onFocus={(element) => addInputStyle(element)}
                  onChange={(element) => {
                    setPassword(element.currentTarget.value);
                    setPasswordStrength(passStrength(password));

                    if (element.currentTarget.value) {
                      if (
                        confirmPassword === element.currentTarget.value &&
                        passwordStrength !== "Weak"
                      ) {
                        setFinalSignUpBtn(true);
                      } else {
                        setFinalSignUpBtn(false);
                      }
                    }

                    if (passwordStrength === "Strong") {
                      element.currentTarget.classList.remove("border-danger");
                    } else {
                      element.currentTarget.classList.add("border-danger");
                    }
                  }}
                  onBlur={(element) => removeInputStyle(element)}
                />
                <label className="form-row-field">Password</label>
              </div>
            </div>

            <div className="col-sm-6 py-4 mt-sm-0 mt-4 ">
              <div className="form-row">
                {/* doing autoComplete='new-password' will give it a different attribute making it less prone to browser's suggestion */}
                <input
                  type="password"
                  className="text_input"
                  value={confirmPassword}
                  onFocus={(element) => addInputStyle(element)}
                  onChange={(element) => {
                    setConfirmPassword(element.currentTarget.value);
                    if (element.currentTarget.value === password) {
                      element.currentTarget.classList.remove("border-danger");
                      setFinalSignUpBtn(true);
                    } else {
                      element.currentTarget.classList.add("border-danger");
                      setFinalSignUpBtn(false);
                    }
                  }}
                  onBlur={(element) => removeInputStyle(element)}
                  onKeyDown={(element) => {
                    if (passwordStrength === "Weak") {
                      element.preventDefault();
                    }
                  }}
                />
                <label className="form-row-field">Confirm Password</label>
              </div>
            </div>

            <ul className="password_guideline mt-3 pt-3 text">
              <li>
                Password Strength: <b>{passwordStrength}</b>
              </li>
              <li>
                Please make sure to use a mix of Alphabets, Numbers and Unique
                Keys
              </li>
            </ul>

            <div className="mt-5 pt-3 mb-4 text-center">
              {!finalSignUpBtn && (
                <button className="disabledSignUpButton rounded-pill px-4 py-1 text-white">
                  Sign Up
                </button>
              )}
              {finalSignUpBtn && (
                <button
                  className="signUpButton rounded-pill px-4 py-1 text-white"
                  onClick={finalChange}
                >
                  Sign Up
                </button>
              )}
            </div>
          </div>
        )}
        {/* CREATE PASSWORD END */}
        {/* CREATE PASSWORD END */}
      </div>
    </div>
  );
}

export default ForgotPass;
