const Skeleton = ({ className = "", children }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}>
      {children}
    </div>
  );
};

export const EventDetailsSkeleton = () => {
  return (
    <div className="p-8 flex justify-center">
      <div className="max-w-7xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Event Card Skeleton */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden mb-8">
              <div className="p-8">
                {/* Status Badges */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-20 rounded-full" />
                    <Skeleton className="h-8 w-24 rounded-full" />
                  </div>
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>

                {/* Title */}
                <Skeleton className="h-10 w-3/4 mb-4" />
                
                {/* Description */}
                <div className="space-y-2 mb-8">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>

                {/* Event Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex items-center p-4 bg-gray-50 rounded-xl">
                        <Skeleton className="w-12 h-12 rounded-xl mr-4" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-16 mb-2" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex items-center p-4 bg-gray-50 rounded-xl">
                        <Skeleton className="w-12 h-12 rounded-xl mr-4" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-16 mb-2" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form Skeleton */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="mb-6">
                <Skeleton className="h-4 w-32 mb-3" />
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-3 w-24 mt-2" />
              </div>
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>

          {/* Right Sidebar Skeleton */}
          <div className="space-y-6">
            {/* Organizer Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <Skeleton className="w-12 h-12 rounded-xl mr-4" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>

            {/* Availability Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full rounded-full" />
            </div>

            {/* Bookings Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <Skeleton className="h-5 w-16 mb-4" />
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-8" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-8" />
                </div>
              </div>
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const EventBookingsSkeleton = () => {
  return (
    <div className="p-8">
      {/* Event Info Skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <Skeleton className="h-8 w-64 mb-2" />
        <div className="flex items-center space-x-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div className="ml-4">
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bookings Table Skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <Skeleton className="h-6 w-32" />
        </div>
        
        <div className="divide-y divide-gray-200">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="px-6 py-4">
              <div className="grid grid-cols-5 gap-4 items-center">
                <div className="flex items-center">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="ml-4">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-16" />
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-16 rounded" />
                  <Skeleton className="h-8 w-16 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skeleton;