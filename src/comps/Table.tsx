import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { visuallyHidden } from '@mui/utils';
import Message from './Message';
import SearchIcon from '@mui/icons-material/Search';
import { Alert, Button, InputBase, Snackbar } from '@mui/material';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import EditIcon from '@mui/icons-material/Edit';
import { AddSingleValue, UpdateSingleValue } from '../backend/StringOperation';

interface Data {
  key: string;
  length: number;
  value: string;
}

function createData(
  key: string,
  length: number,
  value: string,
): Data {
  if (key.length > 20) {
    key = key.substring(0, 20) + '...';
  }
  return {
    key,
    length,
    value,
  };
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

//@ts-ignore

let headCells: HeadCell[] = [
  {
    id: 'key',
    numeric: false,
    disablePadding: true,
    label: 'Key',
  },
  {
    id: 'length',
    numeric: true,
    disablePadding: false,
    label: 'Length',
  },
  {
    id: 'value',
    numeric: false,
    disablePadding: false,
    label: 'Value',
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };
  // @ts-ignore
  return (
    <TableHead>
      <TableRow>
        <TableCell padding='checkbox'>
          <Checkbox
            color='primary'
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {
          headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={//@ts-ignore
                headCell.numeric || headCell.id == 'value' ? 'right' : 'left'
              }
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component='span' sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  ds: string;
  selected: string[];
  bucket: string;
}


function CustomizedInputBase(props: { prop: any; }) {
  const [keyword, setKeyword] = React.useState('');
  return (
    <Paper
      component='form'
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400, mr: 5 }}
    >
      <InputBase
        sx={{ ml: 2, flex: 1, mr: 5 }}
        placeholder='Search Key or Value'
        inputProps={{ 'aria-label': 'search' }}
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
      />
      <IconButton type='button' sx={{ p: '10px' }} aria-label='search' onClick={() => {
        let { rows, setRows, back } = props.prop;
        rows = rows as Data[];
        if (keyword == '') {
          setRows(back);
          return;
        }
        let tmp: Data[] = [];
        for (let i = 0; i < rows.length; i++) {
          let row = rows[i];
          if (row.key.indexOf(keyword) != -1 || row.value.indexOf(keyword) != -1) {
            tmp.push(row);
          }
        }
        setRows(tmp);
      }}>
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}


const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  // @ts-ignore
  const { numSelected,rows,setRows,ds, selected, bucket, ...other } = props;
  const [open, setOpen] = React.useState(false);
  const [operateType, setOperateType] = React.useState('');
  const [openAlert, setOpenAlert] = React.useState(false);

  const [level, setLevel] = React.useState('');
  const [message, setMessage] = React.useState('');


  const [key, setKey] = React.useState('');
  const [value, setValue] = React.useState('');
  const [ttl, setTTL] = React.useState(0);

  // @ts-ignore
  const handleTextInputChange = (type: string, event) => {
    switch (type) {
      case 'key':
        setKey(event.target.value);
        break;
      case 'value':
        setValue(event.target.value);
        break;
      case 'ttl':
        setTTL(event.target.value);
        break;
    }
  };

  const handleClickOpen = (type: string) => {
    if (type == 'update' && numSelected != 1) {
      setOpenAlert(true);
      setMessage('Please select one item to update');
      setLevel('error');
      setTimeout(() => {
        setOpenAlert(false);
      }, 2000);
      return;
    }
    setKey(selected[0]);
    setOpen(true);
    setOperateType(type);
  };

  const handleClose = () => {
    setOpen(false);
  };
  //@ts-ignore
  const handleSubmit = (event) => {
    let success =false;
    event.preventDefault();
    const form = {
      key: key,
      value: value,
      ttl: ttl,
    };
    if (operateType == 'add') {
      AddSingleValue(bucket, form.key, form.value, form.ttl).then((res) => {
        if (res.data.code == 200) {
          setOpenAlert(true);
          setMessage('Add Success');
          setLevel('success');
          success = true;
        } else {
          setOpenAlert(true);
          setMessage('Add Failed');
          setLevel('error');
        }
      });
    } else if (operateType == 'update') {
      UpdateSingleValue(bucket, form.key, form.value, form.ttl).then((res) => {
        if (res.data.code == 200) {
          setOpenAlert(true);
          setMessage('Update Success');
          setLevel('success');
          setTimeout(() => {
            setOpenAlert(false);
          }, 2000);
          setOpen(false);
          success = true;
        } else {
          setOpenAlert(true);
          setMessage('Update Failed');
          setLevel('error');
        }
      });
    }
    setTimeout(() => {
      setOpenAlert(false);
    }, 2000);

    if(success){
      //find key from rows and update
      let tmp = rows as Data[];
      let index = tmp.findIndex((item) => item.key == key);
      if (index != -1) {
        tmp[index].value = value;
        tmp[index].length = value.length;
      }else {
        tmp.push({key:key,value:value,length:value.length});
      }
      setRows(tmp);
      setTimeout(() => {
        setOpenAlert(false);
      }, 2000);
      setOpen(false);
    }
    //reset
    setKey('');
    setValue('');
    setTTL(0);
    setOpen(false);//close dialog
  };

  // @ts-ignore
  return (
    <>
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          }),
        }}
      >

        {numSelected > 0 ? (
          <Typography
            sx={{ flex: '1 1 100%' }}
            color='inherit'
            variant='subtitle1'
            component='div'
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant='h6'
            id='tableTitle'
            component='div'
          >
            Data List

          </Typography>
        )}
        <CustomizedInputBase
          //@ts-ignore
          prop={other} />
        {numSelected == 0 ? (
            <Tooltip title='Add'>
              <IconButton onClick={() => {
                handleClickOpen('add');
              }}>
                <AddCircleIcon />
              </IconButton>
            </Tooltip>)
          : (
            <Tooltip title='EditIcon'>
              <IconButton onClick={() => {
                handleClickOpen('update');
              }}>
                <EditIcon />
              </IconButton>
            </Tooltip>)
        }

        {numSelected > 0 ? (
          <Tooltip title='Delete'>
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title='Delete'>
            <IconButton disabled={true}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{operateType.toUpperCase()}</DialogTitle>
        <Box component='form' onSubmit={handleSubmit} noValidate>
          <DialogContent>
            <DialogContentText>
              {operateType == 'add' ? 'Add a new key-value pair' : 'Update the selected key-value pair'}
            </DialogContentText>
            <TextField
              autoFocus
              margin='dense'
              id='key'
              label='KEY'
              fullWidth
              variant='standard'
              value={operateType == 'add' ? null : selected[0]}
              disabled={operateType == 'add' ? false : true}
              onChange={(e) => {
                handleTextInputChange('key', e);
              }}
            />
            <TextField
              autoFocus
              margin='dense'
              id='value'
              required
              label='VALUE'
              fullWidth
              variant='standard'
              onChange={(e) => {
                handleTextInputChange('value', e);
              }}
            />
            <TextField
              autoFocus
              margin='dense'
              id='ttl'
              label='TTL'
              type='number'
              fullWidth
              variant='standard'
              onChange={(e) => {
                handleTextInputChange('value', e);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type='submit'>Subscribe</Button>
          </DialogActions>
        </Box>

      </Dialog>


      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openAlert}
      >
        <Alert onClose={() => {
          setOpenAlert(false);
        }}      // @ts-ignore
               severity={level} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default function EnhancedTable(props: any) {

  let   [rows, setRows] = React.useState<Data[]>([]);
  const [back, setBack] = React.useState<Data[]>([]);

  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('key');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  React.useEffect(
    () => {
      let data = props.data;
      let tmp = [];
      for (let i in data) {
        tmp.push(createData(i, data[i].length, data[i]));
      }
      setRows(tmp);
      setBack(tmp);
      let ds = props.condition.ds;
      if (ds == 'string') {
        headCells[0].label = 'Key';
      } else if (ds == 'list' || ds == 'set' || ds == 'zset') {
        headCells[0].label = 'Preview';
      }
    }
    , [props.data],
  );

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.key);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;


  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar
            //@ts-ignore
            numSelected={selected.length} rows={rows} setRows={setRows} back={back} ds={props.condition.ds}
            bucket={props.condition.bucket}
            // @ts-ignore
            selected={selected} />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby='tableTitle'
              size={dense ? 'small' : 'medium'}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.key);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    // @ts-ignore
                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.key)}
                        role='checkbox'
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.key}
                        selected={isItemSelected}
                      >
                        <TableCell padding='checkbox'>
                          <Checkbox
                            color='primary'
                            checked={isItemSelected}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          component='th'
                          id={labelId}
                          scope='row'
                          padding='none'

                        >
                          {row.key}
                        </TableCell>

                        <TableCell align='right'>{row.length}</TableCell>

                        <TableCell align='right'>

                          <Message
                            //@ts-ignore
                            rowKey={row.key} value={row.value} />

                        </TableCell>

                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 13 : 23) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component='div'
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label='Dense padding'
        />
      </Box>
    </>
  );
}

