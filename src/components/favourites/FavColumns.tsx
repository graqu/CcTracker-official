import { ColumnDef } from '@tanstack/react-table';
import { buttonVariants, Button } from '../ui/button';
import { Link } from 'react-router-dom';
import AmountInput from './AmountChangeInput';
import { FavColumnRowType } from '@/lib/types';
import AmountNumber from '../cryptocurrencies/AmountNumber';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const Columns: ColumnDef<FavColumnRowType>[] = [
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
    cell: ({ row }) => {
      const name = row.original.marketData.name;
      return <span>{name}</span>;
    },
  },
  {
    accessorKey: 'icon',
    header: () => <p className="text-center">Symbol</p>,
    cell: ({ row }) => {
      const icon = row.original.marketData.icon;
      return <img src={icon} width="20px" className="mx-auto" />;
    },
  },
  {
    accessorKey: 'price',
    header: () => <p className="text-center">Current Price</p>,
    cell: ({ row }) => {
      const price = row.original.marketData.price;
      return <AmountNumber value={price} />;
    },
  },
  {
    accessorKey: 'increased',
    header: () => <p className="text-center">Change</p>,
    cell: ({ row }) => {
      const change = row.original.marketData.increased;
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
    accessorKey: 'amount',
    header: () => <p className="text-center">Holdings</p>,
    cell: ({ row }) => {
      const id = row.original.id;
      const amountHandlerFn = ( value: number) =>
        row.original.amountChanger(id, value);
      const value = row.original.amount;

      return <AmountInput value={value} onConfirm={amountHandlerFn} />;
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
          to={`/currencies/${id}`}
        >
          More
        </Link>
      );
    },
  },
  {
    id: 'actionsTwo',
    header: () => <p className="text-center">remove</p>,
    cell: ({ row }) => {
      const id = row.original.id;
      const removeHandler = row.original.onRemove;
      return (
        <Button
          size="icon"
          variant="destructive"
          onClick={() => removeHandler(id)}
        >
          X
        </Button>
      );
    },
  },
];
