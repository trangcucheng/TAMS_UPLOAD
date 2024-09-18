import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit"
import { PREFIX, typesWithPrefix } from "./config"
import { apiCall } from "../utility/utils/api"
import { API_URLS } from "../configs/api"

const _types = typesWithPrefix(PREFIX.PRODUCT_TYPE)
const types = {
    GET_LIST_PRODUCT_TYPE: _types("GET_LIST_PRODUCT_TYPE"),
    GET_PRODUCT_TYPE_BY_ID: _types("GET_PRODUCT_TYPE_BY_ID"),
    ADD_PRODUCT_TYPE: _types("ADD_PRODUCT_TYPE"),
    UPDATE_PRODUCT_TYPE: _types("UPDATE_PRODUCT_TYPE"),
    DELETE_PRODUCT_TYPE: _types("DELETE_PRODUCT_TYPE"),
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
    getListProductType: createAsyncThunk(
        types.GET_LIST_PRODUCT_TYPE,
        async (params) => {
            const baseParams = {
                page: params.page,
                limit: params.limit,
                topicTypeID: params.topicTypeID
            }
            const api = API_URLS.PRODUCT_TYPE_API.getProductType(baseParams)
            const { response, error } = await apiCall(api)
            return response.data
        }
    ),
    addProductType: createAsyncThunk(
        types.ADD_PRODUCT_TYPE,
        async ({ payload, meta }) => {
            const api = API_URLS.PRODUCT_TYPE_API.addProductType(payload)
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
    getListProductTypeByID: createAsyncThunk(
        types.GET_PRODUCT_TYPE_BY_ID,
        async (ID) => {
            const api = API_URLS.PRODUCT_TYPE_API.getProductTypeByID(ID)
            const { response, error } = await apiCall(api)
            return response.data
        }
    ),
    editProductType: createAsyncThunk(
        types.UPDATE_PRODUCT_TYPE,
        async ({ payload, meta }) => {
            const api = API_URLS.PRODUCT_TYPE_API.editProductType(payload)
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
    deleteProductType: createAsyncThunk(types.DELETE_PRODUCT_TYPE, async ({ ID, meta }) => {
        const api = API_URLS.PRODUCT_TYPE_API.deleteProductType(ID)
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
    name: "PlanTraining",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(thunkActions.getListProductType.pending, (state) => {
                state.isLoading = true
            })
            .addCase(
                thunkActions.getListProductType.fulfilled,
                (state, { payload }) => {
                    const { data, page, limit, count } = payload
                    state.isLoading = false
                    state.data = data
                    state.meta.page = page
                    state.meta.limit = limit
                    state.meta.total = count
                }
            )
            .addCase(thunkActions.getListProductType.rejected, (state) => {
                state.isLoading = false
            })
            .addCase(thunkActions.addProductType.pending, (state) => {
                state.isLoading = true
            })
            .addCase(thunkActions.addProductType.fulfilled, (state, { payload }) => {
                state.isLoading = false
            })
            .addCase(thunkActions.addProductType.rejected, (state) => {
                state.isLoading = false
            })
            .addCase(thunkActions.getListProductTypeByID.pending, (state) => {
                state.isLoading = true
            })
            .addCase(
                thunkActions.getListProductTypeByID.fulfilled,
                (state, { payload }) => {
                    state.isLoading = false
                    state.curData = payload
                }
            )
            .addCase(thunkActions.getListProductTypeByID.rejected, (state) => {
                state.isLoading = false
            })
            .addCase(thunkActions.editProductType.pending, (state) => {
                state.isLoading = true
            })
            .addCase(thunkActions.editProductType.fulfilled, (state, { payload }) => {
                state.isLoading = false
            })
            .addCase(thunkActions.editProductType.rejected, (state) => {
                state.isLoading = false
            })
            .addCase(thunkActions.deleteProductType.pending, (state) => {
                state.isLoading = true
            })
            .addCase(
                thunkActions.deleteProductType.fulfilled,
                (state, { payload }) => {
                    state.isLoading = false
                }
            )
            .addCase(thunkActions.deleteProductType.rejected, (state) => {
                state.isLoading = false
            })
    },
})

export const actions = { ...PlanTrainingSlice.actions, ...thunkActions }
export const { reducer } = PlanTrainingSlice
