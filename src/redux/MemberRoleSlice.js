import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit"
import { PREFIX, typesWithPrefix } from "./config"
import { apiCall } from "../utility/utils/api"
import { API_URLS } from "../configs/api"

const _types = typesWithPrefix(PREFIX.MEMBER_ROLE)
const types = {
  GET_LIST_MEMBER_ROLE: _types("GET_LIST_MEMBER_ROLE"),
  GET_MEMBER_ROLE_BY_ID: _types("GET_MEMBER_ROLE_BY_ID"),
  ADD_MEMBER_ROLE: _types("ADD_MEMBER_ROLE"),
  UPDATE_MEMBER_ROLE: _types("UPDATE_MEMBER_ROLE"),
  DELETE_MEMBER_ROLE: _types("DELETE_MEMBER_ROLE"),
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
  getListMemberRole: createAsyncThunk(
    types.GET_LIST_MEMBER_ROLE,
    async (params) => {
      const baseParams = {
        page: params.page,
        limit: params.limit,
        topicTypeID: params.topicTypeID
      }
      const api = API_URLS.MEMBER_ROLE_API.getMemberRole(baseParams)
      const { response, error } = await apiCall(api)
      return response.data
    }
  ),
  addMemberRole: createAsyncThunk(
    types.ADD_MEMBER_ROLE,
    async ({ payload, meta }) => {
      const api = API_URLS.MEMBER_ROLE_API.addMemberRole(payload)
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
  getListMemberRoleByID: createAsyncThunk(
    types.GET_MEMBER_ROLE_BY_ID,
    async (ID) => {
      const api = API_URLS.MEMBER_ROLE_API.getMemberRoleByID(ID)
      const { response, error } = await apiCall(api)
      return response.data
    }
  ),
  editMemberRole: createAsyncThunk(
    types.UPDATE_MEMBER_ROLE,
    async ({ payload, meta }) => {
      const api = API_URLS.MEMBER_ROLE_API.editMemberRole(payload)
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
  deleteMemberRole: createAsyncThunk(types.DELETE_MEMBER_ROLE, async ({ ID, meta }) => {
    const api = API_URLS.MEMBER_ROLE_API.deleteMemberRole(ID)
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
      .addCase(thunkActions.getListMemberRole.pending, (state) => {
        state.isLoading = true
      })
      .addCase(
        thunkActions.getListMemberRole.fulfilled,
        (state, { payload }) => {
          const { data, page, limit, count } = payload
          state.isLoading = false
          state.data = data
          state.meta.page = page
          state.meta.limit = limit
          state.meta.total = count
        }
      )
      .addCase(thunkActions.getListMemberRole.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(thunkActions.addMemberRole.pending, (state) => {
        state.isLoading = true
      })
      .addCase(thunkActions.addMemberRole.fulfilled, (state, { payload }) => {
        state.isLoading = false
      })
      .addCase(thunkActions.addMemberRole.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(thunkActions.getListMemberRoleByID.pending, (state) => {
        state.isLoading = true
      })
      .addCase(
        thunkActions.getListMemberRoleByID.fulfilled,
        (state, { payload }) => {
          state.isLoading = false
          state.curData = payload
        }
      )
      .addCase(thunkActions.getListMemberRoleByID.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(thunkActions.editMemberRole.pending, (state) => {
        state.isLoading = true
      })
      .addCase(thunkActions.editMemberRole.fulfilled, (state, { payload }) => {
        state.isLoading = false
      })
      .addCase(thunkActions.editMemberRole.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(thunkActions.deleteMemberRole.pending, (state) => {
        state.isLoading = true
      })
      .addCase(
        thunkActions.deleteMemberRole.fulfilled,
        (state, { payload }) => {
          state.isLoading = false
        }
      )
      .addCase(thunkActions.deleteMemberRole.rejected, (state) => {
        state.isLoading = false
      })
  },
})

export const actions = { ...PlanTrainingSlice.actions, ...thunkActions }
export const { reducer } = PlanTrainingSlice
