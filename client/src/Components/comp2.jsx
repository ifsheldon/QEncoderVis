
import React, {useState, useRef, useEffect} from 'react';
import { Checkbox } from "antd";
import * as d3 from 'd3'

import Module_draw_2dplot from "../Functions/module_draw_2dplot";

function Comp2(props) {

    // dataset
    let dataset = props.dataset
    let boundary=props.boundary


    let {comp2_width, comp2_height, comp2_left, comp2_top, vis_width} = props
    let [class_color, color_comp2_bg] = props.colors
    let [color_class1, color_class2] = class_color



    let comp2_paddingLeft = vis_width*0.01
    let comp2_paddingTop = vis_width*0.01
    let comp2_dataOption_distanceX = vis_width*0.059
    let comp2_dataOption_distanceY = vis_width*0.06


    const [selectedDataOption, setSelectedDataOption] = useState(0);  // State to track the selected module
    // let {showBoundary, setShowBoundary} = useState('visible')


    function onChange(e){

        if(e.target.checked){
            d3.selectAll('.boundary-line')
                .style('visibility', 'hidden')
        }
        else{
            d3.selectAll('.boundary-line')
                .style('visibility', 'visible')
        }

    }


    //////////////////////////////////////////////

    // mount 的时候渲染一次
    useEffect(() => {


    }, [])




    return (

        <div  className={'component'}
              style={{width: comp2_width, height:comp2_height, left:comp2_left, top: comp2_top}}>
            <span className="comp_title">Data Selector</span>

            {/*svg for one data selector*/}
            <svg id="comp1_data_selector" width={comp2_width} height={comp2_height} style={{ marginTop: '10px' }}>
                <rect x={0} y={0} width={comp2_width} height={comp2_height} fill={color_comp2_bg} rx="10" ry="10" />

                <g transform={`translate(${comp2_paddingLeft}, ${comp2_paddingTop})`}>
                    {/* Iteration to generate 6 option datasets in a 2x3 grid */}
                    {Array.from({ length: 6 }, (_, i) => {

                        return (
                            <g transform={`translate(${i % 3 * comp2_dataOption_distanceX+4}, ${Math.floor(i / 3) * comp2_dataOption_distanceY+4})`}
                               className={selectedDataOption === i ? 'data-option-selected' : 'data-option-unselected'}
                               key={i}
                               onClick={() => setSelectedDataOption(i)}  // Set the selected module on click
                            >

                                <g>
                                    <Module_draw_2dplot
                                        dataset={dataset}
                                        boundary={null}
                                        mode={"small"}
                                        translate={[0, 0]} /*module这个g在svg元素里的位置*/
                                        class_color={[color_class1, color_class2]}
                                        module_name={`comp2_2dplot_${i + 1}`}
                                    />
                                </g>
                                <rect
                                    x={0}
                                    y={0}
                                    width={comp2_dataOption_distanceX-12}
                                    height={comp2_dataOption_distanceY-12}
                                    strokeWidth={2.3} // Border width
                                    className={`data-option-border`}
                                    rx={'2px'}
                                    ry={'2px'}
                                />
                            </g>

                        );
                    })}
                </g>
            </svg>
        </div>



    );
}

export default Comp2