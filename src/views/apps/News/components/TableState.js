import React, { useEffect, useState } from 'react'
import { Table, Tag } from 'antd'
import toast from 'react-hot-toast'
const columns = ({ handleConfirmDelete }) => [
    {
        title: "STT",
        width: 30,
        align: "center",
        render: (value, record, index) => index + 1,
    },
   
    {
        title: "Trạng thái",
        dataIndex: "description",
        align: "center",
        render: (value, record) => {
            const state = record?.state
            const nameState = record?.description
            let color = ""
            switch (state) {
              case "pending":
                color = "warning"
                break
              case "approved":
                color = "success"
                break
              case "cancel":
                color = "error"
                break
              default:
                color = "default"
            }
            return <Tag color={color}>{nameState}</Tag>
          },
    },
    {
        title: "Key",
        dataIndex: "state",
        align: "center"
    },
]

function TableState({ data, tableParams, handleTableChange }) {
    const [stateNewsList, setStateNewsList] = useState([])

    const handleConfirmDelete = (recordId) => {
        deleteTopic(recordId).then((res) => {
            const updateData = stateNewsList.filter(item => item.id !== recordId)
            setStateNewsList(updateData)
            toast.success("Xoá chủ đề thành công")
        }).catch(err => {
            console.log(err)
            toast.error("Xoá chủ đề thất bại")
        })

    }
    useEffect(() => {
        setStateNewsList(data)
    }, [data])
    return (
        <div>
            <Table
                columns={columns({ handleConfirmDelete })}
                dataSource={stateNewsList}
                bordered
                pagination={tableParams.pagination}
                onChange={handleTableChange}
            />
        </div>
    )
}

export default TableState