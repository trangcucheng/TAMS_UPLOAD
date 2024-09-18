// ** React Imports
import { Suspense, lazy } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

// ** Redux Imports
import { persistor, store } from "./redux/store"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"

// ** Intl, CASL & ThemeColors Context
import ability from "./configs/acl/ability"
import { AbilityContext } from "./utility/context/Can"
import { ThemeContext } from "./utility/context/ThemeColors"

// ** ThemeConfig
import themeConfig from "./configs/themeConfig"

// ** Toast
import { Toaster } from "react-hot-toast"

// ** i18n
import "./configs/i18n"

// ** Spinner (Splash Screen)
import Spinner from "./@core/components/spinner/Fallback-spinner"

// ** Ripple Button
import "./@core/components/ripple-button"

// ** Fake Database
import "./@fake-db"

// ** PrismJS
import "prismjs"
import "prismjs/themes/prism-tomorrow.css"
import "prismjs/components/prism-jsx.min"

// ** React Perfect Scrollbar
import "react-perfect-scrollbar/dist/css/styles.css"

// ** React Hot Toast Styles
import "@styles/react/libs/react-hot-toasts/react-hot-toasts.scss"

// ** Core styles
import "./@core/scss/core.scss"
import "./@core/assets/fonts/feather/iconfont.css"
import "./assets/scss/style.scss"
import "@styles/base/pages/app-ecommerce.scss"
import "./assets/scss/index.module.scss"
import { ConfigProvider } from "antd"
import viVN from "antd/lib/locale/vi_VN"

viVN.DatePicker.lang.shortMonths = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "tháng 12",
]

viVN.DatePicker.lang.shortWeekDays = [
  "CN",
  "T2",
  "T3",
  "T4",
  "T5",
  "T6",
  "T7",
]
// ** Service Worker
import * as serviceWorker from "./serviceWorker"

// ** Lazy load app
const LazyApp = lazy(() => import("./IdleTime"))

const container = document.getElementById("root")
const root = createRoot(container)

root.render(
  <PersistGate loading={null} persistor={persistor}>
    <BrowserRouter>
      <Provider store={store}>
        <ConfigProvider locale={viVN}>
          <Suspense fallback={<Spinner />}>
            <AbilityContext.Provider value={ability}>
              <ThemeContext>
                <LazyApp />
                <Toaster
                  position={themeConfig.layout.toastPosition}
                  toastOptions={{ className: "react-hot-toast" }}
                />
              </ThemeContext>
            </AbilityContext.Provider>
          </Suspense>
        </ConfigProvider>
      </Provider>
    </BrowserRouter>
  </PersistGate>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
