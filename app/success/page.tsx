import Link from "next/link"
import { CheckCircle, Package, Truck } from "lucide-react"

export default function SuccessPage() {
  const orderNumber = "FLY" + Math.random().toString(36).substr(2, 9).toUpperCase()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <CheckCircle size={80} className="mx-auto text-green-500" />
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Thank you for your purchase. Your order has been confirmed and will be processed shortly.
        </p>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Order Number:</span>
              <span className="font-medium">{orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Order Date:</span>
              <span className="font-medium">{new Date().toLocaleDateString("id-ID")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Delivery:</span>
              <span className="font-medium">
                {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("id-ID")}
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex flex-col items-center p-6 border border-gray-200 rounded-lg">
            <Package size={40} className="text-rose-600 mb-3" />
            <h3 className="font-semibold mb-2">Order Processing</h3>
            <p className="text-sm text-gray-600 text-center">
              We'll send you an email confirmation with tracking details once your order ships.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 border border-gray-200 rounded-lg">
            <Truck size={40} className="text-rose-600 mb-3" />
            <h3 className="font-semibold mb-2">Fast Delivery</h3>
            <p className="text-sm text-gray-600 text-center">
              Your order will be delivered within 5-7 business days to your specified address.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/catalog"
            className="bg-rose-600 text-white px-8 py-3 rounded-md hover:bg-rose-700 transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/profile"
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-md hover:bg-gray-50 transition-colors"
          >
            View Order History
          </Link>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600">
            Need help with your order?{" "}
            <a href="mailto:support@fashly.com" className="text-rose-600 hover:text-rose-700">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
