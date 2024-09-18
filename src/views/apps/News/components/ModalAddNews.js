import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Select, Row, Col } from 'antd'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import { X } from "react-feather"
import { createNews, topicList, updateNews } from '../../../../api/dashboardNews'
import toast from 'react-hot-toast'
import { getInfoUserCurrent } from '../../updateLevel/utils/dataHelper'

function ModalAddNews({ openModal, handleModal, getNewData, curData, isEdit }) {
    const [topicNewsList, setTopicNewList] = useState([])
    const CloseBtn = (
        <X className="cursor-pointer" size={15} onClick={handleModal} />
    )
    
    const onFinish = (values) => {
        if (isEdit === true) {
            updateNews(
                {
                    id: curData?.id,
                    newsTitle: values.newsTitle,
                    newsTypeID: Number(values.newsTypeID),
                    newsContent: values.newsContent,
                    image: values.image,
                    description: values.description
                }
            ).then(res => {
                getNewData(res)
                toast.success("Sửa tin tức thành công")
            }).catch(err => {
                toast.error("Sửa tin tức thất bại")
            })

        } else {
            createNews(
                {
                    newsTitle: values.newsTitle,
                    newsTypeID: Number(values.newsTypeID),
                    newsContent: values.newsContent,
                    newsStateID: 1, // Chờ phê duyệt
                    newsLink: "#",
                    userUpload: JSON.parse(getInfoUserCurrent())?.fullName,
                    image: values.image,
                    description: values.description
                }
            ).then(res => {
                getNewData(res)
                toast.success("Thêm tin tức mới thành công")
            }).catch(err => {
                toast.error("Thêm tin tức mới thất bại")
            })
        }
        handleModal()
    }

    const getTopicList = () => {
        topicList({
            params: {
                page: 1,
                limit: 200,
            }
        }).then(res => {
            setTopicNewList(res.data)
        })
    }
    useEffect(() => {
        getTopicList()
    }, [])

    return (
        <Modal
            isOpen={openModal}
            toggle={handleModal}
            contentClassName="pt-0"
            autoFocus={false}
            className="modal-lg"
        >
            <ModalHeader toggle={handleModal} close={CloseBtn}>
                {isEdit === true ? "Sửa tin tức" : "Thêm tin tức mới"}
            </ModalHeader>
            <ModalBody>
                <Form
                    onFinish={onFinish}
                    layout="vertical"
                    initialValues={
                        {
                            newsTitle: curData?.newsTitle,
                            newsTypeID: curData?.newsType?.id,
                            image: curData?.image,
                            newsContent: curData?.newsContent,
                            description: curData?.description
                        }
                    }
                >
                    <Row gutter={15}>
                        <Col span={24}>
                            <Form.Item
                                style={{ marginBottom: "4px" }}
                                label={
                                    <div>
                                        Tiêu đề
                                        <span className="redColor">(*)</span>
                                    </div>
                                }
                                name="newsTitle"
                                rules={[
                                    {
                                        required: true,
                                        message: "Nhập tiêu đề",
                                    },
                                ]}
                            >
                                <Input placeholder='Tiêu đề' />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                style={{ marginBottom: "4px" }}
                                label={
                                    <div>
                                        Chủ đề
                                        <span className="redColor">(*)</span>
                                    </div>
                                }
                                name="newsTypeID"
                                rules={[
                                    {
                                        required: true,
                                        message: "Nhập chủ đề",
                                    },
                                ]}
                            >
                                <Select placeholder='Chủ đề'
                                    options={topicNewsList.map(item => {
                                        return {
                                            value: item?.id,
                                            label: item?.newsType
                                        }
                                    })}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                style={{ marginBottom: "4px" }}
                                label={
                                    <div>
                                        Ảnh nhỏ
                                        <span className="redColor">(*)</span>
                                    </div>
                                }
                                name="image"
                                rules={[
                                    {
                                        required: true,
                                        message: "Nhập đường dẫn ảnh nhỏ",
                                    },
                                ]}
                            >
                                <Input placeholder='Đường dẫn ảnh nhỏ' />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                style={{ marginBottom: "4px" }}
                                label={
                                    <div>
                                        Nội dung
                                        <span className="redColor">(*)</span>
                                    </div>
                                }
                                name="newsContent"
                                rules={[
                                    {
                                        required: true,
                                        message: "Nhập Nội dung",
                                    },
                                ]}
                            >
                                <Input.TextArea placeholder='Nội dung' rows={6} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                style={{ marginBottom: "4px" }}
                                label="Mô tả"
                                name="description"
                            >
                                <Input.TextArea placeholder='Mô tả' rows={4} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item>
                                <div
                                    style={{
                                        marginTop: "10px",
                                        display: "flex",
                                        justifyContent: "end",
                                        width: "100%",
                                    }}
                                    center
                                >
                                    <Button type="primary" htmlType="submit">{isEdit === true ? "Lưu" : "Thêm"}</Button>
                                    &nbsp;
                                    <Button
                                        style={{
                                            width: "80px",
                                            borderRadius: "5px",
                                            marginLeft: "10px",
                                        }}
                                        onClick={handleModal}
                                    >
                                        Hủy
                                    </Button>
                                    &nbsp;
                                </div>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </ModalBody>
        </Modal>
    )
}

export default ModalAddNews