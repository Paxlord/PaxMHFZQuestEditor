export const immu_write_uint32 = (dataview, offset, value) => {
  const tempDataView = new DataView(dataview.buffer);
  tempDataView.setUint32(offset, value, true);
  return tempDataView;
}

export const immu_write_float32= (dataview, offset, value) => {
  const tempDataView = new DataView(dataview.buffer);
  tempDataView.setFloat32(offset, value, true);
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

export const immu_concat_dataview = (dataview, u8a) => {
  let uint8_a = new Uint8Array(dataview.buffer)
  let final_uint = new Uint8Array(uint8_a.length + u8a.length);

  final_uint.set(uint8_a, 0);
  final_uint.set(u8a, uint8_a.length);

  let tmpDv = new DataView(final_uint.buffer);
  return tmpDv;
}