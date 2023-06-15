import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import LinearProgress from '@mui/material/LinearProgress';
import PropTypes from 'prop-types';
import TableOverlay from './TableOverlay';
import { Box } from '@mui/material';

const columns = [
  { field: 'can_id', headerName: 'ID' },
  { field: 'can_nombre', headerName: 'First Name', width: 200 },
  { field: 'can_apellido', headerName: 'Last Name', width: 200 },
  {
    field: 'can_correo',
    headerName: 'Email',
    width: 300,
    sortable: false
  },
  {
    field: '_NombreDepartamento',
    headerName: 'Department',
    width: 250
  },
  {
    field: '_NombreJerarquia',
    headerName: 'Hierarchy',
    width: 250,
  },
  {
    field: '_CodigoCargo',
    headerName: 'Position',
    width: 250,
  },
  {
    field: '_NombreSucursal',
    headerName: 'Work Branch',
    width: 200
  },
];


export default function DataTable({ data, selectValue, setSelected }) {
  const rows = data.data.colaboradores.filter(el => (!selectValue.department !== "" && el._NombreDepartamento.includes(selectValue.department))
    && (!selectValue.hierarchy !== "" && el._NombreJerarquia.includes(selectValue.hierarchy)) && (!selectValue.position !== "" && el._CodigoCargo.includes(selectValue.position)) && (!selectValue.workBranch !== "" && el._NombreSucursal.includes(selectValue.workBranch))
  );

  return (
    <Box component="div" sx={{ width: '100%' }} >

      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.can_id}
        autoHeight={true}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        slots={{
          loadingOverlay: LinearProgress,
          noRowsOverlay: TableOverlay,
        }}
        onRowSelectionModelChange={(row) => setSelected(row)}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        loading={false}
        disableColumnFilter
        disableColumnMenu
      />
    </Box>
  );
}


DataTable.propTypes = {
  data: PropTypes.object.isRequired,
  selectValue: PropTypes.object.isRequired
}


