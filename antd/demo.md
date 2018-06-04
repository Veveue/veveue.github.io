/*
 * FormItem 渲染方法
 * */
import React from "react";
export function onModelInputList(
  ModalDb,
  modalData,
  getFieldDecorator,
  FormItem,
  Input,
  formItemLayout,
  getFieldValue
) {
  return ModalDb.map((item, idx) => {
    const formItemProps = {
      key: item + idx,
      label: item.label,
      extra: item.extra,
      hasFeedback: !item.hasFeedback,
      ...formItemLayout,
      ...item.formItemLayout
    };
    return (
      (item.isRender === undefined ||
        (getFieldValue && needRender(getFieldValue, item.isRender))) &&
      (!item.id ? (
        <FormItem {...formItemProps}>{item.input}</FormItem >
      ) : (
        <FormItem {...formItemProps}>
					{getFieldDecorator(item.id, {
            initialValue: modalData
              ? item.formatFunc
                ? item.formatFunc(modalData[item.id])
                : (item.type === 'select'
                ? modalData[item.id] &&
                modalData[item.id].toString()
                : modalData[item.id]) ||
                item.defaultValue
              : item.defaultValue,
            rules: [
              {
                required:
                  item.required === undefined ||
                  item.required === true
                    ? true
                    : 0,
                message: `${item.label}不能为空`
              }
            ].concat(item.rules ? item.rules : [])
          })(
            item.input || (
              <Input
                placeholder={`${item.placeholder ||
                item.label}`}
                disabled={item.disabled ? 'disabled' : false}
              />
            )
          )}
				</FormItem >
      ))
    );
  });
}

function needRender(getFieldValue, data) {
  let needRender = true;
  for (let i in data) {
    needRender = getFieldValue(Object.keys(data[i])[0]) === Object.values(data[i])[0];
    if (!needRender) break;
  }
  return needRender;
}
