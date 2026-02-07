import { Package, Shield, Truck } from "lucide-react";

function FeaturesSection() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="bg-purple-100 p-4 rounded-xl">
              <Truck className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">
                Free Shipping
              </h3>
              <p className="text-gray-600">On orders over $50</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-4 rounded-xl">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">
                Secure Payment
              </h3>
              <p className="text-gray-600">100% secure transactions</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-green-100 p-4 rounded-xl">
              <Package className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">
                Easy Returns
              </h3>
              <p className="text-gray-600">30-day return policy</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
