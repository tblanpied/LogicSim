class Gate {
    constructor(nb_inputs, nb_outputs) {
      this.inputs = Array.apply({gate: null, index: null}, Array(nb_inputs));
      this.outputs = Array.apply({gate: null, index: null}, Array(nb_outputs));
      this.outputs_values = Array.apply(false, Array(nb_outputs));
    }

    connectInput(gate, input_index, output_index) {
        if(input_index < this.inputs.length){
            this.inputs[input_index] = {gate: gate, index: output_index};
        }
        if(output_index < gate.outputs.length){
            gate.outputs[output_index] = {gate: this, index: input_index};
        }
    }
  
    connectOutput(gate, input_index, output_index) {
        if(output_index < this.outputs.length){
            this.outputs[output_index] = {gate: gate, index: input_index};
        }
        if(input_index < gate.inputs.length){
            gate.inputs[input_index] = {gate: this, index: output_index};
        }
    }

    getOutput(index){
        if(index < this.outputs_values.length){
            return this.outputs_values[index];
        }
    }
  
    evaluate() {
      // To be implemented by subclasses
    }
}