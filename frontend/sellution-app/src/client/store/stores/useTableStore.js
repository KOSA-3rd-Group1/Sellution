import create from 'zustand';

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
}));

export default useTableStore;
