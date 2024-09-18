// ** React Imports
import { Link, useNavigate } from "react-router-dom"
import { useEffect, Fragment, useState, useContext } from "react"
import { getHomeRouteForLoggedInUser } from "../../../../utility/Utils"

// ** Third Party Components
import InputNumber from "rc-input-number"
import PerfectScrollbar from "react-perfect-scrollbar"
import * as IconReact from "react-feather"
const { ShoppingCart, X, Plus, Minus, Grid, Star, Heart } = IconReact

// ** Reactstrap Imports
import {
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Badge,
  Button,
  NavLink,
  Card,
  CardBody,
  Row,
  Col,
  CardText,
  UncontrolledTooltip,
} from "reactstrap"
import classnames from "classnames"
// ** Store & Actions
import { useDispatch, useSelector } from "react-redux"
import {
  getCartItems,
  deleteCartItem,
  getProduct,
} from "@src/views/apps/ecommerce/store"
import ListFunctions from "@src/navigation/functions.js"
import style from "@src/assets/scss/index.module.scss"
import { setSelectedRole } from "../../../../views/apps/ecommerce/store"
// ** Styles
import "@styles/react/libs/input-number/input-number.scss"
import navigation from '@src/navigation/vertical'
import menuIcon from "@src/assets/images/icons/menu.png"
import { AbilityContext } from '@src/utility/context/Can'
const CartDropdown = () => {
  const ability = useContext(AbilityContext)

  // ** State
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [show, setShow] = useState(false)

  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.ecommerce)
  const { roleId } = useSelector((state) => state.ecommerce)
  const navigate = useNavigate()
  // ** ComponentDidMount
  useEffect(() => {
    dispatch(getCartItems())
  }, [])
  const userData = JSON.parse(localStorage.getItem("userData"))
  const listRoles = userData?.listRoles ?? []
  // ** Function to toggle Dropdown
  const toggle = () => setDropdownOpen((prevState) => !prevState)

  // ** Function to call on Dropdown Item Click
  const handleDropdownItemClick = (id) => {
    dispatch(getProduct(id))
    toggle()
  }
  const handleClickRole = (key) => {
    // dispatch(setSelectedRole(key))
    // const routeItem = navigation.find(x => x.role === key)
    // if (routeItem && routeItem.children) {
    //   const children = routeItem.children
    //   if (children && children[0]?.children) {
    //     navigate(children[0]?.children[0]?.navLink)
    //   } else {
    //     navigate(routeItem.children[0]?.navLink)
    //   }
    // } else {
    //   navigate(routeItem?.navLink ?? getHomeRouteForLoggedInUser('admin'))
    // }
    navigate(key)

  }
  // ** Loops through Cart Array to return Cart Items
  const renderMenuItems = () => {
    return (
      <div className="grid-view" style={{ padding: '0 1rem' }}>
        {listRoles?.map((item, index) => {
          if (ability.can(item.action, item.resource)) {
            const IconTag = IconReact[item.icon]
            return (
              <div className="subContainer">
                <Card className="ecommerce-card subSystem" key={item.id} onClick={(e) => {
                  handleClickRole(item?.description)
                  //  setShow(!show)
                  toggle()
                }}>
                  <div
                    className="item-img text-center mx-auto"
                    style={{ minHeight: "60px", paddingTop: '0rem' }}
                  >
                    <Link className="iconContainer" to={item.navLink}><IconTag className="font-large-1" style={{ stroke: "#09A863" }} /></Link>
                  </div>
                </Card>
                <h6 className="item-name" style={{ marginBottom: '0.5rem', textAlign: 'center' }}>
                  <Link className="" to={item.navLink} style={{ justifyContent: 'center', marginTop: '0.75rem', fontSize: '15px' }}>
                    {item.title}
                  </Link>
                </h6>
              </div>
            )
          } else return null
        })}
      </div>
    )
  }

  return (
    <Dropdown
      isOpen={dropdownOpen}
      toggle={toggle}
      tag="li"
      className="dropdown-cart nav-item me-25"
    >
      <DropdownToggle tag="a" className="nav-link position-relative"
      // onClick={(e) => setShow(!show)}
      >
        {/* <Grid className="ficon" id="menu_tooltip" /> */}
        <img src={menuIcon} id="menu_tooltip" style={{ width: '30px', cursor: 'pointer' }} />
        {/* {store.cart.length > 0 ? (
          <Badge pill color='primary' className='badge-up'>
            {store.cart.length}
          </Badge>
        ) : null} */}
        <UncontrolledTooltip target="menu_tooltip">
          Danh sách chức năng
        </UncontrolledTooltip>
      </DropdownToggle>
      <DropdownMenu
        end
        tag="ul"
        className="dropdown-menu-media dropdown-cart mt-0 shadow-box customMenu"
      >
        <li
          className="dropdown-menu-header"
          style={{ backgroundColor: "white" }}
        >
          <DropdownItem tag="div" className="d-flex" header>
            <h5
              className="notification-title mb-0 me-auto"
              style={{ textAlign: "center", width: "100%", fontWeight: 'bolder' }}
            >
              DANH SÁCH CHỨC NĂNG
            </h5>
            {/* <Badge color='light-primary' pill>
              {store.cart.length || 0} Items
            </Badge> */}
          </DropdownItem>
        </li>
        <div className="ecommerce-application">{renderMenuItems()}</div>
      </DropdownMenu>
    </Dropdown>
  )
}

export default CartDropdown
