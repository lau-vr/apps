import { MeshText2D } from 'three-text2d'
import { MathExpression } from './MathExpression';
import { MathGraphMaterial } from './MathGraphShader';
import { MathCurveMaterial } from './MathCurveShader';
const createTubeGeometry = require('./createTubeGeometry');

function debounce(func, wait, immediate) {
    var timeout;
  
    return function executedFunction() {
      var context = this;
      var args = arguments;
          
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
  
      var callNow = immediate && !timeout;
      
      clearTimeout(timeout);
  
      timeout = setTimeout(later, wait);
      
      if (callNow) func.apply(context, args);
    };
  };

AFRAME.registerComponent('graph', {
    schema: {
        showBoundingLabels: {
            default: false
        },
        showAxes: {
            default: false
        },
        showBoundingBox: {
            default: false
        },
        showWireframe: {
            default: false
        },
        showGrid: {
            default: true
        },
        function: {
            default: "f(x, y) = [1.5 * x, 0.1 * x^2 * cos(y), 0.1 * x^2 * sin(y)]"
        },
        function2: {
            default: ''
        },
        opacity: {
            default: 1
        },
        opacity2: {
            default: 1
        },
        debounceTimeForBoundaryCalculation: {
            default: 0
        }
    },
    init: function () {

        this.updateBoundariesDebounced = debounce(() => {
            this.updateBoundaries();
            if (this.yMax != null) {
                this.graph.material.uniforms.yBoundaryMax.value = this.yMax;
            }
            if (this.yMin != null) {
                this.graph.material.uniforms.yBoundaryMin.value = this.yMin;
            }
            if (this.y2Max != null && this.graph2) {
                this.graph2.material.uniforms.yBoundaryMax.value = this.y2Max;
            }
            if (this.y2Min != null && this.graph2) {
                this.graph2.material.uniforms.yBoundaryMin.value = this.y2Min;
            }
            this.updateAxesLabels();
            this.boundariesNeedUpdate = false;
        }, this.data.debounceTimeForBoundaryCalculation)

        this.boundariesNeedUpdate = false;

        this.opacity = 1
        this.opacity2 = 1
        this.showWireframe = false
        this.expression = new MathExpression(this.data.function);
        this.updateBoundingBox(this.expression, 20);
        this.graph = this.createGraph(this.expression, false, this.opacity);
        this.graph.material.transparent = true;

        this.el.object3D.colliderBox = new THREE.Box3();
        this.el.object3D.colliderBox.copy( this.boundingBox ).applyMatrix4( this.graph.matrixWorld );
        this.boundingBoxVisual = new THREE.Box3Helper(this.boundingBox, 0xffffff);
        this.boundingBoxVisual.visible = false;
        
        this.root = new THREE.Group();


        this.root.add(this.graph);

        this.root.add(this.boundingBoxVisual);
        
        this.updateAxesLabels();
        this.root.add(this.labels);

        if (this.data.function2) {
            this.expression2 = new MathExpression(this.data.function2);
            this.graph2 = this.createGraph(this.expression2, true, this.opacity2);
            this.updateBoundingBox(this.expression2, 20, true);
            this.boundingBoxVisual2 = new THREE.Box3Helper(this.boundingBox2, 0xffffff);
            this.root.add(this.graph2);
            this.root.add(this.boundingBoxVisual2);
            this.root.add(this.labels2);
        }
        this.gridHelperGroup = new THREE.Group();
        const opacity = 1;
        this.gridHelperXLabel = new MeshText2D("X", {fillStyle: "#ffffff"});
        this.gridHelperXLabel.scale.set(0.03, 0.03, 0.03)
        this.gridHelperXLabel.position.set(7, 0.3, 0)
        this.gridHelperYLabel = new MeshText2D("Y", {fillStyle: "#ffffff"});
        this.gridHelperYLabel.scale.set(0.03, 0.03, 0.03)
        this.gridHelperYLabel.position.set(0, 0.2, 7)
        this.gridHelperZLabel = new MeshText2D("Z", {fillStyle: "#ffffff"});
        this.gridHelperZLabel.scale.set(0.03, 0.03, 0.03)
        this.gridHelperZLabel.position.set(0, 7.5, 0)
        this.gridHelperXY = new THREE.GridHelper( 12, 12, 0xFF3333, 0x666666 );
        this.gridHelperXY.material.opacity = opacity;
        this.gridHelperXY.material.transparent = true;
        this.gridHelperYZ = new THREE.GridHelper( 12, 12, 0xFF3333, 0x666666 );
        this.gridHelperYZ.material.opacity = opacity;
        this.gridHelperYZ.material.transparent = true;
        this.gridHelperYZ.rotation.set(0,0,-Math.PI/2)
        this.gridHelperXZ = new THREE.GridHelper( 12, 12, 0xFF3333, 0x666666 );
        this.gridHelperXZ.material.opacity = opacity;
        this.gridHelperXZ.material.transparent = true;
        this.gridHelperXZ.rotation.set(0,-Math.PI/2,-Math.PI/2)
        this.gridHelperGroup.add(this.gridHelperXY);
        this.gridHelperGroup.add(this.gridHelperYZ);
        this.gridHelperGroup.add(this.gridHelperXZ);
        this.gridHelperGroup.add(this.gridHelperXLabel);
        this.gridHelperGroup.add(this.gridHelperYLabel);
        this.gridHelperGroup.add(this.gridHelperZLabel);
        this.gridHelperGroup.visible = this.data.showGrid;
        this.root.add( this.gridHelperGroup );

        // weird fix
        new THREE.BufferGeometry();

        this.root.scale.set(0.1, 0.1, 0.1)

        this.scaleInterval = null

        this.el.sceneEl.addEventListener("scaleGraph", ({detail: id}) => {
            if (this.scaleInterval) clearInterval(this.scaleInterval)
            var newScale = this.root.scale
            let change = id === 'scalePlus' ? 0.0015 : -0.0015
            this.scaleInterval = setInterval(() => {
                if ((id=== 'scalePlus' && newScale.x <=0.2) || (id === 'scaleMinus' && newScale.x >= 0.02)){
                    newScale.x += change;
                    newScale.y += change;
                    newScale.z += change;
                    this.root.scale.set(newScale.x, newScale.y, newScale.z) 
                }
            }, 30)
        })
        
        this.el.sceneEl.addEventListener("stopScaleGraph", () => {
            if (this.scaleInterval) clearInterval(this.scaleInterval)
        })
        this.el.sceneEl.addEventListener("applyOpacity", () => {  
            this.root.remove(this.graph);
            this.graph = this.createGraph(this.expression, false, this.opacity);
            this.root.add(this.graph);
            this.updateBoundariesDebounced()
            if (this.graph.material.uniforms.wireframeActive != null ) {
                this.graph.material.uniforms.wireframeActive.value = this.showWireframe;
            }
            if (this.graph2) {
                this.root.remove(this.graph2);
                this.graph2 = this.createGraph(this.expression2, true, this.opacity2);
                this.root.add(this.graph2);
                this.updateBoundariesDebounced()
                if (this.graph2.material.uniforms.wireframeActive != null ) {
                    this.graph2.material.uniforms.wireframeActive.value = this.showWireframe;
                }
            }
        })

        //root.add(this.makeZeroPlanes())
        this.el.setObject3D('mesh', this.root)

    },
    createGraph: function(expression, isGraph2 = false, opacity) {
        // function mapping:
        // 1 input 1 output = curve
        // 1 input 2 output = curve
        // 1 input 3 output = curve
        // 2 input 1 output = graph (x,y,f(x,y))
        // 2 input 3 output = graph
        
        const inputSize = expression.getInputSize();
        const outputSize = expression.getOutputSize();
        if (inputSize == 1) {            
            return this.createCurve(expression);
        } else if (inputSize == 2) {
            if (outputSize == 1) {
                return this.createSurface(expression, isGraph2, opacity);
            } else {
                return this.createSurface(expression, isGraph2, opacity);
            }
        }
    },
    update: function (oldData) {
        
        if (this.data.function != oldData.function) {
            this.expression = new MathExpression(this.data.function);
            this.el.emit("function-changed", {function: this.data.function, function2: this.data.function2})
            this.root.remove(this.graph);
            this.graph = this.createGraph(this.expression, false, this.opacity);
            this.root.add(this.graph);
            this.boundariesNeedUpdate = true;
        }

        if (this.data.function2 != oldData.function2) {
            this.expression2 = new MathExpression(this.data.function2);
            this.el.emit("function-changed", {function: this.data.function, function2: this.data.function2})
            this.root.remove(this.graph2);
            this.graph2 = this.createGraph(this.expression2, true, this.opacity2);
            this.root.add(this.graph2);
            this.boundariesNeedUpdate = true;
            this.boundingBoxVisual2 = new THREE.Box3Helper(this.boundingBox2, 0xffffff);
            this.boundingBoxVisual2.visible = false
            this.root.add(this.boundingBoxVisual2);
            this.updateAxesLabels();
            this.root.add(this.labels2);
        }

        if (this.data.showBoundingLabels != oldData.showBoundingLabels) {
            this.labels.visible = this.data.showBoundingLabels;
            if (this.graph2) this.labels2.visible = this.data.showBoundingLabels;
        }
        if (this.data.showBoundingBox != oldData.showBoundingBox) {
            this.boundingBoxVisual.visible = this.data.showBoundingBox;
            if (this.graph2) this.boundingBoxVisual2.visible = this.data.showBoundingBox;
        }
        if (this.data.showGrid != oldData.showGrid) {
            this.gridHelperGroup.visible = this.data.showGrid;
        }
        
        if (this.data.showWireframe != oldData.showWireframe) {
            this.showWireframe = this.data.showWireframe
            if (this.graph.material.uniforms.wireframeActive != null ) {
                this.graph.material.uniforms.wireframeActive.value = this.data.showWireframe;
            }
            if (this.graph2 && this.graph2.material.uniforms.wireframeActive != null ) {
                this.graph2.material.uniforms.wireframeActive.value = this.data.showWireframe;
            }
        }
        for (let [param, info] of Object.entries(this.getParameterExtrema())) {
            if (this.graph.material.uniforms[param+"Min"].value != info.min) {
                this.graph.material.uniforms[param+"Min"].value = info.min;
                this.boundariesNeedUpdate = true;
            }
            if (this.graph.material.uniforms[param+"Max"].value != info.max) {
                this.graph.material.uniforms[param+"Max"].value = info.max;
                this.boundariesNeedUpdate = true;
            }
        }
        for (let [variable, value] of Object.entries(this.getVariables())) {
            if (this.graph.material.uniforms[variable].value != value) {
                this.graph.material.uniforms[variable].value = value
                this.boundariesNeedUpdate = true;
            }
        };

        if (this.data.opacity !== oldData.opacity){
            this.opacity = this.data.opacity
        }

        if (this.graph2){
            for (let [param, info] of Object.entries(this.getParameterExtrema(true))) {
                if (this.graph2.material.uniforms[param+"Min"].value != info.min) {
                    this.graph2.material.uniforms[param+"Min"].value = info.min;
                    this.boundariesNeedUpdate = true;
                }
                if (this.graph2.material.uniforms[param+"Max"].value != info.max) {
                    this.graph2.material.uniforms[param+"Max"].value = info.max;
                    this.boundariesNeedUpdate = true;
                }
            }
            
            for (let [variable, value] of Object.entries(this.getVariables(true))) {
                if (this.graph2.material.uniforms[variable].value != value) {
                    this.graph2.material.uniforms[variable].value = value
                    this.boundariesNeedUpdate = true;
                }
            };
            
            if (this.data.opacity2 !== oldData.opacity2){
                this.opacity2 = this.data.opacity2
            }
        }

        if (this.boundariesNeedUpdate) {
            this.updateBoundariesDebounced();
        }
        
    },
    getVariables: function(isGraph2 = false) {
        let variables = {};
        let expression = isGraph2 ? this.expression2 : this.expression;

        expression.getVariables().forEach(variable => {
            let value;
            if (this.data[variable ] != null) {
                value = this.data[variable ];
            } else if (this.data[variable +"Min"] != null) {
                value = this.data[variable +"Min"];
            }
            else if (this.data[variable +"Max"] != null) {
                value = this.data[variable +"Max"];
            } else {
                value = 1
            }            
            variables[variable] = value;
        });
        return variables;
    },
    updateSchema: function (newData) {
        if (newData.function !== this.oldData.function) {
            const expression = new MathExpression(newData.function);
            let schema = {};
            expression.getParameters().forEach(param => {
                schema[param+"Min"] = {
                    default: -6
                };
                schema[param+"Max"] = {
                    default: 6
                };
                schema[param+"2Min"] = {
                    default: -6
                };
                schema[param+"2Max"] = {
                    default: 6
                };
            });
            // expression.getVariables().forEach(param => {
            //     schema[param] = {
            //         default: 1
            //     };
            // });
          this.extendSchema(schema);
        }
    },
    getParameterExtrema: function (isGraph2 = false) {
        let parameterExtrema = {};
        let expression = isGraph2 ? this.expression2 : this.expression;

        expression.getParameters().forEach(param => {
            let min = -6;
            let max = 6;
            if (this.data[param + (isGraph2 ? '2' : '') + "Min"] != null) {
                min = parseFloat(this.data[param + (isGraph2 ? '2' : '') +"Min"])
            }
            if (this.data[param + (isGraph2 ? '2' : '') +"Max"] != null) {
                max = parseFloat(this.data[param + (isGraph2 ? '2' : '') +"Max"])
            }
            parameterExtrema[param] = {
                min: min,
                max: max,
                range: max - min
            }
        });
        
        return parameterExtrema;
    },
    updateBoundingBox: function (expression, segments = 100, isGraph2 = false) {

        const extrema = this.getParameterExtrema(isGraph2);
        const parameters = expression.getParameters();        

        let explicitFunctionParameter = [];

        function cartesianProduct(arr) {
            return arr.reduce(function(a,b){
                return a.map(function(x){
                    return b.map(function(y){
                        return x.concat([y]);
                    })
                }).reduce(function(a,b){ return a.concat(b) },[])
            }, [[]])
        }

        for (let i = 0; i < parameters.length; i++) {
            const extremum = extrema[parameters[i]];
            explicitFunctionParameter[i] = new Array(segments + 1);
            for (let segmentIndex = 0; segmentIndex <= segments; segmentIndex++) {
                explicitFunctionParameter[i][segmentIndex] = extremum.min + extremum.range / segments * segmentIndex;
            }
        }
        explicitFunctionParameter = cartesianProduct(explicitFunctionParameter);

        if (!isGraph2){
            this.xMin = null;
            this.xMax = null;
            this.yMin = null;
            this.yMax = null;
            this.zMin = null;
            this.zMax = null;
        } else {
            this.x2Min = null;
            this.x2Max = null;
            this.y2Min = null;
            this.y2Max = null;
            this.z2Min = null;
            this.z2Max = null;
        }

        let xValue;
        let yValue;
        let zValue;

        let variables = {}
        for (const variable of expression.getVariables()) {
            variables[variable] = 1;
            if (this.data[variable] != null) {
                variables[variable] = parseFloat(this.data[variable])
            }
        }
        let JSFunc = expression.getJSFunction(variables);
        const inputSize = expression.getInputSize();
        const outputSize = expression.getOutputSize();
        let func;
        if (inputSize == 2 && outputSize == 1) {
            func = (x,y) => [x,JSFunc(x,y),y]
        } else if (inputSize == 1 && outputSize == 1) {
            func = (t) => [t,JSFunc(t),0]
        } else if (inputSize == 1 && outputSize == 2) {
            func = (t) => [JSFunc(t)[0], JSFunc(t)[1], 0]
        } else if (inputSize == 2 && outputSize == 3) {
            func = (u,v) => [JSFunc(u,v)[0], JSFunc(u,v)[2], JSFunc(u,v)[1]]
        } else if (inputSize == 1 && outputSize == 3) {
            func = (t) => [JSFunc(t)[0], JSFunc(t)[2], JSFunc(t)[1]]
        } else {
            func = JSFunc;
        }
        let funcResult;
        for (let i = 0; i < explicitFunctionParameter.length; i++) {
            funcResult = func(...explicitFunctionParameter[i]);
            xValue = funcResult[0];
            yValue = funcResult[1];
            zValue = funcResult[2] * -1;            

            if (!isGraph2){
                if (this.xMin == null || xValue < this.xMin) {
                    this.xMin = xValue
                }
                if (this.xMax == null || xValue > this.xMax) {
                    this.xMax = xValue
                }
                if (this.yMin == null || yValue < this.yMin) {
                    this.yMin = yValue
                }
                if (this.yMax == null || yValue > this.yMax) {
                    this.yMax = yValue
                }
                if (this.zMin == null || zValue < this.zMin) {
                    this.zMin = zValue
                }
                if (this.zMax == null || zValue > this.zMax) {
                    this.zMax = zValue
                }
            } else {
                if (this.x2Min == null || xValue < this.x2Min) {
                    this.x2Min = xValue
                }
                if (this.x2Max == null || xValue > this.x2Max) {
                    this.x2Max = xValue
                }
                if (this.y2Min == null || yValue < this.y2Min) {
                    this.y2Min = yValue
                }
                if (this.y2Max == null || yValue > this.y2Max) {
                    this.y2Max = yValue
                }
                if (this.z2Min == null || zValue < this.z2Min) {
                    this.z2Min = zValue
                }
                if (this.z2Max == null || zValue > this.z2Max) {
                    this.z2Max = zValue
                }
            }
        }        

        if (!isGraph2){
            if (this.xMax - this.xMin == 0) {
                this.xMax += 0.2;
                this.xMin -= 0.2;
            }
            if (this.yMax - this.yMin == 0) {
                this.yMax += 0.2;
                this.yMin -= 0.2;
            }
            if (this.zMax - this.zMin == 0) {
                this.zMax += 0.2;
                this.zMin -= 0.2;
            }
        } else {
            if (this.x2Max - this.x2Min == 0) {
                this.x2Max += 0.2;
                this.x2Min -= 0.2;
            }
            if (this.y2Max - this.y2Min == 0) {
                this.y2Max += 0.2;
                this.y2Min -= 0.2;
            }
            if (this.z2Max - this.z2Min == 0) {
                this.z2Max += 0.2;
                this.z2Min -= 0.2;
            }
        }

        if (!isGraph2){
            var minVec = new THREE.Vector3(this.xMin, this.yMin, this.zMin);
            var maxVec = new THREE.Vector3(this.xMax, this.yMax, this.zMax);
        } else {
            var minVec = new THREE.Vector3(this.x2Min, this.y2Min, this.z2Min);
            var maxVec = new THREE.Vector3(this.x2Max, this.y2Max, this.z2Max);
        }

        if (!isGraph2){
            this.xRange = this.xMax - this.xMin;
            this.yRange = this.yMax - this.yMin;
            this.zRange = this.zMax - this.zMin;
        } else {
            this.xRange2 = this.x2Max - this.x2Min;
            this.yRange2 = this.y2Max - this.y2Min;
            this.zRange2 = this.z2Max - this.z2Min;
        }

        if (!isGraph2){
            if (this.boundingBox != null) {
                this.boundingBox.min = minVec;
                this.boundingBox.max = maxVec;
            } else {
                this.boundingBox = new THREE.Box3(minVec, maxVec)
            }
        } else {
            if (this.boundingBox2 != null) {
                this.boundingBox2.min = minVec;
                this.boundingBox2.max = maxVec;
            } else {
                this.boundingBox2 = new THREE.Box3(minVec, maxVec)
            }

        }
    },
    tick: function () {
        if (this.boundingBox != null) {
            this.el.object3D.colliderBox.copy( this.boundingBox ).applyMatrix4( this.graph.matrixWorld );
        }
    },
    updateBoundaries: function() {
        this.updateBoundingBox(this.expression, 20);
        this.boundingBoxVisual.box = this.boundingBox;
        if (this.graph2){
            this.updateBoundingBox(this.expression2, 20, true);
            this.boundingBoxVisual2.box = this.boundingBox2;
        }
        if (this.graph != null) {
            if (this.yMax != null) {
                this.graph.material.uniforms.yBoundaryMax.value = this.yMax;
            }
            if (this.yMin != null) {
                this.graph.material.uniforms.yBoundaryMin.value = this.yMin;
            }
        }
        if (this.graph2){
            if (this.y2Max != null) {
                this.graph2.material.uniforms.yBoundaryMax.value = this.y2Max;
            }
            if (this.y2Min != null) {
                this.graph2.material.uniforms.yBoundaryMin.value = this.y2Min;
            }
        }
    },
    createSurface: function (expression, isGraph2 = false, opacity) {
        new THREE.BufferGeometry();
        const graphGeometry = new THREE.PlaneBufferGeometry(1, 1, 200, 200);
        graphGeometry.scale(1, 1, 1);
        const graphMat = new MathGraphMaterial(expression, isGraph2, opacity);
        const graph = new THREE.Mesh(graphGeometry, graphMat.material);
        graph.frustumCulled = false;

        return graph;
    },
    createCurve: function (expression) {

        const numSides = 8;
        const subdivisions = 100;

        const graphGeometry = createTubeGeometry(numSides, subdivisions);
        graphGeometry.scale(1, 1, 1);
        const graphMat = new MathCurveMaterial(expression, subdivisions)
        const graph = new THREE.Mesh(graphGeometry, graphMat.material);
        graph.frustumCulled = false;

        return graph;
    },
    makeAxes: function () {
        var size = Math.min(this.xRange, this.yRange, this.zRange) / 2
        var axes = new THREE.AxesHelper(size);
        axes.position.set(this.xMin, this.yMin, this.zMin)
        return axes;
    },
    updateAxesLabels: function () {

        const scale = 0.02;
        const space = 0.2;
        const offset = 0.6;
        
        if (this.xMinText == null) {            
            this.xMinText = new MeshText2D("", {fillStyle: "#fb2841"});
        }
        this.xMinText.text = (Math.floor(this.xMin * 100) / 100).toString();
        this.xMinText.scale.set(scale,scale,scale);
        this.xMinText.position.set(this.xMin + space, this.yMin, this.zMin - offset);
        if (this.xMaxText == null) {
            this.xMaxText = new MeshText2D("", {fillStyle: "#fb2841"});
        }
        this.xMaxText.text = (Math.floor(this.xMax * 100) / 100).toString();
        this.xMaxText.scale.set(scale,scale,scale);
        this.xMaxText.position.set(this.xMax - space, this.yMin, this.zMin - offset)

        if (this.yMinText == null) {
            this.yMinText = new MeshText2D("", {fillStyle: "#14eb0d"});
        }
        this.yMinText.text = (Math.floor(this.yMin * 100) / 100).toString();
        this.yMinText.scale.set(scale,scale,scale);
        this.yMinText.position.set(this.xMax + offset, this.yMin + space, this.zMax + offset);
        if (this.yMaxText == null) {
            this.yMaxText = new MeshText2D("", {fillStyle: "#14eb0d"});
        }
        this.yMaxText.text = (Math.floor(this.yMax * 100) / 100).toString();
        this.yMaxText.scale.set(scale,scale,scale);
        this.yMaxText.position.set(this.xMax + offset, this.yMax - space, this.zMax + offset)

        if (this.zMinText == null) {
            this.zMinText = new MeshText2D("", {fillStyle: "#49caf3"});
        }
        this.zMinText.text = (Math.floor(this.zMin * 100) / 100).toString();
        this.zMinText.scale.set(scale,scale,scale);
        this.zMinText.position.set(this.xMin - offset, this.yMin, this.zMin + space);
        if (this.zMaxText == null) {
            this.zMaxText = new MeshText2D("", {fillStyle: "#49caf3"});
        }
        this.zMaxText.text = (Math.floor(this.zMax * 100) / 100).toString();
        this.zMaxText.scale.set(scale,scale,scale);
        this.zMaxText.position.set(this.xMin - offset, this.yMin, this.zMax - space)

        if (this.labels == null) {
            this.labels = new THREE.Group();
            this.labels.add(this.xMinText);
            this.labels.add(this.xMaxText);
            this.labels.add(this.yMinText);
            this.labels.add(this.yMaxText);
            this.labels.add(this.zMinText);
            this.labels.add(this.zMaxText);
        }
        
        if (this.graph2) {
            if (this.xMinText2 == null) {            
                this.xMinText2 = new MeshText2D("", {fillStyle: "#fb2841"});
            }
            this.xMinText2.text = (Math.floor(this.x2Min * 100) / 100).toString();
            this.xMinText2.scale.set(scale,scale,scale);
            this.xMinText2.position.set(this.x2Min + space, this.y2Min, this.z2Min - offset);
            if (this.xMaxText2 == null) {
                this.xMaxText2 = new MeshText2D("", {fillStyle: "#fb2841"});
            }
            this.xMaxText2.text = (Math.floor(this.x2Max * 100) / 100).toString();
            this.xMaxText2.scale.set(scale,scale,scale);
            this.xMaxText2.position.set(this.x2Max - space, this.y2Min, this.z2Min - offset)
    
            if (this.yMinText2 == null) {
                this.yMinText2 = new MeshText2D("", {fillStyle: "#14eb0d"});
            }
            this.yMinText2.text = (Math.floor(this.y2Min * 100) / 100).toString();
            this.yMinText2.scale.set(scale,scale,scale);
            this.yMinText2.position.set(this.x2Max + offset, this.y2Min + space, this.z2Max + offset);
            if (this.yMaxText2 == null) {
                this.yMaxText2 = new MeshText2D("", {fillStyle: "#14eb0d"});
            }
            this.yMaxText2.text = (Math.floor(this.y2Max * 100) / 100).toString();
            this.yMaxText2.scale.set(scale,scale,scale);
            this.yMaxText2.position.set(this.x2Max + offset, this.y2Max - space, this.z2Max + offset)
    
            if (this.zMinText2 == null) {
                this.zMinText2 = new MeshText2D("", {fillStyle: "#49caf3"});
            }
            this.zMinText2.text = (Math.floor(this.z2Min * 100) / 100).toString();
            this.zMinText2.scale.set(scale,scale,scale);
            this.zMinText2.position.set(this.x2Min - offset, this.y2Min, this.z2Min + space);
            if (this.zMaxText2 == null) {
                this.zMaxText2 = new MeshText2D("", {fillStyle: "#49caf3"});
            }
            this.zMaxText2.text = (Math.floor(this.z2Max * 100) / 100).toString();
            this.zMaxText2.scale.set(scale,scale,scale);
            this.zMaxText2.position.set(this.x2Min - offset, this.y2Min, this.z2Max - space)
    
            if (this.labels2 == null) {
                this.labels2 = new THREE.Group();
                this.labels2.add(this.xMinText2);
                this.labels2.add(this.xMaxText2);
                this.labels2.add(this.yMinText2);
                this.labels2.add(this.yMaxText2);
                this.labels2.add(this.zMinText2);
                this.labels2.add(this.zMaxText2);
            }
        }
    }
})