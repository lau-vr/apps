import { getDevice } from "../GazeBasedSystem/DeviceCamera";

let global_interval = null

AFRAME.registerComponent('beam-variable-ui', {
    schema: {
        beam_upper: {
            type: "selector"
        },
        beam: {
            type: "selector"
        },
        beam_lower:{
            type: "selector"
        }
        },
    init: function() {
        if (this.data.beam_upper == null) {
            throw new Error("Beam Object not found!")
        }
        if (this.data.beam == null) {
            throw new Error("Beam Object not found!")
        }
        if (this.data.beam_lower == null) {
            throw new Error("Beam Object not found!")
        }
        this.beam = this.data.beam.components["beam"];
        if (this.beam == null) {
            throw new Error("Beam Component not found!")
        }
                
        this.setup()
    },
    setup: function() {
        var data = this.data;
        var el = this.el;
        // this.el.innerHTML = "";
        this.variables = this.beam.getVariables();

        const height = 0.30;
        const offset = Object.keys(this.variables).length * height / 2;

        let index = 0;
        for (let [variable, value] of Object.entries(this.variables)) {
            let slider = this.createSlider(variable, parseFloat(value), parseFloat(this.beam.data[variable+"Min"]), parseFloat(this.beam.data[variable+"Max"]));
            slider.setAttribute('position', `0 ${index * -height + offset} 0`)
            slider.addEventListener('change', (evt) => {
                var newvalue = evt.detail.value;
                this.updateBeam(variable, newvalue)
                if(variable == "load_position"){
                    let arrow = document.getElementById("arrow_1")
                    let newarrowpos = ((newvalue - 10) / 2.5) + 3.65  
                    arrow.setAttribute("position", {x:newarrowpos,y:6.5,z:-5.3})
                }        
            })
            let plus = document.createElement("a-entity")
            plus.setAttribute("gltf-model", "#plus")
            plus.setAttribute("scale", "0.0055 0.0055 0.0055")
            plus.setAttribute("rotation", "90 0 0")
            plus.setAttribute('position', `0.1 ${index * -height + offset + 0.03} 0`)
            let minus = document.createElement("a-entity")
            minus.setAttribute("gltf-model", "#minus")
            minus.setAttribute("scale", "0.0055 0.0055 0.0055")
            minus.setAttribute("rotation", "90 0 0")
            minus.setAttribute('position', `-0.45 ${index * -height + offset + 0.03} 0`)
            var interval = null
            if(getDevice() === "Mobile"){
                plus.addEventListener("mouseenter", () => {
                    if (interval) clearInterval(interval)
                    interval = this.gazeBasedChangeValue(slider, variable, "plus")
                })
                minus.addEventListener("mouseenter", () => {
                    if (interval) clearInterval(interval)
                    interval = this.gazeBasedChangeValue(slider, variable, "minus")
                })
            } else {
                plus.addEventListener("mousedown", () => {
                    if (interval) clearInterval(interval)
                    interval = this.gazeBasedChangeValue(slider, variable, "plus")
                })
                plus.addEventListener("mouseup", () => {
                    if (interval) clearInterval(interval)
                })
                minus.addEventListener("mousedown", () => {
                    if (interval) clearInterval(interval)
                    interval = this.gazeBasedChangeValue(slider, variable, "minus")
                })
                minus.addEventListener("mouseup", () => {
                    if (interval) clearInterval(interval)
                })
            }
            
            plus.addEventListener("mouseleave", () => {
                if (interval) clearInterval(interval)
            })
            minus.addEventListener("mouseleave", () => {
                if (interval) clearInterval(interval)
            })

            this.el.appendChild(slider)
            if(getDevice() === "Desktop" || getDevice() === "Mobile"){
                this.el.appendChild(plus)
                this.el.appendChild(minus)
            }

            index++;
        }
        let button = document.getElementById("play")
        if(getDevice() === "Mobile"){
            button.addEventListener("mouseenter", () => {
                let slider = document.getElementById('applied_displacement');
                if (slider && !global_interval) {
                    slider.emit("animateValue", { mode: "plus" });
                }
            })
        }else{
        button.addEventListener("click", () => {
          let slider = document.getElementById('applied_displacement');
          if (slider && !global_interval) {
            slider.emit("animateValue", { mode: "plus" });
          }
        });
    }
    },
    createSlider: function(variable, value, min, max) {
        if ((min == null || isNaN(min)) && (max == null || isNaN(max))) {
            min = value - 1
            max = value + 1
        } else if ((min == null || isNaN(min)) && (max != null && !isNaN(max))) {
            min = value - 1;
        } else if ((min != null && !isNaN(min)) && (max == null || isNaN(max))) {
            max = value + 1;
        }        
        const slider = document.createElement("a-entity");
        slider.setAttribute('id', variable); // Add id attribute
        slider.setAttribute('my-slider', {
            title: `${variable}`,
            value,
            min,
            max
        })
        // Add animation component
        slider.setAttribute('animation__value', {
            property: 'my-slider.value',
            dur: 4000,
            easing: 'linear',
            to: value // Start value
        });
        // Listen for animateValue event
        slider.addEventListener("animateValue", (evt) => {
            let sliderAttributes = slider.getAttribute("my-slider");
            let mode = sliderAttributes.value < 1 ? "plus" : "minus";
            if ((mode === 'plus' && sliderAttributes.value < sliderAttributes.max) ||
                (mode === 'minus' && sliderAttributes.value > sliderAttributes.min)) {
            let newvalue = 0;
            global_interval = null
            global_interval = setInterval(() => {
                    sliderAttributes.value = newvalue;
                    slider.setAttribute('my-slider', sliderAttributes);
                    newvalue +=0.01;
                    if(newvalue>1){
                        newvalue=1;
                        clearInterval(global_interval)
                        global_interval = null
                    }
                this.updateBeam('applied_displacement', newvalue)
                }, 50);
            }
        });
        return slider;
    },
    gazeBasedChangeValue: function (slider, variable, mode) {
        let interval = setInterval(() => {
            let sliderAttributes = slider.getAttribute("my-slider")
            let arrow = document.getElementById("arrow_1")
            if ((mode === 'plus' && sliderAttributes.value < sliderAttributes.max) ||
            (mode === 'minus' && sliderAttributes.value > sliderAttributes.min)){
                let newvalue;
                if(variable == "load_position"){
                    newvalue = sliderAttributes.value + (mode === "plus" ?  0.05 : -0.05);

                    let newarrowpos = arrow.getAttribute("position").x +  (mode === "plus" ? 0.08 : -0.08);
                    arrow.setAttribute("position", {x:newarrowpos,y:6.5,z:-5.3})
                }else{
                    newvalue = sliderAttributes.value + (mode === "plus" ?  0.01 : -0.01);
                }
                this.updateBeam(variable, newvalue)
                sliderAttributes["value"] = newvalue;
                slider.setAttribute('my-slider', sliderAttributes)
            }
        }, 25)
        return interval
    },
    updateBeam: function (variable, newvalue) {
        let beamAttributes = {}
        let sideAttributes = {}
        if(variable == 'applied_displacement'){
        sideAttributes[variable] = newvalue.toFixed(2)*6.52;
        beamAttributes[variable] = newvalue.toFixed(2);
        }else{
            sideAttributes[variable] = newvalue.toFixed(2);
            beamAttributes[variable] = newvalue.toFixed(2);
        }

        this.data.beam_upper.setAttribute('beam_upper', sideAttributes)
        this.data.beam.setAttribute('beam', beamAttributes)
        this.data.beam_lower.setAttribute('beam_lower', sideAttributes)
    }
})