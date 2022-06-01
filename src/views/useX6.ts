// import dagreD3 from 'dagre-d3'
// import * as d3 from 'd3'
import { message } from 'ant-design-vue';
import dagre from 'dagre';
import { Graph, Cell } from '@antv/x6';
import { ref, Ref, reactive, nextTick } from 'vue';
import activeAddFlow from '@/assets/flow/activeAddFlow.png';

const edges = ref<any[]>([]);
const nodes = ref<any[]>([
  {
    id: '1',
    label: '开始',
    status: 201,
    type: 'startTask',
    shape: 'startTask'
  }
]);

const flowType = reactive({
  StartTask: '开始',
  UserTask: '用户任务',
  PipelineTask: '设置任务',
  EndTask: '结束',
  ExclusiveGateway: '互斥网关',
  ConditionGateway: '条件网关',
  AggregateGateway: '汇聚网关'
});

const shapeSize = reactive({
  startTask: {
    width: 40,
    height: 46
  },
  endTask: {
    width: 40,
    height: 40
  },
  toDo: {
    width: 40,
    height: 40
  },
  userTask: {
    width: 166,
    height: 58
  },
  pipelineTask: {
    width: 166,
    height: 58
  },
  noticeTask: {
    width: 166,
    height: 58
  },
  exclusiveGateway: {
    width: 40,
    height: 40
  },
  aggregateGateway: {
    width: 40,
    height: 40
  }
});

enum xType {
  start = 5,
  task = 5,
  gateway = 5
}
enum yType {
  start = 13,
  task = 13,
  gateway = 3
}

// 布局方向
const dir = 'TB'; // LR RL TB BT

const activeCells = reactive<Cell[]>([]); // 当前活跃cell
const currentIndex = ref(1);

const menuTop = ref<number>(0);
const menuLeft = ref<number>(0);

// 选中关联的id
const selectRelateId = ref<string>('');
// 选中删除的id
const selectDeleteId = ref<string>('');
const onSelectNodeList = ref<any[]>([]);
const selectRelateNodeRef = ref();
const noRelateNodeList = ref<any[]>([]);
const relateId = ref<string>('');
const selectNodeRef = ref();

const graph: Ref<any> = ref();
export function useX6() {
  // registerCell(Graph)

  const judgeRectBg = (item: any) => {
    if (item.status === 201) {
      return '#00BFA5';
    } else if (String(item.status).startsWith('2') && item.status !== 201) {
      return '#FE7471';
    } else if (String(item.status).startsWith('4')) {
      return '#FE7471';
    } else {
      return '#42c3fc';
    }
  };

  const filterNode = (id: string) => {
    return nodes.value.filter(v => {
      return v.id === id;
    });
  };

  const judgeEdge = (item: any) => {
    if (item.status === 2) {
      // console.log('recall-edge')
      return 'recall-edge';
    } else if (
      (filterNode(item.source)[0].shape.indexOf('exclusiveGateway') !== -1 ||
        filterNode(item.source)[0].shape.indexOf('conditionGateway') !== -1) &&
      filterNode(item.target)[0].shape.indexOf('aggregateGateway') !== -1
    ) {
      // console.log('exclusive-to-gateway-edge')
      return 'exclusive-to-gateway-edge';
    } else if (
      filterNode(item.source)[0].shape.indexOf('aggregateGateway') !== -1 &&
      (filterNode(item.target)[0].shape.indexOf('conditionGateway') !== -1 ||
        filterNode(item.target)[0].shape.indexOf('exclusiveGateway') !== -1)
    ) {
      // console.log('gateway-to-exclusive-edge')
      return 'gateway-to-exclusive-edge';
    } else if (filterNode(item.source)[0].shape.indexOf('Gateway') !== -1) {
      // console.log('gateway-out-edge')
      return 'gateway-out-edge';
    } else if (
      filterNode(item.source)[0].shape.indexOf('Gateway') === -1 &&
      filterNode(item.target)[0].shape.indexOf('Gateway') === -1
    ) {
      // console.log('default-edge')
      return 'default-edge';
    } else if (
      filterNode(item.source)[0].shape.indexOf('Gateway') === -1 &&
      filterNode(item.target)[0].shape.indexOf('Gateway') !== -1
    ) {
      // console.log('gateway-in-edge')
      return 'gateway-in-edge';
    }
  };

  const judgeStroke = (item: any) => {
    if (item.status !== 0) {
      return '#007EEB';
    } else {
      return '#BFD2F7';
    }
  };

  const initGraph = () => {
    graph.value = new Graph({
      container: document.getElementById('container') as HTMLElement,
      width: (document.getElementById('container') as HTMLElement).offsetWidth,
      // height: g._label.height,
      height: (document.getElementById('container') as HTMLElement)
        .offsetHeight,
      interacting: {
        nodeMovable: false,
        edgeMovable: false
      },
      autoResize: true,
      connecting: {
        router: 'manhattan',
        anchor: {
          name: 'midSide'
        }
      },
      panning: {
        enabled: true
      }
    });
    resetGraph();
  };

  const layout = () => {
    const nodes = graph.value.getNodes();
    const edges = graph.value.getEdges();
    const g = new dagre.graphlib.Graph();
    g.setGraph({ rankdir: dir, ranksep: 100, nodesep: 100 });
    g.setDefaultEdgeLabel(() => ({}));

    nodes.forEach((node: any) => {
      g.setNode(node.id, {
        width: shapeSize[node.shape as keyof typeof shapeSize].width,
        height: shapeSize[node.shape as keyof typeof shapeSize].height
      });
    });

    edges.forEach((edge: any) => {
      const source = edge.getSource();
      const target = edge.getTarget();
      g.setEdge(source.cell, target.cell);
    });
    dagre.layout(g);

    g.nodes().forEach((id: any) => {
      const node = graph.value.getCell(id) as any;
      if (node) {
        const pos = g.node(id);
        node.position(pos.x - pos.width / 2, pos.y - pos.height / 2);
      }
    });

    edges.forEach((edge: any) => {
      const source = edge.getSourceNode()!;
      const target = edge.getTargetNode()!;
      const sourceBBox = source.getBBox();
      const targetBBox = target.getBBox();
      const gap =
        dir === 'TB'
          ? targetBBox.y - sourceBBox.y - sourceBBox.height
          : -sourceBBox.y + targetBBox.y + targetBBox.height;
      const fix = dir === 'TB' ? sourceBBox.height : 0;
      const y = sourceBBox.y + fix + gap / 2;
      edge.setVertices([
        { x: sourceBBox.center.x, y },
        { x: targetBBox.center.x, y }
      ]);
    });

    graph.value.unfreeze();
  };

  const resetGraph = () => {
    const cells: Cell[] = [];
    nodes.value.forEach(node => {
      cells.push(createNode(node));
    });
    edges.value.forEach(edge => {
      cells.push(createEdge(edge));
    });
    graph.value.resetCells(cells);
    layout();
    graph.value.zoomToFit({ padding: 0, maxScale: 1 });
    graph.value.centerContent();
  };

  const createNode = (node: any) => {
    return graph.value.createNode({
      ...node,
      data: {
        disableMove: true
      },
      attrs: {
        body: {},
        imgRect1: {
          fill: judgeRectBg(node),
          stroke: judgeRectBg(node)
        },
        imgRect2: {
          fill: judgeRectBg(node),
          stroke: judgeRectBg(node)
        },
        username: {
          text: node.username
            ? node.username.length > 2
              ? node.username.slice(0, 2).join('，') +
                `等${node.username.length}人`
              : node.username.join('，')
            : ''
        }
      },
      ...shapeSize[node.shape as keyof typeof shapeSize]
    });
  };

  const createEdge = (edge: any) => {
    return graph.value.createEdge({
      ...edge,
      shape: judgeEdge(edge),
      attrs: {
        line: {
          stroke: judgeStroke(edge),
          strokeWidth: 1
        }
      }
    });
  };

  const _removeTool = (cell: any) => {
    const index = cell.store.changed.tools.items.findIndex((item: any) => {
      return item.args.options.name === 'activeAddFlow';
    });
    cell.removeTool(index);
    activeCells.length = 0;
  };

  const setNewNode = (node: any, index: number) => {
    // 设置新增node信息
    node.id = String(index + 1);
    node.label = `节点${index + 1}`;
    nodes.value.push(node);
    nodes.value.map(v => Object.assign(v, { shape: v.type }));
    currentIndex.value += 1;
  };

  const setNewEdge = (edge: any, node: any, index: number) => {
    // 设置新增edge信息
    edge.id = String(index + 2);
    edge.source = activeCells[0].id;
    edge.target = node.id;
    edges.value.push(edge);
    currentIndex.value += 1;
  };

  const setNewFixEdge = (selectEdge: any, node: any) => {
    const edge = reactive({
      id: '',
      source: '',
      target: ''
    });
    edge.id = String(currentIndex.value + 1);
    edge.source = node.id;
    edge.target = selectEdge.target;
    edges.value.push(edge);
    currentIndex.value += 1;
  };

  const addTaskNode = (
    index: number,
    isSource: boolean,
    isGateway: boolean
  ) => {
    // 初始待添加 node / edge
    const edge = reactive({
      id: '',
      source: '',
      target: ''
    });
    const taskData = reactive({
      id: '',
      label: '',
      type: 'userTask',
      username: [],
      data: {
        allowPassTask: false,
        allowRecall: false,
        allowRejectTask: false,
        assignee: {
          uid: [],
          ugidpath: [],
          role: [],
          rel: []
        },
        comment: true,
        form: []
      },
      subType: ''
    });
    // 当前操作node是某条edge的source && 不是条件网关或者互斥网关
    if (isSource && !isGateway) {
      const selectEdge = edges.value.splice(
        edges.value.findIndex((edge: any) => {
          return edge.source === activeCells[0].id;
        }),
        1
      );
      setNewNode(taskData, index);
      setNewEdge(edge, taskData, index);
      setNewFixEdge(selectEdge[0], taskData);
    } else {
      setNewNode(taskData, index);
      setNewEdge(edge, taskData, index);
    }

    // 清空工具/ 重新加载流程图
    _removeTool(activeCells[0]);
    resetGraph();
  };

  const addGatewayNode = (
    index: number,
    isSource: boolean,
    isGateway: boolean
  ) => {
    // 初始待添加 node / edge
    const edge = reactive({
      id: '',
      source: '',
      target: ''
    });
    const gatewayData = reactive({
      id: '',
      type: 'exclusiveGateway'
    });
    if (isSource && !isGateway) {
      const selectEdge = edges.value.splice(
        edges.value.findIndex((edge: any) => {
          return edge.source === activeCells[0].id;
        }),
        1
      );
      setNewNode(gatewayData, index);
      setNewEdge(edge, gatewayData, index);
      setNewFixEdge(selectEdge[0], gatewayData);
    } else {
      setNewNode(gatewayData, index);
      setNewEdge(edge, gatewayData, index);
    }
    // 清空工具/ 重新加载流程图
    _removeTool(activeCells[0]);
    resetGraph();
  };

  const addAggregateNode = (index: number) => {
    // 初始待添加 node / edge
    const edge = reactive({
      id: '',
      source: '',
      target: ''
    });
    const gatewayData = reactive({
      id: '',
      type: 'aggregateGateway'
    });

    setNewNode(gatewayData, index);
    setNewEdge(edge, gatewayData, index);
    // 清空工具/ 重新加载流程图
    _removeTool(activeCells[0]);
    resetGraph();
  };

  // 删除节点
  const _deleteNode = (cell: Cell) => {
    const deleteRelateEdge = edges.value.filter((edge: any) => {
      return edge.target === cell.id || edge.source === cell.id;
    });
    // 尾端删除
    if (deleteRelateEdge.length === 1) {
      nodes.value = nodes.value.filter((node: any) => {
        return node.id !== cell.id;
      });
      edges.value = edges.value.filter((edge: any) => {
        return edge.target !== cell.id;
      });
    } else if (deleteRelateEdge.length === 2) {
      // 中间删除
      //  生成新的edge
      const newRelateEdge = reactive({
        id: String(currentIndex.value + 1),
        source: deleteRelateEdge.filter((edge: any) => {
          return edge.target === cell.id;
        })[0].source,
        target: deleteRelateEdge.filter((edge: any) => {
          return edge.source === cell.id;
        })[0].target
      });
      nodes.value = nodes.value.filter((node: any) => {
        return node.id !== cell.id;
      });
      edges.value = edges.value.filter((edge: any) => {
        return edge.target !== cell.id && edge.source !== cell.id;
      });
      edges.value.push(newRelateEdge);
      currentIndex.value += 1;
    }
    resetGraph();
  };

  // 删除互斥网关
  const _deleteGatewayNode = (cell: Cell) => {
    // 当前删除的互斥网关或者条件网关为source
    const sourceEdges = edges.value.filter((edge: any) => {
      return edge.source === cell.id;
    });
    // 当前删除的互斥网关或者条件网关为target
    // const targetEdges = edges.value.filter((edge: any) => {
    //   return edge.target === cell.id
    // })
    if (sourceEdges.length > 1) {
      message.warning(
        `当前${
          flowType[cell.constructor.name as keyof typeof flowType]
        }输出分支大于1，无法删除！`
      );
    }
    if (sourceEdges.length === 1) {
      const deleteRelateEdge = edges.value.filter((edge: any) => {
        return edge.target === cell.id || edge.source === cell.id;
      });
      //  生成新的edge
      const newRelateEdge = reactive({
        id: String(currentIndex.value + 1),
        source: deleteRelateEdge.filter((edge: any) => {
          return edge.target === cell.id;
        })[0].source,
        target: deleteRelateEdge.filter((edge: any) => {
          return edge.source === cell.id;
        })[0].target
      });
      nodes.value = nodes.value.filter((node: any) => {
        return node.id !== cell.id;
      });
      edges.value = edges.value.filter((edge: any) => {
        return edge.target !== cell.id && edge.source !== cell.id;
      });
      edges.value.push(newRelateEdge);
      currentIndex.value += 1;
    }
    if (sourceEdges.length === 0) {
      nodes.value = nodes.value.filter((node: any) => {
        return node.id !== cell.id;
      });
      edges.value = edges.value.filter((edge: any) => {
        return edge.target !== cell.id;
      });
    }
    resetGraph();
  };

  // 删除汇聚网关
  const _deleteRelateNode = (cell: Cell) => {
    // 当前节点是否是某条线的终点
    const targetSomeInEdge = edges.value.some((edge: any) => {
      return edge.target === cell.id;
    });
    // 当前节点是否是某条线的起点
    const sourceSomeInEdge = edges.value.some((edge: any) => {
      return edge.source === cell.id;
    });
    // 汇聚网关 是终点没有起点
    if (targetSomeInEdge && !sourceSomeInEdge) {
      nodes.value = nodes.value.filter((node: any) => {
        return node.id !== cell.id;
      });
      edges.value = edges.value.filter((edge: any) => {
        return edge.target !== cell.id;
      });
    }
    if (targetSomeInEdge && sourceSomeInEdge) {
      const targetInEdges = edges.value.filter((edge: any) => {
        return edge.target === cell.id;
      });
      const sourceInEdges = edges.value.filter((edge: any) => {
        return edge.source === cell.id;
      });
      // 汇聚网关为起点指向的终点作为relateId
      selectRelateId.value = sourceInEdges[0].target;
      // 汇聚网关为起点指向的终点作为relateId
      selectRelateId.value = sourceInEdges[0].target;
      selectDeleteId.value = cell.id;
      const targetInEdgesList = targetInEdges.map((item: any) => {
        return item.source;
      });
      onSelectNodeList.value = nodes.value
        .filter((node: any) => {
          return targetInEdgesList.includes(node.id);
        })
        .map((item: any) => {
          return {
            id: item.id,
            type: item.type
          };
        });
      selectRelateNodeRef.value.showModal();
    }
    resetGraph();
  };

  // 关联节点
  const _relateNode = (cell: Cell) => {
    const relateEdgeList = edges.value.filter((edge: any) => {
      return edge.source === cell.id || edge.target === cell.id;
    });
    const relateNodeList = relateEdgeList.map((item: any) => {
      return item.source === cell.id ? item.target : item.source;
    });
    const sourceList = edges.value.map((edge: any) => {
      return edge.source;
    });
    const targetList = edges.value.map((edge: any) => {
      return edge.target;
    });
    // 流程具有头尾的节点
    const sourceTargetNode = nodes.value.map((node: any) => {
      return targetList.includes(node.id) && sourceList.includes(node.id)
        ? node.id
        : '';
    });
    // 获取 不和汇聚节点有关联的节点 && 不是汇聚节点本身 && 节点类型不为开始节点 && 不是具有头尾的 userTask pipelineTask noticeTask
    noRelateNodeList.value = nodes.value
      .filter((node: any) => {
        return (
          !relateNodeList.includes(node.id) &&
          node.id !== cell.id &&
          node.type !== 'startTask' &&
          !(
            sourceTargetNode.includes(node.id) &&
            (node.type === 'userTask' ||
              node.type === 'pipelineTask' ||
              node.type === 'noticeTask')
          )
        );
      })
      .map((item: any) => {
        return {
          id: item.id,
          type: item.type
        };
      });
    relateId.value = cell.id;
    selectNodeRef.value.showModal();
  };
  // 添加工具
  const _addTool = (e: any, cell: Cell, type: string) => {
    if (activeCells.length > 0) {
      _removeTool(activeCells[0]);
    }
    activeCells.push(cell);

    cell.addTools({
      name: 'button',
      args: {
        x: '100%',
        y: 0,
        markup: [
          {
            tagName: 'image',
            selector: 'activeAddFlow',
            attrs: {
              x: xType[type as any],
              y: yType[type as any],
              width: 14,
              height: 14,
              fill: '#40c3ff',
              cursor: 'pointer',
              'xlink:href': activeAddFlow
            }
          }
        ],
        options: {
          name: 'activeAddFlow'
        },
        onClick: (view: any) => {
          _removeTool(view.cell);
        }
      }
    });
    nextTick(() => {
      menuTop.value = e.offsetY - 10;
      menuLeft.value = e.offsetX + 10;
    });
  };

  return {
    initGraph,
    addTaskNode,
    addGatewayNode,
    addAggregateNode,
    graph,
    _addTool,
    _deleteNode,
    _deleteGatewayNode,
    _deleteRelateNode,
    _relateNode,
    activeCells,
    currentIndex,
    _removeTool,
    resetGraph,
    edges,
    nodes,
    menuTop,
    menuLeft,
    selectRelateId,
    selectDeleteId,
    onSelectNodeList,
    selectRelateNodeRef,
    noRelateNodeList,
    relateId,
    selectNodeRef,
    layout
  };
}
