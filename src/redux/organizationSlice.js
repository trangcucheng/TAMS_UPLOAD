import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit"
import { PREFIX, typesWithPrefix } from "./config"
import { listAllOrganization, listAllOrganizationPC } from "../api/organizations"
const _types = typesWithPrefix(PREFIX.ORGANIZATION)

const types = {
    GET_ORGANIZATION: _types("GET_ORGANIZATION"),
}

const initialState = {
    data: [],
    meta: {
        total: 0,
        page: 1,
        pageSize: 10,
    },
}

const createTree = (key, idparent) => {
    const data = []
    key?.map(item => {
        data.push({
            value: item.id,
            //  key: idparent === null ? item.id : `${idparent}-${item.id}`,
            key: item.id,
            title: item.organizationName,
            //  children: createTree(item.children, idparent === null ? item.id : `${idparent}-${item.id}`)
            children: createTree(item.children, item.id)

        })
    })
    return data
}

export const thunkActions = {
    getOrganization: createAsyncThunk(types.GET_ORGANIZATION, async (query) => {
        try {
            const response = await listAllOrganizationPC({
                params: {
                    page: 1,
                    limit: 500,
                }
            })
            return createTree(response.fthOrg, null)
        } catch (err) {
            console.log(err)
            return []
        }

    }),

}

export const organizationSlice = createSlice({
    name: "Organization",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(thunkActions.getOrganization.pending, (state) => {
                state.isFetching = true
            })
            .addCase(thunkActions.getOrganization.fulfilled, (state, { payload }) => {
                state.isFetching = false
                state.data = payload
            })
            .addCase(thunkActions.getOrganization.rejected, (state) => {
                state.isFetching = false
            })
    },
})

export const actions = { ...organizationSlice.actions, ...thunkActions }
export const { reducer } = organizationSlice