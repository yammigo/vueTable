
import Utils from '../utils/utils.js';
// 初始化的列按照fixed属性进行排序
export const handleColumnsOrder = (columns) => {
  const left = [];
  const right= [];
  const center = [];
  columns.forEach((column) => {
    if (column.fixed && column.fixed === 'left') {
      left.push(column);
    } else if (column.fixed && column.fixed === 'right') {
      right.push(column);
    } else {
      center.push(column);
    }
  });
  return {
    left: left.concat(center).concat(right),
    right: right.concat(center).concat(left),
  };
};
/**
 * 获取所有列
 * 初始列选项
 * @param  {} cols
 * // 如果是在table head使用，对于有子列的选项也需要返回
 * @param  {} forTableHead = false
 *
 */
export const getAllColumns = (columns, forTableHead = false) => {
  const result = [];
  columns.forEach((column) => {
    if (column.children) {
      if (forTableHead) {
        result.push(column);
      }
      result.push(...getAllColumns(column.children, forTableHead));
    } else {
      result.push(column);
    }
  });

  return result;
};
export const setColumnsData = (columns) => {
  const cloneColumns = Utils.deepCopy(columns);
  cloneColumns.forEach((column, index)=> {
    // column._index = index;
    // 为每列增加一个id标识符,作用？？？
    column._id = 'bui_id' + Utils.getRandomStr(6);
    if (column.children) {
      column.children = setColumnsData(column.children);
    }
  });
  return cloneColumns;
};
// 获取body所需要的列
export const getFlattenColumns = (columns, fixedType) => {
  const left = [];
  const right = [];
  const center = [];
  // const maxLevel = 1;

  const allColumns = getAllColumns(columns);
  // const allColumnsForHead = getAllColumns(columns, true);
  allColumns.forEach((column, index) => {
    if (column.fixed && column.fixed === 'left') {
      left.push(column);
    } else if (column.fixed && column.fixed === 'right') {
      right.push(column);
    } else {
      center.push(column);
    }
  });
  return fixedType === 'right' ?
    right.concat(center).concat(left) : left.concat(center).concat(right);
};
// 获取head所需要的行
export const handleColumns2Rows = (columns) => {
  let maxLevel = 1;
  // 设置还有子列的选项的列可横跨的列数和层级
  const setColumnColSpan = (column, parent) => {
    if (parent) {
      column.level = parent.level + 1;
      if (maxLevel < column.level) {
        maxLevel = column.level;
      }
    }
    let colSpan = 0;
    if (column.children) {
      column.children.forEach((subColumn) => {
        setColumnColSpan(subColumn, column);
        colSpan += subColumn.colSpan;
      });
      column.colSpan = colSpan;
    } else {
      column.colSpan = 1;
    }
  };
  columns.forEach((column, index) => {
    column.level = 1;
    setColumnColSpan(column, '');
  });
  const rows = Array.from({length: maxLevel}, () => {
    return [];
  });
  const allColumns = getAllColumns(columns, true);
  allColumns.forEach((column) => {
    if (column.children) {
      column.rowSpan = 1;
    } else {
      column.rowSpan = maxLevel - column.level + 1;
    }
    rows[column.level - 1].push(column);
  });

  return rows;
};




// WEBPACK FOOTER //
// ./components/table/src/util.js