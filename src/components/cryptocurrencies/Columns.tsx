import { ColumnDef } from '@tanstack/react-table';
import { buttonVariants } from '../ui/button';
import { CryptoType } from '@/lib/types';
import { Link } from 'react-router-dom';
import AmountNumber from './AmountNumber';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const Columns: ColumnDef<CryptoType>[] = [
  {
    accessorKey: 'rank',
    header: () => <p className="text-center">Status</p>,
    cell: ({ row }) => {
      const number = parseFloat(row.id) + 1;
      return <p>#{number}</p>;
    },
  },
  {
    accessorKey: 'name',
    header: () => <p className="text-center">Crypto</p>,
  },
  {
    accessorKey: 'shortcut',
    header: () => <p className="text-center">Symbol</p>,
  },
  {
    accessorKey: 'price',
    header: () => <p className="text-center">Current Price</p>,
    cell: ({ row }) => <AmountNumber value={row.getValue('price')} />,
  },
  {
    accessorKey: 'icon',
    header: () => <p className="text-center">Symbol</p>,
    cell: ({ row }) => (
      <img src={row.getValue('icon')} width="20px" className="mx-auto" />
    ),
  },
  {
    accessorKey: 'marketcap',
    header: () => <p className="text-center">MarketCap</p>,
    cell: ({ row }) => <AmountNumber value={row.getValue('marketcap')} />,
  },
  {
    accessorKey: 'increased',
    header: () => <p className="text-center">Change</p>,
    cell: ({ row }) => {
      const change = row.getValue('increased');
      let content;
      if (change) {
        content = <p className="text-[green]">▲</p>;
      } else if (!change && change !== null) {
        content = <p className="text-[red]">▼</p>;
      } else {
        content = <p>•</p>;
      }
      return content;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const id = row.original.id;

      return (
        <Link
          className={`m-0 select-auto ${buttonVariants({
            variant: 'default',
          })}`}
          onClick={() => console.log('działa')}
          to={`/currencies/${id}`}
        >
          More
        </Link>
      );
    },
  },
];
