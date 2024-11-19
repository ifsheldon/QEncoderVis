
import React, {useState, useRef, useEffect} from 'react';
import * as d3 from 'd3'
import axios, {post} from "axios";


function Module_draw_performance(props) {

    // data
    let dataset = props.dataset

    const divRef = useRef(null);


    //////////////////////////////////////////////

    // mount 的时候渲染一次
    useEffect(() => {

        draw_func()

    }, [])



    function draw_func(){

        console.log(dataset)

    }



    return (

        <g ref={divRef}>123</g>
    );
}

export default Module_draw_performance