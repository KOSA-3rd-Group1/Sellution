import { useMemo, useState } from 'react';

export const useTable = ({ data, setTableState }) => {
  // 체크박스 일괄 선택, 해제
  const [selectAll, setSelectAll] = useState(false);

  // 체크박스 선택한 row
  const [selectedRows, setSelectedRows] = useState({});

  // 체크박스 전체 선택
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    const newSelectedRows = {};
    data.forEach((row) => {
      newSelectedRows[row.id] = newSelectAll;
    });
    setSelectedRows((prev) => ({ ...prev, ...newSelectedRows }));
  };

  // 체크박스 개별 선택
  const handleSelectRow = (id) => {
    setSelectedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // 체크박스 선택 갯수
  const selectedCount = useMemo(() => {
    return Object.values(selectedRows).filter(Boolean).length;
  }, [selectedRows]);

  // tableState 검색, 필터링 변화 handler
  const handleTableStateChange = (key, value) => {
    setTableState((prev) => ({ ...prev, [key]: value }));
  };

  // tableState 정렬 변화 handler
  const handleSort = (key) => {
    setTableState((prev) => ({
      ...prev,
      [key]: prev[key] === 'asc' ? 'desc' : 'asc',
    }));
  };

  // 숨김 버튼 활성 (컬럼 하나만 가능)
  const [visibleButtons, setVisibleButtons] = useState({});

  // 숨김 버튼 토글
  const handleVisibleButtons = (e, rowId) => {
    e.stopPropagation();
    setVisibleButtons((prev) => ({ ...prev, [rowId]: !prev[rowId] }));
  };

  return {
    selectAll,
    selectedRows,
    selectedCount,
    visibleButtons,
    handleSelectAll,
    handleSelectRow,
    handleTableStateChange,
    handleSort,
    handleVisibleButtons,
  };
};
