import { create } from 'zustand';

const useTableStore = create((set) => ({
  tables: {},
  setSelectedRows: (tableId, selectedRows) =>
    set((state) => ({
      tables: {
        ...state.tables,
        [tableId]: {
          ...state.tables[tableId],
          selectedRows,
        },
      },
    })),
  setSelectAll: (tableId, selectAll) =>
    set((state) => ({
      tables: {
        ...state.tables,
        [tableId]: {
          ...state.tables[tableId],
          selectAll,
        },
      },
    })),
  clearTable: (tableId) =>
    set((state) => {
      const newTables = { ...state.tables };
      delete newTables[tableId];
      return { tables: newTables };
    }),
}));

export default useTableStore;
