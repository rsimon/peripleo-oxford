import React, { useContext, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import { StoreContext } from './store';
import { FacetsContext } from './state/search/FacetsContext';

import Loading from './loading/Loading';
import Peripleo from './Peripleo';
import Tutorial, { isFirstTimeVisitor } from './tutorial/Tutorial';
import useSearch from './state/search/useSearch';

/**
 * The 'App' class manages the basic load and data setup sequence, 
 * before the actual UI becomes fully operational.
 */
const App = () => {

  const { store } = useContext(StoreContext);

  const { availableFacets, setAvailableFacets} = useContext(FacetsContext);

  const { setFilter } = useSearch();

  const [ config, setConfig ] = useState();

  const [ loadState, setLoadState ] = useState({ stage: 'LOADING_CONFIG' });

  const onConfigLoaded = config => {
    setConfig(config);
    setLoadState({ stage: 'LOADING_DATA' });

    if (config.facets)
      setAvailableFacets(config.facets);
  }

  // Initial mount: load config
  useEffect(() => {
    // Load config file from custom path or default location
    const customPath = document.querySelector('meta[name="peripleo:config"]')?.getAttribute('content');
    fetch(customPath || 'peripleo.config.json')
      .then(response => response.json())
      .then(onConfigLoaded)
      .catch(error => {
        console.log(error);
        setLoadState({ stage: 'ERROR', cause: 'NO_CONFIG' });
        console.error('Error loading Peripleo config. Please add a valid `peripleo.config.json` to your application root.');
      });
  }, []);

  useEffect(() => {
    if (loadState.stage === 'LOADED') {
      setTimeout(() => 
        setLoadState({ ...loadState, stage: 'CLOSE' }), 2000);
    }
  }, [loadState]);

  useEffect(() => {
    const filterOnStart = availableFacets.filter(d => d.filterOnStart);
    filterOnStart.forEach(f =>
      setFilter(f.name, f.filterOnStart, true));  
  }, [ availableFacets ]);

  const onMapLoaded = () => {
    const { data } = config;

    if (!data?.length > 0) {
      setLoadState({ stage: 'ERROR', cause: 'NO_DATA' });
    } else {
      // Just a small inch of progress to show at start
      const initialProgress = 1 / (3 * data.length);

      // Chain all loadDataset promises
      const loaded = data.reduce((previousPromise, nextConfig) => {
        const { name } = nextConfig;
        const idx = data.indexOf(nextConfig);

        return previousPromise.then(() => {
          // Start loading
          setLoadState({ 
            stage: 'LOADING_DATA', 
            dataset: name, 
            progress: Math.max(initialProgress, idx / data.length),
            nodes: store.countNodes(),
            edges: store.countEdges()
          });

          return store.loadDataset(nextConfig)
            .then(() =>
              setLoadState({...loadState, progress: (idx + 1) / data.length }))
            .catch(error => {
              setLoadState({ stage: 'ERROR', cause: 'Dataset: ' + name });
              throw error;
            });
        });   
      }, Promise.resolve());

      loaded.then(() => {
        setLoadState({ 
          stage: 'LOADED',
          nodes: store.countNodes(),
          edges: store.countEdges(),
          progress: 1
        });
      });
    }
  };
  
  return (
    <>
      <AnimatePresence>
        {loadState.stage !== 'CLOSE' &&
          <Loading
            state={loadState} 
            config={config} />
        }
      </AnimatePresence>

      {config && 
        <Peripleo
          config={config}
          dataAvailable={loadState.stage === 'LOADED' || loadState.stage === 'CLOSE'}
          loaded={loadState.stage === 'CLOSE'}
          initialRecord={null}
          onMapLoaded={onMapLoaded} />
      }

      {isFirstTimeVisitor && loadState.stage === 'CLOSE' &&
        <Tutorial />
      }
    </>
  )

}

export default App;