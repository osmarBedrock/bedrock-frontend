'use client';

import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import type { TableProps } from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { TableContainer, TablePagination } from '@mui/material';

export interface ColumnDef<TRowModel> {
  align?: 'left' | 'right' | 'center';
  field?: keyof TRowModel;
  formatter?: (row: TRowModel, index: number) => React.ReactNode;
  hideName?: boolean;
  name: string;
  width?: number | string;
}

type RowId = number | string;

export interface DataTableProps<TRowModel> extends Omit<TableProps, 'onClick'> {
  columns: ColumnDef<TRowModel>[];
  hideHead?: boolean;
  hover?: boolean;
  onClick?: (event: React.MouseEvent, row: TRowModel) => void;
  onDeselectAll?: (event: React.ChangeEvent) => void;
  onDeselectOne?: (event: React.ChangeEvent, row: TRowModel) => void;
  onSelectAll?: (event: React.ChangeEvent) => void;
  onSelectOne?: (event: React.ChangeEvent, row: TRowModel) => void;
  rows: TRowModel[];
  selectable?: boolean;
  selected?: Set<RowId>;
  uniqueRowId?: (row: TRowModel) => RowId;
}


export function DataTable<TRowModel extends object & { id?: RowId | null }>({
  columns,
  hideHead,
  hover,
  onClick,
  onDeselectAll,
  onDeselectOne,
  onSelectOne,
  onSelectAll,
  rows,
  selectable,
  selected,
  uniqueRowId,
  ...props
}: DataTableProps<TRowModel>): React.JSX.Element {
  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;
  const [rowsPerPage, setRowsPerPage] = React.useState(7);
  const [page, setPage] = React.useState(0);

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = React.useMemo(
    () =>
      [...rows].slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage, rows],
  );

  return (
    <>
      <TableContainer>
        <Table {...props}>
          <TableHead sx={{ ...(hideHead && { visibility: 'collapse', '--TableCell-borderWidth': 0 }) }}>
            <TableRow>
              {selectable ? (
                <TableCell padding="checkbox" sx={{ width: '40px', minWidth: '40px', maxWidth: '40px' }}>
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(event: React.ChangeEvent) => {
                      if (selectedAll) {
                        onDeselectAll?.(event);
                      } else {
                        onSelectAll?.(event);
                      }
                    }}
                  />
                </TableCell>
              ) : null}
              {columns.map(
                (column): React.JSX.Element => (
                  <TableCell
                    key={column.name}
                    sx={{
                      width: column.width,
                      minWidth: column.width,
                      maxWidth: column.width,
                      ...(column.align && { textAlign: column.align }),
                    }}
                  >
                    {column.hideName ? null : column.name}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((row, index): React.JSX.Element => {
              const rowId = row.id ? row.id : uniqueRowId?.(row);
              const rowSelected = rowId ? selected?.has(rowId) : false;

              return (
                <TableRow
                  hover={hover}
                  key={rowId ?? index}
                  selected={rowSelected}
                  {...(onClick && {
                    onClick: (event: React.MouseEvent) => {
                      onClick(event, row);
                    },
                  })}
                  sx={{ ...(onClick && { cursor: 'pointer' }) }}
                >
                  {selectable ? (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={rowId ? rowSelected : false}
                        onChange={(event: React.ChangeEvent) => {
                          if (rowSelected) {
                            onDeselectOne?.(event, row);
                          } else {
                            onSelectOne?.(event, row);
                          }
                        }}
                        onClick={(event: React.MouseEvent) => {
                          if (onClick) {
                            event.stopPropagation();
                          }
                        }}
                      />
                    </TableCell>
                  ) : null}
                  {columns.map(
                    (column): React.JSX.Element => (
                      <TableCell key={column.name} sx={{ ...(column.align && { textAlign: column.align }) }}>
                        {
                          (column.formatter
                            ? column.formatter(row, index)
                            : column.field
                              ? row[column.field]
                              : null) as React.ReactNode
                        }
                      </TableCell>
                    )
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
      rowsPerPageOptions={[7, 10, 25]}
      component="div"
      count={rows.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}
