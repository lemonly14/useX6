<!--  -->
<template>
  <div class="template-container">
    <div id="track" class="track">
      <div id="container" class="container"></div>
      <div
        v-show="activeCells.length > 0"
        class="menu"
        :style="`top:${menuTop}px;left:${menuLeft}px`"
      >
        <span class="menu-item" @click="clickMenu('任务节点')">任务节点</span>
        <span class="menu-item" @click="clickMenu('网关节点')">网关节点</span>
        <span class="menu-item" @click="clickMenu('汇聚网关')">汇聚网关</span>
      </div>
    </div>
    <select-node
      ref="selectNodeRef"
      :options="noRelateNodeList"
      :relate-id="relateId"
      @on-relate="onRelate"
    />
    <select-relate-node
      ref="selectRelateNodeRef"
      :options="onSelectNodeList"
      :relate-id="selectRelateId"
      :delete-id="selectDeleteId"
      @on-relate="onSelectRelate"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, createVNode } from 'vue';
import { Graph } from '@antv/x6';
import { Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { useX6 } from './useX6';
import SelectNode from './Comp/SelectNode.vue';
import SelectRelateNode from './Comp/SelectRelateNode.vue';
import { registerCell } from './register';
import { onBeforeRouteLeave } from 'vue-router';
const {
  initGraph,
  addTaskNode,
  addGatewayNode,
  addAggregateNode,
  graph,
  activeCells,
  _removeTool,
  currentIndex,
  edges,
  nodes,
  menuTop,
  resetGraph,
  menuLeft,
  selectRelateId,
  selectDeleteId,
  onSelectNodeList,
  selectRelateNodeRef,
  noRelateNodeList,
  relateId,
  selectNodeRef
} = useX6();

const selectNodeData = ref<any>({});

onBeforeRouteLeave((to, from, next) => {
  // 已经有编辑东西了
  if (edges.value.length > 0) {
    Modal.confirm({
      title: '提示',
      icon: createVNode(ExclamationCircleOutlined),
      content: createVNode(
        'div',
        { style: 'color:#333333;' },
        '流程模板正在编辑，是否确认退出'
      ),
      onOk() {
        next();
        initCells();
      },
      onCancel() {
        console.log('Cancel');
      },
      class: 'test'
    });
  }
});

const initCells = () => {
  nodes.value = [
    {
      id: '1',
      label: '开始',
      status: 201,
      type: 'startTask',
      shape: 'startTask'
    }
  ];

  edges.value = [];
};

watch(activeCells, newVal => {
  console.log('发生改变了', newVal);
});

const watchGraph = (graph: Graph) => {
  graph.on('blank:click', () => {
    if (activeCells.length > 0) {
      _removeTool(activeCells[0]);
    }
  });
  graph.on('click:task', (view: any) => {
    selectNodeData.value = nodes.value.filter((node: any) => {
      return node.id === view.cell.id;
    })[0];
    console.log('selectNodeData=====', selectNodeData.value);
  });
};

const clickMenu = (type: string) => {
  // 当前活跃的节点是否是某条线的起点
  const isSource = edges.value.some((edge: any) => {
    return edge.source === activeCells[0].id;
  });
  // 当前活跃的节点是否是条件网关或者互斥网关
  const isGateway =
    activeCells[0].constructor.name === 'ExclusiveGateway' ||
    activeCells[0].constructor.name === 'ConditionGateway';
  type === '任务节点' && addTaskNode(currentIndex.value, isSource, isGateway);
  type === '网关节点' &&
    addGatewayNode(currentIndex.value, isSource, isGateway);
  type === '汇聚网关' && addAggregateNode(currentIndex.value);
};

const onRelate = (val: string, relateId: string) => {
  const edge = reactive({
    id: String(currentIndex.value + 1),
    source: val,
    target: relateId
  });
  currentIndex.value += 1;
  edges.value.push(edge);
  resetGraph();
};

const onSelectRelate = (val: string, relateId: string, deleteId: string) => {
  const edge = reactive({
    id: String(currentIndex.value + 1),
    source: val,
    target: relateId
  });
  currentIndex.value += 1;
  edges.value.push(edge);
  nodes.value = nodes.value.filter((node: any) => {
    return node.id !== deleteId;
  });
  edges.value = edges.value.filter((edge: any) => {
    return edge.target !== deleteId && edge.source !== deleteId;
  });
  resetGraph();
};

onMounted(async () => {
  registerCell(Graph);
  initGraph();
  watchGraph(graph.value);
});
</script>
<style lang="scss" scoped>
.template-container {
  width: 100%;
  height: calc(100% - 49px);

  display: flex;
  justify-content: space-between;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .info {
    display: flex;
    align-items: center;
    .icon {
      display: inline-flex;
      img {
        width: 14px;
        margin-right: 10px;
        cursor: pointer;
      }
    }
  }

  .handle {
    .gray-btn {
      background: #fafafa;
    }
    :deep(.gaia-btn) {
      font-size: 14px;
      margin-left: 10px;
      padding: 5.6px 25px;
    }
  }
}

.track {
  height: 100%;
  width: 100%;
  position: relative;
  .container {
    height: 100% !important;
    width: 100% !important;
  }
  /* :deep(.x6-graph-scroller-content) {
      width: 100% !important;
      height: 100% !important;
    } */

  .menu {
    position: fixed;
    top: 160px;
    left: 740px;
    border-radius: 2px;
    cursor: pointer;
    .menu-item {
      padding: 5px 10px;
      background: #009b63;
      color: #fff;
    }
  }
}

.template-right {
  width: calc(50% - 20px);
  height: 100%;
  padding: 15px;
  background: #fff;
}
</style>
