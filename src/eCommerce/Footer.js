import "./Footer.css";

import { AiFillInstagram } from "react-icons/ai";
import { FaLinkedin } from "react-icons/fa";
import { MdCall } from "react-icons/md";
import { RiWhatsappFill } from "react-icons/ri";

function Footer() {
  return (
    <div>
      <div className="container-fluid bg-dark py-2">
        <div className="row p-3">
          <div className="col-sm-3 col-6 text-white">
            <h6 className="fw-bold">GET HELP</h6>
            <span className="small_footerTest">Take a Demo</span>
            <br />
            <span className="small_footerTest">Give a Suggestion</span>
            <br />
            <span className="small_footerTest">
              Request content change/removal
            </span>
          </div>

          <div className="col-sm-3 col-6 text-white ">
            <h6 className="fw-bold">CONTACT ME</h6>
            <span className="small_footerTest">
              <a
                href="mailto:lambaharsh01@gmail.com"
                className="text-decoration-none small_footerTest"
              >
                lambaharsh01@gmail.com
              </a>
            </span>
            <br />
            <span className="small_footerTest">
              <a
                href="tel:8287868558"
                className="text-decoration-none small_footerTest"
              >
                8287868558
              </a>
            </span>
          </div>

          <div className="col-sm-6 col-12 inconsDivInFooter pe-3 text-sm-end text-center py-4 py-sm-0">
            <a href="https://wa.link/zfpu97" target="_blank" rel="noreferrer">
              <RiWhatsappFill className="footerIcon me-3" />
            </a>
            <a
              href="https://www.linkedin.com/in/harsh-lamba-1b185b214"
              target="_blank"
              rel="noreferrer"
            >
              <FaLinkedin className="footerIcon me-3" />
            </a>
            <a href="tel:8287868558">
              <MdCall className="footerIcon me-3" />
            </a>
            <a href="https://www.instagram.com/bewildered_horse/">
              <AiFillInstagram className="footerIcon me-3" />
            </a>
          </div>
        </div>

        <div className="row p-3 text-white">
          <div className="col-12 small_footerTest">
            {" "}
            No Rights Reserved, This website is a clone for the pourpose of
            learning
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
