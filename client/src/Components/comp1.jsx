

import React, {useState, useRef, useEffect} from 'react';

import Module_draw_2dplot from "../Functions/module_draw_2dplot";

function Comp1(props) {

    let dataset = props.dataset

    let comp1_width = props.comp1_width
    let comp1_height = props.comp1_height
    let comp1_left=props.comp1_left
    let comp1_top=props.comp1_top
    let {class_color} = props


    // 定义新的measure
    let svg_width = comp1_width*0.9
    let svg_height = comp1_height*0.9



    return (

        <div className={'component'}
            style={{width: comp1_width, height:comp1_height, left:comp1_left, top: comp1_top}}>
            <span className="comp_title">Original Data</span>

            {/*svg for one 2dplot*/}
            <svg id={'comp1_dataShow'} width={svg_width} height={svg_height}>

                {/* g for scatter plot*/}
                <Module_draw_2dplot
                    dataset={dataset}
                    class_color={class_color}
                    boundary={null}
                    mode={'medium'}
                    translate={[5, 0]} /*module这个g在svg元素里的位置*/
                    module_name={'comp1_2dplot'} /*module这个g的名字*/
                    isLegend={true}
                >
                </Module_draw_2dplot>
            </svg>


        </div>


    );
}

export default Comp1