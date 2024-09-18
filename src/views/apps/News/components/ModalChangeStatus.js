import React, { useState } from 'react'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import { Form, Button, Select, Row, Col } from 'antd'
import { X } from "react-feather"
import toast from 'react-hot-toast'
import { updateNews } from '../../../../api/dashboardNews'

function ModalChangeStatus({ openModal, handleModal, getNewData, curData }) {
    const [statusList, setStatusList] = useState([
        // {
        //     id: 1,
        //     state: "pending",
        //     description: "Chờ phê duyệt"
        // },
        {
            id: 2,
            state: "aprroved",
            description: "Duyệt tin tức"
        },
        {
            id: 3,
            state: "cancel",
            description: "Từ chối tin tức"
        },
        {
            id: 4,
            state: "recall",
            description: "Thu hồi tin tức"
        }
    ])
    const getStatusById = (id) => {
        return statusList.find(item => item.id === id)
    }
    const CloseBtn = (
        <X className="cursor-pointer" size={15} onClick={handleModal} />
    )
    // console.log(curData)
    const onFinish = (values) => {
        updateNews({
            id: curData?.id,
            newsStateID: values?.status
        }).then(res => {
            // console.log(res)
            getNewData(res)
            toast.success("Chuyển trạng thái thành công")
        }).catch(err => {
            toast.error("Chuyển trạng thái thất bại")
        })
        handleModal()
    }
    return (
        <Modal
            isOpen={openModal}
            toggle={handleModal}
            contentClassName="pt-0"
            autoFocus={false}
            className="modal-md"
        >
            <ModalHeader toggle={handleModal} close={CloseBtn}>
                Chuyển trạng thái
            </ModalHeader>
            <ModalBody>
                <Form
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Row gutter={15}>
                        <Col span={24}>
                            <Form.Item
                                style={{ marginBottom: "4px" }}
                                label={
                                    <div>
                                        Trạng thái
                                        <span className="redColor">(*)</span>
                                    </div>
                                }
                                name="status"
                                rules={[
                                    {
                                        required: true,
                                        message: "Chọn trạng thái",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Trạng thái"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                    filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                    }
                                    options={statusList.map(item => {
                                        return {
                                            value: item?.id,
                                            label: item?.description
                                        }
                                    })}
                                />
                            </Form.Item>
                        </Col>
                        <div
                            style={{
                                marginTop: "10px",
                                display: "flex",
                                justifyContent: "end",
                                width: "100%",
                            }}
                            center
                        >
                            <Button type="primary" htmlType="submit">Chuyển</Button>
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
                    </Row>
                </Form>
            </ModalBody>
        </Modal>
    )
}

export default ModalChangeStatus