import { Fragment, useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import classnames from "classnames"
import SwiperCore, { EffectFade, Thumbs, Navigation } from "swiper"
// import { Swiper, SwiperSlide } from 'swiper/react/swiper-react'
import { CardText, Nav, NavItem, NavLink } from "reactstrap"
import { Button } from "antd"
import navigation from '@src/navigation/vertical'
import "@styles/react/libs/swiper/swiper.scss"
import Swiper, {
  SwiperSlide,
} from "../../../layouts/components/swiper/index.jsx"
import style from "../../../../assets/scss/index.module.scss"
import { setSelectedRole } from "../../../../views/apps/ecommerce/store/index.js"
import { getHomeRouteForLoggedInUser } from "../../../../utility/Utils.js"
import * as IconReact from "react-feather"
import * as IconAntd from '@ant-design/icons'
import { ssoLink } from "../../../../api/authentication.js"

const NavbarMenu = () => {
  const { roleId } = useSelector((state) => state.ecommerce)
  const navigate = useNavigate()
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  // const [selectRole, setSelectRole] = useState(0)
  const userData = JSON.parse(localStorage.getItem("userData"))
  const listRoles = userData?.listRoles ?? []
  const dispatch = useDispatch()
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  const [number, setNumber] = useState(5)
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth)
    }
    window.addEventListener("resize", handleResize)
    if (screenWidth >= 1500) {
      setNumber(5)
    } else if (1450 <= screenWidth && screenWidth < 1500) {
      setNumber(4)
    } else if (915 <= screenWidth && screenWidth < 1450) {
      setNumber(3)
    } else if (530 <= screenWidth && screenWidth < 915) {
      setNumber(2)
    } else {
      setNumber(1)
    }
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [screenWidth])

  const thumbnailSwiperParams = {
    onSwiper: setThumbsSwiper,
    spaceBetween: 2,
    slidesPerView: number,
    touchRatio: 0.2,
    freeMode: true,
    loop: false,
    slideToClickedSlide: false,
    navigation: true,
  }
  // dispatch(setSelectedRole(selectRole))
  const handleClickRole = (key) => {
    dispatch(setSelectedRole(key))
    const routeItem = navigation.find(x => x.role === key)
    if (routeItem && routeItem.children) {
      const children = routeItem.children
      if (children && children[0]?.children) {
        navigate(children[0]?.children[0]?.navLink)
      } else {
        navigate(routeItem.children[0]?.navLink)
      }
    } else {
      navigate(routeItem?.navLink ?? getHomeRouteForLoggedInUser('admin'))
    }

  }
  return (
    <div className="product-small-image-wrapper">
      <Swiper options={thumbnailSwiperParams} style={{ position: "relative" }}>
        <Nav>
          {listRoles?.map((single, key) => {
            const IconTag = IconAntd[single.icon_] ?? IconReact[single.icon_]
            return (
            <SwiperSlide key={key} style={{ width: "50px" }}>
              <div
                className="single-image"
                onClick={(e) => {
                  handleClickRole(single?.id)
                }}
              >
                <NavItem>
                  <Button
                    type={single?.id !== roleId ? 'text' : 'primary'}
                    // icon={ <`${single.icon_}` />}
                    icon={<IconTag size='17' />}
                  >
                    {single.label}
                  </Button>
                </NavItem>
              </div>
            </SwiperSlide>
          )
              })}
        </Nav>
      </Swiper>
    </div>
  )
}

export default NavbarMenu
