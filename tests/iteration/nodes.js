/**
 * Graphology Nodes Iteration Specs
 * =================================
 *
 * Testing the nodes iteration-related methods of the graph.
 */
import assert from 'assert';

export default function nodesIteration(Graph) {

  return {
    '#.nodes': {
      'it should return the list of nodes of the graph.': function() {
        const graph = new Graph();
        graph.addNodesFrom(['one', 'two', 'three']);

        assert.deepEqual(graph.nodes(), ['one', 'two', 'three']);
      }
    },

    '#.nodesIterator': {
      'it should be possible to create a nodes iterator.': function() {
        const graph = new Graph();
        graph.addNodesFrom(['one', 'two', 'three']);

        const iterator = graph.nodesIterator();

        assert.strictEqual(iterator.next().value, 'one');
        assert.strictEqual(iterator.next().value, 'two');
        assert.strictEqual(iterator.next().value, 'three');
        assert.strictEqual(iterator.next().done, true);
      }
    }
  };
}
