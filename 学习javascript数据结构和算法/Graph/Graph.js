function Dictionary() {
  let items = {};

  this.set = function(key, value) {
    items[key] = value;
  }

  this.remove = function(key) {
    if (this.has(key)) {
      delete items[key];
      return true;
    }
    return false;
  }

  this.has = key => items.hasOwnProperty(key)

  this.get = key => items[key] ? items[key] : undefined

  this.clear = () => { items = {} }

  this.size = () => Object.keys(items).length

  this.keys = () => Object.keys(items)

  this.values = () => Object.values(items)

}

function Queue() {
  var items = [];

  this.enqueue = element => { items.push(element) }

  this.dequeue = () => items.shift()

  this.clear = () => { items = [] }

  this.front = () => items[0]

  this.isEmpty = () => items.length === 0

  this.toString = () => items.toString()

  this.size = () => items.length
}

function Stack() {
  var items = [];

  this.push = element => items.push(element)

  this.pop = () => items.pop()

  this.peek = () => items[items.length - 1]

  this.isEmpty = () => items.length === 0

  this.clear = () => items = []

  this.size = () => items.length
}

function Graph() {
  // 邻接表表示法
  let vertices = [];
  let adjLists = new Dictionary();

  // white 代表未发现、gray 代表已发现、black 代表已探索
  const initColor = () => {
    let color = [];
    const len = vertices.length;
    for (let i = 0; i < len; i++) {
      color[vertices[i]] = 'white';
    }
    return color;
  }

  this.addVertex = (v) => {
    vertices.push(v);
    adjLists.set(v, []);
  }

  this.addEdge = (v, w) => {
    if (vertices.indexOf(v) === -1 || vertices.indexOf(w) === -1) {
      return false;
    } else {
      adjLists.get(v).push(w);
      adjLists.get(w).push(v);
    }
  }

  this.initVertex = (arr) => {
    const len = arr.length;
    for (let i = 0; i < len; i++) {
      this.addVertex(arr[i]);
    }
  }

  this.initEdge = (arr) => {
    let len = arr.length;
    for (let i = 0; i < len; i++) {
      this.addEdge(arr[i][0], arr[i][1])
    }
  }

  this.getVertives = () => vertices

  this.getAdjLists = () => adjLists;

  this.toString = () => {
    const len = vertices.length;
    let str = '';
    for (let i = 0; i < len; i++) {
      str += `${vertices[i]} --> `;
      let neighbors = adjLists.get(vertices[i]);
      for (let j = 0; j < neighbors.length; j++) {
        str += `${neighbors[j]} `;
      }
      str += '\n';
    }
    return str;
  }

  // Breadth-First Search BFS
  this.bfs = (v, callback) => {

    let queue = new Queue();
    let color = initColor();
    let d = {};
    let pred = {};

    for (let i = 0; i < vertices.length; i++) {
      d[vertices[i]] = 0;
      pred[vertices[i]] = null;
    }

    queue.enqueue(v);
    color[v] = 'gray';
    // 入队列，已发现，变 white
    // 相邻顶点入队列，该点已探索，变 black
    while(!queue.isEmpty()) {
      let u = queue.dequeue();
      let neighbors = adjLists.get(u);
      for (let i = 0; i < neighbors.length; i++) {
        if (color[neighbors[i]] === 'white') {
          queue.enqueue(neighbors[i]);
          color[neighbors[i]] = 'gray';
          d[neighbors[i]] = d[u] + 1;
          pred[neighbors[i]] = u;
        }
      }
      color[u] = 'black';
      if (callback) {
        callback(u)
      }
    }

    return {
      distance: d,
      predecessors: pred,
    };

  }
  // 获取v到其他顶点的最短路径
  this.getShortestPath = (v) => {
    const { distance, predecessors } = this.bfs(v);
    const len = vertices.length;
    const fromVertex = v;
    let paths = '';
    for (let i = 0; i < len; i++) {
      let toVertex = vertices[i];
      let path = new Stack();
      for (let v = toVertex; v !== fromVertex; v = predecessors[v]) {
        path.push(v);
      }

      paths += `${fromVertex}`;
      while (!path.isEmpty()) {
        paths += ` - ${path.pop()}`;
      }
      paths += '\n';

    }
    return paths;
  }

  // Depth-First Search DFS
  this.dfs = (callback) => {
    let time = 0;
    let color = initColor();
    let d = {}, f = {}, p = {};
    const len = vertices.length;

    for (let i = 0; i < len; i++) {
      d[vertices[i]] = 0;
      f[vertices[i]] = 0;
      p[vertices[i]] = null;
    }

    const dfsVisit = (v, callback) => {
      console.log('discovered ', v);
      d[v] = ++time;
      color[v] = 'gray';
      if (callback) {
        callback(v);
      }
      let neighbors = adjLists.get(v);
      for (let i = 0; i < neighbors.length; i++) {
        if (color[neighbors[i]] === 'white') {
          p[neighbors[i]] = v;
          dfsVisit(neighbors[i], callback);
        }
      }
      color[v] = 'black';
      f[v] = ++time;
      console.log('explored ', v);
    }
    for (let i = 0; i < len; i++) {
      if (color[vertices[i]] === 'white') {
        dfsVisit(vertices[i], callback);
      }
    }

    return {
      discovery: d,
      finished: f,
      predecessors: p,
    };

  }
  // 获得每个顶点发现和完全探索的时间点 eg: A: discovery_time / finished_time
  this.getDFSTime = () => {
    const { discovery, finished } = this.dfs();
    let time_info = '';
    const len = vertices.length;
    for (let i = 0; i < len; i++) {
      let v = vertices[i];
      time_info += `${v}: ${discovery[v]}/${finished[v]}\n`;
    }
    return time_info;
  }

}

let graph = new Graph();
graph.initVertex(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']);
graph.initEdge(['AB', 'AC', 'AD', 'CD', 'CG', 'DG', 'DH', 'BE', 'BF', 'EI']);
// console.log('---------- Breadth-First Search ----------');
// graph.bfs('A', (u) => {console.log(u);})
// console.log('---------- Depth-First Search ----------');
console.log('dfs\n', graph.getDFSTime());
// console.log('ddd\n', graph.getShortestPath('A'));
