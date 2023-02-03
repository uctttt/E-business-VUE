import Vue from 'vue'
import { Select, Option, Button, Form, FormItem, Input, Message, MessageBox, Container, Header, Aside, Main, Menu, Submenu, menuItem, breadcrumbItem, Breadcrumb, Card, Row, Col, Table, TableColumn, Switch, Pagination, Dialog, Tag, Tree, Cascader, Alert, Tabs, TabPane, Steps, Step } from 'element-ui'

Vue.use(Select).use(Option).use(Button).use(Form).use(FormItem).use(Input).use(Container).use(Header).use(Aside).use(Main).use(Menu).use(Submenu).use(menuItem).use(breadcrumbItem).use(Breadcrumb).use(Card).use(Row).use(Col).use(Table).use(TableColumn).use(Switch).use(Pagination).use(Dialog).use(Tag).use(Tree).use(Cascader).use(Alert).use(Tabs).use(TabPane).use(Steps).use(Step)

Vue.component(Message.name, Message)
Vue.component(MessageBox.name, MessageBox)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm