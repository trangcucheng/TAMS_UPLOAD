// ** Icons Import
import { Mail, MessageSquare, CheckSquare, Calendar, FileText, Circle, ShoppingCart, User, Shield, Globe, AlignJustify } from 'react-feather'

export default [
  {
    header: 'Quản lý danh mục'
  },
  {
    id: 'dmchung',
    title: 'Danh mục chung',
    icon: <Globe size={20} />,
    children: [
      {
        id: 'tinh',
        title: 'Tỉnh/ Thành phố',
        icon: <Circle size={12} />,
        navLink: '/apps/categories/provinces'
      },
      {
        id: 'huyen',
        title: 'Huyện/ Quận',
        icon: <Circle size={12} />,
        navLink: '/quanlydaotao/hosogiangvien'
      },
      {
        id: 'xa',
        title: 'Xã/ Phường',
        icon: <Circle size={12} />,
        navLink: '/quanlydaotao/hosogiangvien'
      },
      {
        id: 'dantoc',
        title: 'Dân tộc',
        icon: <Circle size={12} />,
        navLink: '/quanlydaotao/hosogiangvien'
      },
      {
        id: 'tongiao',
        title: 'Tôn giáo',
        icon: <Circle size={12} />,
        navLink: '/quanlydaotao/hosogiangvien'
      },
      {
        id: 'quoctich',
        title: 'Quốc tịch',
        icon: <Circle size={12} />,
        navLink: '/quanlydaotao/hosogiangvien'
      },
      {
        id: 'gioitinh',
        title: 'Giới tính',
        icon: <Circle size={12} />,
        navLink: '/quanlydaotao/hosogiangvien'
      },
      {
        id: 'tttinhoc',
        title: 'Trình độ tin học',
        icon: <Circle size={12} />,
        navLink: '/quanlydaotao/hosogiangvien'
      },
      {
        id: 'ngoaingu',
        title: 'Ngoại ngữ',
        icon: <Circle size={12} />,
        navLink: '/quanlydaotao/hosogiangvien'
      },
      {
        id: 'ttngoaingu',
        title: 'Trình độ ngoại ngữ',
        icon: <Circle size={12} />,
        navLink: '/quanlydaotao/hosogiangvien'
      },
      {
        id: 'chucvu',
        title: 'Chức vụ',
        icon: <Circle size={12} />,
        navLink: '/quanlydaotao/hosogiangvien'
      },
      {
        id: 'chucdanh',
        title: 'Chức danh',
        icon: <Circle size={12} />,
        navLink: '/quanlydaotao/hosogiangvien'
      },
      {
        id: 'hocham',
        title: 'Học hàm',
        icon: <Circle size={12} />,
        navLink: '/quanlydaotao/hosogiangvien'
      },
      {
        id: 'hocvi',
        title: 'Học vị',
        icon: <Circle size={12} />,
        navLink: '/quanlydaotao/hosogiangvien'
      },
      {
        id: 'capbac',
        title: 'Cấp bậc',
        icon: <Circle size={12} />,
        navLink: '/quanlydaotao/hosogiangvien'
      }
    ],
  },
  {
    id: 'hosocanbo',
    title: 'Danh mục HS cán bộ',
    icon: <FileText size={20} />,
    children: [
      {
        id: 'theodoithongtin',
        title: 'Theo dõi thông tin',
        icon: <Circle size={12} />,
        navLink: '/quanlydaotao/hosocanbo'
      }
    ],
  },
  {
    id: 'hosohocvien',
    title: 'Danh mục HS học viên',
    icon: <AlignJustify size={20} />,
    children: [
      {
        id: 'theodoithongtinhocvien',
        title: 'Theo dõi thông tin',
        icon: <Circle size={12} />,
        navLink: '/quanlydaotao/hosohocvien'
      }
    ],
  },
  {
    id: 'configuration',
    title: 'Cấu hình hệ thống',
    icon: <AlignJustify size={20} />,
    children: [
      {
        id: 'cauhinhdangteptin',
        title: 'Cấu hình dạng tệp tin',
        icon: <Circle size={12} />,
        navLink: '/cauhinhhethong/file'
      },
      {
        id: 'thamsocapnhat',
        title: 'Cấu hình tham số cập nhật, báo cáo dữ liệu',
        icon: <Circle size={12} />,
        navLink: '/cauhinhhethong/thamso'
      }
    ],
  },
  {
    id: 'daotao',
    title: 'Danh mục đào tạo',
    icon: <FileText size={20} />,
    children: [
      {
        id: 'theodoithongtinhocvien',
        title: 'Theo dõi thông tin',
        icon: <Circle size={12} />,
        navLink: '/quanlydaotao/hosohocvien'
      }
    ],
  },
  {
    id: 'nckh',
    title: 'Danh mục NCKH',
    icon: <FileText size={20} />,
    children: [
      {
        id: 'theodoithongtinhocvien',
        title: 'Theo dõi thông tin',
        icon: <Circle size={12} />,
        navLink: '/quanlydaotao/hosohocvien'
      }
    ],
  },
  {
    id: 'dulieuvanban',
    title: 'Danh mục DL văn bản',
    icon: <FileText size={20} />,
    children: [
      {
        id: 'theodoithongtinhocvien',
        title: 'Theo dõi thông tin',
        icon: <Circle size={12} />,
        navLink: '/quanlydaotao/hosohocvien'
      }
    ],
  },
  {
    id: 'taisan',
    title: 'Danh mục tài sản',
    icon: <FileText size={20} />,
    children: [
      {
        id: 'theodoithongtinhocvien',
        title: 'Theo dõi thông tin',
        icon: <Circle size={12} />,
        navLink: '/quanlydaotao/hosohocvien'
      }
    ],
  },
  {
    id: 'khtuongdinh',
    title: 'Danh mục KH tưởng định',
    icon: <FileText size={20} />,
    children: [
      {
        id: 'theodoithongtinhocvien',
        title: 'Theo dõi thông tin',
        icon: <Circle size={12} />,
        navLink: '/quanlydaotao/hosohocvien'
      }
    ],
  }
]
