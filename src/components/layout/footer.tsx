export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">FreshBulk</h2>
            <p className="text-gray-600 mb-4">
              Your trusted partner for bulk vegetable and fruit ordering. Fresh from the farm to your business.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-600 hover:text-green-600">Home</a>
              </li>
              <li>
                <a href="/orders" className="text-gray-600 hover:text-green-600">My Orders</a>
              </li>
              <li>
                <a href="/auth" className="text-gray-600 hover:text-green-600">Login / Register</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <address className="not-italic text-gray-600">
              <p>123 Fresh Street</p>
              <p>Farmland, Produce County</p>
              <p className="mt-2">Email: info@freshbulk.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} FreshBulk. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
