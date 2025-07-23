import { db } from '@comp/db';
import { Card, CardContent, CardHeader, CardTitle } from '@comp/ui/card';
import { T } from 'gt-next';
import { StatusChart } from './status-chart';
interface Props {
  organizationId: string;
}

export async function VendorsByStatus({ organizationId }: Props) {
  const vendors = await getVendorsByStatus(organizationId);

  const data = vendors.map((vendor) => ({
    name: vendor.status,
    value: vendor._count,
  }));

  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle><T>Vendor Status</T></CardTitle>
      </CardHeader>
      <CardContent className="w-full">
        <StatusChart data={data} />
      </CardContent>
    </Card>
  );
}

const getVendorsByStatus = async (organizationId: string) => {
  return await db.vendor.groupBy({
    by: ['status'],
    where: { organizationId },
    _count: true,
  });
};
