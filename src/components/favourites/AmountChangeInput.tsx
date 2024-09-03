import { useState } from 'react';
import { Button } from '../ui/button';
import styles from './AmountChangeInput.module.css';

const AmountInput: React.FC<{
  onConfirm: (val: number) => void;
  value: number | string;
}> = ({ onConfirm, value }) => {
  const [showButtons, setShowButtons] = useState(false);
  const [newValue, setNewValue] = useState(value);

  const changeInputHandler = (e: React.FormEvent<HTMLInputElement>) => {
    if (!showButtons) {
      setShowButtons(true);
    }
    const value = e.currentTarget.value;

    if (typeof parseFloat(value) === 'number') {
      setNewValue(parseFloat(value));
    }
  };
  const confirmEdition = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onConfirm(Number(newValue));

    if (typeof newValue === 'number' && newValue >= 0) {
      hideButtons();
    }
  };
  const cancelEdition = () => {
    setNewValue(value);
    hideButtons();
  };

  const hideButtons = () => {
    setShowButtons(false);
  };

  return (
    <div className="relative">
      <form onSubmit={confirmEdition} className={styles.form}>
        <input
          type="number"
          step={0.00001}
          min={0}
          className="text-center w-full px-2 min-w-[100px] focus:outline-none"
          value={newValue}
          maxLength={11}
          // onChange={(e) => amountHandlerFn(id, e.target.value)}
          onChange={changeInputHandler}
        />
        {showButtons && (
          <div className=" md:absolute top-0 right-0">
            <Button
              type="submit"
              className="h-full p-[4px] rounded-l-md rounded-r-none  m-0 leading-none bg-green-600"
            >
              v
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="h-full p-[4px] m-0 rounded-r-md rounded-l-none leading-none"
              onClick={cancelEdition}
            >
              x
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AmountInput;
