import React from 'react';

import { CssVarsProvider } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import styles from './styles';

import './style.css';

const App = () => {
  const [state, setState] = React.useState([]);
  const [display, setDisplay] = React.useState('');
  const [currentNumber, setCurrentNumber] = React.useState(null);
  const [result, setResult] = React.useState('0');

  React.useEffect(() => {
    updateDisplay();
  }, []);

  React.useEffect(() => {
    updateDisplay();
  }, [state]);

  const updateDisplay = () => {
    if (state.length !== 0) {
      setDisplay(
        state.reduce((prevValue, currValue, currIndex) => {
          const cValue =
            currValue.startsWith('-') && currValue.length > 1
              ? `(${currValue})`
              : currValue;

          if (currIndex == 0) {
            return prevValue + cValue;
          } else {
            return prevValue + ` ${cValue}`;
          }
        }, '')
      );
    } else {
      setDisplay('');
    }
  };

  const keypadNumbers = (buttonValue) => {
    if (
      currentNumber === null ||
      currentNumber === '0' ||
      currentNumber === '-0'
    ) {
      setCurrentNumber(buttonValue);
      setResult(buttonValue);
    } else {
      const newNumber = currentNumber + buttonValue;

      setCurrentNumber(newNumber);
      setResult(newNumber);
    }
  };

  const keypadOperations = (buttonValue) => {
    if (state.length === 0) {
      const number = currentNumber ? currentNumber : String(result);

      setState([number, buttonValue]);
      setCurrentNumber(null);
    } else {
      if (currentNumber === null) {
        setState((prevState) => {
          if (isArithmeticSign(state[state.length - 1])) {
            return [...prevState.slice(0, -1), buttonValue];
          } else {
            return [...prevState, buttonValue];
          }
        });
      } else {
        if (!isArithmeticSign(state[state.length - 1])) {
          const newState = [...state, buttonValue, currentNumber];
          const res = runCalculation(undefined, newState);

          setState(newState);
          setResult(res);
        } else {
          const res = runCalculation(currentNumber);

          setState([...state, currentNumber, buttonValue]);
          setResult(res);
        }
        setCurrentNumber(null);
      }
    }
  };

  const keypadEqualsTo = () => {
    if (state.length !== 0) {
      const lastNumber = currentNumber ? currentNumber : result;
      const res = runCalculation(lastNumber);

      setCurrentNumber(null);
      setResult(res);
      setState([]);
    }
  };

  const keypadAc = () => {
    setState([]);
    setCurrentNumber(null);
    setResult('0');
  };

  const keypadDecimalPoint = () => {
    if (currentNumber === null || Number(currentNumber) === 0) {
      setCurrentNumber('0.');
      setResult('0.');
    } else {
      if (currentNumber.indexOf('.') === -1) {
        const newNumber = currentNumber + '.';

        setCurrentNumber(newNumber);
        setResult(newNumber);
      }
    }
  };

  const keypadDel = () => {
    if (currentNumber) {
      const newNumber = currentNumber.slice(0, -1);

      if (newNumber === '' || newNumber === '-') {
        setCurrentNumber(null);
        setResult('0');
      } else {
        setCurrentNumber(newNumber);
        setResult(newNumber);
      }
    } else if (
      currentNumber === null &&
      isArithmeticSign(state[state.length - 1])
    ) {
      const newState = state.slice(0, -1);
      const res = runCalculation(undefined, newState);

      setState(newState);
      if (res) {
        setResult(res);
      }
    } else if (currentNumber === null && !isNaN(state[state.length - 1])) {
      const lastNumber = state[state.length - 1];
      const newState = state.slice(0, -1);

      setState(newState);
      setCurrentNumber(lastNumber);
      setResult(lastNumber);
    }
  };

  const keypadSignToggle = () => {
    if (currentNumber !== null) {
      const newNumber = toggleSign(currentNumber);

      setCurrentNumber(newNumber);
      setResult(newNumber);
    } else {
      const newNumber = toggleSign(String(result));

      setCurrentNumber(newNumber);
      setResult(newNumber);
    }
  };

  const runCalculation = (lastNumber, myState) => {
    const newState = myState
      ? myState
      : lastNumber
      ? [...state, lastNumber]
      : [...state];

    if (newState.length > 2) {
      const res = newState.reduce((prevValue, currValue, currIndex, arr) => {
        switch (currValue) {
          case '+':
            return Number(prevValue) + Number(arr[currIndex + 1]);
          case '-':
            return Number(prevValue) - Number(arr[currIndex + 1]);
          case '/':
            return Number(prevValue) / Number(arr[currIndex + 1]);
          case '*':
            return Number(prevValue) * Number(arr[currIndex + 1]);
          default:
            return Number(prevValue);
        }
      });

      return res;
    } else if (newState.length === 1) {
      return newState[0];
    }

    return null;
  };

  const toggleSign = (number) => {
    if (number.startsWith('-')) {
      return number.slice(1);
    } else {
      return '-' + number;
    }
  };

  const isArithmeticSign = (sign) => {
    switch (sign) {
      case '+':
      case '-':
      case '*':
      case '/':
        return true;
      default:
        return false;
    }
  };

  const onButtonClick = (e) => {
    const buttonValue = e.target.innerText;

    switch (buttonValue) {
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        keypadNumbers(buttonValue);
        break;
      case '+':
      case '-':
      case '*':
      case '/':
        keypadOperations(buttonValue);
        break;
      case '=':
        keypadEqualsTo();
        break;
      case 'AC':
        keypadAc();
        break;
      case '.':
        keypadDecimalPoint();
        break;
      case 'DEL':
        keypadDel();
        break;
      case '+/-':
        keypadSignToggle();
    }
  };

  return (
    <AppBase onButtonClick={onButtonClick} result={result} display={display} />
  );
};

const AppBase = ({ onButtonClick, result, display }) => {
  return (
    <CssVarsProvider>
      <Sheet sx={styles.container}>
        <Sheet sx={styles.display}>
          <Typography level="body1" component="p" sx={{ height: '24px' }}>
            {display}
          </Typography>
          <Typography level="h1" compoent="p">
            {result}
          </Typography>
        </Sheet>
        <Button onClick={onButtonClick}>AC</Button>
        <Button onClick={onButtonClick}>C</Button>
        <Button onClick={onButtonClick}>DEL</Button>
        <Button onClick={onButtonClick}>/</Button>

        <Button onClick={onButtonClick}>7</Button>
        <Button onClick={onButtonClick}>8</Button>
        <Button onClick={onButtonClick}>9</Button>
        <Button onClick={onButtonClick}>*</Button>

        <Button onClick={onButtonClick}>4</Button>
        <Button onClick={onButtonClick}>5</Button>
        <Button onClick={onButtonClick}>6</Button>
        <Button onClick={onButtonClick}>-</Button>

        <Button onClick={onButtonClick}>1</Button>
        <Button onClick={onButtonClick}>2</Button>
        <Button onClick={onButtonClick}>3</Button>
        <Button onClick={onButtonClick}>+</Button>

        <Button onClick={onButtonClick}>0</Button>
        <Button onClick={onButtonClick}>.</Button>
        <Button onClick={onButtonClick}>+/-</Button>
        <Button onClick={onButtonClick}>=</Button>
      </Sheet>
    </CssVarsProvider>
  );
};

export default App;
