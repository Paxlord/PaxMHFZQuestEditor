export const immu_write_uint32 = (dataview, offset, value) => {
  const tempDataView = new DataView(dataview.buffer);
  tempDataView.setUint32(offset, value, true);
  return tempDataView;
}

export const immu_write_ubyte = (dataview, offset, value) => {
  const tempDataView = new DataView(dataview.buffer);
  tempDataView.setUint8(offset, value, true);
  return tempDataView;
}

export const immu_write_ushort = (dataview, offset, value) => {
  const tempDataView = new DataView(dataview.buffer);
  tempDataView.setUint16(offset, value, true);
  return tempDataView;
}