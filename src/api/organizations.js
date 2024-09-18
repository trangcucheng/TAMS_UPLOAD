import { API_PQ } from './API_PQ'

export const createOrganization = async (data) => {
    const uri = `/organization/create-organization`
    const res = await API_PQ.post(uri, data)
    return res
}

export const getDetailOrganization = async (data) => {
    const uri = `/organization/detail-organization`
    const res = await API_PQ.get(uri, data)
    return res
}

export const listAllOrganization = async (data) => {
    const uri = `/organization/list-all-organization`
    const res = await API_PQ.get(uri, data)
    return res
}

export const listAllOrganizationPC = async (data) => {
    const uri = `/organization/list-all-organization-pc`
    const res = await API_PQ.get(uri, data)
    return res
}

export const updateOrganization = async (data) => {
    const uri = `/organization/update-organization`
    const res = await API_PQ.put(uri, data)
    return res
}

export const deleteOrganization = async (data) => {
    const uri = `/organization/delete-organization?`
    const res = await API_PQ.delete(uri, data)
    return res
}

export const getDepartmentPC = async () => {
    const uri = `/organization/list-all-department-pc`
    const res = await API_PQ.get(uri)
    return res
}

export const getDepartmentLecturerPC = async () => {
    const uri = `/organization/list-all-department-lecturer-pc`
    const res = await API_PQ.get(uri)
    return res
}

export const getCountPeriodBySchoolYearID = async (data) => {
    const uri = `/organization/list-period-per-month`
    const res = await API_PQ.post(uri, data)
    return res
}

export const getCountChildrenByLevel = async (data) => {
    const uri = `/organization/count-children-by-level`
    const res = await API_PQ.get(uri, data)
    return res
}
export const getCountLecture = async (data) => {
    const uri = `/organization/count-lecture`
    const res = await API_PQ.get(uri, data)
    return res
}

export const getCountScienceResearch = async (data) => {
    const uri = `/organization/count-science-research`
    const res = await API_PQ.get(uri, data)
    return res
}

export const listAllOrgLecturerStaffPC = async (data) => {
    const uri = `/organization/list-all-department-lecturer-staff-pc`
    const res = await API_PQ.get(uri, data)
    return res
}

export const listAllOrganizationDepartment = async (data) => {
    const uri = `/organization/list-all-organization-department`
    const res = await API_PQ.get(uri, data)
    return res
}