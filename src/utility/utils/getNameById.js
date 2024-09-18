// lấy tên theo id
export default function findNameByIdInArray(id, dataList) {
    for (let i = 0; i < dataList.length; i++) {
        if (dataList[i].id === id) {
            return dataList[i].name
        }
    }
    return null
}