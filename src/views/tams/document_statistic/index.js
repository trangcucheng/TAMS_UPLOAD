// ** React Imports
import { useContext } from 'react'

// ** Icons Imports
import { List } from 'react-feather'

// ** Custom Components
import Avatar from '@components/avatar'
import Timeline from '@components/timeline'
import AvatarGroup from '@components/avatar-group'

// ** Utils
import { kFormatter } from '@utils'

// ** Context
import { ThemeColors } from '@src/utility/context/ThemeColors'

// ** Reactstrap Imports
import { Row, Col, Card, CardHeader, CardTitle, CardBody } from 'reactstrap'

// ** Demo Components

// ** Images
import jsonImg from '@src/assets/images/icons/json.png'
import ceo from '@src/assets/images/portrait/small/avatar-s-9.jpg'

// ** Styles
import '@styles/react/libs/charts/apex-charts.scss'
import DocumentByCategories from '../../dashboard/components/DocumentByCategories'
import DocumentByAspects from '../../dashboard/components/DocumentByAspects'
import DocumentByTime from '../../dashboard/components/DocumentByTime'

const getRandomColor = () => {
  const r = Math.floor(Math.random() * 255)
  const g = Math.floor(Math.random() * 255)
  const b = Math.floor(Math.random() * 255)
  return `rgb(${r}, ${g}, ${b})`
}

const colorMap = {}

const getColorForLabel = (label) => {
  if (!colorMap[label]) {
    // Nếu nhãn chưa có màu, tạo màu ngẫu nhiên và lưu lại
    colorMap[label] = getRandomColor()
  }
  // Trả về màu đã lưu cho nhãn
  return colorMap[label]
}

// Mảng màu
const rgb_colors = [
  "rgb(255, 0, 0, 0.7)",
  "rgb(0, 255, 0, 0.7)",
  "rgb(0, 0, 255, 0.7)",
  "rgb(255, 255, 0, 0.7)",
  "rgb(255, 0, 255, 0.7)",
  "rgb(0, 255, 255, 0.7)",
  "rgb(128, 0, 0, 0.7)",
  "rgb(128, 128, 0, 0.7)",
  "rgb(0, 128, 0, 0.7)",
  "rgb(128, 0, 128, 0.7)",
  "rgb(0, 128, 128, 0.7)",
  "rgb(0, 0, 128, 0.7)",
  "rgb(255, 165, 0, 0.7)",
  "rgb(192, 192, 192, 0.7)",
  "rgb(0, 0, 0)"
]
const DocumentStatistic = () => {
  // ** Context
  const { colors } = useContext(ThemeColors)

  // ** Vars
  const avatarGroupArr = [
    {
      imgWidth: 33,
      imgHeight: 33,
      title: 'Billy Hopkins',
      placement: 'bottom',
      img: require('@src/assets/images/portrait/small/avatar-s-9.jpg').default
    },
    {
      imgWidth: 33,
      imgHeight: 33,
      title: 'Amy Carson',
      placement: 'bottom',
      img: require('@src/assets/images/portrait/small/avatar-s-6.jpg').default
    },
    {
      imgWidth: 33,
      imgHeight: 33,
      title: 'Brandon Miles',
      placement: 'bottom',
      img: require('@src/assets/images/portrait/small/avatar-s-8.jpg').default
    },
    {
      imgWidth: 33,
      imgHeight: 33,
      title: 'Daisy Weber',
      placement: 'bottom',
      img: require('@src/assets/images/portrait/small/avatar-s-7.jpg').default
    },
    {
      imgWidth: 33,
      imgHeight: 33,
      title: 'Jenny Looper',
      placement: 'bottom',
      img: require('@src/assets/images/portrait/small/avatar-s-20.jpg').default
    }
  ]
  const data = [
    {
      title: '12 Invoices have been paid',
      content: 'Invoices have been paid to the company.',
      meta: '',
      metaClassName: 'me-1',
      customContent: (
        <div className='d-flex align-items-center'>
          <img className='me-1' src={jsonImg} alt='data.json' height='23' />
          <span>data.json</span>
        </div>
      )
    },
    {
      title: 'Client Meeting',
      content: 'Project meeting with john @10:15am.',
      meta: '',
      metaClassName: 'me-1',
      color: 'warning',
      customContent: (
        <div className='d-flex align-items-center'>
          <Avatar img={ceo} />
          <div className='ms-50'>
            <h6 className='mb-0'>John Doe (Client)</h6>
            <span>CEO of Infibeam</span>
          </div>
        </div>
      )
    },
    {
      title: 'Create a new project for client',
      content: 'Add files to new design folder',
      color: 'info',
      meta: '',
      metaClassName: 'me-1',
      customContent: <AvatarGroup data={avatarGroupArr} />
    },
    {
      title: 'Create a new project for client',
      content: 'Add files to new design folder',
      color: 'danger',
      meta: '',
      metaClassName: 'me-1'
    }
  ]

  return (
    <div id='dashboard-analytics'>
      <Row className='match-height'>
        <Col lg='6' md='12'>
          <DocumentByCategories colorForLabel={getColorForLabel} colors={rgb_colors} />
        </Col>
        <Col lg='6' md='12'>
          <DocumentByAspects colors={rgb_colors} />
        </Col>
      </Row>
      <Row className='match-height'>
        <Col lg='12' md='12'>
          <DocumentByTime colorForLabel={getColorForLabel} colors={rgb_colors} />
        </Col>
      </Row>
    </div>
  )
}

export default DocumentStatistic