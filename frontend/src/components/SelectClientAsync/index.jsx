import { useState, useEffect } from 'react';
import { request } from '@/request';
import useFetch from '@/hooks/useFetch';
import { Select, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { generate as uniqueId } from 'shortid';
import color from '@/utils/color';
import useLanguage from '@/locale/useLanguage';

const SelectClientAsync = ({
  entity,
  displayLabels = ['name'],
  outputValue = '_id',
  redirectLabel = '',
  withRedirect = false,
  urlToRedirect = '/',
  placeholder = 'Select',
  value,
  onChange,
  mode,
}) => {
  const translate = useLanguage();
  const [selectOptions, setOptions] = useState([]);
  const [currentValue, setCurrentValue] = useState(mode === 'multiple' ? [] : undefined);
  const navigate = useNavigate();

  const asyncList = () => request.list({ entity });

  const { result, isLoading: fetchIsLoading, isSuccess } = useFetch(asyncList);

  useEffect(() => {
    if (isSuccess && result?.data) {
      console.log('Fetched options:', result.data);
      setOptions(Array.isArray(result.data) ? result.data : []);
    }
  }, [isSuccess, result]);

  const labels = (optionField) => {
    return displayLabels.map((x) => optionField[x]).join(' ');
  };
  useEffect(() => {
    if (value !== undefined) {
      const val =
        mode === 'multiple'
          ? value.map((v) => v?.[outputValue] ?? v)
          : value?.[outputValue] ?? value;

      if (JSON.stringify(currentValue) !== JSON.stringify(val)) {
        setCurrentValue(val);
        onChange?.(val);
      }
    }
  }, [value, outputValue, onChange, mode, currentValue]);

  const handleSelectChange = (newValue) => {
    if (newValue === 'redirectURL') {
      navigate(urlToRedirect);
    } else {
      const val =
        mode === 'multiple'
          ? newValue.map((v) => v?.[outputValue] ?? v)
          : newValue?.[outputValue] ?? newValue;

      if (JSON.stringify(currentValue) !== JSON.stringify(val)) {
        setCurrentValue(val);
        onChange?.(val);
      }
    }
  };

  const optionsList = () => {
    const list = [];

    if (!Array.isArray(selectOptions)) {
      console.error('selectOptions is not an array:', selectOptions);
      return list;
    }

    selectOptions.forEach((optionField) => {
      const value = optionField[outputValue] ?? optionField;
      const label = labels(optionField);
      const currentColor = optionField?.color ?? optionField[outputValue]?.color;
      const labelColor = color.find((x) => x.color === currentColor);
      list.push({ value, label, color: labelColor?.color });
    });

    return list;
  };

  return (
    <Select
      mode={mode} // <-- Tambahkan mode ke Select
      loading={fetchIsLoading}
      disabled={fetchIsLoading}
      value={currentValue}
      onChange={handleSelectChange}
      placeholder={placeholder}
    >
      {optionsList().map((option) => (
        <Select.Option key={uniqueId()} value={option.value}>
          <Tag bordered={false} color={option.color}>
            {option.label}
          </Tag>
        </Select.Option>
      ))}
      {withRedirect && (
        <Select.Option value={'redirectURL'}>{`+ ` + translate(redirectLabel)}</Select.Option>
      )}
    </Select>
  );
};

export default SelectClientAsync;
