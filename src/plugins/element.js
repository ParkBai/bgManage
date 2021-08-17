import Vue from 'vue'

import { Form,FormItem,Button,Input,Container,Aside,
         Main,Header,Menu,Submenu,MenuItem,MenuItemGroup,
         Breadcrumb, BreadcrumbItem,Card,Col,Row,Table,TableColumn,
         Switch,Tooltip,Pagination,Dialog,MessageBox,Tag,Tree,
         Select,Option,Cascader,Alert,TabPane,Tabs,Steps,Step,Checkbox,
         CheckboxGroup,Upload,Timeline,TimelineItem
        } from 'element-ui'
import { Message } from 'element-ui'


Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Header)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Col)
Vue.use(Row)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)
Vue.use(TimelineItem)
Vue.use(Timeline)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm