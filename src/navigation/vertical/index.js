// ** Navigation imports
import apps from "./apps"
import pages from "./pages"
import forms from "./forms"
import tables from "./tables"
import others from "./others"
import charts from "./charts"
import dashboards from "./dashboards"
import uiElements from "./ui-elements"
// import usersManage from "./users-manage"
import categories from "./categories"
import base from "./base"
// import tams from "./tams"
// ** Merge & Export
export default [
  ...base,
  //   ...usersManage,
  ...apps,
  ...pages,
  ...uiElements,
  ...forms,
  ...tables,
  ...charts,
  ...others,
  // ...tams
]
