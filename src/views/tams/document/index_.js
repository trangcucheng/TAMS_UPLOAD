// ** React Imports
import React, { Fragment, useState, forwardRef, useEffect, useRef, useContext } from 'react'

// imprt thư viện của bảng
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
//import icon
import { ChevronDown, Share, Printer, FileText, File, Grid, Eye, Plus, adge, MoreVertical, Trash, Edit, Search } from 'react-feather'
import { Link } from 'react-router-dom'

//import css
import '@styles/react/libs/tables/react-dataTable-component.scss'

// import API
import { searchListTruongDaiHoc, getListTruongDaiHoc, exportTruongDaiHoc, exportTruongDaiHocTemplate } from '../../../api/truongDaiHoc'
import { getListHoSoDangKi, danhSoBaoDanh, uploadZip, searchListHoSoDangKi, getAllDanhSach, getAllDanhSachDanAnh, getByChuyenNganh, getByDiaChiDT } from '../../../api/hoSoDangKi'
import { AbilityContext } from '@src/utility/context/Can'
import axios from 'axios'
//import thư viện
import { TemplateHandler } from "easy-template-x"
import { saveFile } from '../../utils/util'
import readXlsxFile from 'read-excel-file/web-worker'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { toDateString } from '../../../utility/Utils'

import responseResultHelper from '../../utils/reponsive'

import { getListDiaDiemToChucThi } from '../../../api/diaDiemToChucThi'
import { getListDiaChiDaoTao } from '../../../api/diaChiDaoTao'
import { getListNganhDaiHoc } from '../../../api/nganhDaiHoc'
import { getListChuyenNganh } from '../../../api/chuyenNganh'
import { getListChuyenNganhHep } from '../../../api/chuyenNganhHep'
import { getListLoaiHinhDaoTao } from '../../../api/loaiHinhDaoTao'
import { getListHinhThucUuTien } from '../../../api/hinhThucUuTien'
import { getListPhanLoaiTotNghiep } from '../../../api/phanloaiTotNghiep'
import { ACTION_METHOD_TYPE } from '../../utils/constant'
import WaitingModal from '../../../views/ui-elements/waiting-modals'
// ** Reactstrap Import
import {
    Row,
    Col,
    Card,
    Input,
    Label,
    Button,
    CardTitle,
    CardHeader,
    DropdownMenu,
    DropdownItem,
    DropdownToggle,
    UncontrolledButtonDropdown,
    UncontrolledDropdown,
    Badge,
    Alert,
    UncontrolledTooltip
} from 'reactstrap'
import Detail from './Detail'
import { getInfo } from '../../../api/thamSoHeThong'

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
    <div className='form-check'>
        <Input type='checkbox' ref={ref} {...props} />
    </div>
))
/***
 * Định nghĩa từ viết tắt
 * 1. HS: Hồ sơ
 */

const HoSoDK = () => {
    const ability = useContext(AbilityContext)
    const inputFile = useRef(null)
    const inputFileZip = useRef(null)

    // ** States
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const [perPage, setPerPage] = useState(10)
    const [data, setData] = useState({
        data: [],
        totalCount: 0
    })
    const [datasource, setDataSource] = useState()
    const [info, setInfo] = useState()
    const [modalXoaHS, setModalXoaHS] = useState(false)
    const [modalImportHS, setModalImportHS] = useState(false)
    const [modalImportImage, setModalImportImage] = useState(false)

    const [listImport, setListImport] = useState()
    const [listDiadiem, setListDiadiem] = useState([])
    const [listDcdt, setListdcdt] = useState([])
    const [listTDH, setListTDH] = useState([])
    const [listNganh, setListNganh] = useState([])
    const [listLHDT, setListLHDT] = useState([])
    const [listLTN, setListLTN] = useState([])
    const [listCN, setListCN] = useState([])
    const [listCNH, setListCNH] = useState([])
    const [listDTUT, setListDTUT] = useState([])

    const [datathamso, setThamso] = useState()

    useEffect(() => {
        getInfo()
            .then(res => {
                const listres = res.result?.data
                setThamso(listres[0] ?? {})
            }).catch(err => {
                console.log(err)
            })
    }, [])
    const handleModalXoaHS = () => setModalXoaHS(!modalXoaHS)
    const handleModalImportHS = () => setModalImportHS(!modalImportHS)
    const handleModalImportImage = () => setModalImportImage(!modalImportImage)

    const _handleXoaHS = (data) => {
        setInfo(data)
        setModalXoaHS(true)
    }
    const columns = [
        {
            name: "STT",
            center: true,
            width: "70px",
            cell: (row, index) => <span>{(((currentPage - 1) * perPage) + index + 1)}</span>
        },

        {
            name: 'Mã HS',
            center: true,
            maxWidth: '20px',
            selector: row => row.STT,

        },
        {
            name: 'Họ tên',
            minWidth: '200px',
            selector: row => row.hoTen,
        },
        {
            name: 'Ngày sinh',
            minWidth: '150',
            center: true,
            selector: row => toDateString(row.ngaySinh),
        },
        {
            name: 'Nơi sinh',
            minWidth: '150',
            center: true,
            selector: row => row.noiSinh,
        },
        {
            name: 'Trường ĐH',
            sortable: true,
            minWidth: '150px',
            selector: row => <>
                <span>{row.tenTruong}</span>
            </>
        },
        {
            name: 'Chuyên ngành ĐK',
            sortable: true,
            minWidth: '150px',
            selector: row => <>
                <span>{row.tenChuyennganh}</span>
            </>
        },
        {
            name: 'Tác vụ',
            allowOverflow: true,
            maxWidth: '15px',
            cell: (row) => {
                return (
                    <div className='d-flex'>
                        {ability.can('read', 'hoso') &&
                            <Link to={`/QLToChucThi/HoSoDK/ChiTietHoSo/${row.maHoso}`}>
                                <Eye size={17} style={{ cursor: 'pointer', marginRight: '10px', color: 'green' }} />
                            </Link>}
                        {ability.can('delete', 'hoso') &&
                            <Trash size={15} onClick={e => _handleXoaHS(row)} style={{ cursor: 'pointer', color: 'red' }} />}
                    </div>
                )
            }
        },

    ]
    // ** Function to handle modalThemHS toggle
    const fetchUser = () => {
        getListHoSoDangKi({
            page: currentPage,
            perPage
        }).then(res => {
            setData(res.result)
            setLoading(false)
        })
    }
    const fetchDataForExport = (callAPI) => {
        const data = callAPI().then(res => {
            return (res)
        })
        return data
    }

    const fetchData = async (callAPI, setData) => {
        callAPI({
            page: 1,
            perPage: 100
        }).then(res => {
            setData(res.result.data)
        }).catch(err => {
            return (
                <Alert color="danger">
                    Có lỗi khi gọi dữ liệu
                </Alert>
            )
        })
    }
    useEffect(() => {
        fetchUser()
        fetchData(getListDiaDiemToChucThi, setListDiadiem)
        fetchData(getListDiaChiDaoTao, setListdcdt)
        fetchData(getListTruongDaiHoc, setListTDH)
        fetchData(getListNganhDaiHoc, setListNganh)
        fetchData(getListLoaiHinhDaoTao, setListLHDT)
        fetchData(getListPhanLoaiTotNghiep, setListLTN)
        fetchData(getListChuyenNganh, setListCN)
        fetchData(getListChuyenNganhHep, setListCNH)
        fetchData(getListHinhThucUuTien, setListDTUT)
    }, [currentPage, perPage])
    // ** Function to handle filte
    const handleFilter = (e) => {
        if (e === 'Enter') {
            searchListHoSoDangKi({
                page: currentPage,
                perPage,
                hoTen: searchValue
            }).then(res => {
                setFilteredData(res.result)
            })
        }

    }
    const onImportFileClick = () => {
        // `current` points to the mounted file input element
        console.log(inputFile)

        inputFile.current.click()
    }
    const onImportFileZipClick = async () => {
        setModalImportImage(true)
        const datasource = await fetchDataForExport(getAllDanhSach)
        setDataSource(datasource.result.data)
        // `current` points to the mounted file input element
        // inputFileZip.current.click()
    }
    const handleImportFile = (e) => {
        const files = e.target.files[0]
        const MySwal = withReactContent(Swal)
        readXlsxFile(files).then((rows) => {
            // `rows` is an array of rows
            // each row being an array of cells.
            const temp = []
            rows.forEach((item, index) => {
                if (index > 0) {
                    temp.push(item)
                }
            })
            setListImport(temp)
            setModalImportHS(true)
        }).catch(error => {
            MySwal.fire({
                icon: "error",
                title: "Có lỗi xảy ra",
                text: "File không đúng định dạng, vui lòng chọn file định dạng excel và nhập đúng các cột",
                customClass: {
                    confirmButton: "btn btn-danger"
                }
            })
        })

    }
    const handleImportFileZip = async (e) => {

        // const files = e.target.files[0]

        // const formdata = new FormData()
        // formdata.append('files', files)
        // formdata.append('dbName', localStorage.getItem('dbName'))

        // const res = await uploadZip(formdata)
        // responseResultHelper(res, null, null, ACTION_METHOD_TYPE.UPLOADZIP)
    }
    const handleExportFileExcel = async () => {
        const res = await exportTruongDaiHoc()
    }
    const handleExportFileTemplate = async () => {
        const res = await exportTruongDaiHocTemplate()
    }
    const handleDanhSoBaoDanh = async () => {
        const res = await danhSoBaoDanh()
        responseResultHelper(res, null, fetchUser, ACTION_METHOD_TYPE.DANHSOBAODANH)
    }
    // ** Function to handle Pagination
    const handlePagination = page => {
        setCurrentPage(page)
    }
    const handlePerRowsChange = (perPage, page) => {
        setCurrentPage(page)
        setPerPage(perPage)
    }
    // ** Custom Pagination


    // ** Converts table to CSV

    const handleExportFileDocx = async (data) => {
        const request = await fetch("/../../template/truongdaihoc/dstruongdaihoc.docx")
        const templateFile = await request.blob()
        const handler = new TemplateHandler()
        const docx = await handler.process(templateFile, data)
        saveFile("dstruongdaihoc.docx", docx)
    }
    const handleExportFileDocxAllDanhSach = async () => {
        const datasource = await fetchDataForExport(getAllDanhSach)
        const list = {
            data: [],
            year: new Date().getFullYear(),
            chucVu_ngki: datathamso.chucVu_ngki,
            tenNgki: datathamso.tenNgki
        }
        datasource.result.data.map((e, index) => {
            list.data.push({
                ...e,
                ngaySinhCv: toDateString(e.ngaySinh),
                index: index + 1

            })
        })
        const request = await fetch("/../../template/hoso/danhsachthisinhdangkiduthi.docx")
        const templateFile = await request.blob()
        const handler = new TemplateHandler()
        const docx = await handler.process(templateFile, list)
        saveFile("danhsachthisinhdangkiduthi.docx", docx)
    }

    const handleExportFileDocxByDiaDiemToChucThi = async () => {
        const data = await fetchDataForExport(getByChuyenNganh)
        const request = await fetch("/../../template/hoso/soluongthisinhtheodiadiemtochucthi.docx")
        const templateFile = await request.blob()
        const handler = new TemplateHandler()
        const docx = await handler.process(templateFile, data.result.data)
        saveFile("soluongthisinhtheodiadiemtochucthi.docx", docx)
    }

    const handleExportFileDocxByChuyenNganhDT = async () => {
        const data = await fetchDataForExport(getByChuyenNganh)
        const request = await fetch("/../../template/hoso/soluongthisinhtheochuyennganhdt.docx")
        const templateFile = await request.blob()
        const handler = new TemplateHandler()
        const docx = await handler.process(templateFile, data.result.data)
        saveFile("soluongthisinhtheochuyennganhdt.docx", docx)
    }

    const handleExportFileDocxByDiaChiDT = async () => {
        const data = await fetchDataForExport(getByDiaChiDT)
        const request = await fetch("/../../template/hoso/soluongthisinhtheodiachidaotao.docx")
        const templateFile = await request.blob()
        const handler = new TemplateHandler()
        const docx = await handler.process(templateFile, data.result.data)
        saveFile("soluongthisinhtheodiachidaotao.docx", docx)
    }
    return (
        <Fragment>
            <input type='file' id='file' ref={inputFile} style={{ display: 'none' }} onChange={e => handleImportFile(e)} />
            <input type='file' id='file' ref={inputFileZip} style={{ display: 'none' }} multiple onChange={e => handleImportFileZip(e)} />

            <Card style={{ backgroundColor: 'white' }}>
                <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>

                    <CardTitle tag='h4'>Danh sách hồ sơ đăng ký</CardTitle>
                    <div className='d-flex mt-md-0 mt-1'>
                        <UncontrolledButtonDropdown>
                            <DropdownToggle color='secondary' caret outline>
                                <Share size={15} />
                                <span className='align-middle ms-50'>In hồ sơ</span>
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem className='w-100' onClick={() => handleExportFileDocxAllDanhSach(data)}>
                                    <FileText size={15} />
                                    <span className='align-middle ms-50'>In danh sách thí sinh</span>
                                </DropdownItem>
                                <DropdownItem className='w-100' onClick={() => handleExportFileDocxByDiaDiemToChucThi(data)}>
                                    <FileText size={15} />
                                    <span className='align-middle ms-50'>In danh sách thí sinh theo địa điểm tổ chức thi</span>
                                </DropdownItem>
                                <DropdownItem className='w-100' onClick={() => handleExportFileDocxByChuyenNganhDT(data)}>
                                    <FileText size={15} />
                                    <span className='align-middle ms-50'>Tổng hợp thí sinh dự thi theo chuyên ngành đào tạo</span>
                                </DropdownItem>
                                <DropdownItem className='w-100' onClick={() => handleExportFileDocxByDiaChiDT(data)}>
                                    <FileText size={15} />
                                    <span className='align-middle ms-50'>Tổng hợp thí sinh dự thi theo địa chỉ đào tạo</span>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledButtonDropdown>
                        <UncontrolledButtonDropdown style={{ marginLeft: '10px' }}>
                            <DropdownToggle color='secondary' caret outline>
                                <File size={15} />
                                <span className='align-middle ms-50'>Nhập hồ sơ</span>
                            </DropdownToggle>
                            <DropdownMenu>
                                {/* <DropdownItem className='w-100'>
                                        <Printer size={15} />
                                        <span className='align-middle ms-50 ' onClick={onImportFileClick}>Nhập từ file excel</span>
                                    </DropdownItem> */}
                                <DropdownItem className='w-100' onClick={onImportFileClick}>
                                    <span className='align-middle ms-50'  >Nhập danh sách từ file excel</span>
                                </DropdownItem>
                                <DropdownItem className='w-100' onClick={onImportFileZipClick}>
                                    <span className='align-middle ms-50'  >Tải ảnh thí sinh</span>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledButtonDropdown>
                        {/* <Button className='ms-2' color='success' onClick={() => handleDanhSoBaoDanh()}>
                                        <span className='align-middle ms-50'>Đánh số báo danh và chia phòng</span>
                                    </Button> */}
                        {ability.can('add', 'hoso') &&
                            <Button className='ms-2' color='primary' tag={Link} to='/QLToChucThi/HoSoDK/ThemHoSo'>
                                <Plus size={15} />
                                <span className='align-middle ms-50'>Thêm mới</span>
                            </Button>}
                    </div>

                </CardHeader>
                <Row className='justify-content-end mx-0'>
                    <Col className='d-flex align-items-center justify-content-end mt-1' md='6' sm='12' style={{ paddingRight: '20px' }}>
                        <Label className='me-1' for='search-input'>
                            Tìm kiếm
                        </Label>
                        <Input
                            className='dataTable-filter mb-50'
                            type='text'
                            bsSize='sm'
                            id='search-input'
                            value={searchValue}
                            placeholder='Nhập tại đây'
                            onChange={e => setSearchValue(e.target.value)}
                            onKeyDown={e => handleFilter(e.key)}
                        />
                    </Col>
                </Row>
                <div className='react-dataTable react-dataTable-selectable-rows' style={{ marginRight: '20px', marginLeft: '20px' }}>
                    {loading ? <WaitingModal /> : <DataTable
                        noHeader
                        striped
                        columns={columns}
                        className='react-dataTable'
                        data={filteredData?.data ? filteredData?.data : data?.data}
                        pagination
                        paginationServer
                        paginationTotalRows={filteredData?.data ? filteredData?.totalCount : data?.totalCount}
                        paginationComponentOptions={{
                            rowsPerPageText: 'Số hàng trên 1 trang:',
                            selectAllRowsItem: true,
                            selectAllRowsItemText: 'ALL',
                        }}
                        expandOnRowClicked
                        expandableRows
                        expandableRowsComponent={(row) => (
                            <Detail row={row} />
                        )}
                        paginationRowsPerPageOptions={[10, 20, 50, 100]}
                        onChangeRowsPerPage={handlePerRowsChange}
                        onChangePage={handlePagination}
                    />}
                </div>
            </Card>
            {
                <DeleteModal open={modalXoaHS} handleModal={handleModalXoaHS} fetchUser={fetchUser} infoEdit={info} />
            }
            {
                listImport && <ImportModal open={modalImportHS} fetchUser={fetchUser} handleModal={handleModalImportHS} listImport={listImport} listDiadiem={listDiadiem} listDcdt={listDcdt} listTDHda={listTDH} listNganhda={listNganh} listLHDT={listLHDT} listLTN={listLTN} listCN={listCN} listCNH={listCNH} listDTUT={listDTUT} loading={loading} setLoading={setLoading}></ImportModal>
            }

            <ImageModal open={modalImportImage} handleModal={handleModalImportImage} data={datasource}></ImageModal>
        </Fragment>
    )
}
const DeleteModal = React.lazy(() => import("./modal/DeleteModal"))
const ImportModal = React.lazy(() => import("./modal/ImportModal"))
const ImageModal = React.lazy(() => import("./modal/ImageModal"))


export default HoSoDK
