'use client';

// React Imports
import React, { useState, useEffect, useMemo, useCallback } from 'react';

// Next Imports
import { useParams, useRouter } from 'next/navigation';

// MUI Imports
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';

// Third‐party Imports
import classnames from 'classnames';
import { rankItem } from '@tanstack/match-sorter-utils';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel
} from '@tanstack/react-table';

// Session
import { useSession } from 'next-auth/react';

// Component Imports
import OptionMenu from '@core/components/option-menu';

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n';

// Style Imports
import tableStyles from '@core/styles/table.module.css';


// fuzzy search filter fn
const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  
  addMeta({ itemRank });
   
  return itemRank.passed;
};

// Debounced input component
function DebouncedInput({ value: initialValue, onChange, debounce = 500, ...props }) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);
    
    return () => clearTimeout(timeout);
  }, [value, onChange, debounce]);

  return (
    <TextField
      {...props}
      value={value}
      onChange={e => setValue(e.target.value)}
      size="small"
    />
  );
}


const ManageTiersPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { lang: locale } = useParams();

  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [globalFilter, setGlobalFilter] = useState('');

  // fetch tiers
  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated' ||
        (session && session.user.role !== 'SUPER_ADMIN')) {
      setLoading(false);
      
      return;
    }

    const fetchTiers = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch('/api/admin/pricing-tiers');
        
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          
          throw new Error(errData.message || `Failed: ${res.statusText}`);
        }

        const data = await res.json();

        setTiers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTiers();
  }, [session, status]);


  // Handlers
  const handleCreateTier = () => {
    router.push(getLocalizedUrl('/admin/manage-tiers/create', locale));
  };

  const handleEditTier = useCallback(
    tierId => {
      router.push(getLocalizedUrl(`/admin/manage-tiers/edit/${tierId}`, locale));
    },
    [router, locale]
  );

  const handleDeleteTier = useCallback(
    async tierId => {
      console.log(`Delete Tier: ${tierId} - TODO`);
      
      // implement delete…
    },
    []
  );


  // Column setup
  const columnHelper = useMemo(() => createColumnHelper(), []);

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('price', {
        header: 'Price (USD)',
        cell: info => (info.getValue() / 100).toFixed(2)
      }),
      columnHelper.accessor('features', {
        header: 'Features',
        cell: info => {
          const feats = info.getValue();

          return Array.isArray(feats) && feats.length > 0 ? (
            <ul>{feats.map((f, i) => <li key={i}>{f}</li>)}</ul>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No features
            </Typography>
          );
        },
        enableSorting: false
      }),
      columnHelper.accessor('stripePriceId', {
        header: 'Stripe Price ID',
        cell: info => info.getValue() || 'N/A'
      }),
      columnHelper.accessor('id', {
        header: 'Actions',
        cell: ({ row }) => (
          <OptionMenu
            iconButtonProps={{ size: 'small' }}
            options={[
              {
                text: 'Edit',
                icon: <i className="ri-pencil-line text-[22px]" />,
                menuItemProps: { onClick: () => handleEditTier(row.original.id) }
              },
              {
                text: 'Delete',
                icon: <i className="ri-delete-bin-line text-[22px]" />,
                menuItemProps: { onClick: () => handleDeleteTier(row.original.id) }
              }
            ]}
          />
        ),
        enableSorting: false
      })
    ],
    [columnHelper, handleEditTier, handleDeleteTier]
  );


  const table = useReactTable({
    data: tiers,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { globalFilter },
    initialState: { pagination: { pageSize: 10 } },
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });


  if (status === 'loading' || loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return (
      <Typography color="error">
        Access Denied. You must be a Super Admin to view this page.
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography color="error">
        Error loading tiers: {error}
      </Typography>
    );
  }

  return (
    <Card>
      <CardContent className="flex justify-between max-sm:flex-col sm:items-center gap-4">
        <DebouncedInput
          value={globalFilter}
          onChange={value => setGlobalFilter(String(value))}
          placeholder="Search Tier"
          className="sm:is-auto is-full"
        />
        <Button variant="contained" color="primary" onClick={handleCreateTier}>
          Create New Tier
        </Button>
      </CardContent>

      <div className="overflow-x-auto">
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={classnames({
                          'flex items-center': header.column.getIsSorted(),
                          'cursor-pointer select-none': header.column.getCanSort()
                        })}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <i className="ri-arrow-up-s-line text-xl" />,
                          desc: <i className="ri-arrow-down-s-line text-xl" />
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {table.getFilteredRowModel().rows.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  No tiers found.
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  className={classnames({ [tableStyles.selectedRow]: row.getIsSelected() })}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        className="border-bs"
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => table.setPageIndex(page)}
        onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
      />
    </Card>
  );
};

export default ManageTiersPage;
