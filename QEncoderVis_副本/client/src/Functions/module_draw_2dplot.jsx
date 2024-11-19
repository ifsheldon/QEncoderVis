
import React, {useState, useRef, useEffect} from 'react';
import * as d3 from 'd3'
import {  Layout, Tooltip } from 'antd';
import axios, {post} from "axios";


function Module_draw_2dplot(props) {

    // data
    let dataset = props.dataset
    let boundary=props.boundary || null

    let {mode, module_name, translate, class_color} = props





    const divRef = useRef(null);

    let [color_class1, color_class2] = class_color




    //////////////////////////////////////////////

    // mount 的时候渲染一次
    useEffect(() => {

        draw_func()

    }, [])



    function draw_func(){


        // 先给组件的根结点div给className + 移位
        d3.select(divRef.current).attr('class', `${module_name}`)
            .attr('transform', `translate(${translate[0]}, ${translate[1]})`)


        // Tooltip setup
        const tooltip = d3.select('body').append('div')
            .attr('class', 'view1_tooltip')
            .style('position', 'absolute')
            .style('background-color', '#212121')
            .style('color', 'white')
            .style('padding', '6px')
            .style('border-radius', '5px')
            .style('text-align', 'center')
            .style('display', 'none')
            .style('font-size', '0.9em')




        // define measures here
        let largeSize = 1350, mediumSize = 950, smallSize = 320
        let size = mode=='large'? largeSize: (mode=='medium'? mediumSize : smallSize)



        let axis_length = size*0.15
        let g_paddingLeft = mode!=='small'?size*0.027: 0, g_paddingTop =  mode!=='small'?size*0.02: 0
        let axis_size = size*0.01
        let dot_stroke_width = mode!=='small'?size*0.001: 0
        let dot_radius = mode!=='small'?size*0.003: size*0.004
        let legend_width = size*0.1
        let legend_height = size*0.018
        let legend_dot_r = size*0.004
        let legend_dot_and_text_gap = size*0.015
        let legend_fontSize = '0.85em'



        let slit = 0.004
        let color_scatterPlotBg = '#e9f2f6'



        // data preparation
        let features = dataset['feature']
        let labels = dataset['label']

        let data = features.map((feature, i) => ({
            feature,
            label: labels[i]
        }));



        let xScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.feature[0]), d3.max(data, d => d.feature[0])])  // Assuming feature[0] is the x-value
            .range([0, axis_length]);


        let yScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.feature[1]), d3.max(data, d => d.feature[1])])  // Assuming feature[1] is the y-value
            .range([axis_length, 0])

        let colorScale = d3.scaleLinear()
            .domain([-1, 1])
            .range([color_class1, color_class2])


        let g = d3.select(`.${module_name}`)
            .append("g")
            .attr("transform", `translate(${g_paddingLeft},${g_paddingTop})`)



        const gridSize = (axis_length+axis_size+axis_size) / 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                g.append("rect")
                    .attr("x", i * gridSize-axis_size)
                    .attr("y", j * gridSize-axis_size)
                    .attr("width", gridSize-slit/2)
                    .attr("height", gridSize-slit/2)
                    .attr("fill", color_scatterPlotBg)
                    .attr('class', 'background_grid')

            }
        }


        let xAxis = d3.axisBottom(xScale).tickValues([0.0, 0.2, 0.4, 0.6, 0.8, 1.0]).tickSize(0)
        let yAxis = d3.axisLeft(yScale).tickValues([0.0, 0.2, 0.4, 0.6, 0.8, 1.0]).tickSize(0)


        if(mode!=='small'){
            g.append("g")
                .attr("transform", `translate(0,${axis_length+axis_size})`)
                .attr('class', 'axis')
                .call(xAxis)

            g.append("g")
                .attr("transform", `translate(${-axis_size}, 0)`)
                .attr('class', 'axis')
                .call(yAxis)
        }





        let dot = g.selectAll(".dot")
            .data(data)
            .enter().append("circle")

            dot.attr("class", "dot")
            .attr("r", dot_radius)
            .attr("cx", d => xScale(d.feature[0]))
            .attr("cy", d => yScale(d.feature[1]))
            // .attr("fill", d => d.label === 1 ? color_class1 : color_class2)  // Assuming only two labels 1 and 0
            .attr("fill", d =>colorScale(d['label']))  // Assuming only two labels 1 and 0
            .attr("stroke", "#ffffff")
            .attr("stroke-width", dot_stroke_width)



        // 如果要画boundary的线
        if(boundary){
            // console.log(boundary);

            boundary.forEach((region, index) => {
                // Create a line generator
                const lineGenerator = d3.line()
                    .x(d => xScale(d[0]))  // Assuming d[0] is the x-coordinate
                    .y(d => yScale(d[1]))  // Assuming d[1] is the y-coordinate
                    .curve(d3.curveBasis); // This creates a smooth curve. You can change it to d3.curveLinear for straight lines

                // Add the path for each region
                g.append('path')
                    .datum(region) // Bind the region data to the path element
                    .attr('d', lineGenerator)
                    .attr('stroke-width', 2)
                    .attr('stroke-dasharray', '8,4') // This makes the line dotted
                    .attr('class', `boundary-line region-${index}`); // A class to uniquely identify each region line if needed
            });
        }



        // 加legend
        if(mode!='small'){

            let isContinuous = dataset['label'].every(value => value === -1 || value === 1)


        // 如果value全是 -1或1
            if(isContinuous){
                const legend = g.append('g')
                    .attr('class', `${module_name}-legend`)
                    .attr('transform', `translate(${axis_size+g_paddingLeft+axis_length - legend_width}, ${axis_length + axis_size+g_paddingTop})`);

                // Data for the legend
                const legendData = [
                    { color: color_class1, text: 'Class A', class: -1 },
                    { color: color_class2, text: 'Class B', class: 1 }
                ];

                // Create a group for each legend item
                const legendItem = legend.selectAll('.legend-item')
                    .data(legendData)
                    .enter().append('g')
                    .attr('class', 'legend-item')
                    .attr('transform', (d, i) => `translate(0, ${i * legend_height})`);

                // Draw circles for each legend item
                legendItem.append('circle')
                    .attr('r', legend_dot_r)
                    .attr('cx', legend_dot_r)
                    .attr('cy', legend_height / 2)
                    .style('fill', d => d.color);

                // Add text labels for each legend item
                legendItem.append('text')
                    .attr('x', 2 * legend_dot_r + legend_dot_and_text_gap) // Small gap after the circle
                    .attr('y', legend_height / 2)
                    .attr('dy', '0.35em') // Center text vertically
                    .text(d => d.text)
                    .style('font-size', legend_fontSize);

            }


        //     如果value是从-1到1的连续的值
            else {
                const legend = g.append('g')
                    .attr('class', `${module_name}-legend`)
                    .attr('transform', `translate(${axis_size + g_paddingLeft + axis_length - legend_width*1.4}, ${axis_length + axis_size + g_paddingTop-5})`);

                // Create gradient for the color scale
                const gradient = legend.append('defs')
                    .append('linearGradient')
                    .attr('id', 'gradient-color')
                    .attr('x1', '0%')
                    .attr('x2', '100%')
                    .attr('y1', '0%')
                    .attr('y2', '0%');

                gradient.append('stop')
                    .attr('offset', '0%')
                    .attr('stop-color', color_class1);

                gradient.append('stop')
                    .attr('offset', '100%')
                    .attr('stop-color', color_class2);

                // Append the color bar for the gradient
                const colorBarLength = legend_width *0.6; // Adjust length as needed
                const colorBarHeight = legend_height*0.45; // Adjust height as needed

                legend.append('rect')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', colorBarLength)
                    .attr('height', colorBarHeight)
                    .style('fill', 'url(#gradient-color)');

                // Append text for class A (-1)
                legend.append('text')
                    .attr('x', -5) // Adjust the position as needed
                    .attr('y', colorBarHeight / 2)
                    .attr('dy', '0.35em')
                    .attr('text-anchor', 'end')
                    .style('font-size', legend_fontSize)
                    .text('Class A (-1)')


                // Append text for class B (+1)
                legend.append('text')
                    .attr('x', colorBarLength + 6) // Adjust the position as needed
                    .attr('y', colorBarHeight / 2)
                    .attr('dy', '0.35em')
                    .attr('text-anchor', 'start')
                    .style('font-size', legend_fontSize)
                    .text('Class B (+1)');
            }


        }




        // 加交互
        if(mode!='small'){
            dot.style("cursor", "pointer")  // 只有large时有对每个dot的交互
                .on('mouseover', function(event, d) {
                tooltip
                    .style('display', 'block');

                tooltip.html(`X: ${d.feature[0]} Y: ${d.feature[1]}<br/>Value: ${d.label.toFixed(3)}`)
                    .style('left', `${event.pageX + 10}px`)
                    .style('top', `${event.pageY + 10}px`);


            d3.select(this)
                .transition()  // Start a transition
                .duration(150)
                .attr("r", dot_radius+3)
                .attr("stroke-width", dot_stroke_width+1)
                .style('z-index', 999)
            })
                .on('mouseout', () => {
                    tooltip.style('display', 'none');

                    d3.selectAll(`.${module_name} .dot`)
                        .transition()  // Start a transition
                        .duration(100)
                        .attr("r", dot_radius)
                        .attr("stroke-width", dot_stroke_width)

                });
        }


    }



    return (

    <g ref={divRef}></g>
    );
}

export default Module_draw_2dplot