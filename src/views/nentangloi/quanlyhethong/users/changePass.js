import { useState, useContext, Fragment, useRef } from "react"
import classnames from "classnames"
import { useForm } from "react-hook-form"
import { Link, useHistory } from "react-router-dom"
import InputPasswordToggle from "@components/input-password-toggle"
import { getHomeRouteForLoggedInUser, isObjEmpty } from "@utils"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import {
  Alert,
  Row,
  Col,
  CardTitle,
  FormText,
  Form,
  Input,
  FormGroup,
  Label,
  CustomInput,
  Button,
  UncontrolledTooltip,
  Badge,
  Card,
} from "reactstrap"
import Spinner from "@components/spinner/Loading-spinner"
/** Constants */
/** API */
import { changePass } from "../../../../api/users"
// import '@styles/base/pages/page-auth.scss'

const ChangePass = (props) => {
  const MySwal = withReactContent(Swal)
  const [pass, setPass] = useState({
    newPassword: "",
    newPassword_: "",
  })

  const [loading, setLoading] = useState(false)
  // otp
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm()
  const userData = JSON.parse(localStorage.getItem("userData"))

  const onSubmit = async (data) => {
    return MySwal.fire({
      title: "Bạn có chắc chắn muốn đổi mật khẩu không?",
      text: "Kiểm tra kỹ trước khi đổi!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Tiếp tục",
      cancelButtonText: "Hủy",
      customClass: {
        confirmButton: `btn btn-primary mr-1`,
        cancelButton: "btn btn-outline-dark",
      },
      buttonsStyling: false,
    }).then(function (result) {
      if (result.value) {
        setLoading(true)
        const dataSubmit = {
          userID: userData?._id,
          oldPassword: data.oldPassword,
          newPassword: data.newPassword_,
        }
        changePass(dataSubmit)
          .then((response) => {
            if (response?.status === false) {
              MySwal.fire({
                icon: "error",
                title: response?.message || "Đổi mật khẩu thất bại!",
                text: "Vui lòng thử lại",
                customClass: {
                  confirmButton: "btn btn-danger",
                },
              })
            } else {
              MySwal.fire({
                icon: "success",
                title: "Đổi mật khẩu thành công!",
                //   
                customClass: {
                  confirmButton: "btn btn-success",
                },
              })
              setLoading(false)
              reset()
              setPass({
                newPassword: "",
                newPassword_: "",
              })
            }
          })
          .catch((error) => {
            MySwal.fire({
              icon: "error",
              title: "Đổi mật khẩu thất bại!",
              text: "Vui lòng thử lại",
              customClass: {
                confirmButton: "btn btn-danger",
              },
            })
          })
        setLoading(false)
      }
    })
  }

  return (
    <Card style={{ minHeight: "75vh", backgroundColor: "white" }}>
      <CardTitle
        style={{
          marginTop: "20px",
          textAlign: "center",
        }}
      >
        <h3 style={{ color: "#09a863" }}>Đặt lại mật khẩu</h3>
      </CardTitle>
      <Form
        className="auth-login-form mt-1"
        style={{
          width: "50%",
          margin: "auto",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          backgroundColor: "#fffaff",
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormGroup className="customMb2">
          <Label for="oldPassword" className="labelForm">
            Mật khẩu hiện tại<span className="redColor">(*)</span>
          </Label>
          <input
            type="password"
            name="oldPassword"
            id="oldPassword"
            className={`${classnames({
              "is-invalid": errors.oldPassword,
            })} inputForm`}
            {...register("oldPassword", { required: true })}
            placeholder="Nhập mật khẩu hiện tại tại đây"
          />
          {errors && errors.oldPassword && (
            <FormText color="danger">Vui lòng nhập mật khẩu hiện tại</FormText>
          )}
        </FormGroup>
        <FormGroup className="customMb2">
          <Label for="newPassword" className="labelForm">
            Mật khẩu mới<span className="redColor">(*)</span>
          </Label>
          <input
            type="password"
            name="newPassword"
            id="newPassword"
            className={`${classnames({
              "is-invalid": errors.newPassword,
            })}} inputForm`}
            {...register("newPassword", { required: true })}
            placeholder="Nhập mật khẩu mới tại đây"
            onBlur={(e) => {
              setPass({
                ...pass,
                newPassword: e.target.value,
              })
            }}
          />
          {errors && errors.newPassword && (
            <FormText color="danger">Vui lòng nhập mật khẩu mới</FormText>
          )}
        </FormGroup>
        <FormGroup>
          <Label for="newPassword_" className="labelForm">
            Nhập lại mật khẩu mới<span className="redColor">(*)</span>
          </Label>
          <input
            type="password"
            name="newPassword_"
            id="newPassword_"
            className={`${classnames({
              "is-invalid": errors.newPassword_,
            })}} inputForm`}
            {...register("newPassword_", { required: true })}
            placeholder="Nhập lại mật khẩu mới tại đây"
            value={pass.newPassword_}
            onChange={(e) => {
              setPass({
                ...pass,
                newPassword_: e.target.value,
              })
            }}
          />
          {pass.newPassword_ !== "" &&
            pass.newPassword_ !== pass.newPassword && (
              <FormText color="danger">Mật khẩu mới không khớp</FormText>
            )}
        </FormGroup>
        {/* <FormGroup style={{ textAlign: "center", marginBottom: '2rem' }}> */}
        <Button.Ripple
          type="submit"
          color="#09a863"
          style={{
            backgroundColor: "#09a863",
            display: 'flex',
            margin: 'auto'
          }}
          disabled={loading}
        >
          {loading ? (
            <div className="loader"></div>
          ) : (
            <span style={{ color: "#fff" }}>Lưu thay đổi</span>
          )}
        </Button.Ripple>
        {/* </FormGroup> */}
      </Form>
    </Card>
  )
}

export default ChangePass
