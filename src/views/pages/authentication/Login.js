// ** React Imports
import { useContext, useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'
import useJwt from '@src/auth/jwt/useJwt'
import logo from '@src/assets/images/logo/logo.png'
import navigation from '@src/navigation/vertical'

// ** Third Party Components
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { Facebook, Twitter, Mail, GitHub, HelpCircle, Coffee, X } from 'react-feather'

// ** Actions
import { handleLogin } from '@store/authentication'

// ** Context
import { AbilityContext } from '@src/utility/context/Can'
import { initialAbility } from '../../../configs/acl/initialAbility'
import { setSelectedRole, setSelectedYear } from '../../apps/ecommerce/store'
// ** Custom Components
import Avatar from '@components/avatar'
import InputPasswordToggle from '@components/input-password-toggle'
import classnames from 'classnames'
// ** Utils
import { getHomeRouteForLoggedInUser, isObjEmpty } from '@utils'

// ** Reactstrap Imports
import { Row, Col, Form, Input, Label, Alert, Button, CardText, CardTitle, UncontrolledTooltip, FormText } from 'reactstrap'
import { MESSAGES, MESSAGES_MEAN, LIST_ROLE } from '../../../utility/constant'

// import API
import { login } from '../../../api/authentication'
import { getDetailUser } from '../../../api/users'
import { getPerByRoleId } from '../../../api/rolePermissions'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
// ** Styles
import '@styles/react/pages/page-authentication.scss'
import style from '../../../assets/scss/index.module.scss'
import { getPermissionByRole } from '../../../api/permissions'

const ToastContent = ({ t, name, role }) => {
  return (
    <div className='d-flex'>
      <div className='me-1'>
        <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
      </div>
      <div className='d-flex flex-column'>
        <div className='d-flex justify-content-between'>
          <h6>{name}</h6>
          <X size={12} className='cursor-pointer' onClick={() => toast.dismiss(t.id)} />
        </div>
        <span>Đăng nhập thành công với quyền {role}!</span>
      </div>
    </div>
  )
}

const fakeAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MTI5ZDY5NzA1NGM0M2U4MTY1NjAxNSIsInVzZXJOYW1lIjoiYWRtaW4iLCJyb2xlIjoiIiwic3ViIjoiNjUxMjlkNjk3MDU0YzQzZTgxNjU2MDE1IiwiaWF0IjoxNzI3NTg2OTU4LCJleHAiOjE3Mjc2NzMzNTh9.36lym0hwhT0K-FI-VQAWxh5jdHMDca4BlGsxPn8BQaQ"
const fakeRefreshToken = ""
const fakeUserDatas = { _id: "65129d697054c43e81656015", identity: "027083000678", userName: "admin", fullName: "Quản trị hệ thống", passWord: "$2b$12$HX.Q7OzaViIFh5N9OUDqz.2wQkA0kN6Y.RZz3wbIxfScCyIFvzql.", userGroupID: "650f07c8eb73d1afc456df77", groupName: "Quản trị hệ thống", isActive: 1, createdAt: "2023-09-26T08:59:21.258Z", updatedAt: "2023-12-06T15:28:50.053Z", __v: 0, email: "khanh@gmail.com", role: "admin", permission: "[{\"action\":\"read\",\"subject\":\"Auth\"},{\"action\":\"manage\",\"subject\":\"all\"}]", listRoles: [{ id: "base", title: "Kiểm tra trùng lặp tuyệt đối", icon: "Globe", role: 0, description: "/tams/checking-document", action: "read", resource: "KIEM_TRA_TRUNG_LAP_TUYET_DOI" }, { id: "training", title: "Kiểm tra trùng lặp xấp xỉ", icon: "BookOpen", role: 0, description: "/tams/checking-specialized", action: "read", resource: "KIEM_TRA_TRUNG_LAP_XAP_XI" }, { id: "facilities", title: "QL kho tài liệu mẫu", icon: "Trello", role: 0, description: "/tams/document", action: "read", resource: "QL_KHO_TAI_LIEU_MAU" }, { id: "science", title: "QL tài khoản người dùng", icon: "Users", role: 0, description: "/tams/accounts", action: "read", resource: "QL_TAI_KHOAN" }, { id: "map", title: "QL người dùng và phân quyền", icon: "Hexagon", role: 0, description: "/tams/roles", action: "read", resource: "PHAN_QUYEN_VAI_TRO" }, { id: "plan", title: "Quản lý đơn vị", icon: "Map", role: 0, description: "/tams/organization", action: "read", resource: "DON_VI" }] }

const Login = () => {
  const selected = useRef()
  const MySwal = withReactContent(Swal)

  // ** Hooks
  const { skin } = useSkin()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const ability = useContext(AbilityContext)
  const [loading, setLoading] = useState(false)
  const [loginErr, setLoginErr] = useState('')
  const [permissionRole, setPermissionRole] = useState()
  const {
    control,
    setError,
    handleSubmit,
    register,
    clearErrors,
    formState: { errors }
  } = useForm()
  const illustration = skin === 'dark' ? 'login_cover.jpg' : 'login_cover.jpg'
  const source = require(`@src/assets/images/pages/${illustration}`).default

  selected.current = []
  const handleNotification = () => {
    MySwal.fire({
      title: "Vui lòng liên hệ ban CNTT để cấp lại mật khẩu!",
      // icon: "error",
      customClass: {
        confirmButton: "btn btn-success",
      },
    })
  }
  const onSubmit = data => {
    if (isObjEmpty(errors)) {
      const dataSubmit = {
        userName: data.Username ?? '',
        passWord: data.Password ?? ''
      }
      setLoading(true)
      dispatch(setSelectedYear(new Date().getFullYear()))
      localStorage.setItem('accessToken', fakeAccessToken)
      localStorage.setItem('refreshToken', fakeRefreshToken)
      const permissionArrFormat = [
        {
          action: 'manage',
          subject: 'all'
        }
      ]

      localStorage.setItem('userData', JSON.stringify(fakeUserDatas))
      ability.update(permissionArrFormat)
      navigate(getHomeRouteForLoggedInUser("admin"))
    }
  }

  return (
    <div className='auth-wrapper auth-cover'>
      <Row className='auth-inner m-0'>
        <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
        </Link>
        <Col className='d-none d-lg-flex align-items-center' lg='8' sm='12' style={{ padding: '0' }}>
          <div className='w-100 d-lg-flex align-items-center justify-content-center' style={{ height: '100%' }}>
            <img className='img-fluid w-100' src={source} alt='Login Cover' style={{ height: '100%', width: '100%' }} />
          </div>
        </Col>
        <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg={4} sm='12'>
          <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
            <img className='fallback-logo d-flex m-auto' src={logo} alt='logo' style={{ width: "12rem" }} />
            <CardTitle tag='h1' className='fw-bold mb-1' style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '1rem' }}>
              Học viện Chính trị
            </CardTitle>
            <CardTitle tag='h2' className='fw-bold mb-1' style={{ textAlign: 'center', marginTop: '2rem' }}>
              Hệ thống cập nhật dữ liệu phục vụ phát hiện đạo văn            </CardTitle>
            {/* <CardTitle tag='h2' className='fw-bold mb-1' style={{ textAlign: 'center', marginTop: '2rem' }}>
              Hệ thống quản lý Nhà trường thông minh
            </CardTitle> */}
            {
              loginErr !== '' && <Alert color='danger' style={{ padding: '5px', textAlign: 'center' }}>
                {loginErr}
              </Alert>
            }
            <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              <div className='mb-1'>
                <Label className='form-label' for='Username'>
                  Tên đăng nhập<span className={style.requiredInput}>(*)</span>
                </Label>
                <input
                  autoFocus
                  id='Username'
                  name='Username'
                  type='text'
                  placeholder='Nhập tên đăng nhập'
                  className={`${classnames({ 'is-invalid': errors['Username'] })} ${style.inputForm}`}
                  {...register('Username', { required: true })}
                />
                {errors && errors.Username && <FormText color="danger" className={style.formErr}>Vui lòng nhập tên đăng nhập</FormText>}
              </div>
              <div className='mb-1'>
                <div className='d-flex justify-content-between'>
                  <Label className='form-label' for='Password'>
                    Mật khẩu<span className={style.requiredInput}>(*)</span>
                  </Label>
                  <a to='/login' onClick={() => handleNotification()}>
                    <small>Quên mật khẩu</small>
                  </a>
                </div>

                <InputPasswordToggle
                  id='Password'
                  name='Password'
                  placeholder='Nhập mật khẩu'
                  className={`${classnames({ 'is-invalid': errors['Password'] })}`}
                  {...register('Password', { required: true })}
                />
                {errors && errors.Password && <FormText color="danger" className={style.formErr}>Vui lòng nhập mật khẩu</FormText>}
              </div>
              {/* <div className='form-check mb-1'>
                <Input type='checkbox' id='remember-me' />
                <Label className='form-check-label' for='remember-me'>
                  Remember Me
                </Label>
              </div> */}
              <Button type='submit' color='primary' block disabled={loading}>
                {
                  loading ? (<div className='loader'></div>) : <span style={{ color: "#fff" }}>Đăng nhập</span>
                }
              </Button>
            </Form>
            {/* <p className='text-center mt-2'>
              <span className='me-25'>New on our platform?</span>
              <Link to='/register'>
                <span>Create an account</span>
              </Link>
            </p>
            <div className='divider my-2'>
              <div className='divider-text'>or</div>
            </div> */}
            {/* <div className='auth-footer-btn d-flex justify-content-center'>
              <Button color='facebook'>
                <Facebook size={14} />
              </Button>
              <Button color='twitter'>
                <Twitter size={14} />
              </Button>
              <Button color='google'>
                <Mail size={14} />
              </Button>
              <Button className='me-0' color='github'>
                <GitHub size={14} />
              </Button>
            </div> */}
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default Login
