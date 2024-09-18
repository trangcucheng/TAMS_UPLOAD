import { Users, BookOpen, Box, Chrome, Trello, Info, Map, Globe } from "react-feather"

export default [
    {
        id: 'base',
        title: 'Kiểm tra trùng lặp tuyệt đối',
        icon: <Users className="font-large-1" style={{ stroke: "#09A863" }} />,
        role: 0
    },
    {
        id: 'training',
        title: 'Quản lý đào tạo',
        icon: <BookOpen className="font-large-1" style={{ stroke: "#09A863" }} />,
        role: 1
    },
    {
        id: 'facilities',
        title: 'Quản lý KH huấn luyện',
        icon: <Trello className="font-large-1" style={{ stroke: "#09A863" }} />,
        role: 2
    },
    {
        id: 'science',
        title: 'Quản lý CSVC',
        icon: <Chrome className="font-large-1" style={{ stroke: "#09A863" }} />,
        role: 3
    },
    {
        id: 'map',
        title: 'Quản lý khoa học',
        icon: <Map className="font-large-1" style={{ stroke: "#09A863" }} />,
        role: 4
    },
    {
        id: 'plan',
        title: 'Quản lý bản đồ',
        icon: <Map className="font-large-1" style={{ stroke: "#09A863" }} />,
        role: 5
    },
    {
        id: 'information',
        title: 'Quản lý TT học trực tuyến',
        icon: <Info className="font-large-1" style={{ stroke: "#09A863" }} />,
        role: 6
    },
    {
        id: 'manage',
        title: 'Quản lý TT điều hành',
        icon: <Globe className="font-large-1" style={{ stroke: "#09A863" }} />,
        role: 7
    }
]