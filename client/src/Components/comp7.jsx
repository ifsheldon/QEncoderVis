import React, { useEffect } from 'react';
import * as d3 from 'd3';

function Comp7(props) {
    // dataset
    let comp7_width = props.comp7_width;
    let comp7_height = props.comp7_height;
    let comp7_left = props.comp7_left;
    let comp7_top = props.comp7_top;


    // Colors
    const [class_color, color_comp7_bg] = props.colors;

    //////////////////////////////////////////////
    // Mount the component once
    useEffect(() => {


    }, []);

    //////////////////////////////////////////////

    return (
        <div className={'component comp7'} style={{width: comp7_width, height: comp7_height, left: comp7_left, top: comp7_top,}}>
            <span className="comp_title">Quantum Distribution Map</span>
            <svg id={'comp7'} width={comp7_width} height={comp7_height} style={{ marginTop: '10px' }}>
                <rect
                    x={0}
                    y={0}
                    width={comp7_width}
                    height={comp7_height}
                    fill={color_comp7_bg}
                    rx="10"
                    ry="10"
                />
            </svg>
        </div>
    );
}

export default Comp7;
