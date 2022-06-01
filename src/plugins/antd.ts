import { App, createVNode } from 'vue'
import * as icons from '@ant-design/icons-vue'
import {
  ConfigProvider,
  Layout,
  Button,
  Card,
  Avatar,
  Drawer,
  Popover,
  Form,
  Input,
  Breadcrumb,
  Menu,
  Table,
  Tag,
  Rate,
  Tree,
  Space,
  Modal,
  Radio,
  Tabs,
  Row,
  Col,
  Select,
  List,
  TreeSelect,
  Progress,
  Dropdown,
  Carousel,
  Cascader,
  DatePicker,
  Spin,
  Empty,
  Image,
  Checkbox,
  Skeleton,
  Badge,
  InputNumber,
  Upload,
  Divider,
  Affix,
  AutoComplete
} from 'ant-design-vue'

const Icon = (props: { icon: string }) => {
  const { icon } = props
  return createVNode(icons[icon as keyof typeof icons])
}

export default (app: App<Element>): void => {
  app
    .component('AIcon', Icon)
    .use(ConfigProvider)
    .use(Layout)
    .use(Button)
    .use(Card)
    .use(Avatar)
    .use(Drawer)
    .use(Popover)
    .use(Form)
    .use(Input)
    .use(Breadcrumb)
    .use(Menu)
    .use(Table)
    .use(Tag)
    .use(Rate)
    .use(Tree)
    .use(Space)
    .use(Modal)
    .use(Radio)
    .use(Tabs)
    .use(Row)
    .use(Col)
    .use(Select)
    .use(List)
    .use(TreeSelect)
    .use(Progress)
    .use(Dropdown)
    .use(Carousel)
    .use(Cascader)
    .use(DatePicker)
    .use(Spin)
    .use(Empty)
    .use(Image)
    .use(Checkbox)
    .use(Skeleton)
    .use(Badge)
    .use(InputNumber)
    .use(Upload)
    .use(Divider)
    .use(Affix)
    .use(AutoComplete)
}
