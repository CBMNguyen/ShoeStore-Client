import React from "react";
import { Col, Container, Row } from "reactstrap";
import brandLogo from "../../assets/images/brandLogo.png";
import dmcaImage from "../../assets/images/DMCA.png";
import momoLogo from "../../assets/images/MoMo_Logo.png";
import facebookImage from "../../assets/images/facebook.png";
import zaloImage from "../../assets/images/zalo.webp";
import instagramImage from "../../assets/images/instagram.webp";
import legalImage from "../../assets/images/legal.png";
import qrImage from "../../assets/images/qr.png";

import "./footer.scss";
import { Link } from "react-router-dom";

function Footer(props) {
  const handleScrollTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className="Footer">
      <Container>
        <Row>
          <Col>
            <div className="Footer__about">
              <h2>
                Shoes Store <img src={brandLogo} alt="brandLogo" />
              </h2>

              <ul className="Footer__about-list text-center">
                <li>
                  Điện thoại:&nbsp;
                  <a href="tel: 0362.446.521"> 0362446521</a>
                </li>
                <li>
                  Email:&nbsp;
                  <a href="mailto: hieub1809236@student.ctu.edu.vn">
                    hieub1809236@student.ctu.edu.vn
                  </a>
                </li>
                <li>
                  Địa chỉ: Ấp Thành Phú, Xã Thành Lợi, Thị Xã Bình Minh, Tỉnh
                  Vĩnh Long{" "}
                </li>
                <li>
                  <a href="https://www.dmca.com/" target="blank">
                    <img src={dmcaImage} alt="dmcaImage" />
                  </a>
                </li>
              </ul>
            </div>
          </Col>
          <Col>
            <div className="Footer__Brand">
              <h2>Brand Category</h2>

              <ul className="Footer__about-list text-center">
                <li onClick={handleScrollTop}>
                  <Link to="/">Adidas</Link>
                </li>
                <li onClick={handleScrollTop}>
                  <Link to="/">Nike</Link>
                </li>
                <li onClick={handleScrollTop}>
                  <Link to="/">Balenciaga</Link>
                </li>
                <li onClick={handleScrollTop}>
                  <Link to="/">Converse</Link>
                </li>
                <li onClick={handleScrollTop}>
                  <Link to="/">Vans</Link>
                </li>
              </ul>
            </div>
          </Col>
          <Col>
            <div className="Footer__pavement text-center">
              <h2>Pavement Method</h2>

              <div>
                <a href="https://momo.vn/">
                  <img
                    className="me-2"
                    width={90}
                    height={90}
                    src={momoLogo}
                    alt="momo-logo"
                  />
                </a>

                <a href="https://momo.vn/">
                  <img
                    className="rounded"
                    width={80}
                    height={80}
                    src={qrImage}
                    alt="qr-logo"
                  />
                </a>
              </div>
            </div>
          </Col>
          <Col>
            <div className="Footer__socials text-center">
              <h2>Follow us on</h2>

              <div>
                <a
                  href="https://www.facebook.com/profile.php?id=100008660230676"
                  target="blank"
                >
                  <img
                    width={50}
                    height={50}
                    src={facebookImage}
                    alt="facebookImage"
                  />
                </a>
                <a href="https://chat.zalo.me/?null">
                  <img
                    className="mx-3"
                    width={50}
                    height={50}
                    src={zaloImage}
                    alt="zaloImage"
                  />
                </a>
                <a
                  href="https://www.instagram.com/hiiiiieuuuuu/"
                  target="blank"
                >
                  <img
                    width={50}
                    height={50}
                    src={instagramImage}
                    alt="instagramImage"
                  />
                </a>
              </div>

              <div>
                <a href="http://online.gov.vn/" target="blank">
                  <img
                    style={{ marginTop: "80px" }}
                    width="60%"
                    src={legalImage}
                    alt="momo-logo"
                  />
                </a>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="mt-5 justify-content-between">
          <footer className="text-center">
            &copy; 2021 - 2022 ShoesStore. Nền tảng mua sắm hàng đầu Việt Nam
          </footer>
        </Row>
      </Container>
    </div>
  );
}

export default Footer;
