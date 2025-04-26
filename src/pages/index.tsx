import * as React from "react";
import Head from "next/head";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>FreshHarvest - Fresh Produce Bulk Ordering</title>
        <meta name="description" content="Order fresh vegetables and fruits in bulk from FreshHarvest" />
      </Head>

      <div className="flex flex-col space-y-6">
        <section className="text-center py-10 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
          <h1 className="text-4xl font-bold text-green-800 mb-4">Fresh Farm Produce</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Order quality vegetables and fruits in bulk, delivered fresh from our farms to your door.
          </p>
        </section>

        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Our Products</h2>
          </div>

          <div className="text-center py-20">
            <p>Coming soon! Our product catalog is being prepared.</p>
          </div>
        </section>
      </div>
    </>
  );
}
