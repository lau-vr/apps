import * as PHYSICS_UPPER from '../../utils/physics_upper';
import { beam_upper_offset, params, params_upper } from '../../utils/params';

import { Lut } from 'three/examples/jsm/math/Lut.js';

let lut;
let cooltowarm = new Lut("cooltowarm", 512); // options are rainbow, cooltowarm and blackbody

AFRAME.registerComponent('beam_upper', {
    schema: {
        length: { type: 'number', default: params_upper.length },
        height: { type: 'number', default: params_upper.height },
        depth: { type: 'number', default: params_upper.depth },
        applied_displacement: { type: 'number', default: params_upper.displacement.y },
        load_position: { type: 'number', default: params_upper.load_position },
        colour_by: { type: 'number', default: params_upper.colour_by },

    },

    /**
     * Initial creation and setting of the mesh.
     */
    init: function() {
        var data = this.data;
        var el = this.el;

        this.data['load_positionMin'] =2
        this.data['load_positionMax'] = data.length -2

        // Create geometry.
        this.geometry = new THREE.BoxBufferGeometry(1, 1, 1, params_upper.np, 1, 1);

        // Create material.
        this.material = new THREE.MeshStandardMaterial({ color: 0xcccccc, vertexColors: true });

        // Create mesh.
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        
        this.mesh.scale.set(data.length, data.height, data.depth);
        this.mesh.position.add(beam_upper_offset); // move the beam away from the start location
        // this.mesh.position.add(beam_offset); // move the beam away from the start location

        const type = 'beam_upper';
        this.mesh.userData.type = type; // this sets up interaction group for controllers

        PHYSICS_UPPER.set_initial_position_upper(this.mesh.geometry.attributes.position.array);
        // Set mesh on entity.
        el.setObject3D('mesh', this.mesh);
    },
    update: function() {
        var data = this.data;
        data.applied_displacement = data.applied_displacement>0?data.applied_displacement:0
        data.load_position = data.load_position>2?data.load_position:2

        this.mesh.scale.set(data.length, data.height, data.depth);
        this.data['load_positionMax'] = data.length -2;
        params_upper.length = data.length
        params_upper.height = data.height
        params_upper.depth = data.depth
        params_upper.load_position = data.load_position
        params_upper.displacement.y = data.applied_displacement

        PHYSICS_UPPER.updateDeformation_upper(params_upper);
        this.mesh.geometry.setAttribute('position', new THREE.BufferAttribute(PHYSICS_UPPER.positions_upper, 3));
        this.mesh.geometry.attributes.position.needsUpdate = true;

        if (data.colour_by === 0) {
            let colors = [];
            for (let i = 0; i < PHYSICS_UPPER.shear_force_upper.length; i++) {
                colors.push(1, 1, 1);
            }

            this.mesh.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
            this.mesh.geometry.attributes.color.needsUpdate = true;
            this.mesh.material.needsUpdate = true;
        } else {
            let arr, max_val;
            if (data.colour_by === 1) {
                arr = PHYSICS_UPPER.bending_moment_upper;
                lut = cooltowarm;
                max_val = PHYSICS_UPPER.M_max_upper;
            } else if (data.colour_by === 2) {
                arr = PHYSICS_UPPER.shear_force_upper;
                lut = cooltowarm;
                max_val = PHYSICS_UPPER.SF_max_upper;
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

});