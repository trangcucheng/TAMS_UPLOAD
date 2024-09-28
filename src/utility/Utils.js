import { DefaultRoute } from '../router/routes'
import { LIST_ROLE } from './constant'
import moment from 'moment'
import dayjs from "dayjs"

// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = obj => Object.keys(obj).length === 0

// ** Returns K format from a number
export const kFormatter = num => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num)

// ** Converts HTML to string
export const htmlToString = html => html.replace(/<\/?[^>]+(>|$)/g, '')

// ** Checks if the passed date is today
const isToday = date => {
  const today = new Date()
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  )
}

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (value, formatting = { month: 'short', day: 'numeric', year: 'numeric' }) => {
  if (!value) return value
  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value)
  let formatting = { month: 'short', day: 'numeric' }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' }
  }

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => localStorage.getItem('userData')
export const getUserData = () => JSON.parse(localStorage.getItem('userData'))

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = userRole => {
  if (userRole === 'admin') return DefaultRoute
  if (userRole === 'client') return '/access-control'
  return '/login'
}

// ** React Select Theme Colors
export const selectThemeColors = theme => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: '#09a8631a', // for option hover bg-color
    primary: '#09a863', // for selected option bg-color
    neutral10: '#09a863', // for tags bg-color
    neutral20: '#ededed', // for input border-color
    neutral30: '#ededed' // for input hover border-color
  }
})
export const toDateString = date => {
  const today = new Date(date)
  const dd = String(today.getDate()).padStart(2, "0")
  const mm = String(today.getMonth() + 1).padStart(2, "0")
  const yyyy = today.getFullYear()

  return `${dd}/${mm}/${yyyy}`
}

export const toDateString1 = date => {
  const today = new Date(date)
  const dd = String(today.getDate()).padStart(2, "0")
  const mm = String(today.getMonth() + 1).padStart(2, "0")
  const yyyy = today.getFullYear()

  return `${yyyy}-${mm}-${dd}`
}

export const toDateString2 = date => {
  const today = new Date(date)
  const isoString = today.toISOString()

  // Lấy ngày, tháng, năm từ chuỗi ISO 8601
  const dd = isoString.slice(8, 10)
  const mm = isoString.slice(5, 7)
  const yyyy = isoString.slice(0, 4)

  return `${dd}/${mm}/${yyyy}`
}

export const getPermissionByRole = (roleCode) => LIST_ROLE.find(x => x.id === roleCode)

export const integerToRoman = (num) => {
  const romanNumerals = [
    { value: 1000, symbol: 'M' },
    { value: 900, symbol: 'CM' },
    { value: 500, symbol: 'D' },
    { value: 400, symbol: 'CD' },
    { value: 100, symbol: 'C' },
    { value: 90, symbol: 'XC' },
    { value: 50, symbol: 'L' },
    { value: 40, symbol: 'XL' },
    { value: 10, symbol: 'X' },
    { value: 9, symbol: 'IX' },
    { value: 5, symbol: 'V' },
    { value: 4, symbol: 'IV' },
    { value: 1, symbol: 'I' }
  ]

  let result = ''

  for (const numeral of romanNumerals) {
    while (num >= numeral.value) {
      result += numeral.symbol
      num -= numeral.value
    }
  }

  return result
}

export const addAttributeToTree = (node, newProperty, oldProperty) => {
  if (typeof node === 'object') {
    node[newProperty] = node[oldProperty]// Thêm thuộc tính cho nút hiện tại
    if (!node['value']) {
      node['value'] = node.key
    }
  }
  // Lặp qua các nút con của nút hiện tại
  if (node.children) {
    for (const child of node?.children) {
      addAttributeToTree(child, newProperty, oldProperty) // Gọi đệ quy cho mỗi nút con
    }
  }
}

export const addAttributeToTreeRoom = (node, attributeName) => {
  if (node) {
    node[attributeName] = node.name || node.organizationName// Thêm thuộc tính cho nút hiện tại
    node['value'] = `${node.id}_${node.type}`
    node['key'] = `${node.id}_${node.type}`

  }
  // Lặp qua các nút con của nút hiện tại
  if (node.children) {
    for (const child of node?.children) {
      addAttributeToTreeRoom(child, attributeName) // Gọi đệ quy cho mỗi nút con
    }
  }
}
export const addAttributeToTreeRoomDaoTao = (node, attributeName, parent) => {
  if (node) {
    node[attributeName] = node.name// Thêm thuộc tính cho nút hiện tại
    node['value'] = `${node.id}`
    node['key'] = `${parent.id}_${node.id}`

  }
  // Lặp qua các nút con của nút hiện tại
  if (node.children) {
    for (const child of node?.children) {
      addAttributeToTreeRoomDaoTao(child, attributeName, node) // Gọi đệ quy cho mỗi nút con
    }
  }
}
export const addValueToTree = (node) => {
  node["value"] = node["key"]
  if ("children" in node && node["children"].length > 0) {
    for (let i = 0; i < node["children"].length; i++) {
      addValueToTree(node["children"][i])
    }
  }
}

export const removeAtributeTypeUserToTree = (node) => {
  // Lặp qua các nút con của nút hiện tại
  if (node.children) {
    node.children = node?.children.filter(child => !child["typeUser"])
    for (const child of node.children) {
      removeAtributeTypeUserToTree(child) // Gọi đệ quy cho mỗi nút con
    }
  }
}

// Hàm lấy tuần thứ mấy trong năm
const getWeekNumber = (date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 4 - (d.getDay() || 7))
  const yearStart = new Date(d.getFullYear(), 0, 1)
  const dayOfYear = Math.floor((d - yearStart) / 86400000)
  return Math.ceil((dayOfYear + 1) / 7)
}

const convertToUTC = (dateString) => {
  // Ngày dạng local time
  const localDate = new Date(dateString)

  // Chuyển đổi thành UTC bằng cách trừ đi phần offset múi giờ
  const utcDate = new Date(localDate.getTime() - (localDate.getTimezoneOffset() * 60000))

  return utcDate.toISOString()
}

export const getWeeksBetweenDates = (startDate, endDate) => {
  const weeks = []
  const currentDate = new Date(startDate)
  let weekNumber = 1
  while (currentDate <= endDate) {
    const weekStart = new Date(currentDate)
    // weekStart.setDate(weekStart.getDate() - weekStart.getDay())

    weekStart.setDate(weekStart.getDate() - (weekStart.getDay() === 0 ? 6 : weekStart.getDay() - 1))

    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)
    // const weekNumber = getWeekNumber(weekStart)
    if (currentDate >= startDate && currentDate <= endDate) {
      weeks.push({
        weekNumber: weekNumber++,
        weekStart: convertToUTC(weekStart),
        weekEnd: convertToUTC(weekEnd),
      })
    }

    currentDate.setDate(currentDate.getDate() + 7)
  }

  return weeks
}

export const getWeeksOfMonthUTC = (monthString) => {
  const monthMoment = moment(monthString, 'MM/YYYY')
  const startOfMonth = monthMoment.clone().startOf('month')
  const endOfMonth = monthMoment.clone().endOf('month')

  const result = []
  let currentWeekStart = startOfMonth.clone().startOf('isoWeek')

  while (currentWeekStart.isBefore(endOfMonth)) {
    const currentWeekEnd = currentWeekStart.clone().endOf('isoWeek')

    // Thêm vào mảng
    result.push({
      start: currentWeekStart.format('DD/MM'),
      end: currentWeekEnd.format('DD/MM'),
    })

    currentWeekStart = currentWeekStart.add(1, 'week')
  }

  return result
}

export const getCurrentWeekInfo = () => {
  const currentDate = new Date()
  const firstDayOfWeek = new Date(currentDate)
  const lastDayOfWeek = new Date(currentDate)

  const currentDayOfWeek = currentDate.getUTCDay() // Ngày của tuần hiện tại (0 là Chủ Nhật, 1 là thứ Hai, v.v.)

  // Đặt ngày bắt đầu của tuần là ngày thứ Hai
  firstDayOfWeek.setDate(currentDate.getUTCDate() - currentDayOfWeek + 1)
  // Đặt ngày kết thúc của tuần là ngày Chủ Nhật
  lastDayOfWeek.setDate(firstDayOfWeek.getUTCDate() + 6)

  return {
    currentWeek: getWeekNumber(currentDate),
    startDate: firstDayOfWeek?.toISOString(),
    endDate: lastDayOfWeek?.toISOString(),
  }
}

export const getDatesBetween = (startDate, endDate) => {
  const dates = []
  const currentDate = new Date(startDate)
  while (currentDate <= new Date(endDate)) {
    dates.push(currentDate.toISOString())
    currentDate.setDate(currentDate.getDate() + 1)
  }
  if (dates?.length === 0) {
    dates.push(new Date(startDate).toISOString())
  }
  return dates
}

export const convertDateToIso = (datestring) => {
  if (datestring === '') return
  const parts = datestring.split("/")
  const ngay = parseInt(parts[0], 10)
  const thang = parseInt(parts[1] - 1, 10) // Lưu ý: Tháng trong đối tượng Date bắt đầu từ 0 (0 = tháng 1, 1 = tháng 2, ...)
  const nam = parseInt(parts[2], 10)

  // Tạo đối tượng Date
  const date = new Date(nam, thang, ngay)

  // Chuyển đổi thành chuỗi ISO
  const isoString = date.toISOString()
  return isoString
}

// lấy ngày bắt đầu và ngày kết thúc của tháng
export const getStartEndDateMonth = (monthYearString) => {
  const dateArray = monthYearString.split("/")
  const dateObject = new Date(Date.UTC(parseInt(dateArray[1]), parseInt(dateArray[0]) - 1, 1))

  const startDate = new Date(dateObject)

  const nextMonth = new Date(dateObject)
  nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1)
  nextMonth.setUTCDate(nextMonth.getUTCDate() - 1)
  const endDate = new Date(nextMonth)

  startDate.setUTCHours(0, 0, 0, 0)

  endDate.setUTCHours(23, 59, 59, 999)

  const startDateISO = startDate.toISOString()
  const endDateISO = endDate.toISOString()

  return {
    start: startDateISO,
    end: endDateISO
  }
}

// lấy ngày thứ 5.6 của tuần đầu tiên trong tháng và ngàu thứ 4.5 của tuần có ngày cuối cùng của tháng
const getFirstMondayOfMonth = (year, month) => {
  const firstDay = dayjs(new Date(year, month - 1, 1))
  let firstMonday = firstDay

  while (firstMonday.day() !== 1) {
    firstMonday = firstMonday.add(1, 'day')
  }

  return firstMonday
}

const getLastDayOfMonth = (year, month) => {
  return dayjs(new Date(year, month, 0)) // Lấy ngày cuối cùng của tháng
}

const getDaysFromWeek = (date, days) => {
  const startOfWeek = dayjs(date).startOf('week')

  return days.map(day => startOfWeek.day(day).toDate())
}

export const getImportantDates = (year, month) => {
  const firstMonday = getFirstMondayOfMonth(year, month)
  const lastDay = getLastDayOfMonth(year, month)

  const thursdayFridayOfFirstWeek = getDaysFromWeek(firstMonday, [4, 5]) // Thứ Năm, Thứ Sáu
  const wednesdayThursdayOfLastWeek = getDaysFromWeek(lastDay, [3, 4]) // Thứ Tư, Thứ Năm

  const dateArray = [
    dayjs(thursdayFridayOfFirstWeek[0]).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
    dayjs(thursdayFridayOfFirstWeek[1]).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
    dayjs(wednesdayThursdayOfLastWeek[0]).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
    dayjs(wednesdayThursdayOfLastWeek[1]).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
  ]

  return dateArray
}

export const getFridaysInMonth = (month, year) => {
  const fridays = []
  let date = dayjs(`${year}-${month}-01`)

  while (date.month() + 1 === month) {
    if (date.day() === 5) {
      fridays.push(date.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'))
    }
    date = date.add(1, 'day')
  }

  return fridays
}

export const toDateTimeString = date => {
  const today = new Date(date)
  const hh = String(today.getHours()).padStart(2, "0")
  const MM = String(today.getMinutes()).padStart(2, "0")
  const dd = String(today.getDate()).padStart(2, "0")
  const mm = String(today.getMonth() + 1).padStart(2, "0")
  const yyyy = today.getFullYear()

  return `${hh}:${MM} ${dd}/${mm}/${yyyy}`
}

export const convertDateString = (dateString) => {
  const date = new Date(dateString)
  return date
}

export const toDateStringv2 = date => {
  const today = new Date(date)
  const dd = String(today.getDate()).padStart(2, "0")
  const mm = String(today.getMonth() + 1).padStart(2, "0")
  const yyyy = today.getFullYear()

  return `${yyyy}-${mm}-${dd}`
}
