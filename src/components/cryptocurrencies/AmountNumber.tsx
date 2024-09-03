const AmountNumber: React.FunctionComponent<{ value: number }> = ({
  value,
}) => {
  let formattedValue = `$${value.toFixed(2)}`;

  if (value >= 10000) {
    formattedValue = `$${(value / 1000).toFixed(2)} k`;
  }
  if (value >= 10000000) {
    formattedValue = `$${(value / 1000000).toFixed(0)} M`;
  }

  return <span>{formattedValue}</span>;
};

export default AmountNumber;
