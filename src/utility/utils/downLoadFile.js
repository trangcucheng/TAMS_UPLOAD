import { notification } from "antd"
export function saveFile(filename, blob) {
  const blobUrl = URL.createObjectURL(blob)
  let link = document.createElement("a")
  link.download = filename
  link.href = blobUrl
  document.body.appendChild(link)
  link.click()
  setTimeout(() => {
    link.remove()
    window.URL.revokeObjectURL(blobUrl)
    link = null
  }, 0)
}

export const b64toBlob = async (b64Data, contentType = 'image/png') => {
  try {
    const fileUrl = `data:image/jpg;base64,${b64Data}`
    const response = await fetch(fileUrl)
    return response.blob()
  } catch (err) {
    console.log(err)
  }
}

export function downloadFile(id, fileName, api) {
  const url = process.env.REACT_APP_API_URL
  fetch(`${url}api/v1/${api}/${id}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${window.localStorage["accessToken"]}` },
    }).then(response => response.blob()).then(response => {
      const url = window.URL.createObjectURL(new Blob([response]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
    })
}

export function downloadFileWithUrl(path, fileName) {
  const url = process.env.REACT_APP_API_URL
  fetch(`${url}api/v1/${path}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${window.localStorage["accessToken"]}` },
    }).then(response => response.blob()).then(response => {
      const url = window.URL.createObjectURL(new Blob([response]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
    })
}
export function downloadFile2(id, fileName, api) {
  const url = process.env.REACT_APP_API_URL

  try {
    fetch(`${url}api/v1/${api}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${window.localStorage["accessToken"]}` },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.blob()
      })
      .then(response => {
        notification.success({ message: "Tải file thành công!" })
        const blobUrl = window.URL.createObjectURL(new Blob([response]))
        const link = document.createElement('a')
        link.href = blobUrl
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        link.remove()

      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error)
        notification.error({ message: "Có lỗi xảy ra!" })
      })
  } catch (error) {
    console.error('Error:', error)
  }
}
