/**
 * Graphology Edges Iteration Specs
 * =================================
 *
 * Testing the edges iteration-related methods of the graph.
 */
import assert from 'assert';
import take from 'obliterator/take';
import {
  deepMerge,
  sameMembers
} from '../helpers';

const METHODS = [
  'edges',
  'inEdges',
  'outEdges',
  'directedEdges',
  'undirectedEdges'
];

export default function edgesIteration(Graph, checkers) {
  const {
    invalid,
    notFound
  } = checkers;

  const graph = new Graph({multi: true});

  graph.addNodesFrom([
    'John',
    'Thomas',
    'Martha',
    'Roger',
    'Catherine',
    'Alone',
    'Forever'
  ]);

  graph.addDirectedEdgeWithKey('J->T', 'John', 'Thomas');
  graph.addDirectedEdgeWithKey('J->M', 'John', 'Martha');
  graph.addDirectedEdgeWithKey('C->J', 'Catherine', 'John');

  graph.addUndirectedEdgeWithKey('M<->R', 'Martha', 'Roger');
  graph.addUndirectedEdgeWithKey('M<->J', 'Martha', 'John');
  graph.addUndirectedEdgeWithKey('J<->R', 'John', 'Roger');
  graph.addUndirectedEdgeWithKey('T<->M', 'Thomas', 'Martha');

  const ALL_EDGES = [
    'J->T',
    'J->M',
    'C->J',
    'M<->R',
    'M<->J',
    'J<->R',
    'T<->M'
  ];

  const ALL_DIRECTED_EDGES = [
    'J->T',
    'J->M',
    'C->J'
  ];

  const ALL_UNDIRECTED_EDGES = [
    'M<->R',
    'M<->J',
    'J<->R',
    'T<->M'
  ];

  const TEST_DATA = {
    edges: {
      all: ALL_EDGES,
      node: {
        key: 'John',
        edges: [
          'C->J',
          'J->T',
          'J->M',
          'M<->J',
          'J<->R'
        ]
      },
      bunch: {
        keys: ['Martha', 'Roger'],
        edges: [
          'J->M',
          'M<->R',
          'M<->J',
          'T<->M',
          'J<->R'
        ]
      },
      path: {
        source: 'John',
        target: 'Martha',
        edges: [
          'J->M',
          'M<->J'
        ]
      }
    },
    inEdges: {
      all: ALL_DIRECTED_EDGES,
      node: {
        key: 'John',
        edges: [
          'C->J'
        ]
      },
      path: {
        source: 'John',
        target: 'Martha',
        edges: [
          'J->M'
        ]
      }
    },
    outEdges: {
      all: ALL_DIRECTED_EDGES,
      node: {
        key: 'John',
        edges: [
          'J->T',
          'J->M'
        ]
      },
      path: {
        source: 'John',
        target: 'Martha',
        edges: [
          'J->M'
        ]
      }
    },
    directedEdges: {
      all: ALL_DIRECTED_EDGES,
      node: {
        key: 'John',
        edges: [
          'C->J',
          'J->T',
          'J->M'
        ]
      },
      path: {
        source: 'John',
        target: 'Martha',
        edges: [
          'J->M'
        ]
      }
    },
    undirectedEdges: {
      all: ALL_UNDIRECTED_EDGES,
      node: {
        key: 'John',
        edges: [
          'M<->J',
          'J<->R'
        ]
      },
      path: {
        source: 'John',
        target: 'Martha',
        edges: [
          'M<->J'
        ]
      }
    }
  };

  function commonTests(name) {
    return {
      ['#.' + name]: {
        'it should throw if too many arguments are provided.': function() {
          assert.throws(function() {
            graph[name](1, 2, 3);
          }, invalid());
        },

        'it should throw when the node is not found.': function() {
          assert.throws(function() {
            graph[name]('Test');
          }, notFound());
        },

        'it should throw if either source or target is not found.': function() {
          assert.throws(function() {
            graph[name]('Test', 'Alone');
          }, notFound());

          assert.throws(function() {
            graph[name]('Alone', 'Test');
          }, notFound());
        }
      }
    };
  }

  function specificTests(name, data) {
    return {

      // Array-creators
      ['#.' + name]: {
        'it should return all the relevant edges.': function() {
          const edges = graph[name]();

          assert.deepEqual(edges, data.all);
        },

        'it should be possible to return an iterator over the relevant edges.': function() {
          const iterator = graph[name + 'Iterator']();

          assert.deepEqual(take(iterator), data.all);
        },

        'it should return a node\'s relevant edges.': function() {
          const edges = graph[name](data.node.key);

          assert.deepEqual(edges, data.node.edges);
          assert.deepEqual(graph[name]('Alone'), []);
        },

        'it should return all the relevant edges between source & target.': function() {
          const edges = graph[name](data.path.source, data.path.target);

          assert(sameMembers(edges, data.path.edges));
          assert.deepEqual(graph[name]('Forever', 'Alone'), []);
        }
      }
    };
  }

  const tests = {
    'Miscellaneous': {
      'simple graph indices should work.': function() {
        const simpleGraph = new Graph();
        simpleGraph.addNodesFrom([1, 2, 3, 4]);
        simpleGraph.addEdgeWithKey('1->2', 1, 2);
        simpleGraph.addEdgeWithKey('1->3', 1, 3);
        simpleGraph.addEdgeWithKey('1->4', 1, 4);

        assert.deepEqual(simpleGraph.edges(1), ['1->2', '1->3', '1->4']);
      },

      'it should also work with typed graphs.': function() {
        const undirected = new Graph({type: 'undirected'}),
              directed = new Graph({type: 'directed'});

        undirected.mergeEdgeWithKey('1--2', 1, 2);
        directed.mergeEdgeWithKey('1->2', 1, 2);

        assert.deepEqual(undirected.edges(1, 2), ['1--2']);
        assert.deepEqual(directed.edges(1, 2), ['1->2']);
      }
    }
  };

  // Common tests
  METHODS.forEach(name => deepMerge(tests, commonTests(name)));

  // Specific tests
  for (const name in TEST_DATA)
    deepMerge(tests, specificTests(name, TEST_DATA[name]));

  return tests;
}
