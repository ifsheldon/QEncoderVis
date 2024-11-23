
import React, {useState, useRef, useEffect} from 'react';
import * as d3 from 'd3'

import Module_draw_2dplot from "../Functions/module_draw_2dplot";

function Comp6(props) {

    // dataset
    let dataset = props.dataset


    let comp6_width = props.comp6_width
    let comp6_height = props.comp6_height
    let comp6_left=props.comp6_left
    let comp6_top=props.comp6_top

    let g1_top = 65
    let g2_top = 115

    const [class_color, color_comp6_bg] = props.colors;


    // 定义新的measure
    let svg_width = comp6_width*0.9
    let svg_height = comp6_height*0.8
    const margin = { top: 15, left: 40, bottom: 15, right: 40 };
    let dx =105
    let border_r = 39






    let [symbol_positions, set_symbol_positions] = useState(null)

    let [isFinished, set_isFinished] = useState(false)

    // function func_loading(step_number){
    //     if (step_number*2 == d3.selectAll('.loading_count').size()){
    //         set_isFinished(true)
    //     }
    // }




    let svg = d3.select("#comp6");

    // console.log(dataset)


    //////////////////////////////////////////////

    // mount 的时候渲染一次
    useEffect(() => {


        // get the position of every gate symbol in comp3
        let symbol_positions = []
        d3.selectAll('.symbol_position')
            .each(function() {
                let cx = d3.select(this).attr("cx"); // Get the 'cx' attribute
                symbol_positions.push(cx); // Push the value into the array
            });

        set_symbol_positions([...new Set(symbol_positions.map(Number))].sort((a, b) => a - b))



    }, [])




    return (

        <div className={'component comp6'}
             style={{width: comp6_width, height:comp6_height, left:comp6_left, top: comp6_top}}>
            {/*<span className="comp_title"></span>*/}
            {/*svg for one 2dplot*/}
            <svg id={'comp6'} width={svg_width} height={svg_height} style={{ marginTop: '10px' }}>
                <rect x={0} y={0} width={svg_width} height={svg_height} fill={'none'} style={{stroke: 'color_comp6_bg'}} rx="10" ry="10" />


                {symbol_positions?
                    symbol_positions.map((symbol_position,i)=>{

                        // console.log(symbol_position)

                        return <g key={i}>
                            <Module_draw_2dplot
                                dataset={dataset[i]}
                                boundary={null}
                                mode={'smaller'}
                                translate={[margin.left+symbol_position-dx, margin.top]} // Position of the module
                                module_name={`comp6_encoder_step_${i}`}
                                class_color={class_color}
                                isLegend={false}
                            >
                            </Module_draw_2dplot>
                            <rect
                                x={margin.left+symbol_position-dx+4}
                                y={margin.top+3}
                                width={border_r}
                                height={border_r}
                                strokeWidth={2} // Border width
                                className={`encoder-step-border`}
                                rx={'2px'}
                                ry={'2px'}
                            ></rect>
                        </g>
                    }):<div>Loading...</div>
                }

                {symbol_positions?
                    symbol_positions.map((symbol_position,i)=>{

                        // console.log(symbol_position)

                        return <g key={i}>
                            <Module_draw_2dplot
                                dataset={dataset[i]}
                                boundary={null}
                                mode={'smaller'}
                                translate={[margin.left+symbol_position-dx, margin.top+g1_top]} // Position of the module
                                module_name={`comp6_encoder_step_sub_${i}`}
                                class_color={class_color}
                                isLegend={false}>
                            </Module_draw_2dplot>
                            <rect
                                x={margin.left+symbol_position-dx+4}
                                y={margin.top+g1_top+3}
                                width={border_r}
                                height={border_r}
                                strokeWidth={1.5} // Border width
                                className={`encoder-step-sub-border`}
                                rx={'2px'}
                                ry={'2px'}
                            />
                        </g>
                    }):<div>Loading...</div>
                }


                {symbol_positions?
                    symbol_positions.map((symbol_position,i)=>{

                        // console.log(symbol_position)

                        return <g key={i}>
                            <Module_draw_2dplot
                                dataset={dataset[i]}
                                boundary={null}
                                mode={'smaller'}
                                translate={[margin.left+symbol_position-dx, margin.top+g2_top]} // Position of the module
                                module_name={`comp6_encoder_step_sub_sub_${i}`}
                                class_color={class_color}
                                isLegend={false}>
                            </Module_draw_2dplot>
                            <rect
                                x={margin.left+symbol_position-dx+4}
                                y={margin.top+g2_top+3}
                                width={border_r}
                                height={border_r}
                                strokeWidth={1.5} // Border width
                                className={`encoder-step-sub-border`}
                                rx={'2px'}
                                ry={'2px'}
                            />
                        </g>
                    }):<div>Loading...</div>
                }


            </svg>


        </div>


    );
}

export default Comp6