import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabPanel from './Buckets';
import axios from 'axios';
import { ConditionContext, InfoContext, ThrottleContext } from '../pages/Index';

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export const BucketsContext = React.createContext([]);
export const IdxContext = React.createContext(-1);

export default function VerticalTabs() {
  const info = React.useContext(InfoContext);
  const checked = React.useContext(ThrottleContext);
  // @ts-ignore
  const { changeDs, ...other } = React.useContext(ConditionContext);
  // @ts-ignore
  const { ip, port, token } = info;
  const m: any = {
    0: 'string',
    1: 'list',
    2: 'set',
    3: 'zset',
  };
  const [value, setValue] = React.useState(0);
  const [Buckets, setBuckets] = React.useState([]);

  const [reg, setReg] = React.useState('*');
  const [idx, setIdx] = React.useState(-1);

   function getBuckets(ds: string, reg: string) {
     return axios.get(`http://${ip}:${port}/common/getAll/${ds}/${reg}?token=${token}`).then(
      (response) => {
        let buckets=[]
        if (response.data.code == 200) {
          if (response.data.data == null) {
            setBuckets([]);
          } else {
            buckets=response.data.data
            setBuckets(response.data.data);
          }
        }
        return buckets
      },
    );
  }


  function filterBuckets(reg: string) {
    let ds = m[value] as string;
    if (reg == '') {
      reg = '*';
    }
    getBuckets(ds, '*').then((buckets)=>{
      let tmp = [];
      for (let i = 0; i < buckets.length; i++) {
        let bucket: string = buckets[i];
        if (bucket.includes(reg)) {
          tmp.push(bucket as string);
        }
      }
      //regular expression
      if (tmp.length == 0) {
        getBuckets(ds, reg);
        return;
      } else {
        // @ts-ignore
        setBuckets(tmp);
      }
    });

  }


  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    let ds = m[newValue] as string;
    changeDs(event, ds);
    setIdx(-1);
    setReg('');
    if (!checked) {
      getBuckets(ds, '*');
    } else {
      setBuckets([]);
    }
  };

  React.useEffect(() => {
    filterBuckets(reg);
  }, [reg]);

  //初始化加载
  React.useEffect(() => {
    if (!checked) {
      getBuckets('string', '*');
    }
  }, []);

  return (
    <>
      <Box
        sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100%' }}
      >
        <Tabs
          orientation='vertical'
          variant='scrollable'
          value={value}
          onChange={handleChange}
          aria-label='Vertical tabs example'
          sx={{ borderRight: 1, borderColor: 'divider', width: 120 }}
        >
          <Tab label='String'  {...a11yProps(0)} sx={{ height: 80 }} />
          <Tab label='List'   {...a11yProps(1)} sx={{ height: 80 }} />
          <Tab label='Set'  {...a11yProps(2)} sx={{ height: 80 }} />
          <Tab label='ZSet'   {...a11yProps(3)} sx={{ height: 80 }} />
        </Tabs>
        <BucketsContext.Provider value={Buckets}>
          <IdxContext.Provider
            //@ts-ignore
            value={{ idx, setIdx, setReg }}>
            <TabPanel value={value} index={0} ds={'string'}>
              String
            </TabPanel>
            <TabPanel value={value} index={1} ds={'list'}>
              List
            </TabPanel>
            <TabPanel value={value} index={2} ds={'set'}>
              Set
            </TabPanel>
            <TabPanel value={value} index={3} ds={'zset'}>
              ZSet
            </TabPanel>
          </IdxContext.Provider>
        </BucketsContext.Provider>
      </Box>
    </>
  );
}
