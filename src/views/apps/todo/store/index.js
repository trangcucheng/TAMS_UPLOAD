// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { apiCall } from '../../../../utility/utils/api'
import { API_URLS } from '../../../../configs/api'
import { PREFIX, typesWithPrefix } from '../../../../redux/config'


const _types = typesWithPrefix(PREFIX.TODO)
const types = {
    GET_TASKS: _types('GET_TASKS'),
    ADD_TASK: _types('ADD_TASK'),
    UPDATE_TASK: _types('UPDATE_TASK'),
    DELETE_TASK: _types('DELETE_TASK')
}


const initialState = {
    tasks: [],
    selectedTask: {},
    params: {
        filter: '',
        q: '',
        sort: '',
        tag: ''
    },
    meta: {
        total: 0,
        page: 1,
        pageSize: 10
    },
}

export const thunkActions = {
    getTasks: createAsyncThunk(types.GET_TASKS, async (params) => {
        //   const response = await axios.get('/apps/todo/tasks', { params })

        const { response, error } = await apiCall(API_URLS.STUDENT_API.getChat(params))
        // const baseParams = {
        //     search: params.search
        // }
        // const { response, error } = await apiCall(API_URLS.STUDENT_API.getChat({
        //     search: params.search   //hoặc truyền baseParams vào


        return {
            params,
            data: response
        }
    }),
    addTask: createAsyncThunk(types.ADD_TASK, async (task, { dispatch, getState }) => {
        const response = await axios.post('/apps/todo/add-tasks', { task })
        await dispatch(getTasks(getState().todo.params))
        return response.data
    }),

    updateTask: createAsyncThunk(types.UPDATE_TASK, async (task, { dispatch, getState }) => {
        const response = await axios.post('/apps/todo/update-task', { task })
        await dispatch(getTasks(getState().todo.params))
        return response.data
    }),

    deleteTask: createAsyncThunk(types.DELETE_TASK, async (taskId, { dispatch, getState }) => {
        const response = await axios.delete('/apps/todo/delete-task', { taskId })
        await dispatch(getTasks(getState().todo.params))
        return response.data
    })
}


export const appTodoSlice = createSlice({
    name: 'appTodo',
    initialState,
    reducers: {
        reOrderTasks: (state, action) => {
            state.tasks = action.payload
        },
        selectTask: (state, action) => {
            state.selectedTask = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.
            addCase(thunkActions.getTasks.pending, (state) => {
                state.isFetching = false
            })
            .addCase(thunkActions.getTasks.fulfilled, (state, { payload }) => {
                const { data } = payload
                state.tasks = data
                state.isFetching = true
            })
            .addCase(thunkActions.getTasks.rejected, (state, { payload }) => {
                state.isFetching = false
            })
            .addCase(thunkActions.addTask.pending, (state) => {
                state.isFetching = false
            })
            .addCase(thunkActions.addTask.fulfilled, (state, { payload }) => {
                state.isFetching = true
            })
            .addCase(thunkActions.addTask.rejected, (state, { payload }) => {
                state.isFetching = false
            })
            .addCase(thunkActions.updateTask.pending, (state) => {
                state.isFetching = false
            })
            .addCase(thunkActions.updateTask.fulfilled, (state, { payload }) => {

                state.isFetching = true
            })
            .addCase(thunkActions.updateTask.rejected, (state, { payload }) => {
                state.isFetching = false
            })
            .addCase(thunkActions.deleteTask.pending, (state) => {
                state.isFetching = false
            })
            .addCase(thunkActions.deleteTask.fulfilled, (state, { payload }) => {
                state.isFetching = true
            })
            .addCase(thunkActions.deleteTask.rejected, (state, { payload }) => {
                state.isFetching = false
            })

    }
})

export const actions = { ...appTodoSlice.actions, ...thunkActions }
export const { reducer } = appTodoSlice