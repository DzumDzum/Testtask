import React, { Component } from "react";

class Table extends Component {
  state = {
    headers: [
      "reg0",
      "reg1",
      "reg2",
      "reg3",
      "reg4",
      "reg5",
      "reg6",
      "reg7",
      "dec"
    ],
    headers_result: [
      "reg0",
      "reg1",
      "reg2",
      "reg3",
      "reg4",
      "reg5",
      "reg6",
      "reg7",
      "reg8",
      "reg9",
      "reg10",
      "reg11",
      "reg12",
      "reg13",
      "reg14",
      "reg15",
      "dec"
    ],
    bytes: [{ id: 0, value: 6 }, { id: 1, value: 1 }, { id: 2, value: 9 }],
    result: { value: 0 }
  };
  bgColors = {
    Default: "#81b71b",
    Blue: "#00B1E1",
    Cyan: "#37BC9B",
    Green: "#8CC152",
    Red: "#E9573F",
    Yellow: "#F6BB42",
    White: "#FFFFFF"
  };
  // Функция для умножеия (сдвиг эллементов массива на n)
  Shift = (arr, n) => {
    let shift =[];
    for (let i = 0; i < arr.length + n; i++){
      shift[i] = 0;
    }
    for (let i = arr.length - 1; i >= 0; i--){
      shift[i + n] = arr[i];
    }
    return shift;
  }
//Двоичное умножение двух чисел
  Multiply2nums = (arr1, arr2) => {
    let multy = [];
    for (let i = 0; i < arr1.length; i++){
      if (arr2[i]){
        let shift = this.Shift(arr1 , i);
        let multyT = multy;
        multy = this.Summarize2nums(shift,multyT);
      }
    }
    return multy;
  }  
//Двоичное умножение
  Multiply = () => {
    let ArrayI = [];
    let multy = [];
    //Подготовка массива (заполнение)
    for (let i = 0; i < this.state.bytes.length; i++){
      let ArrayJ = this.binarizeTEMP(this.state.bytes[i]);
      ArrayI.push(ArrayJ);
    }
    //Умножение
    if (ArrayI.length > 0){
      multy = ArrayI[0];
     for(let i = 1; i < ArrayI.length; i++){
      multy = this.Multiply2nums(multy,ArrayI[i]);
     }
    }
    console.log(multy);

    let multyNum = 0;
    for (let i = 0; i < multy.length; i++){
        multyNum += multy[i] * Math.pow(2,i);
    }
    const obj = {value: multyNum};
    this.setState({result:obj});
  }

//Двоичное сложение двух чисел
  Summarize2nums = (arr1, arr2) => {
    let SummArr = [];
    let temp = 0;
    for (let j = 0; j < Math.max(arr1.length,arr2.length); j++){
      if ((arr1[j] === arr2[j]) && (arr1[j] === 1)){
        if (temp === 1) SummArr[j] = 1;
        else{
          SummArr[j] = 0; 
          temp = 1;
          }
      }
      else if (arr2[j] || arr1[j]){
        if (temp === 1) SummArr[j] = 0;
        else{
          SummArr[j] = 1;
          temp = 0; 
        }
      }
      else{
        if (temp === 1){
          SummArr[j] = 1;
          temp = 0; 
         }
        else SummArr[j] = 0; 
      }
    }
    if (temp === 1) SummArr.push(1);

    return SummArr;
  }
// Двоичное сложение всех чисел
  Summarize = () => {
    let ArrayI = [];
    //Подготовка массива (заполнение)
    for (let i = 0; i < this.state.bytes.length; i++){
      let ArrayJ = this.binarizeTEMP(this.state.bytes[i]);
      ArrayI.push(ArrayJ);
    }
    //Сложение
    let ArraySumm = [];
    for (let i = 0; i < ArrayI.length; i++){
      ArraySumm = this.Summarize2nums(ArraySumm, ArrayI[i])
    }
    let deceit_Summ = 0;
    for (let i = 0; i < ArraySumm.length; i++){
      deceit_Summ += ArraySumm[i] * Math.pow(2,i);
    }
    console.log(ArraySumm);
    const obj = {value: deceit_Summ};
    this.setState({result:obj});
  } 

  binarize = byte => {
    let number = byte.value;
    const bits = [];
    for (let index = 0; index < 8; index++) {
      const key = index.toString();
      bits.unshift(
        number % 2 === 0 ? (
          <td
            className="align-middle text-center"
            key={key}
            onClick={() => this.onClickCell(byte, index)}
          >
            0
          </td>
        ) : (
          <td
            className="align-middle text-center"
            key={key}
            onClick={() => this.onClickCell(byte, index)}
          >
            1
          </td>
        )
      );
      number = Math.floor(number / 2);
    }
    return bits;
  };

  binarizeTEMP = byte => {
    let number = byte.value;
    const bits = [];
    for (let index = 0; index < 8; index++) {
      bits.push(number % 2 === 0 ? 0 : 1 );
      number = Math.floor(number / 2);
    }
    return bits;
  };

  binarizeResult = byte => {
    let number = byte.value;
    const bits = [];
    for (let index = 0; index < 16; index++) {
      const key = index.toString();
      bits.unshift(
        number % 2 === 0 ? (
          <td className="align-middle text-center" key={key}>
            0
          </td>
        ) : (
          <td className="align-middle text-center" key={key}>
            1
          </td>
        )
      );
      number = Math.floor(number / 2);
    }
    return bits;
  };

  chooseColor = byte => {
    if (byte > 100) return this.bgColors.Red;
    else if (byte > 50) return this.bgColors.Yellow;
    else return this.bgColors.Default;
  };

  addByte = () => {
    const bytes = [...this.state.bytes];
    bytes.push({ id: bytes.length, value: 0 });
    this.setState({ bytes });
  };

  deleteByte = byte => {
    let bytes = [...this.state.bytes];
    bytes = bytes.filter(el => el !== byte);
    this.setState({ bytes });
  };

  onClickCell = (byte, ind) => {
    const index = this.state.bytes.indexOf(byte);
    let val = byte.value;
    for (let index = 0; index < ind; index++) {
      val = Math.floor(val / 2);
    }
    if (val % 2 === 0) byte.value += Math.pow(2, ind);
    else byte.value -= Math.pow(2, ind);

    const bytes = [...this.state.bytes];
    bytes[index] = byte;
    this.setState({ bytes });
  };

  render() {
    const headers = this.state.headers.map(header => (
      <th scope="col" key={header}>
        {header}
      </th>
    ));

    const headersResult = this.state.headers_result.map(header => (
      <th scope="col" key={header}>
        {header}
      </th>
    ));

    const bytes = this.state.bytes.map((byte, ind) => (
      <tr key={ind} style={{ backgroundColor: this.chooseColor(byte.value) }}>
        {this.binarize(byte)}
        <td className="align-middle text-center" key={byte.id}>
          {byte.value}
        </td>
        <td
          style={{
            backgroundColor: this.bgColors.White,
            borderColor: this.bgColors.White
          }}
        >
          <button
            className="btn btn-danger"
            onClick={() => this.deleteByte(byte)}
          >
            delete
          </button>
        </td>
      </tr>
    ));

    const result = (
      <tr key="result" style={{ backgroundColor: this.bgColors.White }}>
        {this.binarizeResult(this.state.result)}
        <td className="align-middle text-center">{this.state.result.value}</td>
        <td
          style={{
            backgroundColor: this.bgColors.White,
            borderColor: this.bgColors.White
          }}
        ></td>
      </tr>
    );

    return (
      <div className="container" style={{ marginTop: 80 }}>
        <table className="table table-sm table-bordered">
          <thead>
            <tr>{headers}</tr>
          </thead>
          <tbody>{bytes}</tbody>
        </table>
        <div className="row">
          <div className="col">
            <button
              className="btn btn-primary"
              style={{ margin: 10 }}
              onClick={this.addByte}
            >
              Add new row
            </button>
            <button
              className="btn btn-primary"
              style={{ margin: 10 }}
              onClick={this.Multiply}
            >
              Multiply
            </button>
            <button
              className="btn btn-primary"
              style={{ margin: 10 }}
              onClick={this.Summarize}
            >
              Summarize
            </button>

            <h2>Результат</h2>
            <table className="table table-sm table-bordered">
              <thead>
                <tr>{headersResult}</tr>
              </thead>
              <tbody>{result}</tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default Table;
