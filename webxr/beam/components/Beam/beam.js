import {params, beam_offset} from '../../utils/params'
import * as PHYSICS from '../../utils/physics.js';
import { Lut } from 'three/examples/jsm/math/Lut.js';
let lut;
let cooltowarm = new Lut("cooltowarm", 512); // options are rainbow, cooltowarm and blackbody
let old_displacement = 0
let old_load_position = 2

AFRAME.registerComponent('beam', {
    schema: {
        length: { type: 'number', default: params.length },
        height: { type: 'number', default: params.height },
        depth: { type: 'number', default: params.depth },
        applied_displacement: { type: 'number', default: params.displacement.y },
        load_position: { type: 'number', default: params.load_position },
        colour_by: { type: 'number', default: params.colour_by },
    },

    /**
     * Initial creation and setting of the mesh.
     */
    init: function() {
        var data = this.data;
        var el = this.el;

        this.data['applied_displacementMin'] = 0
        this.data['applied_displacementMax'] =1
        this.data['load_positionMin'] =5
        this.data['load_positionMax'] = data.length-5

        // Create geometry.
        this.geometry = new THREE.BoxBufferGeometry(1, 1, 1, params.np, 1, 1);

        // Create material.
        this.material = new THREE.MeshStandardMaterial({ color: 0xcccccc, vertexColors: true });

        // Create mesh.
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.scale.set(data.length, data.depth, data.height);
        // this.mesh.scale.set(data.length, data.height, data.depth);

        this.mesh.position.add(beam_offset); // move the beam away from the start location

        // this.mesh.rotation.set(165,0,0)
        const type = 'beam';
        this.mesh.userData.type = type; // this sets up interaction group for controllers
        console.log(this.mesh.geometry.attributes)
        PHYSICS.set_initial_position(this.mesh.geometry.attributes.position.array);
        // Set mesh on entity.
        el.setObject3D('mesh', this.mesh);
    },
    update: function() {
        var data = this.data;
        data.applied_displacement = data.applied_displacement>0?data.applied_displacement:0
        data.load_position = data.load_position>2?data.load_position:2

        if(data.load_position != old_load_position){
            old_load_position = data.load_position
        }
        if(data.applied_displacement != old_displacement){

            if(old_displacement>data.applied_displacement){

                let beam_offset_1 = new THREE.Vector3(0,   + data.applied_displacement*0.08, 0);

                if(this.mesh.position.y  + data.applied_displacement*0.08<3){
                    this.mesh.position.add(beam_offset_1);
                }else{
                    this.mesh.position.y = 3
                }

                data.depth = data.depth + data.applied_displacement*0.025<params.depth?data.depth + data.applied_displacement*0.025:params.depth;

            }else{

                let beam_offset_1 = new THREE.Vector3(0, - data.applied_displacement*0.008, 0);

                if(this.mesh.position.y  - data.applied_displacement*0.008 >2.9){
                    this.mesh.position.add(beam_offset_1);
                }else{
                    this.mesh.position.y = 2.9

                }
    
                data.depth = data.depth - data.applied_displacement*0.025>1.24919?data.depth - data.applied_displacement*0.025:1.24919;

            }

            old_displacement = data.applied_displacement
        }
        
        this.mesh.scale.set(data.length, data.depth, data.height);
 
        params.load_position = data.load_position
        params.displacement.y = data.applied_displacement
        PHYSICS.updateDeformation(params);
        this.mesh.geometry.setAttribute('position', new THREE.BufferAttribute(PHYSICS.positions, 3));

        this.mesh.geometry.attributes.position.needsUpdate = true;

        if (data.colour_by === 0) {
            let colors = [];
            for (let i = 0; i < PHYSICS.shear_force.length; i++) {
                colors.push(1, 1, 1);
            }
    
            this.mesh.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
            this.mesh.geometry.attributes.color.needsUpdate = true;
            this.mesh.material.needsUpdate = true;
        } else {
            let arr, max_val;
            if (data.colour_by === 1) {
                arr = PHYSICS.bending_moment;
                lut = cooltowarm;
                max_val = PHYSICS.M_max;
            } else if (data.colour_by === 2) {
                arr = PHYSICS.shear_force;
                lut = cooltowarm;
                max_val = PHYSICS.SF_max;
            }
            const colors = [];
    
            if (max_val > 0) {
                lut.setMin(-max_val);
                lut.setMax(max_val);
                for (let i = 0; i < arr.length; i++) {
                    const colorValue = arr[i];
                    const color = lut.getColor(colorValue);
                    colors.push(color.r, color.g, color.b);
                }
            } else {
                for (let i = 0; i < arr.length; i++) {
                    colors.push(0, 0, 0);
                }
            }
            this.mesh.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
            this.mesh.geometry.attributes.color.needsUpdate = true;
            this.mesh.material.needsUpdate = true;
    
        }

    },
    getVariables: function(){
        var data = this.data;

        let variables = {}
        variables['applied_displacement'] = data.applied_displacement;
        variables['load_position'] = data.load_position;

       
        return variables;
        

    }

});