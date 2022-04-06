import fs from 'fs';
import Papa from 'papaparse';
import convert from 'geo-coordinates-parser';

const csv = fs.readFileSync('./sample_data.csv', { encoding: 'utf8', flag: 'r' });
const sourceData = Papa.parse(csv, { header: true });

const traces = sourceData.data.reduce((traces, record) => {
  const village = record['Village name'];
  const region = record['geographic region'];

  // Region can be 'N', 'S' or 'N/S' -> split!
  const location = record['location'].split('/');

  const { decimalLatitude, decimalLongitude } = convert(record['geo-coordinates']);

  const toTrace = (when, label, audio, audioWhen) => {
    const trace = {
      type: 'Feature',
      '@id': `${village}_${label}`,
      properties: {
        title: village,
        village,
        region,
        location,
        stats: {
          'Turkish Cypriot': parseInt(record[`${label} TC`]),
          'Greek Cypriot': parseInt(record[`${label} GC`]),
          'Arabic Cypriot': parseInt(record[`${label} AC`])
        }
      },
      geometry: {
        type: 'Point',
        coordinates: [
          decimalLongitude,
          decimalLatitude 
        ]
      },
      when: {
        label,
        year: when
      }
    };

    if (audio && audioWhen === label)
      trace.audio = [ audio ];

    return trace;
  };

  let [ audio, audioWhen ] = record['recording link (period)'].split(' (');
  if (audio && audioWhen) {
    audio = audio.trim();
    audioWhen = audioWhen.replace(')', '').trim();
  }

  const nextTraces = [
    toTrace(1901, '1901', audio, audioWhen),
    toTrace(1946, '1946', audio, audioWhen),
    toTrace(1960, '1960', audio, audioWhen),
    toTrace(1973, '1973', audio, audioWhen),
    toTrace(2000, '2000s', audio, audioWhen)
  ];
  
  return [...traces, ...nextTraces];
}, []);

const fc = {
  type: 'FeatureCollection',
  features: traces
};

fs.writeFileSync('sample_data.lp.json', JSON.stringify(fc, null, 2));
