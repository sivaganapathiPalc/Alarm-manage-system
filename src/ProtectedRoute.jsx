export const withAuth = (Component, allowedRoles = []) => {
  return ({ user, ...props }) => {
    if (!user) {
      return null; // or redirect to login
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      );
    }

    return <Component user={user} {...props} />;
  };
};
