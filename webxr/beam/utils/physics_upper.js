export let positions_upper, shear_force_upper, bending_moment_upper;
let initial_positions;
let EI;
export let P, P_max;
export let M_max_upper = 0;
export let SF_max_upper = 0;
export let max_displacement = 0.5;

export function set_initial_position_upper(p) {
    positions_upper = p.map((x) => x); // deep copy
    initial_positions = p;
}

export function updateDeformation_upper(params) {
    let l = params.length;
    let a = params.load_position; // distance from left to load point
    let b = l - a; // distance from right to load point

        EI = 1;
        if ((params.left === 'Pin') && (params.right === 'Pin')) {
            P = (3 * params.displacement.y * l) / (a * a * b * b) || 0;
            P_max = (3 * max_displacement * l) / (a * a * b * b) || 0;
            M_max_upper = Math.abs(P_max * a * b / l);
            SF_max_upper = Math.max(P_max * b / l, P_max * a / l);
        } else if ((params.left === 'Fixed') && (params.right === 'Fixed')) {
            P = (3 * EI * l * l * l * params.displacement.y) / (a * a * a * b * b * b) || 0;
            P_max = (3 * EI * l * l * l * max_displacement) / (a * a * a * b * b * b) || 0;
            let R1 = P_max * b * b * (3 * a + b) / l / l / l;
            let R2 = P_max * a * a * (3 * b + a) / l / l / l;
            let M1 = P_max * a * b * b / l / l;
            let M2 = P_max * a * a * b / l / l;
            M_max_upper = Math.max(Math.abs(M1), Math.abs(M2));
            SF_max_upper = Math.max(Math.abs(R1), Math.abs(R2));
        } 
    

    //  from https://www.linsgroup.com/MECHANICAL_DESIGN/Beam/beam_formula.htm

    let deflection;
    bending_moment_upper = [];
    shear_force_upper = [];

    for (let i = 0; i < positions_upper.length / 3; i++) {
        let x = l * positions_upper[i * 3 + 0] + l / 2; // distance along beam

        if ((params.left === 'Pin') && (params.right === 'Pin')) {
            // SIMPLY SUPPORTED BEAM --- IMPLEMENTED AND WORKING
            if (x < a) {
                deflection = P * b * x * (l * l - b * b - x * x) / (6 * EI * l);
                bending_moment_upper.push(P * b * x / l);
                shear_force_upper.push(P * b / l);
            } else {
                deflection = P * a * (l - x) * (2 * l * x - x * x - a * a) / (6 * EI * l);
                bending_moment_upper.push(P * a / l * (l - x));
                shear_force_upper.push(-P * a / l);
            }
        } else if ((params.left === 'Fixed') && (params.right === 'Fixed')) {
            // IMPLEMENTED AND PROBABLY WORKING
            let R1 = P * b * b * (3 * a + b) / l / l / l;
            let R2 = P * a * a * (3 * b + a) / l / l / l;
            if (x < a) {
                deflection = P * b * b * x * x * (3 * a * l - 3 * a * x - b * x) / (6 * EI * l * l * l);
                bending_moment_upper.push(R1 * x - P * a * b * b / l / l);
                shear_force_upper.push(R1);
            } else {
                deflection = P * a * a * (l - x) * (l - x) * (3 * b * l - 3 * b * (l - x) - a * (l - x)) / (6 * EI * l * l * l);
                bending_moment_upper.push(R2 * (l - x) - P * a * a * b / l / l);
                shear_force_upper.push(-R2);
            }
        } 
        positions_upper[i * 3 + 1] = initial_positions[i * 3 + 1] - deflection*0.85;
        positions_upper[i * 3 + 2] = initial_positions[i * 3 + 2] - deflection/10;

    }
}
