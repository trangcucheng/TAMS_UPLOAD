import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit"
import { PREFIX, typesWithPrefix } from "./config"
import { apiCall } from "../utility/utils/api"
import { API_URLS } from "../configs/api"

const _types = typesWithPrefix(PREFIX.ORGANZATION_ROLE_TYPE)
const types = {
    GET_LIST_ORGANIZATION_ROLE_TYPE: _types("GET_LIST_ORGANIZATION_ROLE_TYPE"),
    GET_ORGANIZATION_ROLE_TYPE_BY_ID: _types("GET_ORGANIZATION_ROLE_TYPE"),
    ADD_ORGANIZATION_ROLE_TYPE: _types("ADD_ORGANIZATION_ROLE_TYPE"),
    UPDATE_ORGANIZATION_ROLE_TYPE: _types("UPDATE_ORGANIZATION_ROLE_TYPE"),
    DELETE_ORGANIZATION_ROLE_TYPE: _types("DELETE_ORGANIZATION_ROLE_TYPE"),
}

const initialState = {
    data: [],
    curData: {},
    isLoading: false,
    meta: {
        total: 0,
        page: 1,
        limit: 10,
    },
}

export const thunkActions = {
    getListOrganizationRole: createAsyncThunk(
        types.GET_LIST_ORGANIZATION_ROLE_TYPE,
        async (params) => {
            const baseParams = {
                page: params.page,
                limit: params.limit,
                topicTypeID: params.topicTypeID
            }
            const api = API_URLS.ORGANIZATION_ROLE_TYPE_API.getOrganizationRole(baseParams)
            const { response, error } = await apiCall(api)
            return response.data
        }
    ),
    addOrganizationRole: createAsyncThunk(
        types.ADD_ORGANIZATION_ROLE_TYPE,
        async ({ payload, meta }) => {
            const api = API_URLS.ORGANIZATION_ROLE_TYPE_API.addOrganizationRole(payload)
            const { response, error } = await apiCall(api)
            if (!error && (response.status === 200 || response.status === 201)) {
                if (meta && meta.onSuccess) {
                    meta.onSuccess()
                    fulfillWithValue({ response })
                }
                return response
            } else {
                if (meta && meta.onError) meta.onError(error)
                rejectWithValue({ error })
                return []
            }
        }
    ),
    getListOrganizationRoleByID: createAsyncThunk(
        types.GET_ORGANIZATION_ROLE_TYPE_BY_ID,
        async (ID) => {
            const api = API_URLS.ORGANIZATION_ROLE_TYPE_API.getOrganizationRoleByID(ID)
            const { response, error } = await apiCall(api)
            return response.data
        }
    ),
    editOrganizationRole: createAsyncThunk(
        types.UPDATE_ORGANIZATION_ROLE_TYPE,
        async ({ payload, meta }) => {
            const api = API_URLS.ORGANIZATION_ROLE_TYPE_API.editOrganizationRole(payload)
            const { response, error } = await apiCall(api)
            if (!error && (response.status === 200 || response.status === 201)) {
                if (meta && meta.onSuccess) {
                    meta.onSuccess()
                    fulfillWithValue({ response })
                }
                return response
            } else {
                if (meta && meta.onError) meta.onError(error)
                rejectWithValue({ error })
                return []
            }
        }
    ),
    deleteOrganizationRole: createAsyncThunk(types.DELETE_ORGANIZATION_ROLE_TYPE, async ({ ID, meta }) => {
        const api = API_URLS.ORGANIZATION_ROLE_TYPE_API.deleteOrganizationRole(ID)
        const { response, error } = await apiCall(api)
        if (!error && (response.status === 200 || response.status === 201)) {
            if (meta && meta.onSuccess) {
                meta.onSuccess()
                fulfillWithValue({ response })
            }
            return response
        } else {
            if (meta && meta.onError) meta.onError(error)
            rejectWithValue({ error })
            return []
        }
    }),
}

export const PlanTrainingSlice = createSlice({
    name: "OrganizationRoleType",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(thunkActions.getListOrganizationRole.pending, (state) => {
                state.isLoading = true
            })
            .addCase(
                thunkActions.getListOrganizationRole.fulfilled,
                (state, { payload }) => {
                    const { data, page, limit, count } = payload
                    state.isLoading = false
                    state.data = data
                    state.meta.page = page
                    state.meta.limit = limit
                    state.meta.total = count
                }
            )
            .addCase(thunkActions.getListOrganizationRole.rejected, (state) => {
                state.isLoading = false
            })
            .addCase(thunkActions.addOrganizationRole.pending, (state) => {
                state.isLoading = true
            })
            .addCase(thunkActions.addOrganizationRole.fulfilled, (state, { payload }) => {
                state.isLoading = false
            })
            .addCase(thunkActions.addOrganizationRole.rejected, (state) => {
                state.isLoading = false
            })
            .addCase(thunkActions.getListOrganizationRoleByID.pending, (state) => {
                state.isLoading = true
            })
            .addCase(
                thunkActions.getListOrganizationRoleByID.fulfilled,
                (state, { payload }) => {
                    state.isLoading = false
                    state.curData = payload
                }
            )
            .addCase(thunkActions.getListOrganizationRoleByID.rejected, (state) => {
                state.isLoading = false
            })
            .addCase(thunkActions.editOrganizationRole.pending, (state) => {
                state.isLoading = true
            })
            .addCase(thunkActions.editOrganizationRole.fulfilled, (state, { payload }) => {
                state.isLoading = false
            })
            .addCase(thunkActions.editOrganizationRole.rejected, (state) => {
                state.isLoading = false
            })
            .addCase(thunkActions.deleteOrganizationRole.pending, (state) => {
                state.isLoading = true
            })
            .addCase(
                thunkActions.deleteOrganizationRole.fulfilled,
                (state, { payload }) => {
                    state.isLoading = false
                }
            )
            .addCase(thunkActions.deleteOrganizationRole.rejected, (state) => {
                state.isLoading = false
            })
    },
})

export const actions = { ...PlanTrainingSlice.actions, ...thunkActions }
export const { reducer } = PlanTrainingSlice
