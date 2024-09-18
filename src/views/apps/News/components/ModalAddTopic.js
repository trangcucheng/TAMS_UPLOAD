import React from 'react'
import { Form, Input, Button, Select, Row, Col } from 'antd'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import { X } from "react-feather"
import { createTopic, updateTopic } from '../../../../api/dashboardNews'
import toast from 'react-hot-toast'

function ModalAddTopic({ openModal, handleModal, getNewData, isEdit, curData }) {
    const CloseBtn = (
        <X className="cursor-pointer" size={15} onClick={handleModal} />
    )
    const onFinish = (values) => {
        if (isEdit === true) {
            updateTopic(
                {
                    id: curData?.id,
                    newsType: values.newsType,
                    color: values.color,
                    description: values.description
                }
            ).then(res => {
                getNewData(res)
                toast.success("Sửa chủ đề thành công")
            }).catch(err => {
                toast.error("Sửa chủ đề thất bại")
            })
        } else {
            createTopic(
                {
                    newsType: values.newsType,
                    color: values.color,
                    description: values.description
                }
            ).then(res => {
                getNewData(res)
                toast.success("Thêm chủ đề mới thành công")
            }).catch(err => {
                toast.error("Thêm chủ đề mới thất bại")
            })
        }
        handleModal()
    }
    
    return (
        <Modal
            isOpen={openModal}
            toggle={handleModal}
            contentClassName="pt-0"
            autoFocus={false}
            className="modal-m"
        >
            <ModalHeader toggle={handleModal} close={CloseBtn}>
                Thêm chủ đề tin tức
            </ModalHeader>
            <ModalBody>
                <Form
                    onFinish={onFinish}
                    layout="vertical"
                    initialValues={
                        {
                            newsType: curData?.newsType,
                            color: curData?.color,
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
                                        Tên chủ đề
                                        <span className="redColor">(*)</span>
                                    </div>
                                }
                                name="newsType"
                                rules={[
                                    {
                                        required: true,
                                        message: "Nhập tên chủ đề",
                                    },
                                ]}
                            >
                                <Input placeholder='Tên chủ đề' />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                style={{ marginBottom: "4px" }}
                                label={
                                    <div>
                                        Màu sắc
                                        <span className="redColor">(*)</span>
                                    </div>
                                }
                                name="color"
                                rules={[
                                    {
                                        required: true,
                                        message: "Nhập màu sắc",
                                    },
                                ]}
                            >
                                <Input placeholder='Màu sắc' />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                style={{ marginBottom: "4px" }}
                                label="Mô tả"
                                name="description"
                            >
                                <Input.TextArea placeholder='Mô tả' />
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

export default ModalAddTopic