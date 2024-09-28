// ** React Imports
import { useState, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'

// ** Reactstrap Imports
import { Card, Modal, Row, Col, CardHeader, CardTitle, CardBody, Button, ListGroup, ListGroupItem, ModalHeader, ModalBody } from 'reactstrap'


// ** Third Party Imports
import { useDropzone } from 'react-dropzone'
import { FileText, X, DownloadCloud } from 'react-feather'
import { setListDataImport } from '../../../apps/ecommerce/store'
// import { uploadZip } from '../../../../api/hoSoDangKi'
// import responseResultHelper from '../../../utils/reponsive'
// import { ACTION_METHOD_TYPE } from '../../../utils/constant'

const PreviewModal = ({ open, handleModal, data, listImport, files, setFiles, getData }) => {
  // ** State
  const handleClose = () => {
    handleModal()
    // setFiles([])
  }
  const CloseBtn = <X className='cursor-pointer' size={15} onClick={e => handleClose()} />

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => {
      setFiles([...files, ...acceptedFiles])
    }
  })

  const renderFilePreview = file => {
    if (file.type.startsWith('image')) {
      return <img className='rounded' alt={file.name} src={URL.createObjectURL(file)} height='100px' width='100%' />
    } else {
      return <FileText size='28' />
    }
  }

  const handleRemoveFile = file => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter(i => i.name !== file.name)
    setFiles([...filtered])
  }

  const renderFileSize = size => {
    if (Math.round(size / 100) / 10 > 1000) {
      return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`
    } else {
      return `${(Math.round(size / 100) / 10).toFixed(1)} kb`
    }
  }
  const listThieuFile = listImport
    ?.filter(e => !files.find(file => file.name === e[11])) // Filter missing files
    .map((e, index) => (
      <span key={index} style={{ color: 'red' }}>
        {e[11]}
        {index < listImport.length - 1 ? ', ' : ''} {/* Add comma if it's not the last file */}
      </span>
    ))


  const fileList = files.map((file, index) => (
    <Col md='2' sm='6'>
      <ListGroupItem key={`${file.name}-${index}`} className='d-flex align-items-start justify-content-between'>
        <div className='file-details d-flex align-items-center'>
          <div className='file-preview me-1'>{renderFilePreview(file)}</div>
          <div>
            <p className='file-name mb-0' style={{ marginRight: "0.2rem" }}>{file.name}</p>
          </div>
        </div>
        <Button color='danger' outline size='sm' className='btn-icon' onClick={() => handleRemoveFile(file)}>
          <X size={14} />
        </Button>
      </ListGroupItem>
    </Col>
  ))

  const handleRemoveAllFiles = () => {
    setFiles([])
  }
  const handleUpFiles = async () => {
    const formdata = new FormData()
    for (let i = 0; i < files.length; i++) {
      formdata.append("files", files[i])
    }
    // formdata.append('dbName', localStorage.getItem('dbName'))
    // const res = await uploadZip(formdata)
    // setFiles([])
    // dispatch(setListDataImport([]))
    // responseResultHelper(res, handleModal, null, ACTION_METHOD_TYPE.UPLOADZIP)
    getData()
  }
  return (
    <Modal
      isOpen={open}
      toggle={handleModal}
      className='modal-xl'

    >
      <ModalHeader className='mb-1' toggle={handleModal} tag='div'>
        <h5 className='modal-title'>Tải tài liệu</h5>
      </ModalHeader>
      <ModalBody className='flex-grow-1'>
        <Card>
          <CardBody>
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <div className='d-flex align-items-center justify-content-center flex-column'>
                <DownloadCloud size={64} />
                <h5>Thả file vào đây hoặc click để tải ảnh từ máy tính</h5>
                <p className='text-secondary'>
                  Drop files here or click{' '}
                  <a href='/' onClick={e => e.preventDefault()}>
                    browse
                  </a>{' '}
                  thorough your machine
                </p>
              </div>
            </div>
            {files.length ? (
              <Fragment>
                {
                  listThieuFile && <span>Thiếu file của các tài liệu: {listThieuFile}</span>
                }
                <ListGroup className='my-2' style={{ height: '500px', overflowX: 'hidden', overflowY: 'auto' }}>
                  <span className="mb-1">Danh sách tài liệu được tải lên:</span>
                  <Row>
                    {fileList}
                  </Row>

                </ListGroup>
                <div className='d-flex justify-content-end'>
                  {/* <Button className='me-1' color='danger' outline onClick={handleRemoveAllFiles}>
                    Xóa tất cả
                  </Button> */}
                  {/* <Button color='primary' onClick={handleUpFiles}>Lưu </Button> */}
                  <Button color='primary' onClick={handleModal}>Xác nhận </Button>
                </div>
              </Fragment>
            ) : null}
          </CardBody>
        </Card>
      </ModalBody>
    </Modal>

  )
}

export default PreviewModal
