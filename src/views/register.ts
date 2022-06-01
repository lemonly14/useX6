import applyUser from '@/assets/approve/user.png';
import applySetting from '@/assets/approve/setting.png';
import applyNotice from '@/assets/approve/notice.png';
import addFlow from '@/assets/flow/addFlow.png';
import deleteFlow from '@/assets/flow/deleteFlow.png';
import relateFlow from '@/assets/flow/relateFlow.png';
import { ref } from 'vue';
import { useX6 } from './useX6';

const {
  _addTool,
  _deleteNode,
  _deleteGatewayNode,
  _deleteRelateNode,
  _relateNode
} = useX6();

export function registerCell(Graph: any) {
  Graph.registerNode(
    'startTask',
    {
      inherit: 'circle',
      markup: [
        {
          tagName: 'circle',
          selector: 'body'
        },
        {
          tagName: 'image',
          selector: 'addButton'
        },
        {
          tagName: 'text',
          selector: 'label'
        }
      ],
      attrs: {
        body: {
          x: 0,
          y: 0,
          stroke: '#82D0CF',
          fill: '#82D0CF',
          cursor: 'pointer'
        },
        label: {
          fill: '#fff',
          fontSize: 13
        },
        position: {
          relative: true
        }
      },
      tools: [
        {
          name: 'button',
          args: {
            x: '100%',
            y: 0,

            markup: [
              {
                tagName: 'image',
                selector: 'addFlow',

                attrs: {
                  x: 5,
                  y: 13,
                  width: 14,
                  height: 14,
                  fill: '#40c3ff',
                  cursor: 'pointer',
                  'xlink:href': addFlow
                }
              }
            ],
            options: {
              name: 'startAdd'
            },
            onClick({ e, cell }) {
              _addTool(e, cell, 'start');
            }
          }
        }
      ]
    },
    true
  );
  Graph.registerNode(
    'toDo',
    {
      inherit: 'circle',
      attrs: {
        body: {
          strokeWidth: 10,
          stroke: '#fe7575',
          fill: '#f2f3f7'
        },
        position: {
          relative: true
        }
      }
    },
    true
  );
  Graph.registerNode(
    'endTask',
    {
      width: 40,
      height: 40,
      inherit: 'circle',
      attrs: {
        body: {
          strokeWidth: 4,
          // stroke: '#5F95FF',
          stroke: '#F6766D',
          fill: '#FFF'
        },
        position: {
          relative: true
        }
      }
    },
    true
  );
  Graph.registerNode(
    'userTask',
    {
      inherit: 'rect',
      width: 100,
      height: 60,
      markup: [
        {
          tagName: 'rect',
          selector: 'body'
        },
        {
          tagName: 'rect',
          selector: 'imgRect1'
        },
        {
          tagName: 'rect',
          selector: 'imgRect2'
        },
        {
          tagName: 'text',
          selector: 'label'
        },
        {
          tagName: 'text',
          selector: 'username'
        },
        {
          tagName: 'image',
          selector: 'img'
        }
      ],
      attrs: {
        body: {
          event: 'click:task',
          rx: 6,
          ry: 6,
          stroke: '#0FF',
          fill: '#FFF',
          strokeWidth: 1,
          cursor: 'pointer'
        },
        imgRect1: {
          event: 'click:task',
          x: 0,
          y: 0,
          rx: 6,
          ry: 6,
          width: 40,
          height: 58,
          fill: '#42c3fc',
          stroke: '#42c3fc',
          strokeWidth: 1,
          cursor: 'pointer'
        },
        imgRect2: {
          event: 'click:task',
          x: 20,
          y: 0,
          width: 20,
          height: 58,
          fill: '#42c3fc',
          stroke: '#42c3fc',
          strokeWidth: 1,
          cursor: 'pointer'
        },
        img: {
          event: 'click:task',
          x: 9,
          y: 16,
          width: 22,
          height: 22,
          fill: '#40c3ff',
          'xlink:href': applyUser,
          cursor: 'pointer'
        },
        label: {
          event: 'click:task',
          x: -35,
          y: -10,
          fontSize: 13,
          fill: '#161417',
          textAnchor: 'center',
          cursor: 'pointer'
        },
        username: {
          event: 'click:task',
          x: -35,
          y: 10,
          fontSize: 13,
          fill: '#8E8E8E',
          textAnchor: 'center',
          cursor: 'pointer'
        }
      },
      tools: [
        {
          name: 'button',
          args: {
            x: '100%',
            y: 0,
            markup: [
              {
                tagName: 'image',
                selector: 'addFlow',
                attrs: {
                  x: 5,
                  y: 13,
                  width: 14,
                  height: 14,
                  fill: '#40c3ff',
                  cursor: 'pointer',
                  'xlink:href': addFlow
                }
              }
            ],
            options: {
              name: 'addFlow'
            },
            onClick({ e, cell }) {
              _addTool(e, cell, 'task');
            }
          }
        },
        {
          name: 'button',
          args: {
            x: '100%',
            y: 0,
            markup: [
              {
                tagName: 'image',
                selector: 'deleteFlow',
                attrs: {
                  x: 5,
                  y: 32,
                  width: 14,
                  height: 14,
                  fill: '#40c3ff',
                  cursor: 'pointer',
                  'xlink:href': deleteFlow
                }
              }
            ],
            options: {
              name: 'deleteFlow'
            },
            onClick({ cell }) {
              _deleteNode(cell);
            }
          }
        }
      ]
    },
    true
  );

  Graph.registerNode(
    'pipelineTask',
    {
      inherit: 'rect',
      markup: [
        {
          tagName: 'rect',
          selector: 'body'
        },

        {
          tagName: 'rect',
          selector: 'imgRect1'
        },
        {
          tagName: 'rect',
          selector: 'imgRect2'
        },

        {
          tagName: 'text',
          selector: 'label'
        },
        {
          tagName: 'text',
          selector: 'username'
        },
        {
          tagName: 'image',
          selector: 'img'
        }
      ],
      attrs: {
        body: {
          rx: 6,
          ry: 6,
          stroke: '#0FF',
          fill: '#fff',
          strokeWidth: 1
        },
        imgRect1: {
          x: 0,
          y: 0,
          rx: 6,
          ry: 6,
          width: 40,
          height: 58,
          fill: '#42c3fc',
          stroke: '#42c3fc',
          strokeWidth: 1
        },
        imgRect2: {
          x: 20,
          y: 0,
          width: 20,
          height: 58,
          fill: '#42c3fc',
          stroke: '#42c3fc',
          strokeWidth: 1
        },
        img: {
          x: 9,
          y: 16,
          width: 22,
          height: 22,
          fill: '#40c3ff',
          'xlink:href': applySetting
        },
        label: {
          x: -35,
          y: -10,
          fontSize: 13,
          fill: '#161417',
          textAnchor: 'center'
        },
        username: {
          x: -35,
          y: 10,
          fontSize: 13,
          fill: '#8E8E8E',
          textAnchor: 'center'
        }
      },
      tools: [
        {
          name: 'button',
          args: {
            x: '100%',
            y: 0,
            markup: [
              {
                tagName: 'image',
                selector: 'addFlow',
                attrs: {
                  x: 3,
                  y: 13,
                  width: 14,
                  height: 14,
                  fill: '#40c3ff',
                  cursor: 'pointer',
                  'xlink:href': addFlow
                }
              }
            ],
            options: {
              name: 'addFlow'
            },
            onClick({ e, cell }) {
              _addTool(e, cell, 'task');
            }
          }
        },
        {
          name: 'button',
          args: {
            x: '100%',
            y: 0,
            markup: [
              {
                tagName: 'image',
                selector: 'deleteFlow',
                attrs: {
                  x: 3,
                  y: 32,
                  width: 14,
                  height: 14,
                  fill: '#40c3ff',
                  cursor: 'pointer',
                  'xlink:href': deleteFlow
                }
              }
            ],
            options: {
              name: 'deleteFlow'
            },
            onClick({ cell }) {
              _deleteNode(cell);
            }
          }
        }
      ]
    },

    true
  );

  Graph.registerNode(
    'noticeTask',
    {
      inherit: 'rect',
      markup: [
        {
          tagName: 'rect',
          selector: 'body'
        },

        {
          tagName: 'rect',
          selector: 'imgRect1'
        },
        {
          tagName: 'rect',
          selector: 'imgRect2'
        },

        {
          tagName: 'text',
          selector: 'label'
        },
        {
          tagName: 'text',
          selector: 'username'
        },
        {
          tagName: 'image',
          selector: 'img'
        }
      ],
      attrs: {
        body: {
          rx: 6,
          ry: 6,
          stroke: '#0FF',
          fill: '#fff',
          strokeWidth: 1
        },
        imgRect1: {
          x: 0,
          y: 0,
          rx: 6,
          ry: 6,
          width: 40,
          height: 58,
          fill: '#42c3fc',
          stroke: '#42c3fc',
          strokeWidth: 1
        },
        imgRect2: {
          x: 20,
          y: 0,
          width: 20,
          height: 58,
          fill: '#42c3fc',
          stroke: '#42c3fc',
          strokeWidth: 1
        },
        img: {
          x: 9,
          y: 16,
          width: 22,
          height: 22,
          fill: '#40c3ff',
          'xlink:href': applyNotice
        },
        label: {
          x: -35,
          y: -10,
          fontSize: 13,
          fill: '#161417',
          textAnchor: 'center'
        },
        username: {
          x: -35,
          y: 10,
          fontSize: 13,
          fill: '#8E8E8E',
          textAnchor: 'center'
        }
      },
      tools: [
        {
          name: 'button',
          args: {
            x: '100%',
            y: 0,
            markup: [
              {
                tagName: 'image',
                selector: 'addFlow',
                attrs: {
                  x: 3,
                  y: 13,
                  width: 14,
                  height: 14,
                  fill: '#40c3ff',
                  cursor: 'pointer',
                  'xlink:href': addFlow
                }
              }
            ],
            options: {
              name: 'addFlow'
            },
            onClick({ e, cell }) {
              _addTool(e, cell, 'task');
            }
          }
        },
        {
          name: 'button',
          args: {
            x: '100%',
            y: 0,
            markup: [
              {
                tagName: 'image',
                selector: 'deleteFlow',
                attrs: {
                  x: 3,
                  y: 32,
                  width: 14,
                  height: 14,
                  fill: '#40c3ff',
                  cursor: 'pointer',
                  'xlink:href': deleteFlow
                }
              }
            ],
            options: {
              name: 'deleteFlow'
            },
            onClick({ cell }) {
              _deleteNode(cell);
            }
          }
        }
      ]
    },
    true
  );

  // 互斥网关
  Graph.registerNode(
    'exclusiveGateway',
    {
      inherit: 'polygon',
      markup: [
        {
          tagName: 'polygon',
          selector: 'body'
        },
        {
          tagName: 'text',
          selector: 'label'
        }
      ],
      attrs: {
        body: {
          refPoints: '0,8 8,0 16,8 8,16',
          strokeWidth: 2,
          stroke: '#BFD2F7',
          fill: '#BFD2F7 '
        },
        label: {
          text: '+',
          fontSize: 30,
          fill: '#FFF'
        }
      },
      tools: [
        {
          name: 'button',
          args: {
            x: '100%',
            y: 0,
            markup: [
              {
                tagName: 'image',
                selector: 'addFlow',
                attrs: {
                  x: 5,
                  y: 3,
                  width: 14,
                  height: 14,
                  fill: '#40c3ff',
                  cursor: 'pointer',
                  'xlink:href': addFlow
                }
              }
            ],
            options: {
              name: 'addFlow'
            },
            onClick({ e, cell }) {
              _addTool(e, cell, 'gateway');
            }
          }
        },
        {
          name: 'button',
          args: {
            x: '100%',
            y: 0,
            markup: [
              {
                tagName: 'image',
                selector: 'deleteFlow',
                attrs: {
                  x: 5,
                  y: 23,
                  width: 14,
                  height: 14,
                  fill: '#40c3ff',
                  cursor: 'pointer',
                  'xlink:href': deleteFlow
                }
              }
            ],
            options: {
              name: 'deleteFlow'
            },
            onClick({ cell }) {
              _deleteGatewayNode(cell);
            }
          }
        }
      ]
    },
    true
  );

  // 汇聚网关
  Graph.registerNode(
    'aggregateGateway',
    {
      inherit: 'polygon',
      width: 55,
      height: 55,
      attrs: {
        body: {
          refPoints: '0,8 8,0 16,8 8,16',
          strokeWidth: 2,
          stroke: '#BFD2F7',
          fill: '#BFD2F7'
        },
        position: {
          relative: true
        },
        label: {
          text: '+',
          fontSize: 30,
          fill: '#FFF'
        }
      },
      tools: [
        {
          name: 'button',
          args: {
            x: '100%',
            y: 0,
            markup: [
              {
                tagName: 'image',
                selector: 'addFlow',
                attrs: {
                  x: 5,
                  y: 3,
                  width: 14,
                  height: 14,
                  fill: '#40c3ff',
                  cursor: 'pointer',
                  'xlink:href': addFlow
                }
              }
            ],
            options: {
              name: 'addFlow'
            },
            onClick({ e, cell }) {
              _addTool(e, cell, 'gateway');
            }
          }
        },
        {
          name: 'button',
          args: {
            x: '100%',
            y: 0,
            markup: [
              {
                tagName: 'image',
                selector: 'deleteFlow',
                attrs: {
                  x: 5,
                  y: 23,
                  width: 14,
                  height: 14,
                  fill: '#40c3ff',
                  cursor: 'pointer',
                  'xlink:href': deleteFlow
                }
              }
            ],
            options: {
              name: 'deleteFlow'
            },
            onClick({ cell }) {
              _deleteRelateNode(cell);
            }
          }
        },
        {
          name: 'button',
          args: {
            x: '100%',
            y: 0,
            markup: [
              {
                tagName: 'image',
                selector: 'relateFlow',
                attrs: {
                  x: 22,
                  y: 3,
                  width: 14,
                  height: 14,
                  fill: '#40c3ff',
                  cursor: 'pointer',
                  'xlink:href': relateFlow
                }
              }
            ],
            options: {
              name: 'relateFlow'
            },
            onClick({ cell }) {
              _relateNode(cell);
            }
          }
        }
      ]
    },
    true
  );
  Graph.registerEdge(
    'default-edge',
    {
      inherit: 'edge',
      connector: {
        name: 'rounded',
        args: { radius: 10 }
      },
      router: {
        name: 'orth',
        args: {
          startDirections: ['bottom'],
          endDirections: ['top']
        }
      },
      attrs: {
        line: {
          stroke: '#BFD2F7',
          strokeWidth: 1
        }
      }
    },
    true
  );
  Graph.registerEdge(
    'gateway-out-edge',
    {
      inherit: 'edge',
      connector: {
        name: 'rounded',
        args: { radius: 10 }
      },
      router: {
        name: 'manhattan',
        args: {
          startDirections: ['right', 'left'],
          endDirections: ['top'],
          step: 50
        }
      },
      attrs: {
        line: {
          stroke: '#BFD2F7',
          strokeWidth: 1
        }
      }
    },
    true
  );

  Graph.registerEdge(
    'gateway-in-edge',
    {
      inherit: 'edge',
      connector: {
        name: 'rounded',
        args: { radius: 10 }
      },
      router: {
        name: 'manhattan',
        args: {
          startDirections: ['bottom'],
          endDirections: ['right', 'left'],
          step: 50
        }
      },
      attrs: {
        line: {
          stroke: '#BFD2F7',
          strokeWidth: 1
        }
      }
    },
    true
  );
  Graph.registerEdge(
    'exclusive-to-gateway-edge', // 互斥网关、条件网关 => 汇聚网关
    {
      inherit: 'edge',
      connector: {
        name: 'rounded',
        args: { radius: 10 }
      },
      router: {
        name: 'manhattan',
        args: {
          startDirections: ['left', 'right'],
          endDirections: ['left', 'right'],
          step: 50
        }
      },
      attrs: {
        line: {
          stroke: '#BFD2F7',
          strokeWidth: 1
        }
      }
    },
    true
  );
  Graph.registerEdge(
    'gateway-to-exclusive-edge', //  汇聚网关 => 互斥网关、条件网关
    {
      inherit: 'edge',
      connector: {
        name: 'rounded',
        args: { radius: 10 }
      },
      router: {
        name: 'manhattan',
        args: {
          startDirections: ['bottom'],
          endDirections: ['left', 'right'],
          step: 50
        }
      },
      attrs: {
        line: {
          stroke: '#BFD2F7',
          strokeWidth: 1
        }
      }
    },
    true
  );
  Graph.registerEdge(
    'recall-edge', //  回退
    {
      inherit: 'edge',
      connector: {
        name: 'rounded',
        args: { radius: 10 }
      },
      router: {
        name: 'manhattan',
        args: {
          startDirections: ['left', 'right'],
          endDirections: ['left', 'right'],
          step: 50
        }
      },
      attrs: {
        line: {
          stroke: '#BFD2F7',
          strokeWidth: 1
        }
      }
    },
    true
  );
}

export const onStartClickView = ref<any>();
