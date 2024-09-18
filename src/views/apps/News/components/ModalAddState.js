import React from 'react'
import { Form, Input, Button, Select, Row, Col } from 'antd'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import { X } from "react-feather"
import { createTopic } from '../../../../api/dashboardNews'
import toast from 'react-hot-toast'
import { getInfoUserCurrent } from '../../updateLevel/utils/dataHelper'

function ModalAddState({ openModal, handleModal, getNewData }) {
    const CloseBtn = (
        <X className="cursor-pointer" size={15} onClick={handleModal} />
    )
    const onFinish = (values) => {
        // createTopic(
        //     {
        //         newsType: values.newsType,
        //         color: values.newsType,
        //         description: values.newsType
        //     }
        // ).then(res => {
        //     getNewData(res)
        //     toast.success("Thêm chủ đề mới thành công")
        // }).catch(err => {
        //     toast.error("Thêm chủ đề mới thất bại")
        // })
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
                Thêm trạng thái tin tức
            </ModalHeader>
            <ModalBody>
                <Form onFinish={onFinish} layout="vertical">
                    <Row gutter={15}>
                        <Col span={24}>
                            <Form.Item
                                style={{ marginBottom: "4px" }}
                                label={
                                    <div>
                                        Từ khóa trạng thái
                                        <span className="redColor">(*)</span>
                                    </div>
                                }
                                name="state"
                                rules={[
                                    {
                                        required: true,
                                        message: "Nhập từ khóa trạng thái",
                                    },
                                ]}
                            >
                                <Input placeholder='ví dụ: pending' />
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
                                    <Button type="primary" htmlType="submit">Thêm</Button>
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

export default ModalAddState