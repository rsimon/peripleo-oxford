import fs from 'fs';
import Papa from 'papaparse';
import convert from 'geo-coordinates-parser';

const csv = fs.readFileSync('./sample_data_202209.csv', { encoding: 'utf8', flag: 'r' });
const sourceData = Papa.parse(csv, { header: true });

const traces = sourceData.data.reduce((traces, record) => {
  const village = record['Village name'];
  const region = record['geographic region'];

  // Region can be 'N', 'S' or 'N/S' -> split!
  const location = record['location'].split('/');
  
  const { decimalLatitude, decimalLongitude } = convert(record['geo-coordinates']);

  const toTrace = (when, label, audio) => {
    const tc = parseInt(record[`${label} TC`]) || 0;
    const gc = parseInt(record[`${label} GC`]) || 0;
    const ac = parseInt(record[`${label} AC`]) || 0;

    const total = tc + gc + ac;
    const max = Math.max(tc, gc, ac);

    const homogeneity = (max / total);

    const trace = {
      type: 'Feature',
      '@id': `${village}_${label}`,
      properties: {
        title: village,
        village,
        region,
        location,
        Total: total,
        'Turkish Cypriot': tc,
        'Greek Cypriot': gc,
        'Arabic Cypriot': ac,
        'Speaker Diversity': 1 - homogeneity
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

    if (audio?.length > 0) {
      trace.audio = audio;
      trace.properties.audio = 1;
    }

    return trace;
  };

  const audio = {}; // year, [ audios ]

  const audioRecords = record['recording link (period)'].split('|')?.map(str => str.trim()) || [];
  audioRecords.forEach(str => {
    let [ wav, year ] = record['recording link (period)'].split(' (');
    wav = wav.trim();
    year = year?.replace(')', '').trim() || '2000s';

    if (wav) {
      if (audio[year])
        audio[year].push(wav);
      else 
        audio[year] = [ wav ]; 
    }
  });


  const nextTraces = [
    toTrace(1901, '1901', audio['1901']),
    toTrace(1946, '1946', audio['1946']),
    toTrace(1960, '1960', audio['1960']),
    toTrace(1973, '1973', audio['1973']),
    toTrace(2000, '2000s', audio['2000s'])
  ];
  
  return [...traces, ...nextTraces];
}, []);

const fc = {
  type: 'FeatureCollection',
  features: traces
};

fs.writeFileSync('sample_data_202209.lp.json', JSON.stringify(fc, null, 2));
