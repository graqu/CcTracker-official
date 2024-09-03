import { ColumnDef } from '@tanstack/react-table';
import { Skeleton } from './skeleton';
import { SkeletonDataT } from '@/lib/SkeletonTableData';
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const ColumnsSkeleton: ColumnDef<SkeletonDataT>[] = [
  {
    accessorKey: 'id1',
    header: () => <Skeleton className="w-full h-[16px] rounded-[100px]" />,
    cell: () => {
      return <Skeleton className="w-full h-[16px] rounded-[100px]" />;
    },
  },
];
