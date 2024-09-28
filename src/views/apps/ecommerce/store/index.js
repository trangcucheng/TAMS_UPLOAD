// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

export const getProducts = createAsyncThunk('appEcommerce/getProducts', async params => {
  const response = await axios.get('/apps/ecommerce/products', { params })
  return { params, data: response.data }
})

export const addToCart = createAsyncThunk('appEcommerce/addToCart', async (id, { dispatch, getState }) => {
  const response = await axios.post('/apps/ecommerce/cart', { productId: id })
  await dispatch(getProducts(getState().ecommerce.params))
  return response.data
})

export const getWishlistItems = createAsyncThunk('appEcommerce/getWishlistItems', async () => {
  const response = await axios.get('/apps/ecommerce/wishlist')
  return response.data
})

export const deleteWishlistItem = createAsyncThunk('appEcommerce/deleteWishlistItem', async (id, { dispatch }) => {
  const response = await axios.delete(`/apps/ecommerce/wishlist/${id}`)
  dispatch(getWishlistItems())
  return response.data
})

export const getCartItems = createAsyncThunk('appEcommerce/getCartItems', async () => {
  const response = await axios.get('/apps/ecommerce/cart')
  return response.data
})

export const getProduct = createAsyncThunk('appEcommerce/getProduct', async slug => {
  const response = await axios.get(`/apps/ecommerce/products/${slug}`)
  return response.data
})

export const addToWishlist = createAsyncThunk('appEcommerce/addToWishlist', async id => {
  await axios.post('/apps/ecommerce/wishlist', { productId: id })
  return id
})

export const deleteCartItem = createAsyncThunk('appEcommerce/deleteCartItem', async (id, { dispatch }) => {
  await axios.delete(`/apps/ecommerce/cart/${id}`)
  dispatch(getCartItems())
  return id
})

export const appEcommerceSlice = createSlice({
  name: 'appEcommerce',
  initialState: {
    cart: [],
    params: {},
    products: [],
    wishlist: [],
    totalProducts: 0,
    productDetail: {},
    roleId: 0,
    timeTable: [],
    schoolYear: {},
    selectedYear: 0,
    listDataImport: [],
    courseId: null
  },
  reducers: {
    setSelectedRole: (state, action) => {
      state.roleId = action.payload
    },
    clearSelectedRole: (state) => {
      state.roleId = null
    },
    getSelectedRole: (state) => {
      return state.roleId
    },
    setSelectedCourse: (state, action) => {
      state.courseId = action.payload
    },
    clearSelectedCourse: (state) => {
      state.courseId = null
    },
    getSelectedCourse: (state) => {
      return state.courseId
    },
    setTimetable: (state, action) => {
      state.timeTable = action.payload
    },
    clearTimetable: (state) => {
      state.timeTable = null
    },
    getTimetable: (state) => {
      return state.timeTables
    },
    setSchoolYear: (state, action) => {
      state.schoolYear = action.payload
    },
    clearSchoolYear: (state) => {
      state.schoolYear = null
    },
    getSchoolYear: (state) => {
      return state.schoolYear
    },
    setSelectedYear: (state, action) => {
      state.selectedYear = action.payload
    },
    clearSelectedYear: (state) => {
      state.selectedYear = null
    },
    getSelectedYear: (state) => {
      return state.selectedYear
    },
    setListDataImport: (state, action) => {
      state.listDataImport = action.payload
    },
    clearListDataImport: (state) => {
      state.listDataImport = null
    },
    getListDataImport: (state) => {
      return state.listDataImport
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getProducts.fulfilled, (state, action) => {
        state.params = action.payload.params
        state.products = action.payload.data.products
        state.totalProducts = action.payload.data.total
      })
      .addCase(getWishlistItems.fulfilled, (state, action) => {
        state.wishlist = action.payload.products
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        state.cart = action.payload.products
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.productDetail = action.payload.product
      })
  }
})
export const { setSelectedRole, clearSelectedRole, getSelectedRole, setSelectedCourse, clearSelectedCourse, getSelectedCourse, setTimetable, clearTimetable, getTimetable, setSchoolYear, getSchoolYear, clearSchoolYear, setSelectedYear, clearSelectedYear, getSelectedYear, setListDataImport, clearListDataImport, getListDataImport } = appEcommerceSlice.actions

export default appEcommerceSlice.reducer
