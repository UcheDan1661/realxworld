import Link from 'next/link';

interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  image: string;
}

const properties: Property[] = [
  {
    id: 1,
    title: 'Modern Family Home',
    location: 'Downtown, New York',
    price: '$450,000',
    image: '/api/placeholder/400/300',
  },
  {
    id: 2,
    title: 'Luxury Apartment',
    location: 'Manhattan, New York',
    price: '$750,000',
    image: '/api/placeholder/400/300',
  },
  {
    id: 3,
    title: 'Cozy Suburban House',
    location: 'Brooklyn, New York',
    price: '$380,000',
    image: '/api/placeholder/400/300',
  },
];

export default function FeaturedProperties() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Featured Properties
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Image Placeholder */}
              <div className="w-full h-64 bg-linear-to-br from-blue-200 to-indigo-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                <svg
                  className="w-24 h-24 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {property.price}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {property.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {property.location}
                </p>
                <Link
                  href={`/properties/${property.id}`}
                  className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

