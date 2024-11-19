
import React, {useState, useRef, useEffect} from 'react';
import * as d3 from 'd3'

import Module_draw_2dplot from "../Functions/module_draw_2dplot";

function Comp4(props) {

    // dataset
    let dataset = props.dataset
    let boundary=props.boundary


    let {comp4_width, comp4_height, comp4_left, comp4_top} = props
    let [class_color, color_comp4_bg] = props.colors



    // 定义新的measure
    let svg_width = comp4_width*0.9
    let svg_height = comp4_height*0.8





    //////////////////////////////////////////////

    // mount 的时候渲染一次
    useEffect(() => {


        let svg = d3.select("#comp4");
        let margin = { top: 15, left:40, bottom: 15, right: 40 };
        let width = +svg.attr("width") - margin.left - margin.right;
        let height = +svg.attr("height")  - margin.top - margin.bottom;



    }, [])




    return (

        <div className={'component comp4'}
             style={{width: comp4_width, height:comp4_height, left:comp4_left, top: comp4_top}}>
            <span className="comp_title">Encoder Map</span>
            {/*svg for one 2dplot*/}
            <svg id={'comp4'} width={svg_width} height={svg_height} >

                {/* g for scatter plot*/}
                <Module_draw_2dplot
                    dataset={dataset}
                    boundary={boundary}
                    mode={'large'}
                    translate={[0, 0]} /*module这个g在svg元素里的位置*/
                    module_name={'comp4_2dplot'} /*module这个g的名字*/
                    class_color={class_color}
                >
                </Module_draw_2dplot>


            </svg>

        </div>


    );
}

export default Comp4