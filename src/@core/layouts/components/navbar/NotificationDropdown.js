// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Bell, X, Check, AlertTriangle } from 'react-feather'
import { NotificationOutlined, WarningOutlined } from '@ant-design/icons'

// ** Reactstrap Imports
import { Button, Badge, Input, DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown } from 'reactstrap'
import dayjs from "dayjs"
const NotificationDropdown = () => {
  // ** Notification Array
  const [hvlqNotis, setHvlqNotis] = useState()
  // const getHvlqNoti = () => {
  //   getHvlqNotification({
  //     params: {
  //       page: 1,
  //       limit: 100,
  //     }
  //   }).then(res => {
  //     setHvlqNotis({
  //       count: res?.count < 20 ? res.count : 20,
  //       data: res?.list
  //     })
  //   })
  // }
  useEffect(() => {
    // getHvlqNoti()
  }, [])


  // ** Function to render Notifications
  /*eslint-disable */
  const renderNotificationItems = () => {
    return (
      <PerfectScrollbar
        component='li'
        className='media-list scrollable-container'
        options={{
          wheelPropagation: false
        }}
      >
        {hvlqNotis?.data?.map((item, index) => {
          return (
            <a
              key={index}
              className='d-flex'
              href={`/quanlythongtindieuhanh/thongbaohocvien/${item?.ID}`}
            // onClick={e => {
            //   if (!item.switch) {
            //     e.preventDefault()
            //   }
            // }}
            >
              <div
                className={classnames('list-item d-flex', {
                  'align-items-start': !item.switch,
                  'align-items-center': item.switch
                })}
              >
                {!item.switch ? (
                  <Fragment>
                    <div className='me-1'>
                      {/* <Avatar
                        {...(item.img
                          ? { img: item.img, imgHeight: 32, imgWidth: 32 }
                          : item.avatarContent
                            ? {
                              content: item.avatarContent,
                              color: item.color
                            }
                            : item.avatarIcon
                              ? {
                                icon: item.avatarIcon,
                                color: item.color
                              }
                              : null)}
                      /> */}

                      {
                        item?.type === "IMPORTANT" ? <WarningOutlined style={{
                          fontSize: "16px",
                          color: "red"
                        }}
                        /> : <NotificationOutlined
                          style={{
                            fontSize: "16px"
                          }}
                        />
                      }
                      {/* <Bell /> */}
                    </div>
                    <div className='list-item-body flex-grow-1'>
                      <span style={{
                        color: item?.type === "IMPORTANT" ? "red" : "#09a863"
                      }}>{item.title}</span><br />
                      <small className='notification-text'>{item.subtitle}</small>
                      <small className='notification-text'>{dayjs(item?.created_at).format("HH:mm DD-MM-YYYY")}</small>
                    </div>
                  </Fragment>
                ) : (
                  <Fragment>
                    {item.title}
                    {item.switch}
                  </Fragment>
                )}
              </div>
            </a>
          )
        })}
      </PerfectScrollbar>
    )
  }
  /*eslint-enable */

  return (
    <UncontrolledDropdown tag='li' className='dropdown-notification nav-item me-25'>
      <DropdownToggle tag='a' className='nav-link' href='/' onClick={e => e.preventDefault()}>
        <Bell size={21} />
        <Badge pill color='danger' className='badge-up'>
          {hvlqNotis?.count ?? 0}
        </Badge>
      </DropdownToggle>
      <DropdownMenu end tag='ul' className='dropdown-menu-media mt-0'>
        <li className='dropdown-menu-header'>
          <DropdownItem className='d-flex' tag='div' header>
            <h4 className='notification-title mb-0 me-auto'>Thông báo</h4>
            {/* <Badge tag='div' color='light-primary' pill>
              6 New
            </Badge> */}
          </DropdownItem>
        </li>
        {renderNotificationItems()}
        {/* <li className='dropdown-menu-footer'>
          <Button color='primary' block>
            Read all notifications
          </Button>
        </li> */}
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default NotificationDropdown
