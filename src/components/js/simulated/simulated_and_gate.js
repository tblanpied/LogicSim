
class AndGate extends Gate {
    evaluate() {
      const inputValues = this.inputs.map((input, i) => {
        if(input.gate != null){
            return input.gate.getOutput(input.index);
        }
        return false;
      });
      this.outputs_values[0] = inputValues.reduce((accumulator, currentValue) => accumulator && currentValue, true);
      this.outputs.map(output => output.gate.evaluate());
    }
  }