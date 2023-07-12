import React, { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import DataTable from 'shared/components/DataTable'
import { appendParams, parseParams } from 'shared/utils'
import TopBar from 'shared/components/TopBar'
import { addUser, changeUserStatus, getUserById, getUserList, updateUser } from 'query/user/user.query'
import CustomModal from 'shared/components/Modal'
import { toaster } from 'helper/helper'
import { adminTableColumns } from 'shared/constants/TableHeaders'
import { Controller, useForm } from 'react-hook-form'
import UserRow from 'shared/components/UserRow'
import { Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap'
import CommonInput from 'shared/components/CommonInput'
import { validationErrors } from 'shared/constants/ValidationErrors'
import Left from 'assets/images/icons/Left'
import Select from 'react-select'

export default function UserManagement() {
  const location = useLocation()
  const parsedData = parseParams(location.search)
  const params = useRef(parseParams(location.search))
  const query = useQueryClient()

  function getRequestParams(e) {
    const data = e ? parseParams(e) : params.current
    return {
      pageNumber: +data?.pageNumber || 1,
      search: data?.search || '',
      size: data?.size || 10,
      eStatus: data.eStatus || '',
      sort: data.sort || '',
      orderBy: +data.orderBy === 1 ? 'ASC' : 'DESC'
    }
  }

  function getSortedColumns(adminTableColumns, urlData) {
    return adminTableColumns?.map((column) => (column.internalName === urlData?.sort ? { ...column, type: +urlData?.orderBy } : column))
  }

  const [requestParams, setRequestParams] = useState(getRequestParams())
  const [columns, setColumns] = useState(getSortedColumns(adminTableColumns, parsedData))
  const [userList, setUserList] = useState()
  const [editId, setEditId] = useState()
  const [showAddEdit, setShowAddEdit] = useState(false)
  const [formType, setFormType] = useState()

  async function handleHeaderEvent(name, value) {
    switch (name) {
      case 'rows':
        setRequestParams({
          ...requestParams,
          size: Number(value),
          pageNumber: 1
        })
        appendParams({ size: Number(value), pageNumber: 1 })
        break
      case 'search':
        setRequestParams({ ...requestParams, search: value, pageNumber: 1 })
        appendParams({ pageNumber: 1 })
        break
      default:
        break
    }
  }

  function handlePageEvent(page) {
    setRequestParams({ ...requestParams, pageNumber: page })
    appendParams({ pageNumber: page })
  }

  function handleSort(field) {
    let selectedFilter
    const filter = columns.map((data) => {
      if (data.internalName === field.internalName) {
        data.type = +data.type === 1 ? -1 : 1
        selectedFilter = data
      } else {
        data.type = 1
      }
      return data
    })
    setColumns(filter)
    const params = {
      ...requestParams,
      page: 0,
      sort: selectedFilter?.internalName,
      orderBy: selectedFilter.type === 1 ? 'ASC' : 'DESC'
    }
    setRequestParams(params)
    appendParams({
      sort: selectedFilter.type !== 0 ? selectedFilter.internalName : '',
      orderBy: selectedFilter.type
    })
  }

  // List
  const { isLoading, isFetching } = useQuery(['userListKey', requestParams], () => getUserList(requestParams), {
    select: (data) => data.data.data,
    onSuccess: (response) => {
      setUserList(response)
    }
  })

  // Status
  const {
    mutate: statusMutation,
    isLoading: statusLoading,
    status: updateStatus
  } = useMutation(changeUserStatus, {
    onSuccess: (response) => {
      toaster(response?.data?.message)
      query.invalidateQueries('userListKey')
    }
  })

  const handleStatusUpdateUser = (id, status) => {
    statusMutation({ id, eStatus: status ? 'Y' : 'N' })
  }

  const { isFetching: fetchingUserById } = useQuery('getUserById', () => getUserById(editId), {
    enabled: !!editId,
    select: (data) => data?.data?.data,
    onSuccess: (data) => {
      reset({
        sUsername: data?.sUsername,
        sMobile: data?.sMobile,
        sFirstName: data?.sFirstName,
        sLastName: data?.sLastName,
        eGender: { value: data?.eGender, name: data?.eGender }
      })
    }
  })

  useEffect(() => {
    document.title = 'Admin Management'
  }, [])

  const { mutate: addUserMutate, isLoading: creatingUser } = useMutation(addUser, {
    onSuccess: (data) => {
      query.invalidateQueries('userListKey')
      setShowAddEdit(!showAddEdit)
      reset({
        sUsername: null,
        sMobile: null,
        sFirstName: null,
        sLastName: null,
        eGender: null
      })
    }
  })

  const { mutate: updateUserMutate } = useMutation(updateUser, {
    onSuccess: () => {
      query.invalidateQueries('userListKey')
      setShowAddEdit(!showAddEdit)
      reset({
        sUsername: null,
        sMobile: null,
        sFirstName: null,
        sLastName: null,
        eGender: null
      })
    }
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, dirtyFields },
    reset,
    watch,
    control
  } = useForm({ mode: 'all' })

  function handleAddEditUser(type, id) {
    if (type === 'Add') {
      setFormType('Add')
      setShowAddEdit(!showAddEdit)
    } else {
      query.invalidateQueries('getUserById')
      setFormType('Edit')
      setEditId(id)
      setShowAddEdit(!showAddEdit)
    }
  }

  const handleCloseAddEdit = () => {
    setShowAddEdit(false)
    setEditId()
    reset({
      sUsername: null,
      sMobile: null,
      sFirstName: null,
      sLastName: null,
      eGender: null
    })
  }

  const onSubmit = (data) => {
    if (showAddEdit) {
      if (formType === 'Add') {
        data.eGender = data?.eGender?.value
        addUserMutate({ data })
      } else {
        data.eGender = data?.eGender?.value
        updateUserMutate({ editId, data })
      }
    }
  }

  const avatarData = [
    'https://cdn-icons-png.flaticon.com/512/4333/4333609.png',
    'https://cdn-icons-png.flaticon.com/128/11287/11287445.png',
    'https://cdn-icons-png.flaticon.com/128/11257/11257977.png',
    'https://cdn-icons-png.flaticon.com/128/11289/11289917.png',
    'https://cdn-icons-png.flaticon.com/128/145/145843.png',
    'https://cdn-icons-png.flaticon.com/128/924/924874.png',
    'https://cdn-icons-png.flaticon.com/512/4333/4333609.png',
    'https://cdn-icons-png.flaticon.com/128/11287/11287445.png',
    'https://cdn-icons-png.flaticon.com/128/11257/11257977.png',
    'https://cdn-icons-png.flaticon.com/128/11289/11289917.png'
  ]
  const [selectedAvatar, setSelectedAvatar] = useState()
  console.log(selectedAvatar)
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrevious = () => {
    const newIndex = currentIndex === 0 ? avatarData.length - 1 : currentIndex - 1
    setSelectedAvatar(avatarData[newIndex])
    setCurrentIndex(newIndex)
  }

  const handleNext = () => {
    const newIndex = currentIndex === avatarData.length - 1 ? 0 : currentIndex + 1
    setSelectedAvatar(avatarData[newIndex])
    setCurrentIndex(newIndex)
  }

  const handleAvatarClick = (avatarPath, index) => {
    setSelectedAvatar(avatarPath)
    setCurrentIndex(index)
  }

  const visibleAvatars = avatarData.slice(currentIndex, currentIndex + 1)
  const adjustedIndex = currentIndex % avatarData.length

  const genderObj = [
    {
      name: 'Male',
      value: 'Male'
    },
    {
      name: 'Female',
      value: 'Female'
    },
    {
      name: 'Unspecified',
      value: 'Unspecified'
    }
  ]

  return (
    <>
      <TopBar
        buttons={[
          {
            text: 'Create User',
            icon: 'icon-add',
            type: 'primary'
          }
        ]}
        btnEvent={() => handleAddEditUser('Add')}
      />
      <div>
        <DataTable
          columns={columns}
          header={{
            left: {
              rows: true
            },
            right: {
              search: true
            }
          }}
          sortEvent={handleSort}
          headerEvent={(name, value) => handleHeaderEvent(name, value)}
          totalRecord={userList?.count || 0}
          pageChangeEvent={handlePageEvent}
          isLoading={isLoading || isFetching}
          pagination={{
            currentPage: requestParams.pageNumber,
            pageSize: requestParams.size
          }}
        >
          {userList?.user?.map((user, index) => {
            return <UserRow key={user._id} index={index} user={user} onStatusChange={handleStatusUpdateUser} onEdit={handleAddEditUser} />
          })}
        </DataTable>
        <CustomModal
          open={showAddEdit}
          handleClose={handleCloseAddEdit}
          disableHeader
          disableFooter
          bodyTitle={`${formType === 'Add' ? 'Add' : 'Edit'} User`}
        >
          {fetchingUserById ? (
            <Spinner variant="warning" />
          ) : (
            <>
              <div className="avatar-selector">
                <button onClick={handlePrevious} className="avatar-pre">
                  <Left svgClass="left" />
                </button>
                <div className="avatar-container">
                  <div className="avatar-wrapper">
                    {visibleAvatars.map((avatarPath, index) => (
                      <img
                        key={index}
                        src={avatarPath}
                        alt={`Avatar ${adjustedIndex + index + 1}`}
                        onClick={() => handleAvatarClick(avatarPath, adjustedIndex + index)}
                        className={`avatar-image ${selectedAvatar === avatarPath ? 'selected' : ''}`}
                      />
                    ))}
                  </div>
                </div>
                <button onClick={handleNext} className="avatar-pre">
                  <Left svgClass="right" />
                </button>
              </div>

              <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                <CommonInput
                  type="text"
                  name="sUsername"
                  label="Username"
                  placeholder="Add Username"
                  className={`form-control ${errors?.sUsername && 'error'}`}
                  required
                  register={register}
                  errors={errors}
                  // isLoading={viewLoading || viewFetching}
                  validation={{
                    maxLength: {
                      value: 20,
                      message: validationErrors.rangeLength(2, 20)
                    },
                    minLength: {
                      value: 2,
                      message: validationErrors.rangeLength(2, 20)
                    },
                    required: {
                      value: true,
                      message: validationErrors?.required
                    },
                    pattern: {
                      value: /^\S*$/,
                      message: 'Space is not allowed'
                    }
                  }}
                />
                <Row>
                  <Col>
                    <CommonInput
                      type="text"
                      name="sFirstName"
                      label="First Name"
                      placeholder="Add First Name"
                      className={`form-control ${errors?.sFirstName && 'error'}`}
                      required
                      register={register}
                      errors={errors}
                      // isLoading={viewLoading || viewFetching}
                      validation={{
                        maxLength: {
                          value: 20,
                          message: validationErrors.rangeLength(2, 20)
                        },
                        minLength: {
                          value: 2,
                          message: validationErrors.rangeLength(2, 20)
                        },
                        required: {
                          value: true,
                          message: validationErrors?.required
                        },
                        pattern: {
                          value: /^\S*$/,
                          message: 'Space is not allowed'
                        }
                      }}
                    />
                  </Col>
                  <Col>
                    <CommonInput
                      type="text"
                      name="sLastName"
                      label="Last Name"
                      placeholder="Add Last Name"
                      className={`form-control ${errors?.sLastName && 'error'}`}
                      required
                      register={register}
                      errors={errors}
                      // isLoading={viewLoading || viewFetching}
                      validation={{
                        maxLength: {
                          value: 20,
                          message: validationErrors.rangeLength(2, 20)
                        },
                        minLength: {
                          value: 2,
                          message: validationErrors.rangeLength(2, 20)
                        },
                        required: {
                          value: true,
                          message: validationErrors?.required
                        },
                        pattern: {
                          value: /^\S*$/,
                          message: 'Space is not allowed'
                        }
                      }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <CommonInput
                      type="text"
                      name="sMobile"
                      label="Mobile Number"
                      placeholder="Enter Mobile Number"
                      className={`form-control ${errors?.sMobile && 'error'}`}
                      required
                      register={register}
                      errors={errors}
                      // isLoading={viewLoading || viewFetching}
                      validation={{
                        pattern: {
                          value: /^\+?[6-9][0-9]{9,9}$/,
                          message: 'Only numbers are allowed'
                        },
                        required: {
                          value: true,
                          message: validationErrors?.required
                        }
                      }}
                      min={0}
                      max={9999999999}
                      maxLength="10"
                      onChange={(e) => {
                        e.target.value = e.target.value.replace(/\D+/g, '')
                      }}
                    />
                  </Col>
                  <Col>
                    <Form.Group className="form-group">
                      <Form.Label>
                        <span>Gender</span>
                      </Form.Label>
                      <Controller
                        name="eGender"
                        control={control}
                        rules={{
                          required: {
                            value: true,
                            message: 'This field is required'
                          }
                        }}
                        render={({ field: { onChange, value, ref } }) => (
                          <Select
                            ref={ref}
                            placeholder="Select Gender"
                            options={genderObj}
                            getOptionLabel={(option) => option?.name}
                            getOptionValue={(option) => option?.value}
                            className={`react-select border-0 ${errors.eGender && 'error'}`}
                            classNamePrefix="select"
                            isSearchable
                            isClearable
                            value={value}
                            onChange={(data) => {
                              onChange(data)
                            }}
                          />
                        )}
                      />
                      {errors.eGender && <Form.Control.Feedback type="invalid">{errors.eGender.message}</Form.Control.Feedback>}
                    </Form.Group>
                  </Col>
                </Row>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      handleCloseAddEdit()
                    }}
                    disabled={creatingUser}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={
                      // !isDirty || editLoading || viewFetching || viewLoading
                      creatingUser
                    }
                  >
                    {formType === 'Add' ? 'Add' : 'Update'}
                    {creatingUser && <Spinner animation="border" size="sm" />}
                  </Button>
                </Modal.Footer>
              </Form>
            </>
          )}
        </CustomModal>
      </div>
    </>
  )
}
