import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import * as Setting from '../../Setting';

// @ts-ignore
import VerticalTabs from '/src/Comp/Tab';
import Board from '../../Comp/Board';

const drawerWidth = 240;
const textSize = {
  fontSize: '20px',

};
export default class Index extends React.Component {
  // @ts-ignore
  constructor(props) {
    super(props);
  }


  render() {
    if (!Setting.isLoggedIn()) {
      setTimeout(() => window.location.href = '/', 1500);
      return <Alert severity='error' style={{ width: '300px', margin: "auto" }} onClose={() => window.location.href = '/'}>
        you are not logged in
      </Alert>;
    }

    return (
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />

        <AppBar
          position='fixed'
          sx={{ width: `calc(100% - 600px)`, ml: `600px` }}
        >
          <Toolbar>
            <Typography variant='h4' noWrap component='div'>
              NutsDB
            </Typography>
          </Toolbar>
        </AppBar>

        <Drawer
          sx={{
            width: 600,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 600,
              boxSizing: 'border-box',
            },
          }}
          variant='permanent'
          anchor='left'
        >

          <Toolbar>
            <Typography variant='h5' noWrap component='div' sx={{ color: 'gray', flex: '80%' }}>
              {`${Setting.IP}:${Setting.Port}`}
            </Typography>
            <Typography variant='h5' noWrap component='div' sx={{ color: 'gray' }}>
              Alias
            </Typography>
          </Toolbar>
          <Divider />

          <Typography variant='h5' noWrap component='div'
                      sx={{ mt: 2, mb: 2, ml: 6, textAlign: 'center', color: 'gray' }}>
            Selecting a data structure
          </Typography>


          <Divider />
          <VerticalTabs />
          <Divider />

        </Drawer>
        <Box
          component='main'
          sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, mt: 10 }}
        >
          {/*添加主要界面*/}
          <Board />
          <Divider />
        </Box>

      </Box>
    );
  }
}
