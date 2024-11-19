
import React, {useState, useRef, useEffect} from 'react';
import * as d3 from 'd3'

import Module_draw_performance from "../Functions/module_draw_performance";


function Comp5(props) {

    // dataset
    let dataset = props.dataset


    let {comp5_width, comp5_height, comp5_left, comp5_top} = props
    let [class_color, color_comp5_bg] = props.colors


    // 定义新的measure
    let svg_width = comp5_width*0.9
    let svg_height = comp5_height*0.8




    //////////////////////////////////////////////

    // mount 的时候渲染一次
    useEffect(() => {


        let svg = d3.select("#comp5");
        let margin = { top: 15, left:40, bottom: 15, right: 40 };
        let width = +svg.attr("width") - margin.left - margin.right;
        let height = +svg.attr("height")  - margin.top - margin.bottom;



    }, [])




    return (

        <div className={'component comp5'}
             style={{width: comp5_width, height:comp5_height, left:comp5_left, top: comp5_top}}>
            <span className="comp_title">Performance</span>
            {/*svg for one 2dplot*/}
            <svg id={'comp5'} width={svg_width} height={svg_height} >
                <rect x={0} y={0} width={svg_width} height={svg_height} fill={color_comp5_bg} rx="10" ry="10" />

                    <Module_draw_performance
                        dataset={dataset}
                    ></Module_draw_performance>

            </svg>

        </div>


    );
}

export default Comp5