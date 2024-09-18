import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit"
import { PREFIX, typesWithPrefix } from "./config"
import { apiCall } from "../utility/utils/api"
import { API_URLS } from "../configs/api"

const _types = typesWithPrefix(PREFIX.PLAN_TRAINING)
const types = {
    ADD_PLAN_TRAINING: _types("ADD_PLAN_TRAINING"),
    GET_CHAPTER_DETAIL: _types("GET_CHAPTER_DETAIL"),
}

const initialState = {
    data: [],
    meta: {
        total: 0,
        page: 1,
        pageSize: 10,
    },
}

export const thunkActions = {
    getChapterDetail: createAsyncThunk(types.GET_CHAPTER_DETAIL, async (params) => {
        const api = API_URLS.PLAN_TRAINING_API.getChapterDetail({
            semesterId: params.semesterId,
            organizationClassId: params.organizationClassId,
        })
        const { response, error } = await apiCall(api)
        return response.data
    }),
    addPlanTraining: createAsyncThunk(types.ADD_PLAN_TRAINING, async ({ payload, meta }) => {
        const api = API_URLS.PLAN_TRAINING_API.addPlanTraining(payload)
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
            .addCase(thunkActions.addPlanTraining.pending, (state) => {
                state.isFetching = true
            })
            .addCase(thunkActions.addPlanTraining.fulfilled, (state, { payload }) => {
                state.isFetching = false
                state.data = payload
            })
            .addCase(thunkActions.addPlanTraining.rejected, (state) => {
                state.isFetching = false
            })
    },
})

export const actions = { ...PlanTrainingSlice.actions, ...thunkActions }
export const { reducer } = PlanTrainingSlice
