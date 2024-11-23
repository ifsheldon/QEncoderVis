import React, {useState, useRef, useEffect} from 'react';
import { Checkbox } from "antd";
import * as d3 from 'd3';

import Module_draw_2dplot from "../Functions/module_draw_2dplot";

function Comp4(props) {

    let dataset = props.dataset
    let boundary = props.boundary

    const { comp4_width, comp4_height, comp4_left, comp4_top, colors } = props;
    const [class_color, color_comp4_bg] = colors;

    const [showBoundary, setShowBoundary] = useState(false);

    const margin = { top: 15, left: 40, bottom: 15, right: 40 };
    const svg_width = comp4_width - margin.left - margin.right;
    const svg_height = comp4_height - margin.top - margin.bottom;




    function onChange(e) {
        setShowBoundary(e.target.checked);
    }


    // Checkbox onChange event handler
    useEffect(() => {
        d3.selectAll('.boundary-line')
            .style('visibility', showBoundary ? 'visible' : 'hidden');
    }, [showBoundary]);




    return (
        <div className={'component comp4'}
             style={{width: comp4_width, height: comp4_height, left: comp4_left, top: comp4_top}}>
            <span className="comp_title">Encoder Map</span>
            <svg id={'comp4'} width={svg_width} height={svg_height}>
                <Module_draw_2dplot
                    dataset={dataset}
                    boundary={boundary}
                    mode={'large'}
                    translate={[0, 0]} // Position of the module
                    module_name={'comp4_2dplot'}
                    class_color={class_color}
                    isLegend={true}
                />
            </svg>
            <Checkbox onChange={onChange} checked={showBoundary} style={{marginLeft: '90px', marginTop:'8px'}}>Show boundary line</Checkbox>
        </div>
    );
}

export default Comp4;
