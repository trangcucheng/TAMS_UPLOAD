// ** Icons Import
import { Book, Calendar, ChevronsDown, ChevronsUp, Clipboard, FileMinus, FilePlus, FileText, Grid, Menu, UserCheck, UserPlus, Users } from 'react-feather'

export default [
  {
    header: 'Tài liệu'
  },
  {
    id: 'document',
    title: 'QL kho tài liệu mẫu',
    icon: <FileText size={20} />,
    navLink: '/tams/document',
    role: 0
  },
  {
    header: 'Kiểm tra tài liệu'
  },
  {
    id: 'course',
    title: 'Đợt kiểm tra',
    icon: <Calendar size={20} />,
    navLink: '/tams/course',
    role: 0
  },
  {
    id: 'checking-document',
    title: 'Kiểm tra tài liệu',
    icon: <Clipboard size={20} />,
    navLink: '/tams/checking-document',
    role: 0
  },
  {
    header: 'Quản lý danh mục'
  },
  {
    id: 'document-type',
    title: 'Loại tài liệu',
    icon: <Book size={20} />,
    navLink: '/tams/document-type',
    role: 0
  },
  {
    id: 'document-source',
    title: 'Nguồn tài liệu',
    icon: <FileMinus size={20} />,
    navLink: '/tams/document-source',
    role: 0
  },
  {
    id: 'major',
    title: 'Lĩnh vực',
    icon: <Grid size={20} />,
    navLink: '/tams/major',
    role: 0
  },
  {
    id: 'organization',
    title: 'Đơn vị',
    icon: <Menu size={20} />,
    navLink: '/tams/organization',
    role: 0
  },
  {
    header: 'Quản lý người dùng'
  },
  {
    id: 'user',
    title: 'QL Tài khoản',
    icon: <Users size={20} />,
    navLink: '/tams/user',
    role: 0
  },
  {
    id: 'role',
    title: 'Vai trò, phân quyền',
    icon: <Users size={20} />,
    navLink: '/tams/role',
    role: 0
  },
  // {
  //   id: 'permission',
  //   title: 'Phân quyền',
  //   icon: <UserPlus size={20} />,
  //   navLink: '/tams/role_permissions'
  // },
  {
    id: 'permissions',
    title: 'QL các quyền cơ bản',
    icon: <UserPlus size={20} />,
    navLink: '/tams/permission',
    role: 0
  }
]
