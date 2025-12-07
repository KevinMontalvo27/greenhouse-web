// src/components/common/Table/Table.tsx
import { type ReactNode } from 'react';
import clsx from 'clsx';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  zebra?: boolean;
  pinRows?: boolean;
  pinCols?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  onRowClick?: (item: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export const Table = <T extends Record<string, any>>({
  data,
  columns,
  zebra = false,
  pinRows = false,
  pinCols = false,
  size = 'md',
  onRowClick,
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  className,
}: TableProps<T>) => {
  const tableClasses = clsx(
    'table',
    {
      'table-zebra': zebra,
      'table-pin-rows': pinRows,
      'table-pin-cols': pinCols,
      [`table-${size}`]: size,
    },
    className
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-base-content/60">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className={tableClasses}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={column.className}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.id || index}
              onClick={() => onRowClick?.(item)}
              className={clsx({
                'hover cursor-pointer': onRowClick,
              })}
            >
              {columns.map((column) => (
                <td key={column.key} className={column.className}>
                  {column.render ? column.render(item) : item[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Componentes auxiliares para paginación
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="join">
      <button
        className="join-item btn btn-sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        «
      </button>

      {pages.map((page) => (
        <button
          key={page}
          className={clsx('join-item btn btn-sm', {
            'btn-active': page === currentPage,
          })}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="join-item btn btn-sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        »
      </button>
    </div>
  );
};