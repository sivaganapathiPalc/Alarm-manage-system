import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedDeviceType: 'sonic',
  activeTab: 'alarms',
  alarmFilters: {
    severity: 'all',
    status: 'all',
    type: 'all',
    search: ''
  },
  deviceFilters: {
    status: 'all',
    search: ''
  },
  savedViews: [
    {
      id: 1,
      name: 'Critical',
      filters: {
        severity: 'Critical',
        status: 'all',
        type: 'all',
        search: ''
      }
    },
    {
      id: 2,
      name: 'New',
      filters: {
        severity: 'all',
        status: 'New',
        type: 'all',
        search: ''
      }
    }
  ]
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSelectedDeviceType: (state, action) => {
      state.selectedDeviceType = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setAlarmFilters: (state, action) => {
      state.alarmFilters = action.payload;
    },
    resetAlarmFilters: (state) => {
      state.alarmFilters = initialState.alarmFilters;
    },
    setDeviceFilters: (state, action) => {
      state.deviceFilters = action.payload;
    },
    addSavedView: (state, action) => {
      state.savedViews.push(action.payload);
    },
    deleteSavedView: (state, action) => {
      state.savedViews = state.savedViews.filter(view => view.id !== action.payload);
    },
    setSavedViews: (state, action) => {
      state.savedViews = action.payload;
    }
  }
});

export const {
  setSelectedDeviceType,
  setActiveTab,
  setAlarmFilters,
  resetAlarmFilters,
  setDeviceFilters,
  addSavedView,
  deleteSavedView,
  setSavedViews
} = appSlice.actions;

export default appSlice.reducer;