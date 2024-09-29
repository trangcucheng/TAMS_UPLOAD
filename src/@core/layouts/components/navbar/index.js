// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Label } from "reactstrap"
import Select from "react-select"
// ** Custom Components
import NavbarUser from './NavbarUser'
import NavbarBookmarks from './NavbarBookmarks'
import NavbarMenu from './NavbarMenu'
import SwiperNavigation from '../../../../views/extensions/swiper/SwiperNavigation'
import { selectThemeColors } from '@utils'
import toast from 'react-hot-toast'
import { setSelectedYear } from '../../../../views/apps/ecommerce/store'
import themeConfig from '@configs/themeConfig'

const ThemeNavbar = props => {
  // ** Props
  const { skin, setSkin, setMenuVisibility } = props
  const { roleId, selectedYear } = useSelector((state) => state.ecommerce)
  const [subsystem, setSubsystem] = useState()
  const userData = JSON.parse(localStorage.getItem("userData"))
  const listRoles = userData?.listRoles ?? []
  const [listYears, setListYears] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    const role = listRoles?.find(e => e.role === roleId)
    setSubsystem(role?.title ?? listRoles[0]?.title)
  }, [roleId])


  const generateYears = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let i = currentYear; i >= currentYear - 5; i--) {
      years.push({ value: i, label: i })
    }
    if (!selectedYear) {
      dispatch(setSelectedYear(currentYear))
    }
    setListYears(years)
  }

  useEffect(() => {
    // getListSchoolYear()
    generateYears()
  }, [])

  const handleChangeYear = (e) => {
    dispatch(setSelectedYear(e))
    toast.success("Cập nhật năm làm việc thành công!")
    window.location.reload()
  }
  return (
    <Fragment>
      <div className='bookmark-wrapper d-flex align-items-center col-6'>
        {/* <NavbarBookmarks setMenuVisibility={setMenuVisibility} /> */}
        {/* <NavbarMenu/>
        <SwiperNavigation/> */}
        <h5 style={{ textTransform: "uppercase", margin: '0', color: "#09A863", fontWeight: 'bold' }}>{`Hệ thống nhập tài liệu mẫu`}</h5>
      </div>
      {/* <NavbarMenu/> */}
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }} className="col col-6">
        {/* <div className="d-flex work-year" style={{ width: "40%", justifyContent: "flex-end" }}>
          <Label
            className="ml-1"
            style={{
              // width: "40%",
              fontSize: "14px",
              height: "34px",
              display: "flex",
              alignItems: "center",
              marginLeft: "1rem",
              marginRight: "1rem"
            }}
          >
            Năm làm việc:
          </Label>
          <div style={{ width: '45%' }}>
            {listYears && <Select
              // styles={{height:"34px"}}
              theme={selectThemeColors}
              className='react-select'
              classNamePrefix='select'
              value={listYears?.find(e => e.value === selectedYear)}
              onChange={(e) => {
                handleChangeYear(e?.value)
              }}
              options={listYears}
              placeholder='Chọn năm'
            />}
          </div>
        </div> */}
        <NavbarUser skin={skin} setSkin={setSkin} className='col col-6' style={{ marginLeft: "0" }} />

      </div>
    </Fragment>
  )
}

export default ThemeNavbar
