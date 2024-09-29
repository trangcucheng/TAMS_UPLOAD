import { BuildOutlined, ReadOutlined, ScheduleOutlined, WindowsOutlined } from "@ant-design/icons"
import { Airplay, BookOpen, Box, Calendar, CheckSquare, Chrome, Circle, Command, FileText, Globe, Hexagon, Info, Mail, MessageSquare, Shield, ShoppingCart, Trello, User, Users } from "react-feather"
export const MESSAGES = {
    user_not_found: "user_not_found",
    invalid_password: "invalid_password",
    username_or_identity_already_exist: 'username_or_identity_already_exist',
    PermissionGroup_is_exist: 'PermissionGroup_is_exist',
    Permission_is_exist: 'Permission_is_exist',
    Email_is_exist: 'Email_is_exist',
    is_not_active: 'is_not_active'
}

export const MESSAGES_MEAN = {
    [MESSAGES.user_not_found]: "Tài khoản không tồn tại trong hệ thống!",
    [MESSAGES.invalid_password]: "Tên đăng nhập hoặc mật khẩu không đúng",
    [MESSAGES.username_or_identity_already_exist]: 'Tên đăng nhập hoặc số CCCD/CMND đã tồn tại',
    [MESSAGES.PermissionGroup_is_exist]: 'Nhóm quyền đã tồn tại',
    [MESSAGES.Permission_is_exist]: 'Mã quyền đã tồn tại',
    [MESSAGES.Email_is_exist]: 'Email đã tồn tại',
    [MESSAGES.is_not_active]: 'Tài khoản đã bị khóa!'
}

export const LIST_SCHEDULE_STATUS = {
    dt: "DT",
    bh: "BH",
}

export const LIST_SCHEDULE_STATUS_MEAN = {
    [LIST_SCHEDULE_STATUS.dt]: "Dự thảo",
    [LIST_SCHEDULE_STATUS.bh]: "Ban hành",
}

export const LIST_SCHEDULE_STATUS_COLOR = {
    [LIST_SCHEDULE_STATUS.dt]: "warning",
    [LIST_SCHEDULE_STATUS.bh]: "success",
}
export const TYPEOFDAY = [
    {
        id: 1,
        name: "Lễ",
        value: 'holiday'
    },
    {
        id: 2,
        name: "Hoạt động của trường",
        value: 'activityOfOrganization'
    },
    {
        id: 3,
        name: "Chào cờ",
        value: 'flagSalitation'
    },
    {
        id: 4,
        name: "Hoạt động khác",
        value: 'otherActivity'
    },
]

export const LIST_ROLE = [
    {
        id: 'base',
        title: 'Kiểm tra trùng lặp tuyệt đối',
        icon: "Globe",
        role: 0,
        description: '/tams/checking-document',
        action: "read",
        resource: 'KIEM_TRA_TRUNG_LAP_TUYET_DOI'
    },
    {
        id: 'training',
        title: 'Kiểm tra trùng lặp xấp xỉ',
        icon: "BookOpen",
        role: 0,
        description: '/tams/checking-specialized',
        action: 'read',
        resource: 'KIEM_TRA_TRUNG_LAP_XAP_XI'
    },
    {
        id: 'facilities',
        title: 'QL kho tài liệu mẫu',
        icon: "Trello",
        role: 0,
        description: '/tams/document',
        action: 'read',
        resource: 'QL_KHO_TAI_LIEU_MAU'
    },
    {
        id: 'science',
        title: 'QL tài khoản người dùng',
        icon: "Users",
        role: 0,
        description: '/tams/accounts',
        action: 'read',
        resource: 'QL_TAI_KHOAN'
    },
    {
        id: 'map',
        title: 'QL người dùng và phân quyền',
        icon: "Hexagon",
        role: 0,
        description: '/tams/roles',
        action: 'read',
        resource: 'PHAN_QUYEN_VAI_TRO'
    },
    {
        id: 'plan',
        title: 'Quản lý đơn vị',
        icon: "Map",
        role: 0,
        description: '/tams/organization',
        action: 'read',
        resource: 'DON_VI'
    },
    // {
    //     id: 'information',
    //     title: 'Quản lý TT học trực tuyến',
    //     icon: "Info",
    //     role: 6,
    //     description: 'qltthtt.SQCT.info'
    // },
    // {
    //     id: 'manage',
    //     title: 'Quản lý TT điều hành',
    //     icon: "Globe",
    //     role: 7,
    //     description: 'qlttdh.SQCT.info'
    // }
]

export const LIST_PROVINCES = [
    {
        id: 0,
        name: 'Hà Nội',
        code: '30'
    },
    {
        id: 1,
        name: 'Nghệ An',
        code: '37'
    }
]

export const LIST_DISTRICTS = [
    {
        id: 0,
        province_id: 0,
        name: 'Bắc Từ Liêm',
        code: '30'
    },
    {
        id: 1,
        province_id: 0,
        name: 'Cầu Giấy',
        code: '37'
    },
    {
        id: 2,
        province_id: 1,
        name: 'Thanh Chương',
        code: '37'
    },
    {
        id: 3,
        province_id: 1,
        name: 'Nam Đàn',
        code: '37'
    }
]

export const LIST_WARDS = [
    {
        id: 0,
        district_id: 0,
        name: 'Cổ Nhuế 1',
        code: '30'
    },
    {
        id: 1,
        district_id: 1,
        name: 'Nghĩa Tân',
        code: '37'
    },
    {
        id: 2,
        district_id: 2,
        name: 'Thanh Liên',
        code: '37'
    },
    {
        id: 3,
        district_id: 3,
        name: 'Kim Liên',
        code: '37'
    }
]

export const FAKE_PLAN_WEEK = [
    {
        1: [
            {
                chapter: "15",
                subjectName: "Toán cao cấp 1",
                classRoom: "303",
                typeOfLesson: "TL",
                subjectOrganization: "CNTT"
            },
            {
                chapter: "69",
                subjectName: "Toán cao cấp 2",
                classRoom: "303",
                typeOfLesson: "TL",
                subjectOrganization: "DTVT"
            }
        ],
        2: [
            {
                chapter: "15",
                subjectName: "Toán cao cấp 3",
                classRoom: "303",
                typeOfLesson: "TL",
                subjectOrganization: "CNTT"
            },
            {
                chapter: "69",
                subjectName: "Toán cao cấp 4",
                classRoom: "303",
                typeOfLesson: "TL",
                subjectOrganization: "DTVT"
            }
        ],
        organizationClassName: "Lớp số 1",
        des: "1 là thứ 2, 2 là thứ 3 ... tương tự"
    },
    {
        1: [
            {
                chapter: "15",
                subjectName: "Toán cao cấp 1",
                classRoom: "303",
                typeOfLesson: "TL",
                subjectOrganization: "CNTT"
            },
            {
                chapter: "69",
                subjectName: "Toán cao cấp 2",
                classRoom: "303",
                typeOfLesson: "TL",
                subjectOrganization: "DTVT"
            }
        ],
        2: [
            {
                chapter: "15",
                subjectName: "Toán cao cấp 3",
                classRoom: "303",
                typeOfLesson: "TL",
                subjectOrganization: "CNTT"
            },
            {
                chapter: "69",
                subjectName: "Toán cao cấp 4",
                classRoom: "303",
                typeOfLesson: "TL",
                subjectOrganization: "DTVT"
            }
        ],
        organizationClassName: "Lớp số 2",
        des: "1 là thứ 2, 2 là thứ 3 ... tương tự"
    }
]

export const WEEK_DAYS = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"]

export const PER_PAGE_DEFAULT = 100
export const PAGE_DEFAULT = 1
