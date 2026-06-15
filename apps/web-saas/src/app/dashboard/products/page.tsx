import Link from 'next/link';
import { Plus, Package, QrCode, Send, ChevronRight } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@ronda/ui';

export default function ProductsPage() {
  // In production: fetch from products.list API with org context
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground">Manage your import products and barcodes.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/products/new">
            <Plus className="mr-2 h-4 w-4" /> Add product
          </Link>
        </Button>
      </div>

      {/* Empty state */}
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <Package className="h-14 w-14 text-muted-foreground/30" />
          <div>
            <p className="font-semibold">No products yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your first product to get an AI-suggested description and HS Code,
              then generate a barcode to share with your supplier.
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/products/new">Add first product</Link>
          </Button>
        </CardContent>
      </Card>

      {/* What happens after you add products (preview) */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Package, title: 'AI description', desc: 'We fill in a professional product description from your product name and image.' },
          { icon: QrCode, title: 'Auto barcode', desc: 'A PRD barcode with a signed QR deep link is generated instantly.' },
          { icon: Send, title: 'WhatsApp share', desc: 'Send the barcode to your supplier directly from the platform.' },
        ].map((f) => (
          <Card key={f.title} className="border-dashed">
            <CardContent className="flex flex-col gap-2 p-5">
              <f.icon className="h-6 w-6 text-primary" />
              <p className="font-medium text-sm">{f.title}</p>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
