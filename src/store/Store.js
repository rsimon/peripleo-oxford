import createGraph from 'ngraph.graph';
import RBush from 'rbush';
import FlexSearch from 'flexsearch';

import { loadLinkedPlaces } from './loaders/LinkedPlacesLoader';

/**
 * Converts a network node to a JsSearch
 * document for indexing.
 */
const nodeToDocument = node => ({
  id: node.id,
  dataset: node.dataset,
  title: node.title,
  description: node.properties?.description,
  names: node.name ? [ node.name ] : node.names?.map(n => n.toponym)
})

export default class Store {

  constructor() {
    this.graph = createGraph();

    this.spatialIndex = new RBush();

    // Fulltext search, using node ID as primary key
    // this.searchIndex = new JsSearch.Search('id');
    this.searchIndex = new FlexSearch.Document({
      document: {
        id: 'id',
        index: [
          'title',
          'description',
          'names[]'
        ],
        store: ['dataset']
      },
      tokenize: function(text) {
        return text
          .replace(/[.,'"#!$%^&*;:{}=\-_`~()]/g, '')
          .split(/[\s,-]+/)
      },
      // tokenize: 'full'
    });
  }

  loadDataset = (config, afterLoad) => {
    const { name, format, src } = config;

    if (format === 'LINKED_PLACES') {
      return loadLinkedPlaces(name, src, this, afterLoad);
    } else {
      return new Promise((_, reject) => 
        reject(new Error('Unsupported format: ' + format)));
    }  
  }

  index = nodes => {
    nodes.forEach(n => {
      const doc = nodeToDocument(n);
      this.searchIndex.add(doc);
    });
  }

  countNodes = () => {
    let nodes = 0;
    this.graph.forEachNode(() =>{ nodes = nodes + 1; });
    return nodes;
  }

  countEdges = () => {
    let edges = 0;
    this.graph.forEachLink(() => { edges += 1; });
    return edges;
  }

  getNode = id =>
    this.graph.getNode(id)?.data;

  /** 
   * Return nodes in the graph connected to the
   * node with the given ID. Returns only 'known' nodes, 
   * where `data` is defined!
   */
  getConnectedNodes = id => {
    const linkedNodes = [];

    this.graph.forEachLinkedNode(id, (node, link) => {
      if (node.data)
        linkedNodes.push({ node, link });
    });

    return linkedNodes.map(t => t.node.data);
  }

  /** 
   * Return 'link nodes' in the graph for this node.
   * Links are graph nodes with no `data` defined.
   */
  getExternalLinks = id => {
    const linkedNodes = [];

    this.graph.forEachLinkedNode(id, (node, link) => {
      if (!node.data)
        linkedNodes.push({ node, link });
    });

    return linkedNodes.map(t => t.link.data);
  }

  getNodesInBounds = (bounds, optDataset) => {
    let minX, minY, maxX, maxY;

    if (bounds.length === 4)
      [ minX, minY, maxX, maxY ] = bounds;
    else
      [[ minX, minY ], [ maxX, maxY ]] = bounds;
    
    const results = this.spatialIndex.search({ minX, minY, maxX, maxY });

    const filtered = optDataset ?
      results.filter(r => r.node.dataset === optDataset) : results;

    // We'll exclude nodes that are larger than the viewport!
    const isInsideBounds = r =>
      r.minX > minX && r.maxX < maxX && r.minY > minY && r.maxY < maxY;

    return filtered
      .filter(result =>
        result.node.geometry.type === 'Point' || isInsideBounds(result))
      .map(result => result.node);
  }

  getAllLocatedNodes = () => {
    return this.getNodesInBounds([-180,-90,180,90]);
  }

  fetchGeometryRecursive = (node, maxHops, spentHops = 0) => {
    if (spentHops >= maxHops)
      return;
    
    // Don't walk graph unnecessarily
    if (node.geometry)
      return node.geometry;

    // Get all neighbors
    const neighbors = this.getConnectedNodes(node.id);

    // Find first neighbour with a geometry
    const locatedNeighbour = neighbors.find(node => node.geometry);

    if (locatedNeighbour) {
      return locatedNeighbour.geometry;
    } else if (neighbors.length > 0) {
      const nextHops = neighbors.map(node => 
        this.fetchUpstreamGeometry(node, maxHops, spentHops + 1));

      return nextHops.find(geom => geom);
    }
  }

  searchMappable = query => {
    // FlexSearch result format is horrible and creates duplicates!
    const response = this.searchIndex.search(query, { limit: 100000 });

    const results = Array.from(
      // Remove duplicates
      response.reduce((ids, r) =>
        new Set([...ids, ...r.result]), new Set())
      
      // Resolve IDs
    ).map(id => this.getNode(id));
    
    const withInferredGeometry = results
      .map(node => {
        if (node.geometry?.type) {
          return node;
        } else {
          // Unlocated node - try to fetch location from the graph
          return { ...node, geometry: this.fetchGeometryRecursive(node, 2) };
        }
      })
    .filter(n => n.geometry?.type);

    return withInferredGeometry;
  }

}