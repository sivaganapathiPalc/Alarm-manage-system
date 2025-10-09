import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedDeviceType,
  setActiveTab,
  setAlarmFilters,
  resetAlarmFilters,
  setDeviceFilters,
  addSavedView,
  deleteSavedView,
} from "../store/slices/appSlice";
import { hasAccess, PERMISSIONS } from "../common/permission";
import { selectUser } from "../store/slices/authSlice";
import { Eye } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

function DeviceTypeSelector({
  selectedDeviceType,
  onDeviceTypeChange,
  onRefreshClick,
}) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const devices = [
    {
      id: "sonic",
      icon: "🌐",
      name: "Sonic",
      description: "Core Routing Switch",
    },
    {
      id: "exaware",
      icon: "🛡️",
      name: "Exaware",
      description: "Security Gateway",
    },
    {
      id: "octenix",
      icon: "🔗",
      name: "Octenix",
      description: "Core Network Switch",
    },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefreshClick(() => {
      setIsRefreshing(false);
    });
  };

  return (
    <div className="mb-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Device Type</h2>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${isRefreshing ? "cursor-not-allowed bg-gray-300 text-gray-500" : "bg-blue-500 text-white hover:bg-blue-600"}`}
        >
          <svg
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {isRefreshing ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>
      <div className="flex flex-wrap gap-4">
        {devices.map((device) => (
          <button
            key={device.id}
            onClick={() => onDeviceTypeChange(device.id)}
            className={
              selectedDeviceType === device.id
                ? "flex min-w-64 items-center space-x-3 rounded-lg bg-blue-500 px-6 py-4 font-medium text-white shadow-lg"
                : "flex min-w-64 items-center space-x-3 rounded-lg border bg-white px-6 py-4 font-medium text-gray-700 hover:bg-gray-100"
            }
          >
            <span className="text-2xl">{device.icon}</span>
            <div className="text-left">
              <div className="font-bold">{device.name}</div>
              <div
                className={
                  selectedDeviceType === device.id
                    ? "text-xs text-white opacity-90"
                    : "text-xs text-gray-500"
                }
              >
                {device.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function AlarmStatistics({ stats }) {
  return (
    <div className="mb-6">
      <h2 className="mb-4 text-xl font-semibold">Alarm Statistics</h2>
      <div className="flex flex-wrap gap-4">
        <div className="min-w-32 rounded-lg bg-white p-4 text-center shadow">
          <h3 className="text-xl font-bold text-blue-600">{stats.total}</h3>
          <p className="text-sm text-gray-600">Total</p>
        </div>
        <div className="min-w-32 rounded-lg bg-white p-4 text-center shadow">
          <h3 className="text-xl font-bold text-red-600">{stats.critical}</h3>
          <p className="text-sm text-gray-600">Critical</p>
        </div>
        <div className="min-w-32 rounded-lg bg-white p-4 text-center shadow">
          <h3 className="text-xl font-bold text-orange-600">{stats.chassis}</h3>
          <p className="text-sm text-gray-600">Chassis</p>
        </div>
        <div className="min-w-32 rounded-lg bg-white p-4 text-center shadow">
          <h3 className="text-xl font-bold text-blue-600">{stats.interface}</h3>
          <p className="text-sm text-gray-600">Interface</p>
        </div>
        <div className="min-w-32 rounded-lg bg-white p-4 text-center shadow">
          <h3 className="text-xl font-bold text-purple-600">
            {stats.system}
          </h3>
          <p className="text-sm text-gray-600">System</p>
        </div>
        <div className="min-w-32 rounded-lg bg-white p-4 text-center shadow">
          <h3 className="text-xl font-bold text-gray-600">{stats.cleared}</h3>
          <p className="text-sm text-gray-600">Cleared</p>
        </div>
      </div>
    </div>
  );
}

function Filters({ filters, onFilterChange, onResetFilters, canReset }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {canReset && (
          <button
            onClick={onResetFilters}
            className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
          >
            Reset
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-4">
        <select
          value={filters.severity}
          onChange={(e) =>
            onFilterChange({ ...filters, severity: e.target.value })
          }
          className="rounded-md border p-2 text-sm"
        >
          <option value="all">All Severities</option>
          <option value="Critical">Critical</option>
          <option value="Major">Major</option>
          <option value="Minor">Minor</option>
          <option value="Warning">Warning</option>
        </select>
        <select
          value={filters.status}
          onChange={(e) =>
            onFilterChange({ ...filters, status: e.target.value })
          }
          className="rounded-md border p-2 text-sm"
        >
          <option value="all">All Statuses</option>
          <option value="New">New</option>
          <option value="Acknowledged">Acknowledged</option>
          <option value="Assigned">Assigned</option>
          <option value="Resolved">Resolved</option>
        </select>
        {/* <select
          value={filters.type}
          onChange={(e) => onFilterChange({ ...filters, type: e.target.value })}
          className="rounded-md border p-2 text-sm"
        >
          <option value="all">All Types</option>
          <option value="Chassis">Chassis</option>
          <option value="Interface">Interface</option>
        </select> */}
        <input
          type="text"
          placeholder="Search..."
          value={filters.search}
          onChange={(e) =>
            onFilterChange({ ...filters, search: e.target.value })
          }
          className="rounded-md border p-2 text-sm"
        />
      </div>
    </div>
  );
}

function SavedViews({
  savedViews,
  onApplyView,
  onDeleteView,
  onSaveNew,
  canSaveCurrentView,
  currentFilters,
  uRole
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [viewToDelete, setViewToDelete] = useState(null);

  const isViewActive = (view) => {
    return (
      view.filters.severity === currentFilters.severity &&
      view.filters.status === currentFilters.status &&
      view.filters.type === currentFilters.type &&
      view.filters.search === currentFilters.search
    );
  };

  const handleDeleteClick = (view) => {
    setViewToDelete(view);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (viewToDelete) {
      onDeleteView(viewToDelete.id);
      setShowDeleteConfirm(false);
      setViewToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setViewToDelete(null);
  };

  return (
    <>
      {hasAccess(uRole?.role, PERMISSIONS.SAVE_FILTERS) && (
        <div className="rounded-lg bg-white p-4 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Saved Views</h3>
            <button
              onClick={onSaveNew}
              disabled={!canSaveCurrentView}
              className={
                canSaveCurrentView
                  ? "rounded bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600"
                  : "cursor-not-allowed rounded bg-gray-300 px-4 py-2 text-sm text-gray-500"
              }
            >
              + Save Current View
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {savedViews.map((view) => (
              <div
                key={view.id}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 transition-colors hover:border-gray-300"
              >
                <button
                  onClick={() => onApplyView(view)}
                  className={
                    isViewActive(view)
                      ? "rounded-l-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white"
                      : "rounded-l-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  }
                >
                  {view.name}
                </button>
                <button
                  onClick={() => handleDeleteClick(view)}
                  className="pr-3 text-lg leading-none text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </div>
            ))}
            {savedViews.length === 0 && (
              <p className="text-sm italic text-gray-500">
                No saved views yet. Apply filters and save your first view.
              </p>
            )}
          </div>
        </div>
      )}

      {showDeleteConfirm && viewToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-3 text-lg font-bold text-gray-900">
              Delete Saved View
            </h3>
            <p className="mb-2 text-gray-700">
              Are you sure you want to delete the saved view:
            </p>
            <p className="mb-4 font-medium text-blue-600">
              "{viewToDelete.name}"?
            </p>
            <p className="mb-6 text-sm text-gray-500">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 rounded bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="flex-1 rounded bg-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  pageSizeOptions,
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className="mx-1 rounded bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300"
        >
          1
        </button>,
      );
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="px-2 text-gray-500">
            ...
          </span>,
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`mx-1 rounded px-3 py-1 text-sm ${
            i === currentPage
              ? "bg-blue-500 font-medium text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {i}
        </button>,
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="px-2 text-gray-500">
            ...
          </span>,
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className="mx-1 rounded bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300"
        >
          {totalPages}
        </button>,
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between border-t px-4 py-3">
      <div className="flex items-center space-x-4">
        <select
          value={itemsPerPage}
          onChange={(e) => {
            onItemsPerPageChange(Number(e.target.value));
            onPageChange(1);
          }}
          className="rounded border p-1 text-sm"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-700">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
          {totalItems.toLocaleString()}
        </p>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="mx-1 rounded bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ← Previous
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="mx-1 rounded bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

function AlarmsDataTable({
  alarms,
  loading,
  selectedAlarms,
  onSelectAll,
  onSelectAlarm,
  onViewAlarm,
  getTypeColor,
  getSeverityColor,
  getStatusColor,
  isAdmin,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            
            {/* {isAdmin === 'admin' && (
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  onChange={(e) => onSelectAll(e.target.checked)}
                  checked={
                    selectedAlarms.size === alarms.length && alarms.length > 0
                  }
                  className="rounded"
                />
              </th>
            )} */}

            
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  onChange={(e) => onSelectAll(e.target.checked)}
                  checked={
                    selectedAlarms.size === alarms.length && alarms.length > 0
                  }
                  className="rounded"
                />
              </th>
            

            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
              Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
              Severity
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
              Title
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
              Description
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
              Source
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {loading ? (
            <tr>
              <td colSpan={isAdmin ? 7 : 6} className="px-4 py-8 text-center">
                Loading...
              </td>
            </tr>
          ) : alarms.length === 0 ? (
            <tr>
              <td
                colSpan={isAdmin ? 7 : 6}
                className="px-4 py-8 text-center text-gray-500"
              >
                No alarms
              </td>
            </tr>
          ) : (
            alarms.map((alarm) => (
              <tr key={alarm.id} className="hover:bg-gray-50">
                {/* {isAdmin === 'admin' && (
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedAlarms.has(alarm.id)}
                      onChange={(e) =>
                        onSelectAlarm(alarm.id, e.target.checked)
                      }
                      className="rounded"
                    />
                  </td>
                )} */}
                
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedAlarms.has(alarm.id)}
                      onChange={(e) =>
                        onSelectAlarm(alarm.id, e.target.checked)
                      }
                      className="rounded"
                    />
                  </td>
                
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs ${getTypeColor(alarm.type)}`}
                  >
                    {alarm.type}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs ${getSeverityColor(alarm.severity)}`}
                  >
                    {alarm.severity}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm">{alarm.title}</td>
                <td className="px-4 py-4 text-sm">{alarm.description}</td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs ${getStatusColor(alarm.status)}`}
                  >
                    {alarm.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm">{alarm.source}</td>
                <td className="px-4 py-4">
                  {/* <button
                    onClick={() => onViewAlarm(alarm)}
                    className="rounded bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600"
                  >
                    View
                  </button> */}
                  <Eye onClick={() => onViewAlarm(alarm)} className="cursor-pointer"/>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function DeviceInventoryTable({ devices, loading, getStatusColor }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
              Device ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
              Model
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
              Location
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {loading ? (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center">
                Loading...
              </td>
            </tr>
          ) : (
            devices.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 text-sm">{d.deviceId}</td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs ${getStatusColor(d.status)}`}
                  >
                    {d.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm">{d.model}</td>
                <td className="px-4 py-4 text-sm">{d.location}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function AlarmsTab(props) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 md:flex-row md:items-center">
        
        <Filters
          filters={props.filters}
          onFilterChange={props.onFilterChange}
          onResetFilters={props.onResetFilters}
          canReset={props.canReset}
        />
        
        <div className="md:ml-4 md:flex-1">
          
          <SavedViews
            savedViews={props.savedViews}
            onApplyView={props.onApplyView}
            onDeleteView={props.onDeleteView}
            onSaveNew={props.onSaveNew}
            canSaveCurrentView={props.canSaveCurrentView}
            currentFilters={props.filters}
            uRole={props.userProfile}
          />
        </div>
      </div>

      {/* {props.isAdmin && props.selectedAlarms.size > 0 && ( */}
      {props.selectedAlarms.size > 0 && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-blue-700">
              {props.selectedAlarms.size} selected
            </span>
            <div className="flex space-x-2"> 
              {hasAccess(props.userProfile?.role, PERMISSIONS.ACKNOWLEDGE) && (
              <button
                onClick={() => props.onBulkAction("acknowledge")}
                className="rounded bg-yellow-500 px-3 py-1 text-sm text-white"
              >
                Acknowledge
              </button>
              )}
              {hasAccess(props.userProfile?.role, PERMISSIONS.ASSIGN) && (
              <button
                onClick={() => props.onBulkAction("assign")}
                className="rounded bg-blue-500 px-3 py-1 text-sm text-white"
              >
                Assign
              </button>
              )}
               {hasAccess(props.userProfile?.role, PERMISSIONS.RESOLVE) && (
              <button
                onClick={() => props.onBulkAction("resolve")}
                className="rounded bg-green-500 px-3 py-1 text-sm text-white"
              >
                Resolve
              </button>
               )}
               {hasAccess(props.userProfile?.role, PERMISSIONS.CLEAR) && (
              <button
                onClick={() => props.onBulkAction("clear")}
                className="rounded bg-gray-500 px-3 py-1 text-sm text-white"
              >
                Clear
              </button>
               )}
            </div>
          </div>
        </div>
      )}
      <div className="rounded-lg bg-white shadow">
        <div className="border-b p-4">
          <h3 className="text-lg font-semibold">
            Alarms ({props.filteredAlarms.length})
           
          </h3>
        </div>
        <AlarmsDataTable
          alarms={props.currentAlarms}
          loading={props.loading}
          selectedAlarms={props.selectedAlarms}
          onSelectAll={props.onSelectAll}
          onSelectAlarm={props.onSelectAlarm}
          onViewAlarm={props.onViewAlarm}
          getTypeColor={props.getTypeColor}
          getSeverityColor={props.getSeverityColor}
          getStatusColor={props.getStatusColor}
          isAdmin={props.isAdmin}
        
        />
        <Pagination
          currentPage={props.alarmCurrentPage}
          totalItems={props.filteredAlarms.length}
          itemsPerPage={props.alarmsPerPage}
          onPageChange={props.onAlarmPageChange}
          onItemsPerPageChange={props.onAlarmsPerPageChange}
          pageSizeOptions={[25, 50, 100]}
        />
      </div>
    </div>
  );
}

function DeviceInventoryTab(props) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-4 shadow">
        <h3 className="mb-4 text-lg font-semibold">Filters</h3>
        <div className="flex gap-4">
          <select
            value={props.deviceFilters.status}
            onChange={(e) =>
              props.onDeviceFilterChange({
                ...props.deviceFilters,
                status: e.target.value,
              })
            }
            className="rounded-md border p-2 text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
          <input
            type="text"
            placeholder="Search..."
            value={props.deviceFilters.search}
            onChange={(e) =>
              props.onDeviceFilterChange({
                ...props.deviceFilters,
                search: e.target.value,
              })
            }
            className="rounded-md border p-2 text-sm"
          />
        </div>
      </div>
      <div className="rounded-lg bg-white shadow">
        <div className="border-b p-4">
          <h3 className="text-lg font-semibold">
            Devices ({props.filteredDevices.length.toLocaleString()})
          </h3>
        </div>
        <DeviceInventoryTable
          devices={props.currentDevices}
          loading={props.loading}
          getStatusColor={props.getStatusColor}
        />
        <Pagination
          currentPage={props.deviceCurrentPage}
          totalItems={props.filteredDevices.length}
          itemsPerPage={props.devicesPerPage}
          onPageChange={props.onDevicePageChange}
          onItemsPerPageChange={props.onDevicesPerPageChange}
          pageSizeOptions={[100, 500, 1000]}
        />
      </div>
    </div>
  );
}

function DashboardTab({ selectedDeviceType, stats }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold">Network Health Overview</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-green-50 p-4 text-center">
            <div className="mx-auto mb-2 h-4 w-4 rounded-full bg-green-500" />
            <div className="text-sm font-medium">Core Network</div>
            <div className="font-bold text-green-600">ONLINE</div>
          </div>
          <div className="rounded-lg border bg-yellow-50 p-4 text-center">
            <div className="mx-auto mb-2 h-4 w-4 rounded-full bg-yellow-500" />
            <div className="text-sm font-medium">Edge Devices</div>
            <div className="font-bold text-yellow-600">WARNING</div>
          </div>
          <div className="rounded-lg border bg-blue-50 p-4 text-center">
            <div className="mx-auto mb-2 h-4 w-4 rounded-full bg-blue-500" />
            <div className="text-sm font-medium">Security Systems</div>
            <div className="font-bold text-blue-600">MONITORING</div>
          </div>
          <div className="rounded-lg border bg-green-50 p-4 text-center">
            <div className="mx-auto mb-2 h-4 w-4 rounded-full bg-green-500" />
            <div className="text-sm font-medium">Backup Systems</div>
            <div className="font-bold text-green-600">READY</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold">
            Alarm Distribution by Type
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Chassis</span>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-24 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-red-500"
                    style={{
                      width: `${stats.total > 0 ? (stats.chassis / stats.total) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
                <span className="w-8 text-right text-sm text-gray-600">
                  {stats.chassis}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Interface</span>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-24 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{
                      width: `${stats.total > 0 ? (stats.interface / stats.total) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
                <span className="w-8 text-right text-sm text-gray-600">
                  {stats.interface}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">System</span>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-24 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-purple-500"
                    style={{
                      width: `${stats.total > 0 ? (stats.security / stats.total) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
                <span className="w-8 text-right text-sm text-gray-600">
                  {stats.security}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Critical</span>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-24 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-red-600"
                    style={{
                      width: `${stats.total > 0 ? (stats.critical / stats.total) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
                <span className="w-8 text-right text-sm text-gray-600">
                  {stats.critical}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold">System Performance</h3>
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between">
                <span className="text-sm font-medium">Network Uptime</span>
                <span className="text-sm text-gray-500">99.2%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-green-500"
                  style={{ width: "99.2%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between">
                <span className="text-sm font-medium">Response Time</span>
                <span className="text-sm text-gray-500">85ms</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-yellow-500"
                  style={{ width: "70%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between">
                <span className="text-sm font-medium">Error Rate</span>
                <span className="text-sm text-gray-500">0.8%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-red-500"
                  style={{ width: "8%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="mt-2 h-2 w-2 rounded-full bg-red-500" />
            <div className="flex-1">
              <p className="text-sm font-medium">
                Critical chassis alarm triggered
              </p>
              <p className="text-xs text-gray-500">
                Power supply failure on {selectedDeviceType}-001 - 5 minutes ago
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="mt-2 h-2 w-2 rounded-full bg-orange-500" />
            <div className="flex-1">
              <p className="text-sm font-medium">
                Interface link down detected
              </p>
              <p className="text-xs text-gray-500">
                Network connection lost on {selectedDeviceType}-045 - 12 minutes
                ago
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const MasterPage = () => {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);


  // Get state from Redux store
  const selectedDeviceType = useSelector(
    (state) => state.app.selectedDeviceType,
  );
  const activeTab = useSelector((state) => state.app.activeTab);
  const filters = useSelector((state) => state.app.alarmFilters);
  const deviceFilters = useSelector((state) => state.app.deviceFilters);
  const savedViews = useSelector((state) => state.app.savedViews);
  const userRole = useSelector((state) => state.auth.user?.role || "user");

  const isAdmin = userRole === "admin";

  // Local component state (not persisted)
  const [alarms, setAlarms] = useState([]);
  const [filteredAlarms, setFilteredAlarms] = useState([]);
  const [selectedAlarms, setSelectedAlarms] = useState(new Set());
  const [devices, setDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alarmCurrentPage, setAlarmCurrentPage] = useState(1);
  const [deviceCurrentPage, setDeviceCurrentPage] = useState(1);
  const [alarmsPerPage, setAlarmsPerPage] = useState(25);
  const [devicesPerPage, setDevicesPerPage] = useState(100);
  const [showSaveViewModal, setShowSaveViewModal] = useState(false);
  const [newViewName, setNewViewName] = useState("");
  const [showActionModal, setShowActionModal] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [actionComment, setActionComment] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAlarm, setSelectedAlarm] = useState(null);

  const userList = ["John Doe", "Jane Smith", "Mike Johnson"];
  const canResetFilters =
    filters.severity !== "all" ||
    filters.status !== "all" ||
    filters.type !== "all" ||
    filters.search !== "";

  const canSaveCurrentView = () => {
    const hasFilter =
      filters.severity !== "all" ||
      filters.status !== "all" ||
      filters.type !== "all";
    if (!hasFilter) return false;
    return !savedViews.some(
      (v) =>
        v.filters.severity === filters.severity &&
        v.filters.status === filters.status &&
        v.filters.type === filters.type &&
        v.filters.search === filters.search,
    );
  };

  function generateMockAlarms(dt) {
    const sev = ["Critical", "Major", "Minor"];
    const sta = ["New", "Acknowledged", "Assigned", "Resolved"];
    const typ = ["Chassis", "Interface", "System"];
    const arr = [];
    for (let i = 1; i <= 100; i++) {
      const t = typ[Math.floor(Math.random() * typ.length)];
      arr.push({
        id: i,
        title: `Alarm ${i} - ${t}`,
        severity: sev[Math.floor(Math.random() * sev.length)],
        status: sta[Math.floor(Math.random() * sta.length)],
        type: t,
        source: `${dt}-${String(i).padStart(6, "0")}`,
        description: `${t} issue`,
        timestamp: new Date().toISOString(),
        assignedTo: null,
        escalatedTo: null,
        comments: [],
        timeline: [
          {
            status: "New",
            comment: "Created",
            user: "System",
            timestamp: new Date().toISOString(),
          },
        ],
      });
    }
    return arr;
  }

  function generateDeviceInventory(dt) {
    const arr = [];
    const sta = ["online", "offline", "maintenance"];
    for (let i = 1; i <= 10000; i++) {
      arr.push({
        id: i,
        deviceId: `${dt}-${String(i).padStart(6, "0")}`,
        model: `Model-${(i % 5) + 1}`,
        status: sta[Math.floor(Math.random() * sta.length)],
        location: `Loc ${(i % 6) + 1}`,
        ipAddress: `192.168.${Math.floor(i / 256)}.${i % 256}`,
        firmwareVersion: "2.1.4",
      });
    }
    return arr;
  }

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setAlarms(generateMockAlarms(selectedDeviceType));
      setDevices(generateDeviceInventory(selectedDeviceType));
      setLoading(false);
    }, 500);
  }, [selectedDeviceType]);

  const handleDataRefresh = (callback) => {
    setTimeout(() => {
      setAlarms(generateMockAlarms(selectedDeviceType));
      setDevices(generateDeviceInventory(selectedDeviceType));
      callback();
    }, 1000);
  };

  useEffect(() => {
    const filtered = alarms.filter(
      (a) =>
        (filters.severity === "all" || a.severity === filters.severity) &&
        (filters.status === "all" || a.status === filters.status) &&
        (filters.type === "all" || a.type === filters.type) &&
        (!filters.search ||
          a.title.toLowerCase().includes(filters.search.toLowerCase())),
    );
    setFilteredAlarms(filtered);
    setAlarmCurrentPage(1);
  }, [alarms, filters]);

  useEffect(() => {
    const filtered = devices.filter(
      (d) =>
        (deviceFilters.status === "all" || d.status === deviceFilters.status) &&
        (!deviceFilters.search ||
          d.deviceId
            .toLowerCase()
            .includes(deviceFilters.search.toLowerCase())),
    );
    setFilteredDevices(filtered);
    setDeviceCurrentPage(1);
  }, [devices, deviceFilters]);

  const currentAlarms = filteredAlarms.slice(
    (alarmCurrentPage - 1) * alarmsPerPage,
    alarmCurrentPage * alarmsPerPage,
  );
  const currentDevices = filteredDevices.slice(
    (deviceCurrentPage - 1) * devicesPerPage,
    deviceCurrentPage * devicesPerPage,
  );

  function handleSelectAll(checked) {
    setSelectedAlarms(
      checked ? new Set(currentAlarms.map((a) => a.id)) : new Set(),
    );
  }

  function handleAlarmSelect(alarmId, checked) {
    const s = new Set(selectedAlarms);
    checked ? s.add(alarmId) : s.delete(alarmId);
    setSelectedAlarms(s);
  }

  function handleBulkAction(action) {
    setCurrentAction(action);
    setActionComment("");
    setSelectedUser("");
    setShowActionModal(true);
  }

  function confirmBulkAction() {
    if (currentAction === "assign" && !selectedUser)
      return alert("Select user");
    if (!actionComment.trim()) return alert("Enter comment");

    const updated = alarms.map((a) => {
      if (selectedAlarms.has(a.id)) {
        let ns = a.status;
        let ua = { ...a };
        if (currentAction === "acknowledge" && a.status === "New")
          ns = "Acknowledged";
        toast.success(`Alarm ${a.id} ${ns}`);
        if (currentAction === "assign") {
          ns = "Assigned";
          ua.assignedTo = selectedUser;
        }
        if (currentAction === "resolve") ns = "Resolved";
        if (currentAction === "clear") ns = "Cleared";
        ua.status = ns;
        ua.comments = [
          ...a.comments,
          {
            id: Date.now(),
            comment: actionComment,
            user: selectedUser || "User",
            timestamp: new Date().toISOString(),
          },
        ];
        ua.timeline = [
          ...a.timeline,
          {
            status: ns,
            comment: actionComment,
            user: selectedUser || "User",
            timestamp: new Date().toISOString(),
          },
        ];
        return ua;
      }
      return a;
    });

    setAlarms(updated);
    setSelectedAlarms(new Set());
    setShowActionModal(false);
    setActionComment("");
    setSelectedUser("");
    setCurrentAction(null);
  }

  function getStatusColor(s) {
    const c = {
      online: "bg-green-100 text-green-800",
      offline: "bg-red-100 text-red-800",
      maintenance: "bg-blue-100 text-blue-800",
      New: "bg-red-500 text-white",
      Acknowledged: "bg-yellow-500 text-black",
      Assigned: "bg-blue-500 text-white",
      Resolved: "bg-green-500 text-white",
      Cleared: "bg-gray-500 text-white",
    };
    return c[s] || "bg-gray-100 text-gray-800";
  }

  function getSeverityColor(s) {
    const c = {
      Critical: "bg-red-500 text-white",
      Major: "bg-orange-500 text-white",
      Minor: "bg-yellow-500 text-black",
    };
    return c[s] || "bg-gray-500 text-white";
  }

  function getTypeColor(t) {
    const c = {
      Chassis: "bg-red-100 text-red-800",
      Interface: "bg-blue-100 text-blue-800",
      System: "bg-purple-100 text-purple-800",
    };
    return c[t] || "bg-gray-100 text-gray-800";
  }

  const stats = {
    critical: alarms.filter((a) => a.severity === "Critical").length,
    chassis: alarms.filter((a) => a.type === "Chassis").length,
    interface: alarms.filter((a) => a.type === "Interface").length,
    system: alarms.filter((a) => a.type === "System").length,
    cleared: alarms.filter((a) => a.status === "Cleared").length,
  };

  stats.total =
    stats.critical +
    stats.chassis +
    stats.interface +
    stats.system +
    stats.cleared;

  // const stats = {
  //   critical: alarms.filter((a) => a.severity === "Critical").length,
  //   chassis: alarms.filter((a) => a.type === "Chassis").length,
  //   interface: alarms.filter((a) => a.type === "Interface").length,
  //   security: alarms.filter((a) => a.type === "System").length,
  //   cleared: alarms.filter((a) => a.status === "Cleared").length,
  // };

  // // Get unique alarms that fall into any category
  // const uniqueCategoryAlarms = alarms.filter(
  //   (a) =>
  //     a.severity === "Critical" ||
  //     a.type === "Chassis" ||
  //     a.type === "Interface" ||
  //     a.type === "System" ||
  //     a.status === "Cleared"
  // );

  // stats.total = uniqueCategoryAlarms.length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6 flex justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Multi-Device Management</h1>
          <p className="text-gray-600">Network device management system</p>
        </div>
      </div>

      <DeviceTypeSelector
        selectedDeviceType={selectedDeviceType}
        onDeviceTypeChange={(type) => dispatch(setSelectedDeviceType(type))}
        onRefreshClick={handleDataRefresh}
      />

      <AlarmStatistics stats={stats} />

      <div className="mb-6 border-b">
        <nav className="flex space-x-8">
          <button
            onClick={() => dispatch(setActiveTab("alarms"))}
            className={
              activeTab === "alarms"
                ? "border-b-2 border-blue-500 py-2 text-sm text-blue-600"
                : "border-b-2 border-transparent py-2 text-sm text-gray-500"
            }
          >
            Alarms ({stats.total})
          </button>
          {/* <button
            onClick={() => dispatch(setActiveTab("inventory"))}
            className={
              activeTab === "inventory"
                ? "border-b-2 border-blue-500 py-2 text-sm text-blue-600"
                : "border-b-2 border-transparent py-2 text-sm text-gray-500"
            }
          >
            Inventory ({devices.length.toLocaleString()})
          </button> */}
          <button
            onClick={() => dispatch(setActiveTab("dashboard"))}
            className={
              activeTab === "dashboard"
                ? "border-b-2 border-blue-500 py-2 text-sm text-blue-600"
                : "border-b-2 border-transparent py-2 text-sm text-gray-500"
            }
          >
            Dashboard
          </button>
        </nav>
      </div>

      {activeTab === "alarms" && (
        <AlarmsTab
          filters={filters}
          onFilterChange={(newFilters) => dispatch(setAlarmFilters(newFilters))}
          onResetFilters={() => dispatch(resetAlarmFilters())}
          canReset={canResetFilters}
          savedViews={savedViews}
          onApplyView={(v) => dispatch(setAlarmFilters(v.filters))}
          onDeleteView={(id) => dispatch(deleteSavedView(id))}
          onSaveNew={() => setShowSaveViewModal(true)}
          canSaveCurrentView={canSaveCurrentView()}
          selectedAlarms={selectedAlarms}
          onBulkAction={handleBulkAction}
          filteredAlarms={filteredAlarms}
          currentAlarms={currentAlarms}
          loading={loading}
          onSelectAll={handleSelectAll}
          onSelectAlarm={handleAlarmSelect}
          onViewAlarm={(a) => {
            setSelectedAlarm(a);
            setModalOpen(true);
          }}
          alarmCurrentPage={alarmCurrentPage}
          alarmsPerPage={alarmsPerPage}
          onAlarmPageChange={setAlarmCurrentPage}
          onAlarmsPerPageChange={setAlarmsPerPage}
          getTypeColor={getTypeColor}
          getSeverityColor={getSeverityColor}
          getStatusColor={getStatusColor}
          isAdmin={userRole}
          userProfile={user}
        />
      )}

      {activeTab === "inventory" && (
        <DeviceInventoryTab
          deviceFilters={deviceFilters}
          onDeviceFilterChange={(newFilters) =>
            dispatch(setDeviceFilters(newFilters))
          }
          filteredDevices={filteredDevices}
          currentDevices={currentDevices}
          loading={loading}
          deviceCurrentPage={deviceCurrentPage}
          devicesPerPage={devicesPerPage}
          onDevicePageChange={setDeviceCurrentPage}
          onDevicesPerPageChange={setDevicesPerPage}
          getStatusColor={getStatusColor}
        />
      )}

      {activeTab === "dashboard" && (
        <DashboardTab selectedDeviceType={selectedDeviceType} stats={stats} />
      )}

      {modalOpen && selectedAlarm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-50">
          <div className="relative top-20 mx-auto max-h-[80vh] w-3/4 overflow-y-auto rounded-md border bg-white p-5 shadow-lg">
            <div className="mb-4 flex justify-between">
              <h3 className="text-lg font-bold">Alarm Details</h3>
              <button onClick={() => setModalOpen(false)} className="text-2xl">
                ×
              </button>
            </div>
            <div className="mb-6 grid grid-cols-2 gap-6">
              <div>
                <h4 className="mb-3 font-semibold">Basic Info</h4>
                <p className="mb-2">
                  <strong>Title:</strong> {selectedAlarm.title}
                </p>
                <p className="mb-2">
                  <strong>Description:</strong> {selectedAlarm.description}
                </p>
                <p className="mb-2">
                  <strong>Type:</strong>{" "}
                  <span
                    className={`ml-2 inline-flex rounded-full px-2.5 py-0.5 text-xs ${getTypeColor(selectedAlarm.type)}`}
                  >
                    {selectedAlarm.type}
                  </span>
                </p>
                <p className="mb-2">
                  <strong>Severity:</strong>{" "}
                  <span
                    className={`ml-2 inline-flex rounded-full px-2.5 py-0.5 text-xs ${getSeverityColor(selectedAlarm.severity)}`}
                  >
                    {selectedAlarm.severity}
                  </span>
                </p>
                <p className="mb-2">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`ml-2 inline-flex rounded-full px-2.5 py-0.5 text-xs ${getStatusColor(selectedAlarm.status)}`}
                  >
                    {selectedAlarm.status}
                  </span>
                </p>
              </div>
              <div>
                <h4 className="mb-3 font-semibold">Assignment</h4>
                <p>
                  <strong>Assigned:</strong>{" "}
                  {selectedAlarm.assignedTo || "None"}
                </p>
              </div>
            </div>
            {selectedAlarm.comments.length > 0 && (
              <div className="mb-6">
                <h4 className="mb-3 font-semibold">
                  Comments ({selectedAlarm.comments.length})
                </h4>
                <div className="max-h-60 space-y-3 overflow-y-auto">
                  {selectedAlarm.comments.map((c) => (
                    <div key={c.id} className="rounded bg-blue-50 p-3">
                      <div className="mb-2 flex justify-between">
                        <span className="text-sm font-medium">{c.user}</span>
                        <span className="text-xs">
                          {new Date(c.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{c.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mb-6">
              <h4 className="mb-3 font-semibold">Timeline</h4>
              <div className="max-h-60 space-y-3 overflow-y-auto">
                {selectedAlarm.timeline.map((e, i) => (
                  <div key={i} className="rounded bg-gray-50 p-3">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">{e.status}</div>
                        <div className="text-sm text-gray-600">{e.comment}</div>
                        <div className="text-xs text-gray-500">by {e.user}</div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(e.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* {isAdmin && ( */}
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedAlarms(new Set([selectedAlarm.id]));
                      handleBulkAction("acknowledge");
                      setModalOpen(false);
                    }}
                    disabled={selectedAlarm.status !== "New"}
                    className={
                      selectedAlarm.status === "New"
                        ? "rounded bg-yellow-500 px-4 py-2 text-sm text-white"
                        : "cursor-not-allowed rounded bg-gray-300 px-4 py-2 text-sm text-gray-500"
                    }
                  >
                    Acknowledge
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAlarms(new Set([selectedAlarm.id]));
                      handleBulkAction("assign");
                      setModalOpen(false);
                    }}
                    //className="rounded bg-blue-500 px-4 py-2 text-sm text-white"
                    className={
                      selectedAlarm.status === "Acknowledged"
                        ? "rounded bg-blue-500 px-4 py-2 text-sm text-white"
                        : "cursor-not-allowed rounded bg-gray-300 px-4 py-2 text-sm text-gray-500"
                    }
                  >
                    Assign
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAlarms(new Set([selectedAlarm.id]));
                      handleBulkAction("resolve");
                      setModalOpen(false);
                    }}
                    className="rounded bg-green-500 px-4 py-2 text-sm text-white"
                  >
                    Resolve
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAlarms(new Set([selectedAlarm.id]));
                      handleBulkAction("clear");
                      setModalOpen(false);
                    }}
                    className="rounded bg-gray-500 px-3 py-1 text-sm text-white"
                  >
                    Clear
                  </button>
                </div>
                {/* <button
                  onClick={() => setModalOpen(false)}
                  className="rounded bg-gray-500 px-4 py-2 text-white"
                >
                  Close
                </button> */}
              </div>
            {/* )} */}
            {!isAdmin && (
              <div className="flex justify-end">
                <button
                  onClick={() => setModalOpen(false)}
                  className="rounded bg-gray-500 px-4 py-2 text-white"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showActionModal && (
        <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50">
          <div className="relative top-20 mx-auto w-96 rounded-md border bg-white p-5 shadow-lg">
            <h3 className="mb-4 text-lg font-bold">{currentAction} Alarm(s)</h3>
            <p className="mb-3 text-sm">
              About to {currentAction} {selectedAlarms.size} alarm(s)
            </p>
            {currentAction === "assign" && (
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium">User *</label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full rounded-md border p-2"
                >
                  <option value="">Select...</option>
                  {userList.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">
                Comment *
              </label>
              <textarea
                value={actionComment}
                onChange={(e) => setActionComment(e.target.value)}
                rows={4}
                className="w-full rounded-md border p-2"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={confirmBulkAction}
                className="flex-1 rounded bg-blue-500 px-4 py-2 text-white"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setShowActionModal(false);
                  setActionComment("");
                  setSelectedUser("");
                }}
                className="flex-1 rounded bg-gray-300 px-4 py-2 text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showSaveViewModal && (
        <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50">
          <div className="relative top-20 mx-auto w-96 rounded-md border bg-white p-5 shadow-lg">
            <h3 className="mb-4 text-lg font-bold">Save Filter View</h3>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">
                View Name
              </label>
              <input
                type="text"
                value={newViewName}
                onChange={(e) => setNewViewName(e.target.value)}
                className="w-full rounded-md border p-2"
              />
            </div>
            <div className="mb-4 rounded border bg-gray-50 p-3">
              <p className="mb-2 text-xs font-semibold">Current Filters:</p>
              <p className="text-xs">Severity: {filters.severity}</p>
              <p className="text-xs">Status: {filters.status}</p>
              <p className="text-xs">Type: {filters.type}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (newViewName.trim()) {
                    dispatch(
                      addSavedView({
                        id: Date.now(),
                        name: newViewName,
                        filters: { ...filters },
                      }),
                    );
                    setNewViewName("");
                    setShowSaveViewModal(false);
                  } else {
                    alert("Enter name");
                  }
                }}
                className="flex-1 rounded bg-blue-500 px-4 py-2 text-white"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowSaveViewModal(false);
                  setNewViewName("");
                }}
                className="flex-1 rounded bg-gray-300 px-4 py-2 text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};
