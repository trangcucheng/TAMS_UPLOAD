// ** React Imports
import { Link, NavLink } from "react-router-dom"
import classnames from "classnames"
import { HelpCircle, FileText } from "react-feather"

// ** Reactstrap Imports
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
  Form,
  Input,
  Col,
  Alert,
  UncontrolledTooltip,
  Row,
} from "reactstrap"
import logo from "@src/assets/images/logo/logo.png"

// ** Styles
import "@styles/react/pages/page-authentication.scss"
import ListFunctions from "../../../navigation/functions.js"

const SelectFunction = () => {
  return (
    <div className="auth-wrapper auth-basic px-2">
      <div className="auth-inner my-2" style={{ maxWidth: "65%" }}>
        <Card className="mb-0">
          <CardBody>
            <Link
              className="brand-logo"
              to="/"
              onClick={(e) => e.preventDefault()}
              style={{ padding: "0rem 0rem 1rem 0rem", margin: "0px" }}
            >
              <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
                <img
                  className="fallback-logo d-flex m-auto"
                  src={logo}
                  alt="logo"
                  style={{ width: "6rem" }}
                />
                <CardTitle
                  tag="h1"
                  className="mb-1"
                  style={{
                    textAlign: "center",
                    marginBottom: "4rem",
                    marginTop: "1rem",
                    fontWeight: '600'
                  }}
                >
                  HỆ THỐNG PHẦN MỀM CHỈ ĐẠO, ĐIỀU HÀNH - HỌC VIỆN LỤC QUÂN
                </CardTitle>
              </Col>
            </Link>
            <CardTitle
              tag="h2"
              className="fw-bolder mb-1"
              style={{ textAlign: "center" }}
            >
              Danh sách chức năng
            </CardTitle>
            <Row style={{ display: "flex", justifyContent: "center" }}>
              {ListFunctions.map((item, index) => {
                return (
                  <NavLink
                    className={`${classnames(
                      "d-flex align-items-center col col-lg-4 col-md-6 col-sm-12 mb-1"
                    )} customNavLink`}
                    to={item.navLink || "/"}
                    style={{ padding: '0px' }}
                  >
                    <Card style={{ marginBottom: "0px" }}>
                      <CardBody className="text-center btn-three">
                        {item.icon}
                      </CardBody>
                      <p
                        style={{
                          color: "#09A863",
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        {item.title}
                      </p>
                    </Card>
                  </NavLink>
                )
              })}
            </Row>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default SelectFunction
