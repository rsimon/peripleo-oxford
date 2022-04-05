import fs from 'fs';
import Papa from 'papaparse';

const csv = fs.readFileSync('./sample_data.csv', { encoding: 'utf8', flag: 'r' });
const sourceData = Papa.parse(csv, { header: true });

const parseLocation = str => {

}

const traces = sourceData.data.reduce((traces, record) => {

  const village = record['Village name'];
  const region = record['geographic region'];
  const location = record['location'];

  // TODO coordinates

  const toTrace = (when, label) => ({
    village,
    region,
    location,
    when,
    stats: {
      turkish_cypriot: parseInt(record[`${label} TC`]),
      greek_cypriot: parseInt(record[`${label} GC`]),
      arabic_cypriot: parseInt(record[`${label} AC`])
    }
  });

  // TODO recording links

  const nextTraces = [
    toTrace(1901, '1901'),
    toTrace(1946, '1946'),
    toTrace(1960, '1960'),
    toTrace(1973, '1973'),
    toTrace(2000, '2000s')
  ];
  
  return [...traces, ...nextTraces];
}, []);

console.log(traces);
