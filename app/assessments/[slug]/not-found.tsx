export default function AssessmentNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto h-16 w-16 bg-primary-600 rounded-lg flex items-center justify-center mb-6">
          <span className="text-white font-bold text-2xl">PS</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Assessment Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          The assessment you're looking for doesn't exist or is no longer
          available. Please check the URL and try again.
        </p>
        <p className="text-sm text-gray-500">
          If you believe this is an error, please contact Product School support.
        </p>
      </div>
    </div>
  );
}
